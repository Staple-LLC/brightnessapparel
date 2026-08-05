import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import SiteLayout from "@/components/site-layout";
import HomePage from "@/pages/home";
import StudioPage from "@/pages/studio";
import WhyUsPage from "@/pages/why-us";
import ClientelePage from "@/pages/clientele";
import OneStopPage from "@/pages/one-stop";
import PrintingPage from "@/pages/printing";
import FabricsPage from "@/pages/fabrics";
import ProcessPage from "@/pages/process";

/* Lazy so each route — and the assets it references — compiles into its own
   chunk. Without this the split is cosmetic: the code and image URLs still
   ship to every homepage visitor even though nothing renders them. */
const AboutPage = lazy(() => import("@/pages/about"));
const GalleryPage = lazy(() => import("@/pages/gallery"));
const JournalPage = lazy(() => import("@/pages/journal"));
const ArticlePage = lazy(() => import("@/pages/article"));
const ReachUsPage = lazy(() => import("@/pages/reach-us"));

/* What stays on the home page: the narrative run from hero through to how an
   order is placed. About, portfolio, journal and contact are their own routes
   — each is either weight that grows without bound (the gallery), content that
   needs its own URL to be linkable and indexable, or both. */
function HomeRoute() {
  return (
    <>
      <HomePage />
      <StudioPage />
      <WhyUsPage />
      <ClientelePage />
      <OneStopPage />
      <PrintingPage />
      <FabricsPage />
      <ProcessPage />
    </>
  );
}

export default function App() {
  return (
    <SiteLayout>
      <Suspense fallback={<div className="min-h-screen" />}>
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/portfolio" element={<GalleryPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/journal/:slug" element={<ArticlePage />} />
          <Route path="/contact" element={<ReachUsPage />} />
        </Routes>
      </Suspense>
    </SiteLayout>
  );
}
