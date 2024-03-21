import { type Component, For, Match, Switch, createEffect } from "solid-js";
import { createSignal, onMount } from "solid-js";
import { Button } from "./components/Button";
import { Card as VisualCard } from "./components/Card";
import type { Card, Setter } from "./types";

function shuffle<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const generateCards = (): Card[] => {
  const cards = [];

  let suit: number;
  for (let value = 1; value < 14; value++) {
    for (suit = 0; suit < 4; suit++) {
      const newCard = { value, suit };

      cards.push(newCard);
    }
  }

  shuffle(cards);

  return cards;
};

const total = (cards: Card[]): number => {
  let total = 0;
  let aces = 0;

  for (let i = 0; i < cards.length; i++) {
    if (cards[i].value === 1) {
      aces++;
    } else {
      if (cards[i].value >= 10) {
        total += 10;
      } else {
        total += cards[i].value;
      }
    }
  }

  for (let i = 0; i < aces; i++) {
    if (total + 11 > 21) {
      total++;
    } else {
      total += 11;
    }
  }

  return total;
};

const App: Component = () => {
  const [deck, setDeck] = createSignal(generateCards());
  const [playerHand, setPlayerHand] = createSignal<VisualCard[]>([]);
  const [dealerHand, setDealerHand] = createSignal<VisualCard[]>([]);

  const [showDealerHand, setShowDealerHand] = createSignal(false);
  const [outputMessage, setOutputMessage] = createSignal("");

  function dealOne(setTarget: Setter<VisualCard[]>) {
    setTarget((prev) => [deck()[0], ...prev]);
    setDeck((prev) => Array.from(prev.slice(1)));
    if (deck().length === 0) {
      setDeck(generateCards());
      setOutputMessage("Shuffled");
      setTimeout(() => setOutputMessage(""), 1000);
    }
  }

  function win() {
    setOutputMessage("Player Wins");
    setShowDealerHand(true);
  }

  function lose() {
    setOutputMessage("Dealer Wins");
    setShowDealerHand(true);
  }

  function push() {
    setOutputMessage("Pushed");
    setShowDealerHand(true);
  }

  function playerBlackjack() {
    setOutputMessage("Blackjack!");
    setShowDealerHand(true);
  }

  function dealerBlackjack() {
    setOutputMessage("Blackjack");
    setShowDealerHand(true);
  }

  function hit() {
    dealOne(setPlayerHand);

    const sum = total(playerHand());

    if (sum > 21) {
      lose();
      return;
    }

    if (playerHand().length >= 5) {
      win();
      return;
    }
  }

  function call() {
    setShowDealerHand(true);

    const playerTotal = total(playerHand());

    while (total(dealerHand()) < 17) {
      dealOne(setDealerHand);

      if (total(dealerHand()) > 21) {
        win();
        return;
      }
    }

    const dealerTotal = total(dealerHand());

    if (dealerHand().length >= 5 || dealerTotal > playerTotal) {
      lose();
      return;
    }

    if (dealerTotal < playerTotal) {
      win();
      return;
    }

    push();
  }

  createEffect(() => console.log(deck().length));

  function restart() {
    setDeck(generateCards());
    dealNew();
    setOutputMessage("Shuffled");
    setTimeout(() => setOutputMessage(""), 1000);
  }

  function dealNew() {
    setShowDealerHand(false);
    setOutputMessage("");

    setPlayerHand([]);
    setDealerHand([]);

    dealOne(setPlayerHand);
    dealOne(setPlayerHand);

    dealOne(setDealerHand);
    dealOne(setDealerHand);

    const blackjackPlayer = total(playerHand()) === 21;
    const blackjackDealer = total(dealerHand()) === 21;

    if (blackjackPlayer && blackjackDealer) {
      push();
      return;
    }

    if (blackjackPlayer) {
      playerBlackjack();
      return;
    }

    if (blackjackDealer) {
      dealerBlackjack();
      return;
    }
  }

  onMount(() => restart());

  return (
    <main class=" p-16 h-screen">
      <div class="relative flex flex-col items-center justify-between h-full">
        <div class="flex flex-col items-center gap-4">
          <div class="flex gap-8">
            <For each={[...dealerHand()].reverse()}>
              {(card) => <VisualCard shown={showDealerHand()} {...card} />}
            </For>
          </div>

          <span class="text-slate-400 text-xl">
            {showDealerHand() ? total(dealerHand()) : ""}
          </span>
        </div>

        <div class="grid place-items-center">
          <span class="text-4xl text-slate-400">{outputMessage()}</span>
        </div>

        <div class="flex flex-col items-center gap-2">
          <span class="text-slate-400 text-xl">{total(playerHand())}</span>

          <div class="flex gap-8 mb-4">
            <For each={[...playerHand()].reverse()}>
              {(card) => <VisualCard shown={true} {...card} />}
            </For>
          </div>

          <div class="flex gap-4">
            <Switch>
              <Match when={showDealerHand()}>
                <Button onclick={dealNew}>New Hand</Button>
              </Match>

              <Match when={!showDealerHand()}>
                <Button onclick={hit}>Hit</Button>
                <Button onclick={call}>Call</Button>
              </Match>
            </Switch>
          </div>
        </div>
      </div>
    </main>
  );
};

export default App;
