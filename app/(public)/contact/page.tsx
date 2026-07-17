"use client";

import {
	CheckCircle2,
	ExternalLink,
	Globe,
	Loader2,
	Mail,
	MapPin,
	MessageCircle,
	Send,
	Share2,
	Users,
} from "lucide-react";
import { useRef, useState } from "react";

export default function ContactPage() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const formRef = useRef<HTMLFormElement>(null);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		setTimeout(() => {
			setIsSubmitting(false);
			setIsSuccess(true);

			setTimeout(() => {
				setIsSuccess(false);
				formRef.current?.reset();
			}, 3000);
		}, 1500);
	};

	return (
		<div className="flex-grow pt-12 pb-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto w-full min-h-screen bg-neutral-50">
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
				{/* Left Column: Contact Information */}
				<div className="lg:col-span-5 space-y-8">
					<div className="space-y-4">
						<h2 className="font-quick text-3xl md:text-4xl font-bold text-c-blue">
							Mari Terhubung
						</h2>
						<p className="text-neutral-600 font-sans text-base leading-relaxed">
							Punya pertanyaan tentang paket event atau ingin berkolaborasi? Tim
							kami siap membantu mewujudkan perayaan impian Anda dengan
							profesionalisme tinggi.
						</p>
					</div>

					<div className="space-y-6">
						{/* Office */}
						<div className="flex gap-4 p-4 rounded-xl bg-white shadow-sm border border-neutral-200 hover:border-c-blue transition-colors">
							<div className="w-12 h-12 rounded-full bg-c-blue-50 flex items-center justify-center shrink-0">
								<MapPin className="text-c-blue w-6 h-6" />
							</div>
							<div>
								<h4 className="font-quick font-semibold text-c-blue text-base">
									Kantor Pusat
								</h4>
								<p className="text-neutral-500 font-sans text-sm mt-1">
									Jl. Festive No. 42, Kebayoran Baru, Jakarta Selatan, 12150
								</p>
							</div>
						</div>

						{/* Email */}
						<div className="flex gap-4 p-4 rounded-xl bg-white shadow-sm border border-neutral-200 hover:border-c-blue transition-colors">
							<div className="w-12 h-12 rounded-full bg-c-blue-50 flex items-center justify-center shrink-0">
								<Mail className="text-c-blue w-6 h-6" />
							</div>
							<div>
								<h4 className="font-quick font-semibold text-c-blue text-base">
									Email Dukungan
								</h4>
								<p className="text-neutral-500 font-sans text-sm mt-1">
									halo@celeparty.com
								</p>
							</div>
						</div>

						{/* WhatsApp */}
						<div className="flex gap-4 p-4 rounded-xl bg-white shadow-sm border border-neutral-200 hover:border-c-blue transition-colors">
							<div className="w-12 h-12 rounded-full bg-c-green-50 flex items-center justify-center shrink-0">
								<MessageCircle className="text-emerald-600 w-6 h-6" />
							</div>
							<div>
								<h4 className="font-quick font-semibold text-c-blue text-base">
									WhatsApp Business
								</h4>
								<p className="text-neutral-500 font-sans text-sm mt-1">
									+62 812-3456-7890
								</p>
							</div>
						</div>
					</div>

					<div className="pt-6">
						<h4 className="font-quick font-semibold text-c-blue text-base mb-4">
							Ikuti Kami
						</h4>
						<div className="flex gap-4">
							<a
								className="w-10 h-10 rounded-full bg-c-blue flex items-center justify-center text-white hover:scale-105 transition-transform"
								href="#"
							>
								<Share2 className="w-5 h-5" />
							</a>
							<a
								className="w-10 h-10 rounded-full bg-c-blue flex items-center justify-center text-white hover:scale-105 transition-transform"
								href="#"
							>
								<Globe className="w-5 h-5" />
							</a>
							<a
								className="w-10 h-10 rounded-full bg-c-blue flex items-center justify-center text-white hover:scale-105 transition-transform"
								href="#"
							>
								<Users className="w-5 h-5" />
							</a>
						</div>
					</div>

					{/* Subtle Map Section */}
					<div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-inner bg-neutral-200 group">
						<div
							className="absolute inset-0 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-500 bg-cover bg-center"
							style={{
								backgroundImage:
									"url('https://lh3.googleusercontent.com/aida-public/AB6AXuD2Z-HqZG3SgVexaWNXeTCB1UVxCgXocbRR6BXkPXhhvdujwsg7tLZ96UDVq0hd4UlOiANnuhn-3DiF4X0lOSngZNIwos3X3AD-qdF51yfVtiykW1KP7LAlyMo08E8YzB4t3Os8KrkIoJL4GQayIo3MCsAg8ABMbQTbDmr0t9RWvXw7xOvAc8NWgd-pz3_RvC2dTZt9LUiRNLDXbrNcSwWQY3y5GaNbrTNDVKIiAnzWmhhTlDWGuD5qv3M1rDu9Yl7fsKNo1QT8zfx_')",
							}}
						></div>
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="bg-c-blue text-white px-4 py-2 rounded-full font-sans text-sm font-medium shadow-md flex items-center gap-2 cursor-pointer hover:bg-c-blue/90 transition-colors">
								<ExternalLink className="w-4 h-4" />
								Buka di Maps
							</div>
						</div>
					</div>
				</div>

				{/* Right Column: Contact Form */}
				<div className="lg:col-span-7 bg-white p-8 md:p-12 rounded-3xl shadow-card border border-neutral-100 relative overflow-hidden">
					{/* Atmospheric background pattern */}
					<div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
						<svg
							className="text-c-blue"
							fill="currentColor"
							viewBox="0 0 100 100"
						>
							<circle cx="50" cy="50" r="50"></circle>
						</svg>
					</div>

					<div className="relative z-10 space-y-8">
						<header>
							<h3 className="font-quick text-2xl font-bold text-c-blue">
								Kirim Pesan
							</h3>
							<p className="text-neutral-500 font-sans text-sm mt-2">
								Kami biasanya membalas dalam waktu kurang dari 24 jam.
							</p>
						</header>

						<form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{/* Name */}
								<div className="space-y-2">
									<label
										className="font-sans text-sm font-medium text-neutral-900 flex items-center gap-1"
										htmlFor="name"
									>
										Nama Lengkap <span className="text-c-red">*</span>
									</label>
									<input
										className="w-full h-11 px-4 bg-white rounded-lg border border-neutral-200 focus:border-c-blue focus:ring-2 focus:ring-c-blue/15 outline-none transition-all font-sans text-base hover:border-neutral-300"
										id="name"
										placeholder="Masukkan nama Anda"
										required
										type="text"
									/>
								</div>

								{/* Email */}
								<div className="space-y-2">
									<label
										className="font-sans text-sm font-medium text-neutral-900 flex items-center gap-1"
										htmlFor="email"
									>
										Alamat Email <span className="text-c-red">*</span>
									</label>
									<input
										className="w-full h-11 px-4 bg-white rounded-lg border border-neutral-200 focus:border-c-blue focus:ring-2 focus:ring-c-blue/15 outline-none transition-all font-sans text-base hover:border-neutral-300"
										id="email"
										placeholder="nama@email.com"
										required
										type="email"
									/>
								</div>
							</div>

							{/* Subject */}
							<div className="space-y-2">
								<label
									className="font-sans text-sm font-medium text-neutral-900 flex items-center gap-1"
									htmlFor="subject"
								>
									Subjek <span className="text-c-red">*</span>
								</label>
								<select
									className="w-full h-11 px-4 bg-white rounded-lg border border-neutral-200 focus:border-c-blue focus:ring-2 focus:ring-c-blue/15 outline-none transition-all font-sans text-base cursor-pointer hover:border-neutral-300"
									id="subject"
									required
								>
									<option value="">Pilih Subjek</option>
									<option value="sales">Pertanyaan Layanan</option>
									<option value="vendor">Pendaftaran Vendor</option>
									<option value="tech">Bantuan Teknis</option>
									<option value="other">Lainnya</option>
								</select>
							</div>

							{/* Message */}
							<div className="space-y-2">
								<label
									className="font-sans text-sm font-medium text-neutral-900 flex items-center gap-1"
									htmlFor="message"
								>
									Pesan Anda <span className="text-c-red">*</span>
								</label>
								<textarea
									className="w-full p-4 bg-white rounded-lg border border-neutral-200 focus:border-c-blue focus:ring-2 focus:ring-c-blue/15 outline-none transition-all font-sans text-base resize-none hover:border-neutral-300"
									id="message"
									placeholder="Bagaimana kami bisa membantu Anda?"
									required
									rows={5}
								></textarea>
							</div>

							{/* CTA */}
							<button
								className={`w-full md:w-auto px-8 h-12 font-quick text-base font-semibold rounded-full flex items-center justify-center gap-2 transition-all shadow-sm group disabled:cursor-not-allowed disabled:opacity-80
                  ${isSuccess ? "bg-emerald-500 text-white hover:bg-emerald-600" : "bg-c-blue text-white hover:bg-c-blue/90 active:scale-[0.98]"}`}
								type="submit"
								disabled={isSubmitting || isSuccess}
							>
								{isSubmitting ? (
									<>
										<Loader2 className="w-5 h-5 animate-spin" /> Mengirim...
									</>
								) : isSuccess ? (
									<>
										<CheckCircle2 className="w-5 h-5" /> Terkirim!
									</>
								) : (
									<>
										Kirim Pesan
										<Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
									</>
								)}
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
