import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, Truck, Calendar, Download, ArrowRight, PhoneCall } from 'lucide-react';
import axios from 'axios';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/orders/${orderId}`);
        setOrder(res.data.order);
      } catch (err) {
        console.error('Failed to fetch order confirmation:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="w-10 h-10 border-2 border-[#D4B896] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-serif-display text-2xl font-semibold text-[#3A342E]">Order details not found</h1>
        <Link to="/" className="inline-block px-6 py-2.5 bg-[#3A342E] text-white text-xs uppercase font-semibold rounded-xl">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Top Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-[#D4B896]/50 text-center space-y-4 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-[#9CAF97]/20 text-[#9CAF97] mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs uppercase tracking-widest text-[#9CAF97] font-bold">Order Successfully Placed</span>
        <h1 className="font-serif-display text-3xl font-semibold text-[#3A342E]">
          Thank You For Shopping With Parampara!
        </h1>
        <p className="text-xs text-[#3A342E]/70 max-w-lg mx-auto">
          Your order <strong className="text-[#3A342E]">{order.orderId}</strong> has been received and sent to our artisan dispatch facility.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF7F2] border border-[#D4B896]/40 text-xs text-[#3A342E]/80">
          <PhoneCall className="w-3.5 h-3.5 text-[#9CAF97]" />
          Order confirmation SMS & WhatsApp updates triggered via Twilio (+91 {order.shippingAddress.mobile})
        </div>
      </div>

      {/* Order Status Timeline Preview */}
      <div className="p-6 bg-white/70 rounded-2xl border border-[#EFE6D8] space-y-4">
        <h3 className="font-serif-display text-lg font-semibold text-[#3A342E]">Estimated Delivery</h3>

        <div className="flex items-center justify-between text-xs font-semibold text-[#3A342E]">
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#9CAF97]" /> Expected By:</span>
          <span className="text-[#9CAF97]">{new Date(order.estimatedDeliveryDate).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
        </div>

        {/* Progress Bar */}
        <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[10px] font-semibold text-[#3A342E]">
          <div className="space-y-1">
            <div className="h-2 rounded-full bg-[#9CAF97]"></div>
            <span>Placed</span>
          </div>
          <div className="space-y-1">
            <div className={`h-2 rounded-full ${['Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'].includes(order.orderStatus) ? 'bg-[#9CAF97]' : 'bg-[#EFE6D8]'}`}></div>
            <span>Confirmed</span>
          </div>
          <div className="space-y-1">
            <div className={`h-2 rounded-full ${['Shipped', 'Out for Delivery', 'Delivered'].includes(order.orderStatus) ? 'bg-[#9CAF97]' : 'bg-[#EFE6D8]'}`}></div>
            <span>Shipped</span>
          </div>
          <div className="space-y-1">
            <div className={`h-2 rounded-full ${order.orderStatus === 'Delivered' ? 'bg-[#9CAF97]' : 'bg-[#EFE6D8]'}`}></div>
            <span>Delivered</span>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Shipping Address */}
        <div className="p-6 bg-white/70 rounded-2xl border border-[#EFE6D8] space-y-2">
          <h4 className="font-serif-display text-base font-semibold text-[#3A342E]">Shipping Destination</h4>
          <p className="font-bold text-xs text-[#3A342E]">{order.shippingAddress.fullName}</p>
          <p className="text-xs text-[#3A342E]/80">{order.shippingAddress.streetAddress}</p>
          <p className="text-xs text-[#3A342E]/80">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
          <p className="text-xs text-[#3A342E]/60 mt-1">Mobile: {order.shippingAddress.mobile}</p>
        </div>

        {/* Payment Summary */}
        <div className="p-6 bg-white/70 rounded-2xl border border-[#EFE6D8] space-y-2">
          <h4 className="font-serif-display text-base font-semibold text-[#3A342E]">Payment Breakdown</h4>
          <div className="space-y-1 text-xs text-[#3A342E]">
            <div className="flex justify-between">
              <span>Payment Mode:</span>
              <span className="font-semibold">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{order.pricing.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {order.pricing.discount > 0 && (
              <div className="flex justify-between text-[#9CAF97]">
                <span>Discount:</span>
                <span>-₹{order.pricing.discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-sm pt-2 border-t border-[#EFE6D8]">
              <span>Total Paid:</span>
              <span>₹{order.pricing.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <Link
          to="/account?tab=orders"
          className="w-full sm:w-auto px-6 py-3 bg-[#3A342E] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-xl hover:bg-[#9CAF97] flex items-center justify-center gap-2"
        >
          Track Order Status <ArrowRight className="w-4 h-4" />
        </Link>

        <button
          onClick={() => alert(`Invoice PDF generated for Order ${order.orderId}`)}
          className="w-full sm:w-auto px-6 py-3 glass-panel text-[#3A342E] text-xs uppercase tracking-widest font-semibold rounded-xl hover:border-[#D4B896] flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4 text-[#D4B896]" /> Download PDF Invoice
        </button>
      </div>

    </div>
  );
};

export default OrderConfirmationPage;
