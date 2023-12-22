import { Message } from "discord.js";
import BaseClient from "../lib/BaseClient";
import BaseCommand, { CommandPermissionLevel } from "../lib/BaseCommand";

export default class extends BaseCommand {
    constructor(public readonly client: BaseClient) {
        super({
            name: "unban",
            description: "Unbans a user from the server",
            permissionLevel: CommandPermissionLevel.Moderator,
            guildOnly: true,
            aliases: [],
        });
    }

    public async execute(msg: Message, args: string[]): Promise<any> {
        if (args.length < 1) return await msg.channel.send("Usage: unban <user> [reason]");
        const member = await msg.guild!.members.fetch(args[0]);
        if (!member) return await msg.channel.send("Invalid member.");

        // check if the bot has permission to unban users
        if (!msg.guild?.members.me?.permissions.has("BanMembers"))
            return await msg.channel.send("I am missing permission to unban members.");

        // find the ban
        const ban = await msg.guild!.bans.fetch(member.user);
        if (!ban) return await msg.channel.send("This user is not banned.");

        // unban the user
        await msg.guild!.members.unban(member.user, args.slice(1).join(" "));
        return await msg.channel.send(`\`${member.user.tag}\` (\`${member.user.id}\`) has been unbanned.`);
    }
}
