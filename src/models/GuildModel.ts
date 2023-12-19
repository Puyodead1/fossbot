import { Column, DataType, Model, Table } from "sequelize-typescript";
import { InferType, boolean, number, object, string } from "yup";

export const GuildSchema = object({
    prefix: string().default("b!"),
    automod_enabled: boolean().default(false),
    automod_antispam_enabled: boolean().default(false),
    automod_antispam_warnThreshold: number().default(3),
    automod_antispam_warnDuration: number().default(800),
    automod_antispam_banThreshold: number().default(10),
    automod_antispam_banDuration: number().default(2000),
    automod_antispam_cooldown: number().default(1_000),
    channels_logs: string().nullable(),
});

export type GuildAttributes = InferType<typeof GuildSchema>;

@Table({
    tableName: "guilds",
})
export default class Guild extends Model<GuildAttributes & { id: string }, GuildAttributes & { id: string }> {
    @Column({
        type: DataType.STRING,
        defaultValue: "a!",
    })
    declare prefix: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    declare automod_enabled: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    declare automod_antispam_enabled: boolean;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 3,
    })
    declare automod_antispam_warnThreshold: number;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 800,
    })
    // ms
    declare automod_antispam_warnDuration: number;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 3,
    })
    declare automod_antispam_banThreshold: number;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 1_000,
    })
    // msg
    declare automod_antispam_banDuration: number;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 1_000,
    })
    // ms
    declare automod_antispam_cooldown: number;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare channels_logs: string | null;
}

export const GuildSchemaKeys = Object.keys(GuildSchema.fields);
