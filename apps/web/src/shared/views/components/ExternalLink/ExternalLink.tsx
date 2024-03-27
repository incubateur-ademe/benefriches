import { ReactNode } from "react";

type ExternalLinkProps = {
  href: string;
  children: ReactNode;
};

export default function ExternalLink({ href, children }: ExternalLinkProps) {
  return (
    <a href={href} rel="noopener noreferrer" target="_blank">
      {children}
    </a>
  );
}
