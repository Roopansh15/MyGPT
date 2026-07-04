import { LoaderCircle } from "lucide-react";

const Loader = ({ label = "", size = "md" }) => {
  const iconSize = size === "sm" ? 16 : 24;

  return (
    <div className="inline-flex items-center gap-2 text-sm text-zinc-300">
      <LoaderCircle className="animate-spin" size={iconSize} aria-hidden="true" />
      {label ? <span>{label}</span> : null}
    </div>
  );
};

export default Loader;

