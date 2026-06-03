<template>
	<view class="surprise-checkout-page">
		<view class="surprise-checkout-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="page-shell surprise-checkout-page__nav">
				<view class="surprise-checkout-page__back" @tap="goBack">
					<u-icon name="arrow-left" size="48" color="#111111"></u-icon>
				</view>
			</view>
		</view>

		<view class="page-shell surprise-checkout-page__body">
			<text class="surprise-checkout-page__title">购物结算</text>
			<text class="surprise-checkout-page__store">{{ storeName }}</text>

			<view class="surprise-checkout-page__goods-list">
				<view v-for="(item, index) in goodsList" :key="item.key" class="surprise-checkout-page__goods-card">
					<view class="surprise-checkout-page__goods-main">
						<image class="surprise-checkout-page__goods-image" :src="item.image" mode="aspectFill"></image>

						<view class="surprise-checkout-page__goods-content">
							<view class="surprise-checkout-page__goods-top">
								<text class="surprise-checkout-page__goods-name line-2">{{ item.name }}</text>

								<view class="surprise-checkout-page__stepper">
									<view class="surprise-checkout-page__stepper-button" @tap="changeQuantity(index, -1)">-</view>
									<view class="surprise-checkout-page__stepper-value">{{ item.quantity }}</view>
									<view class="surprise-checkout-page__stepper-button" @tap="changeQuantity(index, 1)">+</view>
								</view>
							</view>

							<view class="surprise-checkout-page__goods-bottom">
								<view class="surprise-checkout-page__goods-price-wrap">
									<text class="surprise-checkout-page__goods-price">￥{{ item.price }}</text>
									<view class="surprise-checkout-page__goods-points-wrap">
										<view class="surprise-checkout-page__coin-stack"></view>
										<text class="surprise-checkout-page__goods-points">{{ item.points }}</text>
									</view>
								</view>

								<view class="surprise-checkout-page__exchange" @tap="toggleExchange(index)">
									<text :class="['surprise-checkout-page__exchange-text', item.usePoints ? 'is-active' : '']">积分兑换</text>
									<view :class="['surprise-checkout-page__choice-dot', item.usePoints ? 'is-active' : '']"></view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="surprise-checkout-page__section">
				<text class="surprise-checkout-page__section-title">订单金额</text>
				<view class="surprise-checkout-page__info-list">
					<view class="surprise-checkout-page__info-row">
						<text class="surprise-checkout-page__info-label">商品总额</text>
						<text class="surprise-checkout-page__info-value">￥{{ summary.goodsTotal }}</text>
					</view>
					<view class="surprise-checkout-page__info-row">
						<text class="surprise-checkout-page__info-label">支付金额</text>
						<text class="surprise-checkout-page__info-value">￥{{ summary.payAmount }}</text>
					</view>
					<view class="surprise-checkout-page__info-row">
						<text class="surprise-checkout-page__info-label">消耗积分</text>
						<text class="surprise-checkout-page__info-value">{{ summary.pointsCost }}</text>
					</view>
				</view>
			</view>

			<view class="surprise-checkout-page__section">
				<text class="surprise-checkout-page__section-title">选择配送方式</text>
				<view class="surprise-checkout-page__option-list">
					<view class="surprise-checkout-page__option-row" @tap="selectDelivery('express')">
						<text class="surprise-checkout-page__option-label">邮寄</text>
						<view class="surprise-checkout-page__option-side">
							<text
								:class="[
									'surprise-checkout-page__option-helper',
									selectedDelivery === 'express' ? 'is-highlight' : ''
								]"
								@tap.stop="chooseAddress"
							>
								{{ selectedAddress }}
							</text>
							<view :class="['surprise-checkout-page__choice-dot', selectedDelivery === 'express' ? 'is-active' : '']"></view>
						</view>
					</view>
					<view class="surprise-checkout-page__option-row" @tap="selectDelivery('pickup')">
						<text class="surprise-checkout-page__option-label">自提</text>
						<view :class="['surprise-checkout-page__choice-dot', selectedDelivery === 'pickup' ? 'is-active' : '']"></view>
					</view>
				</view>
			</view>

			<view class="surprise-checkout-page__section surprise-checkout-page__section--payment">
				<text class="surprise-checkout-page__section-title">选择支付方式</text>
				<view class="surprise-checkout-page__payment-list">
					<view
						v-for="item in paymentOptions"
						:key="item.value"
						class="surprise-checkout-page__payment-row"
						@tap="selectPayment(item.value)"
					>
						<view class="surprise-checkout-page__payment-main">
							<view :class="['surprise-checkout-page__payment-icon', `is-${item.value}`]">
								<text class="surprise-checkout-page__payment-icon-text">{{ item.iconText }}</text>
								<view v-if="item.value === 'bank'" class="surprise-checkout-page__payment-bank-mark"></view>
								<view v-if="item.value === 'balance'" class="surprise-checkout-page__payment-wallet-slot"></view>
							</view>
							<text class="surprise-checkout-page__payment-name">{{ item.label }}</text>
						</view>
						<view :class="['surprise-checkout-page__choice-dot', selectedPayment === item.value ? 'is-active' : '']"></view>
					</view>
				</view>
			</view>
		</view>

		<view class="surprise-checkout-page__footer">
			<view class="surprise-checkout-page__footer-total">
				<text class="surprise-checkout-page__footer-total-label">合计：</text>
				<text class="surprise-checkout-page__footer-total-value">￥{{ summary.goodsTotal }}</text>
			</view>
			<button class="surprise-checkout-page__footer-button" hover-class="none" @tap="submitOrder">立即支付</button>
		</view>
	</view>
