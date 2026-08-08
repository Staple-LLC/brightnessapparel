import { Suspense, lazy } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import SiteLayout from "@/components/site-layout";
import HomePage from "@/pages/home";
import StudioPage from "@/pages/studio";
import AboutPage from "@/pages/about";
import ClientelePage from "@/pages/clientele";
import OneStopPage from "@/pages/one-stop";
import ProcessPage from "@/pages/process";
import ReelsPage from "@/pages/reels";

/* Lazy so each route — and the assets it references — compiles into its own
   chunk. Without this the split is cosmetic: the code and image URLs still
   ship to every homepage visitor even though nothing renders them. */
const GalleryPage = lazy(() => import("@/pages/gallery"));
const CollectionPage = lazy(() => import("@/pages/collection"));
const JournalPage = lazy(() => import("@/pages/journal"));
const ArticlePage = lazy(() => import("@/pages/article"));
const ReachUsPage = lazy(() => import("@/pages/reach-us"));
/* Lazy for the same reason as the gallery: reference material, carrying its
   own photography, that no longer belongs in the home page's graph. */
const FabricsPage = lazy(() => import("@/pages/fabrics"));
const PrintingPage = lazy(() => import("@/pages/printing"));

/* What stays on the home page: the narrative run from hero through to how an
   order is placed, About included — the company story is short enough to read
   in passing and the drone footage is the strongest thing on the site, so
   burying it behind a route cost more than it saved. Portfolio, blog and
   contact remain their own routes: each is either weight that grows without
   bound (the gallery) or content that needs its own URL to be linkable and
   indexable. */
function HomeRoute() {
  return (
    <>
      <HomePage />
      <StudioPage />
      <AboutPage />
      <ClientelePage />
      <OneStopPage />
      <ProcessPage />
      <ReelsPage />
    </>
  );
}

/* Occupies the viewport while a route's chunk is fetched, so the footer does
   not ride up and then drop back. The bar itself only becomes visible if the
   fetch outlasts a quarter second — see .loader-track. */
function RouteLoading() {
  return (
    <div className="min-h-screen" role="status" aria-label="Loading page">
      <div className="loader-track h-px w-full overflow-hidden">
        <div className="loader-bar h-full w-1/4 bg-current opacity-40" />
      </div>
    </div>
  );
}

export default function App() {
  /* Keyed on the path so the wrapper remounts per navigation and the enter
     animation replays. Without the key React reuses the element and the
     animation runs once, on first load only. */
  const { pathname } = useLocation();

  return (
    <SiteLayout>
      <Suspense fallback={<RouteLoading />}>
        <div key={pathname} className="animate-page-in">
          <Routes>
            <Route path="/" element={<HomeRoute />} />
            {/* /about was a route until About moved onto the home page. Any
                link already shared or indexed would otherwise land on a blank
                screen, since nothing else matches it — this sends them to the
                section instead, using the same router state the nav's own
                cross-route section links use. */}
            <Route
              path="/about"
              element={
                <Navigate
                  to="/"
                  replace
                  state={{ scrollTo: "about", at: Date.now() }}
                />
              }
            />
            <Route path="/methods" element={<PrintingPage />} />
            <Route path="/materials" element={<FabricsPage />} />
            <Route path="/portfolio" element={<GalleryPage />} />
            <Route path="/portfolio/:slug" element={<CollectionPage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/journal/:slug" element={<ArticlePage />} />
            <Route path="/contact" element={<ReachUsPage />} />
          </Routes>
        </div>
      </Suspense>
    </SiteLayout>
  );
}
