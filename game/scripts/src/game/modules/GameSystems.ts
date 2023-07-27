import { Systems } from '../../engine/Systems';
import { SpawnSystem } from '../systems/SpawnSystem';
import { DevToolSystem } from '../systems/DevToolSystem';

export class GameSystems extends Systems {
    public Activate() {
        if (IsInToolsMode()) {
            this.AddSystem(DevToolSystem);
        }

        this.AddSystem(SpawnSystem);
    }
}
