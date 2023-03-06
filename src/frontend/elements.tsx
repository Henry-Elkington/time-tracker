import { Component, JSX, splitProps } from "solid-js";
import { twMerge } from "tailwind-merge";

/* Card
  ============================================ */

export const Card: Component<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
  const [styleProps, elementProps] = splitProps(props, ["class"]);
  return <div class={twMerge("rounded border border-neutral-300 bg-white p-4", styleProps.class)} {...elementProps} />;
};

/* Input
  ============================================ */

export const Input: Component<JSX.InputHTMLAttributes<HTMLInputElement> & { inputInvalid?: boolean }> = (props) => {
  const [styleProps, elementProps] = splitProps(props, ["class"]);
  // border-red-300 text-red-600 focus:ring-red-400 focus-visible:border-red-400
  return (
    <input
      class={twMerge(
        "rounded-sm border border-neutral-300 bg-white py-0.5 px-2 outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-1 focus-visible:border-neutral-400 disabled:bg-neutral-100 disabled:text-neutral-400",
        styleProps.class
      )}
      {...elementProps}
    />
  );
};

/* Button
  ============================================ */

export const Button: Component<JSX.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
  const [styleProps, elementProps] = splitProps(props, ["class"]);
  return (
    // bg-white active:bg-neutral-100
    <button
      class={twMerge(
        "rounded-sm border border-neutral-300 bg-neutral-100 py-0.5 px-2 outline-none hover:border-neutral-400 focus:ring-1 focus:ring-blue-400 focus:ring-offset-1 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:hover:border-neutral-300",
        styleProps.class
      )}
      {...elementProps}
    />
  );
};

/* Label
  ============================================ */

export const Label: Component<JSX.LabelHTMLAttributes<HTMLLabelElement>> = (props) => {
  const [styleProps, elementProps] = splitProps(props, ["class"]);
  return (
    // after:ml-0.5 after:text-red-500 after:content-['*']    text-sm text-red-600
    <label class={twMerge("block text-sm font-medium text-neutral-700", styleProps.class)} {...elementProps} />
  );
};
