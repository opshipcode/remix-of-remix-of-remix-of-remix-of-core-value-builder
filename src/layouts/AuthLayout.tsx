import { Outlet, Link } from "react-router-dom";
import { Logo } from "@/components/kit/Logo";
import { ThemeToggle } from "@/components/kit/ThemeToggle";
import { ImagePlaceholder } from "@/components/kit/ImagePlaceholder";

/**
 * 50/50 split layout for auth screens.
 * Left = form area, right = brand/illustration panel.
 */
export default function AuthLayout() {
  return (
    <div className="grid min-h-screen w-full bg-background lg:grid-cols-2">
      {/* Form panel */}
      <div className="flex min-h-screen flex-col">
        <header className="flex items-center justify-between p-6 md:p-8">
          <Link to="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          <ThemeToggle />
        </header>
        <div className="flex flex-1 items-center justify-center px-6 pb-12 md:px-12">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
        <footer className="px-6 pb-6 text-xs text-muted-foreground md:px-8">
          <p>
            By continuing you agree to our{" "}
            <Link to="/legal/terms" className="underline-offset-2 hover:underline">Terms</Link> and{" "}
            <Link to="/legal/privacy" className="underline-offset-2 hover:underline">Privacy Policy</Link>.
          </p>
        </footer>
      </div>

      {/* Brand panel */}
      <div className="relative hidden bg-hero p-10 lg:flex lg:items-center lg:justify-center">
        <div className="w-full max-w-xl">
          <ImagePlaceholder
            aspect="portrait"
            title="Auth panel brand artwork"
            dimensions="1200x1500"
            orientation="portrait"
            description="Soft editorial composition: a stack of 3 floating 'media kit' page mockups (phone + tablet + laptop) layered with depth, warm neutral background, low-contrast teal glow, no human faces, calm and premium feel. Subtle motion if exporting Lottie/GIF: gentle 4s parallax of stacked frames."
            background="warm off-white with faint teal radial glow"
            facesAllowed={false}
            usage="Auth screens (right 50%) — login, signup, forgot/reset password"
            format="png/jpg static, optionally Lottie or GIF for subtle motion"
          />
          <div className="mt-8">
            <p className="kp-display text-2xl text-foreground md:text-3xl">
              Brand-ready in fifteen minutes.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Live proof, verified metrics, and tasteful design — built for serious creators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
