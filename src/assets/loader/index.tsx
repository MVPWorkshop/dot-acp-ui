import Lottie from "lottie-react";
import dotLoader from "./dot-loader.json";
import poolsLoader from "./pools-loader.json";

export const LottieSmall = () => (
  <Lottie animationData={dotLoader} loop={true} autoplay={true} style={{ height: 20, width: 20 }} />
);

export const LottieMedium = () => (
  <Lottie animationData={dotLoader} loop={true} autoplay={true} style={{ height: 30, width: 30 }} />
);

export const LottieLarge = () => (
  <Lottie
    animationData={poolsLoader}
    loop={true}
    autoplay={true}
    style={{ height: 90, width: 90, position: "absolute" }}
  />
);

export const lottieOptionsSmall = {
  loop: true,
  autoplay: true,
  animationData: dotLoader,
  width: 20,
  height: 20,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export const lottieOptionsMedium = {
  loop: true,
  autoplay: true,
  animationData: dotLoader,
  width: 30,
  height: 30,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export const lottieOptionsLarge = {
  loop: true,
  autoplay: true,
  animationData: poolsLoader,
  width: 90,
  height: 90,
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
