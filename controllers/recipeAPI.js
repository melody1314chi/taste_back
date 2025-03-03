import { StatusCodes } from 'http-status-codes'
import axios from 'axios'
// import validator from 'validator'

// 大家都看的到的商品頁 (沒有登入的人看的)
export const getpasta = async (req, res) => {
  try {
    const apiKey = process.env.SPOONACULAR_API_KEY
    let result = await axios.get(
      `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=pasta`,
    )
    result = result.data.results
    console.log('後端取pasta食譜:', result)
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result,
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'serverError',
    })
  }
}

export const getpastadetail = async (req, res) => {
  const id = req.params.id
  const apiKey = process.env.SPOONACULAR_API_KEY
  let result = await axios.get(
    ` https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}&query=pasta`,
  )
}

export const getrice = async (req, res) => {
  try {
    const apiKey = process.env.SPOONACULAR_API_KEY
    let result = await axios.get(
      `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=rice`,
    )
    result = result.data.results
    console.log('後端取pasta食譜:', result)
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result,
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'serverError',
    })
  }
}
