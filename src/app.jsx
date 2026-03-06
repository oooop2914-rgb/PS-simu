import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Clock, DollarSign, ShoppingCart, 
  ArrowUpCircle, Monitor, Star, AlertOctagon, 
  Edit2, Users, ChefHat, ShieldAlert, BadgeCheck, Gamepad2, ScrollText, 
  Trash2, LayoutGrid, Send, CheckCircle2, XCircle,
  Wrench, Megaphone, Calculator, Globe, Zap, Settings, ShieldCheck, Tag, LogOut, Bug, MessageSquare,
  Repeat, Sparkles, Code, Trophy, CreditCard, Mail, Inbox, Crown, Award,
  Dices, Landmark, HeartHandshake, Skull, Newspaper, Ban, Wind, ScanLine, Briefcase, Coffee, RefreshCw
} from 'lucide-react';

// --- KONFIGURASI BACKEND MYSQL ---
// Ganti dengan IP VPS / Pterodactyl Anda jika sudah online
const API_URL = "http://129.212.238.173:3000/api";

const ADMIN_ACCOUNTS = {
  'ryo': 'pokemon12',
  'binz': 'bulbasor12',
  'ftrbl': 'NuF24k',
};

const PS_DATA = {
  jadul: { name: 'PS Jadul', price: 120000, rentPrice: 5000, color: 'from-slate-500 to-slate-700', glow: 'shadow-slate-500/50' },
  reguler: { name: 'PS Reguler', price: 350000, rentPrice: 10000, color: 'from-cyan-500 to-blue-600', glow: 'shadow-cyan-500/50' },
  mantap: { name: 'PS Mantap', price: 1500000, rentPrice: 20000, color: 'from-violet-500 to-fuchsia-600', glow: 'shadow-violet-500/50' },
  sultan: { name: 'PS Sultan', price: 15000000, rentPrice: 30000, color: 'from-amber-400 to-orange-500', glow: 'shadow-amber-500/50' },
  vip: { name: 'VIP + Sultan', price: 15000000, rentPrice: 50000, color: 'from-rose-500 to-red-600', glow: 'shadow-rose-500/50' }, 
};

const BUILDINGS = [
  { id: 0, name: "Kios Awal", price: 0, slots: { jadul: 4, reguler: 0, mantap: 0, sultan: 0, vip: 0 }, layout: [{ name: "Ruangan Sempit", types: ['jadul'] }] },
  { id: 1, name: "Gedung Biasa", price: 3000000, slots: { jadul: 5, reguler: 3, mantap: 0, sultan: 0, vip: 0 }, layout: [{ name: "Lantai 1", types: ['jadul', 'reguler'] }] },
  { id: 2, name: "Gedung Menengah", price: 3000000, slots: { jadul: 3, reguler: 5, mantap: 2, sultan: 0, vip: 0 }, layout: [{ name: "Lantai 1", types: ['jadul', 'reguler', 'mantap'] }] },
  { id: 3, name: "Gedung Mahal", price: 10000000, slots: { jadul: 0, reguler: 10, mantap: 5, sultan: 2, vip: 0 }, layout: [{ name: "Lantai Utama", types: ['reguler', 'mantap'] }, { name: "Lantai VIP", types: ['sultan'] }] },
  { id: 4, name: "Gedung Pengusaha", price: 80000000, slots: { jadul: 0, reguler: 20, mantap: 15, sultan: 0, vip: 10 }, layout: [{ name: "Lantai 1", types: ['reguler'] }, { name: "Lantai 2", types: ['mantap'] }, { name: "Lantai 3 (VVIP)", types: ['vip'] }] },
];

const FB_MENU = [
  { id: 'esteh', name: 'Es Teh Manis', price: 5000, icon: '🥤' },
  { id: 'kopi', name: 'Kopi Hitam', price: 8000, icon: '☕' },
  { id: 'indomie', name: 'Indomie Telur', price: 15000, icon: '🍜' },
  { id: 'nasgor', name: 'Nasi Goreng', price: 25000, icon: '🍛' }
];

const CHAT_BUBBLES = ["Lag coy!", "GG", "Yah kalah", "Mantap", "Tanggung", "Dingin euy", "Gas", "Lau sape mpruy"];
const UMUM_NAMES = ['Akira', 'Rahmat', 'Ayoera', 'Alsean', 'Altair', 'Leaf', 'Allen', 'Claire', 'Ilyas', 'Nita', 'Nathan', 'Naithen', 'Ryu', 'Zack', 'Thayya', 'Shey', 'Zein', 'Fito', 'Bayu', 'Daff', 'Sibauu', 'Riza'];
const SPECIAL_GUESTS = ['AugMiaw', 'WinBerwibawa', 'Mancil', 'Maklor', 'Jesslimited', 'FTRBL', 'RYUOU'];

