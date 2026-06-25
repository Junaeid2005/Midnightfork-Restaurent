import React from 'react';
import { useStore } from '../store';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export const Cart: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, clearCart, setActivePage, settings } = useStore();

  const subtotal = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  const deliveryFee = subtotal > 50 ? 0 : settings.deliveryCharge;
  const tax = subtotal * 0.15; // 15% standard tax
  const grandTotal = subtotal === 0 ? 0 : subtotal + deliveryFee + tax;

  const handleCheckoutClick = () => {
    setActivePage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShopClick = () => {
    setActivePage('menu');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="cart-view" className="bg-[#050505] text-slate-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Title */}
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-purple-400">Your Basket</span>
          <h1 className="text-3xl sm:text-4.5xl font-serif font-light text-white mt-1 tracking-tight">Selected Pleasures</h1>
          <div className="h-[1px] w-16 bg-purple-500/50 mx-auto mt-3 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl space-y-6 backdrop-blur-md">
            <div className="p-4 bg-white/5 rounded-full border border-white/10 w-fit mx-auto">
              <ShoppingBag className="w-10 h-10 text-purple-400" />
            </div>
            <div className="space-y-1.5">
              <h2 className="font-semibold uppercase tracking-widest text-xs text-white">Your Basket is Vacant</h2>
              <p className="text-xs text-gray-400 font-light">Savour the shadows of our culinary manuscript first.</p>
            </div>
            <button
              onClick={handleShopClick}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs tracking-wider uppercase rounded-lg transition-all shadow-lg cursor-pointer"
            >
              Browse The Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Cart Items List */}
            <div className="md:col-span-7 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Selected Items</span>
                <button
                  onClick={clearCart}
                  className="text-[10px] text-red-400 hover:text-red-300 font-bold uppercase tracking-widest flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              </div>

              <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.menuItem.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex gap-4 items-center">
                    <img 
                      src={item.menuItem.image} 
                      alt={item.menuItem.name} 
                      className="w-16 h-16 rounded-xl object-cover border border-white/10"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-xs text-white truncate uppercase tracking-widest leading-tight">
                        {item.menuItem.name}
                      </h3>
                      <p className="text-[10px] text-purple-400 font-bold mt-1">${item.menuItem.price.toFixed(2)}</p>
                      
                      {/* Quantity adjustment */}
                      <div className="flex items-center gap-2.5 mt-2 bg-[#050505]/40 border border-white/10 rounded-lg py-1 px-3 w-fit scale-90 origin-left">
                        <button
                          onClick={() => updateCartQuantity(item.menuItem.id, item.quantity - 1)}
                          className="text-gray-400 hover:text-white font-bold cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs text-white px-1.5 font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.menuItem.id, item.quantity + 1)}
                          className="text-gray-400 hover:text-white font-bold cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-bold text-xs text-purple-300">
                        ${(item.menuItem.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.menuItem.id)}
                        className="text-gray-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 transition-all mt-2 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleShopClick}
                className="text-xs font-semibold text-purple-400 hover:text-white flex items-center gap-1.5 uppercase tracking-widest pt-4 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Add More Delicacies</span>
              </button>
            </div>

            {/* Calculations Summary Card */}
            <div className="md:col-span-5 bg-white/5 p-6 rounded-2xl border border-white/10 shadow-2xl relative space-y-5 backdrop-blur-md">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 blur-[50px] rounded-full"></div>
              
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-white border-b border-white/10 pb-3">
                Invoice Breakdown
              </h2>

              <div className="space-y-3.5 text-xs text-gray-400 font-light">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-200">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Midnight Dispatch Fee</span>
                  {subtotal > 50 ? (
                    <span className="text-green-400 font-semibold uppercase text-[9px] tracking-wider bg-green-950/20 border border-green-800/30 px-2 py-0.5 rounded">
                      FREE over $50
                    </span>
                  ) : (
                    <span className="font-semibold text-slate-200">${deliveryFee.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span>Gastronomy Tax (15% VAT)</span>
                  <span className="font-semibold text-slate-200">${tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-white/10 pt-4 flex justify-between items-center text-xs font-extrabold uppercase tracking-widest text-white">
                  <span>Grand Total</span>
                  <span className="text-purple-400 text-base font-bold">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs uppercase tracking-widest rounded-lg shadow-lg shadow-purple-600/15 flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] cursor-pointer"
              >
                <span>Proceed To Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-gray-500 font-light leading-relaxed text-center">
                * We implement a manual Personal bKash transfer system. Grand total excludes any operator-side send-money fees.
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
export default Cart;
