import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import {
  ShoppingCart,
  Trash2,
  ArrowLeft,
  Plus,
  Minus,
  Ticket,
  CreditCard,
  Truck,
  BadgePercent,
  User,
  Phone,
  MapPin,
  Globe,
  AlertCircle,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

export default function CartPage() {
  const navigate = useNavigate();

  // Cart state management
  const {
    cartItems,
    cartLoading,
    fetchCartDetails,
    updateCartItemQuantity,
    removeCartItem
  } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Shipping Information states
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliveryEstimate, setDeliveryEstimate] = useState("");

  // Split Delivery Address states (4 fields)
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [subDistrict, setSubDistrict] = useState("");
  const [specificAddress, setSpecificAddress] = useState("");

  // GeoNames Location states
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  // Promo code states
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState("");

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // Validation errors
  const [errors, setErrors] = useState({});

  // Refs for scrolling to errors
  const fieldRefs = {
    customerName: useRef(null),
    phoneNumber: useRef(null),
    country: useRef(null),
    city: useRef(null),
    subDistrict: useRef(null),
    specificAddress: useRef(null)
  };

  // Generate realistic delivery date range
  useEffect(() => {
    const options = { month: 'short', day: '2-digit' };
    const currentYear = 2026;
    const today = new Date();
    today.setFullYear(currentYear);

    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 3);

    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 5);

    const minStr = minDate.toLocaleDateString('en-US', options);
    const maxStr = maxDate.toLocaleDateString('en-US', options);
    setDeliveryEstimate(`${minStr} - ${maxStr}, ${currentYear}`);
  }, []);

  // fetchCartDetails is now loaded from CartContext

  const fetchCountries = async () => {
    try {
      const response = await fetch("/api/shipping/countries");
      const result = await response.json();
      if (result.success && result.data) {
        setCountries(result.data);

        // Find if initial country is Vietnam and default to it
        const vnCountry = result.data.find(c => c.countryName === "Vietnam");
        if (vnCountry) {
          setCountry("Vietnam");
          fetchCities(vnCountry.geonameId);
        } else if (result.data.length > 0) {
          setCountry(result.data[0].countryName);
          fetchCities(result.data[0].geonameId);
        }
      }
    } catch (err) {
      console.error("Error fetching countries:", err);
    }
  };

  const fetchCities = async (geonameId) => {
    setLoadingLocations(true);
    try {
      const response = await fetch(`/api/shipping/cities/${geonameId}`);
      const result = await response.json();
      if (result.success && result.data) {
        setCities(result.data);
      }
    } catch (err) {
      console.error("Error fetching cities:", err);
    } finally {
      setLoadingLocations(false);
    }
  };

  const handleCountryChange = (selectedCountryName) => {
    setCountry(selectedCountryName);
    setCity("");
    setSubDistrict(""); // Reset city and ward

    if (errors.country) {
      setErrors(prev => ({ ...prev, country: false }));
    }
    if (errors.city) {
      setErrors(prev => ({ ...prev, city: false }));
    }

    const selected = countries.find(c => c.countryName === selectedCountryName);
    if (selected && selected.geonameId) {
      fetchCities(selected.geonameId);
    } else {
      setCities([]);
    }
  };

  useEffect(() => {
    fetchCartDetails();
    fetchCountries();
  }, []);

  // Remove item from database cart
  const removeItem = async (id) => {
    const result = await removeCartItem(id);
    if (result && !result.success) {
      alert(result.message || "Failed to remove item.");
    }
  };

  // Update quantity in database cart
  const updateQuantity = async (id, type) => {
    const item = cartItems.find(item => (item.bookId?._id === id || item._id === id));
    if (!item) return;

    const currentQty = item.quantity;
    let newQty = type === "increase" ? currentQty + 1 : currentQty - 1;
    if (newQty < 1) newQty = 1;

    const result = await updateCartItemQuantity(id, newQty);
    if (result && !result.success) {
      alert(result.message || "Insufficient inventory stock.");
    }
  };

  // Calculate prices
  const subtotalPrice = cartItems.reduce(
    (total, item) => total + (item.bookId?.price || item.price || 0) * item.quantity,
    0
  );

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    const code = couponCode.toUpperCase();
    if (code === "BOOKHAVEN10") {
      const discount = subtotalPrice * 0.1;
      setDiscountAmount(discount);
      setAppliedCoupon("BOOKHAVEN10 (10% OFF)");
    } else {
      alert("Invalid promotional code!");
    }
    setCouponCode("");
  };

  const handleRemoveCoupon = () => {
    setDiscountAmount(0);
    setAppliedCoupon("");
  };

  const totalPrice = Math.max(0, subtotalPrice - discountAmount);

  // Clear errors when user edits fields
  const handleInputChange = (field, value, setter) => {
    setter(value);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  // Place order routing
  const handleCheckoutSubmit = () => {
    if (cartItems.length === 0) return;

    const newErrors = {};
    let firstErrorRef = null;

    if (!customerName.trim()) {
      newErrors.customerName = "Please enter your full name.";
      if (!firstErrorRef) firstErrorRef = fieldRefs.customerName;
    }
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Please enter your phone number.";
      if (!firstErrorRef) firstErrorRef = fieldRefs.phoneNumber;
    }
    if (!country.trim()) {
      newErrors.country = "Please enter your country.";
      if (!firstErrorRef) firstErrorRef = fieldRefs.country;
    }
    if (!city.trim()) {
      newErrors.city = "Please enter your city/province.";
      if (!firstErrorRef) firstErrorRef = fieldRefs.city;
    }
    if (!subDistrict.trim()) {
      newErrors.subDistrict = "Please enter your sub-district.";
      if (!firstErrorRef) firstErrorRef = fieldRefs.subDistrict;
    }
    if (!specificAddress.trim()) {
      newErrors.specificAddress = "Please enter your specific street address.";
      if (!firstErrorRef) firstErrorRef = fieldRefs.specificAddress;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (firstErrorRef?.current) {
        firstErrorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => firstErrorRef.current.focus(), 500);
      }
      return;
    }

    const fullCombinedAddress = `${specificAddress}, ${subDistrict}, ${city}, ${country}`;

    navigate("/checkout", {
      state: {
        shippingDetails: {
          name: customerName,
          phone: phoneNumber,
          address: {
            country,
            city,
            subDistrict,
            specificAddress,
            formatted: fullCombinedAddress
          },
          estimatedDelivery: deliveryEstimate
        },
        paymentMethod: paymentMethod,
        couponApplied: appliedCoupon ? appliedCoupon : null,
        totalAmount: totalPrice,
        subtotalAmount: subtotalPrice,
        discountAmount: discountAmount
      }
    });
  };

  const paymentOptions = [
    {
      id: "cod",
      name: "Cash on Delivery (COD)",
      icon: (
        <svg viewBox="0 0 48 30" width="36" height="22" xmlns="http://www.w3.org/2000/svg" className="rounded border border-gray-200/50 shadow-2xs">
          <rect width="48" height="30" rx="4" fill="#FFF1EB" />
          <rect x="8" y="7" width="32" height="16" rx="2" fill="#FF5E1E" />
          <circle cx="17" cy="18" r="2" fill="#FFF" />
          <circle cx="31" cy="18" r="2" fill="#FFF" />
          <path d="M13 10h12v4H13z" fill="#FFF" opacity="0.3" />
          <text x="24" y="19" fontFamily="sans-serif" fontSize="8" fontWeight="black" fill="#FFF" textAnchor="middle">COD</text>
        </svg>
      )
    },
    {
      id: "banking",
      name: "Bank Transfer / QR Pay",
      icon: (
        <svg viewBox="0 0 48 30" width="36" height="22" xmlns="http://www.w3.org/2000/svg" className="rounded border border-gray-200/50 shadow-2xs">
          <rect width="48" height="30" rx="4" fill="#EBF3FF" />
          <rect x="8" y="7" width="32" height="16" rx="2" fill="#0A59CC" />
          <path d="M12 11h4v1h-4zm0 2h4v1h-4zm0 2h4v1h-4zm6-4h4v1h-4zm0 2h4v1h-4zm0 2h4v1h-4zm6-4h12v5H24z" fill="#FFF" opacity="0.25" />
          <text x="24" y="18" fontFamily="sans-serif" fontSize="7" fontWeight="black" fill="#FFF" textAnchor="middle">QR PAY</text>
        </svg>
      )
    },
    {
      id: "visa_master",
      name: "Visa / Mastercard / JCB",
      icon: (
        <div className="flex items-center gap-1">
          <svg viewBox="0 0 48 30" width="28" height="18" xmlns="http://www.w3.org/2000/svg" className="rounded border border-gray-200/85 shadow-2xs">
            <rect width="48" height="30" rx="4" fill="#F7F7F7" />
            <path d="M18.8 19.5h2.5L22.9 10h-2.5l-1.6 9.5zm11.9-9.2c-.6-.3-1.6-.6-2.8-.6-3.1 0-5.3 1.6-5.3 4 0 1.7 1.6 2.7 2.8 3.3 1.2.6 1.6 1 1.6 1.5 0 .8-1 1.1-1.9 1.1-1.6 0-2.5-.2-3.8-.8l-.5-.2-.5 3.1c.9.4 2.5.8 4.2.8 3.3 0 5.4-1.6 5.4-4.1 0-1.4-.8-2.4-2.7-3.3-1.2-.6-1.9-1-1.9-1.6 0-.6.7-1.1 1.7-1.1.9 0 1.6.2 2.5.6l.3.2.4-3zm9.8 9.2L42.8 10h-2.3c-.7 0-1.3.4-1.6.9L34.6 19.5h2.6l.5-1.4H41l.2 1.4h2.3zm-3.2-3.9h-2.6c-.1-.4.9-2.5.9-2.5l.5 1.7.1.8h1.1zm-28.7 3.9h2.6l4.2-9.5H31L28 15c-.4-1-.7-1.6-1.3-2.2-.6-.6-1.5-1-2.9-1.2l.2-.9h-3.9l-.4 1.8c.8.2 1.7.5 2.5.9.8.4 1.2.9 1.5 1.5l-3 6.9z" fill="#1434CB" />
          </svg>
          <svg viewBox="0 0 48 30" width="28" height="18" xmlns="http://www.w3.org/2000/svg" className="rounded border border-gray-200/85 shadow-2xs">
            <rect width="48" height="30" rx="4" fill="#F7F7F7" />
            <circle cx="20" cy="15" r="9" fill="#EB001B" opacity="0.9" />
            <circle cx="28" cy="15" r="9" fill="#F79E1B" opacity="0.9" />
            <path d="M24 10.4c1.2 1.2 2 3 2 4.6s-.8 3.4-2 4.6c-1.2-1.2-2-3-2-4.6s.8-3.4 2-4.6z" fill="#FF5F00" />
          </svg>
        </div>
      )
    },
    {
      id: "paypal",
      name: "PayPal Express",
      icon: (
        <svg viewBox="0 0 48 30" width="36" height="22" xmlns="http://www.w3.org/2000/svg" className="rounded border border-gray-200/85 shadow-2xs">
          <rect width="48" height="30" rx="4" fill="#F7F7F7" />
          <path d="M30.7 10.3c-.2-1-.7-1.8-1.5-2.4-.8-.6-2-1-3.5-1h-6.8c-.5 0-.9.4-1 .9L15 22.5c-.1.4.2.8.6.8h3.8c.4 0 .8-.3.9-.7L21.7 14c.1-.4.4-.7.9-.7h1.4c2.6 0 4.6-1 5.3-3.9.3-1 .2-1.7-.6-2.1z" fill="#003087" />
          <path d="M28.7 13.3c-.2-1-.7-1.8-1.5-2.4-.8-.6-2-1-3.5-1h-6.8c-.5 0-.9.4-1 .9L13 25.5c-.1.4.2.8.6.8h3.8c.4 0 .8-.3.9-.7L19.7 17c.1-.4.4-.7.9-.7h1.4c2.6 0 4.6-1 5.3-3.9.3-1 .2-1.7-.6-2.1z" fill="#0079C1" opacity="0.85" />
          <path d="M22.7 17.3h1.4c2.6 0 4.6-1 5.3-3.9.1-.5.1-1 0-1.4-.4 2.5-2.2 3.5-4.8 3.5h-1.4c-.4 0-.8.3-.9.7l-1.4 8.7c-.1.4.2.8.6.8h3.1l1.4-8.7c.1-.4.4-.7.9-.7z" fill="#00457C" />
        </svg>
      )
    },
  ];

  const getFormInputStyle = (fieldName) => {
    const base = "w-full text-xs font-semibold pl-11 pr-4 py-3.5 border focus:outline-none transition-all duration-300 rounded-2xl bg-gray-50/60 border-transparent focus:bg-white focus:ring-4 focus:ring-orange-500/10 text-gray-800";
    if (errors[fieldName]) {
      return `${base} border-red-500/70 focus:border-red-500 focus:ring-red-500/10 bg-red-50/[0.04]`;
    }
    return `${base} focus:border-gold`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen bg-parchment text-ink font-sans pb-16"
    >
      {/* Premium Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/mainwebpage")}
              className="p-2 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </button>
            <div className="flex items-center gap-2.5">
              <ShoppingCart className="w-6 h-6 text-gold" />
              <span className="text-xl font-black tracking-tight text-gray-900">Your Basket</span>
            </div>
          </div>
          <span className="text-xs font-bold text-gray-400">Step 1 of 2</span>
        </div>
      </div>

      {/* Main Grid Wrapper */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {cartLoading ? (
          <div className="text-center py-24 space-y-3">
            <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Securing basket items...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-24 space-y-6 max-w-sm mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400 shadow-xs">
              <ShoppingCart className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-lg font-black text-gray-800">Your basket is empty</h2>
              <p className="text-xs text-gray-400 font-medium">Add books to your cart to explore recommendations.</p>
            </div>
            <motion.button 
                onClick={() => navigate("/mainwebpage")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="w-full bg-cta-gradient hover:bg-cta-gradient-hover text-white py-3.5 rounded-xl text-xs font-bold transition shadow-md shadow-gold/15 cursor-pointer"
              >
                RETURN TO BOOKSTORE
              </motion.button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* LEFT COLUMN: SELECTED ITEMS & ADDRESS (60% width equivalent) */}
            <div className="lg:col-span-7 space-y-8">

              {/* Selected Items section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                  <h2 className="text-base font-black text-gray-800 uppercase tracking-tight">Basket items</h2>
                  <span className="bg-gray-100 text-gray-600 text-[10px] font-black px-2 py-0.5 rounded-full">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>

                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {cartItems.map((item, idx) => {
                      const book = item.bookId || item;
                      const itemPrice = book.price || 0;
                      return (
                        <motion.div
                          key={item._id || book._id || idx}
                          layout
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -30, height: 0, margin: 0, padding: 0 }}
                          transition={{ duration: 0.35 }}
                          className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100/60 flex gap-5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.04)] transition-all duration-300 relative overflow-hidden"
                        >
                          {/* Image with glow and hover scale */}
                          <div className="w-20 h-28 shrink-0 overflow-hidden rounded-xl border border-gray-100/50 shadow-sm relative group bg-gray-50 flex items-center justify-center">
                            <img
                              src={book.images?.medium || book.images?.large || "https://placehold.co/300x400"}
                              alt={book.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,_rgba(255,255,255,0.08)_0%,_rgba(0,0,0,0.12)_3%,_rgba(255,255,255,0.08)_5%,_rgba(0,0,0,0)_12%)] pointer-events-none" />
                          </div>

                          {/* Info Fields */}
                          <div className="flex-1 flex flex-col justify-between py-0.5">
                            <div className="space-y-1">
                              <h3 className="text-sm font-black text-ink leading-snug line-clamp-1 hover:text-gold transition-colors font-display">
                                {book.title}
                              </h3>
                              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">{book.author}</p>
                            </div>

                            {/* Pill-shaped Quantity selector */}
                            <div className="bg-gray-50/80 rounded-full border border-gray-200/50 p-1 flex items-center w-max">
                              <button
                                onClick={() => updateQuantity(book._id || item._id, "decrease")}
                                className="w-7 h-7 rounded-full flex items-center justify-center bg-white text-gray-500 hover:text-gray-900 hover:shadow-xs active:bg-gray-100 transition cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5 stroke-[3]" />
                              </button>
                              <span className="w-8 text-center text-xs font-black text-gray-800 select-none">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(book._id || item._id, "increase")}
                                className="w-7 h-7 rounded-full flex items-center justify-center bg-white text-gray-500 hover:text-gray-900 hover:shadow-xs active:bg-gray-100 transition cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                              </button>
                            </div>
                          </div>

                          {/* Right column: Action remove & Cost */}
                          <div className="flex flex-col items-end justify-between py-0.5">
                            <button
                              onClick={() => removeItem(book._id || item._id)}
                              className="text-gray-300 hover:text-red-500 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 className="w-4 h-4 stroke-[2]" />
                            </button>
                            <span className="text-base font-black text-gray-900">
                              ${(itemPrice * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>

              {/* Shipping info Section */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100/60 space-y-6">
                <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                  <h2 className="text-base font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                    <Truck className="w-5 h-5 text-gold" />
                    Delivery Information
                  </h2>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Arrival ETA</span>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-lg border border-green-100/60 inline-block mt-0.5 select-none">
                      {deliveryEstimate}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Name and Phone Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="flex flex-col gap-1">
                      <div className="relative flex items-center">
                        <User className="absolute left-4 w-4 h-4 text-gray-400" />
                        <input
                          ref={fieldRefs.customerName}
                          type="text"
                          placeholder="Recipient Full Name"
                          value={customerName}
                          onChange={(e) => handleInputChange("customerName", e.target.value, setCustomerName)}
                          className={getFormInputStyle("customerName")}
                        />
                      </div>
                      {errors.customerName && (
                        <span className="text-[10px] text-red-500 font-bold flex items-center gap-1.5 pl-1.5">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.customerName}
                        </span>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col gap-1">
                      <div className="relative flex items-center">
                        <Phone className="absolute left-4 w-4 h-4 text-gray-400" />
                        <input
                          ref={fieldRefs.phoneNumber}
                          type="tel"
                          placeholder="Phone Number"
                          value={phoneNumber}
                          onChange={(e) => handleInputChange("phoneNumber", e.target.value.replace(/[^\d+]/g, ""), setPhoneNumber)}
                          className={getFormInputStyle("phoneNumber")}
                        />
                      </div>
                      {errors.phoneNumber && (
                        <span className="text-[10px] text-red-500 font-bold flex items-center gap-1.5 pl-1.5">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.phoneNumber}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 4-Field Address grid */}
                  <div className="space-y-3.5 pt-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block pl-1">
                      Delivery Address
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                      {/* Country */}
                      <div className="flex flex-col gap-1">
                        <div className="relative flex items-center">
                          <Globe className="absolute left-4 w-4 h-4 text-gray-400 z-10" />
                          <select
                            ref={fieldRefs.country}
                            value={country}
                            onChange={(e) => handleCountryChange(e.target.value)}
                            className={`${getFormInputStyle("country")} appearance-none cursor-pointer pr-10`}
                          >
                            <option value="" disabled>Select Country</option>
                            {countries.map(c => (
                              <option key={c.geonameId || c.countryName} value={c.countryName}>
                                {c.countryName}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-4 pointer-events-none text-gray-400">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                          </div>
                        </div>
                        {errors.country && (
                          <span className="text-[10px] text-red-500 font-bold flex items-center gap-1.5 pl-1.5">
                            <AlertCircle className="w-3.5 h-3.5" /> {errors.country}
                          </span>
                        )}
                      </div>

                      {/* City */}
                      <div className="flex flex-col gap-1">
                        <div className="relative flex items-center">
                          <MapPin className="absolute left-4 w-4 h-4 text-gray-400 z-10" />
                          <select
                            ref={fieldRefs.city}
                            value={city}
                            onChange={(e) => handleInputChange("city", e.target.value, setCity)}
                            disabled={!country || cities.length === 0}
                            className={`${getFormInputStyle("city")} appearance-none cursor-pointer pr-10 ${(!country || cities.length === 0) ? 'opacity-60 cursor-not-allowed' : ''}`}
                          >
                            <option value="">
                              {loadingLocations ? "Loading cities..." : "Select City"}
                            </option>
                            {cities.map(c => (
                              <option key={c.geonameId || c.name} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-4 pointer-events-none text-gray-400">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                          </div>
                        </div>
                        {errors.city && (
                          <span className="text-[10px] text-red-500 font-bold flex items-center gap-1.5 pl-1.5">
                            <AlertCircle className="w-3.5 h-3.5" /> {errors.city}
                          </span>
                        )}
                      </div>

                      {/* Sub-district */}
                      <div className="flex flex-col gap-1">
                        <div className="relative flex items-center">
                          <MapPin className="absolute left-4 w-4 h-4 text-gray-400" />
                          <input
                            ref={fieldRefs.subDistrict}
                            type="text"
                            placeholder={country.toLowerCase() === "vietnam" ? "Ward (Phường/Xã)" : "Sub-district"}
                            value={subDistrict}
                            onChange={(e) => handleInputChange("subDistrict", e.target.value, setSubDistrict)}
                            className={getFormInputStyle("subDistrict")}
                          />
                        </div>
                        {errors.subDistrict && (
                          <span className="text-[10px] text-red-500 font-bold flex items-center gap-1.5 pl-1.5">
                            <AlertCircle className="w-3.5 h-3.5" /> {errors.subDistrict}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Specific Address Textarea */}
                    <div className="flex flex-col gap-1">
                      <div className="relative flex items-start">
                        <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                        <textarea
                          ref={fieldRefs.specificAddress}
                          rows="2"
                          placeholder="Specific Address (Street name, House number, Building suite)"
                          value={specificAddress}
                          onChange={(e) => handleInputChange("specificAddress", e.target.value, setSpecificAddress)}
                          className={`w-full text-xs font-semibold pl-11 pr-4 py-3.5 border focus:outline-none transition-all duration-300 rounded-2xl bg-gray-50/60 border-transparent focus:bg-white resize-none focus:ring-4 focus:ring-orange-500/10 text-gray-800 ${errors.specificAddress
                              ? "border-red-500/70 focus:border-red-500 focus:ring-red-500/10 bg-red-50/[0.04]"
                              : "focus:border-gold"
                            }`}
                        />
                      </div>
                      {errors.specificAddress && (
                        <span className="text-[10px] text-red-500 font-bold flex items-center gap-1.5 pl-1.5">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.specificAddress}
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: DISPATCHERS & STICKY SUMMARY (40% width equivalent) */}
            <div className="lg:col-span-5 space-y-6 h-fit sticky top-24">

              {/* 1. PROMO VOUCHER (Sleek Inline Apply Button Layout) */}
              <div className="bg-white rounded-3xl p-5 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100/60">
                <h3 className="text-xs font-black text-gray-800 mb-3 flex items-center gap-2 uppercase tracking-wider">
                  <Ticket className="w-4 h-4 text-gold" />
                  Promo Code / Voucher
                </h3>

                <div className="relative flex items-center bg-gray-50/80 rounded-2xl border border-gray-150 overflow-hidden">
                  <input
                    type="text"
                    placeholder="Enter code (e.g. BOOKHAVEN10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 w-full pl-4 pr-24 py-3 text-xs uppercase tracking-wider font-bold text-gray-850"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="absolute right-2 bg-gray-900 text-white font-black text-[10px] px-4.5 py-1.8 rounded-xl hover:bg-gold transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>

                {appliedCoupon && (
                  <div className="mt-3.5 flex items-center justify-between bg-green-50 text-green-700 px-3.5 py-2.5 rounded-2xl text-[11px] font-bold border border-green-200/50">
                    <span className="flex items-center gap-1.5">
                      <BadgePercent className="w-4 h-4" />
                      Applied: {appliedCoupon}
                    </span>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-red-500 font-bold hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* 2. PAYMENT SELECTIONS (Taller card list with custom bullets & right-aligned SVGs) */}
              <div className="bg-white rounded-3xl p-5 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100/60">
                <h3 className="text-xs font-black text-gray-800 mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <CreditCard className="w-4 h-4 text-gold" />
                  Payment Method
                </h3>

                <div className="space-y-3">
                  {paymentOptions.map((option) => {
                    const isSelected = paymentMethod === option.id;
                    return (
                      <label
                        key={option.id}
                        className={`flex items-center justify-between p-4.5 rounded-2xl border cursor-pointer select-none transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] ${isSelected
                            ? "border-gold bg-gold/[0.02] shadow-[0_4px_16px_rgba(201,162,39,0.06)]"
                            : "border-gray-150 bg-white hover:border-gray-350 hover:shadow-2xs text-gray-700"
                          }`}
                      >
                        <div className="flex items-center gap-3.5">
                          {/* Hidden input */}
                          <input
                            type="radio"
                            name="payment"
                            value={option.id}
                            checked={isSelected}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="sr-only"
                          />

                          {/* Custom Radio dot */}
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200 ${isSelected ? "border-gold bg-white" : "border-gray-300 bg-white"}`}
                          >
                            {isSelected && (
                              <div className="w-2.5 h-2.5 rounded-full bg-gold animate-scale-up" />
                            )}
                          </div>

                          <span className={`text-[13px] tracking-wide transition-colors ${isSelected ? "font-black text-gray-900" : "font-semibold text-gray-500"
                            }`}>
                            {option.name}
                          </span>
                        </div>

                        {/* Logo SVGs align right */}
                        <div className="shrink-0 flex items-center justify-center">
                          {option.icon}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 3. ORDER SUMMARY & Star proceed button */}
              <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100/60 space-y-6">
                <h2 className="text-base font-black text-gray-900 uppercase tracking-tight">Order Summary</h2>

                <div className="space-y-4 text-xs font-bold text-gray-500">
                  <div className="flex justify-between items-center">
                    <span>Subtotal</span>
                    <span className="text-gray-900 font-extrabold text-sm">${subtotalPrice.toFixed(2)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-green-600">
                      <span>Discount</span>
                      <span className="font-extrabold text-sm">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span>Shipping</span>
                    <span className="text-green-600 font-black tracking-wide text-xs">Free Delivery</span>
                  </div>

                  <hr className="border-gray-50" />

                  <div className="flex justify-between items-baseline pt-2">
                    <span className="text-gray-900 font-black">Total Due</span>
                    <span className="text-3xl font-black text-gray-900 tracking-tight">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Stars Action Checkout Button */}
                <motion.button
                  onClick={handleCheckoutSubmit}
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="w-full bg-cta-gradient hover:bg-cta-gradient-hover text-white font-black text-sm py-4.5 rounded-2xl shadow-lg shadow-gold/25 hover:shadow-gold/40 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 group"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </motion.button>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-gray-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>SSL Secured & Database Encrypted Checkout</span>
              </div>

            </div>

          </div>
        )}
      </div>
    </motion.div>
  );
}
