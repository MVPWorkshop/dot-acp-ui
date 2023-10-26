import dotLoader from "./dot-loader.json";
import poolsLoader from "./pools-loader.json";

export const lottieOptions = {
  loop: true,
  autoplay: true,
  animationData: dotLoader,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export const poolsLottieOptions = {
  loop: true,
  autoplay: true,
  animationData: poolsLoader,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
