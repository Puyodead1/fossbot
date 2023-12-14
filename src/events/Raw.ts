import { Events } from "discord.js";
import BaseClient from "../lib/BaseClient";
import BaseEvent from "../lib/BaseEvent";

export default class extends BaseEvent {
    constructor(public readonly client: BaseClient) {
        super({
            event: Events.Raw as any,
            once: true,
        });
    }

    public async execute(data: any): Promise<void> {
        console.debug(data);
    }
}
