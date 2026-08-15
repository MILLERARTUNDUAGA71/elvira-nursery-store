import { createContext, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([]) // { productId, name, size, price, qty, photoURL }

  function addItem(product, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id)
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, qty: i.qty + qty } : i
        )
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          size: product.size,
          price: product.price,
          photoURL: product.photoURL || '',
          qty,
        },
      ]
    })
  }

  function updateQty(productId, qty) {
    if (qty <= 0) {
      removeItem(productId)
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, qty } : i))
    )
  }

  function removeItem(productId) {
    setItems((prev) => prev.filter((i) => i.productId !== productId))
  }

  function clearCart() {
    setItems([])
  }

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items]
  )
  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items])

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQty, removeItem, clearCart, total, count }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}
