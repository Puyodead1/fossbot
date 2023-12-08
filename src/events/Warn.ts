import { Events } from "discord.js";
import BaseClient from "../lib/BaseClient";
import BaseEvent from "../lib/BaseEvent";

export default class extends BaseEvent {
    constructor(public readonly client: BaseClient) {
        super({
            event: Events.Warn,
            once: false,
        });
    }

    public async execute(msg: string): Promise<void> {
        console.warn(msg);
    }
}
