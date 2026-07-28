import { Router } from 'express';
import { createResume, getResume, saveDraft } from '../controllers/resumeController.js';

const router = Router();
router.post('/draft', saveDraft);
router.post('/', createResume);
router.get('/:id', getResume);
export default router;
