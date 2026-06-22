const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    minOrderAmount: { type: Number, default: 0 },
    maxDiscountAmount: { type: Number }, // cap for percentage discounts
    expiresAt: { type: Date, required: true },
    usageLimit: { type: Number, default: null }, // null = unlimited
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

couponSchema.methods.isValid = function (orderAmount) {
  const now = new Date();
  if (!this.isActive) return { valid: false, message: 'Coupon is inactive' };
  if (now > this.expiresAt) return { valid: false, message: 'Coupon has expired' };
  if (this.usageLimit && this.usedCount >= this.usageLimit)
    return { valid: false, message: 'Coupon usage limit reached' };
  if (orderAmount < this.minOrderAmount)
    return { valid: false, message: `Minimum order amount is ₹${this.minOrderAmount}` };
  return { valid: true };
};

couponSchema.methods.calculateDiscount = function (orderAmount) {
  if (this.discountType === 'fixed') return Math.min(this.discountValue, orderAmount);
  const discount = (orderAmount * this.discountValue) / 100;
  return this.maxDiscountAmount ? Math.min(discount, this.maxDiscountAmount) : discount;
};

module.exports = mongoose.model('Coupon', couponSchema);
