import { Events } from "discord.js";
import BaseClient from "../lib/BaseClient";
import BaseEvent from "../lib/BaseEvent";

export default class extends BaseEvent {
    constructor(public readonly client: BaseClient) {
        super({
            event: Events.Debug,
            once: true, // just disable
        });
    }

    public async execute(msg: string): Promise<void> {
        console.debug(msg);
    }
}
