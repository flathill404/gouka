import type { Status, Tribute, UpdateTributeDTO } from "./tributes.schema";

export class TributeRepository {
	private tributes: Tribute[] = [];

	findAll(status?: Status): Tribute[] {
		if (status) {
			return this.tributes.filter((t) => t.status === status);
		}
		return this.tributes;
	}

	findById(id: string): Tribute | undefined {
		return this.tributes.find((t) => t.id === id);
	}

	create(tribute: Tribute): Tribute {
		this.tributes.push(tribute);
		return tribute;
	}

	update(id: string, data: UpdateTributeDTO): Tribute | undefined {
		const index = this.tributes.findIndex((t) => t.id === id);
		if (index === -1) return undefined;

		const current = this.tributes[index];
		const updated = {
			...current,
			...data,
		};

		this.tributes[index] = updated;
		return updated;
	}

	delete(id: string): boolean {
		const initialLength = this.tributes.length;
		this.tributes = this.tributes.filter((t) => t.id !== id);
		return this.tributes.length !== initialLength;
	}
}
