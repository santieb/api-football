import { Router } from "express";
import controllers from './controllers.js'
const router = Router()

router
  .get('/', controllers.getFootballMatches)

export default router