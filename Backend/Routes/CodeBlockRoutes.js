import express from 'express';
import CodeBlockController from '../Controller/CodeBlockController.js';

const router = express.Router();

router.post('/', CodeBlockController.createCodeBlock);

router.get('/code/:index', CodeBlockController.getCodeBlock);

export default router;
