import { Client } from "@puyodead1/fosscord-gopnik/build/lib";
import BaseEvent from "../lib/BaseEvent";

export default class extends BaseEvent {
  constructor(public readonly client: Client) {
    super({
      event: "debug",
      once: false,
    });
  }

  public async execute(msg: string): Promise<void> {
    console.debug(msg);
  }
}
