export default function BackgroundMasks() {
  return (
    <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
      <defs>
        <clipPath id="orange-rounded" clipPathUnits="objectBoundingBox">
          <path
            d="M 0.1, 0
                L 1, 0
                L 1, 0.75
                Q 0.95, 0.95 0.7, 0.7
                L 0.1, 0
                Z"
          />
        </clipPath>

        <clipPath id="blue-trapezoid" clipPathUnits="objectBoundingBox">
          <path
            d="M 0.15, 0.1
                Q 0, 0.15 0, 0.3
                L 0, 1
                L 1, 1
                L 1, 0
                Z"
          />
        </clipPath>

        <clipPath id="image-cutout" clipPathUnits="objectBoundingBox">
          <path
            d="M 0.7558,0.7724
               Q 0.759,0.9277 0.6229,0.8528
               L 0.1363,0.5853
               Q 0.0001,0.5105 0.133,0.43
               L 0.608,0.1423
               Q 0.7409,0.0618 0.7441,0.2172
               Z"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
