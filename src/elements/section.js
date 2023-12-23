export default function createSection(custom) {
  const type = custom ? "section-" + custom : "section";
  const section = {
    type: type,
    children: [
      {
        type: "div",
        children: [
          {
            type: "div",
            children: [],
          },
        ],
      },
    ],
  };
  return section;
}
