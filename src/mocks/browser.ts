import { setupWorker } from 'msw/browser';
import { authHandlers } from './handler/auth';
import { handlers } from './handler/index';
import { diaryHandlers } from './handler/diary';
import { outfitHandlers } from './handler/clothingHandler';

export const worker = setupWorker(
  ...handlers,
  ...outfitHandlers,
  ...authHandlers,
  ...diaryHandlers
);
