"use client";
import React, { useState } from 'react';

export default function ProfileSettings() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  // Password form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'error' | 'success', text: string} | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
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

  const renderUnderDevelopment = () => (
    <div className="px-6 pb-6 pt-2 animate-fade-in">
      <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/30 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
          <span className="material-symbols-outlined text-primary text-2xl">construction</span>
        </div>
        <h4 className="font-headline-sm text-on-surface">Sedang Dikembangkan</h4>
        <p className="text-sm text-on-surface-variant mt-1">Fitur ini akan segera hadir pada pembaruan berikutnya.</p>
      </div>
    </div>
  );

  return (
    <div className="glass-card rounded-3xl overflow-hidden border border-outline-variant divide-y divide-outline-variant/50">
      
      {/* Keamanan & Password */}
      <div className="group">
        <button 
          onClick={() => toggleSection('security')} 
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
          <span className={`material-symbols-outlined text-on-surface-variant transition-transform ${expandedSection === 'security' ? 'rotate-90' : 'group-hover:translate-x-1'}`}>
            chevron_right
          </span>
        </button>
        
        {expandedSection === 'security' && (
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

      {/* Notifikasi */}
      <div className="group">
        <button onClick={() => toggleSection('notifications')} className="w-full text-left p-6 hover:bg-primary/5 transition-colors cursor-pointer flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">notifications_active</span>
            </div>
            <div>
              <p className="font-body-lg text-body-lg text-on-surface">Notifikasi</p>
              <p className="font-body-md text-body-md text-on-surface-variant">Atur pengingat iuran dan info SHU</p>
            </div>
          </div>
          <span className={`material-symbols-outlined text-on-surface-variant transition-transform ${expandedSection === 'notifications' ? 'rotate-90' : 'group-hover:translate-x-1'}`}>chevron_right</span>
        </button>
        {expandedSection === 'notifications' && renderUnderDevelopment()}
      </div>

      {/* Metode Pembayaran */}
      <div className="group">
        <button onClick={() => toggleSection('payments')} className="w-full text-left p-6 hover:bg-primary/5 transition-colors cursor-pointer flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <div>
              <p className="font-body-lg text-body-lg text-on-surface">Metode Pembayaran</p>
              <p className="font-body-md text-body-md text-on-surface-variant">Kelola bank, e-wallet, dan kartu debit</p>
            </div>
          </div>
          <span className={`material-symbols-outlined text-on-surface-variant transition-transform ${expandedSection === 'payments' ? 'rotate-90' : 'group-hover:translate-x-1'}`}>chevron_right</span>
        </button>
        {expandedSection === 'payments' && renderUnderDevelopment()}
      </div>

      {/* Hubungan Keluarga */}
      <div className="group">
        <button onClick={() => toggleSection('family')} className="w-full text-left p-6 hover:bg-primary/5 transition-colors cursor-pointer flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">diversity_3</span>
            </div>
            <div>
              <p className="font-body-lg text-body-lg text-on-surface">Hubungan Keluarga</p>
              <p className="font-body-md text-body-md text-on-surface-variant">Tautkan akun keluarga untuk benefit grup</p>
            </div>
          </div>
          <span className={`material-symbols-outlined text-on-surface-variant transition-transform ${expandedSection === 'family' ? 'rotate-90' : 'group-hover:translate-x-1'}`}>chevron_right</span>
        </button>
        {expandedSection === 'family' && renderUnderDevelopment()}
      </div>
    </div>
  );
}
