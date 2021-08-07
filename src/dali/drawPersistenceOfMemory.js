import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../drawClock";
import { persistenceOfMemoryBase64 } from "./constants";
import {
  CLOCK_1_ANGLE_MAP,
  CLOCK_1_CENTER,
  CLOCK_1_RADIUS_MAP,
  CLOCK_2_ANGLE_MAP,
  CLOCK_2_CENTER,
  CLOCK_2_RADIUS_MAP,
  CLOCK_3_ANGLE_MAP,
  CLOCK_3_CENTER,
  CLOCK_3_RADIUS_MAP
} from "./clockDetails";

const img = new Image();
img.src = persistenceOfMemoryBase64;

const LINE_WIDTHS = {
  small: 1,
  medium: 2,
  large: 3
};
const COLORS = {
  grey: "#22262C",
  brownish: "#3e3C2D"
};

const mapFrom60 = (in60, map, isAngle) => {
  const in12 = (in60 / 60) * 12;
  const lower = Math.floor(in12);
  let upper = Math.ceil(in12);
  const ratio = in12 % 1;
  if (isAngle && map[upper] < map[lower]) {
    // special case b/c we restart at 0 degrees between 3 and 4
    return map[lower] * (1 - ratio) + (map[4] + 360) * ratio;
  }
  return map[lower] * (1 - ratio) + map[upper] * ratio;
};

const isHandVisible = (in60, map) => {
  const in12 = (in60 / 60) * 12;
  const lower = Math.floor(in12);
  let upper = Math.ceil(in12);
  return map[lower] !== null && map[upper] !== null;
};

const drawDaliClock =
  (clockCenter, angleMap, radiusMap, hideCenter) =>
  (ctx, { sec, min, hr }) => {
    ctx.save();
    ctx.translate(clockCenter.x, clockCenter.y);

    ctx.strokeStyle = COLORS.grey;
    ctx.fillStyle = COLORS.grey;

    // Create Hour hand
    const hoursIn60 = (hr + min / 60 + sec / (60 * 60)) * 5;
    if (isHandVisible(hoursIn60, angleMap)) {
      ctx.save();
      ctx.rotate((mapFrom60(hoursIn60, angleMap, true) * Math.PI) / 180);
      ctx.beginPath();
      ctx.lineWidth = LINE_WIDTHS.medium;
      ctx.moveTo(0, 0);
      const hourHandLength = mapFrom60(hoursIn60, radiusMap, false) * 0.8;
      ctx.lineTo(hourHandLength, 0);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(hourHandLength, 0);
      ctx.lineTo(hourHandLength - hourHandLength * 0.2, 2.5);
      ctx.lineTo(hourHandLength - hourHandLength * 0.4, 0);
      ctx.lineTo(hourHandLength - hourHandLength * 0.2, -2.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // Create Minute Hand
    const minutes = min + sec / 60;
    if (isHandVisible(minutes, angleMap)) {
      ctx.save();
      ctx.rotate((mapFrom60(minutes, angleMap, true) * Math.PI) / 180);
      ctx.beginPath();
      ctx.lineWidth = LINE_WIDTHS.medium;
      ctx.moveTo(0, 0);

      const minLength = mapFrom60(minutes, radiusMap, false) * 0.7;
      ctx.lineTo(minLength, 0);
      ctx.stroke();

      ctx.moveTo(minLength, 0);
      ctx.lineTo(minLength - minLength * 0.2, 2.5);
      ctx.lineTo(minLength - minLength * 0.4, 0);
      ctx.lineTo(minLength - minLength * 0.2, -2.5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Create Second Hand
    if (isHandVisible(sec, angleMap)) {
      ctx.save();
      ctx.rotate((mapFrom60(sec, angleMap, true) * Math.PI) / 180);
      ctx.beginPath();
      ctx.lineWidth = LINE_WIDTHS.small;
      ctx.moveTo(0, 0);
      ctx.lineTo(mapFrom60(sec, radiusMap, false) * 0.7, 0);
      ctx.stroke();
      ctx.restore();
    }

    // Create center circle
    if (!hideCenter) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.fillStyle = COLORS.brownish;
      ctx.arc(0, 0, 2, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  };

const clock1Drawer = drawDaliClock(
  CLOCK_1_CENTER,
  CLOCK_1_ANGLE_MAP,
  CLOCK_1_RADIUS_MAP,
  false
);

const clock2Drawer = drawDaliClock(
  CLOCK_2_CENTER,
  CLOCK_2_ANGLE_MAP,
  CLOCK_2_RADIUS_MAP,
  false
);

const clock3Drawer = drawDaliClock(
  CLOCK_3_CENTER,
  CLOCK_3_ANGLE_MAP,
  CLOCK_3_RADIUS_MAP,
  true
);

export const drawDali = (ctx, time) => {
  ctx.save();
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  clock1Drawer(ctx, time);
  clock2Drawer(ctx, time);
  clock3Drawer(ctx, time);

  ctx.restore();
};
