import { ModuleBase } from './Modules';
import { Signal } from './Signal';
import type { AddSystemOptions, SystemBase } from './Systems';

export class Signals extends ModuleBase {
    private static current: Signals;
    public static get Current() {
        return Signals.current;
    }

    constructor() {
        super();
        Signals.current = this;
    }

    public readonly OnSystemAdded = new Signal<{
        system: SystemBase;
        opts?: AddSystemOptions;
    }>();
    public readonly OnSystemUpdated = new Signal<{
        system: SystemBase;
        opts?: AddSystemOptions;
    }>();
    public readonly OnSystemRemoved = new Signal<{
        id: number;
    }>();
    // public readonly OnUnitCreated = new Signal<UnitBase>();
    // public readonly OnUnitKilled = new Signal<ModifierInstanceEvent>();
}

export const STLModules = [Signals];
