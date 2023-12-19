import { Client, ClientOptions } from "discord.js";
import { Sequelize } from "sequelize-typescript";
import AntiSpam from "../automod/AntiSpam";
import GuildModel from "../models/GuildModel";
import BaseCommand from "./BaseCommand";

export interface Config {
    ownerIds?: string[];
    databasePath?: string;
    prefix?: string;
}

const defaultConfig: Config = {
    ownerIds: [],
    databasePath: "./database.sqlite",
    prefix: "-",
};

export interface CustomClientOptions extends ClientOptions {
    config?: Config;
}

export default class BaseClient extends Client {
    public readonly db: Sequelize;
    public readonly commands: Map<string, BaseCommand>;
    public readonly config: Config;
    public readonly antispam: AntiSpam;

    constructor(options: CustomClientOptions) {
        super(options);
        this.config = { ...defaultConfig, ...options.config };
        this.db = new Sequelize("database", "user", "password", {
            host: "localhost",
            dialect: "sqlite",
            logging: false,
            // SQLite only
            storage: "database.sqlite",
            models: [GuildModel],
        });
        this.commands = new Map();
        this.antispam = new AntiSpam(this);
    }
}
