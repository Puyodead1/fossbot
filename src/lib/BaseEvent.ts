import { ClientEvents } from "discord.js";

export interface EventOptions {
    event: keyof ClientEvents;
    once: boolean;
}

export default abstract class {
    constructor(public readonly options: EventOptions) {}

    public abstract execute(...args: any[]): Promise<any>;
}
