export default function HighlightsList({ items }: { items: string[] }) {
  return (
    <ul className="list-none p-0">
      {items.map((item) => (
        <li key={item} className="font-medium before:mr-2 fr-icon-check-line">
          {item}
        </li>
      ))}
    </ul>
  );
}
