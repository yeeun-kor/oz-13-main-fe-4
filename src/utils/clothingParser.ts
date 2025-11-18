import { clothingIconMap, defaultIconByCategory } from '../constants/icons/clothingIcon';
import { ClothingItem, OutfitRecommendation } from '../pages/main/types/clothing';

const getCategory = (itemName: string): ClothingItem['category'] => {
  const outerKeywords = [
    '패딩',
    '코트',
    '자켓',
    '파카',
    '가디건',
    '점퍼',
    '집업',
    '바람막이',
    '블루종',
  ];
  const topKeywords = ['니트', '티', '셔츠', '맨투맨', '후드', '민소매', '플리스', '히트텍'];
  const bottomKeywords = ['팬츠', '슬랙스', '진', '반바지', '레깅스'];
  const shoesKeywords = ['신발', '스니커즈', '운동화', '부츠', '슈즈', '슬리퍼', '샌들', '단화'];
  const accessoryKeywords = ['머플러', '장갑', '선글라스', '백'];

  if (outerKeywords.some((keyword) => itemName.includes(keyword))) return 'outer';
  if (topKeywords.some((keyword) => itemName.includes(keyword))) return 'top';
  if (bottomKeywords.some((keyword) => itemName.includes(keyword))) return 'bottom';
  if (shoesKeywords.some((keyword) => itemName.includes(keyword))) return 'shoes';
  if (accessoryKeywords.some((keyword) => itemName.includes(keyword))) return 'accessory';

  return 'top';
};

export const parseOutfitString = (outfitString: string): ClothingItem[] => {
  const items = outfitString.split('+').map((item) => item.trim());

  return items.map((itemName) => {
    const category = getCategory(itemName);
    const icon = clothingIconMap[itemName] || defaultIconByCategory[category];

    return {
      name: itemName,
      icon,
      category,
    };
  });
};

export const createOutfitRecommendation = (outfitString: string): OutfitRecommendation => {
  return {
    items: parseOutfitString(outfitString),
    fullText: outfitString,
  };
};
