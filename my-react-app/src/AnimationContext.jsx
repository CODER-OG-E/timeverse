
import { createContext, useContext, useEffect, useState } from "react";

const AnimationContext = createContext(null);

export function AnimationProvider({ children }) {
  const [animationMode, setAnimationMode] = useState(() => {
    const savedPreference = localStorage.getItem("timeverse-animation-mode");

    return savedPreference || "short";
  });

  useEffect(() => {
    localStorage.setItem("timeverse-animation-mode", animationMode);

    document.documentElement.dataset.animation = animationMode;
  }, [animationMode]);

  return (
    <AnimationContext.Provider
      value={{ animationMode, setAnimationMode }}
    >
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimations() {
  const context = useContext(AnimationContext);

  if (!context) {
    throw new Error(
      "useAnimations must be used inside AnimationProvider"
    );
  }

  return context;
}
