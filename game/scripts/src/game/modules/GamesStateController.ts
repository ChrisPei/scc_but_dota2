import { ModuleBase } from '../../engine/Modules';
import { Logger } from '../../engine/Logger';

declare global {
    interface CDOTAGameRules {
        StateController: GamesStateController;
    }
}

const logger = new Logger('GamesStateController');

export class GamesStateController extends ModuleBase {
    Activate() {
        //注册通用游戏事件，转化成内部处理回调
        ListenToGameEvent(
            'game_rules_state_change',
            event => {
                const state = GameRules.State_Get();
                logger.debug('game_rules_state_change', state);
                switch (state) {
                    case GameState.INIT:
                        // this.onGameInit();
                        break;
                    case GameState.WAIT_FOR_PLAYERS_TO_LOAD:
                        // this.onGameWaitForPlayersToLoad();
                        break;
                    case GameState.CUSTOM_GAME_SETUP:
                        this.OnGameCustomGameSetup();
                        break;
                    case GameState.HERO_SELECTION:
                        this.OnGameHeroSelection();
                        break;
                    case GameState.STRATEGY_TIME:
                        // this.onGameStrategyTime();
                        break;
                    case GameState.TEAM_SHOWCASE:
                        // this.onGameTeamShowcase();
                        break;
                    case GameState.WAIT_FOR_MAP_TO_LOAD:
                        // this.onGameWaitForMapToLoad();
                        break;
                    case GameState.PRE_GAME:
                        // this.onGamePreGame();
                        break;
                    case GameState.SCENARIO_SETUP:
                        // this.onGameScenarioSetup();
                        break;
                    case GameState.GAME_IN_PROGRESS:
                        this.OnGameInProgress();
                        break;
                    case GameState.POST_GAME:
                        // this.onGamePostGame();
                        break;
                    case GameState.DISCONNECT:
                        // this.onGameDisconnect();
                        break;
                }
            },
            this
        );
    }

    protected OnGameCustomGameSetup() {
        // TODO 达成特定条件后，开始游戏
        Timers.CreateTimer(0.1, () => {
            GameRules.FinishCustomGameSetup();
        });
    }

    protected OnGameHeroSelection() {
        for (let i = 0; i < DOTA_MAX_TEAM_PLAYERS; i++) {
            if (PlayerResource.IsValidPlayerID(i)) {
                PlayerResource.GetPlayer(i)?.SetTeam(DotaTeam.GOODGUYS);
            }
        }
    }

    protected OnGameInProgress() {
        // GameRules.Systems.AddSystem(StageSystem, { name: 'MadForest' });
        // GameRules.Systems.AddSystem(StageSystem, { name: 'MadForest' }, { deactivate: true });
        // SystemManager.AddSystem(TestSpawnSystem, {}, { reloadable: true });
        // for (let i = 0; i < 10; i++) {
        //     CreateUnitByNameAsync(
        //         'donkey_fish',
        //         (Vector(0, 0, 0) + RandomVector(300)) as Vector,
        //         true,
        //         undefined,
        //         undefined,
        //         DotaTeam.BADGUYS,
        //         unit => {}
        //     );
        // }

        Timers.CreateTimer(1, () => {
            for (let i = 0; i < DOTA_MAX_TEAM_PLAYERS; i++) {
                if (PlayerResource.IsValidPlayerID(i)) {
                    const hero = PlayerResource.GetPlayer(i)?.GetAssignedHero() as CDOTA_BaseNPC_Hero;
                    if (hero) {
                        const ability = hero.FindAbilityByName('pudge_meat_hook_scc');
                        if (ability) {
                            ability.SetLevel(ability.GetMaxLevel());
                        }
                    }
                }
            }
        });
    }
}
