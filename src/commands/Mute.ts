import { Message } from "discord.js";
import BaseClient from "../lib/BaseClient";
import BaseCommand, { CommandPermissionLevel } from "../lib/BaseCommand";
import GuildModel from "../models/GuildModel";

export default class extends BaseCommand {
    constructor(public readonly client: BaseClient) {
        super({
            name: "mute",
            description: "Mutes a user.",
            permissionLevel: CommandPermissionLevel.Moderator,
            guildOnly: true,
            aliases: ["stfu", "gag"],
        });
    }

    public async execute(msg: Message, args: string[]): Promise<any> {
        if (args.length < 1) return await msg.channel.send("Usage: mute <user>");
        const member = await msg.guild!.members.fetch(args[0]);
        if (!member) return await msg.channel.send("Invalid member.");
        // check if the bot has permission to manage roles
        if (!msg.guild?.members.me?.permissions.has("ManageRoles"))
            return await msg.channel.send("I am missing permission to manage roles.");
        // check if the bot can manage the user
        if (!member.manageable) return await msg.channel.send("I cannot manage this user.");

        // try to find the muted role
        let mutedRole = msg.guild?.roles.cache.find((r) => r.name.toLowerCase() === "muted");
        // if no muted role, create one
        if (!mutedRole) {
            mutedRole = await msg.guild?.roles.create({
                name: "Muted",
                color: "#000000",
                permissions: [],
            });
            if (!mutedRole) return await msg.channel.send("Failed to create muted role.");
            await msg.guild?.channels.cache.forEach(async (channel) => {
                if (!("permissionOverwrites" in channel)) return;
                await channel.permissionOverwrites.create(mutedRole!, {
                    SendMessages: false,
                    AddReactions: false,
                    Connect: false,
                    Speak: false,
                });
            });
            await msg.channel.send("no mute role was found, so I created one.");
        }

        await member.roles.add(mutedRole);
        await msg.channel.send(`${member.user.username} has been silenced.`);

        // logging
        const guildRecord = await GuildModel.findByPk(msg.guild.id);
        if (!guildRecord) return;
        const logsChannelId = guildRecord.getDataValue("channels_logs");
        if (logsChannelId && guildRecord.getDataValue("logging_enabled")) {
            const logChannel = await msg.guild.channels.fetch(logsChannelId);
            if (logChannel && logChannel.isTextBased()) {
                await logChannel.send(
                    `\`${member.user.tag}\` (\`${member.id}\`) has been muted by ${msg.author.tag} (\`${msg.author.id}\`)`
                );
            }
        }
    }
}