</template>

<script>
function getStatusBarHeight() {
	try {
		const { statusBarHeight = 20 } = uni.getSystemInfoSync()
		return statusBarHeight
	} catch (error) {
		return 20
	}
}

function decodeQueryText(value) {
	const text = String(value || '').trim()

	if (!text) {
		return ''
	}

	try {
		return decodeURIComponent(text)
	} catch (error) {
		return text
	}
}

function normalizeText(value, fallback) {
	const text = decodeQueryText(value)
	return text || fallback
}

function normalizeNumber(value, fallback) {
	const number = Number(value)
	return Number.isFinite(number) && number > 0 ? number : fallback
}

function formatAmount(value) {
	const amount = Number(value || 0)
	const fixed = amount.toFixed(1)
	return fixed.endsWith('.0') ? String(Math.round(amount)) : fixed
}

function resolveGoodsImage(id) {
	const imageMap = {
		101: '/static/linshi/01.png',
		102: '/static/linshi/02.png',
		103: '/static/linshi/03.png',
		104: '/static/linshi/04.png',
		105: '/static/linshi/05.png',
		106: '/static/linshi/02.png'
	}

	return imageMap[normalizeNumber(id, 101)] || imageMap[101]
}

function createGoods(options = {}) {
	const name = normalizeText(options.name, '年度医美计划')
	const price = normalizeNumber(options.price, 699)
	const points = normalizeNumber(options.points, 6990)
	const image = normalizeText(options.image, resolveGoodsImage(options.id))

	return [
		{
			key: `${options.id || 'goods'}-1`,
			name,
			price,
			points,
			image,
			quantity: 1,
			usePoints: false
		},
		{
			key: `${options.id || 'goods'}-2`,
			name,
			price,
			points,
			image,
			quantity: 1,
			usePoints: false
		}
	]
}

const PAYMENT_OPTIONS = [
	{ value: 'wechat', label: '微信支付', iconText: '微' },
	{ value: 'alipay', label: '支付宝', iconText: '支' },
	{ value: 'bank', label: '银行卡', iconText: '' },
	{ value: 'balance', label: '余额', iconText: '' }
]

