<template>
	<view class="payment-confirm-page">
		<view class="payment-confirm-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="page-shell payment-confirm-page__nav">
				<view class="payment-confirm-page__back" @tap="goBack">
					<u-icon name="arrow-left" size="48" color="#171717"></u-icon>
				</view>
				<text class="payment-confirm-page__nav-title">确认缴费</text>
				<view class="payment-confirm-page__nav-placeholder"></view>
			</view>
		</view>

		<view class="page-shell payment-confirm-page__body">
			<view class="payment-confirm-page__card payment-confirm-page__card--detail">
				<view
					v-for="(field, index) in bill.confirmFields"
					:key="field.label"
					:class="['payment-confirm-page__detail-row', index === bill.confirmFields.length - 1 ? 'is-last' : '']"
				>
					<text class="payment-confirm-page__detail-label">{{ field.label }}</text>
					<text class="payment-confirm-page__detail-value">{{ field.value }}</text>
				</view>
			</view>

			<view class="payment-section">
				<view class="payment-section__head">
					<view class="section-head-mark"></view>
					<text class="payment-section__title">费用明细</text>
				</view>

				<view class="payment-confirm-page__card">
					<view
						v-for="(item, index) in bill.feeItems"
						:key="item.id"
						:class="['payment-fee-item', index === bill.feeItems.length - 1 ? 'is-last' : '']"
					>
						<view class="payment-fee-item__content">
							<text class="payment-fee-item__name">{{ item.name }}</text>
							<text class="payment-fee-item__meta">单价：￥{{ item.unitPrice }} 数量：{{ item.quantity }}</text>
						</view>
						<text class="payment-fee-item__amount">￥{{ item.amount }}</text>
					</view>
				</view>
			</view>

			<view class="payment-section">
				<view class="payment-section__head">
					<view class="section-head-mark"></view>
					<text class="payment-section__title">选择支付方式</text>
				</view>

				<view class="payment-confirm-page__card payment-confirm-page__card--payment">
					<view
						v-for="item in paymentOptions"
						:key="item.value"
						class="payment-method-item"
						@tap="selectPayment(item.value)"
					>
						<view class="payment-method-item__main">
							<view :class="['payment-method-item__icon', `is-${item.value}`]">
								<text v-if="item.iconText" class="payment-method-item__icon-text">{{ item.iconText }}</text>
								<view v-if="item.value === 'bank'" class="payment-method-item__bank-mark"></view>
								<view v-if="item.value === 'balance'" class="payment-method-item__wallet-mark"></view>
							</view>
							<text class="payment-method-item__name">{{ item.label }}</text>
						</view>
						<view :class="['payment-method-item__radio', selectedPayment === item.value ? 'is-active' : '']"></view>
					</view>
				</view>
			</view>
		</view>

		<view class="payment-confirm-page__footer">
			<view class="page-shell payment-confirm-page__footer-shell">
				<view class="payment-confirm-page__total">
					<text class="payment-confirm-page__total-label">合计：</text>
					<text class="payment-confirm-page__total-value">￥{{ totalAmount }}</text>
				</view>
				<button class="payment-confirm-page__submit" hover-class="none" @tap="submitPayment">立即支付</button>
			</view>
		</view>
	</view>
</template>

<script>
import { DEFAULT_PAYMENT_BILL, getPaymentBillById } from '@/config/payment'

const PAYMENT_OPTIONS = [
	{ value: 'wechat', label: '微信支付', iconText: '微' },
	{ value: 'alipay', label: '支付宝', iconText: '支' },
	{ value: 'bank', label: '银行卡', iconText: '' },
	{ value: 'balance', label: '余额', iconText: '' }
]

function getStatusBarHeight() {
	try {
		const { statusBarHeight = 20 } = uni.getSystemInfoSync()
		return statusBarHeight
	} catch (error) {
		return 20
	}
}

function normalizeAmount(value) {
	const amount = Number(value || 0)
	return Number.isFinite(amount) ? amount.toFixed(2) : '0.00'
}

