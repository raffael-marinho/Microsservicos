"use client"

import { Search, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Product } from "@/app/page"

interface ProductsScreenProps {
  products: Product[]
  onProductSelect: (product: Product) => void
  onGoToCart: () => void
  cartItemsCount: number
}

export default function ProductsScreen({ products, onProductSelect, onGoToCart, cartItemsCount }: ProductsScreenProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-emerald-500 text-white p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">ShopEasy</h1>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search products..." className="pl-10 bg-white text-gray-900 border-0" />
            </div>
            <Button variant="ghost" className="relative text-white hover:bg-emerald-600" onClick={onGoToCart}>
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Categories */}
      <div className="bg-gray-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-2 overflow-x-auto">
            {["All", "Electronics", "Home", "Fitness", "Accessories"].map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                className={`whitespace-nowrap ${
                  category === "All"
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <main className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onProductSelect(product)}
            >
              <div className="aspect-square bg-gray-100">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-emerald-600">${product.price}</span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{product.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
