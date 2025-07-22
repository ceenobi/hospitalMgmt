import { useWaveAnimation } from "@/hooks/useWaveAnime";

export function PageWrapper({ classname, children }) {
  // const { containerRef, getItemStyle, getItemClassName } = useWaveAnimation({
  //   staggerDelay: 50,
  //   duration: 600,
  // });
  return (
    <div className={`container pt-20 md:pt-10 pb-6 px-4 mx-auto ${classname}`}>
      {children}
    </div>
  );
}

export const PageSection = ({ children, index, className = "" }) => {
  const { getItemStyle, getItemClassName } = useWaveAnimation({
    staggerDelay: 50,
    duration: 600,
  });
  return (
    <div style={getItemStyle(index)} className={getItemClassName(className)}>
      {children}
    </div>
  );
};
