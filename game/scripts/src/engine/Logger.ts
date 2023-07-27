export class Logger {
    private static VerboseEnabledMap: Map<string, boolean> = new Map();
    public static SwitchVerbose(module: string, enable?: boolean) {
        this.VerboseEnabledMap.set(module, enable);
    }

    public static IsVerboseEnabled(module: string) {
        if (this.VerboseEnabledMap.get('*')) {
            return true;
        }
        return this.VerboseEnabledMap.get(module);
    }

    public static ListVerboseEnabled() {
        if (this.VerboseEnabledMap.get('*')) {
            print('* All verbose enabled');
        }
        for (const [key, value] of this.VerboseEnabledMap) {
            logger.print('D', `[${value ? '*' : ' '}]`, key);
        }
    }

    constructor(public readonly module: string, enableVerbose?: boolean) {
        if (enableVerbose) {
            Logger.SwitchVerbose(module, true);
        }
    }

    private renderGameTime() {
        const time = GameRules.GetGameTime();
        const ms = Math.floor((time - Math.floor(time)) * 1000);
        const s = Math.floor(time) % 60;
        const m = Math.floor(time / 60) % 60;
        const h = Math.floor(time / 3600);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${Math.floor(s)
            .toString()
            .padStart(2, '0')}.${Math.floor(ms).toString().padStart(3, '0')}`.padEnd(12);
    }

    print(type, ...args) {
        print(
            [
                [
                    `${IsServer() ? 'S' : 'C'}|${type}`,
                    this.renderGameTime(),
                    `[${this.module}]`.padEnd(20),
                ].join(' ') + ' |',
                ...args,
            ].join(' ')
        );
    }

    debug(...args) {
        if (IsInToolsMode()) {
            this.print('D', ...args);
        }
    }

    log(...args) {
        this.print('I', ...args);
    }

    warn(...args) {
        this.print('W', ...args);
    }

    verbose(...args) {
        if (IsInToolsMode()) {
            if (Logger.IsVerboseEnabled(this.module)) {
                this.print('V', ...args);
            }
        }
    }
}

const logger = new Logger('Logger');
