import { BaseModifier, registerModifier } from '../../utils/dota_ts_adapter';
import { Logger } from '../../engine/Logger';
import { getCenter, testPointIsWater } from '../Utils';

const logger = new Logger('modifier_donkey_fish');

@registerModifier()
export class modifier_donkey_fish extends BaseModifier {
    IsHidden(): boolean {
        return false;
    }

    IsDebuff(): boolean {
        return true;
    }

    IsPurgable(): boolean {
        return false;
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.IGNORE_MOVESPEED_LIMIT, ModifierFunction.ON_DEATH];
    }

    OnDeath(event: ModifierInstanceEvent) {
        if (IsClient()) {
            return;
        }

        if (event.unit !== this.GetParent()) {
            return;
        }

        const effect_cast = ParticleManager.CreateParticle(
            'particles/units/heroes/hero_alchemist/alchemist_lasthit_coins.vpcf',
            ParticleAttachment.WORLDORIGIN,
            undefined
        );
        ParticleManager.SetParticleControl(effect_cast, 1, (event.unit.GetAbsOrigin() + Vector(0, 0, 100)) as Vector);
        ParticleManager.ReleaseParticleIndex(effect_cast);
        EmitSoundOn('General.Coins', this.GetCaster());

        if (event.attacker) {
            const playerController = event.attacker.GetPlayerOwner();
            if (playerController) {
                const level = this.GetAbility().GetLevel();
                logger.debug('level', level);
                playerController['FishingScore'] = (playerController['FishingScore'] ?? 0) + 1;
                GameRules.XNetTable.SetTableValue('scores', `p${playerController.GetPlayerID()}`, { score: playerController['FishingScore'] });
            }
        }
    }

    GetModifierIgnoreMovespeedLimit(): 0 | 1 {
        return 1;
    }

    CheckState() {
        return {
            [ModifierState.NO_HEALTH_BAR]: true,
            [ModifierState.NO_UNIT_COLLISION]: true,
        };
    }

    // radius = 500;
    // particleId;
    // timer;

    OnCreated(params: object) {
        if (IsClient()) {
            return;
        }

        this.StartIntervalThink(1);
    }

    target?: Vector;
    OnIntervalThink() {
        if (!this.GetParent().IsMoving()) {
            this.target = null;
        }

        if (!this.target) {
            const start = this.GetParent().GetAbsOrigin();
            const origin = getCenter();
            const toOrigin = (origin - start) as Vector;
            const distance = toOrigin.Length2D();

            const temp =
                distance > 2000
                    ? ((start + toOrigin.Normalized() * RandomFloat(300, 800)) as Vector)
                    : ((start + RandomVector(RandomFloat(300, 600))) as Vector);

            if (testPointIsWater(temp) && GridNav.CanFindPath(start, temp)) {
                this.target = temp;

                if (distance > 2000) {
                    DebugDrawLine(start, temp, 255, 0, 0, true, 3);
                }
            }
        }

        if (this.target) {
            ExecuteOrderFromTable({
                UnitIndex: this.GetParent().entindex(),
                OrderType: UnitOrder.MOVE_TO_POSITION,
                Position: this.target,
                Queue: false,
            });

            // DebugDrawLine(this.GetParent().GetAbsOrigin(), this.target, 200, 200, 200, true, 1);
        }
    }
    //
    // OnHeroCalculateStatBonus() {
    //     const context = this.GetReactionContext();
    //     // const area = context.GetValue(GameEffects.Area).Computed();
    // }
    //
    // PlayEffects() {
    //     const particleName = 'particles/units/heroes/hero_pudge/pudge_rot.vpcf';
    //     this.particleId = ParticleManager.CreateParticle(particleName, ParticleAttachment.ABSORIGIN_FOLLOW, this.GetParent());
    //
    //     ParticleManager.SetParticleControl(this.particleId, 1, Vector(this.radius, 0, 0));
    //     // CreateUnitByNameAsync(
    //     //     'npc_dummy',
    //     //     this.GetParent().GetAbsOrigin(),
    //     //     true,
    //     //     undefined,
    //     //     undefined,
    //     //     this.GetParent().GetTeamNumber(),
    //     //     (unit) => {
    //     //         unit.FollowEntity(this.GetParent(), false);
    //     //         unit.SetAbsOrigin(
    //     //             (this.GetParent().GetAbsOrigin() + Vector(0, 0, 5500)) as Vector
    //     //         );
    //     //         unit.AddNewModifier(
    //     //             this.GetParent(),
    //     //             undefined,
    //     //             modifier_weapon_pudge_dummy.name,
    //     //             {}
    //     //         );
    //     EmitSoundOn('Greevil.Rot', this.GetParent());
    //     // this.timer = Timers.CreateTimer(11, () => {
    //     //     EmitSoundOn('Greevil.Rot', this.GetParent());
    //     //     return 11;
    //     // });
    //     // }
    //     // );
    // }

    OnDestroy() {
        if (IsClient()) {
            return;
        }

        // Timers.RemoveTimer(this.timer);
        // ParticleManager.DestroyParticle(this.particleId, false);
        // ParticleManager.ReleaseParticleIndex(this.particleId);
    }
}
