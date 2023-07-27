import { ModuleBase } from './Modules';

export class Signal<T = any> {
    listeners: { listener: (args: T) => void; context; once }[] = [];
    // 信号
    public On(listener: (args: T) => void, context?) {
        const data = {
            listener,
            context,
            once: false,
        };
        this.listeners.push(data);
        return () => {
            const index = this.listeners.findIndex(list => {
                return list === data;
            });
            if (index >= 0) {
                this.listeners.splice(0, 1);
            }
        };
    }

    public Once(listener: (args: T) => void, context?) {
        const data = {
            listener,
            context,
            once: true,
        };
        this.listeners.push(data);
        return () => {
            const index = this.listeners.findIndex(list => {
                return list === data;
            });
            if (index >= 0) {
                this.listeners.splice(0, 1);
            }
        };
    }

    public Off(context) {
        const index = this.listeners.findIndex(list => {
            return list.context === context;
        });
        if (index >= 0) {
            this.listeners.splice(0, 1);
        }
    }

    public Emit(args: T) {
        for (let i = 0; i < this.listeners.length; i++) {
            const data = this.listeners[i];
            data.listener.call(data.context, args);
            if (data.once) {
                this.listeners.splice(i, 1);
                i--;
            }
        }
    }

    public Clear() {
        this.listeners.slice(0, this.listeners.length);
    }
}
