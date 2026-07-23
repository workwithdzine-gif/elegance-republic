import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  title: { type: String, required: true }, // snapshot — survives product edits/deletion
  image: { type: String, default: '' },
  price: { type: Number, required: true }, // price at time of order
  quantity: { type: Number, required: true, min: 1 },
  size: { type: String, default: null },
  color: { type: String, default: null },
})

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, default: '' },
    postalCode: { type: String, default: '' },
    country: { type: String, default: 'Pakistan' },
  },
  { _id: false }
)

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['COD'], // more added in Step 8 (Stripe/JazzCash etc.)
      default: 'COD',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    deliveredAt: Date,
    cancelledAt: Date,
    notes: { type: String, default: '' },
    trackingNumber: { type: String, default: '' },
    carrier: { type: String, default: '' },
    adminNotes: { type: String, default: '' }, // internal-only, never shown to the customer
  },
  { timestamps: true }
)

orderSchema.index({ user: 1 })
orderSchema.index({ orderNumber: 1 })
orderSchema.index({ orderStatus: 1 })

const Order = mongoose.model('Order', orderSchema)

export default Order
