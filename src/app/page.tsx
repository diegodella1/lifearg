import { MatcherExperience } from "@/components/matcher-experience";
import { runtimeCapabilities } from "@/lib/server/capabilities";

export const dynamic = "force-dynamic";

export default function Home() {
  return <MatcherExperience capabilities={runtimeCapabilities()} />;
}
