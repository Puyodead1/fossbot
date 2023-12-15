import { Events, GuildMember } from "discord.js";
import BaseClient from "../lib/BaseClient";
import BaseEvent from "../lib/BaseEvent";

export default class extends BaseEvent {
    constructor(public readonly client: BaseClient) {
        super({
            event: Events.GuildMemberAdd,
            once: false,
        });
    }

    public async execute(member: GuildMember): Promise<void> {
        // TODO: get welcome channel from database
        // const channel = await member.guild.channels.fetch("1006649184062836783");
        // if (!channel || !channel.isTextBased()) return;
        // await channel.send(`\`${member.user.tag}\` (\`${member.user.id}\`) has joined the party.`);
    }
}
