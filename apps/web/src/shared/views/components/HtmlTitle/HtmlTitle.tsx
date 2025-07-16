type Props = {
  children: string;
};
const HtmlTitle = ({ children }: Props) => {
  return <title>{`${children} - Bénéfriches`}</title>;
};

export default HtmlTitle;
