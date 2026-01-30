import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { v7 as uuidv7 } from "uuid";
import { z } from "zod";
import { TributeRepository } from "./tributes.repository";
import {
	CreateTributeSchema,
	StatusSchema,
	UpdateTributeSchema,
} from "./tributes.schema";

const app = new Hono();
const repository = new TributeRepository();

// GET /tributes
app.get(
	"/",
	zValidator("query", z.object({ status: StatusSchema.optional() })),
	(c) => {
		const { status } = c.req.valid("query");
		const tributes = repository.findAll(status);
		return c.json(tributes);
	},
);

// GET /tributes/:id
app.get("/:id", (c) => {
	const id = c.req.param("id");
	const tribute = repository.findById(id);
	if (!tribute) {
		return c.json({ error: "Not Found" }, 404);
	}
	return c.json(tribute);
});

// POST /tributes
app.post("/", zValidator("json", CreateTributeSchema), (c) => {
	const data = c.req.valid("json");

	// Business Logic: VEGETABLE -> TRASHED, else PENDING
	let status: "PENDING" | "ACCEPTED" | "TRASHED" = "PENDING";
	if (data.category === "VEGETABLE") {
		status = "TRASHED";
	}

	const tribute = repository.create({
		id: uuidv7(),
		...data,
		status,
		receivedAt: new Date().toISOString(),
	});

	return c.json(tribute, 201);
});

// PUT /tributes/:id
app.put("/:id", zValidator("json", UpdateTributeSchema), (c) => {
	const id = c.req.param("id");
	const data = c.req.valid("json");
	const updated = repository.update(id, data);

	if (!updated) {
		return c.json({ error: "Not Found" }, 404);
	}
	return c.json(updated);
});

// DELETE /tributes/:id
app.delete("/:id", (c) => {
	const id = c.req.param("id");
	const deleted = repository.delete(id);
	if (!deleted) {
		return c.json({ error: "Not Found" }, 404);
	}
	// Return different content based on what client expects, usually 200 or 204
	return c.json({ message: "Deleted" });
});

export default app;
