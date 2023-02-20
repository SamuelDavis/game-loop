import type { Actor } from "./actors";
import type { Action } from "./actions";

export function* createGameLoop(actors: Actor[]) {
  let action: Action;
  for (let i = 0; true; i = ++i % actors.length) {
    const actor = actors[i];
    while (!(action = actor.action || action))
      actor.action = yield { actor, actions: [] };
    let actions = [action];
    while ((action = action.perform())) actions.push(action);
    action = yield {
      actor: actors[(i + 1) % actors.length],
      actions: actions.map((action) => ({
        actorId: actor.id,
        action,
      })),
    };
  }
}
