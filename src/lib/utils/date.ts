/**
 * Safely converts any timestamp value into a valid ISO 8601 string.
 *
 * Handles:
 *  - JavaScript Date instances
 *  - ISO 8601 strings      ("2026-07-19T12:34:56.000Z")
 *  - PostgreSQL timestamps  ("2026-07-19 12:34:56.789+00")
 *  - Unix timestamps        (numbers, in milliseconds or seconds)
 *  - null / undefined
 *
 * Returns the current time as a fallback when the value is absent or
 * unparseable, so the app never crashes due to a bad timestamp.
 */
export function toISOStringSafe(value: unknown): string {
  if (value == null) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[toISOStringSafe] Received null/undefined timestamp – falling back to now()");
    }
    return new Date().toISOString();
  }

  // Already a Date
  if (value instanceof Date) {
    if (isNaN(value.getTime())) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[toISOStringSafe] Received invalid Date object:", value);
      }
      return new Date().toISOString();
    }
    return value.toISOString();
  }

  // Numeric unix timestamp (ms if > 1e10, otherwise treat as seconds)
  if (typeof value === "number") {
    const ms = value > 1e10 ? value : value * 1000;
    const d = new Date(ms);
    if (isNaN(d.getTime())) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[toISOStringSafe] Received invalid numeric timestamp:", value);
      }
      return new Date().toISOString();
    }
    return d.toISOString();
  }

  if (typeof value === "string") {
    // Fast-path: already a valid ISO string
    const d = new Date(value);
    if (!isNaN(d.getTime())) {
      return d.toISOString();
    }

    // PostgreSQL format: "2026-07-19 12:34:56.789+00"
    // Replace the space separator with 'T' so the Date constructor accepts it
    const normalized = value.replace(" ", "T");
    const d2 = new Date(normalized);
    if (!isNaN(d2.getTime())) {
      return d2.toISOString();
    }

    if (process.env.NODE_ENV === "development") {
      console.warn("[toISOStringSafe] Could not parse timestamp string:", value);
    }
    return new Date().toISOString();
  }

  if (process.env.NODE_ENV === "development") {
    console.warn("[toISOStringSafe] Unexpected timestamp type:", typeof value, value);
  }
  return new Date().toISOString();
}

/**
 * Formats an ISO string for display (HH:MM).
 * Accepts any value that `toISOStringSafe` can handle.
 */
export function formatTime(value: unknown): string {
  const iso = toISOStringSafe(value);
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Formats an ISO string as a short date for conversation list previews.
 */
export function formatShortDate(value: unknown): string {
  const iso = toISOStringSafe(value);
  return new Date(iso).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}
