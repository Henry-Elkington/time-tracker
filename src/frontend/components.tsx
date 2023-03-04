import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import { cva, cx, type VariantProps } from "class-variance-authority";
import { atoms } from "~/frontend/atoms";
import { For } from "solid-js";

/* Button
  ============================================ */

// Styles
export const buttonStyles = cva([
  "bg-gray-100 border border-gray-300 rounded-sm py-0.5 px-2", //active:bg-gray-100
  "hover:border-gray-400",
  "outline-none focus:ring-blue-400 focus:ring-1 focus:ring-offset-1",
  "disabled:text-gray-400 disabled:bg-gray-100 disabled:hover:border-gray-300",
  atoms.text.medium,
]);

// Types
export type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonStyles>;

// Component
export const Button: Component<ButtonProps> = (props) => {
  const [styleProps, customProps, buttonProps] = splitProps(props, [], []);

  return <button class={buttonStyles()} {...buttonProps} />;
};

/* Input
  ============================================ */

// Styles
export const inputStyles = cva([
  "bg-white border rounded-sm py-0.5 px-2 outline-none",
  "border-gray-300",
  "disabled:bg-gray-100 disabled:text-gray-400",
  "focus-visible:border-gray-400",
  "focus:ring-blue-400 focus:ring-1 focus:ring-offset-1",
  "invalid:text-red-600 invalid:border-red-300",
  "invalid:focus-visible:border-red-400",
  "invalid:focus:ring-red-400",
  atoms.text.medium,
]);

// Types
export type InputProps = JSX.InputHTMLAttributes<HTMLInputElement> & VariantProps<typeof inputStyles>;

// Component
export const Input: Component<InputProps> = (props) => {
  const [styleProps, customProps, inputProps] = splitProps(props, [], []);

  return <input class={inputStyles()} {...inputProps} />;
};

// <label class="block">
//  <span
//   class={cx(
//     "block text-sm font-medium text-gray-700",
//     styleProps.inputState === "error" ? "after:ml-0.5 after:text-red-500 after:content-['*']" : ""
//   )}
// >
//   {" "}
//   {customProps.label}
// </span>
// <p class="text-sm text-red-600 ">{customProps.error}</p>

// </label>
