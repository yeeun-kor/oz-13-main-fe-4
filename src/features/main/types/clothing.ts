export interface ClothingItem {
  name: string;
  icon: string; // 이미지 경로
  category: 'outer' | 'top' | 'bottom' | 'shoes' | 'accessory';
}

export interface OutfitRecommendation {
  items: ClothingItem[];
  fullText: string;
}
