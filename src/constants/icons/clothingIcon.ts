import bagIcon from '../../assets/icons/bag.webp';
import bootsIcon from '../../assets/icons/boots.webp';
import coatIcon from '../../assets/icons/coat.webp';
import derbyIcon from '../../assets/icons/derby.webp';
import glovesIcon from '../../assets/icons/gloves.webp';
import hoodieIcon from '../../assets/icons/hoodie.webp';
import jeansIcon from '../../assets/icons/jeans.webp';
import joggerPantsIcon from '../../assets/icons/jogger-pants.webp';
import jumperIcon from '../../assets/icons/jumper.webp';
import leggingIcon from '../../assets/icons/legging.webp';
import loafersIcon from '../../assets/icons/loafers.webp';
import longSleevesIcon from '../../assets/icons/long-sleeves.webp';
import paddedCoatIcon from '../../assets/icons/padded-coat.webp';
import rainBootsIcon from '../../assets/icons/rain-boots.webp';
import sandleIcon from '../../assets/icons/sandle.webp';
import scarfIcon from '../../assets/icons/scarf.webp';
import shortPantsIcon from '../../assets/icons/short-pants.webp';
import slackIcon from '../../assets/icons/slack.webp';
import sleevelessIcon from '../../assets/icons/sleeveless.webp';
import sneakersIcon from '../../assets/icons/sneakers.webp';
import sunglassesIcon from '../../assets/icons/sunglasses.webp';
import tshirtIcon from '../../assets/icons/tshirt.webp';
import windbreakerIcon from '../../assets/icons/windbreaker.webp';

export const clothingIconMap: Record<string, string> = {
  // 아우터
  '롱패딩': paddedCoatIcon,
  '숏패딩': paddedCoatIcon,
  '패딩': paddedCoatIcon,
  '패딩 자켓': paddedCoatIcon,
  '다운점퍼': jumperIcon,
  '코트': coatIcon,
  '울 코트': coatIcon,
  '롱 코트': coatIcon,
  '발마칸 코트': coatIcon,
  '파카': paddedCoatIcon,
  '롱 파카': paddedCoatIcon,
  '레더 자켓': jumperIcon,
  '블루종': jumperIcon,
  '아노락 집업': windbreakerIcon,
  '바람막이': windbreakerIcon,
  '통풍형 바람막이': windbreakerIcon,
  '가디건': coatIcon,
  '니트 가디건': coatIcon,
  '크롭 니트 가디건': coatIcon,
  '코듀로이 자켓': jumperIcon,
  '피쉬테일 롱 패딩': paddedCoatIcon,

  // 상의
  '니트': longSleevesIcon,
  '목폴라': longSleevesIcon,
  '목폴라 니트': longSleevesIcon,
  '라운드 니트': longSleevesIcon,
  '맨투맨': longSleevesIcon,
  '후드티': hoodieIcon,
  '후드집업': hoodieIcon,
  '기모 후드티': hoodieIcon,
  '후드': hoodieIcon,
  '반팔티': tshirtIcon,
  '반팔': tshirtIcon,
  '긴팔티': longSleevesIcon,
  '롱 슬리브': longSleevesIcon,
  '민소매': sleevelessIcon,
  '린넨 셔츠': tshirtIcon,
  '히트텍': longSleevesIcon,
  '플리스 집업': hoodieIcon,

  // 하의
  '와이드 슬랙스': slackIcon,
  '슬랙스': slackIcon,
  '울 팬츠': slackIcon,
  '기모 슬랙스': slackIcon,
  '트레이닝 팬츠': joggerPantsIcon,
  '트레이닝팬츠': joggerPantsIcon,
  '기모 트레이닝 팬츠': joggerPantsIcon,
  '조거 팬츠': joggerPantsIcon,
  '카고팬츠': joggerPantsIcon,
  '카고 팬츠': joggerPantsIcon,
  '기모 팬츠': joggerPantsIcon,
  '데님 팬츠': jeansIcon,
  '와이드 데님 팬츠': jeansIcon,
  '세미 와이드 데님 팬츠': jeansIcon,
  '와이드 진': jeansIcon,
  '코튼팬츠': slackIcon,
  '린넨팬츠': slackIcon,
  '린넨 팬츠': slackIcon,
  '레깅스': leggingIcon,
  '반바지': shortPantsIcon,
  '데님 반바지': shortPantsIcon,
  '코듀로이 팬츠': slackIcon,

  // 신발
  '스니커즈': sneakersIcon,
  '운동화': sneakersIcon,
  '부츠': bootsIcon,
  '방한 부츠': bootsIcon,
  '첼시 부츠': bootsIcon,
  '레인부츠': rainBootsIcon,
  '더비 슈즈': derbyIcon,
  '스웨이드 슈즈': loafersIcon,
  '단화': derbyIcon,
  '어그 슈즈': loafersIcon,
  '슬리퍼': sandleIcon,
  '샌들': sandleIcon,

  // 악세서리
  '머플러': scarfIcon,
  '장갑': glovesIcon,
  '선글라스': sunglassesIcon,
  '크로스백': bagIcon,
};

export const defaultIconByCategory = {
  outer: coatIcon,
  top: tshirtIcon,
  bottom: slackIcon,
  shoes: sneakersIcon,
  accessory: bagIcon,
};
