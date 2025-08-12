import { Message } from "discord.js";
import BaseClient from "../lib/BaseClient";
import BaseCommand, { CommandPermissionLevel } from "../lib/BaseCommand";
import GuildModel from "../models/GuildModel";

export default class extends BaseCommand {
    constructor(public readonly client: BaseClient) {
        super({
            name: "ban",
            description: "Bans a user from the server",
            permissionLevel: CommandPermissionLevel.Moderator,
            guildOnly: true,
            aliases: [],
        });
    }

    public async execute(msg: Message, args: string[]): Promise<any> {
        if (!msg.channel.isSendable()) return;
        if (args.length < 1) return await msg.channel.send("Usage: ban <user> [reason]");
        const member = await msg.guild!.members.fetch(args[0]);
        if (!member) return await msg.channel.send("Invalid member.");
        // check if the bot has permission to ban users
        if (!msg.guild?.members.me?.permissions.has("BanMembers")) return await msg.channel.send("I am missing permission to ban members.");
        // check if the bot can ban the user
        if (!member.bannable) return await msg.channel.send("I cannot ban this user.");

        // anything after the first arg is the reason
        const reason = args.slice(1).join(" ") || "No reason provided";
        await member.ban({
            reason,
            deleteMessageSeconds: 604800, // TODO: this doesnt do anything in spacebar yet
        });
        await msg.channel.send(`\`${member.user.tag}\` (\`${member.user.id}\`) has been banned.`);

        // logging
        const guildRecord = await GuildModel.findByPk(msg.guild.id);
        if (!guildRecord) return;
        const logsChannelId = guildRecord.getDataValue("channels_logs");
        if (logsChannelId && guildRecord.getDataValue("logging_enabled")) {
            const logChannel = await msg.guild.channels.fetch(logsChannelId);
            if (logChannel && logChannel.isTextBased()) {
                await logChannel.send(`\`${member.user.tag}\` (\`${member.id}\`) has been banned by ${msg.author.tag} (\`${msg.author.id}\`) for \`${reason}\``);
            }
        }
    }
}
