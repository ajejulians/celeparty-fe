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

function getMockUser(identifier: string, roleInput?: string): StrapiUser {
	const emailLower = (identifier || "").toLowerCase();
	let role = roleInput || "customer";

	if (emailLower.includes("admin")) {
		role = "admin";
	} else if (emailLower.includes("vendor")) {
		role = "vendor";
	}

	const isVendor = role === "vendor";
	const isAdmin = role === "admin";

	return {
		id: isVendor ? 2 : isAdmin ? 1 : 3,
		documentId: isVendor ? "v-001" : isAdmin ? "adm-001" : "cust-001",
		username: identifier.split("@")[0] || (isVendor ? "vendor_pro" : "user_demo"),
		email: identifier,
		provider: "local",
		confirmed: true,
		blocked: false,
		role: {
			id: isAdmin ? 1 : isVendor ? 2 : 3,
			name: role.toUpperCase(),
			type: role,
		},
		name: isVendor
			? "Jakarta Audio Pro"
			: isAdmin
				? "Administrator Celeparty"
				: "Customer Demo",
		companyName: isVendor ? "Jakarta Audio Pro" : undefined,
		phone: "081234567890",
		address: isVendor ? "Jakarta Selatan, DKI Jakarta" : "Bandung, Jawa Barat",
		saldo_active: "15500000",
		saldo_refund: "0",
	};
}

export async function login(
	identifier: string,
	_password: string,
): Promise<AuthResponse> {
	const user = getMockUser(identifier);
	return {
		jwt: "mock-jwt-token-celeparty-12345",
		user,
	};
}

export async function register(data: RegisterPayload): Promise<AuthResponse> {
	const user = getMockUser(data.email, data.role);
	return {
		jwt: "mock-jwt-token-celeparty-12345",
		user,
	};
}

export async function getMe(): Promise<StrapiUser> {
	let role = "customer";
	let vendorId = "v-001";

	if (typeof document !== "undefined") {
		const matchRole = document.cookie.match(/simulate_role=([^;]+)/);
		if (matchRole) role = matchRole[1];
		const matchVendor = document.cookie.match(/vendor_id=([^;]+)/);
		if (matchVendor) vendorId = matchVendor[1];
	}

	const user = getMockUser(
		role === "vendor"
			? "vendor@celeparty.com"
			: role === "admin"
				? "admin@celeparty.com"
				: "customer@celeparty.com",
		role,
	);
	if (role === "vendor") {
		user.documentId = vendorId;
	}
	return user;
}

export async function updateUser(
	documentId: string,
	data: Partial<StrapiUser>,
): Promise<StrapiUser> {
	const current = await getMe();
	return {
		...current,
		...data,
		documentId,
	};
}

