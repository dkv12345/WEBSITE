import React from "react";
import { motion } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Lock, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CartDrawer({
  isCartDrawerOpen,
  closeCartDrawer,
  cartItems = [],
  cartLoading,
  updateCartItemQuantity,
  removeCartItem
}) {
  const navigate = useNavigate();

  // Calculate subtotal price
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.bookId?.price || item.priceAtAdded || 0) * item.quantity,
    0
  );

  const handleCheckoutRedirect = () => {
    closeCartDrawer();
    navigate("/cart"); // /cart is the checkout information page in this app
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeCartDrawer}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs cursor-pointer"
      />

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        {/* Drawer container panel */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          className="w-screen max-w-md bg-[#F7EFE1] shadow-2xl flex flex-col border-l border-[#C9A227]/30 text-[#211B2E]"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#C9A227]/25 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#C9A227]" />
              <h2 className="text-xl font-bold tracking-tight uppercase font-cinzel-lbl">
                Your Basket
              </h2>
            </div>
            <button
              onClick={closeCartDrawer}
              className="p-1 rounded-full hover:bg-[#EDE6D6] text-[#211B2E]/60 hover:text-[#211B2E] transition-colors cursor-pointer"
              aria-label="Close cart drawer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart list content area */}
          <div className="flex-grow overflow-y-auto px-6 py-4 scrollbar-thin">
            {cartLoading && cartItems.length === 0 ? (
              <div className="h-full flex items-center justify-center flex-col gap-2 py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#C9A227]" />
                <span className="text-xs font-semibold text-[#211B2E]/60 uppercase tracking-wider">
                  Loading items...
                </span>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 gap-4">
                <div className="w-16 h-16 bg-[#EDE6D6] rounded-full flex items-center justify-center border border-[#C9A227]/20">
                  <ShoppingBag className="w-8 h-8 text-[#211B2E]/40" />
                </div>
                <div>
                  <h3 className="text-base font-bold uppercase tracking-wide">
                    Your cart is empty
                  </h3>
                  <p className="text-xs text-[#211B2E]/60 mt-1">
                    Add books to your basket to start your reading journey.
                  </p>
                </div>
                <button
                  onClick={closeCartDrawer}
                  className="mt-2 px-5 py-2.5 bg-[#211B2E] hover:bg-[#211B2E]/90 text-[#F7EFE1] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => {
                  const book = item.bookId;
                  if (!book) return null;
                  const itemPrice = book.price || item.priceAtAdded || 0;
                  const coverImage =
                    book.images?.medium ||
                    book.images?.small ||
                    book.images?.large ||
                    "https://placehold.co/100x150?text=No+Cover";

                  return (
                    <motion.div
                      layout
                      key={item._id || book._id}
                      className="flex gap-4 p-3 bg-white/50 border border-[#C9A227]/10 hover:border-[#C9A227]/25 transition-all shadow-2xs relative group"
                    >
                      {/* Image cover */}
                      <div className="w-16 aspect-[2/3] shrink-0 border border-[#211B2E]/10 bg-[#EDE6D6]/40 flex items-center justify-center overflow-hidden shadow-2xs">
                        <img
                          src={coverImage}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-grow flex flex-col justify-between pr-6">
                        <div>
                          <h4 className="text-xs font-black line-clamp-1 text-[#211B2E]">
                            {book.title}
                          </h4>
                          <p className="text-[10px] text-[#211B2E]/60 font-semibold mt-0.5">
                            {book.author}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          {/* Quantity Selector */}
                          <div className="flex items-center border border-[#C9A227]/30 bg-white">
                            <button
                              disabled={item.quantity <= 1}
                              onClick={() =>
                                updateCartItemQuantity(book._id, item.quantity - 1)
                              }
                              className="px-2 py-1 text-[#211B2E]/70 hover:text-[#211B2E] disabled:opacity-30 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold font-mono">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateCartItemQuantity(book._id, item.quantity + 1)
                              }
                              className="px-2 py-1 text-[#211B2E]/70 hover:text-[#211B2E] cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Price */}
                          <span className="text-xs font-bold font-mono text-[#211B2E]">
                            ${(itemPrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeCartItem(book._id)}
                        className="absolute top-2 right-2 p-1 rounded-sm text-[#211B2E]/40 hover:text-red-600 hover:bg-red-50/50 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Area */}
          {cartItems.length > 0 && (
            <div className="px-6 py-5 border-t border-[#C9A227]/25 bg-[#EDE6D6]/40 flex flex-col gap-4">
              {/* Total Calculation */}
              <div className="flex items-center justify-between font-sans">
                <span className="text-xs font-bold text-[#211B2E]/70 uppercase tracking-wider">
                  Subtotal
                </span>
                <span className="text-lg font-black font-mono text-[#211B2E]">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckoutRedirect}
                className="w-full flex items-center justify-center gap-2 py-3 bg-cta-gradient hover:bg-cta-gradient-hover text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer rounded-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1 text-[10px] text-[#211B2E]/60 font-semibold">
                <Lock className="w-3 h-3 text-[#C9A227]" />
                <span>Secure payment processed with BookHaven protocol</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
