// src/types.ts

// For the main Home Page activity feed

// src/types.ts

// ... other types ...

export interface LostFoundItem {
  id?: string;
  itemName: string;
  status: 'lost' | 'found';
  lastSeen: string;
  lostTime: string; // <-- ADD THIS
  description: string;
  contactInfo: string;
  itemImageURL?: string; // <-- ADD THIS (optional)
  postedAt: any;
  reporterId: string;
  reporterName: string;
  foundBy?: string;
  resolvedAt?: any;
  thankYouMessage?: string; // <-- ADD THIS (optional)
}

export interface Activity {
  title: string;
  subtitle: string;
  category: 'lost-found' | 'marketplace' | 'notes-hub';
}

// For the Lost & Found page


// For the Borrow & Lend (Marketplace) page
export interface MarketplaceItem {
  name: string;
  borrowCost: string;
  sellPrice: string | null;
  postedBy: string;
}

// For the Notes Hub page
export interface Note {
  courseCode: string;
  courseName: string;
  semester: number;
  topic: string;
  uploader: string;
  category: 'Notes' | 'PYQ';
  format: 'Online' | 'In-Person' | 'PYQ';
  price: string;
}