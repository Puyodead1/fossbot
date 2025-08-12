import { ChannelType, GuildChannelTypes, Message } from "discord.js";
import BaseClient from "../lib/BaseClient";
import BaseCommand, { CommandPermissionLevel } from "../lib/BaseCommand";

export default class extends BaseCommand {
    constructor(public readonly client: BaseClient) {
        super({
            name: "createchannel",
            description: "Creates a channel",
            aliases: ["cc"],
            guildOnly: true,
            permissionLevel: CommandPermissionLevel.Administrator,
        });
    }
    public async execute(msg: Message, args: string[]): Promise<any> {
        if (!msg.channel.isSendable()) return;
        if (args.length < 2) return await msg.channel.send("Usage: createchannel <name> <type> [position] [parent]");
        const name = args[0];
        let type: GuildChannelTypes | string = args[1];
        const position = args[2] ? Number(args[2]) : undefined;
        const parent = args[3] ? msg.guild!.channels.cache.get(args[3]) : undefined;

        if (parent !== undefined && parent.type !== ChannelType.GuildCategory) return await msg.channel.send("Invalid parent channel.");

        // if type is a string, try and convert it to a number
        if (typeof type === "string") {
            if (!isNaN(Number(type))) type = Number(type);
            else {
                switch (type.toLowerCase()) {
                    case "text":
                        type = ChannelType.GuildText;
                        break;
                    case "voice":
                        type = ChannelType.GuildVoice;
                        break;
                    default:
                        type = NaN;
                        break;
                }
            }
        }

        if (!Object.values(ChannelType).includes(type)) return await msg.channel.send("Invalid channel type.");

        try {
            const channel = await msg.guild!.channels.create({
                name,
                type,
                parent,
                position,
            });

            return await msg.channel.send(`Created channel <#${channel.id}>`);
        } catch (e: any) {
            return await msg.channel.send(`Failed to create channel: ${e.message}`);
        }
    }
}
