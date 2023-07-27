import { Signals } from './STL';

export type UnitModel = {
    name: string;
    scale?: number;
    immediate?: boolean;
};

export type UnitDefinition = {
    name?: string;
    description?: string;
    type?: 'npc_dota_creature' | 'npc_dota_building';
    health?: number;
    attackDamage?: number;
    attackRate?: number;
    speed?: number;
    model?: UnitModel;
    particles?: (
        | string
        | {
              name: string;
              attachment?: ParticleAttachment;
              immediate?: boolean;
          }
    )[];
    drops?:
        | number
        | (
              | {
                    type: 'exp';
                    value: number;
                    rarity?: number;
                }
              | {
                    type: 'pickup';
                    value: [];
                    rarity?: number;
                }
          )[];
    precache?: ['particle' | 'soundfile' | 'particle_folder', string][];
    flyable?: boolean;
};

export abstract class UnitBase {
    public abstract GetDefinition(): [UnitDefinition, string?];

    public async GetEntity(): Promise<CDOTA_BaseNPC> {
        return this.entity ?? this.spawning;
    }

    protected OnSpawned(unit: CDOTA_BaseNPC): CDOTA_BaseNPC | void {
        return unit;
    }

    private entity?: CDOTA_BaseNPC;

    private eventId: EventListenerID | undefined;
    constructor() {
        this.eventId = ListenToGameEvent(
            'entity_killed',
            event => {
                const index = event.entindex_killed;
                if (this.entity && this.entity.entindex() === index) {
                    this.Destroy();
                }
            },
            this
        );
        this.spawning = new Promise<CDOTA_BaseNPC>((resolve, reject) => {
            this.spawningResolve = resolve;
            this.spawningReject = reject;
        });
        // Signals.Current.OnUnitCreated.Emit(this);
    }

    spawningResolve?: (unit: CDOTA_BaseNPC) => void;
    spawningReject?: (reason?: any) => void;
    spawning: Promise<CDOTA_BaseNPC>;
    particles: [
        ParticleID,
        {
            name: string;
            attachment?: ParticleAttachment;
            immediate?: boolean;
        }
    ][] = [];

    public get Particles() {
        return this.particles;
    }

    Spawn(origin: Vector, team?: DotaTeam) {
        const [definition, key] = this.GetDefinition();
        CreateUnitByNameAsync(key ?? 'npc_dummy', origin, true, undefined, undefined, team ?? DotaTeam.NEUTRALS, unit => {
            if (unit) {
                if (this.particles) {
                    this.particles.forEach(([particle, definition]) => {
                        ParticleManager.DestroyParticle(particle, definition.immediate);
                    });
                }
                if (definition.particles) {
                    this.particles = definition.particles.map(particle => {
                        const name = typeof particle !== 'string' ? particle.name : particle;
                        const attachment = (typeof particle !== 'string' ? particle.attachment : undefined) ?? ParticleAttachment.ABSORIGIN;
                        return [
                            ParticleManager.CreateParticle(name, attachment, unit),
                            {
                                name: particle,
                                attachment,
                                immediate: typeof particle !== 'string' ? particle.immediate : false,
                            },
                        ] as [
                            ParticleID,
                            {
                                name: string;
                                attachment?: ParticleAttachment;
                                immediate?: boolean;
                            }
                        ];
                    });
                }

                if (this.entity) {
                    this.entity.ForceKill(false);
                }

                // unit.AddAbility(ability_unit.name);

                const next = this.OnSpawned(unit);
                if (next) {
                    this.entity = next;
                } else {
                    this.entity = unit;
                }
                this.spawningResolve(this.entity);
            } else {
                this.spawningReject();
            }
        });
        return this.spawning;
    }

    Precache() {
        //
    }

    OnDestroy() {}

    public get IsValid() {
        return IsValidEntity(this.entity);
    }

    Destroy() {
        if (this.eventId) {
            StopListeningToGameEvent(this.eventId);
            this.eventId = undefined;
        }

        if (this.particles) {
            this.particles.forEach(([particle, definition]) => {
                ParticleManager.DestroyParticle(particle, definition.immediate);
                ParticleManager.ReleaseParticleIndex(particle);
            });
        }

        if (this.IsValid) {
            this.entity.ForceKill(false);
        }

        const [definition] = this.GetDefinition();
        if (definition?.model?.immediate) {
            this.entity.SetModelScale(0);
        }

        this.OnDestroy();
    }
}
