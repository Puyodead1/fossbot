import { Message } from "discord.js";
import BaseClient from "../lib/BaseClient";
import BaseCommand from "../lib/BaseCommand";

export default class extends BaseCommand {
    constructor(public readonly client: BaseClient) {
        super({
            name: "ping",
            description: "Ping!",
        });
    }
    public async execute(msg: Message): Promise<any> {
        await msg.channel.send("Pong!");
    }
}
