"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
  useReducedMotion,
} from "motion/react";
import Fade from "../components/Fade";
import { Stagger, StaggerItem } from "../components/Stagger";
import MotionCard from "../components/MotionCard";
import {
  ChevronLeft,
  ChevronRight,
  Leaf,
  ExternalLink,
  Play,
  ArrowUpRight,
  Zap,
  ShoppingBag,
} from "lucide-react";
import { AnimatedReviewCards } from "../components/ui/animated-review-card";
import { FALLBACK_ARTICLES } from "../lib/fallbackPosts";
import { getPageHeroBackground } from "../lib/pageBackgrounds";

/* ─────────────────────────────────────────────────────────────────
   Static data — all original content preserved
   ───────────────────────────────────────────────────────────────── */

const HERO_EYEBROW =
  "Senior Civil Servant · AI Practitioner · Policy Architect · Philosophy & Neuroscience Writer";

const HERO_STATS = [
  { value: "23+",  label: "Years in Service" },
  { value: "5",    label: "Union Ministries Served" },
  { value: "10000000+", label: "Citizens Served" },
  { value: "1",    label: "State Being Served" },
];

const PILLAR_CARDS = [
  {
    label: "AI, ML & DL for Governance",
    tag: "Mind & Machine",
    countTag: "mind-machine",
    href: "/mind-and-machine",
    color: "#6366F1",
    num: "01",
    line: "Notes on AI, machine learning, and information theory — and how these tools can reimagine governance, decision-making, and public institutions.",
    keyword: "artificial intelligence",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=3840&q=90&auto=format&fit=crop",
  },
  {
    label: "The Policy Lab",
    tag: "Policy",
    countTag: "policy-lab",
    href: "/policy-lab",
    color: "#F59E0B",
    num: "02",
    line: "Field dispatches and data-driven policy thinking from Animal Husbandry, Dairy, Fisheries, and Elections — plus earlier work in cooperatives and education.",
    keyword: "policy & governance",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=3840&q=90&auto=format&fit=crop",
  },
  {
    label: "Philosophy of Mind",
    tag: "Philosophy",
    countTag: "philosophy",
    href: "/philosophy",
    color: "#D946EF",
    num: "03",
    line: "Eastern wisdom meets cognitive science — from the Gita and Yoga Sutras to Friston, Feldman Barrett, and Kahneman. The examined life of a decision-maker.",
    active: false,
    keyword: "philosophy & mind",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=3840&q=90&auto=format&fit=crop",
  },
  {
    label: "The Proving Ground",
    tag: "Proving Ground",
    countTag: "proving-ground",
    href: "/proving-ground",
    color: "#14B8A6",
    num: "04",
    line: "Projects and field work that made a difference — and an open accountability tracker for the things I am building, running, and walking in real time.",
    active: true,
    keyword: "field projects",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=3840&q=90&auto=format&fit=crop",
  },
];

const IMPACT_ITEMS = [
  { num: "2,000+",   unit: "children admitted under the Right to Education Act",               color: "#D946EF" },
  { num: "NEP 2020", unit: "Assisted in finalising the National Education Policy 2020",        color: "#14B8A6" },
  { num: "₹150M+",   unit: "Transferred to farmer accounts via the MoU with ITBP",            color: "#F59E0B" },
  { num: "6,000+",   unit: "Beneficiary farmers — Goat Valley & Poultry Valley schemes",      color: "#D946EF" },
  { num: "Kedarnath",unit: "Relief Commissioner during the 2013 Himalayan disaster",           color: "#14B8A6" },
];

const TIMELINE = [
  { year: "2001",    text: "Bachelor's in Veterinary Science completed",                     color: "#D946EF" },
  { year: "2002",    text: "Cleared the Indian Postal Service (IPoS) examination",           color: "#14B8A6" },
  { year: "2003",    text: "Joined the Indian Police Service (IPS)",                         color: "#F59E0B" },
  { year: "2004",    text: "Joined the Indian Administrative Service (IAS) — AIR 42",       color: "#D946EF" },
  { year: "2007–14", text: "District Magistrate, Government of Uttarakhand",                 color: "#14B8A6" },
  { year: "2014–21", text: "Senior roles, Government of India",                              color: "#F59E0B" },
  { year: "2021–24", text: "Secretary-level roles, Government of Uttarakhand",               color: "#D946EF" },
];

