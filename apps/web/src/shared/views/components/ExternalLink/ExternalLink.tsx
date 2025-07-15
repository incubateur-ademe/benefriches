type ExternalLinkProps = {
  href: string;
  children: string;
  title?: string;
  noFollow?: boolean;
};

export default function ExternalLink({
  href,
  children,
  title,
  noFollow = false,
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      rel={noFollow ? "noopener noreferrer external nofollow" : "noopener noreferrer external"}
      target="_blank"
      title={title ?? `${children} - ouvre une nouvelle fenêtre`}
    >
      {children}
    </a>
  );
}
