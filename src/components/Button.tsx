import { type ParentComponent } from "solid-js";
import { twMerge } from "tailwind-merge";

const Button: ParentComponent<{
  class?: string;
  onclick: (
    e: MouseEvent & {
      currentTarget: HTMLButtonElement;
      target: Element;
    }
  ) => any;
}> = (props) => {
  return (
    <button
      onclick={props.onclick}
      class={twMerge(
        "bg-slate-300 rounded-md  h-8 px-6 text-slate-600",
        props.class
      )}
    >
      {props.children}
    </button>
  );
};

export { Button }
