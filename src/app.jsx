import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, DollarSign, Store, ShoppingCart, UserX, AlertTriangle, 
  Coffee, ArrowUpCircle, MessageCircle, Monitor, Star, AlertOctagon, 
  Edit2, Users, ChefHat, ShieldAlert, BadgeCheck, Gamepad2, ScrollText, 
  Trash2, User, LayoutGrid, RefreshCw, Send, CheckCircle2, XCircle,
  Wrench, Megaphone, Calculator, Smartphone, ChevronLeft, Bell,
  CloudUpload, CloudDownload, Briefcase, ScanLine, Volume2, VolumeX, FastForward,
  Wind, Ban, Globe, Zap, Settings, ShieldCheck, Tag, LogOut, Bug, MessageSquare,
  Crown, Skull, Gift, Code, Sparkles, SendToBack, Repeat, CreditCard, Snowflake,
  Mail, MailOpen, Inbox
} from 'lucide-react';

// --- FIREBASE CLOUD SAVE INIT ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, onSnapshot, addDoc, updateDoc, deleteDoc, increment } from 'firebase/firestore';

let db, auth, appId;

const firebaseConfig = {
  apiKey: "AIzaSyAiRdNk_hd9iTRVyjLx0pu9upNQWHzSQlA",
  authDomain: "ps-simulator-database.firebaseapp.com",
  databaseURL: "https://ps-simulator-database-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ps-simulator-database",
  storageBucket: "ps-simulator-database.firebasestorage.app",
  messagingSenderId: "331614108947",
  appId: "1:331614108947:web:1ccdfc348124aec951aee6"
};

try {

const app = initializeApp(firebaseConfig);

auth = getAuth(app);
db = getFirestore(app);

appId = "ps-simulator";

} catch (e) {
 console.error("Firebase init failed", e);
}


// --- DATABASE & CONSTANTS ---
const PS_DATA = {
  jadul: { name: 'PS Jadul', price: 120000, rentPrice: 5000, color: 'from-slate-500 to-slate-700', glow: 'shadow-slate-500/50' },
  reguler: { name: 'PS Reguler', price: 350000, rentPrice: 10000, color: 'from-cyan-500 to-cyan-700', glow: 'shadow-cyan-500/50' },
  mantap: { name: 'PS Mantap', price: 1500000, rentPrice: 20000, color: 'from-blue-500 to-blue-700', glow: 'shadow-blue-500/50' },
  sultan: { name: 'PS Sultan', price: 15000000, rentPrice: 30000, color: 'from-amber-400 to-amber-600', glow: 'shadow-amber-500/50' },
  vip: { name: 'VIP + Sultan', price: 15000000, rentPrice: 50000, color: 'from-rose-500 to-rose-700', glow: 'shadow-rose-500/50' }, 
};

const BUILDINGS = [
  { id: 0, name: "Kios Awal", price: 0, slots: { jadul: 4, reguler: 0, mantap: 0, sultan: 0, vip: 0 }, layout: [{ name: "Ruangan Sempit", types: ['jadul'] }] },
  { id: 1, name: "Gedung Biasa", price: 3000000, slots: { jadul: 5, reguler: 3, mantap: 0, sultan: 0, vip: 0 }, layout: [{ name: "Lantai 1", types: ['jadul', 'reguler'] }] },
  { id: 2, name: "Gedung Menengah", price: 3000000, slots: { jadul: 3, reguler: 5, mantap: 2, sultan: 0, vip: 0 }, layout: [{ name: "Lantai 1", types: ['jadul', 'reguler', 'mantap'] }] },
  { id: 3, name: "Gedung Mahal", price: 10000000, slots: { jadul: 0, reguler: 10, mantap: 5, sultan: 2, vip: 0 }, layout: [{ name: "Lantai Utama", types: ['reguler', 'mantap'] }, { name: "Lantai VIP", types: ['sultan'] }] },
  { id: 4, name: "Gedung Pengusaha", price: 80000000, slots: { jadul: 0, reguler: 20, mantap: 15, sultan: 0, vip: 10 }, layout: [{ name: "Lantai 1", types: ['reguler'] }, { name: "Lantai 2", types: ['mantap'] }, { name: "Lantai 3 (VVIP)", types: ['vip'] }] },
];

