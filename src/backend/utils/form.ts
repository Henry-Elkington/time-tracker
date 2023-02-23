export function getStringFromForm(form: FormData, name: string): string {
  const value = form.get(name);
  if (typeof value !== "string" || value.length < 1) throw new Error("bad data at" + name);
  return value;
}
