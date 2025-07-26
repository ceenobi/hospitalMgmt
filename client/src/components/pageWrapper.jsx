import { useWaveAnimation, ANIMATION_TYPES } from "@/hooks/useWaveAnime";

export function PageWrapper({ children, className = "" }) {
  return (
    <div
      className={`cdd container pt-20 md:pt-24 lg:pt-10 pb-6 px-4 mx-auto ${className}`}
    >
      {children}
    </div>
  );
}

export const PageSection = ({
  children,
  index = 0,
  className = "",
  staggerDelay = 50,
  duration = 600,
  animationType = ANIMATION_TYPES.FADE_UP,
  once = true,
}) => {
  const { getItemStyle, getItemClassName } = useWaveAnimation({
    staggerDelay,
    duration,
    animationType,
    once,
  });

  return (
    <div style={getItemStyle(index)} className={getItemClassName(className)}>
      {children}
    </div>
  );
};
