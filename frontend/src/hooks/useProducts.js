import { useEffect, useState } from 'react'
import { productsAPI } from '../lib/catalogApi'
import { adaptProduct } from '../lib/adapters'

// Module-level cache so every page that calls useProducts() during a session
// shares one fetch instead of re-hitting the API on every navigation.
let cache = null
let inflight = null

async function loadAll() {
  if (cache) return cache
  if (inflight) return inflight

  inflight = productsAPI
    .list({ limit: 100 }) // catalog is small for now — raise this once it grows
    .then((data) => {
      cache = (data.products || []).map(adaptProduct)
      inflight = null
      return cache
    })
    .catch((err) => {
      inflight = null
      throw err
    })

  return inflight
}

export function useProducts() {
  const [products, setProducts] = useState(cache || [])
  const [loading, setLoading] = useState(!cache)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (cache) return
    let cancelled = false
    loadAll()
      .then((list) => { if (!cancelled) setProducts(list) })
      .catch((err) => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  return { products, loading, error }
}

// Call after an admin create/update/delete so the next page load refetches
export function invalidateProductsCache() {
  cache = null
}
