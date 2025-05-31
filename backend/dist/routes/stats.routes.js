import express from 'express';
import { archiveStats, getPreviousStat, saveStat } from '../controllers/stats.controller.js';
const statRouter = express.Router();
statRouter.get("/:statName", getPreviousStat);
statRouter.post("/:statName", saveStat);
statRouter.post('/archive', archiveStats);
export default statRouter;
