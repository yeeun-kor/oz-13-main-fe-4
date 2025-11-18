import { setupWorker } from 'msw/browser';
import { authHandlers } from './handler/auth';
import { outfitHandlers } from './handler/clothingHandler';
import { diaryHandlers } from './handler/diary';
import { handlers } from './handler/index';
import { locationHandlers } from './handler/locationHandlers';
import { favoriteHandlers } from './handler/favorite';

export const worker = setupWorker(
  ...handlers,
  ...outfitHandlers,
  ...authHandlers,
  ...diaryHandlers,
  ...locationHandlers
  ...favoriteHandlers
);
