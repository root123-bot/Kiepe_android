import React, { memo, useEffect, useRef } from "react";
import AnimatedLottieView from "lottie-react-native";

function Animation({
  source,
  style,
  onAnimationFinish,
  autoplay = true,
  loop = true,
  speed = 1.5,
}) {
  // temp ios fix begin
  // @see https://github.com/lottie-react-native/lottie-react-native/issues/832
  const lottieRef = useRef(null);
  useEffect(() => {
    lottieRef.current?.reset();
    setTimeout(() => {
      lottieRef.current?.play();
    }, 0);
  }, []);
  // fix end

  return (
    <AnimatedLottieView
      source={source}
      autoPlay={autoplay}
      loop={loop}
      style={style}
      speed={speed}
      onAnimationFinish={onAnimationFinish}
      ref={lottieRef}
    />
  );
}

export default memo(Animation);
