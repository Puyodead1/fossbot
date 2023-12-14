import { Message } from "discord.js";
import BaseClient from "../lib/BaseClient";
import BaseCommand, { CommandPermissionLevel } from "../lib/BaseCommand";

export default class extends BaseCommand {
    constructor(public readonly client: BaseClient) {
        super({
            name: "purge",
            guildOnly: true,
            permissionLevel: CommandPermissionLevel.Moderator,
        });
    }
    public async execute(msg: Message, args: string[]): Promise<any> {
        if (!msg.channel.isTextBased()) return;
        if (!args.length) return await msg.channel.send("user?");
        // const id = args[0];
        const type = args[0]; // user, count, all
        args = args.slice(1);

        if (type.toLowerCase() === "user") {
            return await this.purgeUser(msg, args);
        } else if (type.toLowerCase() === "count") {
            return await this.purgeCount(msg, args);
        } else {
            return await msg.channel.send("purge <user|count> [args]");
        }

        // const user = await this.client.users.fetch(id);
        // if (!user) return await msg.channel.send("user not found");

        // let channelId = msg.channelId;
        // if (args[1]) channelId = args[1];

        // let channel;
        // if (channelId === msg.channelId) channel = msg.channel;
        // else channel = await msg.guild?.channels.fetch(channelId);

        // if (!channel || !channel.isTextBased()) return await msg.channel.send("channel not found or invalid");

        // let i = 0;
        // let messages: Message[] = [];
        // while (messages.length == 0 || i < 10) {
        //     console.log(`Fetching ${i}`);
        //     const a = await channel.messages.fetch({
        //         limit: 100,
        //         before: messages[messages.length - 1]?.id,
        //     });
        //     if (!a.size) break;
        //     messages = messages.concat(Array.from(a.values()));
        //     i++;
        // }
        // if (!messages.length) return await msg.channel.send("no messages found");
        // const userMessages = messages.filter((m) => m.author.id === user.id);
        // console.log(`Found ${userMessages.length} messages from ${user.tag}`);
        // for (const message of userMessages.values()) {
        //     await message.delete();
        // }

        // await msg.channel.send(`Deleted ${userMessages.length} messages from ${user.tag}, i think`);
    }

    async purgeUser(msg: Message, args: string[]): Promise<any> {
        const m = await msg.channel.send("Working on it...");

        const id = args[0];
        const user = await this.client.users.fetch(id);
        if (!user) return await msg.channel.send("user not found");
        const amount = parseInt(args[1]) || 100;
        const channel = await msg.guild?.channels.fetch(msg.channelId);
        if (!channel || !channel.isTextBased()) return await m.edit("Channel not found or invalid");

        // fetch messages, 100 at a time up to amount, or 10 times
        let iterations = 0;
        let messages: Message[] = [];
        while (messages.length < amount + 1) {
            if (iterations >= 5) break;

            console.log(`[Purge] Fetching messages, iteration: ${iterations + 1}; message count: ${messages.length}`);
            const msgs = await channel.messages.fetch({
                limit: amount < 100 ? amount : 100,
                before: messages[messages.length - 1]?.id ?? msg.id,
            });
            if (!msgs.size) break;
            // messages = messages.concat(Array.from(msgs.values()));
            // filter msgs by user and concat
            messages = messages.concat(Array.from(msgs.values()).filter((m) => m.author.id === user.id));
            iterations++;
        }
        if (!messages.length) return await m.edit("No messages found");
        // cut off messages if we have more than amount
        if (messages.length > amount) messages = messages.slice(0, amount);

        // const userMessages = messages.filter((m) => m.author.id === user.id);
        await m.edit(`Purging ${messages.length} messages from ${user.tag}`);
        console.log(`Found ${messages.length} messages from ${user.tag}`);
        for (const message of messages.values()) {
            await message.delete();
        }

        await m
            .edit(`Deleted ${messages.length} messages from ${user.tag}`)
            .then((m) => setTimeout(() => m.delete(), 5_000));
    }

    async purgeCount(msg: Message, args: string[]): Promise<any> {
        const m = await msg.channel.send("Working on it...");

        if (!args.length) return await m.edit("Amount not specified");
        const amount = parseInt(args[0]);
        if (isNaN(amount)) return await m.edit("Amount is not valid");

        const channel = await msg.guild?.channels.fetch(msg.channelId);
        if (!channel || !channel.isTextBased()) return await m.edit("channel not found or invalid");

        // fetch messages, 100 at a time up to amount, or 10 times
        let iterations = 0;
        let messages: Message[] = [];
        while (messages.length < amount + 1) {
            if (iterations >= 5) break;

            console.log(`[Purge] Fetching messages, iteration: ${iterations + 1}; message count: ${messages.length}`);
            const msgs = await channel.messages.fetch({
                limit: amount < 100 ? amount : 100,
                before: messages[messages.length - 1]?.id ?? msg.id,
            });
            if (!msgs.size) break;
            messages = messages.concat(Array.from(msgs.values()));
            iterations++;
        }
        if (!messages.length) return await m.edit("No messages found");
        // cut off messages if we have more than amount
        if (messages.length > amount) messages = messages.slice(0, amount);
        await m.edit(`Purging ${messages.length} messages`);
        for (const message of messages.values()) {
            await message.delete();
        }

        await m.edit(`Deleted ${messages.length} messages`).then((m) => setTimeout(() => m.delete(), 5_000));
    }
}
