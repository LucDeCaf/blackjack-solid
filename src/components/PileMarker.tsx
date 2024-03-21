import { Component } from "solid-js";
import { twMerge } from "tailwind-merge";

const PileMarker: Component<{ class?: string }> = (props) => {
  return (
    <div
      class={twMerge(
        "w-24 aspect-card rounded-md h-max border-4 border-slate-200 border-dashed",
        props.class
      )}
    ></div>
  );
};

export { PileMarker };
