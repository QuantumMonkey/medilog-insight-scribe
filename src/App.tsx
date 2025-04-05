
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import HealthReports from "./pages/HealthReports";
import VitalMetrics from "./pages/VitalMetrics";
import Medications from "./pages/Medications";
import Analytics from "./pages/Analytics";
import HealthAssistant from "./pages/HealthAssistant";
import Consultations from "./pages/Consultations";
import Timeline from "./pages/Timeline";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
