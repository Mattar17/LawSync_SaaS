import { IconPlus } from "@tabler/icons-react";

interface AddTileProps {
  label: string;
  onClick: () => void;
}

export default function AddTile({ label, onClick }: AddTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[#B8975A]/40 bg-transparent p-4 text-[#B8975A] transition-colors hover:border-[#B8975A] hover:bg-[#B8975A]/5"
    >
      <IconPlus className="h-10 w-10" strokeWidth={1.5} />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
