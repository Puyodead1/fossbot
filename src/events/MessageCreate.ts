import { Client } from "@puyodead1/fosscord-gopnik/build/lib";
import { Message } from "discord.js";
import BaseEvent from "../lib/BaseEvent";

export default class extends BaseEvent {
  constructor(public readonly client: Client) {
    super({
      event: "messageCreate",
      once: false,
    });
  }

  public async execute(msg: Message): Promise<any> {
    if (msg.author.bot) return; // ignore bots
    if (!msg.content) return;
    //if (msg.author.id === client.user?.id) return; // ignore self
    if (!msg.content.toLowerCase().startsWith("a!")) return;

    const a = msg.content.slice(2);
    const args = a.match(/\w+|"(?:\\"|[^"])+"/g);
    if (!args) return;
    const command = args.shift()?.toLowerCase();

    if (!command) return;

    // TODO: match command to a command class and execute it
    await msg.reply(`cmd: ${command}; args: ${args.join(", ")}`);
  }
}
