"use client";

import React, { useState } from "react";

// Types
interface Mission {
  id: string;
  title: string;
  points: number;
  completed: boolean;
  category: "daily" | "weekly";
}

interface ShopItem {
  id: string;
  title: string;
  description: string;
  cost: number;
  ownedCount: number;
  icon: string;
  color: string;
  bgGlow: string;
}

interface HistoryItem {
  id: string;
  opponent: string;
  result: "Menang" | "Kalah";
  pointsAdded: number;
}

export default function DesktopDashboard() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<"home" | "misi" | "battle" | "koperasi" | "profil">("home");

  // Core User State
  const [points, setPoints] = useState<number>(1350);
  const [streak, setStreak] = useState<number>(14);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Weekly streak checklist
  const [streakDays, setStreakDays] = useState({
    Sen: true,
    Sel: true,
    Rab: true,
    Kam: true,
    Jum: false,
    Sab: false,
    Min: false,
  });

  // Missions state
  const [missions, setMissions] = useState<Mission[]>([
    { id: "d1", title: "Belanja hari ini", points: 20, completed: true, category: "daily" },
    { id: "d2", title: "Hadir RAT", points: 50, completed: false, category: "daily" },
    { id: "d3", title: "Baca berita koperasi", points: 15, completed: false, category: "daily" },
    { id: "d4", title: "Isi Survey Anggota", points: 15, completed: false, category: "daily" },
    { id: "w1", title: "Hadiri Rapat Anggota Tahunan (RAT)", points: 120, completed: false, category: "weekly" },
    { id: "w2", title: "Ajak Anggota Baru Bergabung", points: 200, completed: false, category: "weekly" },
  ]);

  // Shop Items State
  const [shopItems, setShopItems] = useState<ShopItem[]>([
    {
      id: "item1",
      title: "Freeze Streak",
      description: "Bekukan streak lawan selama 1 ronde",
      cost: 200,
      ownedCount: 2,
      icon: "ac_unit",
      color: "text-teal-400",
      bgGlow: "rgba(45, 212, 191, 0.1)",
    },
    {
      id: "item2",
      title: "Point Bomb",
      description: "Kurangi 50 poin lawan minggu ini",
      cost: 350,
      ownedCount: 0,
      icon: "bomb",
      color: "text-pink-500",
      bgGlow: "rgba(244, 63, 94, 0.1)",
    },
    {
      id: "item3",
      title: "Streak Shield",
      description: "Proteksi Streak dari Freeze Streak lawan",
      cost: 150,
      ownedCount: 0,
      icon: "shield",
      color: "text-orange-400",
      bgGlow: "rgba(251, 146, 60, 0.1)",
    },
    {
      id: "item4",
      title: "Poin Booster",
      description: "2x poin dari semua quest hari ini",
      cost: 500,
      ownedCount: 1,
      icon: "rocket_launch",
      color: "text-purple-400",
      bgGlow: "rgba(192, 132, 252, 0.1)",
    },
  ]);

  // Battle State
  const [userWinRate, setUserWinRate] = useState<number>(62);
  const [battleStats, setBattleStats] = useState({
    userPoints: 1240,
    opponentPoints: 980,
    userTxCount: 8,
    opponentTxCount: 5,
    userMissions: 12,
    opponentMissions: 9,
    userSavings: 8250000,
    opponentSavings: 6100000,
    userEvents: 2,
    opponentEvents: 1,
  });

  const [historyList] = useState<HistoryItem[]>([
    { id: "h1", opponent: "Siti Maenah", result: "Menang", pointsAdded: 150 },
    { id: "h2", opponent: "Roland Sihombing", result: "Menang", pointsAdded: 150 },
    { id: "h3", opponent: "Ahmad Fauzi", result: "Kalah", pointsAdded: 50 },
    { id: "h4", opponent: "Andreas Kurniawan", result: "Menang", pointsAdded: 150 },
  ]);

  // Governance Voting State
  const [voteSelection, setVoteSelection] = useState<"Setuju" | "Tidak Setuju" | null>(null);

  // Helper trigger toast message
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Toggle mission completion
  const handleToggleMission = (id: string) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextCompleted = !m.completed;
          const pointsDiff = nextCompleted ? m.points : -m.points;
          setPoints((p) => p + pointsDiff);
          triggerToast(
            nextCompleted
              ? `Misi "${m.title}" selesai! +${m.points} Poin`
              : `Batal menyelesaikan "${m.title}". Poin berkurang ${m.points}`
          );
          return { ...m, completed: nextCompleted };
        }
        return m;
      })
    );
  };

  // Buy Shop Item
  const handleBuyItem = (item: ShopItem) => {
    if (points >= item.cost) {
      setPoints((p) => p - item.cost);
      setShopItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, ownedCount: i.ownedCount + 1 } : i))
      );
      triggerToast(`Berhasil membeli ${item.title}! -${item.cost} Poin`);
    } else {
      triggerToast(`⚠️ Poin tidak mencukupi untuk membeli ${item.title}`);
    }
  };

  // Use Item in Battle Arena
  const handleUseItemInBattle = (item: ShopItem) => {
    if (item.ownedCount > 0) {
      setShopItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, ownedCount: i.ownedCount - 1 } : i))
      );
      
      // Calculate effect based on item type
      let rateBump = 0;
      let logMsg = "";
      if (item.id === "item1") {
        // Freeze streak reduces opponent win rate, bumping user win rate
        rateBump = 8;
        logMsg = `Menggunakan Freeze Streak! Streak lawan beku, win rate bertambah +8%`;
      } else if (item.id === "item2") {
        // Point bomb gives a large bump
        rateBump = 12;
        logMsg = `Meledakkan Point Bomb! Point Budi berkurang, win rate kamu naik +12%`;
      } else if (item.id === "item3") {
        // Shield
        rateBump = 3;
        logMsg = `Streak Shield diaktifkan! Win rate naik +3%`;
      } else if (item.id === "item4") {
        // Booster
        rateBump = 15;
        logMsg = `Poin Booster digunakan! Peluang menang melejit +15%`;
      }

      setUserWinRate((current) => Math.min(100, current + rateBump));
      triggerToast(logMsg);
    } else {
      triggerToast(`⚠️ Kamu tidak memiliki item ${item.title}. Beli di Toko Misi.`);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0b0f19] text-[#f8fafc] overflow-hidden">
      
      {/* Toast Notification Alert Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-[#1e293b] border-l-4 border-yellow-400 py-3 px-5 rounded-md shadow-2xl animate-bounce">
          <span className="material-symbols-outlined text-yellow-400">info</span>
          <p className="text-sm font-semibold">{toastMessage}</p>
        </div>
      )}

      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="w-80 border-r border-slate-800 bg-[#0e1422] flex flex-col justify-between p-6 shrink-0 relative z-30">
        <div className="space-y-8">
          
          {/* Logo & Cooperative Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="material-symbols-outlined text-gray-900 font-bold">account_balance</span>
            </div>
            <div>
              <h2 className="font-extrabold text-lg leading-tight tracking-tight">KOPDES SUKAMAJU</h2>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Koperasi Merah Putih</span>
            </div>
          </div>

          {/* Quick Profile Summary Card */}
          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80 flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-700 text-white font-bold text-base rounded-full flex items-center justify-center border-2 border-slate-600">
              AS
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-white truncate">Agung</h4>
                <span className="text-[9px] bg-yellow-400/10 text-yellow-400 font-bold px-1.5 py-0.5 rounded border border-yellow-400/20">Emas</span>
              </div>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">KMP-DSKMJ-2021-0041</p>
              <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-orange-400 font-bold">
                <span className="material-symbols-outlined text-[12px]">local_fire_department</span>
                <span>{streak} Hari Streak</span>
              </div>
            </div>
          </div>

          {/* Nav Items List */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setCurrentTab("home")}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all ${
                currentTab === "home"
                  ? "bg-slate-800 text-yellow-400 shadow-md border-l-2 border-yellow-400"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/40"
              }`}
            >
              <span className="material-symbols-outlined text-lg">home</span>
              <span>Beranda Utama</span>
            </button>
            
            <button
              onClick={() => setCurrentTab("misi")}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all ${
                currentTab === "misi"
                  ? "bg-slate-800 text-yellow-400 shadow-md border-l-2 border-yellow-400"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/40"
              }`}
            >
              <span className="material-symbols-outlined text-lg">assignment</span>
              <div className="flex justify-between items-center w-full">
                <span>Misi & Toko Item</span>
                <span className="text-[10px] bg-yellow-400 text-gray-900 font-black px-1.5 py-0.5 rounded-full">Toko</span>
              </div>
            </button>

            <button
              onClick={() => setCurrentTab("battle")}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all ${
                currentTab === "battle"
                  ? "bg-slate-800 text-yellow-400 shadow-md border-l-2 border-yellow-400"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/40"
              }`}
            >
              <span className="material-symbols-outlined text-lg">swords</span>
              <div className="flex justify-between items-center w-full">
                <span>Arena Bertanding</span>
                <span className="text-[9px] bg-red-500 text-white font-bold px-1.5 py-0.5 rounded">BETA</span>
              </div>
            </button>

            <button
              onClick={() => setCurrentTab("koperasi")}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all ${
                currentTab === "koperasi"
                  ? "bg-slate-800 text-yellow-400 shadow-md border-l-2 border-yellow-400"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/40"
              }`}
            >
              <span className="material-symbols-outlined text-lg">account_balance</span>
              <span>Tata Kelola (Koperasi)</span>
            </button>

            <button
              onClick={() => setCurrentTab("profil")}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all ${
                currentTab === "profil"
                  ? "bg-slate-800 text-yellow-400 shadow-md border-l-2 border-yellow-400"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/40"
              }`}
            >
              <span className="material-symbols-outlined text-lg">person</span>
              <span>Profil Pengguna</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer: Points Summary */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="bg-[#151c2e] p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block">Saldo Poin</span>
              <span className="text-xl font-extrabold text-yellow-400">{points.toLocaleString()} <span className="text-xs font-bold">Poin</span></span>
            </div>
            <div className="w-9 h-9 rounded-full bg-yellow-400/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-yellow-400">stars</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN DASHBOARD CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Desktop Bar */}
        <header className="h-16 border-b border-slate-800 bg-[#0e1422]/60 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-lg font-bold">
              {currentTab === "home" && "Dashboard Beranda"}
              {currentTab === "misi" && "Misi, Ranking & Toko Terpadu"}
              {currentTab === "battle" && "Battle Arena Mingguan"}
              {currentTab === "koperasi" && "Governance & Transparansi Koperasi"}
              {currentTab === "profil" && "Profil Anggota & Pengaturan"}
            </h1>
          </div>
          <div className="flex items-center gap-6">
            
            {/* Quick Stat Indicators */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-xs">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full border border-slate-900 animate-pulse"></span>
              <span className="text-slate-400 font-medium">Status: Anggota Aktif</span>
            </div>
            
            <div className="relative cursor-pointer">
              <span className="material-symbols-outlined text-slate-400 hover:text-slate-200">notifications</span>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
          </div>
        </header>

        {/* Dynamic Inner Tab Views */}
        <div className="p-8 max-w-7xl w-full mx-auto space-y-8 flex-1">

          {/* ================= TAB: HOME ================= */}
          {currentTab === "home" && (
            <div className="space-y-6">
              
              {/* Row 1: Greeting & Title Banner */}
              <div className="bg-gradient-to-r from-slate-900 to-[#172237] border border-slate-800 rounded-2xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-black">Selamat Datang kembali, Agung!</h2>
                  <p className="text-slate-400 text-sm mt-1">Status Keanggotaan Anda sangat baik. Mari capai Platinum bulan ini!</p>
                </div>
                <div className="flex items-center gap-3 bg-yellow-400/10 px-4 py-2 border border-yellow-400/20 rounded-xl text-yellow-400">
                  <span className="text-xl">🔥</span>
                  <span className="font-extrabold text-sm">{streak} Hari Streak Beruntun!</span>
                </div>
              </div>

              {/* Row 2: Grid for Savings and Points */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Savings Summary Card */}
                <div className="glass-panel card-glow-blue rounded-2xl overflow-hidden flex flex-col justify-between col-span-1 lg:col-span-2">
                  <div className="bg-[#4a5568] px-6 py-4 flex justify-between items-center">
                    <h3 className="text-xs uppercase font-extrabold tracking-widest text-slate-200">TOTAL SIMPANAN KOPERASI</h3>
                    <span className="material-symbols-outlined text-slate-300 text-sm">savings</span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between gap-6">
                    <div>
                      <span className="text-slate-400 text-xs font-semibold">Saldo Terkonsolidasi</span>
                      <h2 className="text-3xl font-black text-white mt-1">Rp 8.754.000,00</h2>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 border-t border-slate-800/80 pt-6">
                      <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Simpanan Pokok</p>
                        <p className="text-xs font-bold text-slate-200 mt-1">Rp 750.000</p>
                      </div>
                      <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Simpanan Wajib</p>
                        <p className="text-xs font-bold text-slate-200 mt-1">Rp 750.000</p>
                      </div>
                      <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Simpanan Sukarela</p>
                        <p className="text-xs font-bold text-slate-200 mt-1">Rp 7.254.000</p>
                      </div>
                    </div>

                    <div>
                      <button className="flex items-center gap-2 border border-slate-700 hover:border-slate-500 px-4 py-2 rounded-xl text-slate-300 text-xs font-bold hover:bg-slate-800 transition-colors">
                        <span>Lihat Riwayat Mutasi</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Saldo Poin Progress Card */}
                <div className="glass-panel card-glow-gold rounded-2xl p-6 flex flex-col justify-between bg-gradient-to-br from-[#1e2310] to-[#0e1422]">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs uppercase font-extrabold tracking-widest text-yellow-400">SALDO POIN</h3>
                    <span className="bg-yellow-400/20 text-yellow-400 text-[10px] font-extrabold px-3 py-1 rounded-full border border-yellow-400/20">Emas</span>
                  </div>

                  <div className="flex items-center gap-4 my-2">
                    <div className="text-yellow-400">
                      <span className="material-symbols-outlined text-5xl">stars</span>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-yellow-400">{points.toLocaleString()}</span>
                        <span className="text-sm font-bold text-yellow-400">Poin</span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400">Tingkat Anggota Emas</p>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-slate-800 pt-6">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                      <span>{1500 - points > 0 ? `${1500 - points} Poin lagi ke Platinum` : "Platinum Tercapai!"}</span>
                      <span>{points} / 1.500</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                      <div className="h-full bg-yellow-400" style={{ width: `${Math.min(100, (points / 1500) * 100)}%` }}></div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Row 3: Missions, Stats Preview, and Announcements */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Missions Preview */}
                <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-slate-300">Misi Hari Ini</h3>
                      <span className="text-[10px] text-yellow-400 font-bold">+100 Poin Tersedia</span>
                    </div>
                    <ul className="space-y-4">
                      {missions.filter(m => m.category === "daily").slice(0, 3).map((mission) => (
                        <li key={mission.id} className="flex items-center justify-between bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/80">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleToggleMission(mission.id)}
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                mission.completed
                                  ? "bg-lime-500 border-lime-500 text-white"
                                  : "border-slate-500 hover:border-yellow-400"
                              }`}
                            >
                              {mission.completed && <span className="material-symbols-outlined text-xs font-black">check</span>}
                            </button>
                            <span className={`text-xs font-semibold ${mission.completed ? "text-slate-500 line-through" : "text-slate-300"}`}>
                              {mission.title}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-yellow-400">+{mission.points}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-4 border-t border-slate-800/80 mt-6">
                    <button onClick={() => setCurrentTab("misi")} className="text-yellow-400 text-xs font-bold flex items-center gap-1 hover:underline">
                      <span>Kelola Semua Misi</span>
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </button>
                  </div>
                </div>

                {/* Cooperative Today Stats Summary */}
                <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between bg-gradient-to-br from-[#1c2433]/40 to-[#0e1422]">
                  <div>
                    <h3 className="font-bold text-slate-300 mb-6">Koperasi Hari Ini</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#121926]/80 p-3.5 rounded-xl border border-slate-800">
                        <span className="material-symbols-outlined text-slate-500 text-base">swap_horiz</span>
                        <p className="text-xl font-black text-slate-200 mt-1">37</p>
                        <p className="text-[9px] font-bold text-slate-500">Transaksi</p>
                      </div>
                      <div className="bg-[#121926]/80 p-3.5 rounded-xl border border-slate-800">
                        <span className="material-symbols-outlined text-slate-500 text-base">attach_money</span>
                        <p className="text-sm font-black text-slate-200 mt-1 truncate">Rp 14,53 Jt</p>
                        <p className="text-[9px] font-bold text-slate-500">Omzet Harian</p>
                      </div>
                      <div className="bg-[#121926]/80 p-3.5 rounded-xl border border-slate-800">
                        <span className="material-symbols-outlined text-slate-500 text-base">groups</span>
                        <p className="text-xl font-black text-slate-200 mt-1">8</p>
                        <p className="text-[9px] font-bold text-slate-500">Anggota Baru</p>
                      </div>
                      <div className="bg-[#121926]/80 p-3.5 rounded-xl border border-slate-800">
                        <span className="material-symbols-outlined text-slate-500 text-base">storefront</span>
                        <p className="text-xl font-black text-slate-200 mt-1">12</p>
                        <p className="text-[9px] font-bold text-slate-500">UMKM Aktif</p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-800/80 mt-6">
                    <button onClick={() => setCurrentTab("koperasi")} className="text-yellow-400 text-xs font-bold flex items-center gap-1 hover:underline">
                      <span>Statistik & Governance</span>
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </button>
                  </div>
                </div>

                {/* Announcement Widget */}
                <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between bg-[#2a3447]/30">
                  <div>
                    <h3 className="font-bold text-slate-300 mb-4">Pengumuman</h3>
                    <div className="space-y-3">
                      <div className="bg-[#1e293b]/70 p-4 rounded-xl border border-slate-800 shadow-inner">
                        <h4 className="font-bold text-xs text-white leading-tight">RAT Buku 2025 - Hadiri & Dukung Koperasi</h4>
                        <p className="text-[9px] text-slate-400 font-medium mt-1">Pelaksanaan: 15 Juli 2026</p>
                      </div>
                      <div className="bg-[#1e293b]/70 p-4 rounded-xl border border-slate-800 shadow-inner">
                        <h4 className="font-bold text-xs text-white leading-tight">Pembagian SHU Tahun Buku 2024 Bagi Seluruh Anggota...</h4>
                        <p className="text-[9px] text-slate-400 font-medium mt-1">Pelaksanaan: 1 Juli 2026</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 text-center font-medium pt-3 mt-4 border-t border-slate-800/80">
                    Sistem Pembaruan Otomatis
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ================= TAB: MISI & TOKO ================= */}
          {currentTab === "misi" && (
            <div className="space-y-6">

              {/* Row 1: Weekly streak card */}
              <div className="glass-panel rounded-2xl p-6 bg-gradient-to-r from-[#172132] to-[#121926] border border-slate-800">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-bold">Streak Mingguan</h3>
                    <p className="text-xs text-slate-400 mt-1">Pertahankan streak login dan transaksi! Bonus +50 poin menanti di akhir minggu.</p>
                  </div>
                  <div className="bg-[#1e293b] px-4 py-2 border border-slate-700 rounded-xl flex items-center gap-2">
                    <span className="material-symbols-outlined text-orange-400 text-lg">bolt</span>
                    <span className="text-yellow-400 font-extrabold text-base">{streak} Hari</span>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-3">
                  {Object.entries(streakDays).map(([day, isDone]) => (
                    <div key={day} className="flex flex-col items-center gap-2 bg-[#0e1422]/60 p-3.5 rounded-xl border border-slate-800">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                        day === "Kam"
                          ? "bg-lime-500 border-lime-500 shadow-md shadow-lime-500/20"
                          : isDone
                          ? "bg-lime-950/60 border-lime-800 text-lime-400"
                          : "border-slate-800 opacity-40"
                      }`}>
                        {day === "Kam" ? (
                          <span className="material-symbols-outlined text-white text-xl">local_fire_department</span>
                        ) : isDone ? (
                          <span className="material-symbols-outlined text-xs">check_circle</span>
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">{day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 2: Daily & Weekly Missions checklists */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Daily list */}
                <div className="glass-panel rounded-2xl p-6">
                  <h3 className="font-bold text-slate-200 text-base mb-4 flex items-center justify-between">
                    <span>Misi Harian</span>
                    <span className="text-xs bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-2.5 py-0.5 rounded-full">
                      Poin Instan
                    </span>
                  </h3>
                  
                  <div className="space-y-3">
                    {missions.filter(m => m.category === "daily").map((mission) => (
                      <div key={mission.id} className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleToggleMission(mission.id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              mission.completed
                                ? "bg-lime-500 border-lime-500 text-white"
                                : "border-slate-600 hover:border-yellow-400"
                            }`}
                          >
                            {mission.completed && <span className="material-symbols-outlined text-xs font-black">check</span>}
                          </button>
                          <span className={`text-sm font-semibold ${mission.completed ? "text-slate-500 line-through" : "text-slate-300"}`}>
                            {mission.title}
                          </span>
                        </div>
                        <span className="text-xs font-black text-yellow-400">+{mission.points} Poin</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weekly list */}
                <div className="glass-panel rounded-2xl p-6">
                  <h3 className="font-bold text-slate-200 text-base mb-4 flex items-center justify-between">
                    <span>Misi Mingguan</span>
                    <span className="text-xs bg-purple-400/10 text-purple-400 border border-purple-400/20 px-2.5 py-0.5 rounded-full">
                      Hadiah Besar
                    </span>
                  </h3>

                  <div className="space-y-3">
                    {missions.filter(m => m.category === "weekly").map((mission) => (
                      <div key={mission.id} className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleToggleMission(mission.id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              mission.completed
                                ? "bg-lime-500 border-lime-500 text-white"
                                : "border-slate-600 hover:border-purple-400"
                            }`}
                          >
                            {mission.completed && <span className="material-symbols-outlined text-xs font-black">check</span>}
                          </button>
                          <span className={`text-sm font-semibold ${mission.completed ? "text-slate-500 line-through" : "text-slate-300"}`}>
                            {mission.title}
                          </span>
                        </div>
                        <span className="text-xs font-black text-purple-400">+{mission.points} Poin</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Row 3: Shop & Achievements */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Shop Container (Col span 2) */}
                <div className="glass-panel rounded-2xl p-6 xl:col-span-2 space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-bold">Toko Item Terpadu</h3>
                      <p className="text-xs text-slate-400">Tukar poin dengan power-up untuk mengungguli rival di Battle Arena.</p>
                    </div>
                    <div className="text-xs bg-slate-900 py-1.5 px-3 rounded-lg border border-slate-800 font-bold">
                      Saldo: <span className="text-yellow-400 font-black">{points}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {shopItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between gap-4 transition-all hover:bg-slate-900/70"
                        style={{ boxShadow: `0 0 15px ${item.bgGlow}` }}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2.5 rounded-xl bg-slate-800 ${item.color} flex items-center justify-center shrink-0`}>
                            <span className="material-symbols-outlined text-xl">{item.icon}</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-slate-200">{item.title}</h4>
                            <p className="text-[10px] text-slate-500 leading-normal mt-0.5">{item.description}</p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-slate-800/60">
                          <div className="flex items-center gap-1">
                            <span className="text-[11px] text-slate-500 font-bold">Miliki:</span>
                            <span className="text-xs font-extrabold text-slate-300">{item.ownedCount}x</span>
                          </div>
                          
                          <button
                            onClick={() => handleBuyItem(item)}
                            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 text-yellow-400 hover:text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-xs">shopping_cart</span>
                            <span>{item.cost} Poin</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements Container (Col span 1) */}
                <div className="glass-panel rounded-2xl p-6 space-y-6">
                  <div>
                    <h3 className="text-base font-bold">Penghargaan</h3>
                    <p className="text-xs text-slate-400">Prestasi anggota yang berhasil diraih.</p>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 text-yellow-400 flex items-center justify-center">
                        <span className="material-symbols-outlined text-lg">savings</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-white">Investor Desa</h4>
                        <p className="text-[10px] text-slate-500">Telah menabung Rp 5.000.000</p>
                      </div>
                    </div>

                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center gap-3 opacity-60">
                      <div className="w-10 h-10 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center">
                        <span className="material-symbols-outlined text-lg">local_fire_department</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-white">Loyal Streak</h4>
                        <p className="text-[10px] text-slate-500">Capai 30 Hari Streak (Belum)</p>
                      </div>
                    </div>

                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center gap-3 opacity-60">
                      <div className="w-10 h-10 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center">
                        <span className="material-symbols-outlined text-lg">storefront</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-white">UMKM Hero</h4>
                        <p className="text-[10px] text-slate-500">100 Produk UMKM Terjual (Belum)</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ================= TAB: BATTLE ARENA ================= */}
          {currentTab === "battle" && (
            <div className="space-y-6">

              {/* Battle Overview Container */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Active Battle Card (Col span 2) */}
                <div className="glass-panel card-glow-red rounded-3xl overflow-hidden lg:col-span-2 flex flex-col justify-between">
                  <div className="bg-[#4a5568] px-6 py-4 flex justify-between items-center">
                    <div>
                      <h3 className="text-xs uppercase font-extrabold tracking-widest text-slate-200">BATTLE MINGGU INI</h3>
                      <p className="text-[9px] text-slate-300 font-bold mt-0.5">Reset setiap hari Senin pukul 00:00</p>
                    </div>
                    <span className="material-symbols-outlined text-red-400 animate-pulse text-lg">swords</span>
                  </div>

                  <div className="p-6 space-y-8 flex-grow">
                    
                    {/* VS Avatar Area */}
                    <div className="flex justify-between items-center px-6">
                      
                      {/* Player 1: User */}
                      <div className="text-center space-y-2">
                        <div className="w-20 h-20 bg-slate-800 text-yellow-400 font-extrabold text-2xl rounded-full flex items-center justify-center border-4 border-yellow-400 shadow-xl shadow-yellow-500/10 mx-auto">
                          AS
                        </div>
                        <div>
                          <p className="font-black text-sm text-white">Agung (Kamu)</p>
                          <span className="text-[10px] text-slate-400 font-bold">{battleStats.userPoints} Poin</span>
                        </div>
                      </div>

                      {/* VS Center Divider */}
                      <div className="text-center">
                        <span className="text-2xl font-black italic opacity-25">VS</span>
                      </div>

                      {/* Player 2: Opponent */}
                      <div className="text-center space-y-2">
                        <div className="w-20 h-20 bg-slate-800 text-slate-300 font-extrabold text-2xl rounded-full flex items-center justify-center border-4 border-slate-700 shadow-xl mx-auto">
                          BW
                        </div>
                        <div>
                          <p className="font-black text-sm text-white">Budi</p>
                          <span className="text-[10px] text-slate-400 font-bold">{battleStats.opponentPoints} Poin</span>
                        </div>
                      </div>

                    </div>

                    {/* Progress Bar win rates */}
                    <div className="space-y-2 bg-slate-950/40 p-4 rounded-xl border border-slate-850">
                      <div className="flex justify-between text-xs font-black uppercase tracking-wider">
                        <span className="text-red-400">Peluang Menang: {userWinRate}%</span>
                        <span className="text-blue-400">Lawan: {100 - userWinRate}%</span>
                      </div>
                      <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden flex">
                        <div className="h-full bg-red-500 transition-all duration-700 ease-out" style={{ width: `${userWinRate}%` }}></div>
                        <div className="h-full bg-blue-500 transition-all duration-700 ease-out" style={{ width: `${100 - userWinRate}%` }}></div>
                      </div>
                      <p className="text-[9px] text-slate-500 text-center font-bold">Probabilitas dikalkulasi dari aktivitas mingguan real-time</p>
                    </div>

                    {/* Compare stats */}
                    <div className="bg-[#1e293b]/50 border border-slate-800 rounded-xl overflow-hidden">
                      <div className="grid grid-cols-3 bg-slate-900/60 p-3 border-b border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                        <div className="text-left pl-3">Metrik Aktivitas</div>
                        <div>Kamu (Agung)</div>
                        <div className="text-right pr-3">Lawan (Budi)</div>
                      </div>

                      <div className="divide-y divide-slate-850 text-xs">
                        <div className="grid grid-cols-3 p-3 text-center">
                          <div className="text-left text-slate-400 font-semibold pl-3">Belanja Harian</div>
                          <div className="text-red-400 font-extrabold">{battleStats.userTxCount}x</div>
                          <div className="text-blue-400 font-extrabold text-right pr-3">{battleStats.opponentTxCount}x</div>
                        </div>

                        <div className="grid grid-cols-3 p-3 text-center">
                          <div className="text-left text-slate-400 font-semibold pl-3">Misi Selesai</div>
                          <div className="text-red-400 font-extrabold">{battleStats.userMissions}</div>
                          <div className="text-blue-400 font-extrabold text-right pr-3">{battleStats.opponentMissions}</div>
                        </div>

                        <div className="grid grid-cols-3 p-3 text-center">
                          <div className="text-left text-slate-400 font-semibold pl-3">Total Tabungan</div>
                          <div className="text-red-400 font-extrabold">Rp {(battleStats.userSavings / 1000000).toFixed(2)} Jt</div>
                          <div className="text-blue-400 font-extrabold text-right pr-3">Rp {(battleStats.opponentSavings / 1000000).toFixed(2)} Jt</div>
                        </div>

                        <div className="grid grid-cols-3 p-3 text-center">
                          <div className="text-left text-slate-400 font-semibold pl-3">Presensi Acara RAT</div>
                          <div className="text-red-400 font-extrabold">{battleStats.userEvents}</div>
                          <div className="text-blue-400 font-extrabold text-right pr-3">{battleStats.opponentEvents}</div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Actions footer */}
                  <div className="p-6 bg-slate-900/60 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] text-slate-400 font-semibold">Berakhir: Minggu, 29 June 2026, pukul 23:59 WIB</p>
                    
                    <div className="flex gap-3">
                      
                      {/* Interactive dropdown trigger to use item */}
                      <div className="relative group">
                        <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-lg shadow-red-500/10">
                          <span className="material-symbols-outlined text-xs">rocket_launch</span>
                          <span>Gunakan Item (Boost)</span>
                        </button>
                        
                        {/* Hover item menu */}
                        <div className="absolute right-0 bottom-full mb-2 w-56 bg-[#161f30] border border-slate-800 rounded-xl shadow-2xl p-2 hidden group-hover:block z-40">
                          <div className="px-2 py-1.5 text-[9px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-850">
                            Inventori Item Kamu
                          </div>
                          <div className="space-y-1 mt-1.5">
                            {shopItems.map((i) => (
                              <button
                                key={i.id}
                                disabled={i.ownedCount === 0}
                                onClick={() => handleUseItemInBattle(i)}
                                className={`w-full flex justify-between items-center p-2 rounded-lg text-left text-xs transition-colors ${
                                  i.ownedCount > 0
                                    ? "hover:bg-slate-800 text-slate-200 cursor-pointer"
                                    : "text-slate-500 opacity-40 cursor-not-allowed"
                                }`}
                              >
                                <span className="truncate">{i.title}</span>
                                <span className="font-bold shrink-0">({i.ownedCount}x)</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button className="border border-slate-700 hover:border-slate-500 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors">
                        Rincian Perhitungan
                      </button>

                    </div>
                  </div>
                </div>

                {/* Match History (Col span 1) */}
                <div className="glass-panel rounded-3xl p-6 space-y-6">
                  <div>
                    <h3 className="font-bold text-slate-200 text-base">Riwayat Bertanding</h3>
                    <p className="text-xs text-slate-400 mt-1">Rekap hasil tanding kamu minggu-minggu sebelumnya.</p>
                  </div>

                  <div className="space-y-3">
                    {historyList.map((hist) => (
                      <div key={hist.id} className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded border w-16 text-center shrink-0 ${
                            hist.result === "Menang"
                              ? "bg-lime-950/60 border-lime-800 text-lime-400"
                              : "bg-red-950/60 border-red-800 text-red-400"
                          }`}>
                            {hist.result}
                          </span>
                          <span className="text-xs font-bold text-slate-300">vs {hist.opponent}</span>
                        </div>
                        <span className="text-xs font-extrabold text-yellow-400">+{hist.pointsAdded} Poin</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ================= TAB: KOPERASI (GOVERNANCE) ================= */}
          {currentTab === "koperasi" && (
            <div className="space-y-6">
              
              {/* Row 1: Statistic Cards */}
              <div className="bg-gradient-to-r from-[#4a5568] to-[#2d3748] rounded-2xl p-6 shadow-xl border border-slate-700">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">Statistik Keuangan & Anggota Bulan Ini</h3>
                    <p className="text-xs text-slate-200 mt-1">Ringkasan kondisi umum Koperasi Sukamaju periode Juni 2026.</p>
                  </div>
                  <span className="bg-slate-800 text-slate-200 text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-lg border border-slate-700">
                    Real-time
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-xl text-gray-900 shadow-md transition-all hover:-translate-y-0.5">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Anggota</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">1.284</p>
                    <p className="text-[10px] text-green-600 font-bold mt-1">+8 Minggu Ini</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl text-gray-900 shadow-md transition-all hover:-translate-y-0.5">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Pendapatan Bersama</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">Rp 840 Jt</p>
                    <p className="text-[10px] text-green-600 font-bold mt-1">+12% vs Bulan lalu</p>
                  </div>

                  <div className="bg-white p-4 rounded-xl text-gray-900 shadow-md transition-all hover:-translate-y-0.5">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Estimasi SHU Berjalan</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">Rp 120 Jt</p>
                    <p className="text-[10px] text-slate-400 font-bold italic mt-1">Update Proyeksi</p>
                  </div>

                  <div className="bg-white p-4 rounded-xl text-gray-900 shadow-md transition-all hover:-translate-y-0.5">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">UMKM Binaan Aktif</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">47 Mitra</p>
                    <p className="text-[10px] text-green-600 font-bold mt-1">+3 Bulan Ini</p>
                  </div>
                </div>
              </div>

              {/* Row 2: Trust transparency level & Digital Voting */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Transparency Gauges */}
                <div className="glass-panel rounded-2xl p-6 space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="font-bold text-base">Tingkat Transparansi (Kepercayaan)</h3>
                      <p className="text-xs text-slate-400">Pengukuran otomatis berdasarkan keterbukaan administrasi.</p>
                    </div>
                    <span className="bg-lime-950/60 text-lime-400 text-[10px] font-black border border-lime-800 uppercase px-3 py-1 rounded-lg">
                      SANGAT BAIK
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-slate-400">
                        <span>Laporan Keuangan Dipublikasikan</span>
                        <span className="text-yellow-400 font-bold">100%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400" style={{ width: "100%" }}></div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-slate-400">
                        <span>Dokumentasi Berita Acara & Keputusan</span>
                        <span className="text-yellow-400 font-bold">92%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400" style={{ width: "92%" }}></div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-slate-400">
                        <span>Partisipasi Anggota dalam RAT</span>
                        <span className="text-yellow-400 font-bold">78%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400" style={{ width: "78%" }}></div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-slate-400">
                        <span>Rasio Penyelesaian Aduan</span>
                        <span className="text-yellow-400 font-bold">85%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400" style={{ width: "85%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Digital Voting widget */}
                <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between gap-6">
                  <div>
                    <h3 className="font-bold text-base">E-Voting Penentuan Kebijakan</h3>
                    <p className="text-xs text-slate-400 mt-1">Partisipasi digital anggota untuk voting pengadaan barang.</p>
                  </div>

                  <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 text-center space-y-6">
                    <p className="font-bold text-sm text-slate-200">
                      &quot;Apakah Anda menyetujui program pengadaan traktor desa tahun anggaran 2026?&quot;
                    </p>

                    {voteSelection ? (
                      <div className="bg-lime-950/60 border border-lime-800/60 text-lime-400 rounded-xl p-4 text-xs font-bold">
                        🎉 Pilihan Anda berhasil disimpan: <span className="uppercase text-white underline">{voteSelection}</span>. Terima kasih telah berpartisipasi!
                      </div>
                    ) : (
                      <div className="flex gap-4">
                        <button
                          onClick={() => {
                            setVoteSelection("Setuju");
                            triggerToast("Terima kasih! Anda menyetujui pengadaan traktor desa.");
                          }}
                          className="flex-1 bg-lime-600 hover:bg-lime-500 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-lime-600/10 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                        >
                          <span className="material-symbols-outlined text-sm">thumb_up</span>
                          <span>Setuju</span>
                        </button>
                        <button
                          onClick={() => {
                            setVoteSelection("Tidak Setuju");
                            triggerToast("Terima kasih! Anda menolak pengadaan traktor desa.");
                          }}
                          className="flex-1 bg-red-600 hover:bg-red-500 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-red-600/10 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                        >
                          <span className="material-symbols-outlined text-sm">thumb_down</span>
                          <span>Tidak Setuju</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-[10px] text-slate-500 text-center font-bold">
                    Voting diamankan menggunakan tanda tangan enkripsi digital koperasi
                  </p>
                </div>

              </div>

              {/* Row 3: Decision Timeline */}
              <div className="glass-panel rounded-2xl p-6 space-y-6">
                <div>
                  <h3 className="font-bold text-base">Linimasa Keputusan Terkini</h3>
                  <p className="text-xs text-slate-400">Daftar kesepakatan mufakat yang sudah disahkan dalam rapat terbuka.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col justify-between gap-4">
                    <div>
                      <p className="font-bold text-xs text-white leading-normal">
                        Persetujuan program digitalisasi UMKM senilai Rp 50jt tahun anggaran 2025.
                      </p>
                    </div>
                    <div>
                      <span className="inline-block bg-yellow-400/10 text-yellow-400 text-[10px] font-black border border-yellow-400/20 px-2 py-0.5 rounded">
                        Sedang Berjalan
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col justify-between gap-4">
                    <div>
                      <p className="font-bold text-xs text-white leading-normal">
                        Penetapan bunga simpanan wajib & sukarela tetap sebesar 6% per tahun.
                      </p>
                    </div>
                    <div>
                      <span className="inline-block bg-lime-950/60 text-lime-400 text-[10px] font-black border border-lime-800 px-2 py-0.5 rounded">
                        Disetujui
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col justify-between gap-4">
                    <div>
                      <p className="font-bold text-xs text-white leading-normal">
                        Rencana penarikan biaya penanganan penarikan simpanan sukarela via gerai minimarket.
                      </p>
                    </div>
                    <div>
                      <span className="inline-block bg-red-950/60 text-red-400 text-[10px] font-black border border-red-850 px-2 py-0.5 rounded">
                        Ditolak
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ================= TAB: PROFIL ================= */}
          {currentTab === "profil" && (
            <div className="space-y-6">
              
              {/* Row 1: Profile Header & QR Card */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Profile Detail Card */}
                <div className="glass-panel rounded-2xl p-6 text-center space-y-4">
                  <div className="w-24 h-24 bg-slate-800 text-yellow-400 text-3xl font-extrabold rounded-full flex items-center justify-center mx-auto border-4 border-yellow-400 shadow-xl shadow-yellow-500/10">
                    AS
                  </div>
                  <div>
                    <h2 className="text-xl font-black">Agung Saputra</h2>
                    <p className="text-[10px] text-slate-500 mt-1">KMP-DSKMJ-2021-0041</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 justify-center pt-2">
                    <span className="text-[9px] bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 px-2.5 py-1 rounded-full font-black">
                      🥇 Rank: Emas
                    </span>
                    <span className="text-[9px] bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-full font-bold">
                      🔥 {streak} Hari Streak
                    </span>
                    <span className="text-[9px] bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-full font-bold">
                      📆 Gabung: 2021
                    </span>
                  </div>
                </div>

                {/* Membership QR Code Card (Col span 2) */}
                <div className="glass-panel rounded-2xl p-6 bg-gradient-to-r from-[#0c101c] to-[#121926] border border-slate-800 flex flex-col md:flex-row items-center gap-6 lg:col-span-2">
                  <div className="bg-white p-3.5 rounded-2xl shrink-0">
                    {/* SVG placeholder for QR Code */}
                    <svg className="w-28 h-28 text-slate-900" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M3 3h4v4H3zM17 3h4v4h-4zM3 17h4v4H3zM14 14h2M14 17h2M14 20h2M17 14h2M20 14h1M17 17h4M17 20h4"></path>
                      <path d="M7 7V3h4v4H7zM3 7h4v4H3V7zM17 7V3h4v4h-4zM17 11h4M7 17v4h4v-4H7z"></path>
                    </svg>
                  </div>
                  <div className="space-y-3 text-center md:text-left">
                    <h3 className="text-lg font-black text-white">QR Kartu Keanggotaan Digital</h3>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                      Pindai QR Code ini untuk melakukan verifikasi kehadiran Rapat Anggota Tahunan (RAT), penarikan dana di kantor koperasi, atau transaksi kemitraan UMKM desa.
                    </p>
                    <div className="flex gap-2 justify-center md:justify-start">
                      <button className="bg-slate-800 hover:bg-slate-750 text-slate-200 px-3.5 py-1.5 rounded-lg text-xs font-bold border border-slate-700 transition-colors">
                        Simpan Gambar
                      </button>
                      <button className="bg-slate-800 hover:bg-slate-750 text-slate-200 px-3.5 py-1.5 rounded-lg text-xs font-bold border border-slate-700 transition-colors">
                        Salin No. Anggota
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Row 2: Impact Stats & Settings */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Personal Impact (Col span 2) */}
                <div className="glass-panel rounded-2xl p-6 lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="font-bold text-base">Dampak Personal</h3>
                    <p className="text-xs text-slate-400">Pengaruh kontribusi Anda terhadap koperasi dan kesejahteraan desa.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#121926] p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Transaksi</span>
                      <p className="text-2xl font-black text-slate-200 mt-2">247 Kali</p>
                    </div>
                    
                    <div className="bg-[#121926] p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Estimasi SHU Diterima</span>
                      <p className="text-2xl font-black text-slate-200 mt-2">Rp 320.000</p>
                    </div>

                    <div className="bg-[#121926] p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Mitra UMKM Didukung</span>
                      <p className="text-2xl font-black text-slate-200 mt-2">18 Merchant</p>
                    </div>

                    <div className="bg-[#121926] p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Rasio Menang Battle</span>
                      <p className="text-2xl font-black text-slate-200 mt-2">73% Win Rate</p>
                    </div>
                  </div>
                </div>

                {/* Settings list */}
                <div className="glass-panel rounded-2xl p-6 space-y-4">
                  <h3 className="font-bold text-base">Pengaturan</h3>
                  
                  <div className="divide-y divide-slate-800 text-xs">
                    <button className="w-full flex justify-between items-center py-3 text-slate-300 hover:text-white transition-colors">
                      <span>Ubah Profil Anggota</span>
                      <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                    <button className="w-full flex justify-between items-center py-3 text-slate-300 hover:text-white transition-colors">
                      <span>Ubah Keamanan PIN Transaksi</span>
                      <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                    <button className="w-full flex justify-between items-center py-3 text-slate-300 hover:text-white transition-colors">
                      <span>Pemberitahuan & Notifikasi</span>
                      <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                    <button className="w-full flex justify-between items-center py-3 text-slate-300 hover:text-white transition-colors">
                      <span>Pusat Bantuan & Syarat Layanan</span>
                      <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      triggerToast("Melakukan logout... Sesi Anda telah berakhir.");
                    }}
                    className="w-full mt-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-red-400 hover:text-red-300 font-bold py-3 rounded-xl transition-all"
                  >
                    Keluar Sesi
                  </button>
                </div>

              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}
