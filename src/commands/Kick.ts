import { Message } from "discord.js";
import BaseClient from "../lib/BaseClient";
import BaseCommand, { CommandPermissionLevel } from "../lib/BaseCommand";

export default class extends BaseCommand {
    constructor(public readonly client: BaseClient) {
        super({
            name: "kick",
            description: "Kick a user from the server",
            permissionLevel: CommandPermissionLevel.Moderator,
            guildOnly: true,
        });
    }

    public async execute(msg: Message, args: string[]): Promise<any> {
        if (args.length < 1) return await msg.channel.send("You must provide a user to kick.");
        const member = msg.guild!.members.cache.get(args[0]);
        if (!member) return await msg.channel.send("Invalid member.");
        if (!member.kickable) return await msg.channel.send("I cannot kick this user.");
        return await msg.channel.send("ok");
    }
}
