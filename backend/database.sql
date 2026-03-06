CREATE TABLE IF NOT EXISTS players (
    id VARCHAR(100) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    money BIGINT DEFAULT 1800000,
    reputation INT DEFAULT 100,
    debt BIGINT DEFAULT 0,
    inventory JSON,
    installed_ps JSON,
    hired_employees JSON,
    building_lvl INT DEFAULT 0,
    shop_name VARCHAR(50) DEFAULT 'Juragan PS',
    fb_unlocked BOOLEAN DEFAULT false,
    fan_unlocked BOOLEAN DEFAULT false,
    ac_unlocked BOOLEAN DEFAULT false,
    is_banned BOOLEAN DEFAULT false,
    last_daily_claim BIGINT DEFAULT 0,
    achieved JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS global_chat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uid VARCHAR(100),
    sender VARCHAR(50),
    role VARCHAR(20),
    text TEXT,
    timestamp BIGINT
);

CREATE TABLE IF NOT EXISTS global_config (
    id INT PRIMARY KEY DEFAULT 1,
    boost INT DEFAULT 1,
    discount INT DEFAULT 0,
    maintenance BOOLEAN DEFAULT false,
    broadcast TEXT,
    daily_news TEXT,
    pinjol_interest INT DEFAULT 20,
    sys_broadcast_msg TEXT,
    sys_broadcast_time BIGINT
);

CREATE TABLE IF NOT EXISTS reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uid VARCHAR(100),
    sender VARCHAR(50),
    type VARCHAR(20),
    text TEXT,
    timestamp BIGINT
);

CREATE TABLE IF NOT EXISTS mail (
    id BIGINT PRIMARY KEY,
    receiver_uid VARCHAR(100),
    title VARCHAR(100),
    body TEXT,
    type VARCHAR(50),
    has_attachment BOOLEAN DEFAULT false,
    attachment_type VARCHAR(50),
    attachment_amount BIGINT DEFAULT 0,
    is_claimed BOOLEAN DEFAULT false,
    read_status BOOLEAN DEFAULT false,
    timestamp BIGINT
);

-- Masukkan data pengaturan awal server
INSERT IGNORE INTO global_config (id, boost, discount, pinjol_interest) VALUES (1, 1, 0, 20);
