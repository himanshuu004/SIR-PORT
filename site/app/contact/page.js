import ContactClient from "./ContactClient";

export const metadata = {
  title: "Contact",
  description:
    "Get in touch for speaking engagements, policy collaboration, advisory roles, or media inquiries. Based in Dehradun, available in-person and virtually.",
  keywords: ["contact", "speaking engagement", "IAS advisory", "media inquiry", "collaboration"],
  openGraph: {
    title: "Contact — Dr. B.V.R.C. Purushottam",
    description: "Get in touch for speaking engagements, policy collaboration, advisory roles, or media inquiries.",
    url: "https://basavapurushottam.com/contact",
    type: "website",
  },
  twitter: { card: "summary", title: "Contact — Dr. B.V.R.C. Purushottam" },
  alternates: { canonical: "https://basavapurushottam.com/contact" },
};

export default function ContactPage() {
  return <ContactClient />;
}
