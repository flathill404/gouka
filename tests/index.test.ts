import { describe, expect, it } from "bun:test";
import app from "../src/index";

describe("Basic Routes", () => {
	it("GET / should return 200 and Hello Hono!", async () => {
		const res = await app.request("/");

		expect(res.status).toBe(200);

		const body = await res.text();
		expect(body).toBe("Hello Hono!");
	});
});
