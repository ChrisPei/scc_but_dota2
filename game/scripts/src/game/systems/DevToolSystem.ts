// import { Skeleton } from '../units/Skeleton';

import { Logger } from '../../engine/Logger';
import { reloadable } from '../../utils/tstl-utils';
import { SystemBase } from '../../engine/Systems';

const logger = new Logger('DevTool');

@reloadable
export class DevToolSystem extends SystemBase<{ test: boolean }> {
    public RegisterCommands() {
        logger.debug('RegisterCommands');
    }

    Activate(params: { test: boolean }): true | void | (() => void) {
        if (!IsInToolsMode()) {
            return;
        }

        Convars.RegisterCommand(
            'logger_switch_verbose',
            (name, ...args) => {
                for (const arg of args) {
                    const [key, value] = arg.split('=');
                    Logger.SwitchVerbose(key, value == null || (value != 'false' && value != '0'));
                    logger.print('D', `verbose "${key}" -> ${Logger.IsVerboseEnabled(key)}`);
                }
            },
            '',
            0
        );

        Convars.RegisterCommand(
            'logger_get_verbose',
            (name, ...args) => {
                for (const arg of args) {
                    const value = Logger.IsVerboseEnabled(arg) ?? 'nil';
                    logger.print('D', `[${value ? '*' : ' '}] ${arg}`);
                }
            },
            '',
            0
        );

        Convars.RegisterCommand(
            'logger_list_verbose',
            (name, ...args) => {
                Logger.ListVerboseEnabled();
            },
            '',
            0
        );

        logger.debug('CallDevCommand', params && json.encode(params));

        this.RegisterCommands();
        const CallDevCommand = CustomGameEventManager.RegisterListener('devCommand', (source, args) => {
            logger.debug('on DevCommand', args.type);
            if (args.type === 'restart') {
                SendToServerConsole('restart');
            } else if (args.type === 'script_reload') {
                SendToServerConsole('script_reload');
            }
        });

        return () => {
            CustomGameEventManager.UnregisterListener(CallDevCommand);
        };
    }
}
