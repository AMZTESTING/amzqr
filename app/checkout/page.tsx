"use client";

import { useEffect, useState } from "react";
import {
  CreditCard,
  Wallet,
  Apple,
  Smartphone,

} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {

  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState<any>(null);
  
  const [cart, setCart] = useState<any[]>([]);

  // ORDER MODE
  const [orderMode, setOrderMode] = useState("dinein");

  // FORM
  const [table, setTable] = useState("");
  const [name, setName] = useState("");

  // PHONE
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+968");

  // CAR ORDER
  const [carCustomerName, setCarCustomerName] = useState("");
  const [carNumber, setCarNumber] = useState("");
  const [carModel, setCarModel] = useState("");

  // GIFT
  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [senderCountryCode, setSenderCountryCode] = useState("+968");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [receiverCountryCode, setReceiverCountryCode] = useState("+968");
  const [showName, setShowName] = useState("Yes");
  const [giftMessage, setGiftMessage] = useState("");

  // SPECIAL REQUEST
  const [specialRequest, setSpecialRequest] = useState("");

  // DISCOUNT
  const [discount, setDiscount] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountError, setDiscountError] = useState("");

  // PAYMENT
  const [paymentMethod, setPaymentMethod] = useState("cash");

  // ERROR & LOADING
  const [errorMessage, setErrorMessage] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {

    const saved = localStorage.getItem("cart");

    if (saved) {
      setCart(JSON.parse(saved));
    }

    const mode = localStorage.getItem("orderMode");

    if (mode) {
      setOrderMode(mode);
    }

  }, []);

  // TOTAL
  const subtotal = cart.reduce(
    (sum, item) =>
      sum + parseInt(item.price) * item.qty,
    0
  );

  const discountAmount = discountApplied
    ? Math.round(subtotal * 0.1)
    : 0;

  const total = subtotal - discountAmount;

  // DISCOUNT
  const applyDiscount = () => {

    if (discount.toLowerCase() === "coffee10") {

      setDiscountApplied(true);
      setDiscountError("");

    } else {

      setDiscountApplied(false);
      setDiscountError("Invalid discount code");

    }

  };

  // VALIDATION FUNCTION
  const validateForm = () => {
    
    setErrorMessage("");

    // DINE IN VALIDATION
    if (orderMode === "dinein") {
      
      if (!table.trim()) {
        setErrorMessage("Please select a table");
        return false;
      }

      if (!name.trim()) {
        setErrorMessage("Please enter your name");
        return false;
      }

      if (!phone.trim()) {
        setErrorMessage("Please enter your phone number");
        return false;
      }

      // Check phone length (minimum 7 digits)
      if (phone.replace(/\s/g, "").length < 7) {
        setErrorMessage("Please enter a valid phone number");
        return false;
      }

    }

    // CAR ORDER VALIDATION
    if (orderMode === "car") {

      if (!carCustomerName.trim()) {
        setErrorMessage("Please enter customer name");
        return false;
      }

      if (!carNumber.trim()) {
        setErrorMessage("Please enter car number");
        return false;
      }

      if (!carModel.trim()) {
        setErrorMessage("Please enter car model");
        return false;
      }

      if (!phone.trim()) {
        setErrorMessage("Please enter your phone number");
        return false;
      }

      if (phone.replace(/\s/g, "").length < 7) {
        setErrorMessage("Please enter a valid phone number");
        return false;
      }

    }

    // GIFT VALIDATION
    if (orderMode === "gift") {

      if (!senderName.trim()) {
        setErrorMessage("Please enter sender name");
        return false;
      }

      if (!receiverName.trim()) {
        setErrorMessage("Please enter receiver name");
        return false;
      }

      if (!senderPhone.trim()) {
        setErrorMessage("Please enter sender phone number");
        return false;
      }

      if (senderPhone.replace(/\s/g, "").length < 7) {
        setErrorMessage("Please enter a valid sender phone number");
        return false;
      }

      if (!receiverPhone.trim()) {
        setErrorMessage("Please enter receiver phone number");
        return false;
      }

      if (receiverPhone.replace(/\s/g, "").length < 7) {
        setErrorMessage("Please enter a valid receiver phone number");
        return false;
      }

    }

    return true;
  };

  // PLACE ORDER FUNCTION
  const placeOrder = async () => {

    // Validate first
    if (!validateForm()) {
      return;
    }

    // Start loading
    setIsPlacingOrder(true);

    try {
      
      // Prepare order data
      const orderData: any = {
        order_mode: orderMode,
        cart: cart,
        subtotal: subtotal,
        discount_amount: discountAmount,
        total: total,
        payment_method: paymentMethod,
        special_request: specialRequest || null,
        status: 'pending',
      };

      // Add mode-specific data
      if (orderMode === "dinein") {
        orderData.customer_name = name;
        orderData.phone = `${countryCode}${phone}`;
        orderData.table_number = table;
      }

      if (orderMode === "car") {
        orderData.customer_name = carCustomerName;
        orderData.phone = `${countryCode}${phone}`;
        orderData.car_number = carNumber;
        orderData.car_model = carModel;
      }

      if (orderMode === "gift") {
        orderData.sender_name = senderName;
        orderData.receiver_name = receiverName;
        orderData.sender_phone = `${senderCountryCode}${senderPhone}`;
        orderData.receiver_phone = `${receiverCountryCode}${receiverPhone}`;
        orderData.show_name = showName;
        orderData.gift_message = giftMessage || null;
      }

      // Send to Supabase
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select();

      if (error) throw error;

      console.log("✅ Order placed successfully:", data);

      // Success
      const messages = [
  { emoji: "☕", title: "Small Moment, Big Joy", subtitle: "You just supported a small coffee moment", color: "#C08552" },
  { emoji: "🌟", title: "Brewed with Love", subtitle: "Your order is being crafted with care", color: "#8d5d37" },
  { emoji: "🫘", title: "Good Vibes Incoming", subtitle: "Happiness is brewing just for you", color: "#b07b4f" },
  { emoji: "🎉", title: "Made with Passion", subtitle: "Every sip tells a story", color: "#6f4e37" },
  { emoji: "💫", title: "Magic in the Making", subtitle: "Your perfect cup is on its way", color: "#C08552" },
];

const random = messages[Math.floor(Math.random() * messages.length)];
setSuccessMessage({ ...random, orderId: data[0].id });

      // Clear cart
      localStorage.removeItem("cart");
      setCart([]);

      // Reset all fields
      setTable("");
      setName("");
      setPhone("");
      setCarCustomerName("");
      setCarNumber("");
      setCarModel("");
      setSenderName("");
      setReceiverName("");
      setSenderPhone("");
      setReceiverPhone("");
      setGiftMessage("");
      setSpecialRequest("");
      setDiscount("");
      setDiscountApplied(false);
      setDiscountError("");
      setErrorMessage("");

    } catch (error: any) {

      console.error("❌ Error placing order:", error);
      setErrorMessage("Failed to place order. Please try again.");

    } finally {

      setIsPlacingOrder(false);

    }

  };

  return (
    <main className="min-h-screen bg-[#F3E9DC] p-4 md:p-8">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-6">
          Checkout
        </h1>

        {cart.length === 0 ? (

          <div className="bg-white p-6 rounded-2xl text-center shadow-md">

            <p className="text-black/60">
              Your cart is empty
            </p>

          </div>

        ) : (

          <div className="space-y-6">

            {/* ERROR MESSAGE */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-2xl flex items-center gap-3">
                <span className="text-xl">⚠️</span>
                <span className="font-medium">{errorMessage}</span>
                <button 
                  onClick={() => setErrorMessage("")}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            )}

            {/* YOUR CART */}
            <div>

              <h2 className="text-2xl font-bold mb-4">
                Your Cart
              </h2>

              <div className="space-y-4">

                {cart.map((item: any, index: number) => (

                  <div
                    key={`${item.id}-${index}`}
                    className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4"
                  >

                    {/* IMAGE */}
                    <img
                      src={item.image}
                      className="w-24 h-24 object-cover rounded-2xl"
                      alt={item.name}
                    />

                    {/* INFO */}
                    <div className="flex-1">

                      <p className="font-bold text-lg">
                        {item.name}
                      </p>

                      <p className="text-[#C08552] font-semibold mt-1">
                        {parseInt(item.price) * item.qty} AED
                      </p>

                      {/* QTY */}
                      <div className="flex items-center gap-3 mt-3">

                        <button
                          onClick={() => {

                            const updated = cart
                              .map((p: any) =>
                                p.id === item.id
                                  ? {
                                      ...p,
                                      qty: p.qty - 1,
                                    }
                                  : p
                              )
                              .filter((p: any) => p.qty > 0);

                            setCart(updated);

                            localStorage.setItem(
                              "cart",
                              JSON.stringify(updated)
                            );

                          }}
                          className="w-8 h-8 bg-[#F3E9DC] rounded-lg"
                        >
                          -
                        </button>

                        <span className="font-bold">
                          {item.qty}
                        </span>

                        <button
                          onClick={() => {

                            const updated = cart.map((p: any) =>
                              p.id === item.id
                                ? {
                                    ...p,
                                    qty: p.qty + 1,
                                  }
                                : p
                            );

                            setCart(updated);

                            localStorage.setItem(
                              "cart",
                              JSON.stringify(updated)
                            );

                          }}
                          className="w-8 h-8 bg-[#F3E9DC] rounded-lg"
                        >
                          +
                        </button>

                      </div>

                    </div>

                    {/* DELETE */}
                    <button
                      onClick={() => {

                        const updated = cart.filter(
                          (p: any) => p.id !== item.id
                        );

                        setCart(updated);

                        localStorage.setItem(
                          "cart",
                          JSON.stringify(updated)
                        );

                      }}
                      className="text-red-500 text-xl"
                    >
                      ✕
                    </button>

                  </div>

                ))}

              </div>

            </div>

            {/* SPECIAL REQUEST */}
            <div className="bg-white p-4 rounded-2xl shadow-md">

              <label className="font-semibold">
                Any special requests?
              </label>

              <textarea
                value={specialRequest}
                onChange={(e) =>
                  setSpecialRequest(e.target.value)
                }
                placeholder="Write here..."
                className="w-full mt-2 border rounded-xl p-3 min-h-[120px]"
              />

            </div>

            {/* FORM */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

              {/* DINE IN */}
              {orderMode === "dinein" && (
                <>
                  <div className="bg-white p-4 rounded-2xl shadow-md">

                    <label className="font-semibold">
                      Table <span className="text-red-500">*</span>
                    </label>

                    <select
                      value={table}
                      onChange={(e) =>
                        setTable(e.target.value)
                      }
                      className="w-full mt-2 border rounded-xl p-3"
                    >

                      <option value="">
                        Select table
                      </option>

                      {[1,2,3,4,5,6,7,8].map((t) => (
                        <option key={t} value={`Table ${t}`}>
                          Table {t}
                        </option>
                      ))}

                    </select>

                  </div>

                  <div className="bg-white p-4 rounded-2xl shadow-md">

                    <label className="font-semibold">
                      Name <span className="text-red-500">*</span>
                    </label>

                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full mt-2 border rounded-xl p-3"
                    />

                  </div>
                </>
              )}

              {/* CAR ORDER */}
              {orderMode === "car" && (
                <>
                  <div className="bg-white p-4 rounded-2xl shadow-md">

                    <label className="font-semibold">
                      Customer Name <span className="text-red-500">*</span>
                    </label>

                    <input
                      value={carCustomerName}
                      onChange={(e) => setCarCustomerName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full mt-2 border rounded-xl p-3"
                    />

                  </div>

                  <div className="bg-white p-4 rounded-2xl shadow-md">

                    <label className="font-semibold">
                      Car Number <span className="text-red-500">*</span>
                    </label>

                    <input
                      value={carNumber}
                      onChange={(e) => setCarNumber(e.target.value)}
                      placeholder="1234"
                      className="w-full mt-2 border rounded-xl p-3"
                    />

                  </div>

                  <div className="bg-white p-4 rounded-2xl shadow-md">

                    <label className="font-semibold">
                      Car Model <span className="text-red-500">*</span>
                    </label>

                    <input
                      value={carModel}
                      onChange={(e) => setCarModel(e.target.value)}
                      placeholder="BMW"
                      className="w-full mt-2 border rounded-xl p-3"
                    />

                  </div>
                </>
              )}

              {/* GIFT */}
              {orderMode === "gift" && (
                <>
                  <div className="bg-white p-4 rounded-2xl shadow-md">

                    <label className="font-semibold">
                      Sender Name <span className="text-red-500">*</span>
                    </label>

                    <input
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full mt-2 border rounded-xl p-3"
                    />

                  </div>

                  <div className="bg-white p-4 rounded-2xl shadow-md">

                    <label className="font-semibold">
                      Receiver Name <span className="text-red-500">*</span>
                    </label>

                    <input
                      value={receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                      placeholder="Receiver Name"
                      className="w-full mt-2 border rounded-xl p-3"
                    />

                  </div>

                  {/* SENDER PHONE */}
                  <div className="bg-white p-4 rounded-2xl shadow-md">

                    <label className="font-semibold">
                      Sender Phone Number <span className="text-red-500">*</span>
                    </label>

                    <div className="flex mt-2">

                      <select
                        value={senderCountryCode}
                        onChange={(e) =>
                          setSenderCountryCode(e.target.value)
                        }
                        className="border rounded-l-xl p-3"
                      >

                        <option value="+968">
                          🇴🇲 +968
                        </option>

                        <option value="+971">
                          🇦🇪 +971
                        </option>

                        <option value="+966">
                          🇸🇦 +966
                        </option>

                      </select>

                      <input
                        value={senderPhone}
                        onChange={(e) =>
                          setSenderPhone(e.target.value)
                        }
                        placeholder="Number"
                        className="w-full border-t border-b border-r rounded-r-xl p-3"
                      />

                    </div>

                  </div>

                  {/* RECEIVER PHONE */}
                  <div className="bg-white p-4 rounded-2xl shadow-md">

                    <label className="font-semibold">
                      Receiver Phone Number <span className="text-red-500">*</span>
                    </label>

                    <div className="flex mt-2">

                      <select
                        value={receiverCountryCode}
                        onChange={(e) =>
                          setReceiverCountryCode(e.target.value)
                        }
                        className="border rounded-l-xl p-3"
                      >

                        <option value="+968">
                          🇴🇲 +968
                        </option>

                        <option value="+971">
                          🇦🇪 +971
                        </option>

                        <option value="+966">
                          🇸🇦 +966
                        </option>

                      </select>

                      <input
                        value={receiverPhone}
                        onChange={(e) =>
                          setReceiverPhone(e.target.value)
                        }
                        placeholder="Number"
                        className="w-full border-t border-b border-r rounded-r-xl p-3"
                      />

                    </div>

                  </div>

                  <div className="bg-white p-4 rounded-2xl shadow-md">

                    <label className="font-semibold">
                      Show your name
                    </label>

                    <select 
                      value={showName}
                      onChange={(e) => setShowName(e.target.value)}
                      className="w-full mt-2 border rounded-xl p-3"
                    >
                      <option value="Yes">
                        Yes
                      </option>

                      <option value="No">
                        No
                      </option>
                    </select>

                  </div>

                  <div className="bg-white p-4 rounded-2xl shadow-md">

                    <label className="font-semibold">
                      Add a message
                    </label>

                    <textarea
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      placeholder="Write your message..."
                      className="w-full mt-2 border rounded-xl p-3 min-h-[120px]"
                    />

                  </div>
                </>
              )}

              {/* PHONE (Dine-in and Car only) */}
              {(orderMode === "dinein" || orderMode === "car") && (
                <div className="bg-white p-4 rounded-2xl shadow-md">

                  <label className="font-semibold">
                    Phone Number <span className="text-red-500">*</span>
                  </label>

                  <div className="flex mt-2">

                    <select
                      value={countryCode}
                      onChange={(e) =>
                        setCountryCode(e.target.value)
                      }
                      className="border rounded-l-xl p-3"
                    >

                      <option value="+968">
                        🇴🇲 +968
                      </option>

                      <option value="+971">
                        🇦🇪 +971
                      </option>

                      <option value="+966">
                        🇸🇦 +966
                      </option>

                    </select>

                    <input
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value)
                      }
                      placeholder="Number"
                      className="w-full border-t border-b border-r rounded-r-xl p-3"
                    />

                  </div>

                </div>
              )}

              {/* DISCOUNT */}
              <div className="bg-white p-4 rounded-2xl shadow-md">

                <label className="font-semibold">
                  Discount Code
                </label>

                <div className="flex gap-2 mt-2">

                  <input
                    value={discount}
                    onChange={(e) =>
                      setDiscount(e.target.value)
                    }
                    placeholder="Enter code"
                    className="flex-1 border rounded-xl p-3"
                  />

                  <button
                    onClick={applyDiscount}
                    className="bg-[#C08552] text-white px-4 rounded-xl"
                  >
                    Apply
                  </button>

                </div>

                {discountError && (
                  <p className="text-red-500 text-sm mt-2">
                    {discountError}
                  </p>
                )}

                {discountApplied && (
                  <p className="text-green-600 text-sm mt-2">
                    ✅ 10% discount applied!
                  </p>
                )}

              </div>

            </div>

            {/* PAYMENT */}
            <div className="bg-white p-5 rounded-2xl shadow-md">

              <h2 className="text-lg font-bold mb-4">
                Payment Method
              </h2>

              <div className="grid grid-cols-2 gap-3">

                {/* CASH */}
                <button
                  onClick={() => setPaymentMethod("cash")}
                  className={`border rounded-2xl p-4 flex flex-col items-center gap-2 transition ${
                    paymentMethod === "cash"
                      ? "bg-[#C08552] text-white border-[#C08552]"
                      : "bg-white"
                  }`}
                >
                  <span className="text-2xl">💵</span>
                  <span className="font-medium">Cash</span>
                </button>

                {/* CARD */}
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`border rounded-2xl p-4 flex flex-col items-center gap-2 transition ${
                    paymentMethod === "card"
                      ? "bg-[#C08552] text-white border-[#C08552]"
                      : "bg-white"
                  }`}
                >
                  <span className="text-2xl">💳</span>
                  <span className="font-medium">Card</span>
                </button>

              </div>
            </div>

            {/* ORDER SUMMARY */}
            <div className="bg-white p-5 rounded-2xl shadow-md">

              <h2 className="text-xl font-bold mb-4">
                Order Summary
              </h2>

              <div className="space-y-3">

                <div className="flex justify-between">
                  <span>Sub total</span>

                  <span>
                    {subtotal} AED
                  </span>
                </div>

                {discountApplied && (
                  <div className="flex justify-between">
                    <span>Discount (10%)</span>

                    <span className="text-green-600">
                      -{discountAmount} AED
                    </span>
                  </div>
                )}

                <div className="flex justify-between border-t pt-3 text-lg font-bold">

                  <span>Total</span>

                  <span className="text-[#C08552]">
                    {total} AED
                  </span>

                </div>

              </div>

              <button
                onClick={placeOrder}
                disabled={isPlacingOrder}
                className="w-full mt-5 bg-[#C08552] text-white py-4 rounded-2xl font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPlacingOrder ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    <span>Placing Order...</span>
                  </>
                ) : (
                  "Place Order"
                )}
              </button>

            </div>

          </div>

        )}

      </div>
      {successMessage && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
      
      {/* Header */}
      <div className="text-center mb-4">
        <div className="text-5xl mb-2">{successMessage.emoji}</div>
        <h2 className="text-xl font-bold" style={{ color: successMessage.color }}>
          {successMessage.title}
        </h2>
        <p className="text-gray-500 text-sm mt-1">{successMessage.subtitle}</p>
      </div>

      {/* Receipt Card */}
      <div className="bg-gray-50 rounded-2xl p-4 mb-4">
        {/* Logo & Order # */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#C08552] flex items-center justify-center text-white text-xs font-bold">A</div>
            <span className="font-bold text-sm">AMZQR</span>
          </div>
          <span className="text-xs text-gray-500">#{successMessage.orderId}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-300 my-3" />

        {/* Items */}
        <div className="space-y-2 mb-3">
          {cart.map((item: any) => (
            <div key={item.cartId || item.id} className="flex justify-between text-sm">
              <span className="text-gray-700">
                {item.name}
                {item.sizeLabel && <span className="text-gray-400 text-xs"> ({item.sizeLabel})</span>}
                <span className="text-gray-400"> × {item.qty || 1}</span>
              </span>
              <span className="font-medium">{(parseInt(item.price) || 0) * (item.qty || 1)} AED</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-300 my-3" />

        {/* Totals */}
        <div className="space-y-1 text-sm">
          {discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-{discountAmount} AED</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-base pt-1">
            <span>Total</span>
            <span style={{ color: successMessage.color }}>{total} AED</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
          <span>Payment:</span>
          <span className="font-medium text-gray-700 capitalize">{paymentMethod}</span>
        </div>
      </div>

      {/* Thank You Message */}
      <div className="text-center mb-4">
        <p className="text-xs text-gray-400">☕ Small coffee, big moments</p>
        <p className="text-xs text-gray-400 mt-1">
          {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button 
          onClick={() => setSuccessMessage(null)} 
          className="flex-1 bg-[#C08552] text-white py-3 rounded-xl font-bold text-sm hover:opacity-90"
        >
          ✨ Done
        </button>
        <button 
          onClick={() => { 
            setSuccessMessage(null); 
            router.push("/menu"); 
          }} 
          className="flex-1 border-2 border-gray-200 py-3 rounded-xl font-medium text-sm hover:bg-gray-50"
        >
          Order More
        </button>
      </div>

    </div>
  </div>
)}

    </main>
  );
}