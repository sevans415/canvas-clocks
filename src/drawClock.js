export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 800;

const DEGREES = {
  hr: (30 * Math.PI) / 180,
  min: (6 * Math.PI) / 180
};

const RADIUS = 125;
const LINE_WIDTHS = {
  small: 0.01 * RADIUS,
  medium: 0.04 * RADIUS,
  large: 0.06 * RADIUS
};
const COLORS = {
  black: "#222222",
  grey: "#767676",
  burnt_orange: "#cc5a2a"
};

export const drawClock = (ctx, { sec, min, hr }) => {
  ctx.save();
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.translate(CANVAS_WIDTH / 2, 2.5 * RADIUS);

  // Create outer edge of clock and inside fill
  ctx.beginPath();
  ctx.lineWidth = LINE_WIDTHS.medium;
  ctx.strokeStyle = COLORS.grey;
  ctx.fillStyle = COLORS.black;
  ctx.arc(0, 0, RADIUS * 2, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.fill();

  ctx.rotate((270 * Math.PI) / 180);
  ctx.lineWidth = LINE_WIDTHS.small;

  // Create hour marks
  ctx.save();
  [...Array(12)].forEach(_ => {
    ctx.rotate(DEGREES.hr);
    ctx.beginPath();
    ctx.moveTo(1.9 * RADIUS, 0);
    ctx.lineTo(1.5 * RADIUS, 0);
    ctx.stroke();
  });
  ctx.restore();

  // Create minute marks
  ctx.save();
  ctx.lineWidth = LINE_WIDTHS.small;
  [...Array(60)].forEach((_, i) => {
    ctx.beginPath();
    ctx.moveTo(1.9 * RADIUS, 0);
    ctx.lineTo(1.8 * RADIUS, 0);
    ctx.stroke();
    ctx.rotate(DEGREES.min);
  });
  ctx.restore();

  ctx.strokeStyle = COLORS.burnt_orange;

  // Create Hour hand
  ctx.save();
  ctx.rotate(
    hr * DEGREES.hr + (DEGREES.min / 12) * min + (Math.PI / 21600) * sec
  );

  ctx.beginPath();
  ctx.lineWidth = LINE_WIDTHS.medium;
  ctx.moveTo(-0.3 * RADIUS, 0);
  ctx.lineTo(1.5 * RADIUS, 0);
  ctx.stroke();
  ctx.restore();

  // Create Minute hand
  ctx.save();
  ctx.rotate(DEGREES.min * min + (Math.PI / 1800) * sec);
  ctx.lineWidth = LINE_WIDTHS.medium;
  ctx.beginPath();
  ctx.moveTo(-0.3 * RADIUS, 0);
  ctx.lineTo(-0.175 * RADIUS, 0);
  ctx.stroke();
  ctx.lineWidth = LINE_WIDTHS.small;
  ctx.moveTo(-0.175 * RADIUS, 0);
  ctx.lineTo(1.4 * RADIUS, 0);
  ctx.stroke();
  ctx.fillStyle = COLORS.black;
  ctx.lineWidth = LINE_WIDTHS.large;
  ctx.beginPath();
  ctx.arc(0, 0, 0.05 * RADIUS, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Create Second hand
  ctx.save();
  ctx.rotate((sec * Math.PI) / 30);
  ctx.beginPath();
  ctx.lineWidth = LINE_WIDTHS.large;
  ctx.arc(1.85 * RADIUS, 0, 0.05 * RADIUS, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.fill();
  ctx.restore();

  ctx.restore();
};
