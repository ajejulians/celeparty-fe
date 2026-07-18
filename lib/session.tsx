"use client";

import { useRouter } from "next/navigation";
import {
	type ComponentType,
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { login as apiLogin, register as apiRegister, getMe } from "@/lib/api/auth";
import type { StrapiUser } from "@/types/strapi";

export interface SessionUser {
	role: "admin" | "vendor" | "customer";
	documentId: string;
	vendorId: string;
	vendorName: string;
	storeInitials: string;
	email: string;
	name: string;
	isAuthenticated: boolean;
}

interface SessionContextType extends SessionUser {
	loaded: boolean;
	logout: () => void;
	login: (identifier: string, password: string) => Promise<{ role: string; redirect: string }>;
	register: (data: {
		username: string;
		email: string;
		password: string;
		role?: string;
		phone?: string;
	}) => Promise<void>;
	refresh: () => Promise<void>;
}

const DEFAULT_SESSION: SessionUser = {
	role: "customer",
	documentId: "",
	vendorId: "",
	vendorName: "",
	storeInitials: "",
	email: "",
	name: "",
	isAuthenticated: false,
};

const ROLE_REDIRECTS: Record<string, string> = {
	admin: "/user/admin/dashboard",
	vendor: "/user/vendor/dashboard",
	customer: "/products",
};

function getInitials(name: string): string {
	if (!name) return "";
	return name
		.split(" ")
		.map((w) => w[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

function mapStrapiRole(roleType: string): "admin" | "vendor" | "customer" {
	if (roleType === "admin") return "admin";
	if (roleType === "vendor" || roleType === "authenticated") return "vendor";
	return "customer";
}

function userToSession(user: StrapiUser): SessionUser {
	const role = mapStrapiRole(user.role?.type || "public");
	const displayName = user.name || user.companyName || user.username;
	return {
		role,
		documentId: user.documentId,
		vendorId: user.documentId,
		vendorName: displayName,
		storeInitials: getInitials(displayName),
		email: user.email,
		name: displayName,
		isAuthenticated: true,
	};
}

const SessionContext = createContext<SessionContextType>({
	...DEFAULT_SESSION,
	loaded: false,
	logout: () => {},
	login: async () => ({ role: "customer", redirect: "/products" }),
	register: async () => {},
	refresh: async () => {},
});

function setCookie(name: string, value: string, maxAge: number) {
	document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`;
}

function deleteCookie(name: string) {
	document.cookie = `${name}=; path=/; max-age=0`;
}

export function SessionProvider({ children }: { children: ReactNode }) {
	const [session, setSession] = useState<SessionUser>(DEFAULT_SESSION);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		async function init() {
			const token = document.cookie.match(/jwt_token=([^;]+)/)?.[1];
			if (!token) {
				setLoaded(true);
				return;
			}

			try {
				const user = await getMe();
				setSession(userToSession(user));
			} catch {
				deleteCookie("jwt_token");
				deleteCookie("simulate_role");
				deleteCookie("vendor_id");
				deleteCookie("is_authenticated");
			}
			setLoaded(true);
		}
		init();
	}, []);

	const login = async (identifier: string, password: string) => {
		const res = await apiLogin(identifier, password);
		const user = res.user;
		const sessionData = userToSession(user);

		setCookie("jwt_token", res.jwt, 7 * 86400);
		setCookie("is_authenticated", "true", 7 * 86400);
		setCookie("simulate_role", sessionData.role, 7 * 86400);

		if (sessionData.role === "vendor") {
			setCookie("vendor_id", sessionData.vendorId, 7 * 86400);
		}

		setSession(sessionData);

		const redirect = ROLE_REDIRECTS[sessionData.role] || "/products";
		return { role: sessionData.role, redirect };
	};

	const register = async (data: {
		username: string;
		email: string;
		password: string;
		role?: string;
		phone?: string;
	}) => {
		await apiRegister({
			username: data.username,
			email: data.email,
			password: data.password,
			role: data.role || "customer",
			phone: data.phone,
		});
	};

	const refresh = async () => {
		try {
			const user = await getMe();
			setSession(userToSession(user));
		} catch {
			setSession(DEFAULT_SESSION);
		}
	};

	const logout = () => {
		deleteCookie("jwt_token");
		deleteCookie("is_authenticated");
		deleteCookie("simulate_role");
		deleteCookie("vendor_id");
		localStorage.removeItem("is_authenticated");
		localStorage.removeItem("session_role");
		localStorage.removeItem("vendor_id");
		setSession(DEFAULT_SESSION);
	};

	return (
		<SessionContext.Provider
			value={{ ...session, loaded, logout, login, register, refresh }}
		>
			{children}
		</SessionContext.Provider>
	);
}

export function useSession() {
	return useContext(SessionContext);
}

export function withAuth<P extends Record<string, unknown>>(
	Component: ComponentType<P>,
	requiredRole?: "admin" | "vendor" | "customer",
) {
	function AuthenticatedComponent(props: P) {
		const session = useSession();
		const router = useRouter();

		if (!session.loaded) return null;

		if (!session.isAuthenticated) {
			router.replace("/auth/login");
			return null;
		}

		if (requiredRole && session.role !== requiredRole) {
			router.replace("/auth/login");
			return null;
		}

		return <Component {...props} />;
	}

	AuthenticatedComponent.displayName = `withAuth(${Component.displayName ?? Component.name})`;
	return AuthenticatedComponent;
}