export default {
	data() {
		return {
			statusBarHeight: getStatusBarHeight(),
			bill: DEFAULT_PAYMENT_BILL,
			paymentOptions: PAYMENT_OPTIONS,
			selectedPayment: PAYMENT_OPTIONS[0].value
		}
	},
	computed: {
		totalAmount() {
			if (this.bill && this.bill.amount) {
				return normalizeAmount(this.bill.amount)
			}

			const total = (this.bill.feeItems || []).reduce((sum, item) => sum + Number(item.amount || 0), 0)
			return normalizeAmount(total)
		}
	},
	onLoad(options = {}) {
		this.bill = getPaymentBillById(options.billId)
	},
	methods: {
		goBack() {
			const pages = getCurrentPages()

			if (pages.length > 1) {
				uni.navigateBack({
					delta: 1
				})
				return
			}

			uni.redirectTo({
				url: '/bundle_user/pages/payment_list/payment_list'
			})
		},
		selectPayment(value) {
			this.selectedPayment = value
		},
		submitPayment() {
			uni.navigateTo({
				url: '/bundle_user/pages/payment_success/payment_success'
			})
		}
	}
}
</script>

<style scoped lang="scss">
.payment-confirm-page {
	min-height: 100vh;
	background: linear-gradient(180deg, #fbfbfc 0%, #f6f6f7 300rpx, #f4f4f5 100%);
}

.payment-confirm-page__header {
	background: transparent;
}

.payment-confirm-page__nav {
	display: flex;
	align-items: center;
	height: 96rpx;
}

.payment-confirm-page__back,
.payment-confirm-page__nav-placeholder {
	flex: none;
	width: 72rpx;
	height: 72rpx;
}

.payment-confirm-page__back {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	margin-left: -12rpx;
}

.payment-confirm-page__nav-title {
	flex: 1;
	text-align: center;
	font-size: 40rpx;
	font-weight: 700;
	line-height: 1.2;
	color: #1f2024;
}

.payment-confirm-page__body {
	padding-top: 24rpx;
	padding-bottom: calc(220rpx + env(safe-area-inset-bottom));
}

.payment-confirm-page__card {
	padding: 0 40rpx;
	border-radius: 24rpx;
	background: #ffffff;
	box-shadow: 0 18rpx 44rpx rgba(16, 24, 40, 0.05);
}

.payment-confirm-page__card--detail {
	padding-top: 10rpx;
}

.payment-confirm-page__card--payment {
	padding-top: 6rpx;
	padding-bottom: 6rpx;
}

.payment-confirm-page__detail-row {
	display: flex;
	align-items: center;
	min-height: 112rpx;
	border-bottom: 1px solid #eef1f4;
}

.payment-confirm-page__detail-row.is-last {
	border-bottom: none;
}

.payment-confirm-page__detail-label {
	flex: none;
	width: 148rpx;
	padding-right: 22rpx;
	color: #9b9fa8;
	font-size: 24rpx;
	line-height: 1.5;
}

.payment-confirm-page__detail-value {
	flex: 1;
	min-width: 0;
	color: #252932;
	font-size: 24rpx;
	line-height: 1.5;
	word-break: break-all;
}

.payment-section {
	margin-top: 38rpx;
}

.payment-section__head {
	display: flex;
	align-items: center;
	margin-bottom: 24rpx;
	padding: 0 2rpx;
}

.payment-section__title {
	margin-left: 18rpx;
	color: #1f232c;
	font-size: 34rpx;
	font-weight: 700;
	line-height: 1.2;
}

.payment-fee-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 34rpx 0;
	border-bottom: 1px solid #eef1f4;
	column-gap: 24rpx;
}

.payment-fee-item.is-last {
	border-bottom: none;
}

.payment-fee-item__content {
	flex: 1;
	min-width: 0;
}

.payment-fee-item__name {
	display: block;
	color: #262933;
	font-size: 28rpx;
	font-weight: 700;
	line-height: 1.3;
}

.payment-fee-item__meta {
	display: block;
	margin-top: 18rpx;
	color: #9196a0;
	font-size: 24rpx;
	line-height: 1.45;
}

.payment-fee-item__amount {
	flex: none;
	color: #1f232b;
	font-size: 28rpx;
	font-weight: 700;
	line-height: 1.2;
}

.payment-method-item,
.payment-method-item__main,
.payment-confirm-page__footer-shell {
	display: flex;
	align-items: center;
}

.payment-method-item {
	justify-content: space-between;
	min-height: 108rpx;
}

