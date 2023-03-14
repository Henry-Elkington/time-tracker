import type { Component, ParentComponent, JSX } from "solid-js";
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

/* Page
  ============================================ */

export const Page: ParentComponent<{
  title: string | undefined | JSX.Element;
  right?: JSX.Element;
  backbutton?: boolean;
}> = (props) => {
  return (
    <>
      <nav class="mx-4 flex items-center  justify-between border-b border-neutral-300 bg-white py-3">
        <h1 class="text-3xl">
          {props.backbutton ? (
            <A href="../" class="mr-2">
              &lt;{" "}
            </A>
          ) : (
            ""
          )}
          {props.title}
        </h1>
        {props.right}
      </nav>
      <div class="p-3 px-4 pb-[calc(4.5rem_+_1rem)]">{props.children}</div>
    </>
  );
};
