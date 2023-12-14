import { Events, Guild } from "discord.js";
import BaseClient from "../lib/BaseClient";
import BaseEvent from "../lib/BaseEvent";
import { DefaultSettings } from "../models/GuildSettings";

export default class extends BaseEvent {
    constructor(public readonly client: BaseClient) {
        super({
            event: Events.GuildCreate,
            once: false,
        });
    }

    public async execute(guild: Guild): Promise<void> {
        console.debug(`[GuildCreate] Recieved GuildCreate for ${guild.id}`);
        const record = await this.client.db.Guild.findOne({ where: { id: guild.id } });
        if (record) return;
        console.debug(`[GuildCreate] Guild ${guild.id} not found in database, creating...`);
        await this.client.db.Guild.create({ id: guild.id, ...DefaultSettings })
            .then(() => console.debug(`[GuildCreate] Guild ${guild.id} created in database`))
            .catch((e) => console.error(`[GuildCreate] Failed to create record for guild ${guild.id}: ${e}`));
    }
}
