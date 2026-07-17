type StatusKey =
	| "pending"
	| "pending_dp"
	| "settlement"
	| "failed"
	| "cancelled"
	| "expired"
	| "approved"
	| "rejected"
	| "dp_pending"
	| "dp_paid"
	| "fully_paid"
	| "dp_refunded"
	| "active"
	| "used"
	| "invalid"
	| "duplicate"
	| "refunded"
	| "sold_out"
	| "escrow_badge"
	| "inactive";

const STATUS_CONFIG: Record<StatusKey, { label: string; className: string }> = {
	pending: {
		label: "Menunggu Bayar",
		className: "bg-amber-50 text-amber-700 border-amber-200",
	},
	pending_dp: {
		label: "Menunggu DP",
		className: "bg-amber-50 text-amber-700 border-amber-200",
	},
	settlement: {
		label: "Lunas",
		className: "bg-emerald-50 text-emerald-700 border-emerald-200",
	},
	failed: {
		label: "Gagal",
		className: "bg-red-50 text-red-700 border-red-200",
	},
	cancelled: {
		label: "Dibatalkan",
		className: "bg-neutral-100 text-neutral-600 border-neutral-200",
	},
	expired: {
		label: "Kadaluarsa",
		className: "bg-neutral-100 text-neutral-500 border-neutral-200",
	},
	approved: {
		label: "Dikonfirmasi",
		className: "bg-blue-50 text-blue-700 border-blue-200",
	},
	rejected: {
		label: "Ditolak",
		className: "bg-red-50 text-red-700 border-red-200",
	},
	dp_pending: {
		label: "DP Belum Dibayar",
		className: "bg-amber-50 text-amber-700 border-amber-200",
	},
	dp_paid: {
		label: "DP Diterima",
		className: "bg-c-blue-50 text-c-blue border-c-blue-100",
	},
	fully_paid: {
		label: "Lunas Penuh",
		className: "bg-emerald-50 text-emerald-700 border-emerald-200",
	},
	dp_refunded: {
		label: "DP Direfund",
		className: "bg-orange-50 text-orange-700 border-orange-200",
	},
	active: {
		label: "Aktif",
		className: "bg-emerald-50 text-emerald-700 border-emerald-200",
	},
	used: {
		label: "Sudah Digunakan",
		className: "bg-neutral-100 text-neutral-600 border-neutral-200",
	},
	invalid: {
		label: "Tidak Valid",
		className: "bg-red-50 text-red-700 border-red-200",
	},
	duplicate: {
		label: "Duplikat",
		className: "bg-purple-50 text-purple-700 border-purple-200",
	},
	refunded: {
		label: "Direfund",
		className: "bg-orange-50 text-orange-700 border-orange-200",
	},
	sold_out: {
		label: "Habis",
		className: "bg-neutral-800 text-white border-neutral-800",
	},
	escrow_badge: {
		label: "\uD83D\uDD12 Escrow",
		className: "bg-c-blue-50 text-c-blue border-c-blue-100",
	},
	inactive: {
		label: "Nonaktif",
		className: "bg-neutral-100 text-neutral-500 border-neutral-200",
	},
};

interface StatusBadgeProps {
	status: StatusKey;
}

export function StatusBadge({ status }: StatusBadgeProps) {
	const config = STATUS_CONFIG[status];
	return (
		<span
			role="status"
			aria-label={`Status: ${config.label}`}
			className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${config.className}`}
		>
			{config.label}
		</span>
	);
}