export default {
	data() {
		return {
			statusBarHeight: getStatusBarHeight(),
			storeName: '伊美尔光华SoHo2期店',
			selectedAddress: '选择收货地址',
			selectedDelivery: 'express',
			selectedPayment: 'wechat',
			paymentOptions: PAYMENT_OPTIONS,
			goodsList: createGoods()
		}
	},
	computed: {
		summary() {
			const goodsTotal = this.goodsList.reduce((total, item) => total + item.price * item.quantity, 0)
			const pointsCost = this.goodsList.reduce((total, item) => {
				return total + (item.usePoints ? item.points * item.quantity : 0)
			}, 0)
			const payAmount = goodsTotal > 0 ? Math.max(goodsTotal * 0.011, 0).toFixed(1) : '0.0'

			return {
				goodsTotal: formatAmount(goodsTotal),
				payAmount: formatAmount(payAmount),
				pointsCost
			}
		}
	},
	onLoad(options = {}) {
		this.goodsList = createGoods({
			id: options.id,
			name: options.name,
			price: options.price,
			points: options.points,
			image: options.image
		})
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

			uni.switchTab({
				url: '/pages/surprise/surprise'
			})
		},
		changeQuantity(index, delta) {
			const target = this.goodsList[index]

			if (!target) {
				return
			}

			const nextQuantity = Math.max(1, target.quantity + delta)
			this.$set(this.goodsList, index, {
				...target,
				quantity: nextQuantity
			})
		},
		toggleExchange(index) {
			const target = this.goodsList[index]

			if (!target) {
				return
			}

			this.$set(this.goodsList, index, {
				...target,
				usePoints: !target.usePoints
			})
		},
		selectDelivery(type) {
			this.selectedDelivery = type
		},
		selectPayment(type) {
			this.selectedPayment = type
		},
		chooseAddress() {
			uni.navigateTo({
				url: '/bundle_user/pages/address/address'
			})
		},
		submitOrder() {
			uni.redirectTo({
				url: `/bundle_surprise/pages/pay_success/pay_success?orderUrl=${encodeURIComponent('/pages/user/user')}`
			})
		}
	}
}
</script>

<style scoped lang="scss">
.surprise-checkout-page {
	min-height: 100vh;
	padding-bottom: calc(210rpx + env(safe-area-inset-bottom));
	background: #ffffff;
}

.surprise-checkout-page__header {
	position: sticky;
	top: 0;
	z-index: 10;
	background: rgba(255, 255, 255, 0.98);
}

.surprise-checkout-page__nav {
	display: flex;
	align-items: center;
	height: 96rpx;
}

.surprise-checkout-page__back {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 72rpx;
	height: 72rpx;
	margin-left: -12rpx;
}

.surprise-checkout-page__body {
	padding-top: 30rpx;
}

.surprise-checkout-page__title {
	display: block;
	font-size: 72rpx;
	line-height: 1.14;
	font-weight: 500;
	color: #202227;
}

.surprise-checkout-page__store {
	display: block;
	margin-top: 68rpx;
	font-size: 38rpx;
	line-height: 1.3;
	font-weight: 600;
	color: #2a2d34;
}

.surprise-checkout-page__goods-list {
	margin-top: 28rpx;
}

.surprise-checkout-page__goods-card + .surprise-checkout-page__goods-card {
	margin-top: 40rpx;
}

.surprise-checkout-page__goods-main {
	display: flex;
	align-items: flex-start;
}

.surprise-checkout-page__goods-image {
	flex: none;
	width: 190rpx;
	height: 190rpx;
	border-radius: 18rpx;
	background: #edf1f7;
}

.surprise-checkout-page__goods-content {
	flex: 1;
	min-width: 0;
	margin-left: 22rpx;
	padding-top: 8rpx;
}

.surprise-checkout-page__goods-top {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
}

.surprise-checkout-page__goods-name {
	flex: 1;
	min-width: 0;
	padding-right: 20rpx;
	font-size: 34rpx;
	line-height: 1.34;
	color: #22242a;
}

