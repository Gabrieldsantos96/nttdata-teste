"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "~/contexts/theme-provider";

interface LaunchScreenProps {
  isLoading: boolean;
  variant?: "default" | "pulse" | "bounce" | "rotate" | "glow";
}

const ReactLogo = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 10.11C13.03 10.11 13.87 10.95 13.87 12C13.87 13.05 13.03 13.89 12 13.89C10.95 13.89 10.11 13.05 10.11 12C10.11 10.95 10.95 10.11 12 10.11Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21.17 12C21.17 13.43 18.36 14.24 16.54 14.64C16.57 14.90 16.58 15.18 16.58 15.47C16.58 18.78 15.17 21.17 12.83 21.17C11.99 21.17 11.14 20.68 10.35 19.85C9.14 20.68 8.01 21.17 7.17 21.17C4.83 21.17 3.42 18.78 3.42 15.47C3.42 15.18 3.43 14.90 3.46 14.64C1.64 14.24 -1.17 13.43 -1.17 12C-1.17 10.57 1.64 9.76 3.46 9.36C3.43 9.10 3.42 8.82 3.42 8.53C3.42 5.22 4.83 2.83 7.17 2.83C8.01 2.83 9.14 3.32 10.35 4.15C11.14 3.32 11.99 2.83 12.83 2.83C15.17 2.83 16.58 5.22 16.58 8.53C16.58 8.82 16.57 9.10 16.54 9.36C18.36 9.76 21.17 10.57 21.17 12ZM19.14 12C19.14 11.71 18.29 11.33 16.97 10.97C16.45 11.06 15.87 11.14 15.25 11.20C15.06 10.57 14.81 9.97 14.51 9.42C15.25 8.85 15.90 8.24 16.38 7.62C18.06 8.83 19.14 10.34 19.14 12ZM14.85 9.32C14.24 8.72 13.54 8.20 12.83 7.78C13.54 8.20 14.24 8.72 14.85 9.32ZM12.83 16.22C13.54 15.80 14.24 15.28 14.85 14.68C14.24 15.28 13.54 15.80 12.83 16.22ZM9.15 14.68C9.76 15.28 10.46 15.80 11.17 16.22C10.46 15.80 9.76 15.28 9.15 14.68ZM9.15 9.32C9.76 8.72 10.46 8.20 11.17 7.78C10.46 8.20 9.76 8.72 9.15 9.32Z"
      fill="currentColor"
    />
  </svg>
);

const animationVariants = {
  default: {
    animate: {
      y: [-80, 0, 20, 0],
      opacity: [1, 0.5, 0, 0.5],
      rotate: [0, 360],
    },
    transition: {
      duration: 3.2,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
  pulse: {
    animate: {
      scale: [1, 1.2, 0.8, 1],
      opacity: [0.7, 1, 0.3, 0.7],
      rotate: [0, 180, 360],
    },
    transition: {
      duration: 2.5,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
  bounce: {
    animate: {
      y: [0, -100, -50, -75, -25, -50, 0],
      rotate: [0, 10, -10, 5, -5, 0],
      scale: [1, 0.9, 1.1, 0.95, 1.05, 1],
    },
    transition: {
      duration: 2.8,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
  rotate: {
    animate: {
      rotate: [0, 360],
      scale: [1, 1.1, 0.9, 1],
      opacity: [0.8, 1, 0.6, 0.8],
    },
    transition: {
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
      ease: "linear",
    },
  },
  glow: {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.8, 1, 0.8],
      filter: [
        "drop-shadow(0 0 0px rgba(96, 165, 250, 0.5))",
        "drop-shadow(0 0 20px rgba(96, 165, 250, 0.8))",
        "drop-shadow(0 0 0px rgba(96, 165, 250, 0.5))",
      ],
    },
    transition: {
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
};

export function LaunchScreen({
  isLoading,
  variant = "default",
}: LaunchScreenProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoading) return null;

  const isDark = theme === "dark";
  const selectedAnimation = animationVariants[variant];

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: isDark
              ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)"
              : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
          }}
        >
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-1 h-1 rounded-full ${isDark ? "bg-blue-400/30" : "bg-blue-600/20"}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <div className="relative">
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              style={{
                background: isDark
                  ? "radial-gradient(circle, rgba(96, 165, 250, 0.3) 0%, transparent 70%)"
                  : "radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)",
                filter: "blur(20px)",
              }}
            />

            {/* @ts-expect-error declare module */}
            <motion.div
              {...selectedAnimation}
              className="relative z-10 flex items-center justify-center"
            >
              <div
                className={`p-6 rounded-2xl ${
                  isDark
                    ? "bg-slate-800/50 border border-slate-700/50"
                    : "bg-white/50 border border-slate-200/50"
                } backdrop-blur-sm shadow-2xl`}
              >
                <ReactLogo
                  className={`w-16 h-16 ${isDark ? "text-blue-400" : "text-blue-600"}`}
                />
              </div>
            </motion.div>

            {[1, 2, 3].map((ring) => (
              <motion.div
                key={ring}
                className="absolute inset-0 rounded-full border border-dashed opacity-20"
                style={{
                  width: `${120 + ring * 40}px`,
                  height: `${120 + ring * 40}px`,
                  left: `${-20 - ring * 20}px`,
                  top: `${-20 - ring * 20}px`,
                  borderColor: isDark ? "#60a5fa" : "#3b82f6",
                }}
                animate={{
                  rotate: ring % 2 === 0 ? [0, 360] : [360, 0],
                }}
                transition={{
                  duration: 8 + ring * 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute bottom-32 text-center"
          >
            <motion.h2
              className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-800"}`}
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              Loading React App
            </motion.h2>

            <div className="flex justify-center space-x-1">
              {[0, 1, 2].map((dot) => (
                <motion.div
                  key={dot}
                  className={`w-2 h-2 rounded-full ${isDark ? "bg-blue-400" : "bg-blue-600"}`}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: dot * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
