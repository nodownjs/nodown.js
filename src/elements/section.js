import { options } from "../parser";

export default function createSection(custom) {
  const type = custom ? "section-" + custom : "section";
  const disabledDiv = options?.horizontalAlignment?.disabled ?? false;
  const section = {
    type: type,
    children: disabledDiv
      ? []
      : [
          {
            type: "div",
            children: [
              {
                type: "sub-div",
                children: [],
              },
            ],
          },
        ],
  };
  return section;
}
