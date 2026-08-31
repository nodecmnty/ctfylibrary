export interface Asset {
  Kode: string;
  Nama: string;
  Kategori?: string;
  Harga?: string;
  Tanggal?: string;
  Link5MB?: string;
  LinkDrive?: string;
  LinkAsset?: string;
  LinkTiktok?: string;
  Deskripsi?: string;
  Thumbnail?: string;
}

export type FilterType = 'all' | 'free' | 'pro' | 'paid' | 'new' | 'fav';

export type SortType = 'newest' | 'popular' | 'name-asc' | 'code-asc';

export type SyncStatusType = 'live' | 'offline' | 'local' | 'connecting';
