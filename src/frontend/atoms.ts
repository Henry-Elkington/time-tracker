import { cx } from "class-variance-authority";

// Text
const textBase = cx("text-gray-600");
const textMedium = cx("text-base", textBase);
const textLarge = cx("text-2xl", textBase);

const text = {
  base: textBase,
  medium: textMedium,
  large: textLarge,
};

export const atoms = {
  text: text,
};
