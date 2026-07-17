"use client";

import { Eye, EyeOff, Smartphone, Store, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FormField } from "../../../../components/auth/FormField";
import { OtpInput } from "../../../../components/auth/OtpInput";
import { PasswordStrength } from "../../../../components/auth/PasswordStrength";

type RegisterStep = "form" | "otp" | "success";
type Role = "customer" | "vendor";

export default function RegisterPage() {
	const [step, setStep] = useState<RegisterStep>("form");
	const [role, setRole] = useState<Role>("customer");
	const [fullName, setFullName] = useState("");
	const [storeName, setStoreName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [agreeTerms, setAgreeTerms] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [otpValue, setOtpValue] = useState("");
	const [otpError, setOtpError] = useState("");
	const [errors, setErrors] = useState<Record<string, string>>({});

	function validateForm(): boolean {
		const newErrors: Record<string, string> = {};

		if (!fullName.trim()) {
			newErrors.fullName = "Nama lengkap wajib diisi";
		} else if (fullName.trim().length < 3) {
			newErrors.fullName = "Nama minimal 3 karakter";
		}

		if (role === "vendor" && !storeName.trim()) {
			newErrors.storeName = "Nama toko wajib diisi";
		}

		if (!email.trim()) {
			newErrors.email = "Email wajib diisi";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			newErrors.email = "Format email tidak valid";
		}

		if (!phone.trim()) {
			newErrors.phone = "Nomor WhatsApp wajib diisi";
		} else if (!/^08\d{8,12}$/.test(phone.replace(/[- ]/g, ""))) {
			newErrors.phone = "Format nomor tidak valid (08xx)";
		}

		if (!password) {
			newErrors.password = "Kata sandi wajib diisi";
		} else if (password.length < 8) {
			newErrors.password = "Kata sandi minimal 8 karakter";
		}

		if (!confirmPassword) {
			newErrors.confirmPassword = "Konfirmasi kata sandi wajib diisi";
		} else if (password !== confirmPassword) {
			newErrors.confirmPassword = "Kata sandi tidak cocok";
		}

		if (!agreeTerms) {
			newErrors.agreeTerms = "Anda harus menyetujui syarat dan ketentuan";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}

	function handleSendOtp() {
		if (!validateForm()) return;
		setIsLoading(true);
		setTimeout(() => {
			setIsLoading(false);
			setStep("otp");
		}, 1200);
	}

	function handleVerifyOtp() {
		if (otpValue.length < 4) {
			setOtpError("Kode OTP harus 4 digit");
			return;
		}
		setIsLoading(true);
		setOtpError("");

		setTimeout(() => {
			if (otpValue === "1234") {
				setIsLoading(false);
				setStep("success");
			} else {
				setIsLoading(false);
				setOtpError("Kode OTP tidak valid. Gunakan 1234 untuk demo.");
			}
		}, 1500);
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
						{step === "otp"
							? "Verifikasi Nomor"
							: step === "success"
								? "Pendaftaran Berhasil"
								: "Buat Akun Baru"}
					</h2>
					<p className="font-sans text-sm text-neutral-500 mt-1">
						{step === "otp"
							? "Masukkan kode OTP yang dikirim ke WhatsApp Anda"
							: step === "success"
								? "Akun Anda siap digunakan"
								: "Daftar sekarang dan mulai jelajahi layanan event terbaik"}
					</p>
				</div>

				{step === "form" && (
					<div className="bg-white rounded-xl shadow-card border border-neutral-100 p-6 sm:p-8">
						<div className="mb-6">
							<p className="font-quick font-semibold text-sm text-neutral-900 mb-3">
								Saya mendaftar sebagai
							</p>
							<div className="grid grid-cols-2 gap-3">
								<button
									type="button"
									onClick={() => {
										setRole("customer");
										setErrors((e) => ({ ...e, storeName: "" }));
									}}
									className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 text-sm font-quick font-semibold transition-all duration-150 ${
										role === "customer"
											? "border-c-blue bg-c-blue-50 text-c-blue"
											: "border-neutral-200 text-neutral-500 hover:border-neutral-300"
									}`}
								>
									<User className="w-4 h-4" />
									Customer
								</button>
								<button
									type="button"
									onClick={() => setRole("vendor")}
									className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 text-sm font-quick font-semibold transition-all duration-150 ${
										role === "vendor"
											? "border-c-blue bg-c-blue-50 text-c-blue"
											: "border-neutral-200 text-neutral-500 hover:border-neutral-300"
									}`}
								>
									<Store className="w-4 h-4" />
									Vendor
								</button>
							</div>
						</div>

						<form
							onSubmit={(e) => {
								e.preventDefault();
								handleSendOtp();
							}}
							className="space-y-5"
						>
							<FormField
								label="Nama Lengkap"
								placeholder="Sesuai identitas KTP"
								value={fullName}
								onChange={(v) => {
									setFullName(v);
									if (errors.fullName)
										setErrors((e) => ({ ...e, fullName: "" }));
								}}
								error={errors.fullName}
								required
							/>

							{role === "vendor" && (
								<div className="motion-safe:animate-fade-in motion-reduce:animate-none">
									<FormField
										label="Nama Toko"
										placeholder="Nama toko Anda"
										value={storeName}
										onChange={(v) => {
											setStoreName(v);
											if (errors.storeName)
												setErrors((e) => ({ ...e, storeName: "" }));
										}}
										error={errors.storeName}
										required
									/>
								</div>
							)}

							<FormField
								label="Email"
								type="email"
								placeholder="email@contoh.com"
								value={email}
								onChange={(v) => {
									setEmail(v);
									if (errors.email) setErrors((e) => ({ ...e, email: "" }));
								}}
								error={errors.email}
								required
							/>

							<FormField
								label="No. WhatsApp"
								type="tel"
								placeholder="08xxxxxxxxxx"
								value={phone}
								onChange={(v) => {
									setPhone(v);
									if (errors.phone) setErrors((e) => ({ ...e, phone: "" }));
								}}
								error={errors.phone}
								helperText="Kode verifikasi akan dikirim melalui WhatsApp"
								required
							/>

							<div>
								<FormField
									label="Kata Sandi"
									type={showPassword ? "text" : "password"}
									placeholder="Minimal 8 karakter"
									value={password}
									onChange={(v) => {
										setPassword(v);
										if (errors.password)
											setErrors((e) => ({ ...e, password: "" }));
									}}
									error={errors.password}
									required
								/>
								<PasswordStrength password={password} />
							</div>

							<div>
								<FormField
									label="Konfirmasi Kata Sandi"
									type={showPassword ? "text" : "password"}
									placeholder="Ulangi kata sandi"
									value={confirmPassword}
									onChange={(v) => {
										setConfirmPassword(v);
										if (errors.confirmPassword)
											setErrors((e) => ({ ...e, confirmPassword: "" }));
									}}
									error={errors.confirmPassword}
									required
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="flex items-center gap-1.5 text-xs font-sans text-neutral-500 hover:text-neutral-700 transition-colors mt-2"
								>
									{showPassword ? (
										<EyeOff className="w-3.5 h-3.5" />
									) : (
										<Eye className="w-3.5 h-3.5" />
									)}
									{showPassword ? "Sembunyikan" : "Lihat"} kata sandi
								</button>
							</div>

							<div>
								<label className="flex items-start gap-2 cursor-pointer select-none">
									<input
										type="checkbox"
										checked={agreeTerms}
										onChange={(e) => {
											setAgreeTerms(e.target.checked);
											if (errors.agreeTerms)
												setErrors((e) => ({ ...e, agreeTerms: "" }));
										}}
										className="w-4 h-4 mt-0.5 rounded border-neutral-300 text-c-blue focus:ring-c-blue"
									/>
									<span className="text-xs font-sans text-neutral-600 leading-relaxed">
										Saya menyetujui{" "}
										<Link
											href="/legal"
											className="text-c-blue font-medium hover:underline"
										>
											Syarat dan Ketentuan
										</Link>{" "}
										serta{" "}
										<Link
											href="/privacy"
											className="text-c-blue font-medium hover:underline"
										>
											Kebijakan Privasi
										</Link>{" "}
										Celeparty
									</span>
								</label>
								{errors.agreeTerms && (
									<p className="text-xs font-sans text-c-red mt-1.5 ml-6">
										{errors.agreeTerms}
									</p>
								)}
							</div>

							<button
								type="submit"
								disabled={isLoading}
								className="w-full inline-flex items-center justify-center gap-2 bg-c-green text-neutral-900 font-quick font-semibold text-sm px-6 py-3 rounded-lg min-h-[44px] transition-all duration-200 hover:brightness-95 hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
							>
								{isLoading ? (
									<>
										<span className="w-4 h-4 border-2 border-neutral-900/30 border-t-neutral-900 rounded-full animate-spin" />
										Mengirim Kode OTP...
									</>
								) : (
									"Daftar Sekarang"
								)}
							</button>
						</form>

						<div className="mt-6 pt-5 border-t border-neutral-100 text-center">
							<p className="text-sm font-sans text-neutral-500">
								Sudah punya akun?{" "}
								<Link
									href="/auth/login"
									className="font-semibold text-c-blue hover:underline"
								>
									Masuk
								</Link>
							</p>
						</div>
					</div>
				)}

				{step === "otp" && (
					<div className="bg-white rounded-xl shadow-card border border-neutral-100 p-6 sm:p-8">
						<div className="text-center mb-6">
							<div className="w-12 h-12 bg-c-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
								<Smartphone className="w-6 h-6 text-c-blue" />
							</div>
							<p className="font-sans text-sm text-neutral-500">
								Kode verifikasi telah dikirim ke{" "}
								<span className="font-semibold text-neutral-700">{phone}</span>
							</p>
							<p className="text-xs font-sans text-neutral-400 mt-1">
								Gunakan 1234 untuk demo
							</p>
						</div>

						<OtpInput
							value={otpValue}
							onChange={(v) => {
								setOtpValue(v);
								setOtpError("");
							}}
							error={otpError}
							disabled={isLoading}
						/>

						<button
							onClick={handleVerifyOtp}
							disabled={isLoading}
							className="w-full mt-6 inline-flex items-center justify-center gap-2 bg-c-green text-neutral-900 font-quick font-semibold text-sm px-6 py-3 rounded-lg min-h-[44px] transition-all duration-200 hover:brightness-95 hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
						>
							{isLoading ? (
								<>
									<span className="w-4 h-4 border-2 border-neutral-900/30 border-t-neutral-900 rounded-full animate-spin" />
									Memverifikasi...
								</>
							) : (
								"Verifikasi"
							)}
						</button>

						<div className="mt-4 text-center space-y-2">
							<button
								type="button"
								onClick={() => setStep("form")}
								className="text-xs font-sans font-medium text-c-blue hover:underline"
							>
								&larr; Ubah nomor telepon
							</button>
							<p className="text-xs font-sans text-neutral-500">
								Belum menerima kode?{" "}
								<button
									type="button"
									onClick={() => {
										setIsLoading(true);
										setTimeout(() => setIsLoading(false), 800);
									}}
									className="font-medium text-c-blue hover:underline"
								>
									Kirim ulang
								</button>
							</p>
						</div>
					</div>
				)}

				{step === "success" && (
					<div className="bg-white rounded-xl shadow-card border border-neutral-100 p-8 text-center">
						<div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 motion-safe:animate-fade-in motion-reduce:animate-none">
							<span className="text-3xl">&#x2713;</span>
						</div>
						<p className="font-sans text-sm text-neutral-500 mb-1">
							Selamat datang,{" "}
							<span className="font-semibold text-neutral-700">{fullName}</span>
							!
						</p>
						<p className="font-sans text-sm text-neutral-500 mb-6">
							Akun{" "}
							{role === "vendor" ? `"${storeName}" sebagai Vendor` : "Customer"}{" "}
							telah berhasil dibuat.
						</p>
						<Link
							href="/auth/login"
							className="inline-flex items-center gap-2 bg-c-green text-neutral-900 font-quick font-semibold text-sm px-8 py-3 rounded-lg min-h-[44px] hover:brightness-95 hover:shadow-md transition-all"
						>
							Lanjutkan ke Login
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
