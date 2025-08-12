import { EmbedBuilder, Message } from "discord.js";
import BaseClient from "../lib/BaseClient";
import BaseCommand, { CommandPermissionLevel } from "../lib/BaseCommand";

export default class extends BaseCommand {
    constructor(public readonly client: BaseClient) {
        super({
            name: "lockchannel",
            description: "Locks the current channel.",
            aliases: ["lc", "lockc", "lock", "lockchan"],
            guildOnly: true,
            permissionLevel: CommandPermissionLevel.Moderator,
        });
    }
    public async execute(msg: Message, args: string[]): Promise<any> {
        if (!msg.channel.isSendable()) return;
        const channelId = args.length ? args[0] : msg.channel.id;
        const channel = await msg.guild?.channels.fetch(channelId);
        if (!channel || !("permissionOverwrites" in channel)) return await msg.channel.send("Invalid channel.");

        const perms = channel.permissionOverwrites.resolve(msg.guild!.id);
        if (!perms) {
            // if no permission overwrite for the @everyone role, create one
            await channel.permissionOverwrites.create(msg.guild!.roles.everyone, { SendMessages: false });
        } else {
            if (perms.deny.has("SendMessages")) {
                const embed = new EmbedBuilder().setDescription(`🤔 Channel is already locked`).setColor("Red").setTimestamp().setFooter({
                    text: msg.author.tag,
                    iconURL: msg.author.displayAvatarURL(),
                });
                return await msg.channel.send({
                    embeds: [embed],
                });
            }
            await channel.permissionOverwrites.edit(msg.guild!.roles.everyone, { SendMessages: false });
        }

        const embed = new EmbedBuilder().setDescription(`🔒 Locked channel <#${channel.id}>`).setColor("Red").setTimestamp().setFooter({
            text: msg.author.tag,
            iconURL: msg.author.displayAvatarURL(),
        });
        return await msg.channel.send({
            embeds: [embed],
        });
    }
}
