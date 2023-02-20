import { Conclude, type Action, UseEnergy, GainEnergy } from "./actions";
import { NotEnoughEnergy } from "./errors";

export interface Actor {
  id: number;
  energy: number;
  get action();
  set action(action: Action);
}

abstract class AbstractActor implements Actor {
  constructor(public readonly id: number, public energy = 0) {}

  abstract get action();

  abstract set action(action: Action);
}

export class Computer extends AbstractActor implements Actor {
  get action() {
    try {
      return new UseEnergy(this);
    } catch (e) {
      if (e instanceof NotEnoughEnergy) return new GainEnergy(this);
    }
    return new Conclude(this);
  }

  set action(_: Action) {}
}

export class Player extends AbstractActor implements Actor {
  _action: Action;

  get action() {
    const { _action } = this;
    this._action = null;
    return _action;
  }
  set action(action: Action) {
    this._action = action;
  }
}
