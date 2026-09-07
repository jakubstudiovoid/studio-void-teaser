export const site = {
  name: "VOID",
  brand: "STUDIO VOID",
  legalName: "STUDIO VOID",
  tagline: "portfolio v rekonstrukci",
  description:
    "STUDIO VOID — grafické studio. Identita, tisk, web a kampaně. Portfolio v rekonstrukci.",
  email: "hello@studiovoid.cz",
  emailHref: "mailto:hello@studiovoid.cz",
  url: "https://studiovoid.cz",
  address: {
    city: "Jablonec nad Nisou",
    region: "Liberecký kraj",
    country: "Česko",
  },
  social: {
    instagram: {
      label: "Instagram",
      href: "https://instagram.com/studiovoid.cz",
    },
    facebook: {
      label: "Facebook",
      href: "https://facebook.com/grafickestudiovoid",
    },
  },
} as const;

export function pageTitle(title?: string) {
  return title ? `${title} — ${site.brand}` : `${site.brand} — ${site.tagline}`;
}
