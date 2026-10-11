import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { preloadPalette } from "@/lib/palette";
import { toggleTheme, useTheme } from "@/lib/theme";
import { openPalette } from "@/lib/ui";

const nav = [
  { label: "work", to: "/work" },
  { label: "thinking", to: "/thinking" },
  { label: "notes", to: "/notes" },
  { label: "about", to: "/about" },
] as const;

export function SiteHeader() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const [mac, setMac] = useState(true);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    setMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      // Hide on a deliberate scroll down, come back on any scroll up — but never
      // while it holds keyboard focus.
      const holdsFocus = ref.current?.contains(document.activeElement) ?? false;
      if (y > 240 && y - last > 6 && !holdsFocus) setHidden(true);
      else if (last - y > 4 || y < 240) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={ref}
      onFocusCapture={() => setHidden(false)}
      className={`no-print fixed inset-x-0 top-0 z-50 transition-[translate,background-color,border-color] duration-500 ease-lazy motion-reduce:transition-none ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${scrolled ? "border-b border-rule bg-paper/85 backdrop-blur-md" : "border-b border-transparent"}`}
      style={{ viewTransitionName: "site-header" }}
    >
      <div className="shell flex h-16 items-center justify-between gap-6">
        <Link to="/" aria-label="Jayesh Kesari, home" className="group flex items-center gap-3 text-ink">
          <Logo className="h-[17px] w-auto transition-transform duration-300 ease-lazy group-hover:-rotate-6" />
          <span className="hidden font-serif text-[15px] tracking-[-0.01em] text-ink sm:inline">Jayesh Kesari</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="font-serif text-[15.5px] text-graphite transition-colors hover:text-ink"
              activeOptions={{ exact: true }}
              activeProps={{ className: "text-ink underline decoration-neel underline-offset-[6px]" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5 sm:gap-4">
          <button
            type="button"
            onClick={(e) => openPalette(e.currentTarget)}
            onPointerEnter={preloadPalette}
            onFocus={preloadPalette}
            aria-keyshortcuts="Control+K Meta+K"
            className="press mono flex items-center gap-1.5 rounded-[5px] border border-rule px-2 py-1 text-[11.5px] text-graphite transition-colors hover:border-graphite hover:text-ink"
          >
            <span className="hidden sm:inline">{mac ? "⌘" : "ctrl"}</span>
            <span className="hidden sm:inline">K</span>
            <span className="sm:hidden">menu</span>
            <span className="sr-only">, open the command menu</span>
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className="press mono grid size-7 place-items-center rounded-full text-[13px] text-graphite transition-colors hover:text-ink"
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            title={theme === "dark" ? "lights on" : "lights off"}
          >
            <span aria-hidden className="relative block size-[13px] overflow-hidden rounded-full border border-current">
              <span
                className={`absolute inset-y-0 right-0 w-1/2 bg-current transition-transform duration-200 ease-lazy ${
                  theme === "dark" ? "translate-x-0" : "translate-x-full"
                }`}
              />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
