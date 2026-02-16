-- Tab: posts
CREATE TABLE posts (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT,
    author TEXT,
    content TEXT,
    image TEXT,
    "youtubeUrl" TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    trending BOOLEAN DEFAULT FALSE
);

-- Tab: categories
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT DEFAULT 'blue'
);

-- Tab: terms
CREATE TABLE terms (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT,
    revision TEXT,
    url TEXT,
    content TEXT,
    "isActive" BOOLEAN DEFAULT TRUE,
    date TIMESTAMPTZ DEFAULT NOW()
);

-- Tab: users
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    role TEXT DEFAULT 'user'
);

-- Tab: settings (Hanya 1 baris)
CREATE TABLE settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    social JSONB DEFAULT '{}'::jsonb,
    site JSONB DEFAULT '{}'::jsonb,
    CONSTRAINT one_row CHECK (id = 1)
);

-- Masukkan data awal untuk settings jika kosong
INSERT INTO settings (id, social) 
VALUES (1, '{"instagram": "#", "tiktok": "#", "youtube": "#", "linkedin": "#", "googleForm": "#"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