const OTHER_WORK = [
  {
    eyebrow: "Book",
    title: "Your Brain Is Running Old Software",
    tagline: "Thirteen principles. Four parts.",
    body: "Grounded in Karl Friston's Free Energy Principle, prediction processing, embodied cognition, and attention research. Written as a dialogue — the underlying neuroscience stays rigorous, the reading stays plain. Each principle is a small upgrade you can run on your own mind, starting today.",
    cta: "Visit upgradeurbrain.com",
    href: "https://www.upgradeurbrain.com",
    ctaBuy: "Buy on Amazon",
    hrefBuy: "https://www.amazon.in/Your-Brain-Running-Old-Software-ebook/dp/B0H4S1LFB3/",
    color: "#D946EF",
    tag: "Book",
    image: "/book_cover.jpg",
  },
  {
    eyebrow: "Charitable Foundation",
    title: "Srilan Foundation",
    tagline: "A Legacy of Love, Learning, Health and Dignity",
    body: "Supports meritorious girls from below-poverty-line families with scholarships, learning materials, and mentoring through Classes 8–12. Organises medical camps for early detection of cancers, diabetes, and chronic illness. Provides care for elderly persons without adequate family support.",
    cta: "Visit srilan.org",
    href: "https://www.srilan.org",
    color: "#14B8A6",
    tag: "Foundation",
  },
  {
    eyebrow: "Open-Source AI Research",
    title: "AgriLM — Small Language Model for Agriculture",
    tagline: "Domain-specific AI for farming & animal husbandry.",
    body: "An open-source small language model trained on agriculture and animal husbandry knowledge — covering crop science, livestock management, veterinary practice, and rural policy. Designed to be deployable at low compute for field-level governance.",
    cta: "View on GitHub",
    href: "https://github.com/basava-code/agri-lm",
    color: "#22C55E",
    tag: "AI Research",
  },
];

const TESTIMONIALS = [
  {
    text: "Purushottam Basava is an upright career IAS officer, hardworking, honest, and follows processes with absolute due diligence, while at the same time kind, helpful, and humane in approach. He draws his strength from his deep-rooted spiritual moorings.",
    name: "Shri Anil Sahasrabudhe",
    role: "Former Chairman AICTE, Chairman of National Educational Technology Forum",
  },
  {
    text: "Mr Purshottam is a very hard-working, intelligent and outstanding officer. He has a deep understanding of policy-making and policy issues. He gave excellent inputs for the finalisation of the National Education Policy 2020 and its implementation plan, SARTHAQ.",
    name: "Shri Maneesh Garg, IAS",
    role: "Former Joint Secretary, Ministry of Education — Present Senior Deputy Election Commissioner",
  },
  {
    text: "I found him to be a very conscientious and committed professional. His engagement with various stakeholders within the ministry has been outstanding. His role in making and implementing the National Education Policy 2020 is remarkable.",
    name: "Dr Mamidala Jagadesh Kumar",
    role: "Former Chairman, University Grants Commission",
  },
  {
    text: "Purushottam is an honest and upright officer and we need more officers like him in public life.",
    name: "Shri Ajay Singh",
    role: "Chairman & Managing Director, SpiceJet Ltd",
  },
  {
    text: "One of the best officers of the service. He brought quiet efficiency and impeccable order to the Ministry of Education. His abilities to remain cool during crisis, manage time, empathy for the marginalized and thoroughness are worthy of emulation.",
    name: "R Subrahmanyam",
    role: "Former Secretary to Government of India (Higher Education and Social Justice)",
  },
  {
    text: "Mr Basava Purushottam has a lot of passion for the education sector. His ability to collaborate with various stakeholders is phenomenal. His communication skills helped NEP gain acceptance from many stakeholders.",
    name: "Virendra Tewari",
    role: "Former Director, Indian Institute of Technology Kharagpur",
  },
];

const SOCIAL_SIDEBAR = [
  { label: "Facebook",  href: "https://www.facebook.com/basava.ias",                      bg: "bg-blue-50 text-blue-700",   color: "#1877F2" },
  { label: "Twitter/X", href: "https://x.com/basava_ias",                                 bg: "bg-slate-50 text-slate-700", color: "#000000" },
  { label: "LinkedIn",  href: "https://linkedin.com/in/basava-purushottam-b862247",        bg: "bg-blue-50 text-blue-800",   color: "#0A66C2" },
  { label: "WhatsApp",  href: "https://wa.me/917042120001",                                bg: "bg-green-50 text-green-700", color: "#25D366" },
];

