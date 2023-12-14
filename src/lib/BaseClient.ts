import { Client, ClientOptions } from "discord.js";
import Sequelize, { Model, ModelStatic } from "sequelize";
import AntiSpam from "../automod/AntiSpam";
import GuildSettings from "../models/GuildSettings";
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
    public readonly db: Sequelize.Sequelize;
    public readonly commands: Map<string, BaseCommand>;
    public readonly config: Config;
    public readonly antispam: AntiSpam;

    constructor(options: CustomClientOptions) {
        super(options);
        this.config = { ...defaultConfig, ...options.config };
        this.db = new Sequelize.Sequelize("database", "user", "password", {
            host: "localhost",
            dialect: "sqlite",
            logging: false,
            // SQLite only
            storage: "database.sqlite",
        });
        this.db.Guild = GuildSettings(this.db);
        this.commands = new Map();
        this.antispam = new AntiSpam(this);
    }
}

// add Guild proerty to Sequelize
declare module "sequelize" {
    export interface Sequelize {
        Guild: ModelStatic<Model<any, any>>;
    }
}
