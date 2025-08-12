import { Message } from "discord.js";
import BaseClient from "../lib/BaseClient";
import BaseCommand, { CommandPermissionLevel } from "../lib/BaseCommand";

export default class extends BaseCommand {
    constructor(public readonly client: BaseClient) {
        super({
            name: "unmute",
            description: "Unmutes a user.",
            permissionLevel: CommandPermissionLevel.Moderator,
            guildOnly: true,
            aliases: ["ungag"],
        });
    }

    public async execute(msg: Message, args: string[]): Promise<any> {
        if (!msg.channel.isSendable()) return;
        if (args.length < 1) return await msg.channel.send("Usage: unmute <user>");
        const member = await msg.guild!.members.fetch(args[0]);
        if (!member) return await msg.channel.send("Invalid member.");
        // check if the bot has permission to manage roles
        if (!msg.guild?.members.me?.permissions.has("ManageRoles")) return await msg.channel.send("I am missing permission to manage roles.");
        // check if the bot can manage the user
        if (!member.manageable) return await msg.channel.send("I cannot manage this user.");

        // try to find the muted role
        const mutedRole = msg.guild?.roles.cache.find((r) => r.name.toLowerCase() === "muted");
        if (!mutedRole) return await msg.channel.send("No muted role found.");
        // check if the user has the role
        if (!member.roles.cache.has(mutedRole.id)) return await msg.channel.send("This user is not muted.");

        await member.roles.remove(mutedRole);
        return await msg.channel.send(`${member.user.username} has been unsilenced.`);
    }
}
