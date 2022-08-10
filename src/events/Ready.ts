import { Client } from "@puyodead1/fosscord-gopnik/build/lib";
import BaseEvent from "../lib/BaseEvent";

export default class extends BaseEvent {
  constructor(public readonly client: Client) {
    super({
      event: "ready",
      once: true,
    });
  }

  public async execute(): Promise<void> {
    console.log(`Logged in as ${this.client.user?.tag}`);
  }
}
