import { Mail, MapPin, Phone, User } from "lucide-react";

export default function ProfilePage() {
	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
			<h1 className="font-quick font-bold text-3xl text-neutral-900 mb-6">
				Profil Saya
			</h1>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				<div className="md:col-span-1 bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm flex flex-col items-center">
					<div className="w-32 h-32 rounded-full bg-c-blue-50 border-4 border-c-blue mb-4 flex items-center justify-center">
						<User className="w-16 h-16 text-c-blue" />
					</div>
					<h2 className="font-quick font-bold text-xl text-neutral-900">
						Budi Santoso
					</h2>
					<p className="text-neutral-500 font-sans text-sm mb-6">
						Member sejak 2026
					</p>

					<div className="w-full space-y-4">
						<div className="flex items-center gap-3 text-neutral-600">
							<Mail className="w-5 h-5 text-neutral-400" />
							<span className="font-sans text-sm">budi@example.com</span>
						</div>
						<div className="flex items-center gap-3 text-neutral-600">
							<Phone className="w-5 h-5 text-neutral-400" />
							<span className="font-sans text-sm">+62 812 3456 7890</span>
						</div>
						<div className="flex items-center gap-3 text-neutral-600">
							<MapPin className="w-5 h-5 text-neutral-400" />
							<span className="font-sans text-sm">Jakarta, Indonesia</span>
						</div>
					</div>
				</div>

				<div className="md:col-span-2 flex flex-col gap-8">
					<div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
						<h3 className="font-quick font-bold text-xl text-neutral-900 mb-4">
							Ringkasan Aktivitas
						</h3>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
							<div className="p-4 bg-c-blue-50 rounded-xl text-center">
								<p className="font-quick font-bold text-3xl text-c-blue mb-1">
									12
								</p>
								<p className="font-sans text-xs text-neutral-600">
									Event Dipesan
								</p>
							</div>
							<div className="p-4 bg-emerald-50 rounded-xl text-center">
								<p className="font-quick font-bold text-3xl text-emerald-600 mb-1">
									5
								</p>
								<p className="font-sans text-xs text-neutral-600">
									Ulasan Diberikan
								</p>
							</div>
							<div className="p-4 bg-amber-50 rounded-xl text-center">
								<p className="font-quick font-bold text-3xl text-amber-600 mb-1">
									1
								</p>
								<p className="font-sans text-xs text-neutral-600">
									Menunggu Pembayaran
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
