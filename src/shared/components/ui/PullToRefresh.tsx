"use client";

import * as React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { RefreshCw } from "lucide-react";

export function PullToRefresh({ onRefresh }: { onRefresh: () => void }) {
  const { scrollY } = useScroll();
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  
  // Transform scroll position into pull progress (0 to 1)
  const pullProgress = useTransform(scrollY, [0, -100], [0, 1]);
  const rotate = useTransform(pullProgress, [0, 1], [0, 360]);
  const opacity = useTransform(pullProgress, [0, 0.5], [0, 1]);
  
  const springPull = useSpring(pullProgress, { stiffness: 400, damping: 40 });

  React.useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      if (latest < -80 && !isRefreshing) {
        setIsRefreshing(true);
        onRefresh();
        // Reset after a delay to allow UI to catch up
        setTimeout(() => setIsRefreshing(false), 2000);
      }
    });
    return () => unsubscribe();
  }, [scrollY, isRefreshing, onRefresh]);

  return (
    <motion.div
      style={{ 
        opacity,
        scale: springPull,
        rotate
      }}
      className="fixed top-4 left-1/2 z-[60] flex size-10 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 backdrop-blur-md md:hidden"
    >
      <RefreshCw className={isRefreshing ? "size-5 animate-spin" : "size-5"} />
    </motion.div>
  );
}
