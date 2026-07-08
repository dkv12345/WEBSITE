import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lock, CreditCard, ArrowLeft, ArrowRight, ShieldCheck, 
  Tag, Info, CheckCircle, User, Calendar, AlertCircle, 
  Check, QrCode, Truck, Copy, CheckSquare, Landmark, 
  MapPin, Phone, HelpCircle 
} from "lucide-react";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state } = useLocation();

  // Route parameters or routing state fallbacks
  const mockMode = searchParams.get("mock_mode") === "true";
  const stateShipping = state?.shippingDetails;
  const statePaymentMethod = state?.paymentMethod || "banking";
  const stateTotal = state?.totalAmount || 0;

  // Invoice / Reference fields
  const [refCode] = useState(() => `BH-${Math.floor(100000 + Math.random() * 900000)}`);
  const [copiedField, setCopiedField] = useState("");

  // Card Form states
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  
  // UI animation and logic states
  const [isFlipped, setIsFlipped] = useState(false);
  const [step, setStep] = useState("form"); // form -> processing -> success
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Auto-format card number (adds spaces every 4 digits)
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(" ") || "";
    setCardNumber(formatted);
  };

  // Auto-format expiry date (MM/YY)
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 2) {
      setCardExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else {
      setCardExpiry(value);
    }
  };

  // Auto-format CVV (up to 3 digits)
  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 3) value = value.slice(0, 3);
    setCardCvv(value);
  };

  // Clipboard copy helper
  const handleCopyText = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(""), 2000);
  };

  // API Call to place the order in the database
  const submitOrderToDatabase = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch("/api/cart/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingDetails: stateShipping || {
            name: "Guest Account",
            phone: "0900000000",
            address: {
              country: "Vietnam",
              city: "HCMC",
              subDistrict: "District 1",
              specificAddress: "123 Main St",
              formatted: "123 Main St, District 1, HCMC, Vietnam"
            },
            estimatedDelivery: "3-5 days"
          },
          paymentMethod: statePaymentMethod,
          couponApplied: state?.couponApplied || null,
          totalAmount: stateTotal
        }),
        credentials: "include"
      });

      const result = await response.json();
      if (result.success) {
        setStep("success");
      } else {
        setErrorMessage(result.message || "Checkout failed on the database server.");
        setStep("form");
      }
    } catch (err) {
      console.error("Order submission failure:", err);
      setErrorMessage("Could not connect to the database checkout service.");
      setStep("form");
    } finally {
      setLoading(false);
    }
  };

  // Pay button handler for Visa / Mastercard
  const handleCreditCardPay = (e) => {
    e.preventDefault();
    if (!cardName || !cardNumber || !cardExpiry || !cardCvv) {
      setErrorMessage("Please complete all credit card fields.");
      return;
    }
    triggerPaymentAnimation();
  };

  // Triggers secure glowing processing transition
  const triggerPaymentAnimation = async () => {
    setStep("processing");
    setErrorMessage("");
    // 2.2 seconds simulated security check/handshake delay
    await new Promise(r => setTimeout(r, 2200));
    await submitOrderToDatabase();
  };

  return (
    <div className="min-h-screen bg-parchment text-ink font-sans flex flex-col justify-center items-center py-10 px-4">
      
      {/* Cancel button */}
      {step === "form" && (
        <button 
          onClick={() => navigate("/cart")}
          className="absolute top-6 left-6 flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel & Back to Cart</span>
        </button>
      )}

      {/* Main Container Card */}
      <motion.div 
        layout
        className="max-w-4xl w-full bg-white rounded-3xl border border-gray-100 shadow-2xl p-8 md:p-10 overflow-hidden relative"
      >
        <AnimatePresence mode="wait">
          
          {step === "form" && (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Checkout Progress Wizard */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm tracking-tight text-gray-900">BOOKHAVEN</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded">CHECKOUT</span>
                </div>
                
                <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400">
                  <div className="flex items-center gap-1 text-green-500">
                    <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-[9px]"><Check className="w-2.5 h-2.5" /></div>
                    <span>Main page</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-500">
                    <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-[9px]"><Check className="w-2.5 h-2.5" /></div>
                    <span>Shipping details</span>
                  </div>
                  <div className="flex items-center gap-1 text-gold border-b-2 border-gold pb-1 font-cinzel-lbl">
                    <div className="w-4 h-4 rounded-full bg-gold/10 flex items-center justify-center text-[9px] text-gold">3</div>
                    <span>Payment method</span>
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="text-xs text-red-500 font-bold bg-red-50 p-3 rounded-xl border border-red-100 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* =========================================================================
                  OPTION 1: VISA / MASTERCARD / JCB / PAYPAL GATEWAY (Flipping Card View)
                  ========================================================================= */}
              {(statePaymentMethod === "visa_master" || statePaymentMethod === "paypal") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
                  
                  {/* Left Column: 3D Credit Card */}
                  <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="perspective-1000 w-full max-w-[320px] h-[200px] relative">
                      <motion.div 
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="w-full h-full preserve-3d relative cursor-pointer"
                        onClick={() => setIsFlipped(!isFlipped)}
                      >
                        {/* Front Face */}
                        <div className="absolute inset-0 backface-hidden w-full h-full rounded-2xl bg-gradient-to-tr from-[#1E293B] via-[#0F172A] to-[#1E293B] text-white p-6 flex flex-col justify-between shadow-lg border border-white/10">
                          <div className="flex justify-between items-start">
                            <div className="w-10 h-7 bg-amber-400/80 rounded-md opacity-85 shadow-inner" />
                            <span className="font-extrabold text-[10px] opacity-80 tracking-widest text-gray-400">PLATINUM</span>
                          </div>
                          <div className="text-base font-mono tracking-widest py-3 text-center">
                            {cardNumber || "•••• •••• •••• ••••"}
                          </div>
                          <div className="flex justify-between text-[10px] tracking-wider">
                            <div className="min-w-0 pr-4">
                              <p className="text-[8px] text-gray-400 uppercase">Card Holder</p>
                              <p className="font-bold truncate uppercase">{cardName || "YOUR NAME"}</p>
                            </div>
                            <div className="shrink-0 text-right">
                              <p className="text-[8px] text-gray-400 uppercase">Expires</p>
                              <p className="font-bold">{cardExpiry || "MM/YY"}</p>
                            </div>
                            <div className="shrink-0 pl-4 flex items-end">
                              <span className="font-black italic text-sm text-white/90">
                                {statePaymentMethod === "paypal" ? "PayPal" : "VISA"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Back Face */}
                        <div className="absolute inset-0 backface-hidden w-full h-full rounded-2xl bg-gradient-to-tr from-[#0F172A] to-[#1E293B] text-white rotate-y-180 p-6 flex flex-col justify-between shadow-lg border border-white/10">
                          <div className="w-full h-10 bg-black absolute left-0 top-6" />
                          <div className="w-full mt-10">
                            <p className="text-[8px] text-gray-400 text-right pr-2">Security Code (CVV)</p>
                            <div className="bg-gray-100 rounded-md h-9 flex items-center justify-end pr-3 mt-1 shadow-inner">
                              <span className="font-mono text-gray-900 font-bold tracking-widest">{cardCvv || "•••"}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-baseline text-[8px] text-gray-400 tracking-wider">
                            <span>PCI-DSS Secured</span>
                            <span className="text-gold font-bold">Secure Gate v2.0</span>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 bg-green-50 border border-green-100 text-green-700 text-[9px] font-bold px-2 py-1 rounded-full">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>256-Bit SSL Encrypted</span>
                      </div>
                      <div className="flex items-center gap-1 bg-blue-50 border border-blue-100 text-blue-700 text-[9px] font-bold px-2 py-1 rounded-full">
                        <Lock className="w-3 h-3" />
                        <span>PCI-DSS Compliant</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Card form */}
                  <form onSubmit={handleCreditCardPay} className="space-y-5">
                    <div className="space-y-1">
                      <h2 className="text-lg font-black tracking-tight">Credit Card Payment</h2>
                      <p className="text-xs text-gray-400">Fill in card credentials to complete transaction.</p>
                    </div>

                    <div className="space-y-3.5 text-xs font-bold">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-gray-500">CARDHOLDER NAME</label>
                        <div className="relative flex items-center">
                          <User className="w-4 h-4 absolute left-3 text-gray-400" />
                          <input 
                            type="text" 
                            placeholder="e.g. CODEXR"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className="w-full border border-gray-200/80 rounded-xl py-3 pl-10 pr-3 focus:outline-none focus:border-gold bg-gray-50/20 text-gray-800"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-gray-500">CARD NUMBER</label>
                        <div className="relative flex items-center">
                          <CreditCard className="w-4 h-4 absolute left-3 text-gray-400" />
                          <input 
                            type="text" 
                            placeholder="e.g. 4535 3453 4534 5435"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            className="w-full border border-gray-200/80 rounded-xl py-3 pl-10 pr-12 focus:outline-none focus:border-gold bg-gray-50/20 font-mono tracking-wider text-gray-800"
                          />
                          <span className="absolute right-3 font-bold italic text-blue-600 text-[10px]">
                            {statePaymentMethod === "paypal" ? "PayPal" : "VISA"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="space-y-1.5 flex-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Expiry</label>
                        <div className="relative">
                          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-450 z-10"><Calendar className="w-4 h-4" /></div>
                          <input
                            type="text"
                            name="expiry"
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={handleExpiryChange}
                            maxLength="5"
                            required
                            className="w-full border border-gray-200/80 rounded-xl py-3 pl-10 pr-3 focus:outline-none focus:border-gold bg-gray-50/20 font-mono text-gray-800"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 flex-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">CVC</label>
                        <div className="relative">
                          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-450 z-10"><Lock className="w-4 h-4" /></div>
                          <input
                            type="text"
                            name="cvc"
                            placeholder="123"
                            value={cardCvv}
                            onChange={handleCvvChange}
                            onFocus={() => setIsFlipped(true)}
                            onBlur={() => setIsFlipped(false)}
                            maxLength="4"
                            required
                            className="w-full border border-gray-200/80 rounded-xl py-3 pl-10 pr-3 focus:outline-none focus:border-gold bg-gray-50/20 font-mono text-gray-800"
                          />
                        </div>
                      </div>
                    </div>

                      <div className="bg-gray-50 border border-gray-200/50 rounded-2xl p-4 flex items-center justify-between mt-4">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">Payment amount:</span>
                        <span className="text-xl font-black text-gold">${stateTotal.toFixed(2)}</span>
                      </div>

                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="w-full bg-cta-gradient hover:bg-cta-gradient-hover text-white font-extrabold py-4 rounded-xl transition-all shadow-lg shadow-gold/10 cursor-pointer flex items-center justify-center gap-2 mt-4"
                      >
                      <span>PAY ${stateTotal.toFixed(2)} NOW</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </form>
                </div>
              )}

              {/* =========================================================================
                  OPTION 2: BANK TRANSFER / QR PAY VIEW (QR Scanner Scanning Animation)
                  ========================================================================= */}
              {statePaymentMethod === "banking" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
                  
                  {/* Left Column: QR Scan visual card with neon scanner beam */}
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative bg-white p-5 rounded-3xl border border-gray-150 shadow-md w-60 h-60 flex flex-col items-center justify-center overflow-hidden group">
                      
                      {/* Scanning Line Animation */}
                      <motion.div 
                        animate={{ top: ["0%", "100%", "0%"] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-0.5 bg-gold shadow-[0_0_8px_var(--color-gold)] z-20 pointer-events-none"
                      />

                      {/* Icon representing standard QR */}
                      <QrCode className="w-full h-full text-gray-800 opacity-90 transition-transform duration-300 group-hover:scale-98" />
                    </div>
                    
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                      Scan QR with mobile banking app
                    </p>
                  </div>

                  {/* Right Column: Invoice Details & Copy Elements */}
                  <div className="space-y-5">
                    <div className="space-y-1">
                      <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                        <Landmark className="w-5 h-5 text-gold" />
                        Bank Transfer
                      </h2>
                      <p className="text-xs text-gray-400">Transfer exactly the invoice total below to verify.</p>
                    </div>

                    <div className="space-y-3.5 text-xs text-gray-800">
                      
                      {/* Account Holder */}
                      <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                        <span className="font-bold text-gray-400">BENEFICIARY:</span>
                        <span className="font-black text-gray-900">BOOKHAVEN LLC</span>
                      </div>

                      {/* Bank Name */}
                      <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                        <span className="font-bold text-gray-400">BANK:</span>
                        <span className="font-black text-gray-900">Global Tech Bank (GTB)</span>
                      </div>

                      {/* Account Number with Copy trigger */}
                      <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                        <span className="font-bold text-gray-400">ACCOUNT NUMBER:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-gray-900 font-mono">1903 4567 8910</span>
                          <button 
                            onClick={() => handleCopyText("190345678910", "acct")}
                            className="text-gray-400 hover:text-gold cursor-pointer"
                            title="Copy Account Number"
                          >
                            {copiedField === "acct" ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Reference Code with Copy trigger */}
                      <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                        <span className="font-bold text-gray-400">REFERENCE MEMO:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-emerald-600 font-mono uppercase tracking-wider">{refCode}</span>
                          <button 
                            onClick={() => handleCopyText(refCode, "ref")}
                            className="text-gray-400 hover:text-gold cursor-pointer"
                            title="Copy Memo"
                          >
                            {copiedField === "ref" ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Exact Transfer Amount */}
                      <div className="bg-gray-50 border border-gray-150 rounded-2xl p-4 flex items-center justify-between mt-2">
                        <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Total Amount:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-black text-gold">${stateTotal.toFixed(2)}</span>
                          <button 
                            onClick={() => handleCopyText(stateTotal.toFixed(2), "amt")}
                            className="text-gray-400 hover:text-gold cursor-pointer"
                            title="Copy Amount"
                          >
                            {copiedField === "amt" ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Action button */}
                    <button 
                      onClick={triggerPaymentAnimation}
                      className="w-full bg-[#F16323] hover:bg-orange-600 text-white font-extrabold py-4 rounded-xl transition-all shadow-lg shadow-orange-500/10 cursor-pointer active:scale-98 flex items-center justify-center gap-2 mt-4"
                    >
                      <span>CONFIRM QR TRANSFER</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  OPTION 3: CASH ON DELIVERY (COD) VIEW (Truck delivery Route tracker)
                  ========================================================================= */}
              {statePaymentMethod === "cod" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
                  
                  {/* Left Column: Interactive tracking route visual */}
                  <div className="bg-gray-50/80 rounded-3xl border border-gray-150 p-6 space-y-6">
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">
                      Estimated Order Path
                    </h3>

                    {/* visual route timeline */}
                    <div className="space-y-5 text-xs">
                      
                      {/* Step 1 */}
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">Order Dispatched</p>
                          <p className="text-[10px] text-gray-400">Locked in database index</p>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-gold/10 text-gold flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                          <Truck className="w-3 h-3" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">Courier Shipping</p>
                          <p className="text-[10px] text-gray-400">Estimated delivery: {stateShipping?.estimatedDelivery || "3-5 days"}</p>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="flex items-start gap-3 opacity-55">
                        <div className="w-5 h-5 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center shrink-0 mt-0.5">
                          <MapPin className="w-3 h-3" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-850">Your Destination</p>
                          <p className="text-[10px]">Inspect package & pay cash upon arrival</p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Right Column: Address and COD confirmation details */}
                  <div className="space-y-5">
                    <div className="space-y-1">
                      <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                        <Truck className="w-5 h-5 text-gold" />
                        Cash on Delivery
                      </h2>
                      <p className="text-xs text-gray-400">Confirm delivery address details below.</p>
                    </div>

                    <div className="space-y-3.5 text-xs text-gray-800">
                      
                      {/* Recipient */}
                      <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                        <span className="font-bold text-gray-400">RECIPIENT Name:</span>
                        <span className="font-black text-gray-900">{stateShipping?.name || "N/A"}</span>
                      </div>

                      {/* Phone */}
                      <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                        <span className="font-bold text-gray-400">PHONE:</span>
                        <span className="font-black text-gray-900">{stateShipping?.phone || "N/A"}</span>
                      </div>

                      {/* Address */}
                      <div className="flex items-start justify-between border-b border-gray-50 pb-2 gap-4">
                        <span className="font-bold text-gray-400 shrink-0">DELIVERY ADDRESS:</span>
                        <span className="font-black text-gray-900 text-right leading-relaxed max-w-[200px] break-words">
                          {stateShipping?.address?.formatted || "N/A"}
                        </span>
                      </div>

                      {/* Total COD */}
                      <div className="bg-gray-50 border border-gray-150 rounded-2xl p-4 flex items-center justify-between mt-2">
                        <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">COD Amount Due:</span>
                        <span className="text-xl font-black text-[#F16323]">${stateTotal.toFixed(2)}</span>
                      </div>

                    </div>

                    {/* Action button */}
                    <button 
                      onClick={triggerPaymentAnimation}
                      className="w-full bg-[#F16323] hover:bg-orange-600 text-white font-extrabold py-4 rounded-xl transition-all shadow-lg shadow-orange-500/10 cursor-pointer active:scale-98 flex items-center justify-center gap-2 mt-4"
                    >
                      <span>PLACE ORDER (COD)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          )}

          {step === "processing" && (
            /* PHASE 2: GLOWING SECURE HANDSHAKE LOADER */
            <motion.div 
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 flex flex-col items-center justify-center text-center space-y-8 animate-fade-in"
            >
              <motion.div 
                animate={{ 
                  y: [0, -8, 0],
                  scale: [1, 1.02, 1]
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-20 h-20 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shadow-[0_20px_50px_rgba(201,162,39,0.15)]"
              >
                <Lock className="w-8 h-8 animate-pulse" />
              </motion.div>

              <div className="space-y-2">
                <h3 className="text-base font-black text-gray-900 tracking-tight">Securing Your Order...</h3>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">
                  Updating stock logs and creating pending invoices securely. Do not close this browser.
                </p>
              </div>
            </motion.div>
          )}

          {step === "success" && (
            /* PHASE 3: PAYMENT APPROVED / ORDER PLACED SUCCESS */
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10 space-y-6 max-w-md mx-auto"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto animate-scale-up" strokeWidth={1.5} />
              
              <div className="space-y-2">
                <h1 className="text-2xl font-black text-gray-900">Order Placed Successfully!</h1>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Thank you for shopping with BookHaven! Your order status has updated to paid, the cart is converted, and delivery preparations have initiated.
                </p>
                <div className="bg-gray-50 border border-gray-150 p-4 rounded-2xl text-left text-xs space-y-1.5 mt-4">
                  <div><span className="font-bold text-gray-400 inline-block w-28">Order Reference:</span> <span className="font-mono text-gray-800 font-bold uppercase">{refCode}</span></div>
                  <div><span className="font-bold text-gray-400 inline-block w-28">Estimated Delivery:</span> <span className="text-emerald-600 font-bold">{stateShipping?.estimatedDelivery || "3-5 days"}</span></div>
                  <div><span className="font-bold text-gray-400 inline-block w-28">Payment Mode:</span> <span className="text-gray-800 font-bold uppercase">{statePaymentMethod}</span></div>
                  <div><span className="font-bold text-gray-400 inline-block w-28 font-cinzel-lbl text-[10px]">Amount Paid:</span> <span className="text-gold font-black font-mono">${stateTotal.toFixed(2)}</span></div>
                </div>
              </div>

              <motion.button
                onClick={() => navigate("/mainwebpage")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="w-full bg-cta-gradient hover:bg-cta-gradient-hover text-white font-extrabold py-3.5 rounded-xl transition-all shadow-md cursor-pointer"
              >
                Go to Homepage
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
}
