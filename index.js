import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import { StatusCodes } from 'http-status-codes'
import routerUser from './routers/user.js'
import routerProduct from './routers/product.js'
import routerOrder from './routers/order.js'
import routerRecipeAPI from './routers/recipeAPI.js'
import cors from 'cors'
import './passport.js'
import passport from 'passport'
import axios from 'axios'

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log('資料庫連線成功')
    // 啟用'查詢過濾器的消毒功能'
    // 若傳入的查詢條件可能包含一些特別的操作符，例如 $gt(大於)、$lt(小於) 等
    // 惡意用戶可能利用這些操作符進行 NoSQL 注入攻擊，實現未授權的數據訪問或操作
    mongoose.set('sanitizeFilter', true)
  })
  .catch((error) => {
    console.log('資料庫連線失敗')
    console.log(error)
  })

const app = express()
const API_KEY = process.env.SPOONACULAR_API_KEY

// 建立一個代理端點，轉發請求到 Spoonacular API
// 像是 插座 -> 等待插頭連結(前端)

// app.get('/api/recipes', async (req, res) => {
//   try {
//     // 這裡以複雜搜尋為例，可依需求調整參數
//     const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
//       params: {
//         apiKey: API_KEY,
//         number: 5, // 範例：取得 5 道食譜
//       },
//     })
//     res.json(response.data)
//   } catch (error) {
//     console.error('Spoonacular API 請求錯誤:', error.message)
//     res.status(500).json({ error: '無法取得食譜資料' })
//   }
// })

// 讀取 .env 檔案內的 USE_API 變數，決定是否要真的呼叫 Spoonacular API
// - `.env` 裡設定 `USE_API= true`  👉 真的呼叫 API
// - `.env` 裡設定 `USE_API= false` 👉 改用假資料
// ⚠️ 修改 `.env` 後需重新啟動伺服器才會生效
const USE_API = process.env.USE_API === 'true'
console.log('USE_API:', USE_API) // 檢查是否正確讀取 .env 檔案

// 定義一個函式，直接從 Spoonacular API 取得資料
async function fetchRecipes() {
  // 定義一個函式，取得食譜資料
  if (!USE_API) {
    console.log('API 暫時停用，返回假資料')
    return [
      { id: 1, title: 'Fried Rice', image: 'https://via.placeholder.com/150' },
      { id: 2, title: 'Beef Stew', image: 'https://via.placeholder.com/150' },
      { id: 3, title: 'Caesar Salad', image: 'https://via.placeholder.com/150' },
      { id: 4, title: 'Spaghetti Carbonara', image: 'https://via.placeholder.com/150' },
      { id: 5, title: 'Chicken Curry', image: 'https://via.placeholder.com/150' },
      { id: 6, title: 'Grilled Salmon', image: 'https://via.placeholder.com/150' },
      { id: 7, title: 'Vegetable Stir Fry', image: 'https://via.placeholder.com/150' },
      { id: 8, title: 'Tomato Soup', image: 'https://via.placeholder.com/150' },
      { id: 9, title: 'BBQ Ribs', image: 'https://via.placeholder.com/150' },
      { id: 10, title: 'Pancakes', image: 'https://via.placeholder.com/150' },
      { id: 11, title: 'Tacos', image: 'https://via.placeholder.com/150' },
      { id: 12, title: 'Lasagna', image: 'https://via.placeholder.com/150' },
      { id: 13, title: 'Sushi Rolls', image: 'https://via.placeholder.com/150' },
      { id: 14, title: 'Clam Chowder', image: 'https://via.placeholder.com/150' },
      { id: 15, title: 'French Toast', image: 'https://via.placeholder.com/150' },
      { id: 16, title: 'Stuffed Peppers', image: 'https://via.placeholder.com/150' },
      { id: 17, title: 'Shrimp Scampi', image: 'https://via.placeholder.com/150' },
      { id: 18, title: 'Baked Ziti', image: 'https://via.placeholder.com/150' },
      { id: 19, title: 'Pulled Pork Sandwich', image: 'https://via.placeholder.com/150' },
      { id: 20, title: 'Chocolate Brownies', image: 'https://via.placeholder.com/150' },
    ]
  }
  try {
    const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
      params: {
        apiKey: API_KEY,
        number: 5, // 取得 5 道食譜
      },
    })
    return response.data
  } catch (error) {
    console.error('Spoonacular API 請求錯誤:', error.message)
    return null
  }
}

// 在伺服器啟動時呼叫這個函式
;(async () => {
  const recipesData = await fetchRecipes()
  console.log('取得的食譜資料:', recipesData)
})()

// 使用 cors 來進行跨域請求
// app.use(
//   cors({
//     origin = 請求來源網域
//     callback(錯誤, 是否允許通過)
//     origin(origin, callback) {
//       console.log(origin)
//       if (
//         postman 的 origin 預設是 undefined
//         origin === undefined ||
//         origin.includes('localhost') ||
//         origin.includes('127.0.0.1') ||
//         origin.includes('github.io')
//       ) {
//         callback(null, true)
//       } else {
//         callback(new Error('CORS'), false)
//       }
//     },
//   }),
// )
// 跨域全開 (最簡單的寫法)
app.use(cors())
app.options('*', cors()) // 允許所有的 OPTIONS 請求

// 解析 body
app.use(express.json())
app.use(passport.initialize())

app.use('/recipeAPI', routerRecipeAPI)
app.use('/user', routerUser) //
app.use('/product', routerProduct) //
app.use('/order', routerOrder) //

app.use((error, req, res, next) => {
  res.status(StatusCodes.BAD_REQUEST).json({
    success: false,
    message: 'requestFormatError',
  })
})

app.listen(process.env.PORT || 4000, () => {
  console.log('伺服器啟動')
})
