import { cva, VariantProps } from "class-variance-authority";
import { Component, JSX, splitProps } from "solid-js";

/* Button
  ============================================ */

// Styles
export const buttonStyles = cva([
  "bg-gray-100 border border-gray-300 rounded-sm py-0.5 px-2", //active:bg-gray-100
  "hover:border-gray-400",
  "outline-none focus:ring-blue-400 focus:ring-1 focus:ring-offset-1",
  "disabled:text-gray-400 disabled:bg-gray-100 disabled:hover:border-gray-300",
]);

// Types
export type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonStyles>;

// Component
export const Button: Component<ButtonProps> = (props) => {
  const [styleProps, customProps, buttonProps] = splitProps(props, [], []);

  return <button class={buttonStyles()} {...buttonProps} />;
};
