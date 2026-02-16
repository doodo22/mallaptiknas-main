require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY not found in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateData() {
    console.log('--- Starting Migration ---');

    // 1. Migrate Categories
    const categoriesPath = path.join(__dirname, '../src/data/categories.json');
    if (fs.existsSync(categoriesPath)) {
        console.log('Migrating Categories...');
        const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
        const { error } = await supabase.from('categories').upsert(categories);
        if (error) console.error('Error migrating categories:', error.message);
        else console.log('Categories migrated successfully.');
    }

    // 2. Migrate Posts
    const postsPath = path.join(__dirname, '../src/data/posts.json');
    if (fs.existsSync(postsPath)) {
        console.log('Migrating Posts...');
        const posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
        // Map data to match schema if necessary (e.g., camelCase to snake_case if DB uses it)
        // Based on our schema.sql: id, title, category, author, content, image, youtubeUrl, created_at, trending
        const formattedPosts = posts.map(p => ({
            id: p.id,
            title: p.title,
            category: p.category,
            author: p.author,
            content: p.content,
            image: p.image,
            youtubeUrl: p.youtubeUrl,
            created_at: p.created_at,
            trending: p.trending || false
        }));
        const { error } = await supabase.from('posts').upsert(formattedPosts);
        if (error) console.error('Error migrating posts:', error.message);
        else console.log('Posts migrated successfully.');
    }

    // 3. Migrate Terms
    const termsPath = path.join(__dirname, '../src/data/terms.json');
    if (fs.existsSync(termsPath)) {
        console.log('Migrating Terms...');
        const terms = JSON.parse(fs.readFileSync(termsPath, 'utf8'));
        const formattedTerms = terms.map(t => ({
            id: t.id,
            title: t.title,
            slug: t.slug,
            revision: t.revision,
            url: t.url,
            content: t.content,
            isActive: t.isActive,
            date: t.date
        }));
        const { error } = await supabase.from('terms').upsert(formattedTerms);
        if (error) console.error('Error migrating terms:', error.message);
        else console.log('Terms migrated successfully.');
    }

    // 4. Migrate Users
    const usersPath = path.join(__dirname, '../src/data/users.json');
    if (fs.existsSync(usersPath)) {
        console.log('Migrating Users...');
        const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
        const formattedUsers = users.map(u => ({
            id: u.id,
            username: u.username,
            password: u.password,
            is_active: u.is_active,
            created_at: u.created_at || new Date().toISOString(),
            role: u.role || 'user'
        }));
        const { error } = await supabase.from('users').upsert(formattedUsers);
        if (error) console.error('Error migrating users:', error.message);
        else console.log('Users migrated successfully.');
    }

    // 5. Migrate Settings
    const settingsPath = path.join(__dirname, '../src/data/settings.json');
    if (fs.existsSync(settingsPath)) {
        console.log('Migrating Settings...');
        const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
        const { error } = await supabase.from('settings').upsert({
            id: 1,
            social: settings.social || {},
            site: settings.site || {}
        });
        if (error) console.error('Error migrating settings:', error.message);
        else console.log('Settings migrated successfully.');
    }

    console.log('--- Migration Completed ---');
}

migrateData();
