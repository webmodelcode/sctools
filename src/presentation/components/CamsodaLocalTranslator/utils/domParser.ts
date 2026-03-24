export interface ITranslatedMessage {
  id: string;
  user: {
    name: string;
    avatar: string;
    color: string;
  };
  message: string;
  translation?: string;
}

export const parseCamsodaMessageNode = (
  node: Node,
): ITranslatedMessage | null => {
  const element = node as Element;
  const elementSpans = element.querySelectorAll("span");

  /**
   * The Div containing the messages always has 2 spans.
   * The first span contains the user's name and avatar
   * The second span contains the message
   */
  if (elementSpans.length !== 2) return null;

  const user = elementSpans[0].textContent?.trim();
  const message = elementSpans[1].textContent?.trim() ?? "";

  /**
   * Create id for the message by combining the user's name and the message
   * In the absence of a unique ID from Camsoda, this is the best that can be achieved with the available information.
   */
  const id = `${user?.replaceAll(" ", "-")}-${message?.replaceAll(" ", "-")}`;

  return {
    id,
    user: {
      name: user ?? "",
      avatar: elementSpans[0].querySelector("img")?.src ?? "",
      color: elementSpans[0].style.color,
    },
    message,
  };
};
