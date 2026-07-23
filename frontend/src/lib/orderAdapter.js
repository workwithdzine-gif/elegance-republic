const STATUS_LABELS = {
  pending: 'Pending', processing: 'Processing', shipped: 'Shipped',
  delivered: 'Delivered', cancelled: 'Cancelled',
}

export function adaptOrder(order) {
  if (!order) return null
  return {
    id: order.orderNumber,
    _id: order._id,
    createdAt: order.createdAt,
    status: STATUS_LABELS[order.orderStatus] || order.orderStatus,
    items: order.items,
    shippingAddress: {
      name: order.shippingAddress?.fullName,
      phone: order.shippingAddress?.phone,
      line1: order.shippingAddress?.street,
      city: order.shippingAddress?.city,
      province: order.shippingAddress?.state,
      postalCode: order.shippingAddress?.postalCode,
    },
    paymentMethod: (order.paymentMethod || 'COD').toLowerCase(),
    subtotal: order.itemsPrice,
    shipping: order.shippingPrice,
    total: order.totalPrice,
  }
}
