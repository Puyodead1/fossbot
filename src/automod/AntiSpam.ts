import { Message, Snowflake } from "discord.js";
import BaseClient from "../lib/BaseClient";

export default class AntiSpam {
    private readonly spamCache: Map<string, Snowflake[]> = new Map();
    private readonly spamWarnCache: Map<string, number> = new Map();
    constructor(public readonly client: BaseClient) {}

    public async execute(msg: Message): Promise<any> {
        if (!msg.guild) return;
        let member = await msg.guild.members.fetch(msg.author.id);
        // TODO: whitelist checks

        const cached = this.spamCache.get(msg.author.id);
        const cachedWarn = this.spamWarnCache.get(msg.author.id);
        if (!cached) {
            this.spamCache.set(msg.author.id, [msg.id]);
            setTimeout(() => {
                this.spamCache.delete(msg.author.id);
                console.debug(`Removed ${msg.author.id} from spam cache`);
            }, 5_000);
            return;
        }

        const cachedLength = cached.length;

        if (cachedLength === 5 && !cachedWarn) {
            await msg.channel
                .send("You are sending messages too fast, slow down.")
                .then((m) => setTimeout(() => m.delete(), 5_000));
            this.spamWarnCache.set(msg.author.id, 1);
        }
        // else if (cachedLength >= 10 && cachedLength < 15) {
        //     await msg.channel.send("antispam kick");
        //     await Promise.all(cached.map((m) => msg.channel.messages.delete(m)));
        // }
        else if (cachedLength >= 10 || cachedWarn) {
            if (!member.bannable) {
                // await msg.channel.send("Stop Spamming.").then((m) => setTimeout(() => m.delete(), 5_000));
                await this.purge(cached, msg);
            } else {
                await this.purge(cached, msg);
                await member.ban({ reason: "Spam" });
                await msg.channel
                    .send(`${msg.author.tag} has been banned for spamming.`)
                    .then((m) => setTimeout(() => m.delete(), 5_000));
                this.spamCache.delete(msg.author.id);
                this.spamWarnCache.delete(msg.author.id);
                return;
            }
        }

        this.spamCache.set(msg.author.id, [...cached, msg.id]);
    }

    public async purge(messages: Snowflake[], msg: Message): Promise<any> {
        // push current msg
        messages.push(msg.id);
        await Promise.all(messages.map((m) => msg.channel.messages.delete(m)));
    }
}
