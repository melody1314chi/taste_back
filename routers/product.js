import { Router } from 'express'
import * as product from '../controllers/product.js'
import * as auth from '../middlewares/auth.js'
import upload from '../middlewares/upload.js'

const router = Router()

// 1. auth.jwt   = 代表有登入才能新增商品
// 2. auth.admin = 同時需要是管理員 (middlewares > auth.js => import UserRole => 底部加入內容)
// 3. upload     = 上傳
// 4. product.create = 商品新增 (controllers > product.js)
router.post('/', auth.jwt, auth.admin, upload, product.create)
// 大家都看的到 (沒有登入的人看的)
router.get('/', product.get)
// 給管理員看的 (包含未上架)
router.get('/all', auth.jwt, auth.admin, product.getAll)
// 單個商品，沒有登入也可以看
router.get('/:id', product.getId)
// 編輯商品
router.patch('/:id', auth.jwt, auth.admin, upload, product.edit)

export default router
