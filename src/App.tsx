import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BadmintonFootwork from "./pages/BadmintonFootwork";
import TableTennisFootwork from "./pages/TableTennisFootwork";
import TennisFootwork from "./pages/TennisFootwork";
import PickleballFootwork from "./pages/PickleballFootwork";
import RacketSportsFootwork from "./pages/RacketSportsFootwork";
import HowItWorks from "./pages/HowItWorks";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/badminton" element={<BadmintonFootwork />} />
          <Route path="/table-tennis" element={<TableTennisFootwork />} />
          <Route path="/tennis" element={<TennisFootwork />} />
          <Route path="/pickleball" element={<PickleballFootwork />} />
          <Route path="/multi-sport" element={<RacketSportsFootwork />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
