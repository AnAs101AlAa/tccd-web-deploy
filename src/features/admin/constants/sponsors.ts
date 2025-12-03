// Sponsors will be fetched from backend
// This is a placeholder structure showing what the backend should return

export interface Sponsor {
  id: string;
  companyName: string;
  banner: string; // URL to banner image
}

// Mock data - replace with actual backend fetch
export const AVAILABLE_SPONSORS: Sponsor[] = [
  {
    id: "sp-1",
    companyName: "TechCorp Solutions",
    banner:
      "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400",
  },
  {
    id: "sp-2",
    companyName: "Innovation Labs",
    banner: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400",
  },
  {
    id: "sp-3",
    companyName: "Digital Ventures",
    banner: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400",
  },
  {
    id: "sp-4",
    companyName: "Future Systems",
    banner: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400",
  },
  {
    id: "sp-5",
    companyName: "Smart Tech Inc",
    banner: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400",
  },
];

// Helper to get sponsor by ID
export const getSponsorById = (id: string): Sponsor | undefined => {
  return AVAILABLE_SPONSORS.find((sponsor) => sponsor.id === id);
};

// Helper to get multiple sponsors by IDs
export const getSponsorsByIds = (ids: string[]): Sponsor[] => {
  return ids
    .map((id) => getSponsorById(id))
    .filter((sponsor): sponsor is Sponsor => sponsor !== undefined);
};
