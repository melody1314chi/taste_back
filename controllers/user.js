import User from '../models/user.js'
import Product from '../models/product.js'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import validator from 'validator'
import recipe from '../models/recipe.js'

export const create = async (req, res) => {
  try {
    await User.create(req.body)
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
    })
  } catch (error) {
    console.log(error)
    if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: 'userAccountDuplicate',
      })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: error.errors[key].message,
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'serverError',
      })
    }
  }
}

export const login = async (req, res) => {
  console.log(1111)
  try {
    // jwt.sign(儲存資料, SECRET, 設定)
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    console.log(2222)
    req.user.tokens.push(token)
    await req.user.save()
    console.log(3333)
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        token,
        account: req.user.account,
        role: req.user.role,
        cart: req.user.cartQuantity,
      },
    })
  } catch (error) {
    console.log(4444)

    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'serverError',
    })
  }
}

export const profile = async (req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: '',
    result: {
      account: req.user.account,
      role: req.user.role,
      cart: req.user.cartQuantity,
    },
  })
}

export const refresh = async (req, res) => {
  try {
    const idx = req.user.tokens.findIndex((token) => token === req.token)
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    req.user.tokens[idx] = token
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: token,
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'serverError',
    })
  }
}

export const logout = async (req, res) => {
  try {
    const idx = req.user.tokens.findIndex((token) => token === req.token)
    req.user.tokens.splice(idx, 1)
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'serverError',
    })
  }
}

// 取購物車 (getCart 函式)
// 1. 從資料庫中查詢指定用戶的購物車資訊
// 2. 使用 .populate() 方法填充購物車中的產品詳細資訊（關聯查詢）
// 3. 將結果以 JSON 格式回應給前端
export const getCart = async (req, res) => {
  try {
    // .populate() 進行關聯查詢，可以輕鬆地將關聯的資料一起拉出
    const result = await User.findById(req.user._id, 'cart').populate('cart.product')
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: result.cart,
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'serverError',
    })
  }
}

// 把東西放回購物車
export const updateCart = async (req, res) => {
  try {
    // 檢查傳入的商品 ID 格式
    if (!validator.isMongoId(req.body.product)) throw new Error('ID')
    // 檢查購物車內有沒有商品
    const idx = req.user.cart.findIndex((item) => item.product.toString() === req.body.product)
    if (idx > -1) {
      // 有商品，修改數量
      const quantity = req.user.cart[idx].quantity + parseInt(req.body.quantity)
      // 修改後大於 0，修改數量
      if (quantity > 0) {
        req.user.cart[idx].quantity = quantity
      } else {
        // 修改後小於等於 0，刪除商品
        req.user.cart.splice(idx, 1)
      }
    } else {
      // 沒有商品，檢查商品是否存在
      const product = await Product.findById(req.body.product).orFail(new Error('NOT FOUND'))
      // 商品沒有上架，錯誤
      if (!product.sell) throw new Error('SELL')

      req.user.cart.push({ product: req.body.product, quantity: req.body.quantity })
    }

    await req.user.save()

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: req.user.cartQuantity,
    })
  } catch (error) {
    console.log(error)
    if (error.name === 'CastError' || error.message === 'ID') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        // 商品 ID 錯誤
        message: 'productIdInvalid',
      })
    } else if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        // 查無商品
        message: 'productNotFound',
      })
    } else if (error.message === 'SELL') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        // 商品未上架
        message: 'productNotOnSell',
      })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: error.errors[key].message,
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        // 伺服器錯誤
        message: 'serverError',
      })
    }
  }
}
export const favorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'userNotFound',
      })
    }

    const recipeId = req.params.id
    if (user.favorites.includes(recipeId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'alreadyInFavorites',
      })
    }

    user.favorites.push(recipeId)
    await user.save()

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'addedToFavorites',
      favorites: user.favorites,
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'serverError',
    })
  }
}

export const getFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites')
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'userNotFound',
      })
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      favorites: user.favorites,
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'serverError',
    })
  }
}

export const deleteFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'userNotFound',
      })
    }

    const recipeId = req.params.id
    user.favorites = user.favorites.filter((id) => id.toString() !== recipeId)
    await user.save()

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'removedFromFavorites',
      favorites: user.favorites,
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'serverError',
    })
  }
}

export const createRecipe = async (req, res) => {
  try {
    const newRecipe = await recipe.create({
      ...req.body,
      user: req.user._id,
    })
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: newRecipe,
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'serverError',
    })
  }
}
