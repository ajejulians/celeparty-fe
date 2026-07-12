import { Metadata } from "next";
import { products } from "../../../lib/data";
import { TicketCard } from "../../../components/product/TicketCard";

export const metadata: Metadata = {
  title: "Produk Event | Celeparty",
  description: "Temukan berbagai produk dan jasa event terbaik di Celeparty — sound system, fotografer, dekorasi, catering, dan lebih banyak lagi.",
};

const categories = [
  "Audio & Sound",
  "Fotografi",
  "Dekorasi",
  "Catering",
  "Entertainment",
];

const cities = ["Jakarta", "Bandung", "Surabaya", "Yogyakarta"];

export default function ProductsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-quick font-bold text-3xl text-neutral-900">
          Katalog Produk
        </h1>
        <p className="font-sans text-sm text-neutral-500 mt-1">
          Temukan jasa event terbaik untuk perayaan Anda
        </p>
      </div>

      <div className="flex gap-8">
        <aside className="hidden lg:block w-60 shrink-0 sticky top-20 self-start">
          <div className="bg-white rounded-xl border border-neutral-200 p-5 space-y-6">
            <div>
              <h3 className="font-quick font-semibold text-sm text-neutral-900 mb-3">
                Kategori
              </h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-neutral-300 text-c-blue focus:ring-c-blue"
                    />
                    <span className="text-sm font-sans text-neutral-700 group-hover:text-neutral-900 transition-colors">
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-neutral-100" />

            <div>
              <h3 className="font-quick font-semibold text-sm text-neutral-900 mb-3">
                Wilayah
              </h3>
              <div className="space-y-2">
                {cities.map((city) => (
                  <label
                    key={city}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-neutral-300 text-c-blue focus:ring-c-blue"
                    />
                    <span className="text-sm font-sans text-neutral-700 group-hover:text-neutral-900 transition-colors">
                      {city}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-neutral-100" />

            <div>
              <h3 className="font-quick font-semibold text-sm text-neutral-900 mb-3">
                Harga
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="price"
                    className="w-4 h-4 border-neutral-300 text-c-blue focus:ring-c-blue"
                  />
                  <span className="text-sm font-sans text-neutral-700 group-hover:text-neutral-900">
                    Di bawah Rp 5.000.000
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="price"
                    className="w-4 h-4 border-neutral-300 text-c-blue focus:ring-c-blue"
                  />
                  <span className="text-sm font-sans text-neutral-700 group-hover:text-neutral-900">
                    Rp 5.000.000 – Rp 10.000.000
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="price"
                    className="w-4 h-4 border-neutral-300 text-c-blue focus:ring-c-blue"
                  />
                  <span className="text-sm font-sans text-neutral-700 group-hover:text-neutral-900">
                    Di atas Rp 10.000.000
                  </span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex gap-2 mb-6 lg:hidden">
            <button className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-lg text-sm font-quick font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors">
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-lg text-sm font-quick font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors">
              Urutkan
            </button>
          </div>

          <div className="hidden lg:flex items-center justify-between mb-6">
            <p className="text-sm font-sans text-neutral-500">
              Menampilkan {products.length} produk
            </p>
            <select className="text-sm border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-c-blue font-sans">
              <option value="">Urutkan: Terbaru</option>
              <option value="price-low">Harga: Rendah ke Tinggi</option>
              <option value="price-high">Harga: Tinggi ke Rendah</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <TicketCard
                key={product.slug}
                product={product}
                variant="catalog"
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 mt-10">
            <button className="w-9 h-9 rounded-lg border border-neutral-200 flex items-center justify-center text-sm font-sans text-neutral-500 hover:border-c-blue hover:text-c-blue transition-colors" disabled>
              &laquo;
            </button>
            <button className="w-9 h-9 rounded-lg bg-c-blue text-white flex items-center justify-center text-sm font-sans font-semibold">
              1
            </button>
            <button className="w-9 h-9 rounded-lg border border-neutral-200 flex items-center justify-center text-sm font-sans text-neutral-600 hover:border-c-blue hover:text-c-blue transition-colors">
              2
            </button>
            <button className="w-9 h-9 rounded-lg border border-neutral-200 flex items-center justify-center text-sm font-sans text-neutral-500 hover:border-c-blue hover:text-c-blue transition-colors">
              &raquo;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
