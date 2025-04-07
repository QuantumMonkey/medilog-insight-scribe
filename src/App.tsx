import { lazy, Suspense, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import "./App.css";

// Lazy-loaded pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const HealthReports = lazy(() => import("./pages/HealthReports"));
const VitalMetrics = lazy(() => import("./pages/VitalMetrics"));
const Medications = lazy(() => import("./pages/Medications"));
const Analytics = lazy(() => import("./pages/Analytics"));
const HealthAssistant = lazy(() => import("./pages/HealthAssistant"));
const Consultations = lazy(() => import("./pages/Consultations"));
const Timeline = lazy(() => import("./pages/Timeline"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => {
  // Mobile sidebar state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();

  // Auto-close sidebar on mobile navigation
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileSidebarOpen(true);
      else setIsMobileSidebarOpen(false);
    };

    handleResize(); // Initialize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobileSidebarOpen(false);
    }
  }, [location]);

  // Viewport meta tag for mobile
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              
            // In App.tsx (modified Route element)
              <Route 
                path="/" 
                element={
                  <Layout 
                    isMobileSidebarOpen={isMobileSidebarOpen}
                    onMobileSidebarToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                  >
                    {/* Empty fragment as children */}
                    <></>
                  </Layout>
                }
              >

                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/reports" element={<HealthReports />} />
                <Route path="/consultations" element={<Consultations />} />
                <Route path="/vitals" element={<VitalMetrics />} />
                <Route path="/medications" element={<Medications />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/assistant" element={<HealthAssistant />} />
                <Route path="/timeline" element={<Timeline />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;