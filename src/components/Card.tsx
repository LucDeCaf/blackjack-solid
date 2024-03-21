import { Show, type Component, type ParentComponent } from "solid-js";
import { type Card, Suit } from "../types";
import { twMerge } from "tailwind-merge";

type CardProps = {
  shown: boolean;
  class?: string;
} & Card;

const BaseCard: ParentComponent<{ class?: string }> = (props) => {
  return (
    <div
      class={twMerge(
        "select-none w-24 bg-white rounded-md text-4xl aspect-card grid place-items-center border-4",
        props.class
      )}
    >
      {props.children}
    </div>
  );
};

const Card: Component<CardProps> = (props) => {
  let symbol: string;
  switch (props.value) {
    case 1:
      symbol = "A";
      break;
    case 11:
      symbol = "J";
      break;
    case 12:
      symbol = "Q";
      break;
    case 13:
      symbol = "K";
      break;
    default:
      symbol = props.value.toString();
      break;
  }

  return (
    <>
      <Show when={!props.shown}>
        <BaseCard class={twMerge("border-slate-400", props.class)}></BaseCard>
      </Show>
      <Show when={props.shown}>
        <BaseCard
          class={twMerge(
            props.suit === Suit.CLUBS || props.suit === Suit.SPADES
              ? "border-slate-300 text-slate-300"
              : "border-red-300 text-red-300",
            props.class
          )}
        >
          {symbol}
        </BaseCard>
      </Show>
    </>
  );
};

export { Card, BaseCard };
