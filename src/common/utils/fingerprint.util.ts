import crypto from "crypto";

export function normalizeFingerprint(
  signals: {
    androidId?: string;
    model?: string;
    sdkVersion?: number;
    manufacturer?: string;
    brand?: string;
  }
): string {
  const parts = [
    signals.brand || "",
    signals.model || "",
    signals.sdkVersion?.toString() || "",
    signals.androidId || "",
  ]
    .filter((p) => p && p.trim())
    .map((p) => p.trim())
    .join("|");

  return crypto.createHash("sha256").update(parts).digest("hex");
}