const ORDER_PACKAGES = [
  { id: 1, money: 5000000, price: 1000, name: 'Paket Pemula' },
  { id: 2, money: 25000000, price: 5000, name: 'Paket Menengah' },
  { id: 3, money: 50000000, price: 10000, name: 'Paket Pro' },
  { id: 4, money: 100000000, price: 20000, name: 'Paket Juragan' },
  { id: 5, money: 500000000, price: 100000, name: 'Paket Sultan' }
];

export default function App() {
  // --- AUTH & MULTIPLAYER STATE ---
  const [user, setUser] = useState(null);
  const [playerProfile, setPlayerProfile] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authInput, setAuthInput] = useState('');
  const [authSecret, setAuthSecret] = useState('');
  
  // --- GLOBAL DATABASE STATE ---
  const [globalConfig, setGlobalConfig] = useState({ boost: 1, discount: 0, maintenance: false, broadcast: "" });
  const [globalChat, setGlobalChat] = useState([]);
  const [globalChatInput, setGlobalChatInput] = useState('');
  const [allPlayers, setAllPlayers] = useState([]);
  const [reports, setReports] = useState([]);
  const [mails, setMails] = useState([]); // Sistem Kotak Masuk Baru
  
  const [reportInput, setReportInput] = useState('');
  const [broadcastInput, setBroadcastInput] = useState('');
  const [appealInput, setAppealInput] = useState(''); 

  // --- LOCAL GAME STATE ---
  const [shopName, setShopName] = useState("Juragan PS");
  const [money, setMoney] = useState(1800000); 
  const [inventory, setInventory] = useState({ jadul: 0, reguler: 0, mantap: 0, sultan: 0 });
  const [fanUnlocked, setFanUnlocked] = useState(false);
  const [acUnlocked, setAcUnlocked] = useState(false);
  
  const [time, setTime] = useState({ h: 7, m: 0 });
  const [day, setDay] = useState(1);
  const [isOpen, setIsOpen] = useState(true);
  const [buildingLvl, setBuildingLvl] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  const [installedPS, setInstalledPS] = useState({ jadul: 0, reguler: 0, mantap: 0, sultan: 0, vip: 0 });
  const [activeRentals, setActiveRentals] = useState({});
  const [toasts, setToasts] = useState([]); 
  const [activeTab, setActiveTab] = useState('rental');

  const [hiredEmployees, setHiredEmployees] = useState({ operator: null, cook: null, teknisi: null, marketing: null, kasir: null, vip_manager: null });
  const [jobMarket, setJobMarket] = useState({
    operator: { id: 1, name: 'Satria', role: 'operator', salary: 50000, desc: 'Auto Usir Anak Bolos' },
    cook: { id: 2, name: 'Chelsea', role: 'cook', salary: 70000, desc: 'Auto Layani F&B' },
    teknisi: { id: 3, name: 'Jono', role: 'teknisi', salary: 60000, desc: 'Auto Perbaiki Stik Rusak' },
    marketing: { id: 4, name: 'Dita', role: 'marketing', salary: 80000, desc: 'Banyak Pelanggan' },
    kasir: { id: 5, name: 'Adel', role: 'kasir', salary: 45000, desc: 'Bonus Income Rental +10%' },
    vip_manager: { id: 6, name: 'Kalag', role: 'vip_manager', salary: 150000, desc: 'Auto Usir Perokok VIP' }
  });

  const [isCashier, setIsCashier] = useState(false);
  const [cashierRating, setCashierRating] = useState(5.0);
  const [minimarketCust, setMinimarketCust] = useState(null);

  // Trade & Admin Add Saldo State
  const [tradeTarget, setTradeTarget] = useState('');
  const [tradeType, setTradeType] = useState('money');
  const [tradeAmount, setTradeAmount] = useState(0);
  
  const [adminGiftTarget, setAdminGiftTarget] = useState('');
  const [adminGiftType, setAdminGiftType] = useState('money');
  const [adminGiftAmount, setAdminGiftAmount] = useState('');
  const [adminGiftMessage, setAdminGiftMessage] = useState('Bonus dari Admin!');

  const globalChatEndRef = useRef(null);

  // Refs for Game Loop
  const timeRef = useRef(time);
  const dayRef = useRef(day);
  const isOpenRef = useRef(isOpen);
  const buildingLvlRef = useRef(buildingLvl);
  const installedPSRef = useRef(installedPS);
  const activeRentalsRef = useRef(activeRentals);
  const gameOverRef = useRef(gameOver);
  const hiredEmployeesRef = useRef(hiredEmployees);
  const moneyRef = useRef(money);
  const inventoryRef = useRef(inventory);
  const globalConfigRef = useRef(globalConfig);
  const isCashierRef = useRef(isCashier);
  const minimarketCustRef = useRef(minimarketCust);
  const fanRef = useRef(fanUnlocked);
  const acRef = useRef(acUnlocked);

  useEffect(() => { timeRef.current = time; }, [time]);
  useEffect(() => { dayRef.current = day; }, [day]);
  useEffect(() => { isOpenRef.current = isOpen; }, [isOpen]);
  useEffect(() => { buildingLvlRef.current = buildingLvl; }, [buildingLvl]);
  useEffect(() => { installedPSRef.current = installedPS; }, [installedPS]);
  useEffect(() => { activeRentalsRef.current = activeRentals; }, [activeRentals]);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);
  useEffect(() => { hiredEmployeesRef.current = hiredEmployees; }, [hiredEmployees]);
  useEffect(() => { moneyRef.current = money; }, [money]);
  useEffect(() => { inventoryRef.current = inventory; }, [inventory]);
  useEffect(() => { globalConfigRef.current = globalConfig; }, [globalConfig]);
  useEffect(() => { isCashierRef.current = isCashier; }, [isCashier]);
  useEffect(() => { minimarketCustRef.current = minimarketCust; }, [minimarketCust]);
  useEffect(() => { fanRef.current = fanUnlocked; }, [fanUnlocked]);
  useEffect(() => { acRef.current = acUnlocked; }, [acUnlocked]);

  useEffect(() => { if (globalChatEndRef.current && activeTab === 'globalChat') globalChatEndRef.current.scrollIntoView({ behavior: 'smooth' }); }, [globalChat, activeTab]);

  const formatRp = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  const formatTime = (h, m) => `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  
  const showToast = (msg, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, msg, type }].slice(-5));
    setTimeout(() => { setToasts(prev => prev.filter(t => t.id !== id)); }, 3000);
  };

  // --- FIREBASE INIT & LISTENERS ---
  useEffect(() => {
    if (!auth) { setIsAuthLoading(false); return; }

    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth error", err);
      }
    };
    initAuth();

    const unsubscribeAuth = onAuthStateChanged(auth, async (currUser) => {
      setUser(currUser);
      if (currUser) {
        const profileRef = doc(db, 'artifacts', appId, 'public', 'data', 'players', currUser.uid);
        const snap = await getDoc(profileRef);
        if (snap.exists()) {
           const data = snap.data();
           setPlayerProfile({ id: currUser.uid, ...data });
           setMoney(data.money || 1800000);
           if (data.inventory) setInventory(data.inventory);
           if (data.fanUnlocked !== undefined) setFanUnlocked(data.fanUnlocked);
           if (data.acUnlocked !== undefined) setAcUnlocked(data.acUnlocked);
        } else {
           setPlayerProfile(null); 
        }
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  // Sync Global Data & Admin Lists
  useEffect(() => {
    if (!user || !db) return;

    const configRef = doc(db, 'artifacts', appId, 'public', 'data', 'globalConfig', 'settings');
    const unsubConfig = onSnapshot(configRef, (docSnap) => {
       if (docSnap.exists()) setGlobalConfig(docSnap.data());
       else setDoc(configRef, { boost: 1, discount: 0, maintenance: false, broadcast: "" });
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
       
       const me = p.find(x => x.id === user.uid);
       if (me) setPlayerProfile(me);
    }, (err) => console.error(err));

    const repRef = collection(db, 'artifacts', appId, 'public', 'data', 'reports');
    const unsubRep = onSnapshot(repRef, (snap) => {
        const r = [];
        snap.forEach(d => r.push({ id: d.id, ...d.data() }));
        r.sort((a, b) => b.timestamp - a.timestamp);
        setReports(r);
    }, (err) => console.error(err));

    // Listen to Mail Inbox
    const mailsRef = collection(db, 'artifacts', appId, 'public', 'data', 'mails');
    const unsubMails = onSnapshot(mailsRef, (snap) => {
        const m = [];
        snap.forEach(d => m.push({ id: d.id, ...d.data() }));
        // Kita filter di sisi client sesuai rule 2
        setMails(m.filter(mail => mail.targetUid === user.uid).sort((a, b) => b.timestamp - a.timestamp));
    }, (err) => console.error(err));

    return () => { unsubConfig(); unsubChat(); unsubPlayers(); unsubRep(); unsubMails(); };
  }, [user]);

  // Realtime Sync Saldo & Inventory ke Database
  useEffect(() => {
     if (!user || !playerProfile) return;
     const interval = setInterval(() => {
        let needsUpdate = false;
        const updates = {};
        if (moneyRef.current !== playerProfile.money) { updates.money = moneyRef.current; needsUpdate = true; }
        if (JSON.stringify(inventoryRef.current) !== JSON.stringify(playerProfile.inventory)) { updates.inventory = inventoryRef.current; needsUpdate = true; }
        if (fanRef.current !== playerProfile.fanUnlocked) { updates.fanUnlocked = fanRef.current; needsUpdate = true; }
        if (acRef.current !== playerProfile.acUnlocked) { updates.acUnlocked = acRef.current; needsUpdate = true; }
        
        if (needsUpdate) {
           const profileRef = doc(db, 'artifacts', appId, 'public', 'data', 'players', user.uid);
           updateDoc(profileRef, updates).catch(e=>console.log(e));
        }
     }, 5000);
     return () => clearInterval(interval);
  }, [user, playerProfile]);

  // --- ACTIONS ---
  const handleRegisterLogin = async () => {
    if (!authInput.trim()) return showToast("Username tidak boleh kosong!", "error");
    if (authInput.length > 12) return showToast("Username maks 12 karakter!", "error");
    
    try {
      const profileRef = doc(db, 'artifacts', appId, 'public', 'data', 'players', user.uid);
      let role = 'user';
      if (authInput === 'ps' && authSecret === 'ps12__') role = 'admin';
      else if (authSecret === 'qwerty__') role = 'admin';

      const newData = { username: authInput, role, money: 1800000, joined: Date.now(), isBanned: false, inventory: { jadul: 0, reguler: 0, mantap: 0, sultan: 0 } };
      await setDoc(profileRef, newData);
      setPlayerProfile({ id: user.uid, ...newData });
      setMoney(1800000);
      showToast(`Berhasil masuk sebagai ${role}!`, "success");
    } catch (e) { showToast("Gagal mendaftar.", "error"); }
  };

  const handleLogout = () => {
      try {
          setPlayerProfile(null); setAuthInput(''); setAuthSecret(''); setActiveTab('rental');
          showToast("Berhasil Log Out", "success");
      } catch (e) { showToast("Gagal log out", "error"); }
  };

  const sendGlobalChat = async (e) => {
     e.preventDefault();
     if (!globalChatInput.trim() || !playerProfile) return;
     try {
       const chatRef = collection(db, 'artifacts', appId, 'public', 'data', 'globalChat');
       await addDoc(chatRef, { sender: playerProfile.username, role: playerProfile.role, uid: playerProfile.id, text: globalChatInput.trim(), timestamp: Date.now() });
       setGlobalChatInput('');
     } catch (e) { showToast("Gagal mengirim pesan", "error"); }
  };

  const submitReport = async (e) => {
     e.preventDefault();
     if (!reportInput.trim() || !playerProfile) return;
     try {
         const repRef = collection(db, 'artifacts', appId, 'public', 'data', 'reports');
         await addDoc(repRef, { sender: playerProfile.username, uid: playerProfile.id, text: reportInput.trim(), timestamp: Date.now(), type: 'bug' });
         setReportInput(''); showToast("Laporan berhasil dikirim!", "success");
     } catch(e) { showToast("Gagal mengirim laporan", "error"); }
  };

  const submitAppeal = async (e) => {
     e.preventDefault();
     if (!appealInput.trim() || !playerProfile) return;
     try {
         const repRef = collection(db, 'artifacts', appId, 'public', 'data', 'reports');
         await addDoc(repRef, { sender: playerProfile.username, uid: playerProfile.id, text: appealInput.trim(), timestamp: Date.now(), type: 'appeal' });
         setAppealInput(''); showToast("Banding terkirim! Silakan tunggu keputusan Admin.", "success");
     } catch(e) { showToast("Gagal mengirim banding", "error"); }
  };

  // MAIL INBOX SYSTEM
  const handleClaimMail = async (mail) => {
     try {
        if (mail.type === 'money') {
           setMoney(m => m + mail.amount);
           showToast(`Menerima ${formatRp(mail.amount)} dari ${mail.senderName}`, "success");
        } else {
           setInventory(prev => ({ ...prev, [mail.type]: (prev[mail.type] || 0) + mail.amount }));
           showToast(`Menerima ${mail.amount}x ${PS_DATA[mail.type].name} dari ${mail.senderName}`, "success");
        }
        
        // Hapus atau tandai claimed
        const mailRef = doc(db, 'artifacts', appId, 'public', 'data', 'mails', mail.id);
        await updateDoc(mailRef, { isClaimed: true });
     } catch (e) { showToast("Gagal klaim hadiah!", "error"); }
  };

  // TRANSFER SYSTEM (MENGGUNAKAN MAIL INBOX)
  const handleTransfer = async () => {
     if (!tradeTarget) return showToast("Pilih pemain tujuan!", "error");
     if (tradeTarget === user.uid) return showToast("Tidak bisa kirim ke diri sendiri!", "error");
     
     const amt = Number(tradeAmount);
     if (amt <= 0) return showToast("Jumlah tidak valid!", "error");

     const targetPlayer = allPlayers.find(p => p.id === tradeTarget);
     if (!targetPlayer) return showToast("Pemain tidak ditemukan!", "error");

     try {
         // Deduct locally IF NOT ADMIN
         if (playerProfile.role !== 'admin') {
             if (tradeType === 'money') {
                 if (money < amt) return showToast("Uang tidak cukup!", "error");
                 setMoney(m => m - amt);
             } else {
                 if (inventory[tradeType] < amt) return showToast("Mesin PS tidak cukup!", "error");
                 setInventory(prev => ({ ...prev, [tradeType]: prev[tradeType] - amt }));
             }
         }

         // Send Mail to Target
         const mailRef = collection(db, 'artifacts', appId, 'public', 'data', 'mails');
         await addDoc(mailRef, {
             targetUid: tradeTarget,
             senderName: playerProfile.username,
             type: tradeType,
             amount: amt,
             message: `Transfer dari Trade Market`,
             timestamp: Date.now(),
             isClaimed: false
         });

         showToast(`Berhasil mengirim ke ${targetPlayer.username}. Menunggu mereka klaim.`, "success");
         setTradeAmount(0);
     } catch (e) { showToast("Gagal melakukan transfer!", "error"); console.error(e); }
  };

  // ORDER BALANCE
  const handleOrderBalance = (pkg) => {
      const numbers = ['6285122900934', '6285888233667'];
      const num = numbers[Math.floor(Math.random() * numbers.length)];
      const text = `Halo Admin, saya mau order Balance Game Juragan PS:
Paket: ${pkg.name} (${formatRp(pkg.money)})
Harga: Rp ${pkg.price}
UID Saya: ${playerProfile.id}
Username: ${playerProfile.username}`;
      window.open(`https://wa.me/${num}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // ADMIN ACTIONS
  const adminSetGlobal = async (key, val) => {
      try {
         const configRef = doc(db, 'artifacts', appId, 'public', 'data', 'globalConfig', 'settings');
         await updateDoc(configRef, { [key]: val });
         showToast(`Global ${key} diubah`, 'success');
      } catch (e) { showToast("Gagal update global config", 'error'); }
  };
  const adminSendBroadcast = async () => {
      adminSetGlobal('broadcast', broadcastInput);
      setBroadcastInput('');
  };
  const adminClearBroadcast = ()
