import { describe, it, expect } from "vitest";

describe("Dataverse Integration", () => {
    it("should fetch initiatives", async () => {
        const response = await fetch("/api/data/v9.1/systemusers");
        const data = await response.json();
        expect(data.value).toBeInstanceOf(Array);

        expect(response.status).toBe(200);
    });
});
