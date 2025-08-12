import { Message } from "discord.js";
import BaseClient from "../lib/BaseClient";
import BaseCommand, { CommandPermissionLevel } from "../lib/BaseCommand";
import GuildModel from "../models/GuildModel";

export default class extends BaseCommand {
    constructor(public readonly client: BaseClient) {
        super({
            name: "kick",
            description: "Kick a user from the server",
            permissionLevel: CommandPermissionLevel.Moderator,
            guildOnly: true,
            aliases: ["yeet", "👢"],
        });
    }

    public async execute(msg: Message, args: string[]): Promise<any> {
        if (!msg.channel.isSendable()) return;
        if (args.length < 1) return await msg.channel.send("You must provide a user to kick.");
        const member = await msg.guild!.members.fetch(args[0]);
        if (!member) return await msg.channel.send("Invalid member.");
        // check if the bot has permission to kick users
        if (!msg.guild?.members.me?.permissions.has("KickMembers")) return await msg.channel.send("I am missing permission to kick members.");
        // check if the bot can kick the user
        if (!member.kickable) return await msg.channel.send("I cannot kick this user.");

        // anything after the first arg is the reason
        const reason = args.slice(1).join(" ") || "No reason provided";
        await member.kick(reason);
        await msg.channel.send(`\`${member.user.tag}\` (\`${member.user.id}\`) has been kicked.`);

        // logging
        const guildRecord = await GuildModel.findByPk(msg.guild.id);
        if (!guildRecord) return;
        const logsChannelId = guildRecord.getDataValue("channels_logs");
        if (logsChannelId && guildRecord.getDataValue("logging_enabled")) {
            const logChannel = await msg.guild.channels.fetch(logsChannelId);
            if (logChannel && logChannel.isTextBased()) {
                await logChannel.send(`\`${member.user.tag}\` (\`${member.id}\`) has been kicked by ${msg.author.tag} (\`${msg.author.id}\`) for \`${reason}\``);
            }
        }
    }
}
