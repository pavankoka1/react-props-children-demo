import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt =
  "React Props vs Children — Re-renders, React.memo & stable props";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const title = "React Props vs Children";
  const tagline =
    "Re-renders, React.memo & stable props — interactive guide";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0f",
          backgroundImage:
            "radial-gradient(ellipse 80% 55% at 50% 0%, #2a1f4a 0%, transparent 55%)",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 48,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: "#c4b5fd",
              lineHeight: 1.12,
              marginBottom: 18,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 26,
              color: "rgba(226, 232, 240, 0.92)",
              maxWidth: 920,
              lineHeight: 1.35,
            }}
          >
            {tagline}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
