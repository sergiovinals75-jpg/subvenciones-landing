// Vercel KV helper
// Docs: https://vercel.com/docs/storage/vercel-kv

const { kv } = require('@vercel/kv');

// Users
async function createUser(user) {
  await kv.set(`user:${user.id}`, JSON.stringify(user));
  await kv.set(`user:email:${user.email}`, user.id);
  return user;
}

async function getUserById(id) {
  const data = await kv.get(`user:${id}`);
  return data ? JSON.parse(data) : null;
}

async function getUserByEmail(email) {
  const id = await kv.get(`user:email:${email}`);
  if (!id) return null;
  return getUserById(id);
}

async function updateUser(id, updates) {
  const user = await getUserById(id);
  if (!user) return null;
  const updated = { ...user, ...updates };
  await kv.set(`user:${id}`, JSON.stringify(updated));
  return updated;
}

// Usage
async function getUsage(userId, month) {
  const key = `usage:${userId}:${month}`;
  const data = await kv.get(key);
  if (!data) {
    const usage = { searches: 0, analyses: 0, pdfs: 0 };
    await kv.set(key, JSON.stringify(usage));
    return usage;
  }
  return JSON.parse(data);
}

async function incrementUsage(userId, month, type) {
  const key = `usage:${userId}:${month}`;
  const usage = await getUsage(userId, month);
  usage[type] = (usage[type] || 0) + 1;
  await kv.set(key, JSON.stringify(usage));
  return usage;
}

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  getUsage,
  incrementUsage
};
