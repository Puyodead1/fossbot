import { Events, Message } from "discord.js";
import BaseClient from "../lib/BaseClient";
import { CommandPermissionLevel } from "../lib/BaseCommand";
import BaseEvent from "../lib/BaseEvent";

export default class extends BaseEvent {
    constructor(public readonly client: BaseClient) {
        super({
            event: Events.MessageCreate,
            once: false,
        });
    }

    public async execute(msg: Message): Promise<any> {
        if (msg.author.bot) return; // ignore bots
        if (!msg.content) return;
        if (msg.author.id === this.client.user?.id) return; // ignore self
        if (!msg.content.toLowerCase().startsWith(this.client.config.prefix!)) {
            // automoderation
            await this.client.antispam.execute(msg);
            return;
        }

        const a = msg.content.slice(2);
        const args = a.split(/ +/g);
        const command = args.shift()?.toLowerCase();

        if (!command) return;

        const cmd = this.client.commands.get(command);
        if (!cmd) return;

        if (cmd.options.guildOnly && !msg.guild) return;

        const pl = cmd.options.permissionLevel ?? CommandPermissionLevel.Everyone;

        let canExecute = false;

        switch (pl) {
            case CommandPermissionLevel.Everyone:
                canExecute = true;
                break;
            case CommandPermissionLevel.Moderator:
                canExecute = msg.member?.permissions.has("ManageMessages") ?? false;
                break;
            case CommandPermissionLevel.Administrator:
                canExecute = msg.member?.permissions.has("Administrator") ?? false;
                break;
            case CommandPermissionLevel.ServerOwner:
                canExecute = msg.guild?.ownerId === msg.author.id;
                break;
            case CommandPermissionLevel.BotOwner:
                canExecute = this.client.config.ownerIds!.includes(msg.author.id);
                break;
        }

        if (canExecute) {
            console.debug(`${msg.author.tag} executed command '${command}' with args '${args}'`);
            try {
                await cmd.execute(msg, args);
            } catch (e) {
                console.error(e);
                await msg.channel.send(`An error occurred while executing this command. ${e}`);
            }
        } else {
            console.debug(`${msg.author.tag} tried to execute command '${command}' with args '${args}' but was denied`);
            await msg.channel.send("You do not have permission to execute this command.");
        }
    }
}
