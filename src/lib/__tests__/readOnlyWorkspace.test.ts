import { beforeEach, describe, expect, it, vi } from "vitest";

describe("read-only workspace activation", () => {
  beforeEach(() => {
    vi.resetModules();
    window.name = "";
  });

  it("does not activate for missing or invalid query parameters", async () => {
    const workspace = await import("@/lib/readOnlyWorkspace");
    expect(workspace.readOnlyFromSearchParams(new URLSearchParams())).toBe(false);
    expect(
      workspace.readOnlyFromSearchParams(new URLSearchParams("readonly=0"))
    ).toBe(false);
  });

  it("latches activation from readonly=1 in module state and window.name", async () => {
    const workspace = await import("@/lib/readOnlyWorkspace");
    expect(
      workspace.readOnlyFromSearchParams(new URLSearchParams("readonly=1"))
    ).toBe(true);
    expect(workspace.isReadOnlyWorkspace()).toBe(true);
    expect(window.name).toBe(workspace.READONLY_WINDOW_NAME);
  });
});
