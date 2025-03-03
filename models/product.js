import { Schema, model } from 'mongoose'

const schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'productNameRequired'],
    },
    price: {
      type: Number,
      required: [true, 'productPriceRequired'],
      min: [0, 'productPriceTooSmall'],
    },
    image: {
      type: String,
      required: [true, 'productImageRequired'],
    },
    description: {
      type: String,
      required: [true, 'productDescriptionRequired'],
    },
    category: {
      type: String,
      required: [true, 'productCategoryRequired'],
      enum: {
        values: [
          'breakfast',
          'lunch',
          'dinner',
          'dessert',
          'snack',
          'soup',
          'drink',
          'vegetarian',
          'vegan',
          'holidayRecipes',
        ],
        message: 'productCategoryInvalid',
      },
    },
    sell: {
      type: Boolean,
      required: [true, 'productSellRequired'],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

export default model('products', schema)
