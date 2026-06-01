"use client";

import React, { useEffect } from "react";
import { ReactLenis, useLenis } from "@/lib/lenis";
import { useLocation } from "react-router-dom";

interface LenisProps {
  children: React.ReactNode;
  isInsideModal?: boolean;
}

function SmoothScroll({ children, isInsideModal = false }: LenisProps) {
  const lenis = useLenis(({ scroll }) => {
    // called every scroll
  });
  
  const location = useLocation();

  useEffect(() => {
    if (lenis && location.hash) {
      const targetElement = document.querySelector(location.hash);
      if (targetElement) {
        // Wait briefly to allow layout to settle
        setTimeout(() => {
          lenis.scrollTo(location.hash, { offset: 0, immediate: true });
        }, 100);
      }
    }
  }, [lenis, location.hash, location.pathname]);

  useEffect(() => {
    document.addEventListener("DOMContentLoaded", () => {
      lenis?.stop();
      lenis?.start();
    });
  }, []);

  return (
    <ReactLenis
      root
      options={{
        duration: 2,
        prevent: (node) => {
          if (isInsideModal) return true;
          const modalOpen = node.classList.contains("modall");
          return modalOpen;
        },
      }}
    >
      {children}
    </ReactLenis>
  );
}

export default SmoothScroll;
