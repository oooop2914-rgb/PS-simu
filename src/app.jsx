import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Clock, DollarSign, Store, ShoppingCart, UserX, AlertTriangle, 
  Coffee, ArrowUpCircle, MessageCircle, Monitor, Star, AlertOctagon, 
  Edit2, Users, ChefHat, ShieldAlert, BadgeCheck, Gamepad2, ScrollText, 
  Trash2, User, LayoutGrid, RefreshCw, Send, CheckCircle2, XCircle,
  Wrench, Megaphone, Calculator, Smartphone, ChevronLeft, Bell,
  Briefcase, ScanLine, Volume2, VolumeX, FastForward,
  Wind, Ban, Globe, Zap, Settings, ShieldCheck, Tag, LogOut, Bug, MessageSquare,
  Repeat, Sparkles, Code, Trophy, CreditCard, Mail, Inbox, Crown, Award,
  Dices, Landmark, HeartHandshake, Skull, Newspaper
} from 'lucide-react';

// --- FIREBASE CLOUD SAVE INIT ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, onSnapshot, addDoc, updateDoc, deleteDoc, arrayUnion } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCoCYVkOhu2QkSHEdh1hadm4EAwP4tZcr4",
 authDomain: "kontol-5833b.firebaseapp.com",
 databaseURL: "https://kontol-5833b-default-rtdb.asia-southeast1.firebasedatabase.app",
 projectId: "kontol-5833b",
 storageBucket: "kontol-5833b.firebasestorage.app",
 messagingSenderId: "626160457953",
 appId: "1:626160457953:web:6ec05e747fd2036b697fa0"
};

let app, auth, db, appId;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  appId = "juragan-ps-server-1";
} catch (e) {
  console.error("Firebase init failed", e);
}

// --- AKUN ADMIN KHUSUS & PASSWORD ---
// Catatan: Key/Username wajib huruf kecil semua di sini
const ADMIN_ACCOUNTS = {
  'ryo': 'pokemon12',
  'binz': 'DcF5e13',
  'ftrbl': 'NuF24k',
};

// --- DATABASE & CONSTANTS ---
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

