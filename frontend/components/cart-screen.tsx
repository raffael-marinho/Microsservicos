"\"use client"

import { Label } from "@/components/ui/label"

import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import type { Product } from "@/app/page"

interface CartItem {
  product: Product
  quantity: number
}

interface CartScreenProps {
  cartItems: CartItem[]
  selectedItems: string[]
  onBack: () => void
  onSelectItem: (productId: string) => void
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemoveItem: (productId: string) => void
  onBuySelected: () => void
}

export default function CartScreen({
  cartItems,
  selectedItems,
  onBack,
  onSelectItem,
  onUpdateQuantity,
  onRemoveItem,
  onBuySelected,
}: CartScreenProps) {
  const selectedCartItems = cartItems.filter((item) => selectedItems.includes(item.product.id))
  const subtotal = selectedCartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const tax = subtotal * 0.08
  const shipping = subtotal > 50 ? 0 : 9.99
  const total = subtotal + tax + shipping

  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      // Deselect all
      cartItems.forEach((item) => onSelectItem(item.product.id))
    } else {
      // Select all
      cartItems.forEach((item) => {
        if (!selectedItems.includes(item.product.id)) {
          onSelectItem(item.product.id)
        }
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onBack} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-semibold text-gray-900 ml-4">Shopping Cart</h1>
          </div>
          <div className="text-sm text-gray-500">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some products to get started</p>
            <Button onClick={onBack} className="bg-emerald-500 hover:bg-emerald-600 text-white">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Select All */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="select-all"
                    checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <Label htmlFor="select-all" className="font-medium text-gray-900 cursor-pointer">
                    Select All ({cartItems.length} items)
                  </Label>
                </div>
              </div>

              {/* Cart Items List */}
              {cartItems.map((item) => (
                <div key={item.product.id} className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-start space-x-4">
                    <Checkbox
                      id={`item-${item.product.id}`}
                      checked={selectedItems.includes(item.product.id)}
                      onCheckedChange={() => onSelectItem(item.product.id)}
                    />

                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.product.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{item.product.category}</p>
                      <div className="text-lg font-bold text-emerald-600">${item.product.price}</div>
                    </div>

                    <div className="flex flex-col items-end space-y-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-300 rounded">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="px-3 h-8"
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="px-3 py-1 border-x border-gray-300 text-sm min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="px-3 h-8"
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => onRemoveItem(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                      {/* Item Total */}
                      <div className="text-lg font-semibold text-gray-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg border border-gray-200 sticky top-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

                {selectedItems.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No items selected</p>
                    <p className="text-sm text-gray-400">Select items to see summary</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2 mb-4">
                      <div className="text-sm text-gray-600">
                        {selectedItems.length} {selectedItems.length === 1 ? "item" : "items"} selected
                      </div>
                      {selectedCartItems.map((item) => (
                        <div key={item.product.id} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {item.product.name} × {item.quantity}
                          </span>
                          <span className="text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3 mb-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Tax</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between font-semibold text-lg text-gray-900">
                          <span>Total</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={onBuySelected}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                      disabled={selectedItems.length === 0}
                    >
                      Buy Selected Items ({selectedItems.length})
                    </Button>
                  </>
                )}

                <Button
                  onClick={onBack}
                  variant="outline"
                  className="w-full mt-3 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
