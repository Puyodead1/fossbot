import { Client } from "@puyodead1/fosscord-gopnik/build/lib";
import BaseEvent from "../lib/BaseEvent";

export default class extends BaseEvent {
  constructor(public readonly client: Client) {
    super({
      event: "error",
      once: false,
    });
  }

  public async execute(msg: string): Promise<void> {
    console.error(msg);
  }
}
