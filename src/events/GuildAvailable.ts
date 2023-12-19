import { Events, Guild } from "discord.js";
import BaseClient from "../lib/BaseClient";
import BaseEvent from "../lib/BaseEvent";
import GuildModel, { GuildSchema } from "../models/GuildModel";

export default class extends BaseEvent {
    constructor(public readonly client: BaseClient) {
        super({
            event: Events.GuildAvailable,
            once: false,
        });
    }

    public async execute(guild: Guild): Promise<void> {
        console.debug(`[GuildAvailable] Recieved GuildAvailable for ${guild.id}`);

        const record = await GuildModel.findByPk(guild.id);
        if (record) return;
        console.debug(`[GuildCreate] Guild ${guild.id} not found in database, creating...`);
        await GuildModel.create({
            id: guild.id,
            ...GuildSchema.getDefault(),
        })
            .then(() => console.debug(`[GuildCreate] Guild ${guild.id} created in database`))
            .catch((e) => console.error(`[GuildCreate] Failed to create record for guild ${guild.id}: ${e}`));
    }
}
