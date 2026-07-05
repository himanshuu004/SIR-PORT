"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { MapPin, Phone, Mail, ChevronRight, Zap } from "lucide-react";
import Fade from "./Fade";
import { Stagger, StaggerItem } from "./Stagger";
import styles from "./Footer.module.css";

function SocialSVG({ path, viewBox = "0 0 24 24" }) {
  return (
    <svg viewBox={viewBox} fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

const BRAND_PATHS = {
  x: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.87L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  facebook: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  linkedin: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  youtube: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  whatsapp: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z",
};

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Philosophy", href: "/philosophy" },
  { label: "Media", href: "/media" },
  { label: "Contact", href: "/contact" },
];

const SOCIAL_PRIMARY = [
  { brand: "facebook", href: "https://www.facebook.com/basava.ias", label: "Facebook" },
  { brand: "x", href: "https://x.com/basava_ias", label: "Twitter / X" },
  { brand: "linkedin", href: "https://linkedin.com/in/basava-purushottam-b862247", label: "LinkedIn" },
  { brand: "whatsapp", href: "https://wa.me/917042120001", label: "WhatsApp" },
];

const SOCIAL_SECONDARY = [
  { brand: "youtube", href: "https://www.youtube.com/@basava_ias", label: "YouTube" },
];

const EMAIL = "basava.ias@gmail.com";
const WATERMARK_TEXT = "Dr. B.V.R.C. Purushottam";
const WATERMARK_REPEATS = 5;

export default function Footer({ overlay = false }) {
  return (
    <footer className={`${styles.footer} ${overlay ? styles.footerOverlay : ""}`}>
      <div className={styles.inner}>
        <Stagger className={styles.grid} stagger={0.1}>
          {/* Brand */}
          <StaggerItem className={styles.brand}>
            <Link href="/" className={styles.brandRow}>
              <motion.div
                className={styles.logoCircle}
                whileHover={{ scale: 1.08, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <Zap
                  className="w-7 h-7"
                  style={{ fill: "#F3E48A", stroke: "white" }}
                  aria-hidden="true"
                />
              </motion.div>
              <div className={styles.brandTitles}>
                <span className={styles.brandName}>Purushottam</span>
                <span className={styles.brandSub}>Dr. B.V.R.C. Purushottam, IAS (Retd.)</span>
              </div>
            </Link>
            <p className={styles.tagline}>
              Bridging AI, governance, and Indic philosophy to reimagine public systems for 1.4 billion Indians.
            </p>
          </StaggerItem>

          {/* Quick Links */}
          <StaggerItem>
            <nav aria-label="Footer quick links">
              <h3 className={styles.colTitle}>Quick Links</h3>
              <ul className={styles.linkList}>
                {QUICK_LINKS.map((link) => (
                  <li key={link.href}>
                    <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                      <Link href={link.href} className={styles.link}>
                        {link.label}
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </nav>
          </StaggerItem>

          {/* Contact Info */}
          <StaggerItem>
            <h3 className={styles.colTitle}>Contact Info</h3>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <MapPin className={`${styles.contactIcon} ${styles.contactIconPin}`} size={16} aria-hidden="true" />
                <span>Dehradun, Uttarakhand, India</span>
              </li>
              <li className={styles.contactItem}>
                <Phone className={`${styles.contactIcon} ${styles.contactIconMuted}`} size={16} aria-hidden="true" />
                <a href="tel:+917042120001" className={styles.emailLink}>
                  +91-7042120001
                </a>
              </li>
              <li className={styles.contactItem}>
                <Mail className={`${styles.contactIcon} ${styles.contactIconMuted}`} size={16} aria-hidden="true" />
                <div className={styles.emailRow}>
                  <a href={`mailto:${EMAIL}`} className={styles.emailLink}>
                    {EMAIL}
                  </a>
                  <motion.a
                    href={`mailto:${EMAIL}`}
                    className={styles.emailBtn}
                    aria-label="Send email"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronRight size={14} aria-hidden="true" />
                  </motion.a>
                </div>
              </li>
            </ul>
          </StaggerItem>

          {/* Follow Us */}
          <StaggerItem>
            <h3 className={styles.colTitle}>Follow Us</h3>
            <div className={styles.socialGrid}>
              {[...SOCIAL_PRIMARY, ...SOCIAL_SECONDARY].map(({ brand, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIcon}
                  whileHover={{ scale: 1.12, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <SocialSVG path={BRAND_PATHS[brand]} />
                </motion.a>
              ))}
            </div>
            <p className={styles.newsletterText}>
              Subscribe to our{" "}
              <Link href="/#newsletter" className={styles.newsletterLink}>
                newsletter
              </Link>{" "}
              for updates
            </p>
          </StaggerItem>
        </Stagger>

        <Fade delay={0.1}>
          <hr className={styles.divider} />
        </Fade>

        <Fade delay={0.15}>
          <div className={styles.bottom}>
            <p className={styles.copyright}>
              © 2026 Dr. B.V.R.C. Purushottam. All rights reserved.
            </p>
            <p className={styles.disclaimer}>
              Views expressed are personal and do not represent the Government of India or the Government of Uttarakhand.
            </p>
          </div>
        </Fade>
      </div>

      <div className={styles.watermarkWrap} aria-hidden="true">
        <div className={styles.marquee}>
          <div className={styles.marqueeTrack}>
            {[0, 1].map((group) => (
              <div key={group} className={styles.marqueeGroup}>
                {Array.from({ length: WATERMARK_REPEATS }).map((_, i) => (
                  <span key={i} className={styles.watermarkText}>
                    <span className={styles.watermarkSolid}>{WATERMARK_TEXT}</span>
                    <span className={styles.watermarkDots} aria-hidden="true">
                      {WATERMARK_TEXT}
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
