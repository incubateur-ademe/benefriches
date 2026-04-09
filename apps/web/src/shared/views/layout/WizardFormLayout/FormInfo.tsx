import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  emoji?: "auto" | "info" | (string & Record<never, never>);
};

function FormInfo({ children, emoji = "info" }: Props) {
  return (
    <>
      <div className="text-[40px] my-4">
        {emoji === "info" ? "💡" : emoji === "auto" ? "🪄" : emoji}
      </div>
      <div className="[&_.title]:text-2xl [&_.title]:font-bold pt-4  [&_p]:py-4 [&_p]:m-0">
        {children}
      </div>
    </>
  );
}

export default FormInfo;