.payment-method-item__icon {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 42rpx;
	height: 42rpx;
	border-radius: 10rpx;
	overflow: hidden;
}

.payment-method-item__icon.is-wechat {
	background: #2dbf4e;
}

.payment-method-item__icon.is-alipay {
	background: #2a78f6;
}

.payment-method-item__icon.is-bank {
	background: linear-gradient(180deg, #6db7f8 0%, #4c9aee 100%);
}

.payment-method-item__icon.is-balance {
	background: #223f95;
}

.payment-method-item__icon-text {
	font-size: 28rpx;
	line-height: 1;
	color: #ffffff;
}

.payment-method-item__bank-mark {
	position: absolute;
	left: 8rpx;
	right: 8rpx;
	bottom: 10rpx;
	height: 6rpx;
	border-radius: 999rpx;
	background: rgba(255, 255, 255, 0.92);
}

.payment-method-item__bank-mark::before,
.payment-method-item__bank-mark::after {
	content: '';
	position: absolute;
	bottom: -8rpx;
	width: 10rpx;
	height: 8rpx;
	border-radius: 2rpx;
	background: rgba(255, 255, 255, 0.92);
}

.payment-method-item__bank-mark::before {
	left: 4rpx;
}

.payment-method-item__bank-mark::after {
	right: 4rpx;
}

.payment-method-item__wallet-mark {
	position: absolute;
	right: 6rpx;
	top: 14rpx;
	width: 10rpx;
	height: 12rpx;
	border-radius: 4rpx;
	background: rgba(255, 255, 255, 0.92);
}

.payment-method-item__wallet-mark::before {
	content: '';
	position: absolute;
	left: -16rpx;
	top: -8rpx;
	width: 28rpx;
	height: 20rpx;
	border-radius: 6rpx 6rpx 4rpx 4rpx;
	background: rgba(255, 255, 255, 0.92);
}

.payment-method-item__name {
	margin-left: 24rpx;
	color: #242832;
	font-size: 28rpx;
	line-height: 1.2;
}

.payment-method-item__radio {
	position: relative;
	flex: none;
	width: 34rpx;
	height: 34rpx;
	border: 2rpx solid #dadde4;
	border-radius: 50%;
	box-sizing: border-box;
}

.payment-method-item__radio.is-active {
	border-color: #1f3e95;
}

.payment-method-item__radio.is-active::after {
	content: '';
	position: absolute;
	left: 50%;
	top: 50%;
	width: 16rpx;
	height: 16rpx;
	margin-left: -8rpx;
	margin-top: -8rpx;
	border-radius: 50%;
	background: #1f3e95;
}

.payment-confirm-page__footer {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 10;
	padding: 18rpx 0 24rpx;
	background: rgba(255, 255, 255, 0.98);
	box-shadow: 0 -8rpx 24rpx rgba(16, 24, 44, 0.05);
}

.payment-confirm-page__footer-shell {
	justify-content: space-between;
}

.payment-confirm-page__total {
	flex: 1;
	min-width: 0;
	padding-right: 24rpx;
}

.payment-confirm-page__total-label {
	font-size: 28rpx;
	color: #727786;
}

.payment-confirm-page__total-value {
	font-size: 34rpx;
	font-weight: 700;
	color: #143080;
}

.payment-confirm-page__submit {
	flex: none;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 350rpx;
	height: 88rpx;
	border-radius: 999rpx;
	background: #243f95;
	color: #ffffff;
	font-size: 32rpx;
	font-weight: 600;
	line-height: 1;
}

/* #ifdef APP-PLUS */
.payment-confirm-page__footer {
	padding-bottom: calc(24rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
}
/* #endif */

/* #ifdef MP-WEIXIN */
.payment-confirm-page__footer {
	padding-bottom: calc(24rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
}
/* #endif */

@media screen and (max-width: 360px) {
	.payment-confirm-page__detail-row {
		align-items: flex-start;
		padding-top: 28rpx;
		padding-bottom: 28rpx;
	}

	.payment-confirm-page__detail-label {
		width: 132rpx;
	}

	.payment-confirm-page__footer-shell {
		align-items: flex-start;
	}

	.payment-confirm-page__submit {
		width: 308rpx;
	}
}
</style>