.surprise-checkout-page__stepper {
	flex: none;
	display: flex;
	align-items: center;
	overflow: hidden;
	border-radius: 16rpx;
	background: #f7f7fa;
}

.surprise-checkout-page__stepper-button,
.surprise-checkout-page__stepper-value {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 56rpx;
	height: 44rpx;
	font-size: 26rpx;
	line-height: 1;
	color: #23252b;
}

.surprise-checkout-page__stepper-button {
	color: #4f535c;
}

.surprise-checkout-page__stepper-value {
	width: 82rpx;
	font-size: 28rpx;
	font-weight: 600;
	background: rgba(255, 255, 255, 0.72);
}

.surprise-checkout-page__goods-bottom {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 58rpx;
}

.surprise-checkout-page__goods-price-wrap,
.surprise-checkout-page__goods-points-wrap,
.surprise-checkout-page__exchange,
.surprise-checkout-page__option-side,
.surprise-checkout-page__payment-main,
.surprise-checkout-page__footer {
	display: flex;
	align-items: center;
}

.surprise-checkout-page__goods-price {
	font-size: 28rpx;
	line-height: 1;
	color: #7f848e;
}

.surprise-checkout-page__goods-points-wrap {
	margin-left: 16rpx;
}

.surprise-checkout-page__coin-stack {
	position: relative;
	width: 28rpx;
	height: 18rpx;
	border: 2rpx solid #9fa4ad;
	border-radius: 999rpx;
	box-sizing: border-box;
}

.surprise-checkout-page__coin-stack::before,
.surprise-checkout-page__coin-stack::after {
	content: '';
	position: absolute;
	left: -2rpx;
	width: 28rpx;
	height: 18rpx;
	border: 2rpx solid #9fa4ad;
	border-radius: 999rpx;
	background: #ffffff;
	box-sizing: border-box;
}

.surprise-checkout-page__coin-stack::before {
	top: -8rpx;
}

.surprise-checkout-page__coin-stack::after {
	top: 8rpx;
}

.surprise-checkout-page__goods-points {
	margin-left: 10rpx;
	font-size: 28rpx;
	line-height: 1;
	color: #7f848e;
}

.surprise-checkout-page__exchange-text {
	margin-right: 16rpx;
	font-size: 26rpx;
	color: #999ea8;
}

.surprise-checkout-page__exchange-text.is-active {
	color: #143080;
}

.surprise-checkout-page__choice-dot {
	position: relative;
	flex: none;
	width: 34rpx;
	height: 34rpx;
	border: 2rpx solid #d9dce3;
	border-radius: 50%;
	box-sizing: border-box;
}

.surprise-checkout-page__choice-dot.is-active {
	border-color: #1f3e95;
}

