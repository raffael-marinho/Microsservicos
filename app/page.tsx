"use client"

import { useState } from "react"
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

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: 129.99,
    image: "/placeholder.svg?height=300&width=300",
    description:
      "Premium wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
    category: "Electronics",
    rating: 4.5,
    reviews: 234,
  },
  {
    id: "2",
    name: "Smart Watch",
    price: 299.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Advanced fitness tracking, heart rate monitoring, and smartphone connectivity in a sleek design.",
    category: "Electronics",
    rating: 4.3,
    reviews: 189,
  },
  {
    id: "3",
    name: "Laptop Backpack",
    price: 79.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Durable and stylish backpack with padded laptop compartment and multiple organizational pockets.",
    category: "Accessories",
    rating: 4.7,
    reviews: 156,
  },
  {
    id: "4",
    name: "Coffee Maker",
    price: 199.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Programmable coffee maker with built-in grinder and thermal carafe. Makes perfect coffee every time.",
    category: "Home",
    rating: 4.4,
    reviews: 298,
  },
  {
    id: "5",
    name: "Yoga Mat",
    price: 49.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Non-slip premium yoga mat with extra cushioning for comfort during your practice sessions.",
    category: "Fitness",
    rating: 4.6,
    reviews: 412,
  },
  {
    id: "6",
    name: "Desk Lamp",
    price: 89.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "LED desk lamp with adjustable brightness and color temperature. Perfect for work and study.",
    category: "Home",
    rating: 4.2,
    reviews: 87,
  },
]

export default function EcommerceApp() {
  const [currentScreen, setCurrentScreen] = useState<"products" | "detail" | "payment" | "cart">("products")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [cartItems, setCartItems] = useState<Array<{ product: Product; quantity: number }>>([])
  const [selectedCartItems, setSelectedCartItems] = useState<string[]>([])

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

  return (
    <div className="min-h-screen bg-gray-50">
      {currentScreen === "products" && (
        <ProductsScreen
          products={mockProducts}
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
