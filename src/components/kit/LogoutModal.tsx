import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";

interface LogoutModalProps {
  open: boolean;
  onClose: () => void;
}

export function LogoutModal({ open, onClose }: LogoutModalProps) {
  const [loading, setLoading] = useState(false);
  const signOut = useAuthStore((s) => s.signOut);
  const navigate = useNavigate();

  const handleLogout = () => {
    setLoading(true);
    window.setTimeout(() => {
      signOut();
      setLoading(false);
      onClose();
      navigate("/login");
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? onClose() : undefined)}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Heading out?</DialogTitle>
          <DialogDescription>
            You can always come back. Your page stays live while you're away.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="ghost" onClick={onClose}>
            Stay here
          </Button>
          <Button
            variant="destructive"
            loaderClick
            isLoading={loading}
            onClick={handleLogout}
          >
            Log out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
