import Order from '../models/order.js'
import User from '../models/user.js'
import { StatusCodes } from 'http-status-codes'

export const create = async (req, res) => {
  try {
    // 檢查購物車有沒有東西
    if (req.user.cart.length === 0) throw new Error('EMPTY')
    // 檢查商品有沒有上架
    const user = await User.findById(req.user._id, 'cart').populate('cart.product')
    if (!user.cart.every((item) => item.product.sell)) throw new Error('SELL')
    // 建立訂單
    await Order.create({
      user: req.user._id,
      cart: req.user.cart,
    })
    // 清空購物車
    req.user.cart = []
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
    })
  } catch (error) {
    console.log(error)
    if (error.message === 'EMPTY') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        // 訂單購物車為空
        message: 'orderCartEmpty',
      })
    } else if (error.message === 'SELL') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        // 訂單商品未販售
        message: 'orderProductNotSell',
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

export const get = async (req, res) => {
  try {
    const result = await Order.find({ user: req.user._id }).populate('cart.product')
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result,
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      // 伺服器錯誤
      message: 'serverError',
    })
  }
}
export const getAll = async (req, res) => {
  try {
    // 取所有使用者的資料
    const result = await Order.find().populate('user', 'account').populate('cart.product')
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result,
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      // 伺服器錯誤
      message: 'serverError',
    })
  }
}
