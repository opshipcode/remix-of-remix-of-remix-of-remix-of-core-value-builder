import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useProfilePhotoStore } from "@/store/profilePhoto";
import { toast } from "@/hooks/use-toast";

const ACCEPT = "image/png,image/jpeg,image/webp";
const MAX_BYTES = 5 * 1024 * 1024;

interface ProfilePhotoUploaderProps {
  /** Optional className for the trigger button wrapper. */
  className?: string;
}

export function ProfilePhotoUploader({ className }: ProfilePhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const photo = useProfilePhotoStore((s) => s.photo);
  const setPhoto = useProfilePhotoStore((s) => s.setPhoto);
  const [preview, setPreview] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const triggerPick = () => inputRef.current?.click();

  const handleFile = (file: File) => {
    if (!ACCEPT.split(",").includes(file.type)) {
      toast({
        title: "Unsupported image",
        description: "Please upload a PNG, JPG, or WebP image.",
      });
      return;
    }
    if (file.size > MAX_BYTES) {
      toast({
        title: "Image too large",
        description: "Image must be under 5MB.",
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result ?? "");
      setPreview(dataUrl);
      setOpen(true);
    };
    reader.onerror = () =>
      toast({ title: "Couldn't read image", description: "Try another file." });
    reader.readAsDataURL(file);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // reset so the same file can be re-picked
    if (file) handleFile(file);
  };

  const useThis = () => {
    if (!preview) return;
    setSaving(true);
    window.setTimeout(() => {
      setPhoto(preview);
      try {
        window.localStorage.setItem("kp_profile_photo", preview);
      } catch {
        /* ignore */
      }
      setSaving(false);
      setOpen(false);
      setPreview(null);
      toast({ title: "Profile photo updated" });
    }, 800);
  };

  const chooseAnother = () => {
    setOpen(false);
    setPreview(null);
    window.setTimeout(triggerPick, 60);
  };

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={onChange}
      />
      <Button
        variant="outline"
        type="button"
        onClick={triggerPick}
        className="w-full rounded-full"
      >
        {photo ? "Replace photo" : "Upload photo"}
      </Button>

      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!v) {
            setOpen(false);
            setPreview(null);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Crop preview</DialogTitle>
            <DialogDescription>
              Your photo will be cropped to a circle on your kit page.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 grid place-items-center">
            <div className="relative aspect-square w-full max-w-[280px] overflow-hidden rounded-2xl bg-surface-2">
              {preview && (
                <>
                  {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                  <img
                    src={preview}
                    alt="Profile preview"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 grid place-items-center"
                  >
                    <div className="h-[88%] w-[88%] rounded-full ring-2 ring-background shadow-[0_0_0_9999px_hsl(var(--background)/0.55)]" />
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              type="button"
              onClick={chooseAnother}
              className="flex-1 rounded-full"
            >
              Choose a different one
            </Button>
            <Button
              type="button"
              loaderClick
              isLoading={saving}
              onClick={useThis}
              className="flex-1 rounded-full"
            >
              Use this photo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** Avatar circle that reflects the latest profile photo from the store. */
export function ProfilePhotoCircle({
  size = 96,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const photo = useProfilePhotoStore((s) => s.photo);
  // hydrate from legacy key once, in case the user uploaded before the store existed
  const setPhoto = useProfilePhotoStore((s) => s.setPhoto);
  useEffect(() => {
    if (photo) return;
    try {
      const legacy = window.localStorage.getItem("kp_profile_photo");
      if (legacy) setPhoto(legacy);
    } catch {
      /* ignore */
    }
  }, [photo, setPhoto]);

  return (
    <div
      style={{ width: size, height: size }}
      className={`overflow-hidden rounded-full bg-surface-2 ${className ?? ""}`}
    >
      {photo ? (
        // eslint-disable-next-line jsx-a11y/img-redundant-alt
        <img
          src={photo}
          alt="Profile photo"
          className="h-full w-full object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="h-full w-full bg-gradient-to-br from-primary/40 to-primary-active/30"
        />
      )}
    </div>
  );
}
