import { Router } from 'express'
import * as recipe from '../controllers/recipe.js'
import upload from '../middlewares/upload.js'

const router = Router()

// 食譜新增
router.post('/', upload, recipe.create)
// 大家都看的到 (沒有登入的人看的)
// router.get('/', recipe.get)
// 取得所有食譜 (包含未發布的)
router.get('/all', recipe.getAll)
// 單個食譜，沒有登入也可以看
router.get('/:id', recipe.getId)
// 編輯食譜
router.patch('/:id', upload, recipe.edit)

export default router
