/* oxlint-disable react/only-export-components -- Provider and its colocated consumer hook form one store API. */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authAPI } from '../lib/authApi'
import { cartAPI, ordersAPI, wishlistAPI } from '../lib/shopApi'
import { adaptCart } from '../lib/adapters'
import { adaptOrder } from '../lib/orderAdapter'

const StoreContext = createContext(null)

function readLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return parsed?.state ?? parsed
  } catch {
    return fallback
  }
}

function usePersistentState(key, fallback) {
  const [value, setValue] = useState(() => readLocal(key, fallback))
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* storage can be unavailable */ }
  }, [key, value])
  return [value, setValue]
}

export function StoreProvider({ children }) {
  // Guests use these as plain local state (unauthenticated cart/wishlist).
  // Once a user is logged in, these become mirrors of the backend — every
  // mutation calls the API first, then updates local state from the response.
  const [cart, setCart] = usePersistentState('elegance-republic-cart', [])
  const [wishlist, setWishlist] = usePersistentState('elegance-republic-wishlist', [])
  const [orders, setOrders] = usePersistentState('elegance-republic-orders', [])
  const [user, setUser] = usePersistentState('elegance-republic-user', null)
  const [addresses, setAddresses] = usePersistentState('elegance-republic-addresses', [])
  const [gender, setGender] = usePersistentState('elegance-republic-gender', 'men')
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState(null)

  const notify = useCallback((message) => {
    setToast(message)
    window.clearTimeout(window.__erToastTimer)
    window.__erToastTimer = window.setTimeout(() => setToast(null), 2600)
  }, [])

  // Pulls the logged-in user's cart, wishlist, and order history from the
  // backend and replaces whatever was in local state (called after login and
  // after session restore on page load).
  const syncFromBackend = useCallback(async () => {
    try {
      const [backendCart, backendWishlist, backendOrders] = await Promise.all([
        cartAPI.get(), wishlistAPI.get(), ordersAPI.myOrders(),
      ])
      setCart(adaptCart(backendCart))
      setWishlist((backendWishlist.products || []).map((p) => p._id))
      setOrders(backendOrders.map(adaptOrder))
    } catch {
      // non-fatal — leave whatever local state already had
    }
  }, [setCart, setWishlist, setOrders])

  const addToCart = useCallback(async (product, quantity = 1, selectedSize) => {
    const size = selectedSize || product.sizes?.[0] || 'Default'
    if (user) {
      try {
        const backendCart = await cartAPI.add({ productId: product.id, quantity, size, color: product.color })
        setCart(adaptCart(backendCart))
      } catch (err) {
        notify(err.message || 'Could not add to cart')
        return
      }
    } else {
      const cartKey = `${product.id}-${size}`
      setCart((current) => {
        const exists = current.find((item) => item.cartKey === cartKey)
        if (exists) return current.map((item) => item.cartKey === cartKey ? { ...item, quantity: item.quantity + quantity } : item)
        return [...current, { ...product, cartKey, selectedSize: size, quantity }]
      })
    }
    notify(`${product.title} added to cart`)
  }, [user, notify, setCart])

  const updateQuantity = useCallback(async (cartKey, quantity) => {
    const safeQuantity = Math.max(1, quantity)
    if (user) {
      try {
        const backendCart = await cartAPI.updateQuantity(cartKey, safeQuantity)
        setCart(adaptCart(backendCart))
      } catch (err) {
        notify(err.message || 'Could not update quantity')
      }
    } else {
      setCart((current) => current.map((item) => item.cartKey === cartKey ? { ...item, quantity: safeQuantity } : item))
    }
  }, [user, notify, setCart])

  const removeFromCart = useCallback(async (cartKey) => {
    if (user) {
      try {
        const backendCart = await cartAPI.remove(cartKey)
        setCart(adaptCart(backendCart))
      } catch (err) {
        notify(err.message || 'Could not remove item')
      }
    } else {
      setCart((current) => current.filter((item) => item.cartKey !== cartKey))
    }
  }, [user, notify, setCart])

  const clearCart = useCallback(async () => {
    if (user) {
      try { await cartAPI.clear() } catch { /* ignore — we clear local state regardless */ }
    }
    setCart([])
  }, [user, setCart])

  const toggleWishlist = useCallback(async (productId) => {
    if (user) {
      const saved = wishlist.includes(productId)
      try {
        const backendWishlist = saved ? await wishlistAPI.remove(productId) : await wishlistAPI.add(productId)
        setWishlist((backendWishlist.products || []).map((p) => p._id))
      } catch (err) {
        notify(err.message || 'Could not update wishlist')
      }
    } else {
      setWishlist((current) => current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId])
    }
  }, [user, wishlist, notify, setWishlist])

  const [authLoading, setAuthLoading] = useState(true)

  // On first load, if a token is saved from a previous session, verify it
  // with the backend and restore the user — otherwise the user is logged out.
  useEffect(() => {
    authAPI.me()
      .then(async (me) => { setUser(me); await syncFromBackend() })
      .catch(() => setUser(null))
      .finally(() => setAuthLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // If the person added things as a guest before logging in, push those
  // into their backend cart/wishlist first so login doesn't wipe them out.
  const mergeGuestDataThenSync = useCallback(async () => {
    const guestCartItems = cart.filter((item) => !item.cartKey?.match(/^[0-9a-f]{24}$/i)) // backend ids are 24-char hex; guest keys aren't
    const guestWishlistIds = wishlist

    for (const item of guestCartItems) {
      try { await cartAPI.add({ productId: item.id, quantity: item.quantity, size: item.selectedSize, color: item.color }) } catch { /* skip items that fail (e.g. out of stock) */ }
    }
    for (const productId of guestWishlistIds) {
      try { await wishlistAPI.add(productId) } catch { /* ignore duplicates/errors */ }
    }

    await syncFromBackend()
  }, [cart, wishlist, syncFromBackend])

  const signUp = useCallback(async ({ name, email, password }) => {
    const me = await authAPI.register({ name, email, password })
    setUser(me)
    await mergeGuestDataThenSync()
    notify(`Welcome, ${me.name}`)
    return me
  }, [notify, setUser, mergeGuestDataThenSync])

  const signIn = useCallback(async ({ email, password }) => {
    const me = await authAPI.login({ email, password })
    setUser(me)
    await mergeGuestDataThenSync()
    notify(`Welcome back, ${me.name}`)
    return me
  }, [notify, setUser, mergeGuestDataThenSync])

  const signOut = useCallback(async () => {
    await authAPI.logout()
    setUser(null)
    setCart([])
    setWishlist([])
    setOrders([])
    notify('You have signed out')
  }, [notify, setUser, setCart, setWishlist, setOrders])

  const saveAddress = useCallback((address) => {
    const next = { ...address, id: address.id || `addr-${Date.now()}` }
    setAddresses((current) => {
      const without = current.filter((item) => item.id !== next.id)
      return [...without, next]
    })
    return next
  }, [setAddresses])

  // Builds the order server-side from the user's backend cart (Checkout.jsx
  // passes the shipping address; the cart itself is already synced).
  const placeOrder = useCallback(async ({ shippingAddress, notes }) => {
    const order = await ordersAPI.create({ shippingAddress, notes })
    const adapted = adaptOrder(order)
    setOrders((current) => [adapted, ...current])
    setCart([])
    if (shippingAddress) {
      saveAddress({
        name: shippingAddress.fullName, phone: shippingAddress.phone, line1: shippingAddress.street,
        city: shippingAddress.city, province: shippingAddress.state, postalCode: shippingAddress.postalCode,
      })
    }
    notify(`Order ${adapted.id} confirmed`)
    return adapted
  }, [notify, saveAddress, setCart, setOrders])

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart])
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart])

  const value = useMemo(() => ({
    cart, wishlist, orders, user, addresses, gender, cartOpen, toast, cartCount, subtotal, authLoading,
    setGender, setCartOpen, addToCart, updateQuantity, removeFromCart, clearCart,
    toggleWishlist, signIn, signUp, signOut, saveAddress, placeOrder, notify,
  }), [
    cart, wishlist, orders, user, addresses, gender, cartOpen, toast, cartCount, subtotal, authLoading,
    setGender, addToCart, updateQuantity, removeFromCart, clearCart, toggleWishlist,
    signIn, signUp, signOut, saveAddress, placeOrder, notify,
  ])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const value = useContext(StoreContext)
  if (!value) throw new Error('useStore must be used within StoreProvider')
  return value
}
