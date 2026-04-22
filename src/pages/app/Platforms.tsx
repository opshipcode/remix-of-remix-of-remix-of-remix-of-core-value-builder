import { useState } from "react";
import { AppHeader, AppPage } from "@/components/app/AppPage";
import { AppPageSkeleton } from "@/components/kit/AppPageSkeleton";
import { useKitPageStore, type ConnectedPlatform, type PlatformId } from "@/store/kitPage";
import { usePageLoader } from "@/hooks/usePageLoader";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Music2, Instagram, Youtube, Plus, Unlink, RefreshCw, ShieldCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ICONS: Record<PlatformId, typeof Instagram> = {
  tiktok: Music2,
  instagram: Instagram,
  youtube: Youtube,
};

const ALL_PLATFORMS: { id: PlatformId; label: string }[] = [
  { id: "tiktok", label: "TikTok" },
  { id: "instagram", label: "Instagram" },
  { id: "youtube", label: "YouTube" },
];

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

export default function Platforms() {
  const { loading } = usePageLoader();
  const data = useKitPageStore((s) => s.data);
  const setData = useKitPageStore((s) => s.setData);

  const [addOpen, setAddOpen] = useState(false);
  const [pickerPlatform, setPickerPlatform] = useState<PlatformId>("tiktok");
  const [handle, setHandle] = useState("");
  const [followers, setFollowers] = useState("");
  const [connecting, setConnecting] = useState(false);

  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const [confirmDisconnect, setConfirmDisconnect] = useState<ConnectedPlatform | null>(null);
  const [disconnecting, setDisconnecting] = useState(false);

  if (loading) {
    return (
      <AppPage>
        <AppPageSkeleton cards={3} />
      </AppPage>
    );
  }

  const handleConnect = () => {
    setConnecting(true);
    window.setTimeout(() => {
      const next: ConnectedPlatform = {
        id: `p_${Date.now()}`,
        platform: pickerPlatform,
        handle: handle || `@new_${pickerPlatform}`,
        followers: Number(followers) || 0,
        avgViews: 0,
        engagementRate: 0,
        visible: true,
        selfReported: !!followers,
        label: "Backup",
        labelChangedAt: new Date().toISOString(),
      };
      setData({ platforms: [...data.platforms, next] });
      setConnecting(false);
      setAddOpen(false);
      setHandle("");
      setFollowers("");
      toast({ title: "Platform connected", description: `${pickerPlatform} added.` });
    }, 1100);
  };

  const handleDisconnect = () => {
    if (!confirmDisconnect) return;
    setDisconnecting(true);
    window.setTimeout(() => {
      setData({ platforms: data.platforms.filter((p) => p.id !== confirmDisconnect.id) });
      setDisconnecting(false);
      setConfirmDisconnect(null);
      toast({ title: "Disconnected", description: `${confirmDisconnect.platform} removed.` });
    }, 900);
  };

  const handleRefresh = (p: ConnectedPlatform) => {
    setRefreshingId(p.id);
    window.setTimeout(() => {
      setRefreshingId(null);
      toast({ title: "Stats refreshed", description: `${p.platform} updated.` });
    }, 900);
  };

  return (
    <AppPage>
      <AppHeader
        title="Platforms"
        description="Connect your platforms so KitPager can verify follower counts, engagement, and recent uploads automatically."
        actions={
          <Button onClick={() => setAddOpen(true)} className="rounded-full">
            <Plus className="h-4 w-4" /> Add platform
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        {data.platforms.map((p) => {
          const Icon = ICONS[p.platform];
          return (
            <div key={p.id} className="kp-card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface-2">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold capitalize">{p.platform}</p>
                    <p className="kp-mono text-xs text-muted-foreground">{p.handle}</p>
                  </div>
                </div>
                {p.selfReported ? (
                  <span className="rounded-full bg-warning/15 px-2.5 py-0.5 text-xs text-warning">Self-reported</span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-0.5 text-xs text-success">
                    <ShieldCheck className="h-3 w-3" /> Verified
                  </span>
                )}
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
                <Stat l="Followers" v={fmt(p.followers)} />
                <Stat l="Avg views" v={fmt(p.avgViews)} />
                <Stat l="ER" v={`${p.engagementRate.toFixed(1)}%`} />
              </div>
              <div className="mt-5 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  loaderClick
                  isLoading={refreshingId === p.id}
                  onClick={() => handleRefresh(p)}
                  className="flex-1 rounded-full"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Refresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setConfirmDisconnect(p)}
                  className="flex-1 rounded-full border-destructive/40 text-destructive hover:bg-destructive/10"
                >
                  <Unlink className="h-3.5 w-3.5" /> Disconnect
                </Button>
              </div>
            </div>
          );
        })}
        {data.platforms.length === 0 && (
          <div className="kp-card col-span-full grid place-items-center p-10 text-center">
            <p className="text-sm text-muted-foreground">No platforms connected yet.</p>
            <Button onClick={() => setAddOpen(true)} className="mt-4 rounded-full">
              <Plus className="h-4 w-4" /> Add your first
            </Button>
          </div>
        )}
      </div>

      {/* Connect sheet */}
      <Sheet open={addOpen} onOpenChange={setAddOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Connect a platform</SheetTitle>
            <SheetDescription>
              Choose a platform and enter your handle. We'll verify automatically when OAuth is supported.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Platform
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {ALL_PLATFORMS.map((p) => {
                  const I = ICONS[p.id];
                  const active = pickerPlatform === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setPickerPlatform(p.id)}
                      className={`flex items-center gap-2 rounded-xl border p-3 text-sm transition ${
                        active ? "border-primary bg-primary/5" : "border-border hover:bg-surface-2"
                      }`}
                    >
                      <I className="h-4 w-4" /> {p.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <Field
              label="Handle"
              value={handle}
              onChange={setHandle}
              placeholder="@yourhandle"
            />
            <Field
              label="Followers (optional self-report)"
              value={followers}
              onChange={setFollowers}
              placeholder="120000"
            />
            <p className="text-xs text-muted-foreground">
              Leaving followers blank will trigger OAuth verification on next sync.
            </p>
          </div>
          <SheetFooter className="mt-6">
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button loaderClick isLoading={connecting} onClick={handleConnect}>
              Connect
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Disconnect confirm */}
      <AlertDialog open={!!confirmDisconnect} onOpenChange={(v) => !v && setConfirmDisconnect(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect {confirmDisconnect?.platform}?</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDisconnect?.handle} will be removed from your kit page and stats will stop updating.
              You can reconnect anytime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep connected</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                loaderClick
                isLoading={disconnecting}
                onClick={handleDisconnect}
              >
                Disconnect
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppPage>
  );
}

function Stat({ l, v }: { l: string; v: string }) {
  return (
    <div className="rounded-xl bg-surface-2 p-3 text-center">
      <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{l}</p>
      <p className="kp-mono text-sm font-medium">{v}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
