
import { useState, useEffect, useCallback } from "react";

// Default breakpoint for mobile devices
const MOBILE_BREAKPOINT = 768;

/**
 * Hook to detect if the current viewport is mobile-sized
 * @param customBreakpoint Optional custom breakpoint in pixels
 * @returns Boolean indicating if the viewport is mobile-sized
 */
export function useIsMobile(customBreakpoint?: number) {
  const breakpoint = customBreakpoint || MOBILE_BREAKPOINT;
  
  // Function to determine if window width is below breakpoint
  const checkIsMobile = useCallback(() => {
    return window.innerWidth < breakpoint;
  }, [breakpoint]);
  
  // Initialize state with current window size
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    // Use a default value for SSR environments
    if (typeof window === 'undefined') return false;
    return checkIsMobile();
  });

  useEffect(() => {
    // Update state on mount
    setIsMobile(checkIsMobile());
    
    // Handler for window resize events
    const handleResize = () => {
      setIsMobile(checkIsMobile());
    };
    
    // Add event listener
    window.addEventListener("resize", handleResize);
    
    // Clean up event listener
    return () => window.removeEventListener("resize", handleResize);
  }, [checkIsMobile]);

  return isMobile;
}
