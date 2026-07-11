import { Instagram, Twitter, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h4 className="font-quick font-bold text-white text-lg mb-4">
              CELEPARTY
            </h4>
            <p className="font-sans text-sm leading-relaxed">
              Marketplace event platform — temukan dan beli jasa event terbaik
              untuk perayaan Anda.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center hover:bg-c-blue transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center hover:bg-c-blue transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center hover:bg-c-blue transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-quick font-semibold text-white text-sm mb-4">
              Perusahaan
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="font-sans text-sm hover:text-white transition-colors"
                >
                  Beranda
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="font-sans text-sm hover:text-white transition-colors"
                >
                  Tentang Kami
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="font-sans text-sm hover:text-white transition-colors"
                >
                  Mitra
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="font-sans text-sm hover:text-white transition-colors"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-quick font-semibold text-white text-sm mb-4">
              Bantuan
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/help"
                  className="font-sans text-sm hover:text-white transition-colors"
                >
                  Pusat Bantuan
                </a>
              </li>
              <li>
                <a
                  href="/legal"
                  className="font-sans text-sm hover:text-white transition-colors"
                >
                  Syarat dan Ketentuan
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="font-sans text-sm hover:text-white transition-colors"
                >
                  Kebijakan Privasi
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="font-sans text-sm hover:text-white transition-colors"
                >
                  Kontak
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-quick font-semibold text-white text-sm mb-4">
              Metode Pembayaran
            </h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-md bg-neutral-800 text-xs font-sans font-medium">
                BCA
              </span>
              <span className="px-3 py-1.5 rounded-md bg-neutral-800 text-xs font-sans font-medium">
                Mandiri
              </span>
              <span className="px-3 py-1.5 rounded-md bg-neutral-800 text-xs font-sans font-medium">
                GoPay
              </span>
              <span className="px-3 py-1.5 rounded-md bg-neutral-800 text-xs font-sans font-medium">
                OVO
              </span>
              <span className="px-3 py-1.5 rounded-md bg-neutral-800 text-xs font-sans font-medium">
                ShopeePay
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-neutral-800 text-center">
          <p className="font-sans text-xs">
            &copy; {new Date().getFullYear()} Celeparty. Seluruh hak cipta
            dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
