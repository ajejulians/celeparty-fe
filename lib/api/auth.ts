import { api } from "./client";
import type { AuthResponse, StrapiUser } from "@/types/strapi";

interface RegisterPayload {
	username: string;
	email: string;
	password: string;
	role?: string;
	phone?: string;
	address?: string;
	name?: string;
	companyName?: string;
}

export async function login(
	identifier: string,
	password: string,
): Promise<AuthResponse> {
	return api.post<AuthResponse>("/api/auth/local", {
		identifier,
		password,
	});
}

export async function register(data: RegisterPayload): Promise<AuthResponse> {
	return api.post<AuthResponse>("/api/auth/custom-register", data);
}

export async function getMe(): Promise<StrapiUser> {
	return api.get<StrapiUser>("/api/users/me");
}

export async function updateUser(
	documentId: string,
	data: Partial<StrapiUser>,
): Promise<StrapiUser> {
	return api.put<StrapiUser>(`/api/users/${documentId}`, data);
}
