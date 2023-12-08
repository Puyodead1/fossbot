import { Message } from "discord.js";
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
    public async execute(msg: Message): Promise<any> {
        return await msg.channel.send("This command is currently disabled.");
        // if (msg.channel.type !== ChannelType.GuildText) return;
        // const permOverwrites = msg.channel.permissionOverwrites.cache.get(msg.guild!.id);
        // const locked = permOverwrites?.deny.has("SendMessages") ?? false;
        // if (locked) {
        //     // channel is already locked
        //     const embed = new EmbedBuilder()
        //         .setTitle("Channel Locked")
        //         .setDescription("This channel is already locked.")
        //         .setColor("Red");
        //     return await msg.channel.send({ embeds: [embed] });
        // } else {
        //     // channel is not locked
        //     await msg.channel.permissionOverwrites.edit(msg.guild!.id, {
        //         SendMessages: false,
        //     });
        //     const embed = new EmbedBuilder()
        //         .setTitle("Channel Locked")
        //         .setDescription("Channel has been locked.")
        //         .setColor("Red");
        //     return await msg.channel.send({ embeds: [embed] });
        // }
    }
}
