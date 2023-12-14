import { EmbedBuilder, Message } from "discord.js";
import BaseClient from "../lib/BaseClient";
import BaseCommand, { CommandPermissionLevel } from "../lib/BaseCommand";

export default class extends BaseCommand {
    constructor(public readonly client: BaseClient) {
        super({
            name: "roles",
            guildOnly: true,
            permissionLevel: CommandPermissionLevel.Everyone,
            aliases: ["rl"],
        });
    }
    public async execute(msg: Message): Promise<any> {
        // prints all roles in the guild
        if (!msg.guild) return await msg.channel.send("Guild not found");
        if (!msg.guild.roles) return await msg.channel.send("No roles found");
        const roles = await msg.guild.roles.fetch(undefined, {
            cache: true,
        });
        const embed = new EmbedBuilder()
            .setTitle("Guild Roles")
            // broken because the client doesnt correctly render new lines in embeds
            // .addFields([
            //     {
            //         name: "Roles",
            //         value: roles.map((r) => `${r.name} - ${r.id}`).join("\n"),
            //         inline: false,
            //     },
            // ])
            .addFields(
                Array.from(roles.values()).map((x) => ({
                    name: x.name,
                    value: x.id,
                }))
            )
            .setColor("Random")
            .setTimestamp();
        await msg.channel.send({
            embeds: [embed],
        });
    }
}
