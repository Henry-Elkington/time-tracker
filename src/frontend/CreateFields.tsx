import type { Component } from "solid-js";
import type { FormError } from "solid-start";
import { For, Show } from "solid-js";

import { Button, ErrorLabel, Input, Label } from "./elements";

export const CreateFields: Component<{
  hiddenInputs?: { name: string; value: string }[];
  inputs: { label?: string; props: { name: string; value?: string; type: string } }[];
  submitLable?: string;
  errors?: FormError;
  pending: boolean;
}> = (props) => {
  return (
    <>
      <For each={props?.hiddenInputs}>
        {(hiddenInput) => <input type="hidden" name={hiddenInput.name} value={hiddenInput.value} />}
      </For>
      <For each={props.inputs}>
        {(input) => (
          <div class="flex flex-col">
            <Label invalid={props.errors?.fieldErrors?.[input.props.name] !== undefined}>{input?.label}</Label>
            <Input
              type={input.props.type}
              name={input.props.name}
              invalid={props.errors?.fieldErrors?.[input.props.name] !== undefined}
              // placeholder="you@example.com"
              value={input.props.value ?? ""}
            />
            <Show when={props.errors?.fieldErrors?.[input.props.name]}>
              <ErrorLabel>{props.errors!.fieldErrors![input.props.name]}</ErrorLabel>
            </Show>
          </div>
        )}
      </For>
      <div class="mt-3 flex flex-col">
        <Button type="submit" disabled={props.pending}>
          <Show when={props.pending} fallback={props.submitLable ? props.submitLable : "Submit"}>
            Loading...
          </Show>
        </Button>
        <Show when={props.errors?.message}>
          <ErrorLabel>{props.errors!.message}</ErrorLabel>
        </Show>
      </div>
    </>
  );
};
