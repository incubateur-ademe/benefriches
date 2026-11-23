import { useEffect } from "react";

import { siteUrl } from "@/app/seo.json";

const SITE_URL = siteUrl.replace(/\/+$/, "");
const DEFAULT_DESCRIPTION = "Bénéfriches quantifie et monétarise les impacts …"; // celle de index.html

type Attr = { name: "name" | "property" | "rel"; value: string };

function upsert(tag: "meta" | "link", key: Attr, valueAttr: "content" | "href", value?: string) {
  const selector = `${tag}[${key.name}="${key.value}"]`;
  let el = document.head.querySelector<HTMLElement>(selector);
  if (value === undefined) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement(tag);
    el.setAttribute(key.name, key.value);
    document.head.appendChild(el);
  }
  el.setAttribute(valueAttr, value);
}

type Props = { title: string; description?: string | null; path?: string; noindex?: boolean };

export function Seo({ title, description, path, noindex }: Props) {
  useEffect(() => {
    const url = path !== undefined ? SITE_URL + path : undefined;

    document.title = title;
    upsert(
      "meta",
      { name: "name", value: "description" },
      "content",
      description ?? DEFAULT_DESCRIPTION,
    );
    upsert("meta", { name: "property", value: "og:title" }, "content", title);
    upsert(
      "meta",
      { name: "property", value: "og:description" },
      "content",
      description ?? DEFAULT_DESCRIPTION,
    );
    upsert("meta", { name: "property", value: "og:url" }, "content", url);
    upsert("link", { name: "rel", value: "canonical" }, "href", noindex ? undefined : url);
    upsert("meta", { name: "name", value: "robots" }, "content", noindex ? "noindex" : undefined);
  }, [title, description, path, noindex]);

  return null;
}
