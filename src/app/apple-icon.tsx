import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon — larger K for home-screen bookmarks. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: 36,
        }}
      >
        <span
          style={{
            fontSize: 112,
            fontWeight: 700,
            color: "white",
            fontFamily:
              'ui-sans-serif, system-ui, "Segoe UI", Roboto, sans-serif',
            letterSpacing: "-0.04em",
          }}
        >
          K
        </span>
      </div>
    ),
    { ...size }
  );
}
