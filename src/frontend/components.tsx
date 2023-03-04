import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import { cva, type VariantProps } from "class-variance-authority";
import { atoms } from "~/frontend/atoms";

// Styles
export const buttonStyles = cva([
  "bg-white px-2 border border-gray-300 hover:border-gray-400 rounded active:bg-gray-100 focus:ring-1",
  atoms.text.body,
]);

// Types
export type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonStyles>;

// Component
export const Button: Component<ButtonProps> = (props) => {
  const [customProps, buttonProps] = splitProps(props, []);

  return <button class={buttonStyles()} {...buttonProps} />;
};
