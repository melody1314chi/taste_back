import { Router } from 'express'
import * as order from '../controllers/order.js'
import * as auth from '../middlewares/auth.js'

const router = Router()

// 新增訂單、結帳
router.post('/', auth.jwt, order.create)
// 取自己的訂單
router.get('/', auth.jwt, order.get)
// 管理員身分去取所有的訂單
router.get('/all', auth.jwt, auth.admin, order.getAll)

export default router
