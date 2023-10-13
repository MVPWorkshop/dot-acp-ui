import dotLoader from "./dot-loader.json";

export const lottieOptions = {
  loop: true,
  autoplay: true,
  animationData: dotLoader,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
