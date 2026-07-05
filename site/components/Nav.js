"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Search, Menu, X, ArrowUpRight } from "lucide-react";
import { EASE, DURATION_FAST } from "../lib/motion";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Mind & Machine", href: "/mind-and-machine" },
  { label: "Philosophy", href: "/philosophy" },
  { label: "Policy Lab", href: "/policy-lab" },
  { label: "Proving Ground", href: "/proving-ground" },
  { label: "Late Compiler", href: "/the-late-compiler" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const prefersReduced = useReducedMotion();
  const solid = scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const linkClass = (href) => {
    const active = pathname === href;
    return `px-4 py-2.5 text-base font-medium rounded-full transition-colors ${
      active
        ? solid
          ? "text-[#3B5B54] bg-[#A9C7BE]/25"
          : "text-white bg-white/15"
        : solid
          ? "text-gray-600 hover:text-[#3B5B54] hover:bg-gray-100/80"
          : "text-white/70 hover:text-white hover:bg-white/10"
    }`;
  };

  return (
    <div
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-[4%] sm:top-6 pointer-events-none"
      role="presentation"
    >
    <motion.nav
      className="w-full max-w-[1360px] pointer-events-auto"
      role="navigation"
      aria-label="Main navigation"
      initial={prefersReduced ? false : { opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE, delay: 0.1 }}
    >
      <motion.div
        className={`flex items-center justify-between px-6 sm:px-8 py-4 rounded-[20px] backdrop-blur-md border ${
          solid
            ? "bg-white/90 border-gray-200/80 text-[#3B5B54]"
            : "bg-white/10 border-white/10 text-white"
        }`}
        animate={{
          boxShadow: solid
            ? "0 10px 30px rgba(0,0,0,0.08)"
            : "0 10px 30px rgba(0,0,0,0.2)",
        }}
        transition={{ duration: DURATION_FAST, ease: EASE }}
      >
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            href="/"
            className={`shrink-0 no-underline transition-colors duration-300 ${
              solid ? "text-[#3B5B54] hover:text-[#2a443f]" : "text-white hover:text-[#F3E48A]"
            }`}
            aria-label="Purushottam — Home"
          >
            <span className="block font-serif italic font-semibold text-[1.6rem] sm:text-[1.85rem] tracking-[-0.03em] leading-none">
              Purushottam
            </span>
          </Link>
        </motion.div>

        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link, i) => (
            <motion.div
              key={link.href}
              initial={prefersReduced ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.04, ease: EASE }}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link href={link.href} className={linkClass(link.href)}>
                {link.label}
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <motion.button
            type="button"
            className={`hidden sm:flex w-11 h-11 rounded-full items-center justify-center transition-colors ${
              solid ? "bg-gray-100 hover:bg-gray-200" : "bg-white/10 hover:bg-white/20"
            }`}
            aria-label="Search"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
          >
            <Search className={`w-5 h-5 ${solid ? "text-gray-600" : "text-white"}`} />
          </motion.button>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link
              href="/#newsletter"
              className={`hidden sm:inline-flex items-center gap-2.5 text-base font-semibold px-6 py-3 rounded-full transition-opacity hover:opacity-90 ${
                solid ? "bg-[#3B5B54] text-white" : "bg-white text-black"
              }`}
            >
              Subscribe
              <span
                className={`flex items-center justify-center w-7 h-7 rounded-full ${
                  solid ? "bg-white/20" : "bg-black/10"
                }`}
              >
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </Link>
          </motion.div>
          <motion.button
            type="button"
            className={`lg:hidden flex items-center justify-center w-11 h-11 rounded-full transition-colors ${
              solid ? "hover:bg-gray-100" : "hover:bg-white/10"
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mobileOpen ? "close" : "open"}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={`lg:hidden mt-2 backdrop-blur-md rounded-[16px] px-4 py-4 flex flex-col gap-1 border ${
              solid
                ? "bg-white/95 border-gray-200/80"
                : "bg-white/10 border-white/10"
            }`}
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.25, ease: EASE }}
              >
                <Link
                  href={link.href}
                  className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-colors block ${
                    pathname === link.href
                      ? solid
                        ? "text-[#3B5B54] bg-[#A9C7BE]/25"
                        : "text-white bg-white/15"
                      : solid
                        ? "text-gray-700 hover:bg-gray-50"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <div className={`pt-2 mt-2 border-t ${solid ? "border-gray-100" : "border-white/10"}`}>
              <Link
                href="/#newsletter"
                className={`flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-full transition-opacity hover:opacity-90 ${
                  solid ? "bg-[#3B5B54] text-white" : "bg-white text-black"
                }`}
              >
                Subscribe to Newsletter
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
    </div>
  );
}
