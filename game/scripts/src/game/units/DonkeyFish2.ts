import type { UnitDefinition } from '../../engine/Unit';
import { UnitBase } from '../../engine/Unit';

export class DonkeyFish2 extends UnitBase {
    GetDefinition(): [UnitDefinition, string] {
        return [{}, 'donkey_fish2'];
    }

    protected OnSpawned(unit: CDOTA_BaseNPC): CDOTA_BaseNPC | void {
        const count = unit.GetAbilityCount();
        for (let i = 0; i < count; i++) {
            const ability = unit.GetAbilityByIndex(i);
            if (ability) {
                ability.SetLevel(2);
            }
        }
        return unit;
    }
}
