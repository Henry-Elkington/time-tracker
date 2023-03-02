import type { Component } from "solid-js";
import type { FormError } from "solid-start";
import { For, Show } from "solid-js";

export const FormInputs: Component<{
  inputs: { label?: string; props: { name: string; value?: string; type: string; required?: boolean } }[];
  submitLable?: string;
  errors?: FormError;
  pending: boolean;
}> = (props) => {
  return (
    <>
      <For each={props.inputs}>
        {(input) => (
          <div class="flex flex-col">
            <label class="flex flex-col">
              {input?.label}
              <input
                type={input.props.type}
                name={input.props.name}
                required={input.props.required}
                // placeholder="you@example.com"
                value={input.props.value ?? ""}
                class="block w-full border-gray-200  p-2 focus:border-blue-500 focus:ring-blue-500"
              />
            </label>
            <Show when={props.errors?.fieldErrors?.[input.props.name]}>
              <p class="text-red-500">{props.errors!.fieldErrors![input.props.name]}</p>
            </Show>
          </div>
        )}
      </For>
      <div class="mt-2 flex flex-col">
        <button type="submit" disabled={props.pending} class="border bg-gray-100 p-2">
          <Show when={props.pending} fallback={props.submitLable ? props.submitLable : "Submit"}>
            Loading...
          </Show>
        </button>
        <Show when={props.errors?.message}>
          <p class="text-red-500">{props.errors!.message}</p>
        </Show>
      </div>
    </>
  );
};
