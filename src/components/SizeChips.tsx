import { PantsIcon, ShirtIcon, ShoeIcon } from "./Icons";

export function SizeChips({ shirt, pants, shoe }: { shirt: string | null; pants: string | null; shoe: string | null }) {
  const list = [
    { label: "Camisa", v: shirt, Icon: ShirtIcon },
    { label: "Calça", v: pants, Icon: PantsIcon },
    { label: "Calçado", v: shoe, Icon: ShoeIcon },
  ].filter((x) => x.v);
  if (list.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {list.map(({ label, v, Icon }) => (
        <span key={label} className="chip"><Icon className="h-4 w-4" /> {label}: {v}</span>
      ))}
    </div>
  );
}
