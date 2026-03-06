const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = "ryoo_pokemon";

// KONEKSI KE MYSQL (Ganti sesuai data VPS/Pterodactyl Anda)
const db = mysql.createPool({
    host: 'localhost', // Atau IP VPS Anda
    user: 'juraganps',      // Username Database
    password: 'pokemon12',      // Password Database
    database: 'juragan_ps' // Nama Database
});

// -- LOGIN & REGISTER --
app.post('/api/auth/register', async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const [existing] = await db.query("SELECT * FROM players WHERE username = ?", [username]);
        if (existing.length > 0) return res.status(400).json({ error: "Username sudah dipakai!" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = Date.now().toString();
        
        const defaultInv = JSON.stringify({ jadul: 0, reguler: 0, mantap: 0, sultan: 0 });
        const defaultPS = JSON.stringify({ jadul: 0, reguler: 0, mantap: 0, sultan: 0, vip: 0 });
        const defaultEmp = JSON.stringify({ operator: null, cook: null, teknisi: null, marketing: null, kasir: null, vip_manager: null, janitor: null });
        const achieved = JSON.stringify({ m5: false, m10: false, m100: false });

        await db.query(`INSERT INTO players (id, username, password, role, inventory, installed_ps, hired_employees, achieved) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
                        [userId, username, hashedPassword, role || 'user', defaultInv, defaultPS, defaultEmp, achieved]);

        const token = jwt.sign({ id: userId, username, role: role || 'user' }, JWT_SECRET);
        res.json({ token, user: { id: userId, username, role: role || 'user' } });
    } catch (err) {
        res.status(500).json({ error: "Gagal register server." });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await db.query("SELECT * FROM players WHERE username = ?", [username]);
        if (rows.length === 0) return res.status(400).json({ error: "Akun tidak ditemukan!" });

        const user = rows[0];
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ error: "Password salah!" });

        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET);
        res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: "Gagal login server." });
    }
});

// -- SYNC DATA --
app.get('/api/sync', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Ambil Data Diri Sendiri
        const [myProfile] = await db.query("SELECT * FROM players WHERE id = ?", [decoded.id]);
        let profile = myProfile[0];
        
        // Parse JSON
        if(profile) {
            profile.inventory = typeof profile.inventory === 'string' ? JSON.parse(profile.inventory) : profile.inventory;
            profile.installed_ps = typeof profile.installed_ps === 'string' ? JSON.parse(profile.installed_ps) : profile.installed_ps;
            profile.hired_employees = typeof profile.hired_employees === 'string' ? JSON.parse(profile.hired_employees) : profile.hired_employees;
            profile.achieved = typeof profile.achieved === 'string' ? JSON.parse(profile.achieved) : profile.achieved;
        }

        // Ambil Mail
        const [mails] = await db.query("SELECT * FROM mail WHERE receiver_uid = ?", [decoded.id]);
        if(profile) profile.mail = mails;

        // Ambil Data Global Server
        const [config] = await db.query("SELECT * FROM global_config WHERE id = 1");
        const [chat] = await db.query("SELECT * FROM global_chat ORDER BY timestamp DESC LIMIT 50");
        const [players] = await db.query("SELECT id, username, role, money, reputation, is_banned, shop_name as shopName, debt FROM players");
        const [reports] = await db.query("SELECT * FROM reports ORDER BY timestamp DESC");

        res.json({
            profile: profile,
            globalConfig: config[0] || {},
            globalChat: chat.reverse(),
            allPlayers: players,
            reports: reports
        });
    } catch (err) {
        res.status(500).json({ error: "Sync failed" });
    }
});

// -- SAVE DATA PLAYER --
app.post('/api/save', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const d = req.body;
        
        await db.query(`UPDATE players SET 
            money = ?, reputation = ?, building_lvl = ?, shop_name = ?, debt = ?,
            fb_unlocked = ?, fan_unlocked = ?, ac_unlocked = ?,
            inventory = ?, installed_ps = ?, hired_employees = ?, achieved = ?, last_daily_claim = ?
            WHERE id = ?`, 
            [
                d.money, d.reputation, d.buildingLvl, d.shopName, d.debt || 0,
                d.fbUnlocked, d.fanUnlocked, d.acUnlocked,
                JSON.stringify(d.inventory), JSON.stringify(d.installedPS), JSON.stringify(d.hiredEmployees), JSON.stringify(d.achieved), d.lastDailyClaim,
                decoded.id
            ]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Save failed" });
    }
});

// -- ENDPOINT AKSI LAINNYA --
app.post('/api/action', async (req, res) => {
    const { action, payload } = req.body;
    try {
        if (action === 'sendChat') {
            await db.query("INSERT INTO global_chat (uid, sender, role, text, timestamp) VALUES (?, ?, ?, ?, ?)", [payload.uid, payload.sender, payload.role, payload.text, payload.timestamp]);
        } 
        else if (action === 'updateConfig') {
            const keys = Object.keys(payload);
            for(let key of keys) {
                await db.query(`UPDATE global_config SET ${key} = ? WHERE id = 1`, [payload[key]]);
            }
        }
        else if (action === 'adminAction') {
            if (payload.type === 'setRole') {
                await db.query("UPDATE players SET role = ? WHERE id = ?", [payload.role, payload.targetId]);
            } else if (payload.type === 'wipeMoney') {
                await db.query("UPDATE players SET money = 0 WHERE id = ?", [payload.targetId]);
            } else if (payload.type === 'toggleBan') {
                await db.query("UPDATE players SET is_banned = ? WHERE id = ?", [payload.status, payload.targetId]);
            }
        }
        else if (action === 'sendMail') {
            await db.query("INSERT INTO mail (id, receiver_uid, title, body, type, has_attachment, attachment_type, attachment_amount, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", 
            [payload.id, payload.receiver_uid, payload.title, payload.body, payload.type, payload.has_attachment, payload.attachment_type, payload.attachment_amount, payload.timestamp]);
        }
        else if (action === 'claimMail') {
            await db.query("UPDATE mail SET is_claimed = true WHERE id = ?", [payload.mailId]);
        }
        else if (action === 'readMail') {
            await db.query("UPDATE mail SET read_status = true WHERE receiver_uid = ?", [payload.uid]);
        }
        else if (action === 'sendReport') {
            await db.query("INSERT INTO reports (uid, sender, type, text, timestamp) VALUES (?, ?, ?, ?, ?)", [payload.uid, payload.sender, payload.type, payload.text, payload.timestamp]);
        }
        else if (action === 'deleteReport') {
            await db.query("DELETE FROM reports WHERE id = ?", [payload.reportId]);
        }

        res.json({ success: true });
    } catch(err) {
        res.status(500).json({ error: "Action failed" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server Backend MySQL berjalan di port ${PORT}`));
