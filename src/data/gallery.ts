export interface GalleryCategory {
  id: string;
  label: string;
  labelEn: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  title: string;
  titleEn: string;
  /** `GalleryCategory.id`; drives the page filter. */
  category: string;
  /** Intrinsic pixel size; reserves layout space before the image loads. */
  width: number;
  height: number;
}

export const galleryCategories: GalleryCategory[] = [
  { id: "architecture", label: "建筑", labelEn: "ARCHITECTURE" },
  { id: "redstone", label: "红石", labelEn: "REDSTONE" },
];

/**
 * 画廊作品 — images live in `public/`. Append entries to add frames; the page
 * layout, numbering, filters, and counts derive from these lists.
 */
export const galleryItems: GalleryItem[] = [
  {
    id: "gothic-hall",
    src: "/hero.webp",
    title: "哥特殿堂",
    titleEn: "GOTHIC HALL",
    category: "architecture",
    width: 1920,
    height: 1080,
  },
  {
    id: "floating-city",
    src: "/floatingcity.webp",
    title: "浮空城",
    titleEn: "FLOATING CITY",
    category: "architecture",
    width: 1920,
    height: 1080,
  },
  {
    id: "ftl-pearl-cannon",
    src: "/ftl-ender-pearl.webp",
    title: "FTL 珍珠炮",
    titleEn: "FTL PEARL CANNON",
    category: "redstone",
    width: 1920,
    height: 981,
  },
];
