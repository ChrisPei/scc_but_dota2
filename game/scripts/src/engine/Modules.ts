import { Logger } from './Logger';
import { reloadable } from '../utils/tstl-utils';
import { Signals } from './STL';

const logger = new Logger('Modules');

if (GameRules.Modules == null) {
    GameRules.Modules = [];
}

export class ModuleBase {
    constructor(name?: string | boolean) {
        if (typeof name === 'string') {
            this.Name = name;
        } else if (name === true || name == null) {
            const name = this.constructor.name;
            if (name.startsWith('Game')) {
                this.Name = name.slice(4);
            } else {
                this.Name = name;
            }
        }
    }

    public readonly Name?: string;

    public Activate() {}

    public Precache(context: CScriptPrecacheContext) {}

    public Reload() {}
}

export function ActivateModules(...modules: (new () => ModuleBase)[]) {
    for (const module of modules) {
        reloadable(module);
        const exist = GameRules.Modules.find(m => m.name === module.name);
        if (!exist) {
            const instance = new module();
            logger.debug('Activate module', instance.constructor.name);
            GameRules.Modules.push({ name: module.name, instance });
            if (instance.Name) {
                if (GameRules[instance.Name] == null) {
                    GameRules[instance.Name] = instance;
                }
            }
        }
    }
}
