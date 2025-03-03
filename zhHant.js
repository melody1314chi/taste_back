export default {
  api: {
    // 🔻models > user.js > cartSchema
    userCartProductRequired: '購物車商品必填',
    userCartQuantityRequired: '購物車數量必填',
    userCartQuantityTooSmall: '購物車數量不符',

    // 🔻models > user.js > Schema
    // ⤷ account:
    userAccountRequired: '使用者帳號必填',
    userAccountTooShort: '使用者帳號太短',
    userAccountTooLong: '使用者帳號太長',
    userAccountInvalid: '使用者帳號格式不符',
    // ⤷ password:
    userPasswordRequired: '使用者密碼必填',
    // ⤷ email:
    userEmailRequired: '使用者信箱必填',
    userEmailInvalid: '使用者信箱格式不符',
    // ⤷ schema.pre()
    userPasswordTooShort: '使用者密碼太短',
    userPasswordTooLong: '使用者密碼太長',

    // 🔻passport.js
    userNotFound: '查無使用者', // *2
    userPasswordIncorrect: '使用者密碼錯誤',

    // 🔹 passport.js
    // 🔹 auth.js
    userTokenInvalid: '使用者驗證錯誤',

    // 🔻product.js
    productNameRequired: '商品名稱必填',
    productPriceRequired: '商品價格必填',
    productPriceTooSmall: '商品價格不符',
    productImageRequired: '商品圖片必填',
    productDescriptionequired: '商品說明必填',
    productCategoryRequired: '商品分類必填',
    productCategoryInvalid: '商品分類不符',
    productSellRequired: '商品上下架必填',
    product: {
      food: '料理',
      drink: '飲品',
      game: '遊戲',
      music: '音樂',
    },

    // 🔻controllers > user.js
    userAccountDuplicate: '使用者帳號重複',

    // 🔹 passport.js *2
    // 🔹 controllers > user.js*2
    // 🔹 auth.js
    serverError: '伺服器錯誤',

    // 🔹 index.js
    // 🔹 auth.js
    requestFormatError: '請求格式錯誤',
  },
}
