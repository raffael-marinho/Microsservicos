"use client"

import { useState, useEffect } from "react"
import ProductsScreen from "@/components/products-screen"
import ProductDetailScreen from "@/components/product-detail-screen"
import PaymentScreen from "@/components/payment-screen"
import CartScreen from "@/components/cart-screen"

export type Product = {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: string
  rating: number
  reviews: number
}

export default function EcommerceApp() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [currentScreen, setCurrentScreen] = useState<"products" | "detail" | "payment" | "cart">("products")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [cartItems, setCartItems] = useState<Array<{ product: Product; quantity: number }>>([])
  const [selectedCartItems, setSelectedCartItems] = useState<string[]>([])

  // Buscar produtos da API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3001/products")
        if (!response.ok) {
          throw new Error(`Erro: ${response.status}`)
        }
        const data = await response.json()
        setProducts(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
    setCurrentScreen("detail")
  }

  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }
      return [...prev, { product, quantity }]
    })
  }

  const handleBuyNow = (product: Product) => {
    setSelectedProduct(product)
    setCurrentScreen("payment")
  }

  const handleBackToProducts = () => {
    setCurrentScreen("products")
    setSelectedProduct(null)
  }

  const handleProceedToPayment = () => {
    setCurrentScreen("payment")
  }

  const handleGoToCart = () => {
    setCurrentScreen("cart")
  }

  const handleSelectCartItem = (productId: string) => {
    setSelectedCartItems((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.product.id !== productId))
      setSelectedCartItems((prev) => prev.filter((id) => id !== productId))
    } else {
      setCartItems((prev) => prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item)))
    }
  }

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId))
    setSelectedCartItems((prev) => prev.filter((id) => id !== productId))
  }

  const handleBuySelectedItems = () => {
    setCurrentScreen("payment")
  }

  // Loading ou erro na tela de produtos
  if (loading) return <div>Carregando produtos...</div>
  if (error) return <div>Erro ao carregar produtos: {error}</div>

  return (
    <div className="min-h-screen bg-gray-50">
      {currentScreen === "products" && (
        <ProductsScreen
          products={products}
          onProductSelect={handleProductSelect}
          onGoToCart={handleGoToCart}
          cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        />
      )}

      {currentScreen === "detail" && selectedProduct && (
        <ProductDetailScreen
          product={selectedProduct}
          onBack={handleBackToProducts}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      )}

      {currentScreen === "payment" && (
        <PaymentScreen
          items={
            currentScreen === "payment" && selectedCartItems.length > 0
              ? cartItems.filter((item) => selectedCartItems.includes(item.product.id))
              : selectedProduct
                ? [{ product: selectedProduct, quantity: 1 }]
                : []
          }
          onBack={() => (selectedCartItems.length > 0 ? setCurrentScreen("cart") : setCurrentScreen("detail"))}
        />
      )}

      {currentScreen === "cart" && (
        <CartScreen
          cartItems={cartItems}
          selectedItems={selectedCartItems}
          onBack={handleBackToProducts}
          onSelectItem={handleSelectCartItem}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveFromCart}
          onBuySelected={handleBuySelectedItems}
        />
      )}
    </div>
  )
}
