export default function BackgroundMasks() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <clipPath id="orange-shape" clipPathUnits="objectBoundingBox">
          <path d="M 0.1,0 L 1,0 L 1,0.65 Q 0.95,0.82 0.7,0.6 L 0.1,0 Z" />
        </clipPath>

        <clipPath id="blue-shape" clipPathUnits="objectBoundingBox">
          <path d="M 0,0.5 C 0,0.4 0.1,0.35 0.2,0.3 L 1,0 L 1,1 L 0,1 Z" />
        </clipPath>
      </defs>
    </svg>
  );
}
