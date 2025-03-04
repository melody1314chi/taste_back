import { Schema, model } from 'mongoose'

const schema = new Schema({
  title: {
    type: String,
    required: [true, 'recipeNameRequired'],
  },
  image: {
    type: String,
    required: [true, 'recipeImageRequired'],
  },
  description: {
    type: String,
    required: [true, 'recipeDescriptionRequired'],
  },
  totalTime: {
    type: Number,
    required: [true, 'recipeTotalTimeRequired'],
    min: [1, 'recipeTotalTimeTooSmall'],
  },
  servings: {
    type: Number,
    required: [true, 'recipeServingRequired'],
    min: [1, 'recipeServingTooSmall'],
  },
  ingredients: {
    type: Array,
    required: [true, 'recipeIngredientsRequired'],
  },
  steps: {
    type: Array,
    required: [true, 'recipeStepsRequired'],
  },
  tips: {
    type: String,
  },
  publish: {
    type: Boolean,
    required: [true, 'recipePublishRequired'],
  },
})

export default model('recipes', schema)
