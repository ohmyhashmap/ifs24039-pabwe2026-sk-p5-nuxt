import { describe, it, expect } from "vitest";
import { useInput } from "./useInput";

describe("useInput", () => {
  it("memakai nilai awal bawaan dan nilai yang diberikan", () => {
    expect(useInput()[0].value).toBe("");
    expect(useInput("a")[0].value).toBe("a");
  });
  it("memperbarui nilai dari event input", () => {
    const [value, onChange] = useInput();
    (onChange as any)({ target: { value: "halo" } });
    expect(value.value).toBe("halo");
  });
});
