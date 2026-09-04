"use client";

import { useEffect } from "react";

export default function RegisterSW() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // registration failed — app still works online, just without offline support
      });
    }
  }, []);

  return null;
}
