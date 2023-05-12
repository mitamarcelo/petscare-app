import DOMPurify from "dompurify";

export const createMarkup = (html: string) => {
  return {
    __html: DOMPurify.sanitize(html),
  };
};
