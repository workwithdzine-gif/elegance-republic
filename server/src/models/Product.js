import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    gender: {
      type: String,
      enum: ['Men', 'Women', 'Unisex', 'Kids'],
      required: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    comparePrice: {
      type: Number,
      default: null,
    },
    images: {
      type: [String],
      default: [],
    },
    colors: {
      type: [String],
      default: [],
    },
    sizes: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    collectionName: {
      type: String,
      default: '',
    },
    season: {
      type: String,
      default: '',
    },
    stockQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    badge: {
      type: String,
      default: '',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
)

productSchema.virtual('inStock').get(function () {
  return this.stockQuantity > 0
})
productSchema.set('toJSON', { virtuals: true })
productSchema.set('toObject', { virtuals: true })


productSchema.index({ category: 1 })
productSchema.index({ gender: 1 })
productSchema.index({ title: 'text', description: 'text', tags: 'text' })

const Product = mongoose.model('Product', productSchema)

export default Product