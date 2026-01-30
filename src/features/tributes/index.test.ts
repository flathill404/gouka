import { describe, expect, it } from "bun:test";
import app from "./index";

describe("Tributes Feature", () => {
	it("GET /tributes matches snapshot", async () => {
		const res = await app.request("/");
		expect(res.status).toBe(200);
		expect(await res.json()).toEqual([]);
	});

	it("POST /tributes (MEAT) creates PENDING tribute", async () => {
		const res = await app.request("/", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name: "Wagyu",
				giver: "Hunter",
				category: "MEAT",
			}),
		});
		expect(res.status).toBe(201);
		const data = await res.json();
		expect(data).toMatchObject({
			name: "Wagyu",
			giver: "Hunter",
			category: "MEAT",
			status: "PENDING",
		});
		expect(data.id).toBeDefined();
	});

	it("POST /tributes (VEGETABLE) creates TRASHED tribute", async () => {
		const res = await app.request("/", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name: "Carrot",
				giver: "Farmer",
				category: "VEGETABLE",
			}),
		});
		expect(res.status).toBe(201);
		const data = await res.json();
		expect(data).toMatchObject({
			status: "TRASHED",
		});
	});

	it("GET /tributes with query param", async () => {
		// PENDING (Meat) and TRASHED (Veg) exist from previous tests
		// Note: The repository is instantiated inside the module scope of `index.ts`,
		// so it persists across tests in the same process unless reset.
		// For this prototype, we rely on that or we can mock/reset if we were rigorous.
		// Let's assume persistence for now as we imported `app`.

		const res = await app.request("/?status=TRASHED");
		expect(res.status).toBe(200);
		const list = await res.json();
		expect(list).toHaveLength(1);
		expect(list[0].category).toBe("VEGETABLE");
	});
});
