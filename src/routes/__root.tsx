import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { JsonLd } from "@/components/json-ld";
import { NotFound } from "@/components/not-found";
import { pageTitle, site } from "@/data/site";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: pageTitle() },
      { name: "description", content: site.description },
      { name: "theme-color", content: "#000000" },
      { name: "color-scheme", content: "dark" },
      { name: "robots", content: "index, follow" },
      { name: "author", content: site.brand },
      { name: "geo.region", content: "CZ-LI" },
      { name: "geo.placename", content: site.address.city },
      { name: "referrer", content: "strict-origin-when-cross-origin" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "canonical", href: site.url },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "me", href: site.social.instagram.href },
      { rel: "me", href: site.social.facebook.href },
    ],
  }),
  notFoundComponent: NotFound,
  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="cs" suppressHydrationWarning className="antialiased">
      <head>
        <HeadContent />
      </head>
      <body className="bg-bg text-fg">
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <JsonLd />
        <Scripts />
      </body>
    </html>
  );
}
