import { useState } from "react";
import { useParams } from "react-router-dom";
import { Lock } from "lucide-react";
import { Logo } from "@/components/kit/Logo";
import PublicKitPage from "./PublicKitPage";

export default function PrivateShare() {
  const { token } = useParams();
  const [unlocked, setUnlocked] = useState(false);
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  if (unlocked) return <PublicKitPage />;

  return (
    <div className="grid min-h-screen place-items-center bg-background p-6">
      <div className="kp-card w-full max-w-md p-8 md:p-10">
        <div className="flex items-center justify-between">
          <Logo />
          <span className="kp-mono text-xs text-muted-foreground">{token?.slice(0, 8)}…</span>
        </div>
        <div className="mt-8 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary-highlight text-primary">
            <Lock className="h-5 w-5" />
          </span>
          <h1 className="kp-display mt-5 text-2xl">Private creator page</h1>
          <p className="mt-2 text-sm text-muted-foreground">Enter the passphrase the creator shared with you.</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (pw.length >= 4) setUnlocked(true);
            else setError("That passphrase doesn't look right.");
          }}
          className="mt-6 space-y-4"
        >
          <input
            type="password"
            value={pw}
            onChange={(e) => { setPw(e.target.value); setError(""); }}
            placeholder="Passphrase"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
          <button className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover">
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
}
