// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import {
//   ShoppingCart,
//   Trash2,
//   Mail,
//   FileText,
//   Loader2,
//   AlertCircle,
//   Package,
//   X,
//   Check,
//   ArrowLeft,
// } from "lucide-react";
// import { cartApi, diamondApi, Diamond } from "@/lib/api";

// interface CartItemWithDetails extends Diamond {
//   stoneNo: string;
//   addedAt?: string;
// }

// export default function CartPage() {
//   const router = useRouter();
//   const [cartItems, setCartItems] = useState<CartItemWithDetails[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isRemoving, setIsRemoving] = useState<string | null>(null);
//   const [isClearing, setIsClearing] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);

//   // Fetch cart items on mount
//   useEffect(() => {
//     fetchCartItems();
//   }, []);

//   const fetchCartItems = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);

//       const response = await cartApi.get();

//       if (response?.success && response.data?.cartItems) {
//         // Fetch full diamond details for each cart item
//         const itemsWithDetails = await Promise.all(
//           response.data.cartItems.map(async (item: any) => {
//             try {
//               const diamondResponse = await diamondApi.getAllNoPagination();
//               const diamond = diamondResponse?.data?.diamonds?.find(
//                 (d) => d.stoneNo === item.stoneNo
//               );
//               return { ...diamond, ...item } as CartItemWithDetails;
//             } catch (err) {
//               console.error("Error fetching diamond details:", err);
//               return item as CartItemWithDetails;
//             }
//           })
//         );
//         setCartItems(itemsWithDetails);
//       } else {
//         setCartItems([]);
//       }
//     } catch (err) {
//       console.error("Error fetching cart:", err);
//       setError("Failed to load cart items. Please try again.");
//       setCartItems([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleRemoveItem = async (stoneNo: string) => {
//     try {
//       setIsRemoving(stoneNo);
//       setError(null);

//       const response = await cartApi.remove(stoneNo);

//       if (response?.success) {
//         setCartItems((prev) => prev.filter((item) => item.stoneNo !== stoneNo));
//         setSelectedItems((prev) => {
//           const newSet = new Set(prev);
//           newSet.delete(stoneNo);
//           return newSet;
//         });

//         setSuccessMessage(`${stoneNo} removed from cart`);
//         setTimeout(() => setSuccessMessage(null), 3000);

//         // Dispatch cart update event for header
//         window.dispatchEvent(new CustomEvent("cart-updated"));
//       } else {
//         setError(response?.message || "Failed to remove item");
//       }
//     } catch (err: any) {
//       console.error("Error removing item:", err);
//       setError(err?.message || "Failed to remove item from cart");
//     } finally {
//       setIsRemoving(null);
//     }
//   };

//   const handleClearCart = async () => {
//     if (!window.confirm("Are you sure you want to clear your entire cart?")) {
//       return;
//     }

//     try {
//       setIsClearing(true);
//       setError(null);

//       const response = await cartApi.clear();

//       if (response?.success) {
//         setCartItems([]);
//         setSelectedItems(new Set());

//         setSuccessMessage("Cart cleared successfully");
//         setTimeout(() => setSuccessMessage(null), 3000);

//         // Dispatch cart update event for header
//         window.dispatchEvent(new CustomEvent("cart-updated"));
//       } else {
//         setError(response?.message || "Failed to clear cart");
//       }
//     } catch (err: any) {
//       console.error("Error clearing cart:", err);
//       setError(err?.message || "Failed to clear cart");
//     } finally {
//       setIsClearing(false);
//     }
//   };

//   const toggleSelectItem = (stoneNo: string) => {
//     setSelectedItems((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(stoneNo)) {
//         newSet.delete(stoneNo);
//       } else {
//         newSet.add(stoneNo);
//       }
//       return newSet;
//     });
//   };

//   const toggleSelectAll = () => {
//     if (selectedItems.size === cartItems.length) {
//       setSelectedItems(new Set());
//     } else {
//       setSelectedItems(new Set(cartItems.map((item) => item.stoneNo)));
//     }
//   };

//   const handleRequestQuote = () => {
//     if (selectedItems.size === 0) {
//       setError("Please select at least one item to request a quote");
//       setTimeout(() => setError(null), 3000);
//       return;
//     }

//     const selectedStoneNumbers = Array.from(selectedItems);
//     router.push(`/quotation?stones=${selectedStoneNumbers.join(",")}`);
//   };

//   const handleEmailSelected = () => {
//     if (selectedItems.size === 0) {
//       setError("Please select at least one item to email");
//       setTimeout(() => setError(null), 3000);
//       return;
//     }

