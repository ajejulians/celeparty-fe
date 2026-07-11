"use client";

import { useState } from "react";
import { FormField } from "../../../../components/auth/FormField";
import { Eye, EyeOff, AlertTriangle, Check, Lock } from "lucide-react";

type Role = "customer" | "vendor" | "admin";

interface CredentialResult {
  success: boolean;
  role: Role | null;
  name: string;
  message?: string;
}

const MOCK_CREDENTIALS: Record<string, CredentialResult> = {
  "customer@celeparty.com": {
    success: true,
    role: "customer",
    name: "Budi Santoso",
  },
  "vendor@celeparty.com": {
    success: true,
    role: "vendor",
    name: "Jakarta Audio Pro",
  },
  "admin@celeparty.com": {
    success: true,
    role: "admin",
    name: "Admin Celeparty",
  },
};

const ROLE_REDIRECTS: Record<Role, string> = {
  customer: "/products",
  vendor: "/user/vendor/dashboard",
  admin: "/user/admin/dashboard",
};

const ROLE_LABELS: Record<Role, string> = {
  customer: "Customer",
  vendor: "Vendor",
  admin: "Admin",
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authResult, setAuthResult] = useState<CredentialResult | null>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

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

  function handleLogin() {
    if (!validate()) return;
    setIsLoading(true);
    setAuthResult(null);

    setTimeout(() => {
      const found = MOCK_CREDENTIALS[email.toLowerCase().trim()];
      if (found && password === "rahasia123") {
        setAuthResult(found);
        setTimeout(() => {
          window.location.href = ROLE_REDIRECTS[found.role!];
        }, 1500);
      } else {
        setAuthResult({
          success: false,
          role: null,
          name: "",
          message: "Email atau kata sandi salah. Silakan coba lagi.",
        });
      }
      setIsLoading(false);
    }, 1500);
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-neutral-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
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
                setAuthResult(null);
                if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
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
                  setAuthResult(null);
                  if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
                }}
                error={errors.password}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 text-c-blue focus:ring-c-blue"
                />
                <span className="text-xs font-sans text-neutral-600">
                  Ingat Saya
                </span>
              </label>

              <a
                href="#"
                className="text-xs font-sans font-medium text-c-blue hover:underline"
              >
                Lupa Kata Sandi?
              </a>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="flex items-center gap-1.5 text-xs font-sans text-neutral-500 hover:text-neutral-700 transition-colors"
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
              >
                {showPassword ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {authResult && !authResult.success && (
              <div className="bg-c-red-50 border border-c-red/20 rounded-lg p-3 flex items-start gap-2 motion-safe:animate-fade-in motion-reduce:animate-none">
                <span className="text-c-red text-sm mt-0.5 shrink-0">
                  &#x26A0;
                </span>
                <p className="text-xs font-sans text-c-red">
                  {authResult.message}
                </p>
              </div>
            )}

            {authResult && authResult.success && (
              <div className="bg-status-success/10 border border-status-success/30 rounded-lg p-3 flex items-start gap-2 motion-safe:animate-fade-in motion-reduce:animate-none">
                <span className="text-status-success text-sm mt-0.5 shrink-0">
                  &#x2713;
                </span>
                <div>
                  <p className="text-xs font-sans font-medium text-status-success">
                    Login berhasil!
                  </p>
                  <p className="text-xs font-sans text-neutral-600 mt-0.5">
                    Masuk sebagai{" "}
                    <span className="font-semibold">{authResult.name}</span>{" "}
                    ({ROLE_LABELS[authResult.role!]})
                  </p>
                  <p className="text-xs font-sans text-neutral-500 mt-0.5">
                    Mengalihkan ke halaman{" "}
                    {authResult.role === "customer" ? "Katalog" : "Dashboard"}...
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
            <p className="text-sm font-sans text-neutral-500">
              Belum punya akun?{" "}
              <a
                href="/auth/register"
                className="font-semibold text-c-blue hover:underline"
              >
                Daftar Sekarang
              </a>
            </p>
          </div>
        </div>

        <div className="mt-6 bg-c-blue-50 rounded-xl border border-c-blue-100 p-4">
          <p className="text-xs font-sans font-semibold text-c-blue mb-2 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> Data Demo untuk Uji Coba
          </p>
          <div className="space-y-1.5 text-xs font-sans text-neutral-600">
            <p>
              <span className="font-semibold">Customer:</span>{" "}
              customer@celeparty.com / rahasia123
            </p>
            <p>
              <span className="font-semibold">Vendor:</span>{" "}
              vendor@celeparty.com / rahasia123
            </p>
            <p>
              <span className="font-semibold">Admin:</span>{" "}
              admin@celeparty.com / rahasia123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
