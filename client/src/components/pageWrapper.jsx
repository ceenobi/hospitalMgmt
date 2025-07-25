import { useWaveAnimation, ANIMATION_TYPES } from "@/hooks/useWaveAnime";

/**
 * PageWrapper - A container component that applies smooth entrance animations to its children
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to be rendered
 * @param {string} [props.className] - Additional CSS classes
 * @param {number} [props.staggerDelay=50] - Delay between each child's animation in milliseconds
 * @param {number} [props.duration=600] - Animation duration in milliseconds
 * @param {string} [props.animationType='fade-up'] - Type of animation to use
 * @param {boolean} [props.once=true] - Whether the animation should happen only once
 */
export function PageWrapper({
  children,
  className = "",
  staggerDelay = 50,
  duration = 600,
  animationType = ANIMATION_TYPES.FADE_UP,
  once = true,
}) {
  const { containerRef, getItemStyle, getItemClassName } = useWaveAnimation({
    staggerDelay,
    duration,
    animationType,
    once,
  });

  return (
    <div
      className={`container pt-20 md:pt-24 lg:pt-10 pb-6 px-4 mx-auto ${className}`}
      // style={getItemStyle()}
    >
      {children}
    </div>
  );
}

/**
 * PageSection - A section component that can be used within PageWrapper for nested animations
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to be rendered
 * @param {number} [props.index=0] - Index for staggered animation
 * @param {string} [props.className] - Additional CSS classes
 * @param {number} [props.staggerDelay=50] - Delay between each child's animation in milliseconds
 * @param {number} [props.duration=600] - Animation duration in milliseconds
 * @param {string} [props.animationType='fade-up'] - Type of animation to use
 * @param {boolean} [props.once=true] - Whether the animation should happen only once
 */
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
