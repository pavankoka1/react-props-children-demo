import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** App icon — brand “K” on gradient (matches nav / NextButton). */
export default function Icon() {
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
          borderRadius: 9,
        }}
      >
        <span
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "white",
            fontFamily:
              'ui-sans-serif, system-ui, "Segoe UI", Roboto, sans-serif',
            letterSpacing: "-0.05em",
          }}
        >
          K
        </span>
      </div>
    ),
    { ...size }
  );
}
