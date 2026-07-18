const API_BASE = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export class ApiError extends Error {
	constructor(
		public status: number,
		message: string,
	) {
		super(message);
		this.name = "ApiError";
	}
}

function getAuthToken(): string | null {
	if (typeof document === "undefined") return null;
	const match = document.cookie.match(/jwt_token=([^;]+)/);
	return match ? match[1] : null;
}

async function apiClient<T>(
	endpoint: string,
	options?: RequestInit,
): Promise<T> {
	const token = getAuthToken();
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		...(token ? { Authorization: `Bearer ${token}` } : {}),
		...(options?.headers as Record<string, string>),
	};

	const res = await fetch(`${API_BASE}${endpoint}`, {
		...options,
		headers,
	});

	if (!res.ok) {
		let message = `HTTP ${res.status}`;
		try {
			const body = await res.json();
			message = body?.error?.message || body?.message || message;
		} catch {
			try {
				message = await res.text();
			} catch {
				// keep default
			}
		}
		throw new ApiError(res.status, message);
	}

	const text = await res.text();
	if (!text) return undefined as T;
	return JSON.parse(text);
}

export const api = {
	get: <T>(url: string) => apiClient<T>(url),
	post: <T>(url: string, data: unknown) =>
		apiClient<T>(url, { method: "POST", body: JSON.stringify(data) }),
	put: <T>(url: string, data: unknown) =>
		apiClient<T>(url, { method: "PUT", body: JSON.stringify(data) }),
	delete: <T>(url: string) => apiClient<T>(url, { method: "DELETE" }),
};

export async function uploadFile<T>(url: string, formData: FormData): Promise<T> {
	const token = getAuthToken();
	const res = await fetch(`${API_BASE}${url}`, {
		method: "POST",
		headers: {
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		},
		body: formData,
	});

	if (!res.ok) {
		const text = await res.text();
		throw new ApiError(res.status, text);
	}

	return res.json() as Promise<T>;
}

export { API_BASE, getAuthToken };
