import { ImageResponse } from "next/og";
import { createElement } from "react";

type IconOptions = {
  size: number;
};

const COLORS = {
  tileTop: "#FAFBFD",
  tileBottom: "#F1F5F9",
  border: "#D9E2EC",
  navy: "#24364D",
  green: "#0FA573",
  blue: "#317FF5",
  orange: "#F08A2D",
};

export function createBrandedIconResponse({ size }: IconOptions) {
  const scale = size / 512;

  const tileSize = Math.round(420 * scale);
  const tileRadius = Math.round(118 * scale);
  const borderWidth = Math.max(1, Math.round(3 * scale));

  const tileLeft = Math.round((size - tileSize) / 2);
  const tileTop = Math.round((size - tileSize) / 2);

  // bigger "E"
  const stemLeft = tileLeft + Math.round(118 * scale);
  const stemTop = tileTop + Math.round(96 * scale);
  const stemWidth = Math.round(50 * scale);
  const stemHeight = Math.round(236 * scale);
  const stemRadius = Math.round(25 * scale);

  // horizontal bars start exactly under the stem so the left rounded ends stay hidden
  const barLeft = stemLeft;
  const topBarTop = tileTop + Math.round(96 * scale);
  const middleBarTop = tileTop + Math.round(182 * scale);
  const bottomBarTop = tileTop + Math.round(268 * scale);

  const topBarWidth = Math.round(206 * scale);
  const middleBarWidth = Math.round(154 * scale);
  const bottomBarWidth = Math.round(206 * scale);

  const barHeight = Math.round(58 * scale);
  const barRadius = Math.round(29 * scale);

  return new ImageResponse(
    createElement(
      "div",
      {
        style: {
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          overflow: "hidden",
        },
      },

      createElement("div", {
        style: {
          position: "absolute",
          left: tileLeft,
          top: tileTop,
          width: tileSize,
          height: tileSize,
          borderRadius: tileRadius,
          background: `linear-gradient(180deg, ${COLORS.tileTop} 0%, ${COLORS.tileBottom} 100%)`,
          border: `${borderWidth}px solid ${COLORS.border}`,
          boxShadow: "0 18px 44px rgba(36,54,77,0.14)",
        },
      }),

      createElement("div", {
        style: {
          position: "absolute",
          left: tileLeft + Math.round(34 * scale),
          top: tileTop + Math.round(26 * scale),
          width: Math.round(120 * scale),
          height: Math.round(64 * scale),
          borderRadius: Math.round(999 * scale),
          background: "rgba(255,255,255,0.65)",
          filter: "blur(2px)",
        },
      }),

      // bars first
      createElement("div", {
        style: {
          position: "absolute",
          left: barLeft,
          top: topBarTop,
          width: topBarWidth,
          height: barHeight,
          borderRadius: barRadius,
          background: COLORS.green,
          boxShadow: "0 10px 22px rgba(15,165,115,0.16)",
        },
      }),

      createElement("div", {
        style: {
          position: "absolute",
          left: barLeft,
          top: middleBarTop,
          width: middleBarWidth,
          height: barHeight,
          borderRadius: barRadius,
          background: COLORS.blue,
          boxShadow: "0 10px 22px rgba(49,127,245,0.16)",
        },
      }),

      createElement("div", {
        style: {
          position: "absolute",
          left: barLeft,
          top: bottomBarTop,
          width: bottomBarWidth,
          height: barHeight,
          borderRadius: barRadius,
          background: COLORS.orange,
          boxShadow: "0 10px 22px rgba(240,138,45,0.16)",
        },
      }),

      // thinner stem on top
      createElement("div", {
        style: {
          position: "absolute",
          left: stemLeft,
          top: stemTop,
          width: stemWidth,
          height: stemHeight,
          borderRadius: stemRadius,
          background: COLORS.navy,
          boxShadow: "0 8px 18px rgba(36,54,77,0.10)",
        },
      }),
    ),
    {
      width: size,
      height: size,
    },
  );
}
