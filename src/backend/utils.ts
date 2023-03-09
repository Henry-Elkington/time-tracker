import type { z } from "zod";
import { FormError } from "solid-start";

export const validateFields = async <T>(formData: FormData, schema: z.Schema<T>): Promise<T> => {
  const fields = Object.fromEntries(formData);
  const data = await schema.spa(fields);
  if (!data.success) {
    const fieldErrors = data.error.flatten((issue) => issue.message).fieldErrors;
    throw new FormError("Fields invalid", { fieldErrors, fields });
  }
  return data.data;
};

export const validateArrayFields = async <T>(formData: FormData, schema: z.Schema<T>): Promise<T> => {
  const fields = Object.fromEntries(formData);
  const data = await schema.spa(fields);
  if (!data.success) {
    const fieldErrors = data.error.flatten((issue) => issue.message).fieldErrors;
    throw new FormError("Fields invalid", { fieldErrors, fields });
  }
  return data.data;
};