//     const selectedStoneNumbers = Array.from(selectedItems);
//     router.push(`/email-diamonds?stones=${selectedStoneNumbers.join(",")}`);
//   };

//   const calculateTotal = () => {
//     return cartItems
//       .filter((item) => selectedItems.has(item.stoneNo))
//       .reduce((sum, item) => sum + (item.price || 0), 0);
//   };

//   const formatDate = (dateString?: string) => {
//     if (!dateString) return "";
//     try {
//       return new Date(dateString).toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//         year: "numeric",
//       });
//     } catch {
//       return "";
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-[#050c3a] to-[#0a1854] pt-32 pb-16">
//         <div className="container mx-auto px-4">
//           <div className="flex flex-col items-center justify-center py-20">
//             <Loader2 className="w-12 h-12 text-[#c89e3a] animate-spin mb-4" />
//             <p className="text-white text-lg">Loading your cart...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-[#050c3a] to-[#0a1854] pt-32 pb-16">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <button
//             onClick={() => router.back()}
//             className="flex items-center gap-2 text-gray-300 hover:text-white mb-4 transition-colors"
//           >
//             <ArrowLeft className="w-5 h-5" />
//             Back
//           </button>

//           <div className="flex items-center gap-3 mb-4">
//             <ShoppingCart className="w-8 h-8 text-[#c89e3a]" />
//             <h1 className="text-3xl md:text-4xl font-bold text-white">
//               Shopping Cart
//             </h1>
//           </div>
//           <p className="text-gray-300">
//             {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
//             your cart
//           </p>
//         </div>

//         {/* Success Message */}
//         {successMessage && (
//           <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3 animate-fade-in">
//             <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
//             <p className="text-green-400">{successMessage}</p>
//             <button
//               onClick={() => setSuccessMessage(null)}
//               className="ml-auto text-green-400 hover:text-green-300"
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>
//         )}

//         {/* Error Message */}
//         {error && (
//           <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 animate-fade-in">
//             <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
//             <p className="text-red-400">{error}</p>
//             <button
//               onClick={() => setError(null)}
//               className="ml-auto text-red-400 hover:text-red-300"
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>
//         )}

//         {/* Empty Cart */}
//         {cartItems.length === 0 ? (
//           <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-12 text-center">
//             <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <h2 className="text-2xl font-semibold text-white mb-2">
//               Your cart is empty
//             </h2>
//             <p className="text-gray-400 mb-6">
//               Add diamonds to your cart to get started
//             </p>
//             <button
//               onClick={() => router.push("/inventory")}
//               className="px-6 py-3 bg-[#c89e3a] text-white rounded-lg hover:bg-[#b08830] transition-colors"
//             >
//               Browse Inventory
//             </button>
//           </div>
//         ) : (
//           <div className="grid lg:grid-cols-3 gap-8">
//             {/* Cart Items */}
//             <div className="lg:col-span-2 space-y-4">
//               {/* Select All & Clear Cart */}
//               <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 flex items-center justify-between">
//                 <label className="flex items-center gap-3 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={
//                       cartItems.length > 0 &&
//                       selectedItems.size === cartItems.length
//                     }
//                     onChange={toggleSelectAll}
//                     className="w-5 h-5 rounded border-gray-600 text-[#c89e3a] focus:ring-[#c89e3a] focus:ring-offset-0 cursor-pointer"
//                   />
//                   <span className="text-white font-medium">Select All</span>
//                 </label>

//                 <button
//                   onClick={handleClearCart}
//                   disabled={isClearing || cartItems.length === 0}
//                   className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isClearing ? (
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                   ) : (
//                     <Trash2 className="w-4 h-4" />
//                   )}
//                   Clear Cart
//                 </button>
//               </div>

//               {/* Cart Items List */}
//               {cartItems.map((item) => (
//                 <div
//                   key={item.stoneNo}
//                   className={`bg-white/5 backdrop-blur-sm border rounded-lg p-4 sm:p-6 transition-all ${
//                     selectedItems.has(item.stoneNo)
//                       ? "border-[#c89e3a] bg-white/10"
//                       : "border-white/10 hover:bg-white/10"
//                   }`}
//                 >
//                   <div className="flex items-start gap-3 sm:gap-4">
//                     {/* Checkbox */}
//                     <input
//                       type="checkbox"
//                       checked={selectedItems.has(item.stoneNo)}
//                       onChange={() => toggleSelectItem(item.stoneNo)}
//                       className="w-5 h-5 rounded border-gray-600 text-[#c89e3a] focus:ring-[#c89e3a] focus:ring-offset-0 mt-1 cursor-pointer flex-shrink-0"
//                     />

//                     {/* Item Details */}
//                     <div className="flex-1 min-w-0">
//                       <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
//                         {/* Left Side - Details */}
//                         <div className="flex-1">
//                           <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 break-all">
//                             {item.stoneNo}
//                           </h3>

//                           <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mb-2">
//                             {item.shape && (
//                               <p className="text-gray-300">
//                                 <span className="text-gray-400">Shape:</span>{" "}
//                                 <span className="font-medium">{item.shape}</span>
//                               </p>
//                             )}
//                             {item.carats && (
//                               <p className="text-gray-300">
//                                 <span className="text-gray-400">Carat:</span>{" "}
//                                 <span className="font-medium">
//                                   {item.carats}
//                                 </span>
//                               </p>
//                             )}
//                             {item.color && (
//                               <p className="text-gray-300">
//                                 <span className="text-gray-400">Color:</span>{" "}
//                                 <span className="font-medium">{item.color}</span>
//                               </p>
//                             )}
//                             {item.clarity && (
//                               <p className="text-gray-300">
//                                 <span className="text-gray-400">Clarity:</span>{" "}
//                                 <span className="font-medium">
//                                   {item.clarity}
//                                 </span>
//                               </p>
//                             )}
//                             {item.cut && (
//                               <p className="text-gray-300">
//                                 <span className="text-gray-400">Cut:</span>{" "}
//                                 <span className="font-medium">{item.cut}</span>
//                               </p>
//                             )}
//                           </div>

//                           {item.addedAt && (
//                             <p className="text-xs text-gray-400 mt-2">
//                               Added: {formatDate(item.addedAt)}
//                             </p>
//                           )}
//                         </div>

//                         {/* Right Side - Price & Remove */}
//                         <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4">
//                           {item.price && (
//                             <p className="text-xl sm:text-2xl font-bold text-[#c89e3a] whitespace-nowrap">
//                               ${item.price.toLocaleString()}
//                             </p>
//                           )}

//                           <button
//                             onClick={() => handleRemoveItem(item.stoneNo)}
//                             disabled={isRemoving === item.stoneNo}
//                             className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                           >
//                             {isRemoving === item.stoneNo ? (
//                               <Loader2 className="w-4 h-4 animate-spin" />
//                             ) : (
//                               <Trash2 className="w-4 h-4" />
//                             )}
//                             <span className="hidden sm:inline">Remove</span>
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Summary Sidebar */}
//             <div className="lg:col-span-1">
//               <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 sticky top-32">
//                 <h2 className="text-xl font-bold text-white mb-6">
//                   Cart Summary
//                 </h2>

