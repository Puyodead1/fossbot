export interface CommandOptions {
    name: string;
    description?: string;
    permissionLevel?: CommandPermissionLevel;
    aliases?: string[];
    usage?: string;
    category?: string;
    cooldown?: number;
    guildOnly?: boolean;
}

export default abstract class {
    constructor(public readonly options: CommandOptions) {}

    public abstract execute(...args: any[]): Promise<any>;
}

export const enum CommandPermissionLevel {
    Everyone = 0,
    Moderator = 1,
    Administrator = 2,
    ServerOwner = 3,
    BotOwner = 4,
}
