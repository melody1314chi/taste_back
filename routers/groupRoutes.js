import exoress from 'express'
import Group from '../models/group.js'

const router = exoress.Router()

// 獲取使用者的群組
router.get('/api/user/groups', async (req, res) => {
  try {
    const userId = req.user.id // 假設使用者 ID 從認證中獲取
    const groups = await Group.find({ createdBy: userId })
    res.json(groups)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
