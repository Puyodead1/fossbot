import "dotenv/config";
import fs from "fs";
import path from "path";
import BaseClient from "./lib/BaseClient";
import BaseCommand from "./lib/BaseCommand";
import BaseEvent from "./lib/BaseEvent";

const client = new BaseClient({
    intents: [],
    rest: {
        api: "https://api.old.server.spacebar.chat/api",
        cdn: "https://cdn.old.server.spacebar.chat",
        version: "9",
    },
    config: {
        prefix: process.env.PREFIX,
    },
});

const eventsPath = path.join(__dirname, "events");
const commandsPath = path.join(__dirname, "commands");
const eventFiles = fs.readdirSync(eventsPath).filter((f) => f.endsWith(".js"));
const commandFiles = fs.readdirSync(commandsPath).filter((f) => f.endsWith(".js"));

// register events
for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event: new <T extends BaseEvent>(client: BaseClient) => T = require(filePath).default;
    const eventInstance = new event(client);
    if (eventInstance.options.once)
        client.once(eventInstance.options.event, (...args) => eventInstance.execute(...args));
    else client.on(eventInstance.options.event, (...args) => eventInstance.execute(...args));
    console.log(`[Event Load] Loaded event ${eventInstance.options.event}!`);
}

// register commands
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command: new <T extends BaseCommand>(client: BaseClient) => T = require(filePath).default;
    const cmdInstance = new command(client);
    client.commands.set(cmdInstance.options.name, cmdInstance);
    // handle aliases
    if (cmdInstance.options.aliases) {
        for (const alias of cmdInstance.options.aliases) {
            client.commands.set(alias, cmdInstance);
        }
    }
    console.log(`[Command Load] Loaded command ${cmdInstance.options.name}!`);
}

client.db
    .sync({ force: true })
    .then(async () => {
        console.log("Database synced, starting bot");
        await client.login(process.env.TOKEN);
    })
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
