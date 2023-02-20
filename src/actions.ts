import type { Actor } from "./actors";
import { NotEnoughEnergy } from "./errors";

export interface Action {
  perform(): null | Action;
  get name(): string;
}

abstract class AbstractAction implements Action {
  constructor(public readonly actor: Actor) {}
  abstract perform(): Action | null;
  get name(): string {
    return this.constructor.name;
  }
}

export class Conclude extends AbstractAction implements Action {
  perform(): Action | null {
    return null;
  }
}

export class GainEnergy extends AbstractAction implements Action {
  perform(): Action | null {
    this.actor.energy++;
    return new Conclude(this.actor);
  }
}

export class UseEnergy extends AbstractAction implements Action {
  constructor(actor: Actor) {
    super(actor);
    if (this.actor.energy <= 0) throw new NotEnoughEnergy(this.actor, this);
  }
  perform(): null | Action {
    this.actor.energy--;
    return new Conclude(this.actor);
  }
}
