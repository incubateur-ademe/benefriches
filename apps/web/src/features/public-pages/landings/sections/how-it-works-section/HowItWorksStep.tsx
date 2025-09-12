type StepProps = {
  emoji: string;
  title: string;
  children: React.ReactNode;
};

function HowItWorksStep({ emoji, title, children }: StepProps) {
  return (
    <article className="flex flex-col gap-2">
      <span className="text-4xl" aria-hidden="true">
        {emoji}
      </span>
      <h3 className="m-0 text-xl">{title}</h3>
      <p className="m-0 text-sm">{children}</p>
    </article>
  );
}

export default HowItWorksStep;
