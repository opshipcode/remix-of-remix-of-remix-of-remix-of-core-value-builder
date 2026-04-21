import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface Props {
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
  onDiscard?: () => void;
}

/** Sticky settings save bar: only meaningful when dirty. */
export function SettingsSaveBar({ dirty, saving, onSave, onDiscard }: Props) {
  return (
    <div
      className={`pointer-events-none sticky bottom-4 z-10 mt-6 flex justify-end transition-opacity ${
        dirty ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="kp-glass-strong pointer-events-auto flex items-center gap-2 rounded-full px-3 py-1.5 shadow-md">
        <span className="hidden text-xs text-muted-foreground sm:inline">Unsaved changes</span>
        {onDiscard && (
          <Button variant="ghost" size="sm" onClick={onDiscard} className="rounded-full">
            Discard
          </Button>
        )}
        <Button
          size="sm"
          loaderClick
          isLoading={saving}
          onClick={onSave}
          className="rounded-full"
        >
          <Save className="h-3.5 w-3.5" /> Save changes
        </Button>
      </div>
    </div>
  );
}
