import { Component, JSX, ParentComponent, children } from "solid-js";
import { splitProps } from "solid-js";
import { ErrorLabel, Label, Input } from "./elements";

/* Input
  ============================================ */

export const InputComponent: Component<
  JSX.InputHTMLAttributes<HTMLInputElement> & {
    invalid: boolean;
    lableText: string;
    errorMessage: string;
  }
> = (props) => {
  const [styleProps, customProps, elementProps] = splitProps(
    props,
    ["class"],
    ["invalid", "lableText", "errorMessage"]
  );
  return (
    <div>
      <Label invalid={customProps.invalid}>{customProps.lableText}</Label>
      <Input invalid={customProps.invalid} class={styleProps.class} {...elementProps} />
      <ErrorLabel>{customProps.errorMessage}</ErrorLabel>
    </div>
  );
};

/* Page
  ============================================ */

export const Page: ParentComponent<{
  title: string;
}> = (props) => {
  return (
    <>
      <h1 class="p-4 py-5 text-4xl">{props.title}</h1>
      <hr class="border-neutral-300 py-3" />
      {props.children}
    </>
  );
};
