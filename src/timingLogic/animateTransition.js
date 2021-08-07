import { drawClock } from "../drawClock";
import { secsToTime } from "./useStopwatch";

const ANIMATION_SECS = 2;

export const animateTransition = (t1, t2, isClockRunning, done) => {
  if (!t1 || !t2) throw new Error("t1 and t2 must be set");

  const t1Secs = t1.sec + t1.min * 60 + t1.hr * 60 * 60;

  const accountForAnimationTime = isClockRunning ? ANIMATION_SECS : 0;
  const t2Secs =
    t2.sec + t2.min * 60 + t2.hr * 60 * 60 + accountForAnimationTime;
  const diff = Math.abs(t1Secs - t2Secs);

  let animationStart = performance.now();

  return ctx => {
    const timestamp = performance.now();

    const elapsed = timestamp - animationStart;
    const progress = elapsed / (ANIMATION_SECS * 1000);
    const progressInSecs = Math.floor(progress * diff);

    const currPositionInSecs =
      t1Secs > t2Secs ? t1Secs - progressInSecs : t1Secs + progressInSecs;
    const timeToDisplay = secsToTime(currPositionInSecs);
    console.log(timeToDisplay);

    if (elapsed < ANIMATION_SECS * 1000) {
      drawClock(ctx, timeToDisplay);
    } else {
      // Since the animation frames aren't 100% precise, make sure we end the animation on correct time to avoid a slight jerk in UI
      drawClock(ctx, secsToTime(t2Secs));
      done();
    }
  };
};
