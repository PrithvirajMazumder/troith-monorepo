export const animateBasicMotionOpacity = (animateOpacity = 1) => {
  return {
    initial: {
      opacity: 0
    },
    exit: {
      opacity: 0
    },
    animate: {
      opacity: animateOpacity
    }
  }
}
