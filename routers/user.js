import { Router } from 'express'
// 記得自己是使用 CUser，下面 router.post() 也要指向 CUser
// 確保 `CUser` 的路徑正確
import * as CUser from '../controllers/user.js'
import * as auth from '../middlewares/auth.js'

const router = Router()

// 使用者相關 API
router.post('/', CUser.create)
// auth.login => auth.js 裡 login 的 function
router.post('/login', auth.login, CUser.login)
router.get('/profile', auth.jwt, CUser.profile)
router.patch('/refresh', auth.jwt, CUser.refresh)
router.delete('/logout', auth.jwt, CUser.logout)

// 購物車 API
router.get('/cart', auth.jwt, CUser.getCart) // 取購物車
router.patch('/cart', auth.jwt, CUser.updateCart) // 把東西放回購物車

// 使用者新增食譜
router.post('/recipe', auth.jwt, CUser.createRecipe)
// 收藏功能 API
router.post('/favorite/:id', auth.jwt, CUser.favorite) // 收藏食譜至我的最愛
router.get('/favorite', auth.jwt, CUser.getFavorite) // 取得我的最愛
router.delete('/favorite/:id', auth.jwt, CUser.deleteFavorite) // 刪除我的最愛

export default router
