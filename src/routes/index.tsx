import { createFileRoute } from "@tanstack/react-router";
import { Teaser } from "@/components/teaser";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <Teaser />;
}
