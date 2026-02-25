import { toFormData } from 'axios';
import SHA256 from 'crypto-js/sha256';

export const hashPassword = (val: string): string => {
  return SHA256(val).toString();
};

export function isImageUrl(url: string) {
  const imageExtensionPattern = /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i;
  return imageExtensionPattern.test(url);
}

export function formData(obj: object) {
  // Handle array, harus menggunakan [] di key nya
  return toFormData(obj, undefined, { indexes: false });
}

export function debounce<Arg>(func: (arg: Arg) => void, delay = 500): (arg: Arg) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (arg: Arg) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(arg);
    }, delay);
  };
}

export function randomString(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export const calculateAge = (val: string) => {
  const currentDate = new Date();
  const birthDate = new Date(val);

  const years = currentDate.getFullYear() - birthDate.getFullYear();
  const months = currentDate.getMonth() - birthDate.getMonth();
  const days = currentDate.getDate() - birthDate.getDate();

  let age = years + months / 12;

  if (days < 0) {
    age -= 1 / 12;
  }

  return age;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

export function getInitials(name: string): string {
  if (!name) return '';

  // Pisahkan nama berdasarkan spasi, filter agar tidak ada string kosong
  const words = name.trim().split(/\s+/).filter(Boolean);

  // Ambil huruf pertama tiap kata, lalu gabungkan
  const initials = words.map((word) => word[0].toUpperCase()).join('');

  return initials;
}

export function nextTick(action: () => void) {
  setTimeout(() => {
    action();
  }, 0);
}

// Fungsi untuk menghitung lebar kolom 'Action'
export const getActionColumnWidth = (n: number) => {
  return 75 + 35 * (n - 1);
};
