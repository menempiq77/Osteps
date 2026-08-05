import { afterEach, describe, expect, it, vi } from "vitest";
import { checkRateLimit, getRateLimit } from "./rateLimit";

describe("rate limiter", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  it("isolates keys and blocks after the configured limit", () => {
    expect(checkRateLimit("test-a", 2).allowed).toBe(true);
    expect(checkRateLimit("test-a", 2).allowed).toBe(true);
    expect(checkRateLimit("test-a", 2).allowed).toBe(false);
    expect(checkRateLimit("test-b", 2).allowed).toBe(true);
  });

  it("allows requests again after the window expires", () => {
    vi.useFakeTimers();
    expect(checkRateLimit("test-expiry", 1, 1000).allowed).toBe(true);
    expect(checkRateLimit("test-expiry", 1, 1000).allowed).toBe(false);
    vi.advanceTimersByTime(1001);
    expect(checkRateLimit("test-expiry", 1, 1000).allowed).toBe(true);
  });

  it("reads positive environment overrides", () => {
    vi.stubEnv("RATE_LIMIT_TEST", "7");
    expect(getRateLimit("RATE_LIMIT_TEST", 20)).toBe(7);
    vi.stubEnv("RATE_LIMIT_TEST", "invalid");
    expect(getRateLimit("RATE_LIMIT_TEST", 20)).toBe(20);
  });
});
