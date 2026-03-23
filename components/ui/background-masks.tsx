export default function BackgroundMasks() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <clipPath id="orange-shape" clipPathUnits="objectBoundingBox">
          <path d="M 0.1, 0 L 1, 0 L 1, 0.75 Q 0.95, 0.95 0.7, 0.7 L 0.1, 0 Z" />
        </clipPath>

        <clipPath id="blue-shape" clipPathUnits="objectBoundingBox">
          <path d="M 0,0.5 C 0,0.4 0.1,0.35 0.2,0.3 L 1,0 L 1,1 L 0,1 Z" />
        </clipPath>

        <clipPath id="image-cutout" clipPathUnits="objectBoundingBox">
          <path
            d="M 0.15,0.45
                   C 0,0.55 0,0.7 0.15,0.8
                   L 0.75,0.98
                   C 0.9,1 1,0.9 1,0.75
                   L 0.9,0.1
                   C 0.85,0 0.7,0 0.6,0.1
                   Z"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
