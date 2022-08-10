import Fosscord from "@puyodead1/fosscord-gopnik";
import "dotenv/config";
import path from "path";
import fs from "fs";
import BaseEvent from "./lib/BaseEvent";
import { Client } from "@puyodead1/fosscord-gopnik/build/lib";

const client = new Fosscord.Client({
  intents: [],
  http: {
    api: "https://fosscord-staging.thearcanebrony.net/api",
    cdn: "https://fosscord-staging.thearcanebrony.net",
    invite: "https://fosscord-staging.thearcanebrony.net",
    template: "https://fosscord-staging.thearcanebrony.net",
  },
});

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter((f) => f.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event: new <T extends BaseEvent>(client: Client) => T = require(filePath).default;
  const eventInstance = new event(client);
  if (eventInstance.options.once)
    client.once(eventInstance.options.event, (...args) => eventInstance.execute(...args));
  else client.on(eventInstance.options.event, (...args) => eventInstance.execute(...args));
  console.log(`[Event Load] Loaded event ${eventInstance.options.event}!`);
}

client.login(process.env.TOKEN);
