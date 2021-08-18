import { useEffect } from "react";
import { createPortal } from "react-dom";

import useLifetimeObject from "./useLifetimeObject";

const serializer = new XMLSerializer();

/**
 * A component that renders its children to a data URI and sets adds it to the document head as a favicon
 * @param {object} params The component parameters
 * @param {string} params.type The type parameter of the link element
 * @param {string | DOMTokenList} params.sizes The sizes parameter of the link element
 * @param {string} params.media The media parameter of the link element
 * @param {import("react").ReactNode} params.children The svg to render into the icon
 * @returns {import("react").ReactNode} The rendered portal.
 */
export default function SVGIcon({ children = null, type = "image/svg+xml", sizes = "any", media = "" }) {
  var fragment = useLifetimeObject(() => document.createDocumentFragment());

  useEffect(() => {
    var link = document.createElement("link");
    link.rel = "icon";
    link.type = type;
    link.sizes = sizes;
    link.media = media;

    function updateIcon() {
      var source = serializer.serializeToString(fragment);
      var uri = `data:image/svg+xml;base64,${btoa(source)}`;
      link.href = uri;
    }

    var observer = new MutationObserver(updateIcon);

    observer.observe(fragment, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true
    });

    updateIcon();
    document.head.appendChild(link);

    return () => {
      observer.disconnect();
      document.head.removeChild(link);
    };
  }, [fragment, type, sizes, media]);

  return createPortal(
    children,
    fragment
  );
}