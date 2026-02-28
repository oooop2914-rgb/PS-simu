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
  appId = "1:626160457953:web:6ec05e747fd2036b697fa0";
} catch (e) {
  console.error("Firebase init failed", e);
}

// --- AKUN ADMIN KHUSUS & PASSWORD ---
// Catatan: Key/Username wajib huruf kecil semua di sini
const ADMIN_ACCOUNTS = {
  'ryo': 'pikachu12',
  'binz': 'bolbasur12',
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
              fanUnlocked: false, 
              acUnlocked: false, 
              mail: [],
              achieved: { m5: false, m10: false, m100: false },
              shopName: "Juragan PS"
          };
          
          const profileRef = doc(db, 'artifacts', appId, 'public', 'data', 'players', newId);
          await setDoc(profileRef, newData);
          showToast(`Berhasil mendaftar! Selamat datang ${inputUser}`, "success");

      } else {
          await signInWithEmailAndPassword(auth, dummyEmail, inputPw);
          showToast("Berhasil Masuk!", "success");
      }
    } catch (error) {
      console.error(error);
      
      // ERROR HANDLER BARU (Menangkap error dari konfigurasi Firebase)
      if (error.code === 'auth/configuration-not-found') {
          showToast("Firebase Error: Domain belum diizinkan, atau API Key salah.", "error");
      } else if (error.code === 'auth/operation-not-allowed') {
          showToast("Firebase Error: Fitur Email/Password belum diaktifkan di Console.", "error");
      } else if (error.code === 'auth/email-already-in-use') {
          showToast("Username sudah terdaftar. Silakan pindah ke mode Masuk.", "error");
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
          showToast("Username atau Password salah!", "error");
      } else {
          showToast(`Gagal: ${error.message || "Periksa koneksi Anda."}`, "error");
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
      await signOut(auth);
      setPlayerProfile(null);
      setAuthInput('');
      setAuthSecret('');
      setActiveTab('rental');
      showToast("Berhasil Keluar.", "success");
  };

  // --- KLAIM HADIAH MAILBOX ---
  const handleClaimMail = async (mailId) => {
      const mailItem = playerProfile.mail.find(m => m.id === mailId);
      if (!mailItem || mailItem.isClaimed || !mailItem.hasAttachment) return;

      let updatedMoney = moneyRef.current;
      let updatedInventory = { ...inventory };

      if (mailItem.attachmentType === 'money') {
          updatedMoney += mailItem.attachmentAmount;
          setMoney(updatedMoney);
      } else {
          updatedInventory[mailItem.attachmentType] += mailItem.attachmentAmount;
          setInventory(updatedInventory);
      }

      const updatedMails = playerProfile.mail.map(m =>
          m.id === mailId ? { ...m, isClaimed: true } : m
      );

      setPlayerProfile(prev => ({ ...prev, mail: updatedMails }));

      try {
          const profileRef = doc(db, 'artifacts', appId, 'public', 'data', 'players', playerProfile.id);
          await updateDoc(profileRef, {
              money: updatedMoney,
              inventory: updatedInventory,
              mail: updatedMails,
              txId: Date.now()
          });
          showToast(`Berhasil mengklaim ${mailItem.attachmentAmount} ${mailItem.attachmentType === 'money' ? 'Saldo' : PS_DATA[mailItem.attachmentType].name}!`, "success");
      } catch (err) {
          showToast("Gagal mengklaim hadiah.", "error");
      }
  };

  // --- KLAIM GAJI HARIAN (PREMIUM ROLE) ---
  const handleClaimDaily = async () => {
      const today = new Date().setHours(0,0,0,0);
      if ((playerProfile.lastDailyClaim || 0) >= today) return showToast("Sudah klaim hari ini!", "error");

      let bonus = 0;
      if (playerProfile.role === 'manajer') bonus = 150000;
      else if (playerProfile.role === 'direktur') bonus = 300000;
      else if (playerProfile.role === 'ceo') bonus = 550000;

      if (bonus === 0) return;

      try {
          const profileRef = doc(db, 'artifacts', appId, 'public', 'data', 'players', playerProfile.id);
          await updateDoc(profileRef, {
              money: moneyRef.current + bonus,
              lastDailyClaim: Date.now(),
              txId: Date.now()
          });
          setMoney(m => m + bonus);
          setPlayerProfile(prev => ({...prev, lastDailyClaim: Date.now()}));
          showToast(`Berhasil klaim Gaji Harian Rp ${bonus.toLocaleString()}!`, "success");
      } catch (e) { showToast("Gagal klaim gaji harian", "error"); }
  };

  // MAILBOX
  const openMailbox = async () => {
      setShowMailbox(true);
      if (playerProfile.mail && playerProfile.mail.some(m => !m.read)) {
          const updatedMail = playerProfile.mail.map(m => ({...m, read: true}));
          const profileRef = doc(db, 'artifacts', appId, 'public', 'data', 'players', playerProfile.id);
          await updateDoc(profileRef, { mail: updatedMail });
      }
  };

  const sendGlobalChat = async (e) => {
     e.preventDefault();
     if (!globalChatInput.trim() || !playerProfile) return;
     try {
       const chatRef = collection(db, 'artifacts', appId, 'public', 'data', 'globalChat');
       await addDoc(chatRef, {
          sender: playerProfile.username,
          role: playerProfile.role,
          uid: playerProfile.id,
          text: globalChatInput.trim(),
          timestamp: Date.now()
       });
       setGlobalChatInput('');
     } catch (e) { showToast("Gagal mengirim pesan", "error"); }
  };

  const submitReport = async (e) => {
     e.preventDefault();
     if (!reportInput.trim() || !playerProfile) return;
     try {
         const repRef = collection(db, 'artifacts', appId, 'public', 'data', 'reports');
         await addDoc(repRef, {
             sender: playerProfile.username,
             uid: playerProfile.id,
             text: reportInput.trim(),
             type: 'bug',
             timestamp: Date.now(),
         });
         setReportInput('');
         showToast("Laporan berhasil dikirim ke Admin!", "success");
     } catch(e) { showToast("Gagal mengirim laporan", "error"); }
  };

  const submitAppeal = async () => {
      if (!appealInput.trim()) return showToast("Pesan banding tidak boleh kosong", "error");
      try {
         const repRef = collection(db, 'artifacts', appId, 'public', 'data', 'reports');
         await addDoc(repRef, {
             sender: playerProfile.username,
             uid: playerProfile.id,
             text: appealInput.trim(),
             type: 'appeal',
             timestamp: Date.now(),
         });
         setAppealInput('');
         showToast("Banding Anda telah dikirim dan menunggu persetujuan Admin!", "success");
      } catch(e) { showToast("Gagal mengirim banding", "error"); }
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
          
          if (roll < 0.60) multiplier = 0; // 60%: Ampas 0x
          else if (roll < 0.90) multiplier = 1.5; // 30%: 1.5x
          else if (roll < 0.99) multiplier = 2; // 9%: 2x
          else multiplier = 10; // 1%: JACKPOT 10x

          const winAmount = cost * multiplier;

          if (playerProfile.role !== 'admin') {
              setMoney(m => {
                 const finalMoney = m + winAmount;
                 const profileRef = doc(db, 'artifacts', appId, 'public', 'data', 'players', playerProfile.id);
                 updateDoc(profileRef, { money: finalMoney, txId: Date.now() }).catch(()=>{});
                 return finalMoney;
              });
          }
          
          setIsGachaRolling(false);
          
          if (multiplier >= 10) {
              showToast(`🎰 JACKPOT! Menang ${multiplier}x (+Rp ${formatRp(winAmount)})!`, "special");
              if (playerProfile.role !== 'admin') triggerSystemBroadcast(`🎰 JACKPOT! ${playerProfile.username} baru saja memenangkan Gacha ${multiplier}x Lipat (Rp ${formatRp(winAmount)})!`);
          } else if (multiplier > 1) {
              showToast(`Untung! Menang ${multiplier}x (+Rp ${formatRp(winAmount)})`, "success");
          } else {
              showToast(`💀 ZONK! Saldo taruhan Anda hangus.`, "error");
          }

      }, 1500); 
  };

  // --- FITUR: PINJOL ---
  const handlePinjam = async (e) => {
      e.preventDefault();
      const amt = Number(pinjolAmount);
      if (amt <= 0 || isNaN(amt)) return showToast("Nominal tidak valid!", "error");
      if (amt > 50000000) return showToast("Maksimal pinjaman 50 Juta!", "error");
      if ((playerProfile.debt || 0) > 0) return showToast("Lunasi hutang Anda sebelumnya terlebih dahulu!", "error");

      const interestRate = globalConfig.pinjolInterest ?? 20;
      const totalDebt = amt + (amt * interestRate / 100);

      try {
          const profileRef = doc(db, 'artifacts', appId, 'public', 'data', 'players', playerProfile.id);
          await updateDoc(profileRef, {
              money: moneyRef.current + amt,
              debt: totalDebt,
              txId: Date.now()
          });
          setMoney(m => m + amt);
          setPlayerProfile(prev => ({...prev, debt: totalDebt}));
          showToast(`Pinjaman cair: Rp ${amt.toLocaleString()}`, 'success');
          setPinjolAmount('');
      } catch(e) { showToast("Gagal memproses pinjaman", "error"); }
  };

  const handlePayPinjol = async (e) => {
      e.preventDefault();
      const amt = Number(payPinjolAmount);
      const currentDebt = playerProfile.debt || 0;
      if (amt <= 0 || isNaN(amt)) return showToast("Nominal tidak valid!", "error");
      if (amt > currentDebt) return showToast("Nominal yang dimasukkan melebihi total hutang Anda!", "error");
      if (money < amt) return showToast("Saldo Anda tidak cukup untuk membayar nominal ini!", "error");

      try {
          const profileRef = doc(db, 'artifacts', appId, 'public', 'data', 'players', playerProfile.id);
          await updateDoc(profileRef, {
              money: moneyRef.current - amt,
              debt: currentDebt - amt,
              txId: Date.now()
          });
          setMoney(m => m - amt);
          setPlayerProfile(prev => ({...prev, debt: currentDebt - amt}));
          showToast(`Berhasil mencicil hutang Rp ${amt.toLocaleString()}`, 'success');
          setPayPinjolAmount('');
      } catch(e) { showToast("Gagal membayar hutang", "error"); }
  };

  // --- TRADE ACTION ---
  const handleTrade = async (e) => {
     e.preventDefault();
     if (!tradeTarget || !tradeType || !tradeAmount || tradeAmount <= 0) return showToast("Lengkapi form dengan benar!", "error");
     
     const targetPlayer = allPlayers.find(p => p.id === tradeTarget);
     if (!targetPlayer) return showToast("Player tidak ditemukan!", "error");
     if (targetPlayer.id === playerProfile.id) return showToast("Tidak bisa trade ke diri sendiri!", "error");

     const amt = Number(tradeAmount);
     try {
        const senderRef = doc(db, 'artifacts', appId, 'public', 'data', 'players', playerProfile.id);
        const receiverRef = doc(db, 'artifacts', appId, 'public', 'data', 'players', targetPlayer.id);

        const mailObj = {
            id: Date.now(),
            title: "Trade Diterima!",
            body: `${playerProfile.username} telah mengirimkan Anda ${amt} ${tradeType === 'money' ? 'Saldo' : 'Unit Mesin ' + PS_DATA[tradeType].name}.`,
            read: false,
            timestamp: Date.now(),
            type: 'trade',
            hasAttachment: true,
            attachmentType: tradeType,
            attachmentAmount: amt,
            isClaimed: false
        };

        if (tradeType === 'money') {
            if (playerProfile.role !== 'admin' && money < amt) return showToast("Saldo tidak cukup!", "error");
            
            if (playerProfile.role !== 'admin') {
                setMoney(m => m - amt);
                await updateDoc(senderRef, { money: moneyRef.current - amt, txId: Date.now() });
            }
            
            await updateDoc(receiverRef, { mail: arrayUnion(mailObj), txId: Date.now() });
            showToast(`Berhasil transfer uang ke ${targetPlayer.username}!`, "success");
        } else {
            if (playerProfile.role !== 'admin' && inventory[tradeType] < amt) return showToast(`Gudang ${PS_DATA[tradeType].name} tidak cukup!`, "error");
            
            if (playerProfile.role !== 'admin') {
                const newInv = { ...inventory, [tradeType]: inventory[tradeType] - amt };
                setInventory(newInv);
                await updateDoc(senderRef, { inventory: newInv, txId: Date.now() });
            }
            
            await updateDoc(receiverRef, { mail: arrayUnion(mailObj), txId: Date.now() });
            showToast(`Berhasil transfer ${amt} unit ${PS_DATA[tradeType].name}!`, "success");
        }
        setTradeAmount('');
     } catch (err) {
        showToast("Trade gagal!", "error");
     }
  };

  // --- ADMIN ACTIONS ---
  const adminSetGlobal = async (key, val) => {
      try {
         const configRef = doc(db, 'artifacts', appId, 'public', 'data', 'globalConfig', 'settings');
         await updateDoc(configRef, { [key]: val });
         showToast(`Global ${key} di-update!`, 'success');
      } catch (e) { showToast("Gagal update global config", 'error'); }
  };
  
  const adminSendBroadcast = async () => {
      await adminSetGlobal('broadcast', broadcastInput);
      setBroadcastInput('');
  };

  const adminSendNews = async () => {
      await adminSetGlobal('dailyNews', newsInput);
      setNewsInput('');
  };

  const handleAdminDirectSend = async (e) => {
      e.preventDefault();
      if (!adminSendTarget || !adminSendType || !adminSendAmount || adminSendAmount <= 0) return showToast("Form tidak lengkap!", "error");
      
      const targetPlayer = allPlayers.find(p => p.id === adminSendTarget);
      if (!targetPlayer) return showToast("Player tidak ditemukan!", "error");

      const amt = Number(adminSendAmount);
      try {
         const receiverRef = doc(db, 'artifacts', appId, 'public', 'data', 'players', targetPlayer.id);
         
         const customText = adminSendMessage.trim() ? `\n\nPesan Khusus: "${adminSendMessage}"` : '';
         const mailObj = {
             id: Date.now(),
             title: "Hadiah dari Admin Pusat",
             body: `Admin Server telah mengirimkan hadiah untuk Anda. Jangan lupa diklaim!${customText}`,
             read: false,
             timestamp: Date.now(),
             type: 'admin_gift',
             hasAttachment: true,
             attachmentType: adminSendType,
             attachmentAmount: amt,
             isClaimed: false
         };

         await updateDoc(receiverRef, { mail: arrayUnion(mailObj), txId: Date.now() });
         showToast(`Berhasil mengirim hadiah ke ${targetPlayer.username}!`, "success");
         setAdminSendAmount('');
         setAdminSendMessage('');
      } catch (err) {
         showToast("Pengiriman gagal", "error");
      }
  };

  const handleAdminWipeBalance = async (e) => {
      e.preventDefault();
      if (!wipeTarget) return showToast("Pilih player yang ingin di-wipe!", "error");

      const target = allPlayers.find(p => p.id === wipeTarget);
      if (!target) return showToast("Player tidak ditemukan", "error");
      
      try {
         const profileRef = doc(db, 'artifacts', appId, 'public', 'data', 'players', target.id);
         await updateDoc(profileRef, { money: 0, txId: Date.now() });
         showToast(`Saldo ${target.username} berhasil di-Wipe (Rp 0)`, 'success');
         setWipeTarget('');
      } catch (err) { 
         showToast("Gagal melakukan wipe saldo", 'error'); 
      }
  };

  const handleAdminSetRole = async (e) => {
      e.preventDefault();
      if (!adminRoleTarget || !adminRoleType) return showToast("Lengkapi form pangkat!", "error");

      const target = allPlayers.find(p => p.id === adminRoleTarget);
      if (!target) return showToast("Player tidak ditemukan!", "error");
      
      try {
         const profileRef = doc(db, 'artifacts', appId, 'public', 'data', 'players', target.id);
         await updateDoc(profileRef, { role: adminRoleType });
         showToast(`Pangkat ${target.username} diubah menjadi ${adminRoleType.toUpperCase()}`, 'success');
         setAdminRoleTarget('');
      } catch (err) { 
         showToast("Gagal mengubah role", 'error'); 
      }
  };

  const adminToggleBan = async (targetUid, currentStatus) => {
      try {
         const profileRef = doc(db, 'artifacts', appId, 'public', 'data', 'players', targetUid);
         await updateDoc(profileRef, { isBanned: !currentStatus });
         showToast(`Player ${!currentStatus ? 'di-BAN' : 'di-UNBAN'}`, 'success');
      } catch (e) { showToast("Gagal update ban status", 'error'); }
  };

  const adminForceCollectPinjol = async (targetUid) => {
      const target = allPlayers.find(p => p.id === targetUid);
      if (!target || !target.debt) return;
      
      try {
          const profileRef = doc(db, 'artifacts', appId, 'public', 'data', 'players', target.id);
          const remainingMoney = target.money - target.debt;
          
          const mailObj = {
               id: Date.now(),
               title: "⚠️ PENAGIHAN PAKSA PINJOL ⚠️",
               body: `Debt Collector dari Bank Pusat telah MENYITA paksa saldo Anda sebesar Rp ${target.debt.toLocaleString()} untuk melunasi tunggakan hutang Pinjaman Online Anda.`,
               read: false,
               timestamp: Date.now(),
               type: 'admin_gift',
               hasAttachment: false
           };

          await updateDoc(profileRef, {
              money: remainingMoney,
              debt: 0,
              mail: arrayUnion(mailObj),
              txId: Date.now()
          });
          showToast(`Berhasil menagih paksa ${target.username}`, 'success');
      } catch(e) { showToast("Gagal menagih paksa", "error"); }
  };

  const adminDeleteReport = async (reportId) => {
      try {
          const repRef = doc(db, 'artifacts', appId, 'public', 'data', 'reports', reportId);
          await deleteDoc(repRef);
          showToast("Laporan dihapus", "success");
      } catch(e) { showToast("Gagal hapus laporan", "error"); }
  };

  // --- GAME LOGIC FUNCTIONS ---
  const effectiveDiscount = useMemo(() => {
     let roleDiscount = 0;
     if (playerProfile?.role === 'manajer') roleDiscount = 20;
     else if (playerProfile?.role === 'direktur') roleDiscount = 35;
     else if (playerProfile?.role === 'ceo') roleDiscount = 60;
     return Math.max(globalConfig.discount || 0, roleDiscount);
  }, [playerProfile?.role, globalConfig.discount]);

  const getDiscountedPrice = (price) => {
     if (effectiveDiscount > 0) return price - (price * (effectiveDiscount / 100));
     return price;
  };

  const serveFB = (slotKey) => {
      const rental = activeRentals[slotKey];
      if (rental && rental.fbRequest) {
          const item = rental.fbRequest.item;
          if (playerProfile.role !== 'admin') setMoney(m => m + item.price);
          setReputation(r => Math.min(100, r + 1));
          showToast(`${item.icon} Melayani ${item.name} (+Rp ${item.price.toLocaleString()})`, 'success');
          
          setActiveRentals(prev => {
              const next = {...prev};
              if(next[slotKey]) {
                 next[slotKey] = {...next[slotKey]}; 
                 delete next[slotKey].fbRequest;
              }
              return next;
          });
      }
  };

  const kickSchoolKid = (slotKey) => {
    if (activeRentals[slotKey]) {
       setReputation(r => Math.min(100, r + 2));
       showToast('🛡️ Anak bolos berhasil diusir! (+Reputasi)', 'success');
       setActiveRentals(prev => { const next = {...prev}; delete next[slotKey]; return next; });
    }
  };

  const kickSmoker = (slotKey) => {
     if (activeRentals[slotKey]) {
         setReputation(r => Math.min(100, r + 3));
         showToast('🚭 Perokok VIP/Sultan berhasil diusir! (+Reputasi)', 'success');
         setActiveRentals(prev => { const next = {...prev}; delete next[slotKey]; return next; });
     }
  }

  const fixPS = (slotKey) => {
     if (activeRentals[slotKey]) {
        showToast('🔧 Stik berhasil diperbaiki!', 'success');
        setActiveRentals(prev => {
            const next = {...prev};
            if (next[slotKey]) {
               next[slotKey] = {...next[slotKey], isBroken: false};
               delete next[slotKey].dialog;
            }
            return next;
        });
     }
  };

  const hireEmployee = (role) => {
    const job = jobMarket[role];
    setHiredEmployees(prev => ({ ...prev, [role]: job }));
    showToast(`🤝 Berhasil merekrut ${job.name}!`, 'success');
  };
  const fireEmployee = (role) => {
    setHiredEmployees(prev => ({ ...prev, [role]: null }));
    showToast(`Karyawan diberhentikan.`, 'info');
  };

  const handleCashierPayout = () => {
     const rating = Math.floor(cashierRatingRef.current);
     let salary = 0;
     if (rating < 3) salary = 35000;
     else if (rating >= 10) salary = Math.floor(Math.random() * (1000000 - 150000 + 1)) + 150000; 
     else salary = 40000 + ((rating - 3) * 15000);
     
     if (playerProfile.role !== 'admin') {
         setMoney(m => m + salary);
     }
     setMinimarketCust(null);
     showToast(`💰 Shift Kasir selesai! Gaji cair: Rp ${salary.toLocaleString()}`, 'success');
  };

  // MAIN GAME LOOP
  useEffect(() => {
    if (!playerProfile || gameOverRef.current || (globalConfigRef.current.maintenance && playerProfile.role === 'user')) return;

    const interval = setInterval(() => {
      let newM = timeRef.current.m + 1;
      let newH = timeRef.current.h;
      let hourChanged = false;
      
      if (newM >= 60) { newM = 0; newH += 1; hourChanged = true; if (newH >= 24) newH = 0; }
      setTime({ h: newH, m: newM });

      if (hourChanged) {
          if (timeRef.current.h === 0 && newH === 1) setIsOpen(false);
          if (timeRef.current.h === 6 && newH === 7) {
             setIsOpen(true); setDay(d => d + 1);
             const emps = hiredEmployeesRef.current;
             let totalSal = 0;
             Object.values(emps).forEach(e => { if(e) totalSal += e.salary; });
             if (totalSal > 0 && playerProfile.role !== 'admin') setMoney(m => m - totalSal);
          }
          if (timeRef.current.h === 9 && newH === 10 && isCashierRef.current) showToast('🏪 Shift Minimarket dimulai!', 'special');
          if (timeRef.current.h === 14 && newH === 15 && isCashierRef.current) handleCashierPayout();
      }

      if (isCashierRef.current && newH >= 10 && newH < 15) {
         if (minimarketCustRef.current) {
            const cust = { ...minimarketCustRef.current };
            if (cust.timer <= 1) {
                setCashierRating(r => Math.max(1, r - 1.0));
                setMinimarketCust(null);
            } else {
                cust.timer -= 1;
                setMinimarketCust(cust);
            }
         } else if (Math.random() < 0.20) { 
             const numItems = Math.floor(Math.random() * 3) + 1;
             const custItems = []; let total = 0;
             for(let i=0; i<numItems; i++) {
                 const rawPrice = Math.floor(Math.random() * 20000) + 2000;
                 const p = Math.round(rawPrice / 500) * 500;
                 custItems.push({name: 'Item', price: p, scanned: false});
                 total += p;
             }
             let paid = Math.ceil(total/50000) * 50000;
             const timer = 40 + (numItems * 12); 
             setMinimarketCust({ items: custItems, total, paid, expectedChange: paid - total, timer, initialTimer: timer, inputChange: 0 });
         }
      }

      if (isOpenRef.current) {
         const emps = hiredEmployeesRef.current;
         const boost = globalConfigRef.current.boost || 1;

         const nextRentals = { ...activeRentalsRef.current };
         let accumulatedIncome = 0;
         let accumulatedRep = 0;
         let finesToDeduct = 0;

         Object.keys(nextRentals).forEach(key => {
            const rental = nextRentals[key];
            rental.timeLeft -= 1;
            const psType = key.split('_')[0];
            
            // STIK RUSAK
            if (Math.random() < 0.005 && !rental.isBroken) {
               if (!emps.teknisi) {
                  rental.isBroken = true;
                  rental.dialog = { text: "Woy stik rusak!!", timer: 10 };
               }
            }

            // KOTOR & CLEANING (KEMAL)
            if (!rental.isBroken && !rental.isSmoking && !rental.isDirty && Math.random() < 0.02) {
                rental.isDirty = true;
                rental.dialog = { text: "Kotor banget! 🤢", timer: 5 };
            }
            if (rental.isDirty) {
                if (emps.janitor) {
                    accumulatedRep += 1;
                    rental.isDirty = false;
                    rental.dialog = { text: "Bersih dehh ✨", timer: 3 };
                } else {
                    if (Math.random() < 0.05) accumulatedRep -= 1;
                }
            }

            // KENYAMANAN (KIPAS / AC)
            if (!rental.isBroken && !rental.isSmoking && !rental.isDirty) {
               if (['jadul', 'reguler', 'mantap'].includes(psType) && !fanUnlockedRef.current && Math.random() < 0.015) {
                   rental.dialog = { text: "Panas banget! 🥵", timer: 5 };
                   accumulatedRep -= 1;
               } else if (['sultan', 'vip'].includes(psType) && !acUnlockedRef.current && Math.random() < 0.02) {
                   rental.dialog = { text: "VIP kok panas! 🤬", timer: 5 };
                   accumulatedRep -= 2;
               }
            }

            // ATURAN VIP (MEROKOK)
            if (['sultan', 'vip'].includes(psType) && !rental.isBroken && !rental.isSmoking && Math.random() < 0.01) {
               rental.isSmoking = true;
               rental.dialog = { text: "Ngebul ah~ 🚬", timer: 15 };
            }
            if (rental.isSmoking) {
               if (emps.vip_manager) {
                   accumulatedRep += 2;
                   delete nextRentals[key];
                   return; 
               } else {
                   if (Math.random() < 0.05) accumulatedRep -= 1;
               }
            }

            // ANAK BOLOS SEKOLAH
            if (rental.custType === 'sekolah' && newH >= 7 && newH < 17) {
               if (emps.operator) {
                  accumulatedRep += 1;
                  delete nextRentals[key];
                  return;
               } else {
                  if (Math.random() < 0.015) { 
                      accumulatedRep -= 20;
                      finesToDeduct += 500000;
                      showToast('🚨 RAZIA SATPOL PP! Denda Rp 500k', 'error');
                      delete nextRentals[key];
                      return; 
                  }
               }
            }

            // HITUNG INCOME
            if (!rental.isBroken) {
               let tickIncome = (PS_DATA[psType].rentPrice / 60) * boost; 
               if (rental.isSpecial) tickIncome *= 3;
               if (emps.kasir) tickIncome *= 1.1; 
               accumulatedIncome += tickIncome;
            }

            // CHAT BUBBLES
            if (rental.dialog) {
               rental.dialog.timer -= 1;
               if (rental.dialog.timer <= 0) delete rental.dialog;
            }
            if (!rental.dialog && !rental.isBroken && !rental.isSmoking && !rental.isDirty && Math.random() < 0.05) {
               rental.dialog = { text: CHAT_BUBBLES[Math.floor(Math.random() * CHAT_BUBBLES.length)], timer: 4 };
            }

            // F&B
            if (fbUnlockedRef.current && !rental.fbRequest && !rental.isBroken && Math.random() < 0.015) {
               const item = FB_MENU[Math.floor(Math.random() * FB_MENU.length)];
               rental.fbRequest = { item, timer: 15 };
            }
            if (rental.fbRequest) {
               if (emps.cook) {
                  accumulatedIncome += rental.fbRequest.item.price;
                  accumulatedRep += 1;
                  delete rental.fbRequest;
               } else {
                  rental.fbRequest.timer -= 1;
                  if (rental.fbRequest.timer <= 0) {
                      delete rental.fbRequest;
                      accumulatedRep -= 3;
                  }
               }
            }

            if (rental.timeLeft <= 0) delete nextRentals[key];
         });

         // SPAWN PELANGGAN
         const allTypes = ['jadul', 'reguler', 'mantap', 'sultan', 'vip'];
         const spawnRate = emps.marketing ? 0.15 : 0.05;
         const specialRate = emps.marketing ? 0.05 : 0.02; 
         
         allTypes.forEach(type => {
            for (let i = 0; i < installedPSRef.current[type]; i++) {
               const slotKey = `${type}_${i}`;
               if (!nextRentals[slotKey] && Math.random() < spawnRate) {
                   let isSpecial = false; 
                   let cType = 'umum';
                   let guestName = UMUM_NAMES[Math.floor(Math.random() * UMUM_NAMES.length)];
                   
                   if (newH >= 7 && newH < 17 && Math.random() < 0.3) {
                       cType = 'sekolah'; guestName = 'Bolos';
                   }

                   if ((type === 'sultan' || type === 'vip') && Math.random() < specialRate) {
                       isSpecial = true; cType = 'sultan';
                       guestName = SPECIAL_GUESTS[Math.floor(Math.random() * SPECIAL_GUESTS.length)];
                   }

                   nextRentals[slotKey] = { timeLeft: (Math.floor(Math.random() * 3) + 1) * 60, isSpecial, name: guestName, custType: cType, isBroken: false, isSmoking: false, isDirty: false };
               }
            }
         });

         setActiveRentals(nextRentals);
         
         if (playerProfile.role !== 'admin') {
             if (accumulatedIncome > 0) setMoney(m => m + accumulatedIncome);
             if (finesToDeduct > 0) setMoney(m => Math.max(0, m - finesToDeduct));
             if (accumulatedRep !== 0) setReputation(r => Math.min(100, Math.max(0, r + accumulatedRep)));
         }
      }
    }, 500);
    return () => clearInterval(interval);
  }, [playerProfile, globalConfig]);

  const buyPS = (type) => {
    const price = getDiscountedPrice(PS_DATA[type].price);
    if (playerProfile.role === 'admin' || money >= price) {
      if (playerProfile.role !== 'admin') setMoney(m => m - price);
      setInventory(prev => ({ ...prev, [type]: prev[type] + 1 }));
      showToast(`🛒 Beli ${PS_DATA[type].name}`, 'success');
    } else showToast(`Uang kurang!`, 'error');
  };
  const sellPS = (type) => {
    if (inventory[type] > 0) {
      if (playerProfile.role !== 'admin') setMoney(m => m + Math.floor(PS_DATA[type].price * 0.7));
      setInventory(prev => ({ ...prev, [type]: prev[type] - 1 }));
    }
  };
  const installPS = (type) => {
    const invType = type === 'vip' ? 'sultan' : type;
    if (installedPS[type] < BUILDINGS[buildingLvl].slots[type] && inventory[invType] > 0) {
      setInventory(prev => ({ ...prev, [invType]: prev[invType] - 1 }));
      setInstalledPS(prev => ({ ...prev, [type]: prev[type] + 1 }));
    }
  };
  const uninstallPS = (type) => {
    if (installedPS[type] > 0) {
      const invType = type === 'vip' ? 'sultan' : type;
      setInstalledPS(prev => ({ ...prev, [type]: prev[type] - 1 }));
      setInventory(prev => ({ ...prev, [invType]: prev[invType] + 1 }));
      const slotKey = `${type}_${installedPS[type] - 1}`;
      setActiveRentals(prev => { const next = { ...prev }; delete next[slotKey]; return next; });
    }
  };
  
  const upgradeBuilding = async () => {
    const nextBuild = BUILDINGS[buildingLvl + 1];
    if (playerProfile.role === 'admin' || money >= nextBuild.price) {
      if (playerProfile.role !== 'admin') setMoney(m => m - nextBuild.price);
      let tempInv = { ...inventory };
      ['jadul', 'reguler', 'mantap', 'sultan', 'vip'].forEach(t => { tempInv[t === 'vip' ? 'sultan' : t] += installedPS[t]; });
      setInstalledPS({ jadul: 0, reguler: 0, mantap: 0, sultan: 0, vip: 0 });
      setInventory(tempInv);
      setActiveRentals({});
      setBuildingLvl(lvl => lvl + 1);
      
      showToast(`🎉 Upgrade Berhasil!`, 'special');
      if (playerProfile.role !== 'admin') {
         triggerSystemBroadcast(`🏢 ${playerProfile.username} telah meng-upgrade gedungnya menjadi ${nextBuild.name}!`);
      }
    } else {
       showToast(`Uang tidak cukup untuk Upgrade!`, 'error');
    }
  };

  // --- RENDER SCREENS ---

  if (isAuthLoading) {
     return <div className="h-screen bg-[#06101e] flex items-center justify-center text-white"><RefreshCw className="animate-spin text-cyan-400" size={40}/></div>;
  }

  // SCREEN: GAME OVER
  if (gameOver) {
      return (
          <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center">
              <AlertOctagon size={80} className="text-rose-600 mb-4 animate-bounce drop-shadow-[0_0_15px_rgba(225,29,72,0.8)]" />
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-red-700 mb-2 tracking-widest">BANGKRUT!</h1>
              <p className="text-lg text-slate-400 mb-8 font-light">Reputasi Anda hancur. Toko <strong className="text-white">{shopName}</strong> ditutup paksa.</p>
              <button onClick={() => window.location.reload()} className="bg-rose-600 hover:bg-rose-500 text-white px-8 py-3 rounded-full font-bold shadow-[0_0_15px_rgba(225,29,72,0.5)] transition-all">Terima Kenyataan</button>
          </div>
      );
  }

  // SCREEN: BANNED
  if (playerProfile?.isBanned) {
      return (
          <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center relative overflow-y-auto">
              <button onClick={handleLogout} className="absolute top-6 right-6 flex items-center gap-2 bg-rose-500/20 text-rose-400 px-4 py-2 rounded-xl border border-rose-500/30 hover:bg-rose-500 hover:text-white transition-all">
                 <LogOut size={16}/> Keluar
              </button>
              <Ban size={100} className="text-rose-600 mb-6 drop-shadow-[0_0_20px_rgba(225,29,72,0.8)] mt-10" />
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-red-700 mb-2 tracking-widest">BANNED</h1>
              <p className="text-lg text-slate-400 mb-8 font-light max-w-md">Akun Anda telah di-blacklist oleh Admin karena melanggar aturan server.</p>
              
              <div className="bg-[#0b1829]/80 p-6 rounded-2xl border border-cyan-900/50 w-full max-w-md shadow-2xl backdrop-blur-md mb-8">
                  <h3 className="text-lg font-bold text-cyan-400 mb-2 flex items-center justify-center gap-2"><MessageSquare size={18}/> Aju Banding Unban</h3>
                  <p className="text-xs text-slate-400 mb-4">Jika Anda merasa tidak bersalah, ajukan permohonan ke Admin.</p>
                  <textarea 
                      value={appealInput} onChange={e => setAppealInput(e.target.value)} 
                      placeholder="Tulis alasan kenapa Anda harus di-unban di sini..." 
                      className="w-full bg-[#06101e] border border-cyan-500/20 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors mb-4 resize-none h-24 shadow-inner" 
                  />
                  <button onClick={submitAppeal} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-xl font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all">Kirim Banding ke Admin</button>
              </div>
          </div>
      );
  }

  // SCREEN: LOGIN/REGISTER 
  if (!playerProfile) {
     return (
        <div className="min-h-screen bg-[#06101e] flex flex-col items-center justify-center p-4 text-white relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 to-blue-900/10 z-0"></div>
           <div className="bg-[#0b1829]/80 p-8 rounded-3xl border border-cyan-500/20 backdrop-blur-xl z-10 w-full max-w-md shadow-[0_0_40px_rgba(6,182,212,0.1)] text-center relative">
              <Gamepad2 size={60} className="text-cyan-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
              <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-sky-400 mb-2">Juragan Rental PS</h1>
              <p className="text-slate-400 text-sm mb-8">Masuk dari HP atau PC mana saja!</p>
              
              <form onSubmit={handleAuth} className="space-y-4">
                 <input type="text" value={authInput} onChange={e => setAuthInput(e.target.value)} placeholder="Username (ID)" className="w-full bg-[#06101e] border border-cyan-500/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-colors shadow-inner" required />
                 <input type="password" value={authSecret} onChange={e => setAuthSecret(e.target.value)} placeholder="Password (Min. 6 Karakter)" className="w-full bg-[#06101e] border border-cyan-500/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-colors shadow-inner" required />
                 
                 <button type="submit" className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${isRegistering ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-purple-500/30' : 'bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 shadow-cyan-500/30'}`}>
                    {isRegistering ? 'Buat Akun Baru' : 'Masuk ke Server'}
                 </button>
              </form>

              <div className="mt-6 text-center">
                <button onClick={() => setIsRegistering(!isRegistering)} type="button" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors underline decoration-cyan-900 underline-offset-4">
                  {isRegistering ? 'Sudah punya akun? Masuk di sini' : 'Belum punya akun? Buat baru'}
                </button>
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-800/50 text-center">
                 <p className="text-xs text-slate-500">
                   *Akun Admin gunakan Username & Password khusus
                 </p>
              </div>
           </div>
        </div>
     );
  }

  // SCREEN: MAINTENANCE MODE
  if (globalConfig.maintenance && playerProfile.role === 'user') {
      return (
          <div className="min-h-screen bg-[#06101e] text-white flex flex-col items-center justify-center p-4 text-center relative">
              <button onClick={handleLogout} className="absolute top-6 right-6 flex items-center gap-2 bg-rose-500/20 text-rose-400 px-4 py-2 rounded-xl border border-rose-500/30 hover:bg-rose-500 hover:text-white transition-all">
                 <LogOut size={16}/> Log Out
              </button>
              <Wrench size={80} className="text-amber-500 mb-4 animate-bounce drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 mb-2 tracking-tight">MAINTENANCE</h1>
              <p className="text-lg text-slate-400 mb-8 font-light max-w-md">Server sedang dalam perbaikan oleh Admin. Harap tunggu info di Discord.</p>
          </div>
      );
  }

  const NavButton = ({ id, icon: Icon, label, alert = false, extraClass = '' }) => (
    <button onClick={() => setActiveTab(id)} className={`flex flex-col md:flex-row items-center md:justify-start gap-1.5 md:gap-3 w-full p-2 md:px-4 md:py-3 rounded-xl text-[9px] md:text-sm font-semibold transition-all duration-300 relative ${activeTab === id ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.1)]' : 'text-slate-400 hover:text-cyan-300 border border-transparent hover:bg-white/5'} ${extraClass}`}>
      <Icon size={20} className={`shrink-0 ${activeTab === id ? "text-cyan-400" : ""}`} />
      <span className="text-center md:text-left leading-tight hidden sm:block">{label}</span>
      {alert && <span className="absolute top-1 right-1 md:top-3 md:right-3 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></span>}
    </button>
  );

  const isDailyClaimAvailable = playerProfile && ['manajer', 'direktur', 'ceo'].includes(playerProfile.role) && (playerProfile.lastDailyClaim || 0) < new Date().setHours(0,0,0,0);

  return (
    <div className="h-screen flex flex-col bg-[#020617] text-slate-200 font-sans overflow-hidden">
      
      {/* GLOBAL SYSTEM / ACHIEVEMENT BROADCAST BAR (TOP - EMAS) */}
      <div className="w-full flex flex-col shrink-0 z-50">
        {sysBroadcastMsg && (
           <div className="w-full bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-amber-950 py-1.5 px-4 text-center text-[11px] md:text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.5)] animate-bounce flex justify-center items-center gap-2">
              <Crown size={16} /> [PENCAPAIAN] {sysBroadcastMsg} <Crown size={16} />
           </div>
        )}

        {/* GLOBAL ADMIN BROADCAST BAR (TOP - CYAN) */}
        {globalConfig.broadcast && (
           <div className="w-full bg-gradient-to-r from-sky-600 via-cyan-500 to-sky-600 text-white py-1.5 px-4 text-center text-[11px] md:text-xs font-black uppercase tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.5)] animate-pulse flex justify-center items-center gap-2">
              <Megaphone size={14} /> {globalConfig.broadcast} <Megaphone size={14} />
           </div>
        )}
      </div>

      {/* HEADER MULTIPLAYER */}
      <header className="bg-[#0b1829]/90 backdrop-blur-xl border-b border-cyan-900/30 p-3 px-4 md:px-6 flex justify-between items-center z-20 shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-cyan-600 to-sky-600 p-2 rounded-xl shadow-lg shadow-cyan-500/20 hidden md:block"><Gamepad2 size={24} className="text-white" /></div>
          <div>
            <div className="flex items-center gap-2">
               {isEditingName ? (
                 <input type="text" value={shopName} autoFocus onChange={e => setShopName(e.target.value)} onBlur={() => setIsEditingName(false)} onKeyDown={e => e.key === 'Enter' && setIsEditingName(false)} className="bg-[#06101e] border border-cyan-500/50 text-lg font-black text-white px-2 py-0.5 rounded outline-none w-32 md:w-48 focus:ring-2 ring-cyan-500/30 transition-all shadow-inner" />
               ) : (
                 <h1 onClick={() => setIsEditingName(true)} className="text-lg font-black text-white cursor-pointer hover:text-cyan-300 flex items-center gap-1.5 transition-colors" title="Ubah Nama Rental">
                   {shopName} <Edit2 size={14} className="text-cyan-500/50 shrink-0" />
                 </h1>
               )}
               <span className={`flex items-center gap-1 text-[9px] px-2 py-0.5 rounded uppercase font-bold ${playerProfile.role==='admin'?'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : playerProfile.role==='ceo'?'bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_10px_rgba(220,38,38,0.5)]' : playerProfile.role==='direktur'?'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : playerProfile.role==='manajer'?'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.5)]' : playerProfile.role==='moderator'?'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'}`}>
                  {playerProfile.role === 'admin' && <BadgeCheck size={12} className="text-blue-400 fill-blue-400/20" title="Verified Admin" />}
                  {playerProfile.role === 'moderator' && <Wrench size={10} className="text-amber-400" title="Moderator" />}
                  {playerProfile.role}
               </span>
            </div>
            <p className="text-[11px] font-semibold text-cyan-400/80 uppercase">UID: {playerProfile.id.substring(0,6)}... | {playerProfile.username}</p>
          </div>
        </div>
        
        <div className="flex gap-2 md:gap-3 items-center">
          {isDailyClaimAvailable && (
             <button onClick={handleClaimDaily} className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:scale-105 text-amber-950 font-black px-3 py-1.5 rounded-full text-xs flex items-center gap-1 shadow-[0_0_15px_rgba(245,158,11,0.6)] animate-pulse transition-transform">
                <Award size={14}/> Klaim Gaji
             </button>
          )}

          {globalConfig.boost > 1 && (
             <div className="hidden md:flex bg-amber-500/20 border border-amber-500/50 px-3 py-1.5 rounded-full items-center gap-1.5 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                <Zap size={14} className="text-amber-400" />
                <span className="text-xs font-black text-amber-400">x{globalConfig.boost}</span>
             </div>
          )}
          
          <button onClick={openMailbox} className="relative p-2 bg-[#06101e] border border-cyan-500/30 rounded-full text-cyan-400 hover:bg-cyan-500/10 transition-colors shadow-inner">
             <Mail size={16} />
             {unreadMails > 0 && <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce border border-[#0b1829]">{unreadMails}</span>}
          </button>

          {/* REPUTATION DISPLAY */}
          <div className="bg-[#06101e] border border-amber-500/30 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-inner">
            <Star size={14} className={reputation > 50 ? 'text-amber-400' : 'text-rose-500 animate-pulse'} />
            <span className={`text-sm font-bold ${reputation > 50 ? 'text-amber-400' : 'text-rose-500'}`}>{reputation}%</span>
          </div>

          <div className="bg-[#06101e] border border-emerald-500/30 px-3 md:px-4 py-1.5 rounded-full flex items-center gap-2 shadow-inner">
            <DollarSign size={14} className="text-emerald-400" />
            <span className="text-sm font-bold text-emerald-400">{playerProfile.role === 'admin' ? 'UNLIMITED' : formatRp(Math.floor(money))}</span>
          </div>
          <div className="bg-[#06101e] border border-cyan-500/30 px-3 md:px-4 py-1.5 rounded-full flex items-center gap-2 shadow-inner hidden sm:flex">
            <Clock size={14} className="text-cyan-400" />
            <span className="text-sm font-mono font-bold text-white">{formatTime(time.h, time.m)}</span>
          </div>
          
          <button onClick={handleLogout} className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 p-2 rounded-full text-rose-400 transition-colors ml-1" title="Log Out">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* MAILBOX MODAL */}
      {showMailbox && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-[#0b1829] border border-cyan-500/30 w-full max-w-lg rounded-3xl shadow-[0_0_40px_rgba(6,182,212,0.2)] overflow-hidden flex flex-col max-h-[80vh]">
               <div className="bg-[#06101e] p-4 border-b border-cyan-900/50 flex justify-between items-center">
                  <h2 className="text-lg font-black text-white flex items-center gap-2"><Inbox className="text-cyan-400"/> Kotak Masuk (Mail)</h2>
                  <button onClick={() => setShowMailbox(false)} className="text-slate-400 hover:text-white p-1"><XCircle size={20}/></button>
               </div>
               <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                  {(!playerProfile.mail || playerProfile.mail.length === 0) ? (
                     <div className="text-center text-slate-500 py-10">Kotak masuk Anda kosong.</div>
                  ) : (
                     [...playerProfile.mail].reverse().map(m => (
                        <div key={m.id} className={`bg-white/5 p-4 rounded-xl border ${m.title.includes('PENAGIHAN') ? 'border-rose-500/50 bg-rose-950/20' : m.type === 'admin_gift' ? 'border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'border-white/10 hover:border-cyan-500/30'} transition-colors`}>
                           <div className="flex justify-between items-start mb-2">
                              <h3 className={`font-bold text-sm flex items-center gap-1 ${m.title.includes('PENAGIHAN') ? 'text-rose-500' : m.type === 'admin_gift' ? 'text-amber-400' : 'text-cyan-300'}`}>
                                  {m.type === 'admin_gift' && !m.title.includes('PENAGIHAN') && <Sparkles size={14}/>} 
                                  {m.title.includes('PENAGIHAN') && <Skull size={14} className="animate-pulse"/>} 
                                  {m.title}
                              </h3>
                              <span className="text-[9px] text-slate-500">{new Date(m.timestamp).toLocaleTimeString()}</span>
                           </div>
                           <p className={`text-sm leading-relaxed whitespace-pre-line ${m.title.includes('PENAGIHAN') ? 'text-rose-200' : 'text-slate-300'}`}>{m.body}</p>
                           
                           {/* TOMBOL KLAIM HADIAH */}
                           {m.hasAttachment && (
                               <div className="mt-4 pt-3 border-t border-white/10">
                                   {!m.isClaimed ? (
                                       <button onClick={() => handleClaimMail(m.id)} className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-lg transition-transform active:scale-95 flex items-center gap-2">
                                           <Sparkles size={14}/> Klaim {m.attachmentType === 'money' ? `Rp ${m.attachmentAmount.toLocaleString()}` : `${m.attachmentAmount} Unit ${PS_DATA[m.attachmentType].name}`}
                                       </button>
                                   ) : (
                                       <div className="inline-flex items-center gap-1.5 text-[10px] bg-black/40 text-emerald-500 px-3 py-1.5 rounded border border-emerald-500/20 font-bold">
                                           <CheckCircle2 size={12}/> Sudah Diklaim
                                       </div>
                                   )}
                               </div>
                           )}
                        </div>
                     ))
                  )}
               </div>
            </div>
         </div>
      )}

      {/* KONTAINER BAWAH: NAV KIRI (SIDEBAR) + MAIN CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* NAV SIDEBAR KIRI */}
        <aside className="w-[70px] sm:w-[85px] md:w-[220px] bg-[#0b1829]/60 backdrop-blur-md border-r border-cyan-900/30 p-2 md:p-4 shrink-0 flex flex-col gap-2 z-10 overflow-y-auto custom-scrollbar">
          <NavButton id="rental" icon={LayoutGrid} label="Area Bermain" />
          <NavButton id="toko" icon={ShoppingCart} label="Toko" />
          <NavButton id="inventory" icon={ScrollText} label="Gudang" />
          <NavButton id="trade" icon={Repeat} label="Trade" />
          
          <div className="my-1 border-t border-cyan-900/50 w-full shrink-0" />
          
          <NavButton id="gacha" icon={Dices} label="Gacha Saldo" extraClass="text-amber-400 hover:text-amber-300 border-amber-500/20" />
          <NavButton id="pinjol" icon={Landmark} label="Bank Pinjol" alert={(playerProfile?.debt || 0) > 0} extraClass="text-rose-400 hover:text-rose-300 border-rose-500/20" />
          
          <div className="my-1 border-t border-cyan-900/50 w-full shrink-0" />

          <NavButton id="topup" icon={CreditCard} label="Order Premium" extraClass="text-emerald-400 hover:text-emerald-300 border-emerald-500/20" />
          <NavButton id="sambilan" icon={Briefcase} label="Kerja Part-Time" />
          <NavButton id="karyawan" icon={Users} label="Karyawan" />
          
          <div className="my-1 border-t border-cyan-900/50 w-full shrink-0" />
          
          <NavButton id="berita" icon={Newspaper} label="Kabar Rental" alert={globalConfig.dailyNews !== undefined} />
          <NavButton id="globalChat" icon={Globe} label="Global Chat" />
          <NavButton id="feedback" icon={Bug} label="Report Bug" />
          
          <div className="my-1 border-t border-cyan-900/50 w-full shrink-0" />

          <NavButton id="support" icon={HeartHandshake} label="Support Me" extraClass="text-pink-400 hover:text-pink-300 border-pink-500/20" />
          <NavButton id="credits" icon={Code} label="Credits" extraClass="text-cyan-400 hover:text-cyan-300 border-cyan-500/20" />
          
          {/* EASTER EGG TAB */}
          {money >= 5000000 && (
              <NavButton id="easteregg" icon={Trophy} label="PS (Pemula)" extraClass="text-amber-400 hover:text-amber-300 border-amber-500/20 animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.2)] mt-2" />
          )}

          {(playerProfile.role === 'admin' || playerProfile.role === 'moderator') && (
            <NavButton id="admin" icon={ShieldCheck} label="Admin Panel" alert={globalConfig.maintenance || reports.length > 0} />
          )}
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 relative bg-gradient-to-b from-[#020617] via-[#082f49] to-[#020617] custom-scrollbar">
          
          {/* === TAB: AREA BERMAIN === */}
          {activeTab === 'rental' && (
            <div className="max-w-7xl mx-auto space-y-6">
              {buildingLvl < BUILDINGS.length - 1 && (
                <button onClick={upgradeBuilding} className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 p-3 rounded-xl text-sm font-bold flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                  <ArrowUpCircle size={18} /> Tingkatkan ke {BUILDINGS[buildingLvl + 1].name} ({playerProfile.role === 'admin' ? 'FREE' : formatRp(BUILDINGS[buildingLvl + 1].price)})
                </button>
              )}

              {BUILDINGS[buildingLvl].layout.map((floor, idx) => (
                <div key={idx} className="bg-[#0b1829]/60 border border-cyan-900/50 rounded-3xl p-5 shadow-2xl backdrop-blur-xl">
                  <h3 className="text-sm font-black text-white uppercase mb-4 border-l-4 border-cyan-500 pl-3 drop-shadow-md">{floor.name}</h3>
                  
                  {floor.types.map(type => (
                    <div key={type} className="mb-6 last:mb-0 bg-[#06101e]/80 p-4 rounded-2xl border border-white/5">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                           <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${PS_DATA[type].color} flex items-center justify-center shadow-lg ${PS_DATA[type].glow}`}><Gamepad2 size={16} className="text-white" /></div>
                           <div className="text-sm font-bold text-white leading-none">{PS_DATA[type].name}</div>
                        </div>
                        <span className="text-[10px] font-bold bg-white/10 px-3 py-1 rounded-full text-cyan-300 border border-cyan-500/20">MESIN: {installedPS[type]}/{BUILDINGS[buildingLvl].slots[type]}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {Array.from({ length: BUILDINGS[buildingLvl].slots[type] }).map((_, slotIdx) => {
                          const isInstalled = slotIdx < installedPS[type];
                          const slotKey = `${type}_${slotIdx}`;
                          const rentalData = activeRentals[slotKey];
                          const isDisplayRental = isOpen && rentalData; 

                          if (!isInstalled) return (
                            <button key={slotIdx} onClick={() => installPS(type)} className="h-32 border border-dashed border-cyan-900/50 bg-[#0b1829]/40 rounded-2xl flex flex-col items-center justify-center text-slate-500 hover:text-cyan-300 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all">
                              <span className="text-2xl font-light mb-1">+</span><span className="text-[10px] font-bold uppercase">Pasang</span>
                            </button>
                          );

                          return (
                            <div key={slotIdx} className={`h-32 rounded-2xl flex flex-col items-center justify-center relative border overflow-hidden transition-all group shadow-lg ${isDisplayRental ? (isDisplayRental.isSmoking ? 'bg-amber-950/40 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : isDisplayRental.isBroken ? 'bg-rose-950/30 border-rose-500/50 shadow-[0_0_15px_rgba(225,29,72,0.2)]' : isDisplayRental.isSpecial ? 'bg-amber-950/40 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-cyan-950/40 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]') : 'bg-[#020617] border-white/5'}`}>
                              
                              {!isDisplayRental && isOpen && <button onClick={() => uninstallPS(type)} className="absolute top-2 right-2 p-2 bg-rose-500/80 hover:bg-rose-500 text-white rounded-lg z-30 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>}
                              
                              <Monitor size={32} className={isDisplayRental ? (isDisplayRental.isSmoking ? "text-amber-500 animate-pulse drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" : isDisplayRental.isBroken ? "text-rose-500 animate-pulse drop-shadow-[0_0_8px_rgba(225,29,72,0.5)]" : isDisplayRental.isSpecial ? "text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]") : "text-slate-700"} />
                              
                              {isDisplayRental && (
                                 <>
                                   <div className={`absolute bottom-0 w-full p-1.5 flex justify-between items-center text-[10px] font-bold border-t ${isDisplayRental.isSmoking ? 'bg-amber-900 border-amber-500' : isDisplayRental.isBroken ? 'bg-rose-900 border-rose-500' : 'bg-black/80 border-white/10'}`}>
                                      <span className={isDisplayRental.isSpecial ? 'text-amber-400' : 'text-slate-200'}>{isDisplayRental.name}</span>
                                      <span className={isDisplayRental.isBroken ? 'text-rose-300' : 'text-cyan-400'}>{Math.ceil(isDisplayRental.timeLeft)}m</span>
                                   </div>

                                   {/* CHAT BUBBLE */}
                                   {isDisplayRental.dialog && (
                                      <div className={`absolute top-2 left-1/2 -translate-x-1/2 bg-white text-[9px] px-2 py-1 rounded-lg shadow-xl z-40 whitespace-nowrap font-black animate-in slide-in-from-bottom-2 ${isDisplayRental.isSmoking ? 'text-amber-900 border border-amber-500' : 'text-slate-900'}`}>
                                          {isDisplayRental.dialog.text}
                                      </div>
                                   )}

                                   {/* F&B REQUEST */}
                                   {isDisplayRental.fbRequest && !hiredEmployees.cook && !isDisplayRental.isBroken && (
                                      <button onClick={(e) => { e.stopPropagation(); serveFB(slotKey); }} className="absolute m-auto inset-0 w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 hover:scale-110 text-white flex items-center justify-center rounded-full animate-bounce text-lg border border-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-transform z-40">
                                         {isDisplayRental.fbRequest.item.icon}
                                      </button>
                                   )}

                                   {/* ACTION BUTTONS (FIX, KICK) */}
                                   <div className="absolute left-2 bottom-8 z-40 flex gap-1">
                                      {isDisplayRental.isBroken && !hiredEmployees.teknisi && (
                                          <button onClick={(e) => { e.stopPropagation(); fixPS(slotKey); }} className="bg-rose-600 p-1.5 rounded-full text-white animate-bounce shadow-lg"><Wrench size={12}/></button>
                                      )}
                                      {isDisplayRental.custType === 'sekolah' && time.h >= 7 && time.h < 17 && !hiredEmployees.operator && !isDisplayRental.isBroken && (
                                          <button onClick={(e) => { e.stopPropagation(); kickSchoolKid(slotKey); }} className="bg-indigo-600 p-1.5 rounded-full text-white animate-pulse shadow-lg"><ShieldAlert size={12}/></button>
                                      )}
                                      {isDisplayRental.isSmoking && !hiredEmployees.vip_manager && (
                                          <button onClick={(e) => { e.stopPropagation(); kickSmoker(slotKey); }} className="bg-amber-600 p-1.5 rounded-full text-white animate-pulse shadow-lg"><Ban size={12}/></button>
                                      )}
                                   </div>
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

          {/* === TAB: TOKO === */}
          {activeTab === 'toko' && (
            <div className="max-w-5xl mx-auto space-y-6">
              {effectiveDiscount > 0 && (
                 <div className="bg-emerald-500/20 border border-emerald-500/50 p-4 rounded-2xl text-center shadow-[0_0_20px_rgba(16,185,129,0.2)] flex flex-col md:flex-row justify-center items-center gap-4">
                    <h2 className="text-xl font-black text-emerald-400 flex items-center gap-2"><Tag/> Diskon Toko Aktif!</h2>
                    <p className="text-sm text-emerald-200/70 font-bold bg-emerald-950/50 px-4 py-1.5 rounded-full">Diskon Maksimal Diterapkan: <span className="text-white">{effectiveDiscount}%</span></p>
                 </div>
              )}
              
              {/* FASILITAS (KIPAS, AC, ETALASE) */}
              <div className="bg-[#0b1829]/60 border border-cyan-900/50 rounded-3xl p-6 backdrop-blur-xl">
                 <h3 className="text-sm font-black text-emerald-400 flex items-center gap-2 mb-4 uppercase"><Coffee size={16} /> Fasilitas & Layanan</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* ETALASE DAPUR */}
                    <div className="bg-[#06101e]/80 p-4 rounded-2xl border border-white/5 flex justify-between items-center shadow-lg hover:border-emerald-500/30 transition-colors">
                       <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${fbUnlocked ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}><ChefHat className={fbUnlocked ? 'text-emerald-400' : 'text-amber-400'}/></div>
                          <div>
                             <div className="text-sm font-bold text-white mb-0.5">Etalase Dapur</div>
                             {effectiveDiscount > 0 ? (
                                <div className="text-[10px] text-slate-400"><span className="line-through">Rp 200.000</span> <span className="text-emerald-400 font-bold ml-1">{formatRp(getDiscountedPrice(200000))}</span></div>
                             ) : (
                                <div className="text-[10px] text-slate-400">Rp 200.000</div>
                             )}
                          </div>
                       </div>
                       {!fbUnlocked ? (
                          <button onClick={() => { const p = getDiscountedPrice(200000); if(playerProfile.role === 'admin' || money>=p){ if(playerProfile.role !== 'admin') setMoney(m=>m-p); setFbUnlocked(true); showToast('✅ Etalase Dapur Dibeli!','success') } else showToast('Uang kurang','error')}} className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-lg text-xs font-bold text-white shadow-md">Beli</button>
                       ) : <div className="text-[10px] font-bold text-emerald-400 flex items-center gap-1"><CheckCircle2 size={14}/> Dibeli</div>}
                    </div>

                    {/* KIPAS */}
                    <div className="bg-[#06101e]/80 p-4 rounded-2xl border border-white/5 flex justify-between items-center shadow-lg hover:border-emerald-500/30 transition-colors">
                       <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${fanUnlocked ? 'bg-emerald-500/20' : 'bg-cyan-500/20'}`}><Wind className={fanUnlocked ? 'text-emerald-400' : 'text-cyan-400'}/></div>
                          <div>
                             <div className="text-sm font-bold text-white mb-0.5">Kipas Angin Besar</div>
                             {effectiveDiscount > 0 ? (
                                <div className="text-[10px] text-slate-400"><span className="line-through">Rp 120.000</span> <span className="text-emerald-400 font-bold ml-1">{formatRp(getDiscountedPrice(120000))}</span></div>
                             ) : (
                                <div className="text-[10px] text-slate-400">Rp 120.000</div>
                             )}
                          </div>
                       </div>
                       {!fanUnlocked ? (
                          <button onClick={() => { const p = getDiscountedPrice(120000); if(playerProfile.role === 'admin' || money>=p){ if(playerProfile.role !== 'admin') setMoney(m=>m-p); setFanUnlocked(true); showToast('✅ Kipas Dibeli!','success') } else showToast('Uang kurang','error')}} className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-lg text-xs font-bold text-white shadow-md">Beli</button>
                       ) : <div className="text-[10px] font-bold text-emerald-400 flex items-center gap-1"><CheckCircle2 size={14}/> Dibeli</div>}
                    </div>

                    {/* AC */}
                    <div className="bg-[#06101e]/80 p-4 rounded-2xl border border-white/5 flex justify-between items-center shadow-lg hover:border-emerald-500/30 transition-colors">
                       <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${acUnlocked ? 'bg-emerald-500/20' : 'bg-cyan-500/20'}`}><Wind className={acUnlocked ? 'text-emerald-400' : 'text-cyan-400'}/></div>
                          <div>
                             <div className="text-sm font-bold text-white mb-0.5">AC Split (VIP)</div>
                             {effectiveDiscount > 0 ? (
                                <div className="text-[10px] text-slate-400"><span className="line-through">Rp 7 Juta</span> <span className="text-emerald-400 font-bold ml-1">{formatRp(getDiscountedPrice(7000000))}</span></div>
                             ) : (
                                <div className="text-[10px] text-slate-400">Rp 7.000.000</div>
                             )}
                          </div>
                       </div>
                       {!acUnlocked ? (
                          <button onClick={() => { const p = getDiscountedPrice(7000000); if(playerProfile.role === 'admin' || money>=p){ if(playerProfile.role !== 'admin') setMoney(m=>m-p); setAcUnlocked(true); showToast('✅ AC VIP Dibeli!','success') } else showToast('Uang kurang','error')}} className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-lg text-xs font-bold text-white shadow-md">Beli</button>
                       ) : <div className="text-[10px] font-bold text-emerald-400 flex items-center gap-1"><CheckCircle2 size={14}/> Dibeli</div>}
                    </div>
                 </div>
              </div>

              <div className="bg-[#0b1829]/60 border border-cyan-900/50 rounded-3xl p-6 backdrop-blur-xl">
                <h3 className="text-sm font-black text-cyan-400 flex items-center gap-2 mb-4 uppercase"><ShoppingCart size={16} /> Beli Mesin PS</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {Object.entries(PS_DATA).filter(([k]) => k !== 'vip').map(([key, data]) => {
                    const currentPrice = getDiscountedPrice(data.price);
                    return (
                      <div key={key} className="bg-[#06101e]/80 p-4 rounded-2xl border border-white/5 flex flex-col items-center text-center shadow-lg">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${data.color} flex items-center justify-center mb-3 shadow-lg ${data.glow}`}><Gamepad2 size={24} className="text-white" /></div>
                        <div className="text-sm font-bold text-white mb-1">{data.name}</div>
                        {effectiveDiscount > 0 ? (
                           <div className="mb-4 flex flex-col items-center">
                              <span className="text-[10px] text-slate-500 line-through">{formatRp(data.price)}</span>
                              <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded mt-0.5">{formatRp(currentPrice)}</span>
                           </div>
                        ) : (
                           <div className="text-xs font-semibold text-emerald-400 mb-4 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">{formatRp(data.price)}</div>
                        )}
                        <button onClick={() => buyPS(key)} className="w-full bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-md">Beli</button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* === TAB: GUDANG === */}
          {activeTab === 'inventory' && (
            <div className="max-w-5xl mx-auto space-y-6">
               <div className="bg-cyan-500/10 p-5 rounded-3xl border border-cyan-500/20 text-sm font-semibold text-cyan-200 text-center backdrop-blur-md">Mesin di gudang tidak menghasilkan uang. Pasang atau Jual kembali (Rugi 30%).</div>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {Object.entries(inventory).map(([key, count]) => (
                  <div key={key} className="bg-[#0b1829]/60 p-6 rounded-3xl border border-white/10 text-center backdrop-blur-xl shadow-xl">
                    <div className="text-sm font-bold text-white mb-2 tracking-wide">{PS_DATA[key].name}</div>
                    <div className="text-5xl font-black text-cyan-400 mb-6 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">{count} <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Unit</span></div>
                    <button onClick={() => sellPS(key)} disabled={count === 0} className={`w-full py-3 rounded-xl text-sm font-bold transition-all shadow-lg ${count > 0 ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/50' : 'bg-black/30 text-slate-600 border border-white/5'}`}>Jual ({formatRp(PS_DATA[key].price * 0.7)})</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === TAB: TRADE === */}
          {activeTab === 'trade' && (
             <div className="max-w-3xl mx-auto bg-[#0b1829]/80 rounded-3xl border border-cyan-500/20 p-6 md:p-8 backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-cyan-900/50">
                   <div className="bg-cyan-500/20 p-4 rounded-full border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.3)]"><Repeat size={32} className="text-cyan-400" /></div>
                   <div>
                      <h2 className="text-2xl font-black text-white">Sistem Barter / Trade</h2>
                      <p className="text-sm text-slate-400">Kirim saldo atau mesin PS ke sesama player server secara instan.</p>
                   </div>
                </div>

                <form onSubmit={handleTrade} className="space-y-5">
                   <div>
                      <label className="text-xs font-bold text-cyan-400 mb-2 block uppercase tracking-widest">Pilih Pemain Tujuan</label>
                      <select value={tradeTarget} onChange={e => setTradeTarget(e.target.value)} className="w-full bg-[#06101e] border border-cyan-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400">
                         <option value="">-- Pilih Player Online --</option>
                         {allPlayers.filter(p => p.id !== playerProfile.id).map(p => (
                            <option key={p.id} value={p.id}>{p.username} ({p.role})</option>
                         ))}
                      </select>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="text-xs font-bold text-cyan-400 mb-2 block uppercase tracking-widest">Tipe Item</label>
                         <select value={tradeType} onChange={e => setTradeType(e.target.value)} className="w-full bg-[#06101e] border border-cyan-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400">
                            <option value="money">Uang / Saldo</option>
                            {Object.keys(PS_DATA).filter(k=>k!=='vip').map(k => <option key={k} value={k}>Mesin {PS_DATA[k].name}</option>)}
                         </select>
                      </div>
                      <div>
                         <label className="text-xs font-bold text-cyan-400 mb-2 block uppercase tracking-widest">Jumlah / Nominal</label>
                         <input type="number" value={tradeAmount} onChange={e => setTradeAmount(e.target.value)} placeholder="0" className="w-full bg-[#06101e] border border-cyan-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400" />
                      </div>
                   </div>

                   <button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 py-4 rounded-xl font-black text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-transform active:scale-95 flex items-center justify-center gap-2 mt-4">
                      <Send size={18}/> Kirim Sekarang
                   </button>
                </form>
             </div>
          )}

          {/* === TAB: GACHA SALDO === */}
          {activeTab === 'gacha' && (
             <div className="max-w-3xl mx-auto space-y-6">
                <div className="bg-gradient-to-b from-[#0b1829]/80 to-[#06101e] rounded-3xl border border-amber-500/30 p-8 md:p-12 text-center backdrop-blur-xl shadow-[0_0_40px_rgba(245,158,11,0.15)] relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-full bg-amber-500/5 pointer-events-none"></div>
                   
                   <Dices size={80} className={`text-amber-400 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(245,158,11,0.6)] ${isGachaRolling ? 'animate-spin' : 'animate-bounce'}`} />
                   <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600 mb-2 tracking-widest uppercase drop-shadow-lg">Gacha Keberuntungan</h2>
                   <p className="text-slate-300 mb-10 text-sm max-w-lg mx-auto">Uji hoki Anda! Tentukan nominal taruhan dan dapatkan kesempatan memenangkan Jackpot hingga <strong className="text-amber-400">10x Lipat</strong>!</p>
                   
                   <div className="max-w-md mx-auto space-y-4 relative z-10">
                      <div className="text-left">
                         <label className="text-xs font-bold text-amber-400 mb-2 block uppercase tracking-widest">Nominal Taruhan (Rp)</label>
                         <input type="number" value={gachaBet} onChange={e => setGachaBet(e.target.value)} placeholder="Misal: 100000" className="w-full bg-[#06101e] border border-amber-900/50 rounded-xl px-4 py-4 text-xl font-black text-center text-white focus:outline-none focus:border-amber-400 shadow-inner" />
                      </div>
                      
                      <div className="flex gap-2 justify-center mb-6">
                          <button onClick={() => setGachaBet('100000')} className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg text-xs font-bold text-slate-300">100 Ribu</button>
                          <button onClick={() => setGachaBet('1000000')} className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg text-xs font-bold text-slate-300">1 Juta</button>
                          <button onClick={() => setGachaBet('10000000')} className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg text-xs font-bold text-slate-300">10 Juta</button>
                          <button onClick={() => setGachaBet(money.toString())} className="bg-rose-500/20 hover:bg-rose-500/40 border border-rose-500/30 px-4 py-2 rounded-lg text-xs font-black text-rose-400">ALL IN</button>
                      </div>

                      <button 
                         onClick={handleGacha} 
                         disabled={isGachaRolling || money < Number(gachaBet)}
                         className={`w-full relative overflow-hidden bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-black text-xl py-5 px-12 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed`}
                      >
                         {isGachaRolling ? 'MENGUNDI...' : 'ROLL GACHA SEKARANG'}
                      </button>
                   </div>
                   
                   <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold text-slate-400 border-t border-amber-900/50 pt-8 relative z-10">
                       <div className="bg-[#0b1829] p-4 rounded-xl border border-rose-500/30 text-rose-400 shadow-inner">💀 ZONK (0x)<br/><span className="text-[10px] font-normal text-slate-500">Peluang: 60%</span></div>
                       <div className="bg-[#0b1829] p-4 rounded-xl border border-cyan-500/30 text-cyan-400 shadow-inner">💵 KECIL (1.5x)<br/><span className="text-[10px] font-normal text-slate-500">Peluang: 30%</span></div>
                       <div className="bg-[#0b1829] p-4 rounded-xl border border-emerald-500/30 text-emerald-400 shadow-inner">💰 LUMAYAN (2x)<br/><span className="text-[10px] font-normal text-slate-500">Peluang: 9%</span></div>
                       <div className="bg-[#0b1829] p-4 rounded-xl border border-amber-500/30 text-amber-400 shadow-inner">👑 JACKPOT! (10x)<br/><span className="text-[10px] font-normal text-slate-500">Peluang: 1%</span></div>
                   </div>
                </div>
             </div>
          )}

          {/* === TAB: PINJOL (PINJAMAN ONLINE) === */}
          {activeTab === 'pinjol' && (
             <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-[#0b1829]/80 rounded-3xl border border-rose-500/20 p-6 md:p-8 backdrop-blur-xl shadow-[0_0_30px_rgba(225,29,72,0.1)] relative overflow-hidden">
                   <div className="absolute -top-10 -right-10 text-rose-900/10"><Landmark size={200} /></div>
                   
                   <div className="flex flex-col md:flex-row gap-8 relative z-10">
                      {/* INFO HUTANG */}
                      <div className="flex-1 bg-black/40 p-6 rounded-2xl border border-white/5 shadow-inner flex flex-col justify-center items-center text-center">
                          <h3 className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">Total Hutang Anda</h3>
                          <div className={`text-4xl md:text-5xl font-black mb-2 drop-shadow-md ${playerProfile?.debt > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                              {formatRp(playerProfile?.debt || 0)}
                          </div>
                          {playerProfile?.debt > 0 && (
                              <p className="text-[10px] text-rose-400 mt-2 bg-rose-950/40 px-3 py-1.5 rounded-lg border border-rose-500/30">
                                  ⚠️ Segera lunasi hutang Anda atau admin akan melakukan penagihan paksa!
                              </p>
                          )}
                      </div>

                      {/* FORM PINJAM / BAYAR */}
                      <div className="flex-1 space-y-6">
                          <div>
                              <h3 className="text-sm font-bold text-emerald-400 mb-3 flex items-center gap-2"><DollarSign size={16}/> Ajukan Pinjaman (Bunga {globalConfig.pinjolInterest || 20}%)</h3>
                              <div className="flex gap-2">
                                  <input type="number" value={pinjolAmount} onChange={e => setPinjolAmount(e.target.value)} placeholder="Nominal (Max 50M)" className="flex-1 bg-[#06101e] border border-emerald-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 shadow-inner" />
                                  <button onClick={handlePinjam} className="bg-emerald-600 hover:bg-emerald-500 px-5 rounded-xl font-bold text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-transform active:scale-95">Pinjam</button>
                              </div>
                          </div>
                          
                          <hr className="border-white/10" />

                          <div>
                              <h3 className="text-sm font-bold text-rose-400 mb-3 flex items-center gap-2"><CreditCard size={16}/> Bayar / Cicil Hutang</h3>
                              <div className="flex gap-2">
                                  <input type="number" value={payPinjolAmount} onChange={e => setPayPinjolAmount(e.target.value)} placeholder="Nominal Bayar" className="flex-1 bg-[#06101e] border border-rose-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 shadow-inner" />
                                  <button onClick={handlePayPinjol} className="bg-rose-600 hover:bg-rose-500 px-5 rounded-xl font-bold text-white shadow-[0_0_15px_rgba(225,29,72,0.3)] transition-transform active:scale-95">Bayar</button>
                              </div>
                              <button onClick={() => setPayPinjolAmount((playerProfile?.debt || 0).toString())} className="text-[10px] text-slate-400 hover:text-white mt-2 underline">Isi Lunas Semua</button>
                          </div>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {/* === TAB: ORDER BALANCE (TOP UP) === */}
          {activeTab === 'topup' && (
             <div className="max-w-5xl mx-auto space-y-10">
                {/* SECTION: PANGKAT PREMIUM */}
                <div>
                    <div className="text-center mb-8">
                       <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600 mb-2 tracking-widest uppercase drop-shadow-lg flex items-center justify-center gap-3"><Crown size={32} className="text-amber-500"/> Pangkat Premium</h2>
                       <p className="text-sm text-slate-400">Dapatkan diskon permanen, gaji harian, dan efek chat eksklusif!</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* MANAJER */}
                        <div className="bg-[#0b1829]/80 p-6 rounded-3xl border-2 border-yellow-500/50 text-center shadow-[0_0_20px_rgba(234,179,8,0.2)] backdrop-blur-xl relative overflow-hidden group">
                           <div className="bg-yellow-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.4)] group-hover:scale-110 transition-transform">
                               <Award size={32} className="text-yellow-400" />
                           </div>
                           <h3 className="text-2xl font-black text-yellow-400 mb-1">MANAJER</h3>
                           <p className="text-slate-300 mb-4 font-bold bg-black/40 py-1 rounded-lg">Rp 3.000</p>
                           <ul className="text-xs text-slate-300 text-left space-y-2 mb-6 border-t border-yellow-500/20 pt-4">
                               <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-yellow-400"/> Diskon Toko <b className="text-white">20%</b></li>
                               <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-yellow-400"/> Gaji <b className="text-white">150k</b> / Hari</li>
                               <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-yellow-400"/> Border Chat Khusus (Emas)</li>
                           </ul>
                           <button onClick={() => window.open(`https://wa.me/6285122900934?text=Halo admin, saya mau beli Pangkat MANAJER. UID saya: ${playerProfile.id}`)} className="w-full bg-yellow-600 hover:bg-yellow-500 py-3 rounded-xl text-xs font-black text-yellow-950 transition-all shadow-md uppercase tracking-wide">Beli via WA</button>
                        </div>

                        {/* DIREKTUR */}
                        <div className="bg-[#0b1829]/80 p-6 rounded-3xl border-2 border-cyan-400/50 text-center shadow-[0_0_30px_rgba(34,211,238,0.2)] backdrop-blur-xl relative overflow-hidden group transform md:-translate-y-4">
                           <div className="bg-cyan-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.4)] group-hover:scale-110 transition-transform">
                               <Award size={32} className="text-cyan-300" />
                           </div>
                           <h3 className="text-2xl font-black text-cyan-300 mb-1">DIREKTUR</h3>
                           <p className="text-slate-300 mb-4 font-bold bg-black/40 py-1 rounded-lg">Rp 5.000</p>
                           <ul className="text-xs text-slate-300 text-left space-y-2 mb-6 border-t border-cyan-500/20 pt-4">
                               <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-cyan-400"/> Diskon Toko <b className="text-white">35%</b></li>
                               <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-cyan-400"/> Gaji <b className="text-white">300k</b> / Hari</li>
                               <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-cyan-400"/> Border Chat (Biru Muda)</li>
                               <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-cyan-400"/> Warna Nama Biru Muda</li>
                           </ul>
                           <button onClick={() => window.open(`https://wa.me/6285122900934?text=Halo admin, saya mau beli Pangkat DIREKTUR. UID saya: ${playerProfile.id}`)} className="w-full bg-cyan-500 hover:bg-cyan-400 py-3 rounded-xl text-xs font-black text-cyan-950 transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)] uppercase tracking-wide">Beli via WA</button>
                        </div>

                        {/* CEO */}
                        <div className="bg-[#0b1829]/80 p-6 rounded-3xl border-2 border-red-600 text-center shadow-[0_0_40px_rgba(220,38,38,0.3)] backdrop-blur-xl relative overflow-hidden group">
                           <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl shadow-lg">TERBAIK</div>
                           <div className="bg-red-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/50 shadow-[0_0_20px_rgba(220,38,38,0.5)] group-hover:scale-110 transition-transform">
                               <Crown size={32} className="text-red-500" />
                           </div>
                           <h3 className="text-2xl font-black text-red-500 mb-1 flex items-center justify-center gap-2">CEO <Star size={16} className="fill-red-500"/></h3>
                           <p className="text-slate-300 mb-4 font-bold bg-black/40 py-1 rounded-lg">Rp 15.000</p>
                           <ul className="text-xs text-slate-300 text-left space-y-2 mb-6 border-t border-red-500/30 pt-4">
                               <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-red-500"/> Diskon Toko <b className="text-white">60%</b></li>
                               <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-red-500"/> Gaji <b className="text-white">550k</b> / Hari</li>
                               <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-red-500"/> Border Chat Merah Terang</li>
                               <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-red-500"/> Badge Bintang CEO Eksklusif</li>
                           </ul>
                           <button onClick={() => window.open(`https://wa.me/6285122900934?text=Halo admin, saya mau beli Pangkat CEO. UID saya: ${playerProfile.id}`)} className="w-full bg-red-600 hover:bg-red-500 py-3 rounded-xl text-xs font-black text-white transition-all shadow-[0_0_20px_rgba(220,38,38,0.6)] uppercase tracking-wide">Beli via WA</button>
                        </div>
                    </div>
                </div>

                <hr className="border-cyan-900/50" />

                {/* SECTION: ORDER SALDO */}
                <div>
                    <div className="text-center mb-8">
                       <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 mb-2 tracking-widest uppercase drop-shadow-lg">Order Saldo Game</h2>
                       <p className="text-sm text-slate-400">Butuh uang cepat? Top up saldo Juragan PS via WhatsApp Admin Resmi.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                       {[1, 2, 3, 4, 5].map((val) => (
                          <div key={val} className="bg-[#0b1829]/80 p-6 rounded-3xl border border-emerald-500/30 text-center shadow-[0_0_20px_rgba(16,185,129,0.1)] backdrop-blur-xl hover:border-emerald-500/60 transition-colors group">
                             <div className="bg-gradient-to-br from-emerald-500 to-teal-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_15px_rgba(16,185,129,0.5)] group-hover:scale-110 transition-transform">
                                 <DollarSign size={32} className="text-white" />
                             </div>
                             <h3 className="text-2xl font-black text-emerald-400 mb-1">{val} Juta Saldo</h3>
                             <p className="text-slate-300 mb-6 font-bold">Harga: <span className="text-white bg-white/10 px-2 py-0.5 rounded ml-1 border border-white/20">Rp {val}.000</span></p>
                             <div className="flex gap-2">
                                 <button onClick={() => window.open(`https://wa.me/6285122900934?text=Halo admin, saya mau order in-game balance ${val} Juta. UID saya: ${playerProfile.id}`)} className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-2 rounded-xl text-[10px] sm:text-xs font-bold text-white transition-all shadow-md">WA Admin 1</button>
                                 <button onClick={() => window.open(`https://wa.me/6285888233667?text=Halo admin, saya mau order in-game balance ${val} Juta. UID saya: ${playerProfile.id}`)} className="flex-1 bg-teal-600 hover:bg-teal-500 py-2 rounded-xl text-[10px] sm:text-xs font-bold text-white transition-all shadow-md">WA Admin 2</button>
                             </div>
                          </div>
                       ))}
                    </div>
                </div>
             </div>
          )}

          {/* === TAB: KERJA SAMPINGAN === */}
          {activeTab === 'sambilan' && (
            <div className="max-w-4xl mx-auto space-y-6">
               <div className="bg-[#0b1829]/80 border border-cyan-500/20 rounded-3xl p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-cyan-900/50 pb-4 gap-4">
                     <div>
                       <h2 className="text-xl font-black text-white flex items-center gap-2"><Briefcase className="text-emerald-400" /> Kasir Minimarket</h2>
                       <p className="text-sm text-slate-400">Kerja part-time jam 10:00 - 15:00. Hasilkan uang tambahan!</p>
                     </div>
                     {isCashier && (
                       <div className="bg-amber-500/10 border border-amber-500/30 px-5 py-2 rounded-xl flex flex-col items-center">
                         <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-0.5">Rating Kinerja</span>
                         <span className="text-2xl font-black text-amber-400 flex items-center gap-1.5"><Star size={20} className="fill-amber-400"/> {Math.min(10, Math.max(1, cashierRating)).toFixed(1)}</span>
                       </div>
                     )}
                  </div>

                  {!isCashier ? (
                     <div className="text-center py-10 bg-[#06101e]/80 rounded-2xl border border-white/5">
                        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-5 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.3)]"><BadgeCheck size={40} className="text-emerald-400"/></div>
                        <h3 className="text-xl font-black text-white mb-3">Lowongan Kasir Tersedia!</h3>
                        <p className="text-sm text-slate-300 max-w-md mx-auto mb-8">Dapat gaji besar jika rating bagus! Tapi awas, pelanggan ngamuk kalau kembalian lama.</p>
                        <button onClick={() => setIsCashier(true)} className="bg-emerald-600 hover:bg-emerald-500 px-8 py-3.5 rounded-xl font-black text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]">Lamar Pekerjaan (Gratis)</button>
                     </div>
                  ) : (
                     <div>
                        {(time.h >= 10 && time.h < 15) ? (
                           <div className="bg-[#06101e]/80 rounded-2xl p-4 sm:p-6 border border-white/5">
                              {!minimarketCust ? (
                                 <div className="text-center py-12 flex flex-col items-center justify-center">
                                    <RefreshCw size={40} className="text-cyan-400 animate-spin mb-4" />
                                    <span className="text-slate-300 font-bold">Menunggu pelanggan datang...</span>
                                 </div>
                              ) : (
                                 <div className="space-y-6">
                                    <div className="w-full bg-[#0b1829] rounded-full h-4 overflow-hidden border border-white/5">
                                       <div className={`h-full transition-all duration-1000 ease-linear ${minimarketCust.timer < 10 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${(minimarketCust.timer / minimarketCust.initialTimer) * 100}%` }}></div>
                                    </div>
                                    <div className="grid gap-3">
                                       {minimarketCust.items.map((item, idx) => (
                                          <div key={idx} className={`p-4 rounded-xl border flex justify-between items-center transition-colors ${item.scanned ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-[#0b1829] border-white/10'}`}>
                                             <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.scanned ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-slate-400'}`}><ScanLine size={20} /></div>
                                                <div>
                                                  <div className="text-sm font-bold text-white">{item.name}</div>
                                                  <div className="text-xs text-slate-400">Rp {item.price.toLocaleString()}</div>
                                                </div>
                                             </div>
                                             {!item.scanned ? (
                                                <button onClick={() => { setMinimarketCust(prev => { const n={...prev, items:[...prev.items]}; n.items[idx]={...n.items[idx], scanned:true}; return n; }) }} className="bg-cyan-600 hover:bg-cyan-500 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg">Scan</button>
                                             ) : <CheckCircle2 className="text-emerald-500"/>}
                                          </div>
                                       ))}
                                    </div>
                                    {minimarketCust.items.every(i => i.scanned) && (
                                       <div className="bg-[#0b1829] p-5 rounded-2xl border border-cyan-500/30 shadow-xl flex flex-col gap-6">
                                          <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                              <span className="text-white font-bold text-xl">Total: Rp {minimarketCust.total.toLocaleString()}</span>
                                              <span className="text-emerald-400 font-black text-xl">Bayar: Rp {minimarketCust.paid.toLocaleString()}</span>
                                          </div>
                                          <div className="flex flex-col gap-4">
                                              <div className="flex justify-between items-center mb-1">
                                                  <label className="text-[10px] text-slate-300 font-black uppercase tracking-widest">Kembalian Dipilih</label>
                                                  <button onClick={() => setMinimarketCust(prev => ({...prev, inputChange: 0}))} className="text-[10px] bg-rose-500/20 text-rose-300 px-3 py-1 rounded-full font-bold">Reset</button>
                                              </div>
                                              <div className="bg-[#06101e] border border-cyan-900/50 rounded-xl px-4 py-3 text-white font-bold text-2xl text-center shadow-inner">Rp {(minimarketCust.inputChange || 0).toLocaleString()}</div>
                                              <div className="flex flex-wrap gap-2 justify-center">
                                                  {[500, 1000, 2000, 5000, 10000, 20000, 50000, 100000].map(amount => (
                                                      <button key={amount} onClick={() => setMinimarketCust(prev => ({...prev, inputChange: (prev.inputChange || 0) + amount}))} className="bg-[#06101e] hover:bg-[#0b1829] border border-cyan-900/50 px-3 py-2 rounded-lg text-xs font-bold text-cyan-400 transition-all flex-1 min-w-[60px]">+{(amount>=1000)?amount/1000+'k':amount}</button>
                                                  ))}
                                              </div>
                                             <button onClick={() => {
                                                 if ((minimarketCust.inputChange || 0) === minimarketCust.expectedChange) {
                                                     setCashierRating(r => Math.min(10, r + 0.5)); showToast('✅ Benar!', 'success'); setMinimarketCust(null);
                                                 } else {
                                                     setCashierRating(r => Math.max(1, r - 1.0)); showToast(`❌ Salah! Kembalian hrsnya Rp ${minimarketCust.expectedChange}`, 'error'); setMinimarketCust(null);
                                                 }
                                             }} className="mt-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 py-4 rounded-xl font-black text-white shadow-lg">Beri Kembalian</button>
                                          </div>
                                       </div>
                                    )}
                                 </div>
                              )}
                           </div>
                        ) : (
                           <div className="text-center py-12 bg-[#06101e]/80 rounded-2xl border border-white/5">
                              <Clock size={56} className="text-slate-600 mx-auto mb-5 drop-shadow-md" />
                              <h3 className="text-xl font-bold text-white mb-2">Di Luar Jam Shift</h3>
                              <p className="text-sm text-slate-400 mb-8">Shift kamu jam <strong className="text-cyan-400">10:00 - 15:00</strong>.</p>
                              <button onClick={() => { setIsCashier(false); setCashierRating(5.0); }} className="bg-rose-600/10 text-rose-400 hover:bg-rose-600 hover:text-white border border-rose-500/30 px-6 py-3 rounded-xl text-sm font-bold transition-all">Resign</button>
                           </div>
                        )}
                     </div>
                  )}
               </div>
            </div>
          )}

          {/* === TAB: KARYAWAN === */}
          {activeTab === 'karyawan' && (
            <div className="max-w-5xl mx-auto">
               <div className="bg-[#0b1829]/60 p-6 rounded-3xl border border-cyan-900/50 backdrop-blur-xl shadow-2xl">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-black text-white flex items-center justify-center gap-2 mb-2"><Users size={28} className="text-cyan-400"/> Divisi Staf & Otomasi</h3>
                    <p className="text-sm text-slate-400">Rekrut karyawan untuk mengotomasi rental Anda.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[
                      { key: 'operator', icon: ShieldAlert, color: 'indigo', title: 'Keamanan (Anti Bolos)' },
                      { key: 'cook', icon: ChefHat, color: 'amber', title: 'Dapur (Auto F&B)' },
                      { key: 'teknisi', icon: Wrench, color: 'emerald', title: 'Teknisi (Auto Servis)' },
                      { key: 'marketing', icon: Megaphone, color: 'rose', title: 'Marketing (Banyak Tamu)' },
                      { key: 'kasir', icon: Calculator, color: 'sky', title: 'Kasir (+Income 10%)' },
                      { key: 'vip_manager', icon: Ban, color: 'purple', title: 'Kalag (Jaga VIP)' },
                      { key: 'janitor', icon: Sparkles, color: 'teal', title: 'Cleaning (Cegah Kotor)' }
                    ].map(role => {
                      const emp = hiredEmployees[role.key];
                      const job = jobMarket[role.key];
                      return (
                        <div key={role.key} className="bg-[#06101e]/80 border border-white/5 rounded-3xl p-5 flex flex-col justify-between h-[180px] shadow-lg">
                           <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-3">
                             <div className={`p-2 rounded-xl bg-${role.color}-500/20`}><role.icon size={20} className={`text-${role.color}-400`} /></div>
                             <span className="text-sm font-bold text-white">{role.title}</span>
                           </div>
                           <div className="flex-1 flex flex-col justify-end">
                             {emp ? (
                               <div className={`bg-${role.color}-900/30 border border-${role.color}-500/30 p-4 rounded-2xl flex justify-between items-center shadow-inner`}>
                                 <div>
                                   <div className="text-sm font-bold text-white mb-0.5">{emp.name}</div>
                                   <div className={`text-[10px] font-bold text-${role.color}-300`}>Rp {emp.salary.toLocaleString()}/hr</div>
                                 </div>
                                 <button onClick={() => fireEmployee(role.key)} className="bg-rose-600 hover:bg-rose-500 px-3 py-2 rounded-xl text-xs font-bold text-white shadow-lg">Pecat</button>
                               </div>
                             ) : (
                               <div className="bg-[#0b1829] border border-white/10 p-4 rounded-2xl flex justify-between items-center shadow-lg">
                                 <div>
                                   <div className="text-sm font-bold text-slate-200 mb-1">{job.name}</div>
                                   <div className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-md">Rp {job.salary.toLocaleString()}/hr</div>
                                 </div>
                                 <button onClick={() => hireEmployee(role.key)} className={`bg-${role.color}-600 hover:bg-${role.color}-500 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg`}>Rekrut</button>
                               </div>
                             )}
                           </div>
                        </div>
                      )
                    })}
                  </div>
               </div>
            </div>
          )}

          {/* === TAB: KABAR RENTAL (BERITA HARIAN) === */}
          {activeTab === 'berita' && (
             <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-[#0b1829]/80 p-8 rounded-3xl border border-cyan-500/20 backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.15)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-cyan-500/10 w-64 h-64 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    
                    <div className="flex items-center gap-4 mb-6 border-b border-cyan-900/50 pb-4 relative z-10">
                       <div className="p-4 bg-cyan-500/20 rounded-full border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]"><Newspaper size={32} /></div>
                       <div>
                          <h2 className="text-2xl font-black text-white">Kabar Rental Hari Ini</h2>
                          <p className="text-slate-400 text-sm">Informasi dan event terbaru dari Admin Server</p>
                       </div>
                    </div>

                    <div className="bg-[#06101e] p-6 rounded-2xl border border-white/5 shadow-inner relative z-10">
                       {globalConfig.dailyNews ? (
                           <div className="whitespace-pre-line text-slate-200 leading-relaxed font-medium">
                               {globalConfig.dailyNews}
                           </div>
                       ) : (
                           <div className="text-center text-slate-500 py-10 flex flex-col items-center justify-center">
                               <Newspaper size={40} className="mb-4 opacity-20" />
                               <span>Belum ada berita atau informasi terbaru hari ini.</span>
                           </div>
                       )}
                    </div>
                </div>
             </div>
          )}

          {/* === TAB: REPORT BUG & FEEDBACK === */}
          {activeTab === 'feedback' && (
             <div className="max-w-3xl mx-auto bg-[#0b1829]/80 rounded-3xl border border-cyan-500/20 p-6 md:p-8 backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-cyan-900/50">
                   <div className="bg-cyan-500/20 p-4 rounded-full border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.3)]"><Bug size={32} className="text-cyan-400" /></div>
                   <div>
                      <h2 className="text-2xl font-black text-white">Report Bug & Feedback</h2>
                      <p className="text-sm text-slate-400">Kirim laporan masalah, keluhan, atau saran ke Admin Server.</p>
                   </div>
                </div>
                <form onSubmit={submitReport} className="space-y-4">
                   <textarea 
                      value={reportInput} onChange={(e) => setReportInput(e.target.value)}
                      placeholder="Tuliskan laporan Anda di sini secara detail..."
                      className="w-full h-40 bg-[#06101e] border border-cyan-900/50 rounded-2xl p-4 text-white focus:outline-none focus:border-cyan-400 transition-colors resize-none shadow-inner"
                      required
                   />
                   <button type="submit" className="w-full bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 py-4 rounded-xl font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-transform active:scale-95 flex items-center justify-center gap-2">
                      <Send size={18}/> Kirim Laporan
                   </button>
                </form>
             </div>
          )}

          {/* === TAB: GLOBAL CHAT === */}
          {activeTab === 'globalChat' && (
            <div className="max-w-4xl mx-auto h-[calc(100vh-180px)] bg-[#0b1829]/80 rounded-2xl border border-cyan-900/50 flex flex-col overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.1)] backdrop-blur-xl">
               <div className="bg-[#06101e] p-4 flex justify-between items-center border-b border-cyan-900/50 shadow-md">
                  <div className="flex items-center gap-3">
                     <Globe className="text-cyan-400" />
                     <div>
                       <h2 className="text-sm font-bold text-white">Global Server Chat</h2>
                       <p className="text-[10px] text-slate-400">Interaksi sesama player</p>
                     </div>
                  </div>
               </div>
               
               <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                  {globalChat.length === 0 ? (
                     <div className="text-center text-slate-500 mt-10 text-sm">Belum ada obrolan di server.</div>
                  ) : globalChat.map((msg) => {
                     const isMe = msg.uid === playerProfile.id;
                     const isAdmin = msg.role === 'admin';
                     const isMod = msg.role === 'moderator';
                     const isManajer = msg.role === 'manajer';
                     const isDirektur = msg.role === 'direktur';
                     const isCEO = msg.role === 'ceo';
                     
                     let bubbleClass = isMe ? 'bg-cyan-600 text-white border border-cyan-500/50' : 'bg-[#06101e] border border-cyan-900/50 text-slate-200';
                     let nameClass = 'text-[10px] text-slate-400 mb-1 px-1 flex items-center gap-1';
                     let roleBadge = null;

                     if (isAdmin) {
                         bubbleClass = 'bg-indigo-950/60 border border-indigo-500/50 text-indigo-100 shadow-[0_0_15px_rgba(99,102,241,0.4)]';
                         roleBadge = <span className="bg-indigo-600 text-white px-1.5 py-0 rounded text-[8px] font-black uppercase shadow-[0_0_10px_rgba(99,102,241,0.5)]">Admin</span>;
                     } else if (isCEO) {
                         bubbleClass = 'bg-red-950/40 border-2 border-red-600 text-slate-100 shadow-[0_0_15px_rgba(220,38,38,0.4)]';
                         nameClass = 'text-[10px] font-black text-red-500 mb-1 px-1 flex items-center gap-1';
                         roleBadge = <><Star size={10} className="fill-red-500 text-red-500 animate-pulse"/><span className="bg-red-600 text-white px-1.5 py-0 rounded text-[8px] font-black uppercase">CEO</span></>;
                     } else if (isDirektur) {
                         bubbleClass = 'bg-cyan-950/40 border-2 border-cyan-400 text-slate-100 shadow-[0_0_10px_rgba(34,211,238,0.4)]';
                         nameClass = 'text-[10px] font-bold text-cyan-300 mb-1 px-1 flex items-center gap-1';
                         roleBadge = <span className="bg-cyan-500 text-cyan-950 px-1.5 py-0 rounded text-[8px] font-black uppercase">Direktur</span>;
                     } else if (isManajer) {
                         bubbleClass = 'bg-yellow-950/40 border border-yellow-500 text-slate-100 shadow-[0_0_10px_rgba(234,179,8,0.3)]';
                         roleBadge = <span className="bg-yellow-500 text-yellow-950 px-1.5 py-0 rounded text-[8px] font-black uppercase">Manajer</span>;
                     } else if (isMod) {
                         bubbleClass = 'bg-amber-950/60 border border-amber-500/50 text-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.4)]';
                         roleBadge = <span className="bg-amber-500 text-amber-950 px-1.5 py-0 rounded text-[8px] font-black uppercase shadow-[0_0_10px_rgba(245,158,11,0.5)]">Mod</span>;
                     }

                     return (
                       <div key={msg.id} className={`flex flex-col w-full ${isMe ? 'items-end' : 'items-start'}`}>
                          <div className={nameClass}>
                             {msg.sender} 
                             {isAdmin && <BadgeCheck size={12} className="text-blue-400 fill-blue-400/20 -ml-0.5" title="Verified Admin" />}
                             {isMod && <Wrench size={10} className="text-amber-400 -ml-0.5" title="Verified Moderator" />}
                             {roleBadge}
                          </div>
                          <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${bubbleClass} ${isMe && !isAdmin && !isMod && !isCEO && !isDirektur && !isManajer ? 'rounded-tr-sm' : ''} ${!isMe && !isAdmin && !isMod && !isCEO && !isDirektur && !isManajer ? 'rounded-tl-sm' : ''}`}>
                             {msg.text}
                          </div>
                       </div>
                     );
                  })}
                  <div ref={globalChatEndRef} />
               </div>

               <form onSubmit={sendGlobalChat} className="p-3 bg-[#06101e] flex gap-2 border-t border-cyan-900/50">
                  <input type="text" value={globalChatInput} onChange={e => setGlobalChatInput(e.target.value)} placeholder="Ketik pesan global..." className="flex-1 bg-[#0b1829] border border-cyan-900/50 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors shadow-inner" />
                  <button type="submit" disabled={!globalChatInput.trim()} className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 rounded-xl disabled:opacity-50 shadow-[0_0_10px_rgba(6,182,212,0.3)]"><Send size={18} /></button>
               </form>
            </div>
          )}

          {/* === TAB: ADMIN PANEL DENGAN AURA GELAP === */}
          {activeTab === 'admin' && (playerProfile.role === 'admin' || playerProfile.role === 'moderator') && (
            <div className="max-w-6xl mx-auto space-y-6">
               <div className={`border rounded-3xl p-6 backdrop-blur-xl transition-all shadow-2xl ${playerProfile.role === 'admin' ? 'bg-indigo-950/20 border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.15)]' : 'bg-amber-950/20 border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.15)]'}`}>
                  
                  <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                     <ShieldCheck size={32} className={playerProfile.role === 'admin' ? 'text-indigo-400' : 'text-amber-400'} />
                     <div>
                       <h2 className="text-xl font-black text-white">Server Control Panel</h2>
                       <p className={`text-xs ${playerProfile.role === 'admin' ? 'text-indigo-300' : 'text-amber-300'}`}>Akses Khusus {playerProfile.role.toUpperCase()}</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {/* SET BERITA HARIAN */}
                     <div className="bg-black/50 p-5 rounded-2xl border border-cyan-500/30 shadow-inner md:col-span-2 lg:col-span-3">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4"><Newspaper size={16} className="text-cyan-400"/> Update Berita Harian (Kabar Rental)</h3>
                        <div className="flex flex-col gap-3">
                            <textarea 
                               value={newsInput} 
                               onChange={e => setNewsInput(e.target.value)} 
                               placeholder="Tuliskan berita, lore, atau event hari ini... (Gunakan Enter untuk baris baru)" 
                               className="w-full h-32 bg-[#06101e] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 resize-none shadow-inner" 
                            />
                            <button onClick={adminSendNews} className="bg-cyan-600 hover:bg-cyan-500 py-3 rounded-lg text-xs font-bold text-white shadow-[0_0_15px_rgba(34,211,238,0.4)]">Terbitkan Berita</button>
                        </div>
                     </div>

                     {/* ADMIN DIRECT SEND (ADD SALDO / ITEM BEBAS) + CUSTOM MESSAGE */}
                     <div className="bg-black/50 p-5 rounded-2xl border border-emerald-500/30 shadow-inner">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4"><Zap size={16} className="text-emerald-400"/> Kirim Hadiah & Pesan</h3>
                        <form onSubmit={handleAdminDirectSend} className="space-y-3">
                            <select value={adminSendTarget} onChange={e => setAdminSendTarget(e.target.value)} className="w-full bg-[#06101e] border border-white/10 rounded-lg px-3 py-2 text-xs text-white">
                               <option value="">-- Pilih Target Player --</option>
                               {allPlayers.map(p => <option key={p.id} value={p.id}>{p.username}</option>)}
                            </select>
                            <div className="flex gap-2">
                               <select value={adminSendType} onChange={e => setAdminSendType(e.target.value)} className="w-1/2 bg-[#06101e] border border-white/10 rounded-lg px-3 py-2 text-xs text-white">
                                  <option value="money">Uang (Saldo)</option>
                                  {Object.keys(PS_DATA).filter(k=>k!=='vip').map(k => <option key={k} value={k}>Mesin {PS_DATA[k].name}</option>)}
                               </select>
                               <input type="number" value={adminSendAmount} onChange={e => setAdminSendAmount(e.target.value)} placeholder="Jumlah" className="w-1/2 bg-[#06101e] border border-white/10 rounded-lg px-3 py-2 text-xs text-white" />
                            </div>
                            <textarea value={adminSendMessage} onChange={e => setAdminSendMessage(e.target.value)} placeholder="Pesan Khusus (Opsional)..." className="w-full bg-[#06101e] border border-white/10 rounded-lg px-3 py-2 text-xs text-white resize-none h-16" />
                            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 py-2 rounded-lg text-xs font-bold text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]">Kirim ke Mailbox Player</button>
                        </form>
                     </div>

                     {/* UBAH PANGKAT PREMIUM */}
                     <div className="bg-black/50 p-5 rounded-2xl border border-amber-500/30 shadow-inner">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4"><Crown size={16} className="text-amber-500"/> Beri / Ubah Pangkat</h3>
                        <form onSubmit={handleAdminSetRole} className="space-y-3">
                            <select value={adminRoleTarget} onChange={e => setAdminRoleTarget(e.target.value)} className="w-full bg-[#06101e] border border-white/10 rounded-lg px-3 py-2 text-xs text-white">
                               <option value="">-- Pilih Target Player --</option>
                               {allPlayers.map(p => <option key={p.id} value={p.id}>{p.username}</option>)}
                            </select>
                            <select value={adminRoleType} onChange={e => setAdminRoleType(e.target.value)} className="w-full bg-[#06101e] border border-white/10 rounded-lg px-3 py-2 text-xs text-white uppercase font-bold">
                               <option value="user">User Biasa</option>
                               <option value="manajer">Manajer</option>
                               <option value="direktur">Direktur</option>
                               <option value="ceo">CEO</option>
                               <option value="moderator">Moderator</option>
                            </select>
                            <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 py-2 rounded-lg text-xs font-bold text-white shadow-[0_0_10px_rgba(245,158,11,0.4)] transition-colors mt-2">Tetapkan Pangkat</button>
                        </form>
                     </div>

                     {/* WIPE SALDO KHUSUS */}
                     <div className="bg-rose-950/40 p-5 rounded-2xl border border-rose-500/50 shadow-inner">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4"><AlertOctagon size={16} className="text-rose-500"/> Wipe Saldo Player</h3>
                        <form onSubmit={handleAdminWipeBalance} className="space-y-3">
                            <select value={wipeTarget} onChange={e => setWipeTarget(e.target.value)} className="w-full bg-[#06101e] border border-rose-500/30 rounded-lg px-3 py-2 text-xs text-white">
                               <option value="">-- Pilih Target Player --</option>
                               {allPlayers.map(p => <option key={p.id} value={p.id}>{p.username}</option>)}
                            </select>
                            <button type="submit" className="w-full bg-rose-700 hover:bg-rose-600 py-2 rounded-lg text-xs font-bold text-white shadow-[0_0_10px_rgba(225,29,72,0.4)] transition-colors mt-2">Eksekusi Wipe Saldo (Rp 0)</button>
                        </form>
                        <p className="text-[9px] text-rose-300 mt-3 text-center">Aksi ini menghapus seluruh uang target secara permanen.</p>
                     </div>

                     {/* GLOBAL EVENTS & SETTING PINJOL */}
                     <div className="bg-black/50 p-5 rounded-2xl border border-white/5 shadow-inner">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4"><Tag size={16} className="text-amber-400"/> Global Events & Diskon</h3>
                        <div className="space-y-4">
                           <div>
                              <div className="flex flex-wrap gap-2">
                                 <span className="text-xs text-slate-400 block w-full">Boost Multiplier:</span>
                                 {[1, 4, 8, 10, 15].map(val => (
                                   <button key={val} onClick={() => adminSetGlobal('boost', val)} className={`px-2 py-1 rounded text-xs font-bold border transition-colors ${globalConfig.boost === val ? 'bg-amber-500 text-amber-950 border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'}`}>x{val}</button>
                                 ))}
                              </div>
                           </div>
                           <div>
                              <div className="flex flex-wrap gap-2">
                                 <span className="text-xs text-slate-400 block w-full">Diskon Toko:</span>
                                 {[0, 10, 30, 50, 90].map(val => (
                                   <button key={val} onClick={() => adminSetGlobal('discount', val)} className={`px-2 py-1 rounded text-xs font-bold border transition-colors ${globalConfig.discount === val ? 'bg-emerald-500 text-emerald-950 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'}`}>{val}%</button>
                                 ))}
                              </div>
                           </div>
                           <div>
                              <div className="flex flex-wrap gap-2">
                                 <span className="text-xs text-slate-400 block w-full">Bunga Pinjol (%):</span>
                                 {[10, 20, 35, 50].map(val => (
                                   <button key={val} onClick={() => adminSetGlobal('pinjolInterest', val)} className={`px-2 py-1 rounded text-xs font-bold border transition-colors ${globalConfig.pinjolInterest === val ? 'bg-rose-500 text-rose-950 border-rose-400 shadow-[0_0_10px_rgba(225,29,72,0.5)]' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'}`}>{val}%</button>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* BROADCAST TULISAN ATAS */}
                     <div className="bg-black/50 p-5 rounded-2xl border border-white/5 shadow-inner">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4"><Megaphone size={16} className="text-sky-400"/> Broadcast Text Bar</h3>
                        <div className="flex flex-col gap-3">
                            <input type="text" value={broadcastInput} onChange={e => setBroadcastInput(e.target.value)} placeholder="Teks berjalan di atas..." className="w-full bg-[#06101e] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500" />
                            <button onClick={adminSendBroadcast} className="bg-sky-600 hover:bg-sky-500 py-2 rounded-lg text-xs font-bold text-white shadow-md">Kirim Siaran</button>
                        </div>
                     </div>

                     {/* MAINTENANCE */}
                     <div className="bg-black/50 p-5 rounded-2xl border border-white/5 shadow-inner">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4"><Settings size={16} className="text-slate-400"/> Server Status</h3>
                        <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5 mb-4 w-full">
                           <div>
                             <div className="text-sm font-bold text-white">Maintenance Mode</div>
                             <div className="text-[9px] text-slate-400">Blokir login player biasa</div>
                           </div>
                           <button onClick={() => adminSetGlobal('maintenance', !globalConfig.maintenance)} className={`w-10 h-5 rounded-full relative transition-colors shadow-inner ${globalConfig.maintenance ? 'bg-rose-500' : 'bg-slate-700'}`}>
                              <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all shadow-md ${globalConfig.maintenance ? 'left-5' : 'left-0.5'}`}></div>
                           </button>
                        </div>
                     </div>
                  </div>

                  {/* LAPORAN BUG & FEEDBACK PANEL */}
                  <div className="mt-6 bg-black/50 p-5 rounded-2xl border border-white/5 shadow-inner">
                     <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4"><MessageSquare size={16} className="text-emerald-400"/> Laporan Bug & Banding ({reports.length})</h3>
                     {reports.length === 0 ? (
                        <div className="text-xs text-slate-500 text-center py-4 bg-white/5 rounded-xl border border-white/5">Tidak ada laporan baru.</div>
                     ) : (
                        <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                           {reports.map(rep => (
                              <div key={rep.id} className={`bg-white/5 p-4 rounded-xl border relative ${rep.type === 'appeal' ? 'border-amber-500/40 bg-amber-950/20' : 'border-white/10'}`}>
                                 <div className="flex justify-between items-start mb-2">
                                    <div className="text-xs font-bold text-emerald-400">
                                        {rep.sender} <span className="text-[9px] text-slate-500 font-normal">({rep.uid})</span>
                                        {rep.type === 'appeal' && <span className="ml-2 bg-amber-600 text-white px-1.5 py-0.5 rounded text-[8px] uppercase">Aju Banding</span>}
                                    </div>
                                    <button onClick={() => adminDeleteReport(rep.id)} className="text-rose-400 hover:text-rose-300 p-1"><Trash2 size={14}/></button>
                                 </div>
                                 <div className="text-sm text-slate-200">{rep.text}</div>
                                 
                                 {rep.type === 'appeal' && (
                                     <div className="mt-3 flex gap-2">
                                         <button onClick={() => { adminToggleBan(rep.uid, false); adminDeleteReport(rep.id); }} className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-md transition-colors">Terima Banding (Unban)</button>
                                         <button onClick={() => adminDeleteReport(rep.id)} className="bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-md transition-colors">Tolak</button>
                                     </div>
                                 )}
                                 <div className="text-[9px] text-slate-500 text-right mt-2">{new Date(rep.timestamp).toLocaleString()}</div>
                              </div>
                           ))}
                        </div>
                     )}
                  </div>

                  {/* USER MANAGEMENT */}
                  <div className="mt-6 bg-black/50 p-5 rounded-2xl border border-white/5 shadow-inner">
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                         <h3 className="text-sm font-bold text-white flex items-center gap-2"><Users size={16} className="text-indigo-400"/> Player Management List</h3>
                         <input 
                             type="text" 
                             placeholder="Cari Username atau UID..." 
                             value={playerSearch}
                             onChange={e => setPlayerSearch(e.target.value)}
                             className="bg-[#06101e] border border-cyan-900/50 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 w-full md:w-64 shadow-inner"
                         />
                     </div>
                     <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left text-sm text-slate-300 min-w-[800px]">
                           <thead className="bg-white/5 text-xs uppercase font-bold text-slate-400 border-b border-white/10">
                              <tr>
                                 <th className="p-3">Player Info (UID Lengkap)</th>
                                 <th className="p-3">Role</th>
                                 <th className="p-3">Statistik & Hutang</th>
                                 <th className="p-3">Status</th>
                                 <th className="p-3">Aksi Admin</th>
                              </tr>
                           </thead>
                           <tbody>
                              {allPlayers.filter(p => p.username.toLowerCase().includes(playerSearch.toLowerCase()) || p.id.includes(playerSearch)).map(p => (
                                 <tr key={p.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                    <td className="p-3">
                                       <div className={`font-bold text-sm flex items-center gap-1 ${p.isBanned ? 'text-rose-500 line-through' : 'text-cyan-300'}`}>
                                          {p.username} 
                                          {p.role === 'admin' && <BadgeCheck size={14} className="text-blue-400 fill-blue-400/20" title="Verified Admin"/>}
                                          {p.role === 'moderator' && <Wrench size={12} className="text-amber-400" title="Verified Moderator"/>}
                                          {p.role === 'ceo' && <Star size={10} className="text-red-500 fill-red-500"/>}
                                       </div>
                                       <div className="text-[10px] text-slate-400 font-mono mt-0.5 select-all">UID: {p.id}</div>
                                       <div className="text-[10px] text-emerald-400 mt-0.5">Rental: {p.shopName || 'Juragan PS'}</div>
                                    </td>
                                    <td className="p-3">
                                       <span className={`uppercase text-[10px] font-bold px-2 py-1 rounded inline-block ${p.role === 'admin' ? 'bg-indigo-600 text-white' : p.role === 'ceo' ? 'bg-red-600 text-white' : p.role === 'direktur' ? 'bg-cyan-500 text-cyan-950' : p.role === 'manajer' ? 'bg-yellow-500 text-yellow-950' : 'bg-slate-700 text-slate-300'}`}>
                                          {p.role}
                                       </span>
                                    </td>
                                    <td className="p-3">
                                        <div className="font-bold text-emerald-400 text-xs">{p.role === 'admin' ? 'UNLIMITED' : formatRp(p.money || 0)}</div>
                                        <div className="text-[10px] text-amber-400 flex items-center gap-1 mt-1"><Star size={10} className="fill-amber-400"/> Reputasi: {p.reputation ?? 100}%</div>
                                        {p.debt > 0 && <div className="text-[10px] text-rose-500 font-bold flex items-center gap-1 mt-1"><Landmark size={10}/> Hutang: {formatRp(p.debt)}</div>}
                                    </td>
                                    <td className="p-3">
                                       {p.isBanned ? <span className="bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded text-[9px] font-black uppercase shadow-[0_0_5px_rgba(225,29,72,0.3)]">BANNED</span> : <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[9px] font-black uppercase">Aktif</span>}
                                    </td>
                                    <td className="p-3 flex flex-wrap gap-2 items-center">
                                       {!ADMIN_ACCOUNTS.hasOwnProperty(p.username.toLowerCase()) && (
                                          <button onClick={() => adminToggleBan(p.id, p.isBanned)} className={`${p.isBanned ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-slate-600 hover:bg-slate-500'} text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all shadow-md`}>{p.isBanned ? 'UNBAN' : 'BAN'}</button>
                                       )}
                                       {p.debt > 0 && (
                                          <button onClick={() => adminForceCollectPinjol(p.id)} className="bg-rose-800 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all shadow-md flex items-center gap-1"><Skull size={12}/> Tagih Paksa</button>
                                       )}
                                    </td>
                                 </tr>
                              ))}
                              {allPlayers.filter(p => p.username.toLowerCase().includes(playerSearch.toLowerCase()) || p.id.includes(playerSearch)).length === 0 && (
                                  <tr>
                                      <td colSpan="5" className="p-6 text-center text-slate-500 text-xs">Player tidak ditemukan.</td>
                                  </tr>
                              )}
                           </tbody>
                        </table>
                     </div>
                  </div>

               </div>
            </div>
          )}

          {/* === TAB: SUPPORT ME === */}
          {activeTab === 'support' && (
             <div className="max-w-2xl mx-auto flex flex-col items-center justify-center py-10">
                <div className="bg-pink-500/20 w-24 h-24 rounded-full flex items-center justify-center mb-6 border border-pink-500/50 shadow-[0_0_30px_rgba(236,72,153,0.5)] animate-pulse">
                    <HeartHandshake size={48} className="text-pink-400" />
                </div>
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-600 mb-4 tracking-widest text-center">SUPPORT DEVELOPER</h1>
                <p className="text-slate-300 text-center max-w-lg mb-10 text-sm leading-relaxed">
                   Terima kasih telah bermain Juragan Rental PS Multiplayer! Server dan database ini berjalan 24 jam untuk Anda secara gratis. Jika Anda ingin mendukung pengembangan fitur baru dan memperpanjang umur server, Anda bisa memberikan donasi seikhlasnya.
                </p>

                <div className="bg-[#0b1829]/80 border border-pink-500/30 rounded-3xl p-8 w-full backdrop-blur-xl shadow-[0_0_20px_rgba(236,72,153,0.1)] flex flex-col items-center">
                    <Coffee size={32} className="text-pink-400 mb-4"/>
                    <h3 className="text-xl font-bold text-white mb-6">Traktir Kami Kopi ☕</h3>
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        <button onClick={() => window.open(`https://saweria.co`)} className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:scale-105 text-amber-950 py-3 px-8 rounded-xl font-black shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-transform w-full sm:w-auto">
                           Via Saweria
                        </button>
                        <button onClick={() => window.open(`https://trakteer.id`)} className="bg-gradient-to-r from-rose-500 to-pink-600 hover:scale-105 text-white py-3 px-8 rounded-xl font-black shadow-[0_0_15px_rgba(225,29,72,0.4)] transition-transform w-full sm:w-auto">
                           Via Trakteer
                        </button>
                    </div>
                </div>
             </div>
          )}

          {/* === TAB: CREDITS (MEWAH & AURA) === */}
          {activeTab === 'credits' && (
             <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-10">
                <Sparkles size={48} className="text-cyan-400 mb-6 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)] animate-pulse" />
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-10 tracking-widest drop-shadow-lg text-center">DEVELOPER CREDITS</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                   {[
                     { name: "Ryoo", role: "Lead Developer", color: "cyan" },
                     { name: "FrsTRBL", role: "System Architect", color: "blue" },
                     { name: "BINZZ", role: "UI/UX Designer", color: "sky" }
                   ].map((dev, idx) => (
                      <div key={idx} className={`bg-[#06101e]/80 border border-${dev.color}-500/50 rounded-3xl p-8 flex flex-col items-center text-center shadow-[0_0_30px_rgba(34,211,238,0.2)] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] transition-all transform hover:-translate-y-2 group backdrop-blur-xl`}>
                         <div className={`w-24 h-24 rounded-full bg-gradient-to-br from-${dev.color}-600 to-[#020617] p-1 mb-4 shadow-[0_0_20px_rgba(34,211,238,0.5)] group-hover:scale-110 transition-transform`}>
                            <div className="w-full h-full bg-[#0b1829] rounded-full flex items-center justify-center">
                               <span className={`text-3xl font-black text-${dev.color}-400`}>{dev.name[0]}</span>
                            </div>
                         </div>
                         <h2 className={`text-2xl font-black text-${dev.color}-400 mb-1 tracking-wide`}>{dev.name}</h2>
                         <p className="text-sm text-slate-400 uppercase tracking-widest">{dev.role}</p>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {/* === TAB: EASTER EGG PS === */}
          {activeTab === 'easteregg' && money >= 5000000 && (
             <div className="max-w-3xl mx-auto bg-gradient-to-br from-amber-950/80 to-black rounded-3xl border border-amber-500/50 p-10 text-center shadow-[0_0_50px_rgba(245,158,11,0.3)] backdrop-blur-2xl">
                <Trophy size={64} className="text-amber-400 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(245,158,11,0.8)] animate-bounce" />
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-600 mb-4 tracking-widest uppercase">Perkumpulan Pemula Squat</h1>
                <p className="text-slate-300 mb-10 text-lg">Anda telah mencapai kekayaan luar biasa dan menemukan markas rahasia PS.</p>
                
                <div className="flex flex-wrap justify-center gap-4">
                   {['Rull', 'Reii', 'Falz', 'Ryoo', 'FrsTRBL', 'Binzz'].map((name, i) => (
                      <div key={i} className="bg-amber-500/10 border border-amber-500/30 px-6 py-3 rounded-full text-amber-300 font-bold text-lg shadow-inner hover:bg-amber-500/20 transition-colors">
                         {name}
                      </div>
                   ))}
                </div>
             </div>
          )}

        </main>
      </div>
      
      {/* NOTIFICATIONS */}
      <div className="fixed bottom-6 right-6 z-50 pointer-events-none flex flex-col gap-3 items-end">
         {toasts.map((toast) => (
            <div key={toast.id} className={`pointer-events-auto px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl animate-in fade-in text-xs font-bold border flex items-center gap-3 ${toast.type === 'error' ? 'bg-rose-950/90 text-rose-100 border-rose-500/50 shadow-[0_0_20px_rgba(225,29,72,0.4)]' : toast.type === 'success' ? 'bg-emerald-950/90 text-emerald-100 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.4)]' : toast.type === 'special' ? 'bg-amber-950/90 text-amber-100 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.4)]' : 'bg-cyan-950/90 text-cyan-100 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.4)]'}`}>
              <span>{toast.msg}</span>
            </div>
         ))}
      </div>
      <style>{`.custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(34,211,238,0.2); border-radius: 10px; } .animate-in { animation: animateIn 0.3s forwards; } @keyframes animateIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
