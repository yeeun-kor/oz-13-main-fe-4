import HappyIcon from '../../../assets/happy.svg';
import SadIcon from '../../../assets/sad.svg';
import ExcitedIcon from '../../../assets/excited.svg';
import AngryIcon from '../../../assets/bad.svg';

interface Emotion {
  name: string;
  icon: string;
}

export const EMOTIONS: Emotion[] = [
  { name: 'happy', icon: HappyIcon },
  { name: 'sad', icon: SadIcon },
  { name: 'angry', icon: AngryIcon },
  { name: 'excited', icon: ExcitedIcon },
];
