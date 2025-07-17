import express from 'express';
import { submitResponse } from '../controllers/responseController';

const router = express.Router();

router.post('/', submitResponse); // Public

export default router;
