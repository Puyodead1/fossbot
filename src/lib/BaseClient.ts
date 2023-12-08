import { Client, ClientOptions } from "discord.js";
import BaseCommand from "./BaseCommand";

export interface Config {
    ownerIds: string[];
}

const defaultConfig: Config = {
    ownerIds: [],
};

export interface CustomClientOptions extends ClientOptions {
    config?: Config;
}

export default class BaseClient extends Client {
    public readonly commands: Map<string, BaseCommand>;
    public readonly config: Config;

    constructor(options: CustomClientOptions) {
        super(options);
        this.commands = new Map();
        this.config = { ...defaultConfig, ...options.config };
    }
}