const EMPLOYEE_ROLES = [
  { key: 'operator', icon: ShieldAlert, title: 'Keamanan (Anti Bolos)', bg: 'bg-indigo-500/20', text: 'text-indigo-400', border: 'border-indigo-500/30', cardBg: 'bg-indigo-900/30', btn: 'bg-indigo-600 hover:bg-indigo-500' },
  { key: 'cook', icon: ChefHat, title: 'Dapur (Auto F&B)', bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30', cardBg: 'bg-amber-900/30', btn: 'bg-amber-600 hover:bg-amber-500' },
  { key: 'teknisi', icon: Wrench, title: 'Teknisi (Auto Servis)', bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', cardBg: 'bg-emerald-900/30', btn: 'bg-emerald-600 hover:bg-emerald-500' },
  { key: 'marketing', icon: Megaphone, title: 'Marketing (Banyak Tamu)', bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30', cardBg: 'bg-rose-900/30', btn: 'bg-rose-600 hover:bg-rose-500' },
  { key: 'kasir', icon: Calculator, title: 'Kasir (+Income 10%)', bg: 'bg-sky-500/20', text: 'text-sky-400', border: 'border-sky-500/30', cardBg: 'bg-sky-900/30', btn: 'bg-sky-600 hover:bg-sky-500' },
  { key: 'vip_manager', icon: Ban, title: 'Kalag (Jaga VIP)', bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30', cardBg: 'bg-purple-900/30', btn: 'bg-purple-600 hover:bg-purple-500' },
  { key: 'janitor', icon: Sparkles, title: 'Cleaning (Cegah Kotor)', bg: 'bg-teal-500/20', text: 'text-teal-400', border: 'border-teal-500/30', cardBg: 'bg-teal-900/30', btn: 'bg-teal-600 hover:bg-teal-500' }
];

const formatRp = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
const formatTime = (h, m) => {
    const jam = h.toString().padStart(2, '0');
    const menit = m.toString().padStart(2, '0');
    return jam + ':' + menit;
};

// ==========================================
// 1. KOMPONEN HALAMAN LOGIN
// ==========================================
function LoginPage({ onLoginSuccess, showToast }) {
    const [authInput, setAuthInput] = useState('');
    const [authSecret, setAuthSecret] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleAuth = async (e) => {
        e.preventDefault();
        const safeUser = authInput.trim().toLowerCase().replace(/\s/g, '');
        if (safeUser.length < 3) return showToast("Username minimal 3 karakter (Tanpa Spasi)!", "error");
        if (authSecret.length < 6) return showToast("Password minimal 6 karakter!", "error");
        
        setIsLoading(true);
        let role = 'user';
        
        // Deteksi Akun Admin Otomatis
        if (ADMIN_ACCOUNTS[safeUser]) {
            if (authSecret !== ADMIN_ACCOUNTS[safeUser]) {
                setIsLoading(false);
                return showToast("Akses Admin Ditolak! Password Salah.", "error");
            }
            role = 'admin';
        }

        const endpoint = isRegistering ? '/auth/register' : '/auth/login';
        
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: safeUser, password: authSecret, role })
            });
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.error || "Terjadi kesalahan server");
            
            showToast(`Selamat datang ${data.user.username}!`, "success");
            onLoginSuccess(data.user, data.token);
        } catch (error) {
            showToast(error.message, "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#06101e] flex flex-col items-center justify-center p-4 text-white relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 to-blue-900/10 z-0"></div>
           <div className="bg-[#0b1829]/80 p-8 rounded-3xl border border-cyan-500/20 backdrop-blur-xl z-10 w-full max-w-md shadow-[0_0_40px_rgba(6,182,212,0.1)] text-center relative">
              <Gamepad2 size={60} className="text-cyan-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
              <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-sky-400 mb-2">Juragan Rental PS</h1>
              <p className="text-slate-400 text-sm mb-8">Server MySQL Edition</p>
              
              <form onSubmit={handleAuth} className="space-y-4">
                 <input 
                    type="text" value={authInput} 
                    onChange={e => setAuthInput(e.target.value.replace(/\s/g, ''))} 
                    autoCapitalize="none" autoComplete="off" autoCorrect="off" spellCheck="false"
                    placeholder="Username (ID)" 
                    className="w-full bg-[#06101e] border border-cyan-500/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-colors shadow-inner lowercase" 
                    required 
                 />
                 <input 
                    type="password" value={authSecret} onChange={e => setAuthSecret(e.target.value)} 
                    placeholder="Password (Min. 6 Karakter)" 
                    className="w-full bg-[#06101e] border border-cyan-500/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-colors shadow-inner" 
                    required 
                 />
                 
                 <button type="submit" disabled={isLoading} className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${isRegistering ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-purple-500/30' : 'bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 shadow-cyan-500/30'}`}>
                    {isLoading ? <RefreshCw className="animate-spin" size={18}/> : (isRegistering ? 'Buat Akun Baru' : 'Masuk ke Server')}
                 </button>
              </form>

              <div className="mt-6 text-center">
                <button onClick={() => setIsRegistering(!isRegistering)} type="button" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors underline decoration-cyan-900 underline-offset-4">
                  {isRegistering ? 'Sudah punya akun? Masuk di sini' : 'Belum punya akun? Buat baru'}
                </button>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-800/50 text-center">
                 <p className="text-xs text-slate-500">*Akun Admin gunakan Username & Password khusus</p>
              </div>
           </div>
        </div>
    );
}

// ==========================================
// 2. KOMPONEN UTAMA GAME
// ==========================================
function Game({ session, onLogout, showToast }) {
  const token = session.token;

  // --- GLOBAL DATABASE STATE ---
  const [globalConfig, setGlobalConfig] = useState({ boost: 1, discount: 0, maintenance: false, broadcast: '', dailyNews: '', sysBroadcast: null, pinjolInterest: 20 });
  const [globalChat, setGlobalChat] = useState([]);
  const [globalChatInput, setGlobalChatInput] = useState('');
  const [allPlayers, setAllPlayers] = useState([]);
  const [reports, setReports] = useState([]); 
  const [reportInput, setReportInput] = useState('');
  const [appealInput, setAppealInput] = useState(''); 
  const [sysBroadcastMsg, setSysBroadcastMsg] = useState(null);

  // --- LOCAL GAME STATE ---
  const [playerProfile, setPlayerProfile] = useState(session.user);
  const [shopName, setShopName] = useState(session.user.shopName || "Juragan PS");
  const [isEditingName, setIsEditingName] = useState(false);
  const [money, setMoney] = useState(session.user.money || 1800000); 
  const [reputation, setReputation] = useState(session.user.reputation ?? 100);
  const [time, setTime] = useState({ h: 7, m: 0 });
  const [day, setDay] = useState(1);
  const [isOpen, setIsOpen] = useState(true);
  const [buildingLvl, setBuildingLvl] = useState(session.user.building_lvl || 0);
  const [gameOver, setGameOver] = useState(false);
  
  const [inventory, setInventory] = useState(session.user.inventory || { jadul: 0, reguler: 0, mantap: 0, sultan: 0 });
  const [installedPS, setInstalledPS] = useState(session.user.installed_ps || { jadul: 0, reguler: 0, mantap: 0, sultan: 0, vip: 0 });
  const [activeRentals, setActiveRentals] = useState({});
  const [activeTab, setActiveTab] = useState('rental');
  
  // MAILBOX & FASILITAS
  const [showMailbox, setShowMailbox] = useState(false);
  const unreadMails = playerProfile?.mail ? playerProfile.mail.filter(m => !m.read_status).length : 0;
  
  const [fbUnlocked, setFbUnlocked] = useState(session.user.fb_unlocked || false);
  const [fanUnlocked, setFanUnlocked] = useState(session.user.fan_unlocked || false);
  const [acUnlocked, setAcUnlocked] = useState(session.user.ac_unlocked || false);

  const [gachaBet, setGachaBet] = useState('');
  const [isGachaRolling, setIsGachaRolling] = useState(false);
  const [pinjolAmount, setPinjolAmount] = useState('');
  const [payPinjolAmount, setPayPinjolAmount] = useState('');

  // ADMIN STATE
  const [broadcastInput, setBroadcastInput] = useState('');
  const [newsInput, setNewsInput] = useState(''); 
  const [adminSendTarget, setAdminSendTarget] = useState('');
  const [adminSendType, setAdminSendType] = useState('money');
  const [adminSendAmount, setAdminSendAmount] = useState('');
  const [adminSendMessage, setAdminSendMessage] = useState(''); 
  const [wipeTarget, setWipeTarget] = useState(''); 
  const [playerSearch, setPlayerSearch] = useState(''); 
  const [adminRoleTarget, setAdminRoleTarget] = useState('');
  const [adminRoleType, setAdminRoleType] = useState('user');

  // TRADE STATE
  const [tradeTarget, setTradeTarget] = useState('');
  const [tradeType, setTradeType] = useState('money');
  const [tradeAmount, setTradeAmount] = useState('');

  // KARYAWAN & KERJA
  const [hiredEmployees, setHiredEmployees] = useState(session.user.hired_employees || { operator: null, cook: null, teknisi: null, marketing: null, kasir: null, vip_manager: null, janitor: null });
  const [jobMarket, setJobMarket] = useState({
    operator: { id: 1, name: 'Satria', role: 'operator', salary: 50000, desc: 'Auto Usir Anak Bolos' },
    cook: { id: 2, name: 'Chelsea', role: 'cook', salary: 70000, desc: 'Auto Layani F&B' },
    teknisi: { id: 3, name: 'Jono', role: 'teknisi', salary: 60000, desc: 'Auto Perbaiki Stik Rusak' },
    marketing: { id: 4, name: 'Dita', role: 'marketing', salary: 80000, desc: 'Banyak Pelanggan' },
    kasir: { id: 5, name: 'Adel', role: 'kasir', salary: 45000, desc: 'Bonus Income Rental +10%' },
    vip_manager: { id: 6, name: 'Kalag', role: 'vip_manager', salary: 150000, desc: 'Auto Usir Perokok VIP' },
    janitor: { id: 7, name: 'Kemal', role: 'janitor', salary: 10000, desc: 'Bersih-bersih (+Reputasi)' }
  });
  const [isCashier, setIsCashier] = useState(false);
  const [cashierRating, setCashierRating] = useState(5.0);
  const [minimarketCust, setMinimarketCust] = useState(null);

  const globalChatEndRef = useRef(null);

  // Refs for Game Loop & Sync
  const timeRef = useRef(time);
  const dayRef = useRef(day);
  const isOpenRef = useRef(isOpen);
  const buildingLvlRef = useRef(buildingLvl);
  const installedPSRef = useRef(installedPS);
  const activeRentalsRef = useRef(activeRentals);
  const gameOverRef = useRef(gameOver);
  const hiredEmployeesRef = useRef(hiredEmployees);
  const moneyRef = useRef(money);
  const reputationRef = useRef(reputation);
  const globalConfigRef = useRef(globalConfig);
  const isCashierRef = useRef(isCashier);
  const minimarketCustRef = useRef(minimarketCust);
  const cashierRatingRef = useRef(cashierRating);
  const shopNameRef = useRef(shopName);
  const fbUnlockedRef = useRef(fbUnlocked);
  const fanUnlockedRef = useRef(fanUnlocked);
  const acUnlockedRef = useRef(acUnlocked);

  useEffect(() => { timeRef.current = time; }, [time]);
  useEffect(() => { dayRef.current = day; }, [day]);
  useEffect(() => { isOpenRef.current = isOpen; }, [isOpen]);
  useEffect(() => { buildingLvlRef.current = buildingLvl; }, [buildingLvl]);
  useEffect(() => { installedPSRef.current = installedPS; }, [installedPS]);
  useEffect(() => { activeRentalsRef.current = activeRentals; }, [activeRentals]);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);
  useEffect(() => { hiredEmployeesRef.current = hiredEmployees; }, [hiredEmployees]);
  useEffect(() => { moneyRef.current = money; }, [money]);
  useEffect(() => { reputationRef.current = reputation; }, [reputation]);
  useEffect(() => { globalConfigRef.current = globalConfig; }, [globalConfig]);
  useEffect(() => { isCashierRef.current = isCashier; }, [isCashier]);
  useEffect(() => { minimarketCustRef.current = minimarketCust; }, [minimarketCust]);
  useEffect(() => { cashierRatingRef.current = cashierRating; }, [cashierRating]);
  useEffect(() => { shopNameRef.current = shopName; }, [shopName]);
  useEffect(() => { fbUnlockedRef.current = fbUnlocked; }, [fbUnlocked]);
  useEffect(() => { fanUnlockedRef.current = fanUnlocked; }, [fanUnlocked]);
  useEffect(() => { acUnlockedRef.current = acUnlocked; }, [acUnlocked]);

  useEffect(() => { if (globalChatEndRef.current) globalChatEndRef.current.scrollIntoView({ behavior: 'smooth' }); }, [globalChat, activeTab]);

  useEffect(() => {
     if (reputation <= 0 && !gameOver) {
         setGameOver(true);
         setIsOpen(false);
     }
  }, [reputation, gameOver]);

  // --- API HELPER FUNCTION ---
  const sendApiAction = async (action, payload) => {
      try {
          await fetch(`${API_URL}/action`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({ action, payload })
          });
      } catch(e) { console.error(e); }
  }

  // --- SYNC POLLING SERVER ---
  useEffect(() => {
      const fetchGlobal = async () => {
          try {
             const res = await fetch(`${API_URL}/sync`, { headers: { 'Authorization': `Bearer ${token}` } });
             const data = await res.json();
             if (res.ok) {
                 if (data.globalConfig) setGlobalConfig(data.globalConfig);
                 if (data.globalChat) setGlobalChat(data.globalChat);
                 if (data.allPlayers) setAllPlayers(data.allPlayers);
                 if (data.reports) setReports(data.reports);

                 if (data.profile) {
                     setPlayerProfile(prev => ({ ...prev, ...data.profile, isBanned: data.profile.is_banned, mail: data.profile.mail }));
                     if (data.profile.is_banned) onLogout(); // Auto kick if banned
                 }
             }
          } catch (e) {} 
      };

      fetchGlobal();
      const pollInterval = setInterval(fetchGlobal, 5000);
      return () => clearInterval(pollInterval);
  }, [token, onLogout]);

  // --- AUTO SAVE KE MYSQL (Setiap 10 Detik) ---
  useEffect(() => {
     if (!playerProfile || gameOverRef.current) return;
     const interval = setInterval(async () => {
        try {
            await fetch(`${API_URL}/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    money: moneyRef.current, 
                    reputation: reputationRef.current,
                    inventory: inventory, 
                    fbUnlocked: fbUnlockedRef.current,
                    fanUnlocked: fanUnlockedRef.current, 
                    acUnlocked: acUnlockedRef.current,
                    shopName: shopNameRef.current,
                    buildingLvl: buildingLvlRef.current,
                    installedPS: installedPSRef.current,
                    hiredEmployees: hiredEmployeesRef.current,
                    achieved: playerProfile.achieved || { m5: false, m10: false, m100: false },
                    lastDailyClaim: playerProfile.last_daily_claim || 0
                })
            });
        } catch (e) {}
     }, 10000);
     return () => clearInterval(interval);
  }, [playerProfile, inventory, token, buildingLvl, shopName, fbUnlocked, fanUnlocked, acUnlocked]);

  // Pengecekan Achievement Kekayaan
  useEffect(() => {
      if (!playerProfile || playerProfile.role === 'admin') return;
      
      const checkAchievements = async () => {
          const achieved = playerProfile.achieved || { m5: false, m10: false, m100: false };
          let isUpdated = false;

          if (money >= 5000000 && !achieved.m5) {
              achieved.m5 = true; isUpdated = true;
              sendApiAction('updateConfig', { sysBroadcast: { message: `🎉 LUAR BIASA! ${playerProfile.username} mencapai Rp 5 Juta!`, time: Date.now() } });
          }
          if (money >= 10000000 && !achieved.m10) {
              achieved.m10 = true; isUpdated = true;
              sendApiAction('updateConfig', { sysBroadcast: { message: `🔥 GILA! ${playerProfile.username} menyentuh Rp 10 Juta!`, time: Date.now() } });
          }
          if (money >= 100000000 && !achieved.m100) {
              achieved.m100 = true; isUpdated = true;
              sendApiAction('updateConfig', { sysBroadcast: { message: `👑 SULTAN SERVER! ${playerProfile.username} menembus Rp 100 JUTA!`, time: Date.now() } });
          }

          if (isUpdated) {
              setPlayerProfile(prev => ({...prev, achieved}));
          }
      };
      checkAchievements();
  }, [money, playerProfile]);

  // --- KLAIM HADIAH MAILBOX ---
  const handleClaimMail = async (mailId) => {
      const mailItem = playerProfile.mail?.find(m => m.id === mailId);
      if (!mailItem || mailItem.is_claimed || !mailItem.has_attachment) return;

      let updatedMoney = moneyRef.current;
      let updatedInventory = { ...inventory };

      if (mailItem.attachment_type === 'money') {
          updatedMoney += mailItem.attachment_amount;
          setMoney(updatedMoney);
      } else {
          if (updatedInventory[mailItem.attachment_type] !== undefined) {
              updatedInventory[mailItem.attachment_type] += mailItem.attachment_amount;
              setInventory(updatedInventory);
          }
      }

      setPlayerProfile(prev => ({ 
          ...prev, 
          mail: prev.mail.map(m => m.id === mailId ? { ...m, is_claimed: true } : m) 
      }));

      await sendApiAction('claimMail', { mailId });
      showToast(`Berhasil mengklaim hadiah!`, "success");
  };

  // --- KLAIM GAJI HARIAN ---
  const handleClaimDaily = async () => {
      const today = new Date().setHours(0,0,0,0);
      if ((playerProfile.last_daily_claim || 0) >= today) return showToast("Sudah klaim hari ini!", "error");

      let bonus = 0;
      if (playerProfile.role === 'manajer') bonus = 150000;
      else if (playerProfile.role === 'direktur') bonus = 300000;
      else if (playerProfile.role === 'ceo') bonus = 550000;

      if (bonus === 0) return;

      setMoney(m => m + bonus);
      setPlayerProfile(prev => ({...prev, last_daily_claim: Date.now()}));
      showToast(`Berhasil klaim Gaji Harian Rp ${bonus.toLocaleString()}!`, "success");
  };

  const openMailbox = () => {
      setShowMailbox(true);
      if (playerProfile.mail && playerProfile.mail.some(m => !m.read_status)) {
          setPlayerProfile(prev => ({...prev, mail: prev.mail.map(m => ({...m, read_status: true}))}));
          sendApiAction('readMail', { uid: playerProfile.id });
      }
  };

  const sendGlobalChat = (e) => {
     e.preventDefault();
     if (!globalChatInput.trim()) return;
     sendApiAction('sendChat', { uid: playerProfile.id, sender: playerProfile.username, role: playerProfile.role, text: globalChatInput.trim(), timestamp: Date.now() });
     setGlobalChatInput('');
  };

  const submitReport = (e) => {
     e.preventDefault();
     if (!reportInput.trim()) return;
     sendApiAction('sendReport', { uid: playerProfile.id, sender: playerProfile.username, type: 'bug', text: reportInput.trim(), timestamp: Date.now() });
     setReportInput('');
     showToast("Laporan berhasil dikirim ke Admin!", "success");
  };

  const submitAppeal = () => {
      if (!appealInput.trim()) return showToast("Pesan banding tidak boleh kosong", "error");
      sendApiAction('sendReport', { uid: playerProfile.id, sender: playerProfile.username, type: 'appeal', text: appealInput.trim(), timestamp: Date.now() });
      setAppealInput('');
      showToast("Banding Anda telah dikirim ke Server!", "success");
  };

  // --- FITUR: GACHA SALDO ---
  const handleGacha = () => {
      const cost = Number(gachaBet);
      if (cost <= 0 || isNaN(cost)) return showToast("Nominal taruhan tidak valid!", "error");
      if (playerProfile.role !== 'admin' && money < cost) return showToast(`Uang tidak cukup (Butuh Rp ${formatRp(cost)})`, "error");
      
      setIsGachaRolling(true);
      if (playerProfile.role !== 'admin') setMoney(m => m - cost);
      
      setTimeout(() => {
          const roll = Math.random();
          let multiplier = 0;
          if (roll < 0.60) multiplier = 0; 
          else if (roll < 0.90) multiplier = 1.5; 
          else if (roll < 0.99) multiplier = 2; 
          else multiplier = 10; 

          const winAmount = cost * multiplier;

          if (playerProfile.role !== 'admin') setMoney(m => m + winAmount);
          setIsGachaRolling(false);

          if (multiplier >= 10) showToast(`🎰 JACKPOT! Menang ${multiplier}x (+Rp ${formatRp(winAmount)})!`, "special");
          else if (multiplier > 1) showToast(`Untung! Menang ${multiplier}x (+Rp ${formatRp(winAmount)})`, "success");
          else showToast(`💀 ZONK! Saldo taruhan Anda hangus.`, "error");

      }, 1500); 
  };

  // --- FITUR: PINJOL ---
  const handlePinjam = (e) => {
      e.preventDefault();
      const amt = Number(pinjolAmount);
      if (amt <= 0 || isNaN(amt)) return showToast("Nominal tidak valid!", "error");
      if (amt > 50000000) return showToast("Maksimal pinjaman 50 Juta!", "error");
      if ((playerProfile.debt || 0) > 0) return showToast("Lunasi hutang Anda sebelumnya terlebih dahulu!", "error");

      const interestRate = globalConfig.pinjolInterest ?? 20;
      const totalDebt = amt + (amt * interestRate / 100);

      setMoney(m => m + amt);
      setPlayerProfile(prev => ({...prev, debt: totalDebt}));
      showToast(`Pinjaman cair dari Server: Rp ${amt.toLocaleString()}`, 'success');
      setPinjolAmount('');
  };

  const handlePayPinjol = (e) => {
      e.preventDefault();
      const amt = Number(payPinjolAmount);
      const currentDebt = playerProfile.debt || 0;
      if (amt <= 0 || isNaN(amt)) return showToast("Nominal tidak valid!", "error");
      if (amt > currentDebt) return showToast("Nominal yang dimasukkan melebihi total hutang Anda!", "error");
      if (money < amt) return showToast("Saldo Anda tidak cukup untuk membayar nominal ini!", "error");

      setMoney(m => m - amt);
      setPlayerProfile(prev => ({...prev, debt: currentDebt - amt}));
      showToast(`Berhasil mencicil hutang Rp ${amt.toLocaleString()}`, 'success');
      setPayPinjolAmount('');
  };

  // --- TRADE ACTION ---
  const handleTrade = async (e) => {
     e.preventDefault();
     if (!tradeTarget || !tradeType || !tradeAmount || tradeAmount <= 0) return showToast("Lengkapi form dengan benar!", "error");
     
     const targetPlayer = allPlayers.find(p => p.id === tradeTarget);
     if (!targetPlayer) return showToast("Player tidak ditemukan!", "error");
     if (targetPlayer.id === playerProfile.id) return showToast("Tidak bisa trade ke diri sendiri!", "error");

     const amt = Number(tradeAmount);
     if (tradeType === 'money' && playerProfile.role !== 'admin' && money < amt) return showToast("Saldo tidak cukup!", "error");
     if (tradeType !== 'money' && playerProfile.role !== 'admin' && inventory[tradeType] < amt) return showToast(`Gudang ${PS_DATA[tradeType]?.name} tidak cukup!`, "error");

     sendApiAction('sendMail', {
        id: Date.now().toString(), receiver_uid: targetPlayer.id, title: "Trade Diterima!",
        body: `${playerProfile.username} mengirimkan Anda ${amt} ${tradeType === 'money' ? 'Saldo' : 'Unit Mesin ' + PS_DATA[tradeType]?.name}.`,
        type: 'trade', has_attachment: true, attachment_type: tradeType, attachment_amount: amt, timestamp: Date.now()
     });

     if (playerProfile.role !== 'admin') {
         if (tradeType === 'money') setMoney(m => m - amt);
         else setInventory(prev => ({ ...prev, [tradeType]: prev[tradeType] - amt }));
     }
     showToast(`Berhasil transfer ke ${targetPlayer.username}!`, "success");
     setTradeAmount('');
  };

  // --- ADMIN ACTIONS ---
  const adminSetGlobal = (key, val) => {
      sendApiAction('updateConfig', { [key]: val });
      showToast(`Global ${key} di-update!`, 'success');
  };
  
  const adminSendBroadcast = () => { adminSetGlobal('broadcast', broadcastInput); setBroadcastInput(''); };
  const adminSendNews = () => { adminSetGlobal('dailyNews', newsInput); setNewsInput(''); };

  const handleAdminDirectSend = (e) => {
      e.preventDefault();
      if (!adminSendTarget || !adminSendAmount) return;
      const t = allPlayers.find(p => p.id === adminSendTarget);
      sendApiAction('sendMail', {
          id: Date.now().toString(), receiver_uid: t.id, title: "Hadiah dari Admin", body: adminSendMessage || "Ini hadiahmu!",
          type: 'admin_gift', has_attachment: true, attachment_type: adminSendType, attachment_amount: Number(adminSendAmount), timestamp: Date.now()
      });
      showToast("Terkirim!", "success");
  };

  const handleTradeSubmit = (e) => {
      e.preventDefault();
      if(!tradeTarget || !tradeAmount) return;
      const amt = Number(tradeAmount);
      if (tradeType === 'money' && playerProfile.role !== 'admin' && money < amt) return showToast("Uang kurang!", "error");
      if (tradeType !== 'money' && playerProfile.role !== 'admin' && inventory[tradeType] < amt) return showToast("Item kurang!", "error");

      if (playerProfile.role !== 'admin') {
          if (tradeType === 'money') setMoney(m => m - amt);
          else setInventory(p => ({...p, [tradeType]: p[tradeType] - amt}));
      }

      sendApiAction('sendMail', {
          id: Date.now().toString(), receiver_uid: tradeTarget, title: "Trade Masuk", body: `${playerProfile.username} mengirim trade.`,
          type: 'trade', has_attachment: true, attachment_type: tradeType, attachment_amount: amt, timestamp: Date.now()
      });
      showToast("Trade terkirim!", "success");
  };

  // GAME LOOP (Waktu & Tamu)
  useEffect(() => {
    if (!playerProfile || gameOver || (globalConfig.maintenance && playerProfile.role === 'user')) return;

    const interval = setInterval(() => {
      let newM = timeRef.current.m + 1; let newH = timeRef.current.h;
      let hourChanged = false;
      if (newM >= 60) { newM = 0; newH += 1; hourChanged = true; if (newH >= 24) newH = 0; }
      setTime({ h: newH, m: newM });

      if (hourChanged) {
          if (newH === 1) setIsOpen(false);
          if (newH === 7) {
             setIsOpen(true); setDay(d => d + 1);
             const emps = hiredEmployeesRef.current;
             let totalSal = 0; Object.values(emps).forEach(e => { if(e) totalSal += e.salary; });
             if (totalSal > 0 && playerProfile.role !== 'admin') setMoney(m => m - totalSal);
          }
          if (newH === 10 && isCashierRef.current) showToast('🏪 Shift Minimarket dimulai!', 'special');
          if (newH === 15 && isCashierRef.current) {
              const rating = Math.floor(cashierRatingRef.current);
              let salary = rating < 3 ? 35000 : rating >= 10 ? 250000 : 40000 + ((rating - 3) * 15000);
              if (playerProfile.role !== 'admin') setMoney(m => m + salary);
              setMinimarketCust(null);
              showToast(`💰 Gaji Kasir cair: Rp ${salary.toLocaleString()}`, 'success');
          }
      }

      if (isCashierRef.current && newH >= 10 && newH < 15) {
         if (minimarketCustRef.current) {
            const cust = { ...minimarketCustRef.current };
            if (cust.timer <= 1) { setCashierRating(r => Math.max(1, r - 1.0)); setMinimarketCust(null); } 
            else { cust.timer -= 1; setMinimarketCust(cust); }
         } else if (Math.random() < 0.20) { 
             const numItems = Math.floor(Math.random() * 3) + 1;
             const custItems = []; let total = 0;
             for(let i=0; i<numItems; i++) {
                 const p = Math.round((Math.floor(Math.random() * 20000) + 2000) / 500) * 500;
                 custItems.push({name: 'Item', price: p, scanned: false}); total += p;
             }
             let paid = Math.ceil(total/50000) * 50000;
             setMinimarketCust({ items: custItems, total, paid, expectedChange: paid - total, timer: 40 + (numItems * 12), initialTimer: 40 + (numItems * 12), inputChange: 0 });
         }
      }

      if (isOpenRef.current) {
         const emps = hiredEmployeesRef.current;
         const boost = globalConfig.boost || 1;
         const nextRentals = { ...activeRentalsRef.current };
         let accumulatedIncome = 0; let rep = 0;

         Object.keys(nextRentals).forEach(key => {
            const r = nextRentals[key]; r.timeLeft -= 1;
            const psType = key.split('_')[0];
            
            if (Math.random() < 0.005 && !r.isBroken && !emps.teknisi) { r.isBroken = true; r.dialog = { text: "Woy stik rusak!!", timer: 10 }; }
            if (!r.isBroken && !r.isSmoking && !r.isDirty && Math.random() < 0.02) { r.isDirty = true; r.dialog = { text: "Kotor banget! 🤢", timer: 5 }; }
            if (r.isDirty) { if (emps.janitor) { rep+=1; r.isDirty=false; r.dialog={text:"Bersih dehh ✨",timer:3}; } else if (Math.random()<0.05) rep-=1; }
            if (['sultan', 'vip'].includes(psType) && !r.isBroken && !r.isSmoking && Math.random() < 0.01) { r.isSmoking = true; r.dialog = { text: "Ngebul ah~ 🚬", timer: 15 }; }
            if (r.isSmoking) { if (emps.vip_manager) { rep+=2; delete nextRentals[key]; return; } else if (Math.random()<0.05) rep-=1; }
            if (r.custType === 'sekolah' && newH >= 7 && newH < 17) {
               if (emps.operator) { rep+=1; delete nextRentals[key]; return; } 
               else if (Math.random() < 0.015) { rep-=20; setMoney(m => Math.max(0, m - 500000)); showToast('🚨 RAZIA SATPOL PP! Denda Rp 500k', 'error'); delete nextRentals[key]; return; }
            }

            if (!r.isBroken) {
               let tickIncome = (PS_DATA[psType].rentPrice / 60) * boost; 
               if (r.isSpecial) tickIncome *= 3;
               if (emps.kasir) tickIncome *= 1.1; 
               accumulatedIncome += tickIncome;
            }

            if (r.dialog) { r.dialog.timer -= 1; if (r.dialog.timer <= 0) delete r.dialog; }
            if (!r.dialog && !r.isBroken && !r.isSmoking && !r.isDirty && Math.random() < 0.05) r.dialog = { text: CHAT_BUBBLES[Math.floor(Math.random() * CHAT_BUBBLES.length)], timer: 4 };

            if (fbUnlockedRef.current && !r.fbRequest && !r.isBroken && Math.random() < 0.015) r.fbRequest = { item: FB_MENU[Math.floor(Math.random() * FB_MENU.length)], timer: 15 };
            if (r.fbRequest) {
               if (emps.cook) { accumulatedIncome += r.fbRequest.item.price; rep+=1; delete r.fbRequest; } 
               else { r.fbRequest.timer -= 1; if (r.fbRequest.timer <= 0) { delete r.fbRequest; rep-=3; } }
            }
            if (r.timeLeft <= 0) delete nextRentals[key];
         });

         const spawnRate = emps.marketing ? 0.15 : 0.05;
         ['jadul', 'reguler', 'mantap', 'sultan', 'vip'].forEach(type => {
            for (let i = 0; i < installedPSRef.current[type]; i++) {
               const sk = `${type}_${i}`;
               if (!nextRentals[sk] && Math.random() < spawnRate) {
                   let isSpc = false; let cType = 'umum'; let gName = UMUM_NAMES[Math.floor(Math.random()*UMUM_NAMES.length)];
                   if (newH >= 7 && newH < 17 && Math.random() < 0.3) { cType = 'sekolah'; gName = 'Bolos'; }
                   if ((type === 'sultan' || type === 'vip') && Math.random() < (emps.marketing?0.05:0.02)) { isSpc = true; cType = 'sultan'; gName = SPECIAL_GUESTS[Math.floor(Math.random()*SPECIAL_GUESTS.length)]; }
                   nextRentals[sk] = { timeLeft: (Math.floor(Math.random() * 3) + 1) * 60, isSpecial: isSpc, name: gName, custType: cType, isBroken: false, isSmoking: false, isDirty: false };
               }
            }
         });

         setActiveRentals(nextRentals);
         if (playerProfile?.role !== 'admin') {
             if (accumulatedIncome > 0) setMoney(m => m + accumulatedIncome);
             if (rep !== 0) setReputation(r => Math.min(100, Math.max(0, r + rep)));
         }
      }
    }, 500);
    return () => clearInterval(interval);
  }, [playerProfile, globalConfig, gameOver]);

  // RENDERS
  if (!playerProfile) return <div className="h-screen bg-[#06101e] flex items-center justify-center text-white"><RefreshCw className="animate-spin text-cyan-400" size={40}/></div>;
  if (gameOver) return (<div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center"><AlertOctagon size={80} className="text-rose-600 mb-4 animate-bounce drop-shadow-[0_0_15px_rgba(225,29,72,0.8)]" /><h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-red-700 mb-2 tracking-widest">BANGKRUT!</h1><p className="text-lg text-slate-400 mb-8 font-light">Toko ditutup paksa.</p><button onClick={() => window.location.reload()} className="bg-rose-600 px-8 py-3 rounded-full font-bold">Terima Kenyataan</button></div>);
  if (playerProfile?.is_banned) return (<div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center"><Ban size={100} className="text-rose-600 mb-6 drop-shadow-[0_0_20px_rgba(225,29,72,0.8)]" /><h1 className="text-5xl font-black text-rose-500 mb-2">BANNED</h1><button onClick={onLogout} className="bg-rose-600 px-4 py-2 mt-4 rounded-xl">Keluar</button></div>);

  const NavButton = ({ id, icon: Icon, label, alert = false, extraClass = '' }) => (
    <button onClick={() => setActiveTab(id)} className={`flex flex-col md:flex-row items-center md:justify-start gap-1.5 md:gap-3 w-full p-2 md:px-4 md:py-3 rounded-xl text-[9px] md:text-sm font-semibold transition-all duration-300 relative ${activeTab === id ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.1)]' : 'text-slate-400 hover:text-cyan-300 border border-transparent hover:bg-white/5'} ${extraClass}`}>
      <Icon size={20} className={`shrink-0 ${activeTab === id ? "text-cyan-400" : ""}`} />
      <span className="text-center md:text-left leading-tight hidden sm:block">{label}</span>
      {alert && <span className="absolute top-1 right-1 md:top-3 md:right-3 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></span>}
    </button>
  );

  return (
    <div className="h-screen flex flex-col bg-[#020617] text-slate-200 font-sans overflow-hidden">
      
      <div className="w-full flex flex-col shrink-0 z-50">
        {sysBroadcastMsg && (
           <div className="w-full bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-amber-950 py-1.5 px-4 text-center text-[11px] md:text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.5)] animate-bounce flex justify-center items-center gap-2">
              <Crown size={16} /> [PENCAPAIAN] {sysBroadcastMsg} <Crown size={16} />
           </div>
        )}
        {globalConfig.broadcast && (
           <div className="w-full bg-gradient-to-r from-sky-600 via-cyan-500 to-sky-600 text-white py-1.5 px-4 text-center text-[11px] md:text-xs font-black uppercase tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.5)] animate-pulse flex justify-center items-center gap-2">
              <Megaphone size={14} /> {globalConfig.broadcast} <Megaphone size={14} />
           </div>
        )}
      </div>

      <header className="bg-[#0b1829]/90 backdrop-blur-xl border-b border-cyan-900/30 p-3 px-4 md:px-6 flex justify-between items-center z-20 shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-cyan-600 to-sky-600 p-2 rounded-xl shadow-lg shadow-cyan-500/20 hidden md:block"><Gamepad2 size={24} className="text-white" /></div>
          <div>
            <div className="flex items-center gap-2">
               {isEditingName ? (
                 <input type="text" value={shopName} autoFocus onChange={e => setShopName(e.target.value)} onBlur={() => setIsEditingName(false)} onKeyDown={e => e.key === 'Enter' && setIsEditingName(false)} className="bg-[#06101e] border border-cyan-500/50 text-lg font-black text-white px-2 py-0.5 rounded outline-none w-32 focus:ring-2 ring-cyan-500/30" />
               ) : (
                 <h1 onClick={() => setIsEditingName(true)} className="text-lg font-black text-white cursor-pointer hover:text-cyan-300 flex items-center gap-1.5">{shopName} <Edit2 size={14} /></h1>
               )}
               <span className={`text-[9px] px-2 py-0.5 rounded uppercase font-bold ${playerProfile.role==='admin'?'bg-indigo-500/20 text-indigo-400' : 'bg-slate-500/20 text-slate-400'}`}>{playerProfile.role}</span>
            </div>
            <p className="text-[11px] font-semibold text-cyan-400/80 uppercase">UID: {playerProfile.id.substring(0,6)}... | {playerProfile.username}</p>
          </div>
        </div>
        
        <div className="flex gap-2 md:gap-3 items-center">
          <button onClick={openMailbox} className="relative p-2 bg-[#06101e] border border-cyan-500/30 rounded-full text-cyan-400">
             <Mail size={16} />
             {unreadMails > 0 && <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce">{unreadMails}</span>}
          </button>
          <div className="bg-[#06101e] border border-amber-500/30 px-3 py-1.5 rounded-full flex items-center gap-1.5"><Star size={14} className="text-amber-400" /><span className="text-sm font-bold text-amber-400">{reputation}%</span></div>
          <div className="bg-[#06101e] border border-emerald-500/30 px-3 md:px-4 py-1.5 rounded-full flex items-center gap-2"><DollarSign size={14} className="text-emerald-400" /><span className="text-sm font-bold text-emerald-400">{playerProfile.role === 'admin' ? 'UNLIMITED' : formatRp(Math.floor(money))}</span></div>
          <div className="bg-[#06101e] border border-cyan-500/30 px-3 md:px-4 py-1.5 rounded-full flex items-center gap-2 hidden sm:flex"><Clock size={14} className="text-cyan-400" /><span className="text-sm font-mono font-bold text-white">{formatTime(time.h, time.m)}</span></div>
          <button onClick={onLogout} className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 p-2 rounded-full text-rose-400"><LogOut size={16} /></button>
        </div>
      </header>

      {showMailbox && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-[#0b1829] border border-cyan-500/30 w-full max-w-lg rounded-3xl shadow-[0_0_40px_rgba(6,182,212,0.2)] overflow-hidden flex flex-col max-h-[80vh]">
               <div className="bg-[#06101e] p-4 border-b border-cyan-900/50 flex justify-between items-center">
                  <h2 className="text-lg font-black text-white flex items-center gap-2"><Inbox className="text-cyan-400"/> Mailbox</h2>
                  <button onClick={() => setShowMailbox(false)} className="text-slate-400"><XCircle size={20}/></button>
               </div>
               <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                  {(!playerProfile.mail || playerProfile.mail.length === 0) ? <div className="text-center text-slate-500 py-10">Kosong</div> : 
                     [...playerProfile.mail].reverse().map(m => (
                        <div key={m.id} className="bg-white/5 p-4 rounded-xl border border-white/10">
                           <h3 className="font-bold text-sm text-cyan-300">{m.title}</h3>
                           <p className="text-sm text-slate-300 mt-2">{m.body}</p>
                           {m.has_attachment && (
                               <div className="mt-4 pt-3 border-t border-white/10">
                                   {!m.is_claimed ? <button onClick={() => handleClaimMail(m.id)} className="bg-emerald-600 px-4 py-2 text-xs font-bold rounded-lg text-white">Klaim</button> : <div className="text-emerald-500 text-[10px] font-bold">Diklaim</div>}
                               </div>
                           )}
                        </div>
                     ))
                  }
               </div>
            </div>
         </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-[70px] sm:w-[85px] md:w-[220px] bg-[#0b1829]/60 backdrop-blur-md border-r border-cyan-900/30 p-2 md:p-4 shrink-0 flex flex-col gap-2 z-10 overflow-y-auto custom-scrollbar">
          <NavButton id="rental" icon={LayoutGrid} label="Area Bermain" />
          <NavButton id="toko" icon={ShoppingCart} label="Toko" />
          <NavButton id="inventory" icon={ScrollText} label="Gudang" />
          <NavButton id="trade" icon={Repeat} label="Trade" />
          <div className="my-1 border-t border-cyan-900/50 w-full shrink-0" />
          <NavButton id="gacha" icon={Dices} label="Gacha Saldo" extraClass="text-amber-400 hover:text-amber-300 border-amber-500/20" />
          <NavButton id="pinjol" icon={Landmark} label="Bank Pinjol" alert={(playerProfile?.debt || 0) > 0} extraClass="text-rose-400 hover:text-rose-300 border-rose-500/20" />
          <div className="my-1 border-t border-cyan-900/50 w-full shrink-0" />
          <NavButton id="topup" icon={CreditCard} label="Order Premium" extraClass="text-emerald-400" />
          <NavButton id="sambilan" icon={Briefcase} label="Kerja Part-Time" />
          <NavButton id="karyawan" icon={Users} label="Karyawan" />
          <div className="my-1 border-t border-cyan-900/50 w-full shrink-0" />
          <NavButton id="berita" icon={Newspaper} label="Kabar Rental" alert={globalConfig.dailyNews !== ''} />
          <NavButton id="globalChat" icon={Globe} label="Global Chat" />
          <NavButton id="feedback" icon={Bug} label="Report Bug" />
          <div className="my-1 border-t border-cyan-900/50 w-full shrink-0" />
          {(playerProfile.role === 'admin' || playerProfile.role === 'moderator') && (
            <NavButton id="admin" icon={ShieldCheck} label="Admin Panel" />
          )}
        </aside>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 relative bg-gradient-to-b from-[#020617] via-[#082f49] to-[#020617] custom-scrollbar">
          
          {/* TAB RENTAL */}
          {activeTab === 'rental' && (
            <div className="max-w-7xl mx-auto space-y-6">
              {buildingLvl < BUILDINGS.length - 1 && (
                <button onClick={upgradeBuilding} className="w-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 p-3 rounded-xl font-bold flex justify-center items-center gap-2">
                  <ArrowUpCircle size={18} /> Tingkatkan ke {BUILDINGS[buildingLvl + 1].name} ({playerProfile.role === 'admin' ? 'FREE' : formatRp(BUILDINGS[buildingLvl + 1].price)})
                </button>
              )}
              {BUILDINGS[buildingLvl].layout.map((floor, idx) => (
                <div key={idx} className="bg-[#0b1829]/60 border border-cyan-900/50 rounded-3xl p-5">
                  <h3 className="text-sm font-black text-white uppercase mb-4">{floor.name}</h3>
                  {floor.types.map(type => (
                    <div key={type} className="mb-6 bg-[#06101e]/80 p-4 rounded-2xl border border-white/5">
                      <div className="flex justify-between items-center mb-4 text-white font-bold">{PS_DATA[type].name}</div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                        {Array.from({ length: BUILDINGS[buildingLvl].slots[type] }).map((_, slotIdx) => {
                          const isInst = slotIdx < installedPS[type];
                          const sk = `${type}_${slotIdx}`;
                          const rd = activeRentals[sk];
                          if (!isInst) return <button key={slotIdx} onClick={() => installPS(type)} className="h-32 border border-dashed border-cyan-900/50 bg-[#0b1829]/40 rounded-2xl text-slate-500 hover:text-cyan-300">Pasang</button>;
                          return (
                            <div key={slotIdx} className={`h-32 rounded-2xl flex flex-col items-center justify-center relative border overflow-hidden transition-all group ${isOpen&&rd ? 'bg-cyan-950/40 border-cyan-500/30' : 'bg-[#020617] border-white/5'}`}>
                              {(!isOpen || !rd) && <button onClick={() => uninstallPS(type)} className="absolute top-2 right-2 p-2 bg-rose-500/80 text-white rounded-lg opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>}
                              <Monitor size={32} className={isOpen&&rd ? "text-cyan-400 drop-shadow-md" : "text-slate-700"} />
                              {isOpen && rd && (
                                 <>
                                   <div className="absolute bottom-0 w-full p-1.5 flex justify-between bg-black/80 text-[10px] text-cyan-400 font-bold"><span>{rd.name}</span><span>{Math.ceil(rd.timeLeft)}m</span></div>
                                   {rd.dialog && <div className="absolute top-2 bg-white text-slate-900 text-[9px] px-2 py-1 rounded-lg z-40">{rd.dialog.text}</div>}
                                 </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* TAB TOKO */}
          {activeTab === 'toko' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="bg-[#0b1829]/60 border border-cyan-900/50 rounded-3xl p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {Object.entries(PS_DATA).filter(([k]) => k !== 'vip').map(([key, data]) => (
                      <div key={key} className="bg-[#06101e]/80 p-4 rounded-2xl border border-white/5 flex flex-col items-center text-center">
                        <Gamepad2 size={24} className="text-white mb-2" />
                        <div className="text-sm font-bold text-white mb-1">{data.name}</div>
                        <div className="text-xs font-semibold text-emerald-400 mb-4">{formatRp(getDiscountedPrice(data.price))}</div>
                        <button onClick={() => buyPS(key)} className="w-full bg-cyan-600 hover:bg-cyan-500 py-2 rounded-xl text-xs font-bold text-white">Beli</button>
                      </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB GUDANG */}
          {activeTab === 'inventory' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-5xl mx-auto">
               {Object.entries(inventory).map(([key, count]) => (
                  <div key={key} className="bg-[#0b1829]/60 p-6 rounded-3xl border border-white/10 text-center shadow-xl">
                    <div className="text-sm font-bold text-white mb-2">{PS_DATA[key]?.name}</div>
                    <div className="text-5xl font-black text-cyan-400 mb-6">{count}</div>
                    <button onClick={() => sellPS(key)} disabled={count === 0} className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-bold">Jual ({formatRp((PS_DATA[key]?.price||0)*0.7)})</button>
                  </div>
                ))}
            </div>
          )}

          {/* TAB TRADE */}
          {activeTab === 'trade' && (
             <div className="max-w-3xl mx-auto bg-[#0b1829]/80 rounded-3xl border border-cyan-500/20 p-6 md:p-8">
                <h2 className="text-2xl font-black text-white mb-6">Trade Player</h2>
                <form onSubmit={handleTradeSubmit} className="space-y-4">
                   <select value={tradeTarget} onChange={e => setTradeTarget(e.target.value)} className="w-full bg-[#06101e] border border-cyan-900/50 rounded-xl px-4 py-3 text-white">
                      <option value="">-- Pilih Player --</option>
                      {allPlayers.filter(p => p.id !== playerProfile.id).map(p => <option key={p.id} value={p.id}>{p.username}</option>)}
                   </select>
                   <select value={tradeType} onChange={e => setTradeType(e.target.value)} className="w-full bg-[#06101e] border border-cyan-900/50 rounded-xl px-4 py-3 text-white">
                      <option value="money">Uang / Saldo</option>
                      {Object.keys(PS_DATA).filter(k=>k!=='vip').map(k => <option key={k} value={k}>Mesin {PS_DATA[k].name}</option>)}
                   </select>
                   <input type="number" value={tradeAmount} onChange={e => setTradeAmount(e.target.value)} placeholder="Jumlah" className="w-full bg-[#06101e] border border-cyan-900/50 rounded-xl px-4 py-3 text-white" />
                   <button type="submit" className="w-full bg-emerald-600 py-3 rounded-xl font-bold text-white">Kirim Trade</button>
                </form>
             </div>
          )}

          {/* TAB GACHA */}
          {activeTab === 'gacha' && (
             <div className="max-w-3xl mx-auto bg-gradient-to-b from-[#0b1829] to-[#06101e] rounded-3xl border border-amber-500/30 p-8 text-center">
                 <Dices size={80} className="text-amber-400 mx-auto mb-6" />
                 <h2 className="text-3xl font-black text-amber-400 mb-6">Gacha Saldo</h2>
                 <input type="number" value={gachaBet} onChange={e => setGachaBet(e.target.value)} placeholder="Nominal Taruhan" className="w-full max-w-md bg-[#06101e] border border-amber-900/50 rounded-xl px-4 py-3 text-xl font-black text-center text-white mb-4" />
                 <button onClick={handleGacha} disabled={isGachaRolling} className="w-full max-w-md bg-amber-600 hover:bg-amber-500 text-white font-black py-4 rounded-xl">ROLL GACHA</button>
             </div>
          )}

          {/* TAB PINJOL */}
          {activeTab === 'pinjol' && (
             <div className="max-w-4xl mx-auto flex gap-6">
                 <div className="flex-1 bg-[#0b1829] p-6 rounded-3xl border border-rose-500/30 text-center">
                     <h3 className="text-slate-400 mb-2">Total Hutang</h3>
                     <div className="text-4xl font-black text-rose-500 mb-6">{formatRp(playerProfile?.debt || 0)}</div>
                     <input type="number" value={payPinjolAmount} onChange={e=>setPayPinjolAmount(e.target.value)} placeholder="Nominal Bayar" className="w-full bg-black/50 p-3 rounded-xl text-white mb-2" />
                     <button onClick={handlePayPinjol} className="w-full bg-rose-600 py-3 rounded-xl font-bold text-white">Bayar Hutang</button>
                 </div>
                 <div className="flex-1 bg-[#0b1829] p-6 rounded-3xl border border-emerald-500/30 text-center">
                     <h3 className="text-slate-400 mb-2">Pinjam Uang (Bunga {globalConfig.pinjolInterest}%)</h3>
                     <input type="number" value={pinjolAmount} onChange={e=>setPinjolAmount(e.target.value)} placeholder="Nominal Pinjam" className="w-full bg-black/50 p-3 rounded-xl text-white mb-2 mt-12" />
                     <button onClick={handlePinjam} className="w-full bg-emerald-600 py-3 rounded-xl font-bold text-white">Ajukan Pinjaman</button>
                 </div>
             </div>
          )}

          {/* TAB GLOBAL CHAT */}
          {activeTab === 'globalChat' && (
            <div className="max-w-4xl mx-auto h-[calc(100vh-180px)] bg-[#0b1829]/80 rounded-2xl border border-cyan-900/50 flex flex-col">
               <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                  {globalChat.map(msg => (
                     <div key={msg.id} className={`flex flex-col w-full ${msg.uid === playerProfile.id ? 'items-end' : 'items-start'}`}>
                        <div className="text-[10px] text-slate-400 mb-1">{msg.sender} [{msg.role}]</div>
                        <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${msg.uid === playerProfile.id ? 'bg-cyan-600 text-white' : 'bg-[#06101e] border border-cyan-900/50 text-slate-200'}`}>
                           {msg.text}
                        </div>
                     </div>
                  ))}
                  <div ref={globalChatEndRef} />
               </div>
               <form onSubmit={sendGlobalChatHandler} className="p-3 bg-[#06101e] flex gap-2 border-t border-cyan-900/50">
                  <input type="text" value={globalChatInput} onChange={e => setGlobalChatInput(e.target.value)} placeholder="Ketik pesan..." className="flex-1 bg-[#0b1829] rounded-xl px-4 py-2 text-white" />
                  <button type="submit" className="bg-cyan-600 px-4 rounded-xl text-white"><Send size={18} /></button>
               </form>
            </div>
          )}

          {/* TAB ADMIN */}
          {activeTab === 'admin' && playerProfile.role === 'admin' && (
             <div className="max-w-6xl mx-auto bg-indigo-950/20 p-6 rounded-3xl border border-indigo-500/30">
                 <h2 className="text-xl font-black text-white mb-6">Server Control Panel</h2>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="bg-black/50 p-4 rounded-2xl">
                        <h3 className="text-sm font-bold text-white mb-3">Kirim Hadiah/Mail</h3>
                        <select value={adminSendTarget} onChange={e => setAdminSendTarget(e.target.value)} className="w-full bg-[#06101e] p-2 text-white mb-2"><option value="">Pilih Player</option>{allPlayers.map(p => <option key={p.id} value={p.id}>{p.username}</option>)}</select>
                        <select value={adminSendType} onChange={e => setAdminSendType(e.target.value)} className="w-full bg-[#06101e] p-2 text-white mb-2"><option value="money">Uang</option></select>
                        <input type="number" value={adminSendAmount} onChange={e=>setAdminSendAmount(e.target.value)} placeholder="Jumlah" className="w-full bg-[#06101e] p-2 text-white mb-2"/>
                        <button onClick={handleAdminDirectSend} className="w-full bg-emerald-600 p-2 rounded text-white font-bold">Kirim</button>
                    </div>
                    <div className="bg-black/50 p-4 rounded-2xl">
                        <h3 className="text-sm font-bold text-white mb-3">Global Setting</h3>
                        <button onClick={() => adminSetGlobal('maintenance', !globalConfig.maintenance)} className="w-full bg-rose-600 p-2 rounded text-white mb-2">Toggle Maintenance (Kini: {globalConfig.maintenance?'ON':'OFF'})</button>
                        <input type="text" value={broadcastInput} onChange={e=>setBroadcastInput(e.target.value)} placeholder="Teks Siaran" className="w-full bg-[#06101e] p-2 text-white mb-2" />
                        <button onClick={() => {sendApiAction('updateConfig', {broadcast: broadcastInput}); setBroadcastInput('');}} className="w-full bg-sky-600 p-2 rounded text-white">Set Broadcast</button>
                    </div>
                 </div>
             </div>
          )}

        </main>
      </div>
    </div>
  );
}

// ==========================================
// 3. KOMPONEN APP ROOT
// ==========================================
export default function App() {
   const [session, setSession] = useState(null);
   const [toasts, setToasts] = useState([]);

   useEffect(() => {
       const tk = localStorage.getItem('ps_token');
       const usr = localStorage.getItem('ps_user');
       if (tk && usr) setSession({ token: tk, user: JSON.parse(usr) });
   }, []);

   const showToast = (msg, type = 'info') => {
       const id = Date.now() + Math.random();
       setToasts(prev => [...prev, { id, msg: String(msg), type }].slice(-5));
       setTimeout(() => { setToasts(prev => prev.filter(t => t.id !== id)); }, 3000);
   };

   return (
       <>
          {!session ? (
              <LoginPage 
                 onLoginSuccess={(user, token) => {
                    localStorage.setItem('ps_token', token);
                    localStorage.setItem('ps_user', JSON.stringify(user));
                    setSession({ user, token });
                 }} 
                 showToast={showToast} 
              />
          ) : (
              <Game 
                 session={session} 
                 onLogout={() => { localStorage.removeItem('ps_token'); localStorage.removeItem('ps_user'); setSession(null); }} 
                 showToast={showToast} 
              />
          )}

          <div className="fixed bottom-6 right-6 z-[999] pointer-events-none flex flex-col gap-3 items-end">
             {toasts.map((toast) => (
                <div key={toast.id} className={`pointer-events-auto px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl animate-in fade-in text-xs font-bold border flex items-center gap-3 ${toast.type === 'error' ? 'bg-rose-950/90 text-rose-100 border-rose-500/50 shadow-[0_0_20px_rgba(225,29,72,0.4)]' : toast.type === 'success' ? 'bg-emerald-950/90 text-emerald-100 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.4)]' : toast.type === 'special' ? 'bg-amber-950/90 text-amber-100 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.4)]' : 'bg-cyan-950/90 text-cyan-100 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.4)]'}`}>
                  <span>{toast.msg}</span>
                </div>
             ))}
          </div>
          <style>{`.custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(34,211,238,0.2); border-radius: 10px; } .animate-in { animation: animateIn 0.3s forwards; } @keyframes animateIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }`}</style>
       </>
   );
}