/* ─────────────────────────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────────────────────────── */

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

/* ─────────────────────────────────────────────────────────────────
   Animated Counter (original logic preserved)
   ───────────────────────────────────────────────────────────────── */

function CountUp({ value, color, className }) {
  const prefersReduced = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const match = typeof value === "string" ? value.match(/^([\d,]+)(.*)$/) : null;
  const target = match ? parseInt(match[1].replace(/,/g, ""), 10) : null;
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) => {
    const n = Math.round(v);
    return `${n.toLocaleString("en-IN")}${match?.[2] ?? ""}`;
  });

  useEffect(() => {
    if (!inView || target === null) return;
    if (prefersReduced) { mv.set(target); return; }
    const controls = animate(mv, target, { duration: 1.6, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [inView, target, prefersReduced, mv]);

  if (target === null) {
    return (
      <span ref={ref} style={color ? { color } : undefined} className={className}>
        {value}
      </span>
    );
  }
  return (
    <motion.span ref={ref} style={color ? { color } : undefined} className={className}>
      {display}
    </motion.span>
  );
}

function HeroStatValue({ value }) {
  const prefersReduced = useReducedMotion();
  const match = typeof value === "string" ? value.match(/^([\d,]+)(.*)$/) : null;
  const target = match ? parseInt(match[1].replace(/,/g, ""), 10) : null;
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) => {
    const n = Math.round(v);
    return `${n.toLocaleString("en-IN")}${match?.[2] ?? ""}`;
  });

  useEffect(() => {
    if (target === null) return;
    if (prefersReduced) {
      mv.set(target);
      return;
    }
    const controls = animate(mv, target, {
      duration: 1.8,
      delay: 0.7,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [target, prefersReduced, mv]);

  if (target === null) return <span>{value}</span>;
  return <motion.span>{display}</motion.span>;
}

/* ─────────────────────────────────────────────────────────────────
   Shared sub-components
   ───────────────────────────────────────────────────────────────── */

function SectionHeading({ title, eyebrow, seeAllHref, seeAllLabel = "See All", light = false }) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div className="flex flex-col gap-1">
        {eyebrow && (
          <span className={`text-xs font-bold uppercase tracking-widest ${light ? "text-white/70" : "text-[#3B5B54]"}`}>{eyebrow}</span>
        )}
        <div className="flex items-center gap-2">
          <Leaf className={`w-5 h-5 shrink-0 ${light ? "text-white" : "text-[#3B5B54]"}`} />
          <h2 className={`text-2xl font-bold leading-tight ${light ? "text-white" : "text-[#1A1A1A]"}`}>{title}</h2>
        </div>
      </div>
      {seeAllHref && (
        <Link
          href={seeAllHref}
          className={`text-sm font-semibold hover:underline whitespace-nowrap mt-1 ${light ? "text-white" : "text-[#3B5B54]"}`}
        >
          {seeAllLabel}
        </Link>
      )}
    </div>
  );
}

function Pill({ label }) {
  return (
    <span className="inline-block bg-black text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full leading-none">
      {label}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────
   1. HERO
   ───────────────────────────────────────────────────────────────── */

const CARD_ACCENT_COLORS = ["#D9EAFB", "#FBE1C4", "#E3DBFB", "#D2F3E1"];

const HERO_FALLBACK_IMAGE = getPageHeroBackground("home");

function Hero({ posts }) {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef(null);
  const [idx, setIdx] = useState(0);
  const hasGhostPosts = posts && posts.length > 0;
  const slides = hasGhostPosts ? posts : [null];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "24%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.4]);

  const prev = () => setIdx((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIdx((i) => (i + 1) % slides.length);

  const post = slides[idx];
  const bgImage = post?.feature_image ?? HERO_FALLBACK_IMAGE;
  const heroEase = [0.16, 1, 0.3, 1];

  return (
    <section ref={sectionRef} className="relative w-full h-[100dvh] min-h-[100dvh] max-h-[100dvh] flex flex-col overflow-hidden bg-black">
      <motion.div
        className="absolute inset-0"
        style={prefersReduced ? undefined : { y: bgY, scale: 1.08 }}
      >
        <Image
          src={bgImage}
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-black/30" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/35 to-transparent pointer-events-none" />

      {/* Carousel arrows */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Hero content — left: copy & CTAs, right: My Book */}
      <motion.div
        className="relative z-10 flex-1 flex items-center px-4 sm:px-6 lg:px-10 pt-[108px] pb-6 sm:pb-8 max-w-[1360px] mx-auto w-full min-h-0"
        style={prefersReduced ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-12 lg:gap-[4.5rem] w-full">
          {/* Left column */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left w-full min-w-0">
            <motion.span
              className="inline-block bg-white/15 backdrop-blur-sm border border-white/20 text-white text-[13px] sm:text-sm font-semibold tracking-wide px-6 py-3 rounded-full mb-5 sm:mb-6 max-w-[min(100%,44rem)] leading-snug"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, ease: heroEase }}
            >
              {HERO_EYEBROW}
            </motion.span>

            <motion.h1
              className="text-white w-full"
              style={{ textShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: heroEase }}
              key={post?.slug ?? "fallback-title"}
            >
              {post ? (
                <span className="block font-sans font-semibold text-[clamp(36px,5.8vw,70px)] tracking-tight leading-[1.12]">
                  {post.title}
                </span>
              ) : (
                <>
                  <span className="block font-sans font-semibold text-[clamp(36px,5.8vw,70px)] tracking-tight leading-[1.12]">
                    Bridging algorithmic intelligence with
                  </span>
                  <span className="block font-serif italic text-[clamp(50px,7.5vw,96px)] leading-[1.05] mt-2">
                    Indian governance
                  </span>
                </>
              )}
            </motion.h1>

            <div className="mt-4 sm:mt-5 flex flex-col items-center lg:items-start w-full gap-4 sm:gap-5">
              <motion.p
                className="font-medium text-[clamp(16px,1.8vw,23px)] text-white/80 max-w-[640px] leading-relaxed"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.35, ease: heroEase }}
                key={post?.slug ? `${post.slug}-sub` : "fallback-sub"}
              >
                {post
                  ? `${post.authors?.[0]?.name ?? "Dr. B.V.R.C. Purushottam"} · ${formatDate(post.published_at)}`
                  : "A civil servant\u2019s notebook on AI, philosophy of mind, and the art of governing 1.4 billion people."}
              </motion.p>

              <motion.div
                className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-3.5"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.55, ease: heroEase }}
              >
                <Link
                  href={post ? `/insights/${post.slug}` : "/mind-and-machine"}
                  className="inline-flex items-center gap-3.5 bg-white text-black px-9 py-4.5 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity"
                >
                  <span className="flex items-center justify-center w-8 h-8">
                    <Play className="w-6 h-6 fill-current" />
                  </span>
                  {post ? "Read Article" : "Read My Insights"}
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4.5 rounded-full font-semibold text-lg hover:bg-white/20 transition-colors"
                >
                  My Story
                  <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/15">
                    <ArrowUpRight className="w-5 h-5" />
                  </span>
                </Link>
                <Link
                  href="/all-posts"
                  className="inline-flex items-center bg-white/5 backdrop-blur-md border border-white/15 text-white/90 px-8 py-4.5 rounded-full font-semibold text-lg hover:bg-white/15 transition-colors"
                >
                  All Posts
                </Link>
              </motion.div>

              <motion.div
                className="w-full"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex flex-nowrap items-stretch justify-center lg:justify-start gap-0 w-full max-w-full overflow-x-auto">
                  {HERO_STATS.map((stat, i) => (
                    <div
                      key={stat.label}
                      className={`flex-1 min-w-[104px] sm:min-w-0 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-4 sm:px-6 sm:py-4.5 text-center shrink-0 sm:shrink ${
                        i === 0 ? "rounded-l-xl" : ""
                      } ${i === HERO_STATS.length - 1 ? "rounded-r-xl" : ""} ${
                        i > 0 ? "border-l-0" : ""
                      }`}
                    >
                      <div className="text-2xl sm:text-[1.85rem] lg:text-[2.25rem] font-black text-white tabular-nums leading-none whitespace-nowrap">
                        <HeroStatValue value={stat.value} />
                      </div>
                      <div className="text-xs sm:text-sm text-white/70 mt-1.5 sm:mt-2 leading-tight">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {slides.length > 1 && (
                <div className="flex gap-2 justify-center lg:justify-start">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setIdx(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === idx ? "w-8 bg-white" : "w-3 bg-white/40 hover:bg-white/60"
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right column — My Book */}
          <motion.div
            className="shrink-0 flex flex-col items-center gap-4 sm:gap-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-7 sm:px-9 sm:py-8 w-[260px] sm:w-[295px] lg:w-[330px] text-center shadow-lg shadow-black/20"
            initial={{ opacity: 0, y: 16 }}
            animate={{
              opacity: 1,
              y: prefersReduced ? 0 : [0, -12, 0],
            }}
            transition={{
              opacity: { duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] },
              y: prefersReduced
                ? { duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }
                : { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.1 },
            }}
          >
            <span className="text-sm sm:text-[15px] font-bold text-[#F3E48A] uppercase tracking-widest">
              My Book
            </span>
            <a
              href="https://www.amazon.in/Your-Brain-Running-Old-Software-ebook/dp/B0H4S1LFB3/"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
            >
              <Image
                src="/book_cover.jpg"
                alt="Your Brain Is Running Old Software — by Basava Purushottam"
                width={180}
                height={252}
                className="rounded-lg shadow-xl w-[150px] sm:w-[175px] lg:w-[205px] h-auto"
              />
            </a>
            <p className="text-[17px] sm:text-lg text-white/85 leading-snug px-1">
              Your Brain Is Running Old Software
            </p>
            <a
              href="https://www.amazon.in/Your-Brain-Running-Old-Software-ebook/dp/B0H4S1LFB3/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-black text-base font-bold px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity"
            >
              Buy on Amazon
              <ArrowUpRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   2. RECENT ARTICLES
   ───────────────────────────────────────────────────────────────── */

function ArticleCard({ post, fallback, cardIdx }) {
  const title   = post ? post.title : fallback.title;
  const tag     = post ? (post.primary_tag?.name ?? "Essay") : fallback.pillar;
  const author  = post ? (post.authors?.[0]?.name ?? "Dr. B.V.R.C. Purushottam") : "Dr. B.V.R.C. Purushottam";
  const date    = post ? formatDate(post.published_at) : fallback.date;
  const excerpt = post ? (post.custom_excerpt || post.excerpt || "") : (fallback.excerpt || "");
  const href    = post ? `/insights/${post.slug}` : (fallback.href ?? "/all-posts");
  const time    = post ? (post.reading_time ? `${post.reading_time} min read` : null) : (fallback.time ?? null);
  const accentHex = CARD_ACCENT_COLORS[cardIdx % CARD_ACCENT_COLORS.length];
  const chips = [tag, date, time].filter(Boolean);

  return (
    <MotionCard
      as={Link}
      href={href}
      className="group rounded-[28px] overflow-hidden flex flex-col h-full no-underline"
      style={{ backgroundColor: accentHex }}
    >
      {/* Colored content area */}
      <div className="flex flex-1 flex-col gap-4 p-7 pb-8">
        <h3 className="text-2xl font-extrabold text-[#1A1A1A] leading-tight line-clamp-2">
          {title}
        </h3>
        {excerpt && (
          <p className="text-sm text-[#1A1A1A]/70 leading-relaxed line-clamp-2">
            {excerpt}
          </p>
        )}
        <p className="text-xs font-semibold text-[#1A1A1A]/55">{author}</p>

        {chips.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2 pt-2">
            {chips.map((chip) => (
              <span
                key={chip}
                className="inline-block rounded-full bg-black/10 px-3 py-1.5 text-xs font-semibold text-[#1A1A1A]"
              >
                {chip}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* White footer */}
      <div className="flex items-center justify-between bg-white px-7 py-5">
        <span className="text-base font-bold text-[#1A1A1A]">Explore</span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2F2F2] text-[#1A1A1A] transition-colors duration-300 group-hover:bg-[#1A1A1A] group-hover:text-white">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </MotionCard>
  );
}

function RecentArticles({ posts }) {
  const displayPosts = posts && posts.length > 0 ? posts : [];
  const useFallback = displayPosts.length === 0;

  const items = useFallback ? FALLBACK_ARTICLES : displayPosts;

  return (
    <section className="max-w-[1200px] mx-auto px-4 sm:px-6 py-14">
      <Fade>
        <SectionHeading title="Featured Insights" seeAllHref="/all-posts" seeAllLabel={useFallback ? "View all essays →" : "View all →"} />
      </Fade>
      <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-6" stagger={0.14} delayChildren={0.1}>
        {items.map((item, i) =>
          useFallback ? (
            <StaggerItem key={item.title}>
              <ArticleCard fallback={item} cardIdx={i} />
            </StaggerItem>
          ) : (
            <StaggerItem key={item.id}>
              <ArticleCard post={item} cardIdx={i} />
            </StaggerItem>
          )
        )}
      </Stagger>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   3. CATEGORIES (Pillars)
   ───────────────────────────────────────────────────────────────── */

function PillarCard3D({ card, numLabel }) {
  const prefersReduced = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  const rotateX = useTransform(springY, [-0.5, 0.5], ["9deg", "-9deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-9deg", "9deg"]);

  const handleMouseMove = (e) => {
    if (prefersReduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div style={{ perspective: "1000px" }} className="mx-auto h-full w-full max-w-[20rem]">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={prefersReduced ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`relative h-full min-h-[32rem] w-full rounded-3xl shadow-2xl ${
          card.active ? "ring-2 ring-white/60" : ""
        }`}
      >
        {/* Keyword-based 4K image, fetched from the web (Unsplash) */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <Image
            src={card.image}
            alt={`${card.label} — ${card.keyword}`}
            fill
            quality={90}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 640px"
            className="object-cover brightness-110"
          />
        </div>
        {/* Light brand tint up top — keeps the photo bright */}
        <div
          className="absolute inset-0 rounded-3xl"
          style={{ background: `linear-gradient(160deg, ${card.color}2E 0%, transparent 48%)` }}
        />
        {/* Bottom scrim only — image stays bright, text stays readable */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

        {/* Content — lifted in 3D space */}
        <div
          style={prefersReduced ? undefined : { transform: "translateZ(50px)", transformStyle: "preserve-3d" }}
          className="relative flex h-full flex-col justify-between gap-5 p-6 pb-8 text-white [text-shadow:_0_1px_10px_rgba(0,0,0,0.65)]"
        >
          {/* Top row: number badge + link */}
          <div className="flex items-start justify-between">
            <motion.div
              style={prefersReduced ? undefined : { transform: "translateZ(45px)" }}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-lg font-black ring-1 ring-inset ring-white/30"
            >
              {numLabel}
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1, rotate: "2.5deg" }}
              whileTap={{ scale: 0.9 }}
              style={prefersReduced ? undefined : { transform: "translateZ(60px)" }}
            >
              <Link
                href={card.href}
                aria-label={`Explore ${card.label}`}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-1 ring-inset ring-white/30 transition-colors hover:bg-white/30 no-underline"
              >
                <ArrowUpRight className="h-5 w-5 text-white" />
              </Link>
            </motion.div>
          </div>

          {/* Middle/lower: title, tag, description */}
          <div className="mt-auto flex flex-col gap-2">
            <motion.h3
              style={prefersReduced ? undefined : { transform: "translateZ(50px)" }}
              className="text-2xl font-bold leading-tight text-white"
            >
              {card.label}
            </motion.h3>
            <motion.div
              style={prefersReduced ? undefined : { transform: "translateZ(42px)" }}
              className="text-xs font-bold uppercase tracking-widest text-white"
            >
              {card.tag}
            </motion.div>
            <motion.p
              style={prefersReduced ? undefined : { transform: "translateZ(36px)" }}
              className="text-sm leading-relaxed text-white"
            >
              {card.line}
            </motion.p>
          </div>

          {/* Footer button */}
          <motion.div
            style={prefersReduced ? undefined : { transform: "translateZ(40px)" }}
          >
            <Link
              href={card.href}
              className="block w-full cursor-pointer rounded-xl bg-white/15 py-3 text-center text-sm font-semibold text-white backdrop-blur-md ring-1 ring-inset ring-white/25 transition-colors duration-200 hover:bg-white/25 no-underline"
            >
              Explore essays →
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function Categories({ pillarCounts = {} }) {
  return (
    <section className="mx-4 sm:mx-6 mt-0 mb-4">
      <Fade direction="scale">
        <div className="bg-white rounded-3xl py-10 px-4 sm:px-8 lg:px-10">
          <SectionHeading
            title="Four Intellectual Territories"
            eyebrow="What I Write About"
            seeAllHref="/all-posts"
            seeAllLabel="View All"
          />
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" stagger={0.16} delayChildren={0.12}>
          {PILLAR_CARDS.map((card) => {
            const count = pillarCounts[card.countTag];
            const numLabel =
              typeof count === "number"
                ? String(count).padStart(2, "0")
                : card.num;

            return (
              <StaggerItem key={card.label} className="h-full">
                <PillarCard3D card={card} numLabel={numLabel} />
              </StaggerItem>
            );
          })}
          </Stagger>
        </div>
      </Fade>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   4. POPULAR ARTICLES / IMPACT IN NUMBERS
   ───────────────────────────────────────────────────────────────── */

function PopularArticles() {
  return (
    <section className="relative overflow-hidden py-14">
      <Image
        src="/Background/1.jpg"
        alt=""
        fill
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6">
        <Fade>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-white shrink-0" />
            <h2 className="text-2xl font-bold text-white">Impact in Numbers</h2>
          </div>
        </div>
        </Fade>

        {/* 3-up grid of widget-style cards */}
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" stagger={0.16} delayChildren={0.12}>
          {IMPACT_ITEMS.map((item) => (
            <StaggerItem key={item.unit}>
            <MotionCard
              className="relative overflow-hidden rounded-[28px] p-6 flex flex-col gap-5 min-h-[240px] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)]"
              style={{ background: item.color }}
            >
              {/* Soft decorative glow, echoes the reference widget cards */}
              <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-white/15 blur-2xl pointer-events-none" />
              <div className="absolute -left-8 -bottom-10 w-28 h-28 rounded-full bg-black/10 blur-2xl pointer-events-none" />

              {/* Icon + title header, like "Freud Score" / "Mood" / "Health Journal" */}
              <div className="relative flex items-center gap-2.5">
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/25 text-white shrink-0">
                  <Leaf className="w-4.5 h-4.5" />
                </span>
                <span className="text-white font-bold text-base leading-none">Public Service</span>
              </div>

              {/* Big stat, mirrors the bold headline value in each reference card */}
              <div className="relative flex flex-col gap-2">
                <div className="text-3xl sm:text-[2.25rem] font-black text-white leading-none tracking-tight">
                  <CountUp value={item.num} />
                </div>
                <p className="text-sm font-semibold text-white/90 leading-snug">{item.unit}</p>
              </div>

              {/* Footer caption */}
              <p className="relative text-xs text-white/70 mt-auto">Dr. B.V.R.C. Purushottam · IAS</p>
            </MotionCard>
            </StaggerItem>
          ))}
        </Stagger>

        {/* See All */}
        <Fade delay={0.15}>
        <div className="text-center mt-10">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <Link
            href="/proving-ground"
            className="inline-block bg-[#3B5B54] text-white font-bold px-8 py-3 rounded-full hover:bg-[#2d4540] transition-colors text-sm"
          >
            See All Achievements
          </Link>
          </motion.div>
        </div>
        </Fade>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   5. EDITOR'S PICKS + SIDEBAR
   ───────────────────────────────────────────────────────────────── */

function EditorsPicks() {
  return (
    <section className="max-w-[1200px] mx-auto px-4 sm:px-6 py-14">
      <div className="grid grid-cols-1 gap-10">

        {/* ── Left column ── */}
        <div>
          <Fade>
          <SectionHeading eyebrow="Other Work" title="Beyond the Blog" seeAllHref="/about" />
          </Fade>
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
            {OTHER_WORK.map((item, i) => (
              <StaggerItem key={item.title}>
              <MotionCard className="relative flex flex-col items-center text-center bg-white rounded-3xl shadow-sm border border-gray-100 p-6 pb-8 hover:shadow-md transition-shadow h-full">
                {/* Status row */}
                <div className="flex items-center justify-between w-full mb-5 text-[11px] font-semibold text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: item.color }}
                    />
                    {item.tag}
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 text-right max-w-[55%] truncate">
                    {item.eyebrow}
                  </div>
                </div>

                {/* Square image/color block */}
                <div
                  className="relative w-32 h-32 shrink-0 rounded-2xl overflow-hidden flex items-center justify-center mb-4"
                  style={{ background: `${item.color}18` }}
                >
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  ) : (
                    <span
                      className="text-4xl font-black opacity-30"
                      style={{ color: item.color }}
                    >
                      {i + 1}
                    </span>
                  )}
                </div>

                {/* Text */}
                <h3 className="font-black text-[#1A1A1A] text-lg leading-snug mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 mb-5">
                  {item.body}
                </p>

                {/* Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-2 w-full mt-auto">
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-1.5 text-xs font-bold border border-gray-200 rounded-full px-4 py-2.5 hover:bg-gray-50 transition-colors ${
                      item.hrefBuy ? "flex-1" : "w-full"
                    }`}
                    style={{ color: item.color }}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {item.cta}
                  </a>
                  {item.hrefBuy && (
                    <a
                      href={item.hrefBuy}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold border border-gray-200 rounded-full px-4 py-2.5 hover:bg-gray-50 transition-colors text-[#1A1A1A]"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      {item.ctaBuy}
                    </a>
                  )}
                </div>

                {/* Overlapping tagline pill */}
                {item.tagline && (
                  <div
                    className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[11px] font-black text-white px-4 py-2 rounded-full shadow-md whitespace-nowrap max-w-[92%]"
                    style={{ background: item.color }}
                  >
                    <Zap className="w-3 h-3 shrink-0 fill-white" />
                    <span className="truncate">{item.tagline}</span>
                  </div>
                )}
              </MotionCard>
              </StaggerItem>
            ))}
          </Stagger>

          <Fade delay={0.15}>
          <div className="mt-6">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="inline-block">
            <Link
              href="/about"
              className="inline-block bg-[#3B5B54] text-white font-bold px-8 py-3 rounded-full hover:bg-[#2d4540] transition-colors text-sm"
            >
              See All
            </Link>
            </motion.div>
          </div>
          </Fade>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   6. CAREER TIMELINE (full — all 7 milestones)
   ───────────────────────────────────────────────────────────────── */

function CareerTimeline() {
  return (
    <section className="relative overflow-hidden py-8 pb-14">
      <Image
        src="/Background/2.jpg"
        alt=""
        fill
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6">
      <Fade>
      <SectionHeading title="A Career, Briefly" seeAllHref="/about" light />
      </Fade>
      <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" stagger={0.14} delayChildren={0.1}>
        {TIMELINE.map((item, i) => {
          const filled = i % 2 === 0;
          return (
            <StaggerItem key={item.year}>
            <MotionCard
              as={Link}
              href="/about"
              className="block rounded-[28px] p-7 h-full min-h-[210px] flex flex-col justify-between relative overflow-hidden"
              style={{ background: filled ? item.color : "#F5F5F5" }}
            >
              <h3
                className={`text-2xl font-black leading-tight ${
                  filled ? "text-white" : "text-[#1A1A1A]"
                }`}
              >
                {item.year}
              </h3>
              <div>
                <p
                  className={`text-sm leading-snug mb-6 ${
                    filled ? "text-white/90" : "text-gray-600"
                  }`}
                >
                  {item.text}
                </p>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${
                    filled ? "text-white" : "text-[#1A1A1A]"
                  }`}
                >
                  Learn More
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </MotionCard>
            </StaggerItem>
          );
        })}
      </Stagger>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   7. TESTIMONIALS
   ───────────────────────────────────────────────────────────────── */

function Testimonials() {
  const reviews = TESTIMONIALS.map((item, index) => ({
    id: index,
    name: item.name,
    text: item.text,
    role: item.role,
  }));

  return (
    <section className="bg-[#F5F5F5] py-14">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <Fade>
        <SectionHeading title="In Their Words" />
        </Fade>

        <Fade delay={0.1}>
          <AnimatedReviewCards
            reviews={reviews}
            interactionType="click"
            theme="default"
            autoRotate
            rotateInterval={6000}
            showBorderBeam
            classNames={{
              container: "items-center justify-center",
              card: "shadow-xl",
            }}
          />
        </Fade>

        <p className="text-center text-xs text-gray-400 mt-3">
          Click a card to read the next testimonial
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Root export
   ───────────────────────────────────────────────────────────────── */

export default function HomeClient({ posts, pillarCounts = {} }) {
  return (
    <>
      {/* 1. Hero */}
      <Hero posts={posts} />

      {/* 2. What I Write About — Four Intellectual Territories */}
      <Categories pillarCounts={pillarCounts} />

      {/* 3. Selected Essays — Featured Insights */}
      <RecentArticles posts={posts} />

      {/* 4. Impact in Numbers */}
      <PopularArticles />

      {/* 5. Beyond the Blog — Other Work */}
      <EditorsPicks />

      {/* 6. Full Career Timeline */}
      <CareerTimeline />

      {/* 7. In Their Words — Testimonials */}
      <Testimonials />
    </>
  );
}
