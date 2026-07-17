import { Building2, CreditCard } from "lucide-react";
import { useState } from "react";

export function PaymentMethodSelection() {
	const [selected, setSelected] = useState<string | null>(null);

	const paymentMethods = [
		{ id: "qris", name: "QRIS", icon: <CreditCard className="w-8 h-8" /> },
		{
			id: "va-cimb",
			name: "CIMB Niaga",
			icon: <Building2 className="w-8 h-8" />,
		},
		{ id: "va-bni", name: "BNI", icon: <Building2 className="w-8 h-8" /> },
		{ id: "va-bri", name: "BRI", icon: <Building2 className="w-8 h-8" /> },
		{
			id: "va-mandiri",
			name: "Bank Mandiri",
			icon: <Building2 className="w-8 h-8" />,
		},
		{
			id: "va-permata",
			name: "Permata Bank",
			icon: <Building2 className="w-8 h-8" />,
		},
	];

	return (
		<div className="space-y-4 w-full">
			<h3 className="font-quick font-bold text-lg text-neutral-900">
				Pilih Metode Pembayaran
			</h3>
			<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
				{paymentMethods.map((method) => (
					<button
						key={method.id}
						onClick={() => setSelected(method.id)}
						className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 text-center ${
							selected === method.id
								? "border-c-blue bg-c-blue/10 text-c-blue"
								: "border-neutral-200 hover:border-c-blue hover:bg-c-blue/5 text-neutral-700"
						}`}
					>
						<div>{method.icon}</div>
						<span className="text-xs font-sans font-semibold leading-tight">
							{method.name}
						</span>
						{method.id.startsWith("va-") && (
							<span className="text-[10px] font-sans text-neutral-500">
								Virtual Account
							</span>
						)}
					</button>
				))}
			</div>
		</div>
	);
}