.surprise-checkout-page__choice-dot.is-active::after {
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

.surprise-checkout-page__section {
	margin-top: 64rpx;
}

.surprise-checkout-page__section--payment {
	padding-bottom: 34rpx;
}

.surprise-checkout-page__section-title {
	display: block;
	font-size: 38rpx;
	line-height: 1.2;
	font-weight: 600;
	color: #202227;
}

.surprise-checkout-page__info-list,
.surprise-checkout-page__option-list,
.surprise-checkout-page__payment-list {
	margin-top: 36rpx;
}

.surprise-checkout-page__info-row,
.surprise-checkout-page__option-row,
.surprise-checkout-page__payment-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.surprise-checkout-page__info-row + .surprise-checkout-page__info-row,
.surprise-checkout-page__option-row + .surprise-checkout-page__option-row,
.surprise-checkout-page__payment-row + .surprise-checkout-page__payment-row {
	margin-top: 44rpx;
}

.surprise-checkout-page__info-label,
.surprise-checkout-page__info-value,
.surprise-checkout-page__option-label,
.surprise-checkout-page__payment-name {
	font-size: 28rpx;
	line-height: 1.2;
	color: #252830;
}

.surprise-checkout-page__info-value {
	font-size: 30rpx;
}

.surprise-checkout-page__option-helper {
	margin-right: 18rpx;
	font-size: 28rpx;
	color: #9095a1;
}

.surprise-checkout-page__option-helper.is-highlight {
	color: #143080;
}

.surprise-checkout-page__payment-icon {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 42rpx;
	height: 42rpx;
	border-radius: 10rpx;
	overflow: hidden;
}

.surprise-checkout-page__payment-icon.is-wechat {
	background: #2dbf4e;
}

.surprise-checkout-page__payment-icon.is-alipay {
	background: #2a78f6;
}

.surprise-checkout-page__payment-icon.is-bank {
	background: linear-gradient(180deg, #6db7f8 0%, #4c9aee 100%);
}

.surprise-checkout-page__payment-icon.is-balance {
	background: #223f95;
}

.surprise-checkout-page__payment-icon-text {
	font-size: 28rpx;
	line-height: 1;
	color: #ffffff;
}

.surprise-checkout-page__payment-bank-mark {
	position: absolute;
	left: 8rpx;
	right: 8rpx;
	bottom: 10rpx;
	height: 6rpx;
	border-radius: 999rpx;
	background: rgba(255, 255, 255, 0.92);
}

.surprise-checkout-page__payment-bank-mark::before,
.surprise-checkout-page__payment-bank-mark::after {
	content: '';
	position: absolute;
	bottom: -8rpx;
	width: 10rpx;
	height: 8rpx;
	border-radius: 2rpx;
	background: rgba(255, 255, 255, 0.92);
}

.surprise-checkout-page__payment-bank-mark::before {
	left: 4rpx;
}

.surprise-checkout-page__payment-bank-mark::after {
	right: 4rpx;
}

.surprise-checkout-page__payment-wallet-slot {
	position: absolute;
	right: 6rpx;
	top: 14rpx;
	width: 10rpx;
	height: 12rpx;
	border-radius: 4rpx;
	background: rgba(255, 255, 255, 0.92);
}

.surprise-checkout-page__payment-wallet-slot::before {
	content: '';
	position: absolute;
	left: -16rpx;
	top: -8rpx;
	width: 28rpx;
	height: 20rpx;
	border-radius: 6rpx 6rpx 4rpx 4rpx;
	background: rgba(255, 255, 255, 0.92);
}

.surprise-checkout-page__payment-name {
	margin-left: 24rpx;
}

.surprise-checkout-page__footer {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 12;
	justify-content: space-between;
	padding: 24rpx 44rpx calc(24rpx + env(safe-area-inset-bottom));
	background: rgba(255, 255, 255, 0.98);
	box-shadow: 0 -8rpx 24rpx rgba(16, 24, 44, 0.06);
}

.surprise-checkout-page__footer-total {
	flex: 1;
	min-width: 0;
}

.surprise-checkout-page__footer-total-label {
	font-size: 28rpx;
	color: #707584;
}

.surprise-checkout-page__footer-total-value {
	font-size: 34rpx;
	font-weight: 700;
	color: #143080;
}

.surprise-checkout-page__footer-button {
	flex: none;
	width: 380rpx;
	height: 88rpx;
	border-radius: 999rpx;
	font-size: 32rpx;
	font-weight: 600;
	color: #ffffff;
	background: #243f95;
}

@media screen and (max-width: 360px) {
	.surprise-checkout-page__title {
		font-size: 62rpx;
	}

	.surprise-checkout-page__goods-top {
		flex-direction: column;
	}

	.surprise-checkout-page__stepper {
		margin-top: 18rpx;
	}

	.surprise-checkout-page__footer {
		padding-left: 30rpx;
		padding-right: 30rpx;
	}

	.surprise-checkout-page__footer-button {
		width: 330rpx;
	}
}
</style>
