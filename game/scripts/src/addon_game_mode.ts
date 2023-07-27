import 'utils/index';
import type { ModuleBase } from './engine/Modules';
import { ActivateModules } from './engine/Modules';
import { Logger } from './engine/Logger';
import { GameConfiguration } from './game/modules/GameConfiguration';
import { XNetTable } from './game/modules/xnet-table';
import { GameResources } from './game/modules/GameResources';
import { GamesStateController } from './game/modules/GamesStateController';
import { GameSystems } from './game/modules/GameSystems';
import { STLModules } from './engine/STL';

const logger = new Logger('GameMode');

declare global {
    interface CDOTAGameRules {
        Modules: {
            name;
            instance: ModuleBase;
        }[];
        // 声明所有的GameRules模块，这个主要是为了方便其他地方的引用（保证单例模式）
        XNetTable: XNetTable;
    }
}

ActivateModules(...STLModules, GameConfiguration, GameResources, GamesStateController, GameSystems);

Object.assign(getfenv(), {
    Activate: () => {
        logger.debug('Activate');

        if (GameRules.XNetTable == null) {
            // 初始化所有的GameRules模块
            GameRules.XNetTable = new XNetTable();
        }

        GameRules.Modules.forEach(({ instance }) => {
            instance.Activate();
        });
    },
    Precache: context => {
        logger.debug('Precache');
        GameRules.Modules.forEach(({ instance }) => {
            instance.Precache(context);
        });
    },
});

if (GameRules.Modules && GameRules.Modules['Initialized']) {
    logger.debug('Reload');
    GameRules.Modules.forEach(({ instance }) => {
        instance.Reload();
    });
}
GameRules.Modules['Initialized'] = true;
