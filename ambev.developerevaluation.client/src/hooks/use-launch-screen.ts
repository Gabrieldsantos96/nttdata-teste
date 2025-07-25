"use client";

import { useState } from "react";

interface UseLaunchScreenOptions {
  duration?: number;

  delay?: number;
}

export function useLaunchScreen(options: UseLaunchScreenOptions = {}) {
  const { duration = 3000, delay = 0 } = options;
  const [isLoading, setIsLoading] = useState(false);

  const showLaunchScreen = () => {
    setTimeout(() => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, duration);
    }, delay);
  };

  return {
    isLoading,
    showLaunchScreen,
    setIsLoading,
  };
}
