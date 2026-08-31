import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, updateDoc, setDoc, getDocs, collection, increment } from 'firebase/firestore';
import { Asset, SyncStatusType } from '../types';

// Exact Google Sheets Apps Script API URL - DO NOT MODIFY
export const API_URL = 'https://script.google.com/macros/s/AKfycbxGBXI-W9rj6PzpeoSf_84HBq4CQnXwD9CoynIoRIfD9RWWyfArU7qf9R8yl4DTOchs/exec';

export const WA_NUMBER = '6285745535579';
export const ORDER_EMAIL = 'myxrin2748@gmail.com';

export const CACHE_KEY = 'ctfy_v90_data';
export const FAVORITES_KEY = 'ctfy_favorites';
export const DOWNLOADS_KEY = 'ctfy_downloads';

const firebaseConfig = {
  apiKey: "AIzaSyATWmme05sKVI2qCPWvdVP5NFHIQ64eJ-o",
  authDomain: "pusat-link-cattfly.firebaseapp.com",
  databaseURL: "https://pusat-link-cattfly-default-rtdb.firebaseio.com",
  projectId: "pusat-link-cattfly",
  storageBucket: "pusat-link-cattfly.firebasestorage.app",
  messagingSenderId: "37808781852",
  appId: "1:37808781852:web:35e5b9d4f1776065bdbdd9",
  measurementId: "G-15SJYB7TNN"
};

let db: ReturnType<typeof getFirestore> | null = null;
let firebaseInitialized = false;

try {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  db = getFirestore(app);
  firebaseInitialized = true;
} catch (e) {
  console.warn('Firebase init fallback:', e);
}

export function getCachedAssets(): Asset[] | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    if (parsed && Array.isArray(parsed.data) && parsed.data.length > 0) {
      return parsed.data;
    }
  } catch (e) {
    console.error('Error reading cache:', e);
  }
  return null;
}

export function saveCachedAssets(assets: Asset[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data: assets, timestamp: Date.now() }));
  } catch (e) {
    console.error('Error saving cache:', e);
  }
}

export async function fetchAssetsFromGoogleSheets(): Promise<Asset[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(API_URL, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const raw = await res.json();
    if (Array.isArray(raw) && raw.length > 0) {
      const validAssets: Asset[] = raw
        .filter((item) => item && typeof item === 'object' && item.Kode)
        .reverse();
      saveCachedAssets(validAssets);
      return validAssets;
    }
    throw new Error('Format data tidak valid');
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export function getStoredDownloads(): Record<string, number> {
  try {
    const d = localStorage.getItem(DOWNLOADS_KEY);
    return d ? JSON.parse(d) : {};
  } catch (e) {
    return {};
  }
}

export async function loadFirestoreDownloads(): Promise<Record<string, number>> {
  const localDownloads = getStoredDownloads();
  if (!firebaseInitialized || !db) return localDownloads;

  try {
    const snapshot = await getDocs(collection(db, 'assets'));
    let changed = false;
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.downloads !== undefined) {
        localDownloads[docSnap.id] = Number(data.downloads) || 0;
        changed = true;
      }
    });
    if (changed) {
      localStorage.setItem(DOWNLOADS_KEY, JSON.stringify(localDownloads));
    }
    return localDownloads;
  } catch (e) {
    console.warn('Firestore download sync warning:', e);
    return localDownloads;
  }
}

export async function trackAssetDownload(id: string): Promise<number> {
  const localDownloads = getStoredDownloads();
  const current = (localDownloads[id] || 0) + 1;
  localDownloads[id] = current;
  localStorage.setItem(DOWNLOADS_KEY, JSON.stringify(localDownloads));

  if (firebaseInitialized && db) {
    try {
      const assetRef = doc(db, 'assets', id);
      await updateDoc(assetRef, {
        downloads: increment(1),
        lastDownload: new Date().toISOString()
      }).catch(async () => {
        await setDoc(assetRef, {
          downloads: current,
          lastDownload: new Date().toISOString()
        }, { merge: true });
      });
    } catch (e) {
      console.warn('Firebase download increment failed, stored locally:', e);
    }
  }

  return current;
}

export function isPaidItem(item: Asset): boolean {
  return (item.Harga || '').toString().toLowerCase().trim() === 'paid';
}

export function isProItem(item: Asset): boolean {
  if (isPaidItem(item)) return false;
  return (item.Kategori || '').toLowerCase().includes('pro');
}

export function getItemType(item: Asset): 'free' | 'pro' | 'paid' {
  if (isPaidItem(item)) return 'paid';
  if (isProItem(item)) return 'pro';
  return 'free';
}

export function isNewItem(dateStr?: string): boolean {
  if (!dateStr) return false;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return false;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 14); // Consider new within 14 days
    return d > weekAgo;
  } catch (e) {
    return false;
  }
}

const TAG_MAP: Record<string, string[]> = {
  'motion graphic': ['motion', 'animation', 'after effects'],
  'template': ['template', 'alight motion', 'premiere pro'],
  'sound effect': ['sfx', 'audio', 'sound'],
  'transition': ['transition', 'glitch', 'cinematic'],
  'logo': ['logo', 'reveal', 'intro'],
  'preset': ['preset', 'color grading', 'lut'],
  'typography': ['text animation', 'typography', 'kinetic']
};

export function getTags(item: Asset): string[] {
  const tags: string[] = [];
  const kategori = (item.Kategori || '').toLowerCase();
  const nama = (item.Nama || '').toLowerCase();

  for (const [catKey, catTags] of Object.entries(TAG_MAP)) {
    if (kategori.includes(catKey) || nama.includes(catKey)) {
      tags.push(...catTags);
    }
  }

  if (nama.includes('gaming') || kategori.includes('gaming')) tags.push('gaming');
  if (nama.includes('velocity') || kategori.includes('velocity')) tags.push('velocity');
  if (nama.includes('xml')) tags.push('xml');
  if (nama.includes('am') || nama.includes('alight')) tags.push('alight motion');
  if (nama.includes('capcut')) tags.push('capcut');
  if (nama.includes('ae')) tags.push('after effects');
  if (nama.includes('jedag')) tags.push('jj');
  if (nama.includes('3d')) tags.push('3d');

  if (tags.length === 0) {
    tags.push('motion', 'creative');
  }

  return Array.from(new Set(tags)).slice(0, 4);
}

export function formatDateIndonesian(dateStr?: string): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch (e) {
    return dateStr;
  }
}
