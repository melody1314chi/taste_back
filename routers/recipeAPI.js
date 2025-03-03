import * as recipeAPI from '../controllers/recipeAPI.js'
import { Router } from 'express'

const router = Router()

// 大家都看的到 (沒有登入的人看的)

router.get('/getPasta', recipeAPI.getpasta)
router.get('/getPastaDetail/:id', recipeAPI.getpastadetail)
router.get('/getRice', recipeAPI.getrice)

export default router
