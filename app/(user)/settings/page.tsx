"use client";

import {
	Bell,
	Camera,
	CreditCard,
	KeyRound,
	Save,
	Shield,
	User,
} from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
	const [activeTab, setActiveTab] = useState("profil");

	const tabs = [
		{ id: "profil", name: "Profil", icon: <User className="w-5 h-5" /> },
		{ id: "keamanan", name: "Keamanan", icon: <Shield className="w-5 h-5" /> },
		{
			id: "notifikasi",
			name: "Notifikasi",
			icon: <Bell className="w-5 h-5" />,
		},
		{
			id: "pembayaran",
			name: "Metode Pembayaran",
			icon: <CreditCard className="w-5 h-5" />,
		},
	];

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
			<h1 className="font-quick font-bold text-3xl text-neutral-900 mb-8">
				Pengaturan
			</h1>

			<div className="flex flex-col md:flex-row gap-8">
				{/* Sidebar Tabs */}
				<div className="w-full md:w-64 flex-shrink-0">
					<div className="flex md:flex-col overflow-x-auto md:overflow-visible gap-2 pb-4 md:pb-0">
						{tabs.map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`flex items-center gap-3 px-4 py-3 rounded-xl font-sans font-medium text-sm transition-all whitespace-nowrap ${
									activeTab === tab.id
										? "bg-c-blue text-white shadow-md"
										: "text-neutral-600 hover:bg-neutral-100"
								}`}
							>
								{tab.icon}
								{tab.name}
							</button>
						))}
					</div>
				</div>

				{/* Content Area */}
				<div className="flex-1">
					{activeTab === "profil" && (
						<div className="bg-white rounded-2xl border border-neutral-200 p-6 md:p-8 shadow-sm">
							<h2 className="font-quick font-bold text-xl text-neutral-900 mb-6">
								Informasi Profil
							</h2>
							<form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
								{/* Profile Picture */}
								<div>
									<label className="block text-sm font-sans text-neutral-700 mb-4">
										Foto Profil
									</label>
									<div className="flex items-center gap-6">
										<div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-neutral-200 bg-neutral-100 flex items-center justify-center">
											<User className="w-10 h-10 text-neutral-400" />
										</div>
										<button
											type="button"
											className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-lg text-sm font-sans font-medium text-neutral-700 hover:bg-neutral-50 transition-all"
										>
											<Camera className="w-4 h-4" /> Ubah Foto
										</button>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="space-y-2">
										<label className="block text-sm font-sans text-neutral-700">
											Nama Lengkap
										</label>
										<input
											type="text"
											defaultValue="Budi Santoso"
											className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-c-blue focus:ring-1 focus:ring-c-blue transition-all"
										/>
									</div>
									<div className="space-y-2">
										<label className="block text-sm font-sans text-neutral-700">
											Nomor HP
										</label>
										<input
											type="tel"
											defaultValue="+62 812 3456 7890"
											className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-c-blue focus:ring-1 focus:ring-c-blue transition-all"
										/>
									</div>
									<div className="space-y-2">
										<label className="block text-sm font-sans text-neutral-700">
											Email
										</label>
										<input
											type="email"
											defaultValue="budi@example.com"
											readOnly
											className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 bg-neutral-100 text-neutral-500 cursor-not-allowed focus:outline-none transition-all"
										/>
									</div>
									<div className="space-y-2">
										<label className="block text-sm font-sans text-neutral-700">
											Tanggal Lahir
										</label>
										<input
											type="date"
											defaultValue="1990-01-01"
											className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-c-blue focus:ring-1 focus:ring-c-blue transition-all"
										/>
									</div>
									<div className="space-y-2 md:col-span-2">
										<label className="block text-sm font-sans text-neutral-700 mb-2">
											Jenis Kelamin
										</label>
										<div className="flex gap-6">
											<label className="flex items-center gap-2 cursor-pointer">
												<input
													type="radio"
													name="gender"
													value="Pria"
													defaultChecked
													className="w-4 h-4 text-c-blue focus:ring-c-blue border-neutral-300"
												/>
												<span className="text-sm font-sans text-neutral-700">
													Pria
												</span>
											</label>
											<label className="flex items-center gap-2 cursor-pointer">
												<input
													type="radio"
													name="gender"
													value="Wanita"
													className="w-4 h-4 text-c-blue focus:ring-c-blue border-neutral-300"
												/>
												<span className="text-sm font-sans text-neutral-700">
													Wanita
												</span>
											</label>
										</div>
									</div>
								</div>

								<div className="pt-4">
									<button
										type="submit"
										className="flex items-center gap-2 bg-c-green text-neutral-900 font-quick font-semibold text-sm px-6 py-3 rounded-lg hover:brightness-95 active:scale-[0.98] transition-all"
									>
										<Save className="w-4 h-4" /> Simpan Perubahan
									</button>
								</div>
							</form>
						</div>
					)}

					{activeTab === "keamanan" && (
						<div className="bg-white rounded-2xl border border-neutral-200 p-6 md:p-8 shadow-sm">
							<h2 className="font-quick font-bold text-xl text-neutral-900 mb-6">
								Ubah Kata Sandi
							</h2>
							<form
								className="space-y-6 max-w-md"
								onSubmit={(e) => e.preventDefault()}
							>
								<div className="space-y-2">
									<label className="block text-sm font-sans text-neutral-700">
										Kata Sandi Saat Ini
									</label>
									<input
										type="password"
										placeholder="••••••••"
										className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-c-blue focus:ring-1 focus:ring-c-blue transition-all"
									/>
								</div>
								<div className="space-y-2">
									<label className="block text-sm font-sans text-neutral-700">
										Kata Sandi Baru
									</label>
									<input
										type="password"
										placeholder="••••••••"
										className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-c-blue focus:ring-1 focus:ring-c-blue transition-all"
									/>
								</div>
								<div className="space-y-2">
									<label className="block text-sm font-sans text-neutral-700">
										Konfirmasi Kata Sandi
									</label>
									<input
										type="password"
										placeholder="••••••••"
										className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-c-blue focus:ring-1 focus:ring-c-blue transition-all"
									/>
								</div>

								<div className="pt-4">
									<button
										type="submit"
										className="flex items-center gap-2 bg-c-blue text-white font-quick font-semibold text-sm px-6 py-3 rounded-lg hover:brightness-110 active:scale-[0.98] transition-all"
									>
										<KeyRound className="w-4 h-4" /> Ubah Kata Sandi
									</button>
								</div>
							</form>
						</div>
					)}

					{(activeTab === "notifikasi" || activeTab === "pembayaran") && (
						<div className="bg-white rounded-2xl border border-neutral-200 p-12 shadow-sm flex flex-col items-center justify-center text-center">
							<div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4 text-neutral-400">
								{activeTab === "notifikasi" ? (
									<Bell className="w-8 h-8" />
								) : (
									<CreditCard className="w-8 h-8" />
								)}
							</div>
							<h2 className="font-quick font-bold text-xl text-neutral-900 mb-2">
								Segera Hadir
							</h2>
							<p className="font-sans text-sm text-neutral-500 max-w-sm">
								Fitur{" "}
								{activeTab === "notifikasi"
									? "pengaturan notifikasi"
									: "metode pembayaran"}{" "}
								sedang dalam tahap pengembangan dan akan segera tersedia.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
