"use client";
import React, { useState } from 'react';

export default function ProfileSettings() {
  const [isSecurityExpanded, setIsSecurityExpanded] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'error' | 'success', text: string} | null>(null);

  const handleSettingsClick = (fitur: string) => {
    alert(`Pengaturan ${fitur} sedang dalam tahap pengembangan.`);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Password baru tidak cocok!' });
      return;
    }
    setLoading(true);
    // Mock API Call
    setTimeout(() => {
      setLoading(false);
      setMessage({ type: 'success', text: 'Password berhasil diperbarui.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setMessage(null), 3000);
    }, 1000);
  };

  return (
    <div className="glass-card rounded-3xl overflow-hidden border border-outline-variant divide-y divide-outline-variant/50">
      
      {/* Keamanan & Password (Expandable) */}
      <div className="group">
        <button 
          onClick={() => setIsSecurityExpanded(!isSecurityExpanded)} 
          className="w-full text-left p-6 hover:bg-primary/5 transition-colors cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">security</span>
            </div>
            <div>
              <p className="font-body-lg text-body-lg text-on-surface">Keamanan & Password</p>
              <p className="font-body-md text-body-md text-on-surface-variant">Update password, 2FA, dan biometrik</p>
            </div>
          </div>
          <span className={`material-symbols-outlined text-on-surface-variant transition-transform ${isSecurityExpanded ? 'rotate-90' : 'group-hover:translate-x-1'}`}>
            chevron_right
          </span>
        </button>
        
        {/* Expanded Form */}
        {isSecurityExpanded && (
          <div className="px-6 pb-6 pt-2 animate-fade-in">
            <div className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/30">
              <h4 className="font-headline-sm text-on-surface mb-4">Ganti Password</h4>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant">Password Saat Ini</label>
                  <input 
                    type="password" 
                    required 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-surface-container-highest border border-outline rounded-lg text-sm text-on-surface focus:border-primary outline-none transition-colors"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface-variant">Password Baru</label>
                    <input 
                      type="password" 
                      required 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 bg-surface-container-highest border border-outline rounded-lg text-sm text-on-surface focus:border-primary outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface-variant">Konfirmasi Password Baru</label>
                    <input 
                      type="password" 
                      required 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 bg-surface-container-highest border border-outline rounded-lg text-sm text-on-surface focus:border-primary outline-none transition-colors"
                    />
                  </div>
                </div>
                
                {message && (
                  <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${message.type === 'error' ? 'bg-error/10 text-error border border-error/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                    <span className="material-symbols-outlined text-sm">{message.type === 'error' ? 'error' : 'check_circle'}</span>
                    {message.text}
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="px-6 py-2 bg-primary text-on-primary font-bold rounded-xl text-sm hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center gap-2"
                  >
                    {loading ? <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span> : null}
                    Simpan Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

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
