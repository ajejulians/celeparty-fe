"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { FormField } from "../../../../components/auth/FormField";
import { useSession } from "../../../../lib/session";

export default function LoginPage() {
	const session = useSession();
	const searchParams = useSearchParams();
	const redirectTo = searchParams.get("redirect");

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");
	const [successMsg, setSuccessMsg] = useState("");
	const [errors, setErrors] = useState<{ email?: string; password?: string }>(
		{},
	);

	function validate(): boolean {
		const newErrors: typeof errors = {};
		if (!email.trim()) newErrors.email = "Email wajib diisi";
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
			newErrors.email = "Format email tidak valid";
		if (!password) newErrors.password = "Kata sandi wajib diisi";
		else if (password.length < 6)
			newErrors.password = "Kata sandi minimal 6 karakter";
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}

	async function handleLogin() {
		if (!validate()) return;
		setIsLoading(true);
		setErrorMsg("");
		setSuccessMsg("");

		try {
			const result = await session.login(email, password);
			setSuccessMsg("Login berhasil!");
			toast.success("Login berhasil");
			setTimeout(() => {
				window.location.href = redirectTo || result.redirect;
			}, 800);
		} catch (err: unknown) {
			const message =
				err instanceof Error ? err.message : "Email atau kata sandi salah";
			setErrorMsg(message);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-neutral-50">
			<div className="w-full max-w-md">
				<div className="text-center mb-8 flex flex-col items-center">
					<img
						src="/images/favicon.ico"
						alt="Celeparty Logo"
						className="w-12 h-12 object-contain mb-3"
					/>
					<h1 className="font-quick font-bold text-3xl text-c-blue mb-2">
						CELEPARTY
					</h1>
					<h2 className="font-quick font-bold text-xl text-neutral-900">
						Selamat Datang Kembali
					</h2>
					<p className="font-sans text-sm text-neutral-500 mt-1">
						Masuk ke akun Anda untuk melanjutkan
					</p>
				</div>

				<div className="bg-white rounded-xl shadow-card border border-neutral-100 p-6 sm:p-8">
					<form
						onSubmit={(e) => {
							e.preventDefault();
							handleLogin();
						}}
						className="space-y-5"
					>
						<FormField
							label="Email"
							type="email"
							placeholder="email@contoh.com"
							value={email}
							onChange={(v) => {
								setEmail(v);
								setErrorMsg("");
								if (errors.email)
									setErrors((e) => ({ ...e, email: undefined }));
							}}
							error={errors.email}
							required
						/>

						<div>
							<FormField
								label="Kata Sandi"
								type={showPassword ? "text" : "password"}
								placeholder="Masukkan kata sandi"
								value={password}
								onChange={(v) => {
									setPassword(v);
									setErrorMsg("");
									if (errors.password)
										setErrors((e) => ({ ...e, password: undefined }));
								}}
								error={errors.password}
								required
							/>
						</div>

						<div className="flex items-center justify-between">
							<label className="flex items-center gap-2 cursor-pointer select-none">
								<input
									type="checkbox"
									className="w-4 h-4 rounded border-neutral-300 text-c-blue focus:ring-c-blue"
								/>
								<span className="text-xs font-sans text-neutral-600">
									Ingat Saya
								</span>
							</label>

							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="flex items-center gap-1.5 text-xs font-sans text-neutral-500 hover:text-neutral-700 transition-colors"
								aria-label={
									showPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"
								}
							>
								{showPassword ? (
									<EyeOff className="w-3.5 h-3.5" />
								) : (
									<Eye className="w-3.5 h-3.5" />
								)}
							</button>
						</div>

						{errorMsg && (
							<div className="bg-c-red-50 border border-c-red/20 rounded-lg p-3 flex items-start gap-2 motion-safe:animate-fade-in motion-reduce:animate-none">
								<span className="text-c-red text-sm mt-0.5 shrink-0">
									&#x26A0;
								</span>
								<p className="text-xs font-sans text-c-red">{errorMsg}</p>
							</div>
						)}

						{successMsg && (
							<div className="bg-status-success/10 border border-status-success/30 rounded-lg p-3 flex items-start gap-2 motion-safe:animate-fade-in motion-reduce:animate-none">
								<span className="text-status-success text-sm mt-0.5 shrink-0">
									&#x2713;
								</span>
								<div>
									<p className="text-xs font-sans font-medium text-status-success">
										{successMsg}
									</p>
									<p className="text-xs font-sans text-neutral-500 mt-0.5">
										Mengalihkan ke halaman...
									</p>
								</div>
							</div>
						)}

						<button
							type="submit"
							disabled={isLoading}
							className="w-full inline-flex items-center justify-center gap-2 bg-c-blue text-white font-quick font-semibold text-sm px-6 py-3 rounded-lg min-h-[44px] transition-all duration-200 hover:brightness-95 hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
						>
							{isLoading ? (
								<>
									<span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
									Memverifikasi...
								</>
							) : (
								"Masuk Sekarang"
							)}
						</button>
					</form>

					<div className="mt-6 pt-5 border-t border-neutral-100 text-center">
						<p className="text-xs font-sans text-neutral-400 mb-2 font-medium">
							Demo Quick Login (Klik untuk masuk otomatis):
						</p>
						<div className="grid grid-cols-3 gap-2 mb-4">
							<button
								type="button"
								onClick={() => {
									setEmail("customer@celeparty.com");
									setPassword("123456");
								}}
								className="text-xs font-sans font-semibold py-2 px-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors"
							>
								Customer
							</button>
							<button
								type="button"
								onClick={() => {
									setEmail("vendor@celeparty.com");
									setPassword("123456");
								}}
								className="text-xs font-sans font-semibold py-2 px-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg transition-colors border border-amber-200"
							>
								Vendor
							</button>
							<button
								type="button"
								onClick={() => {
									setEmail("admin@celeparty.com");
									setPassword("123456");
								}}
								className="text-xs font-sans font-semibold py-2 px-2 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-lg transition-colors border border-purple-200"
							>
								Admin
							</button>
						</div>

						<p className="text-sm font-sans text-neutral-500">
							Belum punya akun?{" "}
							<Link
								href="/auth/register"
								className="font-semibold text-c-blue hover:underline"
							>
								Daftar Sekarang
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

