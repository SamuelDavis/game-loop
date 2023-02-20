import type { Actor } from "./actors";
import type { Action } from "./actions";

export class NotEnoughEnergy extends Error {
  constructor(public readonly actor: Actor, public readonly action: Action) {
    super(`${actor.id} does not have enough enough energy to ${action.name}`);
  }
}
