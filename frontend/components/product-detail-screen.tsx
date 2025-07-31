"use client"

import { ArrowLeft, Heart, Share2, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/app/page"

interface ProductDetailScreenProps {
  product: Product
  onBack: () => void
  onAddToCart: (product: Product, quantity: number) => void
  onBuyNow: (product: Product) => void
}

export default function ProductDetailScreen({ product, onBack, onAddToCart, onBuyNow }: ProductDetailScreenProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-gray-600">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-600">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Product Details */}
      <main className="max-w-4xl mx-auto p-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <span className="text-sm text-emerald-600 font-medium bg-emerald-50 px-3 py-1 rounded-full">
                {product.category}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mt-3">{product.name}</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-gray-600">{product.rating}</span>
              </div>
              <span className="text-gray-500">({product.reviews} reviews)</span>
            </div>

            <div className="text-4xl font-bold text-emerald-600">${product.price}</div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-gray-700 font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded">
                  <Button variant="ghost" size="sm" className="px-3">
                    -
                  </Button>
                  <span className="px-4 py-2 border-x border-gray-300">1</span>
                  <Button variant="ghost" size="sm" className="px-3">
                    +
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => onAddToCart(product, 1)}
                variant="outline"
                className="flex-1 border-emerald-500 text-emerald-600 hover:bg-emerald-50"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                onClick={() => onBuyNow(product)}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                Buy Now
              </Button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Product Features</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Free shipping on orders over $50</li>
                <li>• 30-day return policy</li>
                <li>• 1-year warranty included</li>
                <li>• 24/7 customer support</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
