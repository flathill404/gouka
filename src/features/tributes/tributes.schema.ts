import { z } from "zod";

export const CategorySchema = z.enum(["MEAT", "VEGETABLE", "SWEETS", "OTHER"]);
export type Category = z.infer<typeof CategorySchema>;

export const StatusSchema = z.enum(["PENDING", "ACCEPTED", "TRASHED"]);
export type Status = z.infer<typeof StatusSchema>;

export const TributeSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1),
	giver: z.string().min(1),
	category: CategorySchema,
	status: StatusSchema,
	receivedAt: z.string().datetime(),
});

export type Tribute = z.infer<typeof TributeSchema>;

export const CreateTributeSchema = z.object({
	name: z.string().min(1, "Name is required"),
	giver: z.string().min(1, "Giver is required"),
	category: CategorySchema,
});

export type CreateTributeDTO = z.infer<typeof CreateTributeSchema>;

export const UpdateTributeSchema = z.object({
	name: z.string().min(1).optional(),
	giver: z.string().min(1).optional(),
	category: CategorySchema.optional(),
	status: StatusSchema.optional(),
});

export type UpdateTributeDTO = z.infer<typeof UpdateTributeSchema>;
