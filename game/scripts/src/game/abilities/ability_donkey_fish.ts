import { BaseAbility, registerAbility } from '../../utils/dota_ts_adapter';
import { modifier_donkey_fish } from '../modifiers/modifier_donkey_fish';

@registerAbility()
export class ability_donkey_fish extends BaseAbility {
    GetIntrinsicModifierName(): string {
        return modifier_donkey_fish.name;
    }
}
