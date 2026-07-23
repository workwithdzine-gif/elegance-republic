// Tree-walking helpers that mirror what frontend/src/data/categories.js used to
// provide, but operate on the live tree returned by useCategories() instead of
// a static import.

export function findDepartment(tree, slug) {
  return tree.find((c) => c.slug === slug) || tree[0] || null
}

export function findCategoryBySlug(tree, slug, nodes = tree) {
  for (const node of nodes) {
    if (node.slug === slug) return node
    if (node.children?.length) {
      const found = findCategoryBySlug(tree, slug, node.children)
      if (found) return found
    }
  }
  return null
}

export function getDescendantSlugs(tree, slug) {
  const node = findCategoryBySlug(tree, slug)
  if (!node) return []
  const slugs = []
  const walk = (n) => {
    slugs.push(n.slug)
    n.children?.forEach(walk)
  }
  walk(node)
  return slugs
}
