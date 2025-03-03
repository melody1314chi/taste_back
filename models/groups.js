import { Schema, model } from 'mongoose'

const schema = new Schema({
  name: {
    type: String,
    required: [true, 'groupNameRequired'],
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'users', // 假設你的使用者模型名稱為 'users'
    required: [true, 'groupCreatorRequired'],
  },
})

export default model('groups', schema)
