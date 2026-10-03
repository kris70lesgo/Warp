import type { Metadata } from "next";
import LandingPage from "./landing-page";

export const metadata: Metadata = {
  title: "Warp — Evidence-led supplier response",
  description:
    "When a critical supplier fails, Warp brings supplier records, documents and live intelligence into one evidence graph. AI prepares the response; people authorize it.",
};

export default function Home() {
  return <LandingPage />;
}
