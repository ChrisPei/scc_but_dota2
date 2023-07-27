import type { UnitDefinition } from '../../engine/Unit';
import { UnitBase } from '../../engine/Unit';

export class DonkeyFish extends UnitBase {
    GetDefinition(): [UnitDefinition, string] {
        return [{}, 'donkey_fish'];
    }
}
