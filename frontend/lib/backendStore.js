import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'pathfinders.json');
let writeQueue = Promise.resolve();

async function readStore() {
  try {
    return JSON.parse(await readFile(DATA_FILE, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return { users: {}, emailIndex: {} };
  }
}

async function updateStore(update) {
  const task = writeQueue.then(async () => {
    const store = await readStore();
    const result = await update(store);
    await mkdir(DATA_DIR, { recursive: true });
    const temporary = `${DATA_FILE}.${randomUUID()}.tmp`;
    await writeFile(temporary, JSON.stringify(store), { mode: 0o600 });
    await rename(temporary, DATA_FILE);
    return result;
  });
  writeQueue = task.catch(() => {});
  return task;
}

export const backendStore = {
  async findUserByEmail(email) {
    const store = await readStore();
    const id = store.emailIndex[email.toLowerCase()];
    return id ? store.users[id] || null : null;
  },
  async findUserById(id) {
    const store = await readStore();
    return store.users[id] || null;
  },
  async createUser({ email, passwordHash, profile }) {
    return updateStore((store) => {
      const normalizedEmail = email.toLowerCase();
      if (store.emailIndex[normalizedEmail]) return null;
      const id = `usr_${randomUUID()}`;
      const user = {
        id,
        email: normalizedEmail,
        passwordHash,
        profile: { ...profile, id, email: normalizedEmail },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      store.users[id] = user;
      store.emailIndex[normalizedEmail] = id;
      return user;
    });
  },
  async updateProfile(id, profile) {
    return updateStore((store) => {
      const user = store.users[id];
      if (!user) return null;
      user.profile = { ...user.profile, ...profile, id, email: user.email };
      user.updatedAt = new Date().toISOString();
      return user;
    });
  },
};

export function publicProfile(user) {
  if (!user) return null;
  const { passwordHash, ...profile } = user.profile;
  return profile;
}