export default function App() {
  // --- AUTH & MULTIPLAYER STATE ---
  const [user, setUser] = useState(null);
  const [playerProfile, setPlayerProfile] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authInput, setAuthInput] = useState('');
  const [authSecret, setAuthSecret] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  
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
  const [shopName, setShopName] = useState("Juragan PS");
  const [isEditingName, setIsEditingName] = useState(false);
  const [money, setMoney] = useState(1800000); 
  const [reputation, setReputation] = useState(100);
  const [time, setTime] = useState({ h: 7, m: 0 });
  const [day, setDay] = useState(1);
  const [isOpen, setIsOpen] = useState(true);
  const [buildingLvl, setBuildingLvl] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  const [inventory, setInventory] = useState({ jadul: 0, reguler: 0, mantap: 0, sultan: 0 });
  const [installedPS, setInstalledPS] = useState({ jadul: 0, reguler: 0, mantap: 0, sultan: 0, vip: 0 });
  const [activeRentals, setActiveRentals] = useState({});
  const [toasts, setToasts] = useState([]); 
  const [activeTab, setActiveTab] = useState('rental');
  
  // MAILBOX
  const [showMailbox, setShowMailbox] = useState(false);
  const unreadMails = playerProfile?.mail ? playerProfile.mail.filter(m => !m.read).length : 0;

  // FASILITAS 
  const [fbUnlocked, setFbUnlocked] = useState(false);
  const [fanUnlocked, setFanUnlocked] = useState(false);
  const [acUnlocked, setAcUnlocked] = useState(false);

  // GACHA & PINJOL STATE
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
  
  // ROLE STATE ADMIN
  const [adminRoleTarget, setAdminRoleTarget] = useState('');
  const [adminRoleType, setAdminRoleType] = useState('user');

  // TRADE STATE
  const [tradeTarget, setTradeTarget] = useState('');
  const [tradeType, setTradeType] = useState('money');
  const [tradeAmount, setTradeAmount] = useState('');

  // KARYAWAN & KERJA
  const [hiredEmployees, setHiredEmployees] = useState({ operator: null, cook: null, teknisi: null, marketing: null, kasir: null, vip_manager: null, janitor: null });
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
  const lastTxIdRef = useRef(0);

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

  // Cek Game Over Reputasi
  useEffect(() => {
     if (reputation <= 0 && !gameOver) {
         setGameOver(true);
         setIsOpen(false);
     }
  }, [reputation, gameOver]);

  // FIX: Menggunakan string concatenation biasa agar tidak error "Expected ) but found $" di Vite
  const formatRp = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  const formatTime = (h, m) => {
      const jam = h.toString().padStart(2, '0');
      const menit = m.toString().padStart(2, '0');
      return jam + ':' + menit;
  };
  
  const showToast = (msg, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, msg, type }].slice(-5));
    setTimeout(() => { setToasts(prev => prev.filter(t => t.id !== id)); }, 3000);
  };

  // --- FIREBASE INIT & LISTENERS (MENDUKUNG HP) ---
  useEffect(() => {
    if (!auth) { setIsAuthLoading(false); return; }

    const unsubscribeAuth = onAuthStateChanged(auth, async (currUser) => {
      try {
        setUser(currUser);
        if (currUser) {
           const profileRef = doc(db, 'artifacts', appId, 'public', 'data', 'players', currUser.uid);
           const snap = await getDoc(profileRef);
           if (snap.exists()) {
               const data = snap.data();
               setPlayerProfile({ id: currUser.uid, ...data });
               setMoney(data.money || 1800000);
               setReputation(data.reputation !== undefined ? data.reputation : 100);
               setInventory(data.inventory || { jadul: 0, reguler: 0, mantap: 0, sultan: 0 });
               setShopName(data.shopName || "Juragan PS");
               setFbUnlocked(data.fbUnlocked || false);
               setFanUnlocked(data.fanUnlocked || false);
               setAcUnlocked(data.acUnlocked || false);
               lastTxIdRef.current = data.txId || 0;
           }
        } else {
           setPlayerProfile(null);
        }
      } catch (err) {
        console.error("Error loading user profile:", err);
      } finally {
        setIsAuthLoading(false);
      }
    }, (error) => {
      // PENANGANAN ERROR AGAR APP TIDAK CRASH (BLANK PUTIH)
      console.error("Auth Listener Error:", error);
      setIsAuthLoading(false);
      showToast("Gagal terhubung ke Server Otentikasi.", "error");
    });

    return () => unsubscribeAuth();
  }, []);

  // Sync Global Data & Admin Lists
  useEffect(() => {
    if (!db) return;

    const configRef = doc(db, 'artifacts', appId, 'public', 'data', 'globalConfig', 'settings');
    const unsubConfig = onSnapshot(configRef, (docSnap) => {
       if (docSnap.exists()) setGlobalConfig(docSnap.data());
       else setDoc(configRef, { boost: 1, discount: 0, maintenance: false, broadcast: '', dailyNews: '', pinjolInterest: 20 });
    }, (err) => console.error(err));

    const chatRef = collection(db, 'artifacts', appId, 'public', 'data', 'globalChat');
    const unsubChat = onSnapshot(chatRef, (snap) => {
       const msgs = [];
       snap.forEach(d => msgs.push({ id: d.id, ...d.data() }));
       msgs.sort((a, b) => a.timestamp - b.timestamp);
       setGlobalChat(msgs.slice(-50)); 
    }, (err) => console.error(err));

    const playersRef = collection(db, 'artifacts', appId, 'public', 'data', 'players');
    const unsubPlayers = onSnapshot(playersRef, (snap) => {
       const p = [];
       snap.forEach(d => p.push({ id: d.id, ...d.data() }));
       setAllPlayers(p);
       
       setPlayerProfile(prevProfile => {
           if (!prevProfile) return prevProfile;
           const me = p.find(x => x.id === prevProfile.id);
           if (me) {
               if (me.txId && me.txId !== lastTxIdRef.current) {
                   lastTxIdRef.current = me.txId;
                   setMoney(me.money);
                   if (me.inventory) setInventory(me.inventory);
               }
               return { id: me.id, ...me }; 
           }
           return prevProfile;
       });
    }, (err) => console.error(err));

    const repRef = collection(db, 'artifacts', appId, 'public', 'data', 'reports');
    const unsubRep = onSnapshot(repRef, (snap) => {
        const r = [];
        snap.forEach(d => r.push({ id: d.id, ...d.data() }));
        r.sort((a, b) => b.timestamp - a.timestamp);
        setReports(r);
    }, (err) => console.error(err));

    return () => { unsubConfig(); unsubChat(); unsubPlayers(); unsubRep(); };
  }, [user]);

  // Listener untuk Broadcast Pencapaian Sistem
  useEffect(() => {
      if (globalConfig?.sysBroadcast?.time) {
          setSysBroadcastMsg(globalConfig.sysBroadcast.message);
          const timer = setTimeout(() => setSysBroadcastMsg(null), 10000);
          return () => clearTimeout(timer);
      }
  }, [globalConfig?.sysBroadcast?.time]);

  const triggerSystemBroadcast = async (msg) => {
      try {
          const configRef = doc(db, 'artifacts', appId, 'public', 'data', 'globalConfig', 'settings');
          await updateDoc(configRef, { sysBroadcast: { message: msg, time: Date.now() } });
      } catch(e) { console.error("Broadcast fail", e); }
  };

  // Pengecekan Achievement Kekayaan
  useEffect(() => {
      if (!playerProfile || playerProfile.role === 'admin' || !db) return;
      
      const checkAchievements = async () => {
          const achieved = playerProfile.achieved || { m5: false, m10: false, m100: false };
          let isUpdated = false;
          let newAchieved = { ...achieved };

          if (money >= 5000000 && !newAchieved.m5) {
              newAchieved.m5 = true; isUpdated = true;
              triggerSystemBroadcast(`🎉 LUAR BIASA! ${playerProfile.username} baru saja mencapai Kekayaan Rp 5 Juta!`);
          }
          if (money >= 10000000 && !newAchieved.m10) {
              newAchieved.m10 = true; isUpdated = true;
              triggerSystemBroadcast(`🔥 GILA! ${playerProfile.username} berhasil menyentuh Kekayaan Rp 10 Juta!`);
          }
          if (money >= 100000000 && !newAchieved.m100) {
              newAchieved.m100 = true; isUpdated = true;
              triggerSystemBroadcast(`👑 SULTAN BARU SERVER! ${playerProfile.username} telah menembus Saldo Rp 100 JUTA!`);
          }

          if (isUpdated) {
              const profileRef = doc(db, 'artifacts', appId, 'public', 'data', 'players', playerProfile.id);
              await updateDoc(profileRef, { achieved: newAchieved });
              setPlayerProfile(prev => ({...prev, achieved: newAchieved}));
          }
      };
      checkAchievements();
  }, [money, playerProfile]);

  // Realtime Sync Saldo & Inventory (Routine Save)
  useEffect(() => {
     if (!playerProfile || gameOverRef.current) return;
     const interval = setInterval(() => {
        const profileRef = doc(db, 'artifacts', appId, 'public', 'data', 'players', playerProfile.id);
        updateDoc(profileRef, { 
            money: moneyRef.current, 
            reputation: reputationRef.current,
            inventory, 
            fbUnlocked: fbUnlockedRef.current,
            fanUnlocked: fanUnlockedRef.current, 
            acUnlocked: acUnlockedRef.current,
            shopName: shopNameRef.current
        }).catch(e => console.log(e));
     }, 10000);
     return () => clearInterval(interval);
  }, [playerProfile, inventory]);


  // --- SECURITY & UNIVERSAL LOGIN (FIX UNTUK HP/ANDROID) ---
  const handleAuth = async (e) => {
    e.preventDefault();
    const inputUser = authInput.trim();
    const inputPw = authSecret.trim();

    if (!inputUser || inputUser.length < 3) return showToast("Username minimal 3 karakter!", "error");
    if (!inputPw || inputPw.length < 6) return showToast("Password minimal 6 karakter!", "error");
    
    setIsAuthLoading(true);
    const dummyEmail = `${inputUser.toLowerCase()}@juraganps.com`;
    
    try {
      let role = 'user';
      const lowerUser = inputUser.toLowerCase();
      if (ADMIN_ACCOUNTS[lowerUser]) {
          if (inputPw !== ADMIN_ACCOUNTS[lowerUser]) {
              setIsAuthLoading(false);
              return showToast("Akses Admin Ditolak! Password Salah.", "error");
          }
          role = 'admin';
      }

      if (isRegistering) {
          const existingAccount = allPlayers.find(p => p.username.toLowerCase() === lowerUser);
          if (existingAccount) {
              setIsAuthLoading(false);
              return showToast("Username sudah dipakai orang lain!", "error");
          }

          const userCredential = await createUserWithEmailAndPassword(auth, dummyEmail, inputPw);
          const newId = userCredential.user.uid;
          
          const newData = { 
              username: inputUser, 
              role, 
              money: 1800000, 
              reputation: 100,
              debt: 0,
              inventory: { jadul: 0, reguler: 0, mantap: 0, sultan: 0 }, 
              isBanned: false, 
              joined: Date.now(), 
              txId: Date.now(),
              fbUnlocked: false,
