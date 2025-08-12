import { exec } from "child_process";
import { EmbedBuilder, Message } from "discord.js";
import BaseClient from "../lib/BaseClient";
import BaseCommand from "../lib/BaseCommand";

export default class extends BaseCommand {
    constructor(public readonly client: BaseClient) {
        super({
            name: "git",
            description: "Retrieve bot Git information",
        });
    }

    getBranch(): Promise<string> {
        return new Promise((resolve, reject) => {
            exec("git rev-parse --abbrev-ref HEAD", (err, stdout, _) => {
                if (err) reject(err);

                resolve(stdout.replace("\n", ""));
            });
        });
    }

    getCommit(): Promise<string> {
        return new Promise((resolve, reject) => {
            exec("git rev-parse HEAD", (err, stdout, _) => {
                if (err) reject(err);

                resolve(stdout.replace("\n", ""));
            });
        });
    }

    public async execute(msg: Message): Promise<any> {
        if (!msg.channel.isSendable()) return;
        const commit = await this.getCommit();
        const branch = await this.getBranch();

        const embed = new EmbedBuilder()
            .addFields([
                {
                    name: "Current Branch",
                    value: branch,
                },
                {
                    name: "Commit",
                    value: commit,
                },
            ])
            .setTimestamp()
            .setColor("Purple");

        await msg.channel.send({
            embeds: [embed],
        });
    }
}
