import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ADMIN_PATH } from "@/lib/config/admin";

// Lazy load components
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const TravelQuizPage = lazy(() => import("./pages/TravelQuizPage"));
const TravelQuizPage2 = lazy(() => import("./pages/TravelQuizPage2"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const SMSTestPage = lazy(() => import("./pages/SMSTestPage"));
const KavehnegarDemo = lazy(() => import("./pages/KavehnegarDemo"));

const queryClient = new QueryClient();

const loadingFallback = (
  <div className="h-screen w-screen flex items-center justify-center">
    در حال بارگذاری...
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              <Suspense fallback={loadingFallback}>
                <Index />
              </Suspense>
            } 
          />
          <Route 
            path="/quiz" 
            element={
              <Suspense fallback={loadingFallback}>
                <TravelQuizPage />
              </Suspense>
            } 
          />
          <Route 
            path="/quiz2" 
            element={
              <Suspense fallback={loadingFallback}>
                <TravelQuizPage2 />
              </Suspense>
            } 
          />
          <Route 
            path={`/${ADMIN_PATH}`} 
            element={
              <Suspense fallback={loadingFallback}>
                <AdminPage />
              </Suspense>
            } 
          />
          <Route 
            path="/sms-test" 
            element={
              <Suspense fallback={loadingFallback}>
                <SMSTestPage />
              </Suspense>
            } 
          />
          <Route 
            path="/kavenegar" 
            element={
              <Suspense fallback={loadingFallback}>
                <KavehnegarDemo />
              </Suspense>
            } 
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route 
            path="*" 
            element={
              <Suspense fallback={loadingFallback}>
                <NotFound />
              </Suspense>
            } 
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
