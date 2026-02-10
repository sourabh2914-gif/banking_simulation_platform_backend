const STORAGE_KEY = 'banking_registered_users';

export const loadUsers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveUsers = (users) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};
