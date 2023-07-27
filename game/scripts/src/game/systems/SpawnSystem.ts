import { Logger } from '../../engine/Logger';
import { SystemBase } from '../../engine/Systems';
import { reloadable } from '../../utils/tstl-utils';
import type { UnitBase } from '../../engine/Unit';
import { DonkeyFish } from '../units/DonkeyFish';
import { getCenter, testPointIsWater } from '../Utils';
import { XNetTable } from '../modules/xnet-table';
import { DonkeyFish2 } from '../units/DonkeyFish2';

const logger = new Logger('SpawnSystem');

const randomChance = CreateUniformRandomStream(Time());

@reloadable
export class SpawnSystem extends SystemBase {
    minimum: number = 20;
    random: CScriptUniformRandomStream;
    units: UnitBase[] = [];

    Activate(params) {
        this.random = CreateUniformRandomStream(Time());
        this.StartIntervalThink(1);
        const listener = ListenToGameEvent(
            'entity_killed',
            async event => {
                for (let i = 0; i < this.units.length; i++) {
                    const unit = this.units[i];
                    const entity = await unit.GetEntity();
                    if (entity.GetEntityIndex() === event.entindex_killed) {
                        this.units.splice(i, 1);
                        break;
                    }
                }
            },
            this
        );

        return () => {
            this.units = [];
            StopListeningToGameEvent(listener);
        };
    }

    OnIntervalThink() {
        // 维持刷怪
        if (this.units.length < this.minimum) {
            // 找到一个是河道的点
            const origin = getCenter();
            const point = RandomVector(this.random.RandomFloat(500, 1500));
            const pos = (origin + point) as Vector;

            if (testPointIsWater(pos)) {
                const fish = this.random.RandomInt(0, 100) < 30 ? new DonkeyFish2() : new DonkeyFish();
                this.units.push(fish);
                fish.Spawn(pos, DotaTeam.BADGUYS).then(() => {
                    logger.debug('Spawned a fish', fish);
                });
            }
        }
    }
}
