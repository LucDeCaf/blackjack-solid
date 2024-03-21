export enum Suit {
  CLUBS,
  DIAMONDS,
  HEARTS,
  SPADES,
}

export type Card = {
  value: number;
  suit: Suit;
};

export type Setter<T> = (v: T | ((prev: T) => T)) => T;
