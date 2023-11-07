export default function createSection(line) {
  const section = {
    type: "section",
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
