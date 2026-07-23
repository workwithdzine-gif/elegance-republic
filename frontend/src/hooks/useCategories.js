import { useEffect, useState } from 'react'
import { categoriesAPI } from '../lib/catalogApi'
import { adaptCategory } from '../lib/adapters'

let cache = null
let inflight = null

async function loadTree() {
  if (cache) return cache
  if (inflight) return inflight

  inflight = categoriesAPI
    .list(true) // tree=true — nested Men/Women → Eastern Wear → Shalwar Kameez
    .then((list) => {
      cache = (list || []).map(adaptCategory)
      inflight = null
      return cache
    })
    .catch((err) => {
      inflight = null
      throw err
    })

  return inflight
}

export function useCategories() {
  const [categories, setCategories] = useState(cache || [])
  const [loading, setLoading] = useState(!cache)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (cache) return
    let cancelled = false
    loadTree()
      .then((list) => { if (!cancelled) setCategories(list) })
      .catch((err) => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  return { categories, loading, error }
}

export function invalidateCategoriesCache() {
  cache = null
}
