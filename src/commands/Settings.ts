import { Message } from "discord.js";
import BaseClient from "../lib/BaseClient";
import BaseCommand, { CommandPermissionLevel } from "../lib/BaseCommand";
import GuildModel, { GuildAttributes, GuildSchema, GuildSchemaKeys } from "../models/GuildModel";
import { getKeyTypes } from "../utils";

const keyTypes = getKeyTypes(GuildSchema);

export default class extends BaseCommand {
    constructor(public readonly client: BaseClient) {
        super({
            name: "settings",
            guildOnly: true,
            permissionLevel: CommandPermissionLevel.Moderator,
            aliases: ["config", "cfg", "⚙️"],
        });
    }

    public async execute(msg: Message, args: string[]): Promise<any> {
        const guildRecord = await GuildModel.findByPk(msg.guild!.id);
        if (!guildRecord) return await msg.channel.send("No guild record was found.");

        const subcmd = args.shift()?.toLowerCase();
        if (!subcmd) return await msg.channel.send("No subcommand provided. Valid subcommands: `get`, `set`");

        if (subcmd === "get") {
            const key = args.shift();
            if (!key)
                return await msg.channel.send(
                    `No config key provided. Valid keys: \`${GuildSchemaKeys.join("`, `")}\``
                );
            // check if key is valid
            if (!GuildSchemaKeys.includes(key)) return await msg.channel.send("invalid key");

            const value = guildRecord.get(key);
            return await msg.channel.send(`\`${key}\` = \`${value}\``);
        } else if (subcmd === "set") {
            const key = args.shift();
            if (!key)
                return await msg.channel.send(
                    `No config key provided. Valid keys: \`${GuildSchemaKeys.join("`, `")}\``
                );
            // check if key is valid
            if (!GuildSchemaKeys.includes(key)) return await msg.channel.send("invalid key");
            const value = args.join(" ");

            if (!value) return await msg.channel.send(`No value provided. Should be of type: \`${keyTypes[key]}\``);
            await GuildModel.update({ [key]: value } as unknown as GuildAttributes, { where: { id: msg.guild!.id } });
            return await msg.channel.send(`Configuration key \`${key}\` set to \`${value}\``);
        } else {
            return await msg.channel.send("invalid subcommand");
        }
    }
}
