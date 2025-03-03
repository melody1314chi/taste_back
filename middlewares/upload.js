import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { StatusCodes } from 'http-status-codes'

// 設定 cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const upload = multer({
  storage: new CloudinaryStorage({ cloudinary }),
  fileFilter(req, file, callback) {
    console.log(file)
    // 過濾上傳的檔案 (只允許 jpeg、png)
    // file = 檔案資訊
    // callback(錯誤, 是否允許)
    if (['image/jpeg', 'image/png'].includes(file.mimetype)) {
      callback(null, true)
    } else {
      callback(null, false)
    }
  },
  // 檔案限制
  limits: {
    // 限制檔案尺寸 1MB
    fileSize: 1024 * 1024,
  },
})

export default (req, res, next) => {
  // function 執行：upload.single('image')()
  // function 傳入的資料，error錯誤的話再處理：(req, res, (error) => {})
  upload.single('image')(req, res, (error) => {
    if (error) {
      console.log(error)
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'uploadFailed',
      })
    } else {
      next()
    }
  })
}
