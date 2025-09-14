class Axim {
	#url: string;
	#headers: {
		[key: string]: any
	};

	constructor(url: string, headers = {}) {
		this.#url = url;
		this.#headers = headers;
	}

	public async get() {
		return await fetch(this.#url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				...this.#headers
			},
		})
	}

	public async post(body: any) {
		return await fetch(this.#url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...this.#headers
			},
			body: JSON.stringify(body)
		})
	}
}

export function axim(url: string, headers = {}) {
	return new Axim(url, headers);
}
