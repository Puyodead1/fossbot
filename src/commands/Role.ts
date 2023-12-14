import { Message } from "discord.js";
import BaseClient from "../lib/BaseClient";
import BaseCommand, { CommandPermissionLevel } from "../lib/BaseCommand";

export default class extends BaseCommand {
    constructor(public readonly client: BaseClient) {
        super({
            name: "role",
            guildOnly: true,
            permissionLevel: CommandPermissionLevel.Administrator,
            aliases: ["roles", "r"],
        });
    }
    public async execute(msg: Message, args: string[]): Promise<any> {
        if (!args.length) return await msg.channel.send("role <add|remove> <member> <role>");

        const action = args[0];

        if (["add", "a", "+", "give"].includes(action.toLowerCase())) {
            return await this.add(msg, args.slice(1));
        } else if (["remove", "r", "-", "take"].includes(action.toLowerCase())) {
            return await this.remove(msg, args.slice(1));
        } else {
            return await msg.channel.send("Invalid action. role <add|remove> <member> <role>");
        }
    }

    async add(msg: Message, args: string[]): Promise<any> {
        if (args.length < 2) return await msg.channel.send("role add <member> <role>");
        const mid = args[0];
        const rid = args[1];

        const member = await msg.guild?.members.fetch(mid);
        if (!member) return await msg.channel.send("Member not found");

        const role = await msg.guild?.roles.fetch(rid);
        if (!role) return await msg.channel.send("Role not found");

        if (member.roles.cache.has(role.id)) return await msg.channel.send("Member already has role");
        if (!member.manageable) return await msg.channel.send("Member is not manageable");

        await member.roles.add(role);

        await msg.channel.send(`Added role \`${role.name}\` to ${member.user.tag}`);
    }

    async remove(msg: Message, args: string[]): Promise<any> {
        if (args.length < 2) return await msg.channel.send("role remove <member> <role>");
        const mid = args[0];
        const rid = args[1];

        const member = await msg.guild?.members.fetch(mid);
        if (!member) return await msg.channel.send("Member not found");

        const role = await msg.guild?.roles.fetch(rid);
        if (!role) return await msg.channel.send("Role not found");

        if (!member.roles.cache.has(role.id)) return await msg.channel.send("Member doesn't have role");
        if (!member.manageable) return await msg.channel.send("Member is not manageable");

        await member.roles.remove(role);

        await msg.channel.send(`Removed role \`${role.name}\` from ${member.user.tag}`);
    }
}
