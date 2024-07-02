import { Message } from "discord.js";
import BaseClient from "../lib/BaseClient";
import GuildModel from "../models/GuildModel";

export default class AntiSpam {
    private readonly cooldownCache: Map<string, Message[]> = new Map();
    private readonly spamWarnCache: Set<string> = new Set();
    private readonly trapCache: Set<string> = new Set();
    constructor(public readonly client: BaseClient) {}

    public async execute(msg: Message, guildSettings: GuildModel): Promise<any> {
        if (!msg.guild) return;
        let member = await msg.guild.members.fetch(msg.author.id);
        // TODO: whitelist checks

        const cooldownTime = guildSettings.getDataValue("automod_antispam_cooldown");
        const warnThreshold = guildSettings.getDataValue("automod_antispam_warnThreshold");
        const warnDuration = guildSettings.getDataValue("automod_antispam_warnDuration");
        const banThreshold = guildSettings.getDataValue("automod_antispam_banThreshold");
        const banDuration = guildSettings.getDataValue("automod_antispam_banDuration");
        const logsChannelId = guildSettings.getDataValue("channels_logs");

        const cached = this.cooldownCache.get(msg.author.id) ?? [];
        const hasBeenWarned = this.spamWarnCache.has(msg.author.id);
        const trapped = this.trapCache.has(msg.author.id);
        console.debug(`[AntiSpam] ${msg.author.tag} (${msg.author.id}) cache is ${cached?.length}`);

        const lastMsg = cached[cached.length - 1];

        // handle cooldown expired
        if (lastMsg) {
            const lastMsgTime = lastMsg.createdTimestamp;
            const currentTime = msg.createdTimestamp;
            const duration = currentTime - lastMsgTime;
            console.debug(`[AntiSpam] ${msg.author.tag} (${msg.author.id}) cooldown duration diff is ${duration}`);
            if (duration >= cooldownTime) {
                // clear cache
                console.debug(`[AntiSpam] ${msg.author.tag} (${msg.author.id}) cooldown expired`);
                this.cooldownCache.set(msg.author.id, [msg]);
                this.spamWarnCache.delete(msg.author.id);
                return;
            }
        }

        // handle warnings, if there are warnThreshold messages within warnDuration, warn
        if (cached.length >= warnThreshold && !hasBeenWarned && !trapped) {
            // check duration between last cached message and this one
            const lastCached = cached[cached.length - 1];
            const lastCachedMsgTime = lastCached.createdTimestamp;
            const currentTime = msg.createdTimestamp;
            const duration = currentTime - lastCachedMsgTime;
            console.debug(`[AntiSpam] ${msg.author.tag} (${msg.author.id}) warn duration diff is ${duration}`);
            if (duration <= warnDuration) {
                // warn
                this.spamWarnCache.add(msg.author.id);
                console.log(
                    `[AntiSpam] ${msg.author.tag} (${msg.author.id}) has been warned for spamming (${cached.length} messages in ${duration}ms)`
                );
                await msg.channel
                    .send(`${msg.author}, stop spamming. Further spam will result in an automatic ban.`)
                    .then((m) => setTimeout(() => m.delete(), 5_000));
                return;
            }
        }

        // handle bans, if there are banThreshold messages within banDuration, ban
        if (cached.length >= banThreshold && !trapped) {
            // check duration between last cached message and this one
            const lastCached = cached[cached.length - 1];
            const lastCachedMsg = await msg.channel.messages.fetch(lastCached);
            const lastCachedMsgTime = lastCachedMsg.createdTimestamp;
            const currentTime = msg.createdTimestamp;
            const duration = currentTime - lastCachedMsgTime;
            console.debug(`[AntiSpam] ${msg.author.tag} (${msg.author.id}) ban duration diff is ${duration}`);
            if (duration <= banDuration) {
                // ban
                this.trapCache.add(msg.author.id); // temporarily add to cache so we dont trigger multiple times
                console.log(
                    `[AntiSpam] ${msg.author.tag} (${msg.author.id}) has been banned for spamming (${cached.length} messages in ${duration}ms)`
                );

                await member.ban({ reason: "Spam" });
                await msg.channel
                    .send(`${msg.author} has been banned for spamming.`)
                    .then((m) => setTimeout(() => m.delete(), 5_000));
                // clear
                await this.purge(cached, msg);
                this.cooldownCache.delete(msg.author.id);
                this.spamWarnCache.delete(msg.author.id);
                this.trapCache.delete(msg.author.id);

                // log
                if (logsChannelId) {
                    const logChannel = await msg.guild.channels.fetch(logsChannelId);
                    if (logChannel && logChannel.isTextBased()) {
                        await logChannel.send(
                            `\`${msg.author.tag}\` (\`${msg.author.id}\`) has been banned for spamming (\`${cached.length}\` messages in \`${duration}ms\`)`
                        );
                    }
                }
                return;
            }
        }

        // add to cache
        this.cooldownCache.set(msg.author.id, [...cached, msg]);
    }

    public async purge(messages: Message[], msg: Message): Promise<any> {
        // push current msg
        messages.push(msg);
        await Promise.all(messages.map((m) => m.delete()));
    }
}