//                 <div className="space-y-4 mb-6">
//                   <div className="flex justify-between text-gray-300">
//                     <span>Total Items:</span>
//                     <span className="font-semibold">{cartItems.length}</span>
//                   </div>

//                   <div className="flex justify-between text-gray-300">
//                     <span>Selected Items:</span>
//                     <span className="font-semibold">{selectedItems.size}</span>
//                   </div>

//                   <div className="border-t border-white/10 pt-4">
//                     <div className="flex justify-between text-lg">
//                       <span className="text-white font-semibold">
//                         Selected Total:
//                       </span>
//                       <span className="text-[#c89e3a] font-bold">
//                         ${calculateTotal().toLocaleString()}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-3">
//                   <button
//                     onClick={handleRequestQuote}
//                     disabled={selectedItems.size === 0}
//                     className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#c89e3a] text-white rounded-lg hover:bg-[#b08830] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#c89e3a]"
//                   >
//                     <FileText className="w-5 h-5" />
//                     Request Quote ({selectedItems.size})
//                   </button>

//                   <button
//                     onClick={handleEmailSelected}
//                     disabled={selectedItems.size === 0}
//                     className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-[#c89e3a] text-[#c89e3a] rounded-lg hover:bg-[#c89e3a] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#c89e3a]"
//                   >
//                     <Mail className="w-5 h-5" />
//                     Email Selected ({selectedItems.size})
//                   </button>

//                   <button
//                     onClick={() => router.push("/inventory")}
//                     className="w-full px-6 py-3 border border-white/30 text-white rounded-lg hover:bg-white/5 transition-colors"
//                   >
//                     Continue Shopping
//                   </button>
//                 </div>

//                 <div className="mt-6 pt-6 border-t border-white/10">
//                   <p className="text-xs text-gray-400 text-center leading-relaxed">
//                     Need help selecting diamonds? Our experts are here to
//                     assist you.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
