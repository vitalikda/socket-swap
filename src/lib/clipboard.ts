export const copyToClipboard = async (text: string) => {
  if (!navigator.clipboard) {
    console.info("Clipboard not supported");
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    return text;
  } catch (error) {
    console.info("Copy failed", error);
    console.info("Text value", text);
    return;
  }
};
