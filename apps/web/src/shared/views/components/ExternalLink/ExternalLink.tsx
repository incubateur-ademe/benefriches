type ExternalLinkProps = {
  href: string;
  children: string;
  title?: string;
  noFollow?: boolean;
  className?: string;
};

export default function ExternalLink({
  href,
  children,
  title,
  noFollow = false,
  className = "",
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      rel={noFollow ? "noopener noreferrer external nofollow" : "noopener noreferrer external"}
      className={className}
      target="_blank"
      title={title ?? `${children} - ouvre une nouvelle fenêtre`}
    >
      {children}
    </a>
  );
}
