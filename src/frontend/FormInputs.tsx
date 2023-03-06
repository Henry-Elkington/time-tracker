import type { Component } from "solid-js";
import type { FormError } from "solid-start";
import { For, Show } from "solid-js";

import { Button, Input, Label } from "./elements";

export const FormInputs: Component<{
  hiddenInputs?: { name: string; value: string }[];
  inputs: { label?: string; props: { name: string; value?: string; type: string; required?: boolean } }[];
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
            <Label class="flex flex-col">
              {input?.label}
              <Input
                type={input.props.type}
                name={input.props.name}
                required={input.props.required}
                // placeholder="you@example.com"
                value={input.props.value ?? ""}
              />
            </Label>
            <Show when={props.errors?.fieldErrors?.[input.props.name]}>
              <p class="text-red-500">{props.errors!.fieldErrors![input.props.name]}</p>
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
          <p class="text-red-500">{props.errors!.message}</p>
        </Show>
      </div>
    </>
  );
};
