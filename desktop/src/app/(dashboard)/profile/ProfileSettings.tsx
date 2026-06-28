"use client";
import React from 'react';

export default function ProfileSettings() {
  const handleSettingsClick = (fitur: string) => {
    alert(`Pengaturan ${fitur} sedang dalam tahap pengembangan.`);
  };

  return (
    <div className="glass-card rounded-3xl overflow-hidden border border-outline-variant divide-y divide-outline-variant/50">
      <button onClick={() => handleSettingsClick('Keamanan & Password')} className="w-full text-left p-6 hover:bg-primary/5 transition-colors cursor-pointer flex items-center justify-between group">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined">security</span>
          </div>
          <div>
            <p className="font-body-lg text-body-lg text-on-surface">Keamanan & Password</p>
            <p className="font-body-md text-body-md text-on-surface-variant">Update password, 2FA, dan biometrik</p>
          </div>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
      </button>

      <button onClick={() => handleSettingsClick('Notifikasi')} className="w-full text-left p-6 hover:bg-primary/5 transition-colors cursor-pointer flex items-center justify-between group">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined">notifications_active</span>
          </div>
          <div>
            <p className="font-body-lg text-body-lg text-on-surface">Notifikasi</p>
            <p className="font-body-md text-body-md text-on-surface-variant">Atur pengingat iuran dan info SHU</p>
          </div>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
      </button>

      <button onClick={() => handleSettingsClick('Metode Pembayaran')} className="w-full text-left p-6 hover:bg-primary/5 transition-colors cursor-pointer flex items-center justify-between group">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined">payments</span>
          </div>
          <div>
            <p className="font-body-lg text-body-lg text-on-surface">Metode Pembayaran</p>
            <p className="font-body-md text-body-md text-on-surface-variant">Kelola bank, e-wallet, dan kartu debit</p>
          </div>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
      </button>

      <button onClick={() => handleSettingsClick('Hubungan Keluarga')} className="w-full text-left p-6 hover:bg-primary/5 transition-colors cursor-pointer flex items-center justify-between group">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined">diversity_3</span>
          </div>
          <div>
            <p className="font-body-lg text-body-lg text-on-surface">Hubungan Keluarga</p>
            <p className="font-body-md text-body-md text-on-surface-variant">Tautkan akun keluarga untuk benefit grup</p>
          </div>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
      </button>
    </div>
  );
}
