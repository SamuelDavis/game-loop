<script lang="ts">
  import { derived, writable } from "svelte/store";
  import { type Actor, Computer, Player } from "./actors";
  import { type Action, UseEnergy } from "./actions";
  import { createGameLoop } from "./game";
  import { GainEnergy } from "./actions.js";

  const actors: Actor[] = new Array(5)
    .fill(undefined)
    .map((_, i) => (i === 0 ? new Player(i) : new Computer(i)));
  const gameLoop = createGameLoop(actors);
  const actor = writable<Actor>(gameLoop.next().value?.actor ?? null);
  const history = writable<{ actorId: Actor["id"]; action: Action }[]>([]);
  const needsInput = derived([actor], ([actor]) => actor instanceof Player);

  function processGame(action: Action = null) {
    const { value } = gameLoop.next(action as any);
    if (!value) return;
    actor.update((actor) => value?.actor ?? actor);
    history.update((history) => [...history, ...(value?.actions ?? [])]);
  }

  function onAction(cb: (actor: Actor) => Action) {
    let action: Action;
    try {
      action = new cb($actor);
    } catch (e) {
      alert(e.message);
      return;
    }
    processGame(action);
  }
</script>

<main>
  <button on:click={() => processGame()} disabled={$needsInput}>
    Advance
  </button>
  <button on:click={onAction.bind(null, UseEnergy)} disabled={!$needsInput}>
    Use Energy
  </button>
  <button on:click={onAction.bind(null, GainEnergy)} disabled={!$needsInput}>
    Gain Energy
  </button>
  <pre>{JSON.stringify($actor, null, 2)}</pre>
  <ol>
    {#each $history as history}
      <li>({history.actorId}) {history.action.name}</li>
    {/each}
  </ol>
</main>
