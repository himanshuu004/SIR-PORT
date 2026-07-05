"use client";
import {
  Cpu, FlaskConical, Brain, Mountain,
  Milk, Fish, PawPrint, Vote,
  Sparkles, Wand2, Bot, Network, Code2,
  BookOpen, BookText, Telescope, Compass, Target,
  Newspaper, Tractor, Lightbulb, Atom,
  HandHeart, Heart, HelpingHand, BookOpenCheck,
  Landmark, GraduationCap, Headphones, Link2, Check,
} from "lucide-react";

// Map between string keys used in data files and Lucide icon components.
const ICONS = {
  cpu: Cpu,
  flask: FlaskConical,
  brain: Brain,
  mountain: Mountain,
  milk: Milk,
  fish: Fish,
  paw: PawPrint,
  vote: Vote,
  sparkles: Sparkles,
  wand: Wand2,
  bot: Bot,
  network: Network,
  code: Code2,
  book: BookOpen,
  bookText: BookText,
  telescope: Telescope,
  compass: Compass,
  target: Target,
  newspaper: Newspaper,
  tractor: Tractor,
  lightbulb: Lightbulb,
  atom: Atom,
  handHeart: HandHeart,
  heart: Heart,
  helpingHand: HelpingHand,
  bookOpenCheck: BookOpenCheck,
  landmark: Landmark,
  graduationCap: GraduationCap,
  headphones: Headphones,
  link2: Link2,
  check: Check,
};

/**
 * <Icon name="brain" size={22} color="#8B5CF6" strokeWidth={1.8} />
 */
export default function Icon({ name, size = 20, color, strokeWidth = 1.8, ...rest }) {
  const Cmp = ICONS[name] || Sparkles;
  return <Cmp size={size} color={color} strokeWidth={strokeWidth} {...rest} />;
}
