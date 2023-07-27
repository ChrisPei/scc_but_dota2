import { Logger } from './Logger';
import { ModuleBase } from './Modules';
import { Signals } from './STL';

const logger = new Logger('Systems');

export type SystemBaseModifierCtor<T extends object = object> = new (params?: T) => SystemBase<T>;

export type AddSystemOptions = {
    annotation?: string;
    deactivate?: boolean;
};

let systemId = 0;

export abstract class SystemBase<T extends object = {}> {
    private id = ++systemId;

    constructor(protected readonly params: T) {}

    public get Id() {
        return this.id;
    }

    public get Standalone() {
        return false;
    }

    public get Name() {
        return this.constructor.name;
    }

    Activate(params: T): void | boolean | (() => void) {
        this.activated = true;
    }

    private activated = false;

    public MarkActivated() {
        this.activated = true;
    }

    private enabled = true;
    SetEnabled(enabled: boolean, activate?: boolean): void {
        this.enabled = enabled;
        if (this.enabled && activate && !this.activated) {
            this.activated = true;
            const disposer = this.Activate(this.params);
            if (disposer) {
                if (typeof disposer === 'function') {
                    this.OnDestroyed(disposer);
                } else if (disposer === true) {
                    return this.Destroy();
                }
            }
        }
    }

    public get IsEnabled(): boolean {
        return this.enabled;
    }

    private timer;
    public StartIntervalThink(interval: number) {
        if (this.timer) {
            Timers.RemoveTimer(this.timer);
        }
        this.timer = Timers.CreateTimer(interval, () => {
            try {
                if (this.IsEnabled) {
                    this.OnIntervalThink();
                }
            } catch (err) {
                Timers.CreateTimer(0, () => {
                    logger.warn('OnIntervalThink error');
                    throw err;
                });
            }
            return interval;
        });
    }

    protected OnIntervalThink(): void | Promise<void> {}

    public Destroy() {
        while (this.disposers.length > 0) {
            const disposer = this.disposers.pop();
            if (typeof disposer === 'function') {
                disposer();
            }
        }
        if (this.timer) {
            Timers.RemoveTimer(this.timer);
            this.timer = undefined;
        }
    }

    disposers: (() => void)[] = [];

    public OnDestroyed(disposer: () => void): void {
        this.disposers.push(disposer);
    }
}

export class Systems extends ModuleBase {
    private systems: {
        ctor: new (...args: any[]) => SystemBase;
        name: string;
        system: SystemBase;
        options: AddSystemOptions;
    }[] = [];

    public AddSystem<T extends SystemBase>(ctor: new (...args: any[]) => T, params?: any, opts?: AddSystemOptions): T {
        logger.debug('AddSystem', ctor.name, params, opts && json.encode(opts));
        const system = new ctor(params);
        system.SetEnabled(!opts?.deactivate);
        if (system.IsEnabled) {
            system.MarkActivated();
            const disposer = system.Activate(params);
            if (disposer) {
                if (typeof disposer === 'function') {
                    system.OnDestroyed(disposer);
                } else if (disposer === true) {
                    return;
                }
            }
        } else {
            system.OnDestroyed(() => {
                this.RemoveSystem(system);
            });
        }

        if (system) {
            Signals.Current.OnSystemAdded.Emit({
                system,
                opts,
            });
            this.systems.push({
                ctor,
                name: ctor.name,
                system,
                options: opts,
            });
        }
        return system;
    }

    public RemoveSystem(system: SystemBase | string | ((system: SystemBase) => boolean)) {
        if (typeof system === 'function') {
            for (let i = 0; i < this.systems.length; i++) {
                if (system(this.systems[i].system)) {
                    const removes = this.systems.splice(i, 1);
                    removes.forEach(item => {
                        const name = item.name;
                        item.system.Destroy();
                        logger.debug(`[${name}] removed!`);
                        Signals.Current.OnSystemRemoved.Emit({
                            id: item.system.Id,
                        });
                    });
                    i--;
                }
            }
        } else {
            const index =
                typeof system === 'string'
                    ? this.systems.findIndex(sys => sys.name === system)
                    : this.systems.findIndex(sys => sys.system === system);
            if (index !== -1) {
                const removes = this.systems.splice(index, 1);
                removes.forEach(item => {
                    const name = item.name;
                    item.system.Destroy();
                    logger.debug(`[${name}] removed!`);
                    Signals.Current.OnSystemRemoved.Emit({
                        id: item.system.Id,
                    });
                });
            }
        }
    }

    public GetSystem<T extends SystemBase>(id: number): T {
        return this.systems.find(sys => sys.system.Id === id).system as T;
    }

    public ForEachSystem(
        callback: (item: { ctor: new (...args: any[]) => SystemBase; name: string; system: SystemBase; options: AddSystemOptions }) => void
    ) {
        this.systems.forEach(callback);
    }
}
