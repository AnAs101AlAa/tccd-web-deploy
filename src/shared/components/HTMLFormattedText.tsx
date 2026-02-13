import DOMPurify from "dompurify";
import parse, { domToReact, Element } from "html-react-parser";

type RenderHtmlProps = {
  content: string;
  className?: string;
};

export function HTMLFormattedText({ content, className }: RenderHtmlProps) {
  if (!content) return null;

  // Transform custom markup to HTML tags
  const transformCustomMarkup = (text: string): string => {
    return text
      .replace(/\*b\*(.*?)\*b\*/g, "<b>$1</b>") // Bold
      .replace(/\*i\*(.*?)\*i\*/g, "<i>$1</i>") // Italic
      .replace(/\*u\*(.*?)\*u\*/g, "<u>$1</u>") // Underline
      .replace(/\*br\*/g, "<br />"); // Line break
  };

  const decodeHtmlEntities = (str: string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  };

  const decoded = /&lt;|&gt;|&amp;/.test(content)
    ? decodeHtmlEntities(content)
    : content;

  // Transform custom markup before sanitizing
  const transformed = transformCustomMarkup(decoded);

  const safeHtml = DOMPurify.sanitize(transformed, {
    ALLOWED_TAGS: [
      "b",
      "strong",
      "i",
      "em",
      "br",
      "p",
      "ul",
      "ol",
      "li",
      "a",
      "u",
    ],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });

  const reactNodes = parse(safeHtml, {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.name === "a") {
        const props = domNode.attribs || {};
        return (
          <a
            href={props.href}
            target={props.target || "_blank"}
            rel={props.rel || "noopener noreferrer"}
            className={` ${
              className || "underline text-primary font-semibold"
            }`}
          >
            {domToReact(
              domNode.children as import("html-react-parser").DOMNode[]
            )}
          </a>
        );
      }
      return undefined;
    },
  });

  return <>{reactNodes}</>;
}
