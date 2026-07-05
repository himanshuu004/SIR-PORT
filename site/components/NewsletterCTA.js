import Fade from "./Fade";
import GhostSignupForm from "./GhostSignupForm";
import s from "./NewsletterCTA.module.css";

const COPY = {
  mind: {
    heading: "Get the next essay on mind, machine, and meaning",
    body: "Essays at the intersection of AI, philosophy, and Indian governance. No promotional content.",
  },
  policy: {
    heading: "Data-driven governance analysis. Weekly. No fluff.",
    body: "Policy frameworks, implementation reports, and probabilistic thinking — from inside the Indian Administrative Service.",
  },
  general: {
    heading: "If this resonated — here's where it continues",
    body: "Essays on AI, governance, decision-making, neuroscience, and reflective thought — by a serving IAS officer. Unsubscribe anytime.",
  },
};

export default function NewsletterCTA({ variant = "general", overlay = false }) {
  const { heading, body } = COPY[variant] ?? COPY.general;

  return (
    <section
      id="newsletter"
      className={`${s.section} ${overlay ? s.sectionOverlay : ""}`}
    >
      {!overlay && (
        <>
          <div className={`${s.dots} drift-slow`} aria-hidden="true" />
          <div className={`${s.glow} drift-slow`} aria-hidden="true" />
        </>
      )}
      <div className={s.inner}>
        <Fade>
          <span className={s.eyebrow}>Signal from the Frontier</span>
          <h2 className={s.heading}>{heading}</h2>
          <p className={s.body}>{body}</p>

          <div className={s.embedWrap}>
            <GhostSignupForm />
          </div>

          <p className={s.note}>
            We'll send a one-click sign-in link to confirm. No password needed.
          </p>

          <p className={s.disclaimer}>
            Views expressed are personal and do not represent the Government of India or the Government of Uttarakhand.
          </p>
        </Fade>
      </div>
    </section>
  );
}
