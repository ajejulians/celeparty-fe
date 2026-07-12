"use client";

import { useState } from "react";
import { ErpHeader } from "@/components/layout/ErpHeader";
import { Store, CreditCard, Save } from "lucide-react";

export default function VendorProfilePage() {
  const [vendorName, setVendorName] = useState("Jakarta Audio Pro");
  const [email, setEmail] = useState("vendor@celeparty.com");
  const [phone, setPhone] = useState("08123456789");
  const [city, setCity] = useState("Jakarta");
  const [bankName, setBankName] = useState("BCA");
  const [accountNumber, setAccountNumber] = useState("1234567890");
  const [accountName, setAccountName] = useState("Jakarta Audio Pro");

  const handleSave = () => {
    alert("Profil berhasil disimpan");
  };
  return (
    <>
      <ErpHeader breadcrumbs={[{ label: "Dashboard", href: "/user/vendor/dashboard" }, { label: "Profil Toko" }]} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8"><h1 className="font-quick font-bold text-2xl text-neutral-900">Profil Toko</h1><p className="font-sans text-sm text-neutral-500 mt-1">Kelola informasi toko dan rekening bank Anda</p></div>
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <div className="flex items-center gap-3 mb-6"><Store className="w-5 h-5 text-c-blue"/><h2 className="font-quick font-bold text-lg text-neutral-900">Informasi Toko</h2></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5"><label className="text-sm font-sans font-medium text-neutral-700">Nama Toko</label><input value={vendorName} onChange={(e) => setVendorName(e.target.value)} className="w-full px-3 py-2.5 h-11 border border-neutral-200 rounded-lg bg-white font-sans text-base focus:outline-none focus:border-c-blue focus:ring-2 focus:ring-c-blue/15"/></div>
              <div className="flex flex-col gap-1.5"><label className="text-sm font-sans font-medium text-neutral-700">Email</label><input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2.5 h-11 border border-neutral-200 rounded-lg bg-white font-sans text-base focus:outline-none focus:border-c-blue focus:ring-2 focus:ring-c-blue/15"/></div>
              <div className="flex flex-col gap-1.5"><label className="text-sm font-sans font-medium text-neutral-700">No. WhatsApp</label><input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2.5 h-11 border border-neutral-200 rounded-lg bg-white font-sans text-base focus:outline-none focus:border-c-blue focus:ring-2 focus:ring-c-blue/15"/></div>
              <div className="flex flex-col gap-1.5"><label className="text-sm font-sans font-medium text-neutral-700">Kota</label><input value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-3 py-2.5 h-11 border border-neutral-200 rounded-lg bg-white font-sans text-base focus:outline-none focus:border-c-blue focus:ring-2 focus:ring-c-blue/15"/></div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <div className="flex items-center gap-3 mb-6"><CreditCard className="w-5 h-5 text-c-blue"/><h2 className="font-quick font-bold text-lg text-neutral-900">Informasi Rekening</h2></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5"><label className="text-sm font-sans font-medium text-neutral-700">Nama Bank</label><select value={bankName} onChange={(e) => setBankName(e.target.value)} className="w-full px-3 py-2.5 h-11 border border-neutral-200 rounded-lg bg-white font-sans text-base focus:outline-none focus:border-c-blue"><option>BCA</option><option>Mandiri</option></select></div>
              <div className="flex flex-col gap-1.5"><label className="text-sm font-sans font-medium text-neutral-700">Nomor Rekening</label><input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="w-full px-3 py-2.5 h-11 border border-neutral-200 rounded-lg bg-white font-sans text-base focus:outline-none focus:border-c-blue focus:ring-2 focus:ring-c-blue/15"/></div>
              <div className="flex flex-col gap-1.5 sm:col-span-2"><label className="text-sm font-sans font-medium text-neutral-700">Nama Pemilik Rekening</label><input value={accountName} onChange={(e) => setAccountName(e.target.value)} className="w-full px-3 py-2.5 h-11 border border-neutral-200 rounded-lg bg-white font-sans text-base focus:outline-none focus:border-c-blue focus:ring-2 focus:ring-c-blue/15"/></div>
            </div>
          </div>
          <button onClick={handleSave} className="inline-flex items-center gap-2 bg-c-blue text-white font-quick font-semibold text-sm px-6 py-3 rounded-lg min-h-[44px] hover:bg-c-blue/90 active:scale-[0.98] transition-all"><Save className="w-4 h-4"/>Simpan Perubahan</button>
        </div>
      </div>
    </>
  );
}
