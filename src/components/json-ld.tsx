import { site } from "@/data/site";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.brand,
    alternateName: site.name,
    description: site.description,
    url: site.url,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: "CZ",
    },
    areaServed: { "@type": "Country", name: "Czech Republic" },
    sameAs: [site.social.instagram.href, site.social.facebook.href],
    knowsAbout: [
      "Graphic design",
      "Brand identity",
      "Web design",
      "Art direction",
      "Campaigns",
    ],
  };

  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  );
}
