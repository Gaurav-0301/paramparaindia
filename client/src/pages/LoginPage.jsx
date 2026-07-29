import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Phone, ArrowRight, ShieldCheck, Sparkles, RefreshCw, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFestival } from '../context/FestivalContext';

const LoginPage = () => {
  const { sendOTP, verifyOTP, user } = useAuth();
  const { festival } = useFestival();
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState(1); // 1: Mobile input, 2: OTP input
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devNotice, setDevNotice] = useState('');

  const inputRefs = useRef([]);

  const from = location.state?.from?.pathname || '/account';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  useEffect(() => {
    let interval;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const handleMobileSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(mobile.replace(/\D/g, ''))) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await sendOTP(mobile, fullName);
      if (res.success) {
        setStep(2);
        setResendTimer(30);
        setCanResend(false);
        if (res.devNotice) setDevNotice(res.devNotice);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto focus next box
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length < 6) {
      setError('Please enter the full 6-digit OTP code.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await verifyOTP(mobile, fullOtp);
      if (res.success) {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP entered.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setLoading(true);
    try {
      await sendOTP(mobile);
      setResendTimer(30);
      setCanResend(false);
      setError('');
    } catch (err) {
      setError('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-4xl glass-modal rounded-3xl overflow-hidden shadow-2xl border border-[#D4B896]/50 grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Side: Editorial Festival Photography */}
        <div className="md:col-span-6 relative aspect-[4/5] md:aspect-auto overflow-hidden hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=1000&auto=format&fit=crop&q=80"
            alt="Raksha Bandhan Login"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3A342E]/80 via-[#3A342E]/30 to-transparent flex flex-col justify-end p-8 text-white space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#D4B896]">
              {festival.title} Edition
            </span>
            <h2 className="font-serif-display text-2xl font-semibold">
              Celebrate Eternal Sibling Memories
            </h2>
            <p className="text-xs text-[#FAF7F2]/80 leading-relaxed">
              Log in to view your orders, address book, and claim exclusive festive perks.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:col-span-6 p-8 sm:p-12 flex flex-col justify-center space-y-6">
          <div>
            <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-[#9CAF97] bg-[#9CAF97]/15 px-3 py-1 rounded-full mb-2">
              <Sparkles className="w-3 h-3 text-[#D4B896]" /> Instant Mobile Verification
            </span>
            <h1 className="font-serif-display text-3xl font-semibold text-[#3A342E]">
              Welcome Back
            </h1>
            <p className="text-xs text-[#3A342E]/70 mt-1">
              Welcome back — let's find the perfect gift for your sibling this {festival.title}.
            </p>
          </div>

          {step === 1 ? (
            /* Step 1: Mobile Number & Name Input */
            <form onSubmit={handleMobileSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#3A342E] mb-1.5">
                  Full Name (Optional for existing members)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ananya Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 text-xs rounded-xl border border-[#D4B896]/60 bg-white text-[#3A342E] font-medium focus:outline-none focus:border-[#9CAF97]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#3A342E] mb-1.5">
                  Mobile Number *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-xs font-bold text-[#3A342E]/60">+91</span>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    maxLength={10}
                    required
                    className="w-full pl-12 pr-4 py-3 text-xs rounded-xl border border-[#D4B896]/60 bg-white text-[#3A342E] font-medium focus:outline-none focus:border-[#9CAF97]"
                  />
                </div>
              </div>

              {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#3A342E] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-xl hover:bg-[#9CAF97] transition-all flex items-center justify-center gap-2 shadow-md"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Sending OTP...
                  </span>
                ) : (
                  <>Get Verification Code <ArrowRight className="w-4 h-4" /></>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#3A342E]/60 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#9CAF97]" />
                <span>Secured via Parampara Verification System</span>
              </div>
            </form>
          ) : (
            /* Step 2: 6-Box OTP Input */
            <form onSubmit={handleVerifySubmit} className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#3A342E]">
                    Enter 6-Digit OTP
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[11px] text-[#9CAF97] font-semibold underline"
                  >
                    Change Number (+91 {mobile})
                  </button>
                </div>

                {/* 6 OTP Boxes */}
                <div className="flex justify-between gap-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (inputRefs.current[idx] = el)}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-10 h-12 text-center text-base font-bold rounded-xl border border-[#D4B896]/60 bg-white text-[#3A342E] focus:outline-none focus:border-[#9CAF97] shadow-xs"
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>
              </div>

              {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#3A342E] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-xl hover:bg-[#9CAF97] transition-all flex items-center justify-center gap-2 shadow-md"
              >
                {loading ? 'Verifying Code...' : 'Verify OTP & Continue'}
              </button>

              <div className="flex items-center justify-between text-xs text-[#3A342E]/70 pt-1">
                <span>Didn't receive the code?</span>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-[#9CAF97] font-semibold hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Resend OTP
                  </button>
                ) : (
                  <span>Resend in <strong className="text-[#3A342E]">{resendTimer}s</strong></span>
                )}
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};

export default LoginPage;
