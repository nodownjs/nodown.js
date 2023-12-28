export default function createBlockCode(
  line,
  blockCodeContent,
  blockCodeLanguage
) {
  const blockCode = {
    type: "block-code",
    language: blockCodeLanguage,
    children: blockCodeContent.map((c) => {
      return {
        type: "text",
        children: c,
      };
    }),
  };
  return blockCode;
}
