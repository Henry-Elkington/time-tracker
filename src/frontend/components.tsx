import { Component, ParentComponent, JSX, For } from "solid-js";
import { splitProps } from "solid-js";
import { A } from "solid-start";
import { twMerge } from "tailwind-merge";

/* Card
  ============================================ */

export const cardStyles = "border border-neutral-300 bg-white";

export const Card: Component<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
  const [customProps, elementProps] = splitProps(props, ["class"]);
  return <div class={twMerge(cardStyles, customProps.class)} {...elementProps} />;
};

/* Button
  ============================================ */

export const buttonStyles =
  "rounded-sm border border-neutral-300 bg-neutral-100 py-0.5 px-2 outline-none hover:border-neutral-400 focus:ring-2 focus:ring-blue-200 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:hover:border-neutral-300";

export const Button: Component<JSX.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }> = (props) => {
  const [customProps, elementProps] = splitProps(props, ["class", "children", "loading"]);
  return (
    <button
      class={twMerge(buttonStyles, customProps.class)}
      {...elementProps}
      children={customProps.loading ? "loading..." : customProps.children}
    />
  );
};

/* Input
  ============================================ */

export const Input: Component<JSX.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean; left?: JSX.Element }> = (
  props
) => {
  const [customProps, elementProps] = splitProps(props, ["class", "invalid", "left"]);
  return (
    <div class="flex items-stretch">
      <input
        class={twMerge(
          "m-0 rounded-sm border border-neutral-300 bg-white py-0.5 px-2 outline-none focus-within:border-neutral-300 hover:border-neutral-400 hover:read-only:border-neutral-300 focus:ring-2 focus:ring-blue-200 read-only:focus:ring-0 read-only:focus-visible:border-neutral-300 disabled:bg-neutral-100 disabled:text-neutral-400 hover:disabled:border-neutral-300",
          customProps.left ? "rounded-r-none" : "",
          customProps.invalid ? "border-red-300 bg-red-50 focus:ring-red-200 focus-visible:border-red-400" : "", //focus:ring-red-400 focus-visible:border-red-400 border-red-300 text-red-600
          customProps.class
        )}
        {...elementProps}
      />
      {customProps.left}
    </div>
  );
};

/* Label
  ============================================ */

export const Label: Component<JSX.LabelHTMLAttributes<HTMLLabelElement> & { invalid: boolean }> = (props) => {
  const [customProps, elementProps] = splitProps(props, ["class", "invalid"]);
  return (
    <label
      class={twMerge(
        "block",
        customProps.invalid ? "after:ml-1 after:text-red-600 after:content-['*']" : "",
        customProps.class
      )}
      {...elementProps}
    />
  );
};

/* Error Label
  ============================================ */

export const ErrorLabel: Component<JSX.HTMLAttributes<HTMLParagraphElement>> = (props) => {
  return <p class={twMerge("block text-sm text-red-600")} {...props} />;
};

/* InputComponent
  ============================================ */

export const InputComponent: Component<
  JSX.InputHTMLAttributes<HTMLInputElement> & {
    invalid: boolean;
    lableText: string;
    errorMessage: string;
  }
> = (props) => {
  const [customProps, elementProps] = splitProps(props, ["class", "invalid", "lableText", "errorMessage"]);
  return (
    <div>
      <Label invalid={customProps.invalid}>{customProps.lableText}</Label>
      <Input invalid={customProps.invalid} class={customProps.class} {...elementProps} />
      <ErrorLabel>{customProps.errorMessage}</ErrorLabel>
    </div>
  );
};

/* NavBar
  ============================================ */

/* Page
  ============================================ */

const PageTab: Component<{ href: string; title: string }> = (props) => {
  return (
    <A href={props.href} end class="border-b border-neutral-300 p-2" activeClass="border-neutral-600 border-b-2">
      {props.title}
    </A>
  );
};

export const Page: ParentComponent<{
  title: string;
  right?: JSX.Element;
}> = (props) => {
  return (
    <>
      <nav class="mb-2 flex items-center justify-between border-b border-neutral-300">
        <h1 class="p-2 text-2xl">{props.title}</h1>
        {props.right}
      </nav>
      {props.children}
    </>
  );
};
