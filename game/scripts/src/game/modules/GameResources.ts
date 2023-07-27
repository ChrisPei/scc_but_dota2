import { ModuleBase } from '../../engine/Modules';
import { precacheEveryResourceInKV, precacheItems, precacheResource, precacheUnits } from '../../utils/precache';
import { Logger } from '../../engine/Logger';

const logger = new Logger('GameResources');

export class GameResources extends ModuleBase {
    Precache(context: CScriptPrecacheContext) {
        // 需要预载的所有资源
        precacheResource(
            [
                // '***.vpcf',
                'particles/units/heroes/hero_alchemist/alchemist_lasthit_coins.vpcf',
                'particles/econ/items/invoker/invoker_apex/invoker_sun_strike_team_blastup_immortal1.vpcf',
                'soundevents/soundevents_dota_ui.vsndevts',
                // 'soundevents/game_sounds_heroes/game_sounds_queenofpain.vsndevts',
                // '***.vmdl',
            ],
            context
        );
        // 需要预载入的kv文件，会自动解析KV文件中的所有vpcf资源等等
        precacheEveryResourceInKV(
            [
                // kv文件路径
                // 'npc_abilities_custom.txt',
            ],
            context
        );
        // 需要预载入的单位
        precacheUnits(
            [
                // 单位名称
                // 'npc_dota_hero_***',
            ],
            context
        );
        // 需要预载入的物品
        precacheItems(
            [
                // 物品名称
                // 'item_***',
            ],
            context
        );
        logger.log(`Precache finished.`);
    }
}
