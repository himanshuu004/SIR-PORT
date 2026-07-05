/**
 * theme.js — Single source of truth for ALL design tokens.
 *
 * How it works:
 *   • JS inline styles  → import { T, playfair, … } and use T.gold etc.
 *   • CSS modules       → use var(--gold) etc. — values come from the
 *                         <style> tag injected by layout.js via generateCSSVars()
 *
 * To change the site's colour scheme, edit ONLY this file.
 * Phase 3 will let the client edit these values via an admin panel UI.
 */

/* ── Colour palette ──────────────────────────────────────────────── */
export const T = {
  navy:      "#0F1A2E",
  navyLight: "#1B2A4A",
  navyMid:   "#243654",
  navyDeep:  "#0A1220",
  gold:      "#14B8A6",
  goldLight: "#5EEAD4",
  goldPale:  "#CCFBF1",
  warmWhite: "#FAFAF8",
  cream:     "#F5F2ED",
  creamDark: "#EDE9E3",
  charcoal:  "#1C1917",
  textBody:  "#44403C",
  textMuted: "#78716C",
  textSubtle:"#A8A29E",
  border:    "rgba(28,25,23,0.08)",
  borderLight:"rgba(28,25,23,0.05)",
};

/* ── Pillar / category accent colours ───────────────────────────── */
export const PILLAR = {
  blue:   "#3B82F6",
  purple: "#8B5CF6",
  green:  "#10B981",
  coral:  "#E8593C",
  amber:  "#F59E0B",
  red:    "#EF4444",
  indigo: "#4338CA",
};

/* ── Fonts ───────────────────────────────────────────────────────── */
export const FONTS = {
  serif: "'Playfair Display', Georgia, serif",
  sans:  "'Source Sans 3', 'Source Sans Pro', system-ui, sans-serif",
};

/* ── Shared gradients ────────────────────────────────────────────── */
export const goldGrad = "var(--grad-gold)";
export const navyGrad = "var(--grad-navy)";

/* ── Repeated background texture ────────────────────────────────── */
export const gridTex = {
  position: "absolute",
  inset: 0,
  opacity: 0.025,
  backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
  backgroundSize: "48px 48px",
};

/* ── Typography style objects (used in inline styles) ───────────── */
export const playfair = {
  fontFamily: FONTS.serif,
  fontWeight: 700,
  color: "var(--charcoal)",
};

export const eyebrowSt = {
  fontSize: 12,
  fontWeight: 600,
  color: "var(--gold)",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
};

/* ── Layout ──────────────────────────────────────────────────────── */
export const containerStyle = {
  maxWidth: 1120,
  margin: "0 auto",
  padding: "0 1.5rem",
};

/* ── CSS variable generator ──────────────────────────────────────── */
/**
 * Called by layout.js to inject a <style> tag.
 * Every CSS module that uses var(--gold) etc. gets its value from here.
 * This is the bridge between JS theme values and CSS module styles.
 */
export function generateCSSVars(overrides = {}) {
  const navy      = overrides.navy      ?? T.navy;
  const navyLight = overrides.navyLight ?? T.navyLight;
  const navyMid   = overrides.navyMid   ?? T.navyMid;
  const navyDeep  = overrides.navyDeep  ?? T.navyDeep;
  const gold      = overrides.gold      ?? T.gold;
  const goldLight = overrides.goldLight ?? T.goldLight;
  const goldPale  = overrides.goldPale  ?? T.goldPale;
  const warmWhite = overrides.warmWhite ?? T.warmWhite;
  const charcoal  = overrides.charcoal  ?? T.charcoal;
  const textBody  = overrides.textBody  ?? T.textBody;
  const cream     = overrides.cream     ?? T.cream;
  const creamDark = overrides.creamDark ?? T.creamDark;
  const textMuted = T.textMuted;
  const textSubtle= T.textSubtle;

  return `
    --navy:         ${navy};
    --navy-light:   ${navyLight};
    --navy-mid:     ${navyMid};
    --navy-deep:    ${navyDeep};
    --gold:         ${gold};
    --gold-light:   ${goldLight};
    --gold-pale:    ${goldPale};
    --gold-dim:     ${gold}1e;
    /* --accent / --accent-light : semantic aliases for --gold (which is
       teal now — the token name is a historical artefact). New code
       should prefer --accent; existing code keeps working unchanged. */
    --accent:       ${gold};
    --accent-light: ${goldLight};
    --accent-pale:  ${goldPale};
    --accent-dim:   ${gold}1e;
    /* --link / --link-hover : darker teal that passes WCAG AA for small
       body text on white (5.3:1). Use these for inline hyperlinks inside
       prose. Keep --gold / --accent for buttons, eyebrows, top borders,
       and large-text contexts where the lighter teal is fine. */
    --link:         #0F766E;
    --link-hover:   #0D9488;
    --warm-white:   ${warmWhite};
    --cream:        ${cream};
    --cream-dark:   ${creamDark};
    --charcoal:     ${charcoal};
    --text-body:    ${textBody};
    --text-muted:   ${textMuted};
    --text-subtle:  ${textSubtle};
    --border:       ${T.border};
    --border-light: ${T.borderLight};

    --blue:   ${PILLAR.blue};
    --purple: ${PILLAR.purple};
    --green:  ${PILLAR.green};
    --coral:  ${PILLAR.coral};
    --amber:  ${PILLAR.amber};
    --red:    ${PILLAR.red};
    --indigo: ${PILLAR.indigo};

    --grad-gold:        linear-gradient(135deg, ${gold}, ${goldLight});
    --grad-navy:        linear-gradient(160deg, ${navy}, ${navyLight});
    --grad-gold-subtle: linear-gradient(135deg, ${gold}14, ${goldLight}0a);
    --shadow-gold:      0 8px 32px ${gold}38;
  `.trim();
}
