<template>
	<view class="coffee-payment-wrap">
		<view class="coffee-payment-nav" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="coffee-payment-nav__back" @tap="goBack">
				<u-icon name="arrow-left" size="44" color="#161616"></u-icon>
			</view>
			<text class="coffee-payment-nav__title">收银台</text>
		</view>

		<scroll-view class="coffee-payment-scroll" scroll-y :show-scrollbar="false">
			<view class="coffee-payment-content">
				<view class="coffee-payment-amount">
					<image
						class="coffee-payment-amount__bg"
						src="/bundle_coffee/static/bg/payment_bg.png"
						mode="aspectFill"
					/>
					<view class="coffee-payment-amount__inner">
						<text class="coffee-payment-amount__label">待支付</text>
						<text class="coffee-payment-amount__value">¥{{ payAmount }}</text>
					</view>
				</view>

				<text class="coffee-payment-section__title">支付方式</text>

				<view class="coffee-payment-methods">
					<view
						v-for="item in paymentMethods"
						:key="item.value"
						class="coffee-payment-method"
						@tap="selectPayment(item.value)"
					>
						<image
							class="coffee-payment-method__icon"
							:src="item.icon"
							mode="aspectFit"
						/>
						<text class="coffee-payment-method__name">{{ item.label }}</text>
						<view
							:class="[
								'coffee-payment-method__radio',
								selectedPayment === item.value ? 'is-active' : ''
							]"
						>
							<view
								v-if="selectedPayment === item.value"
								class="coffee-payment-method__radio-dot"
							></view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<view class="coffee-payment-footer">
			<button class="coffee-payment-footer__btn" hover-class="none" @tap="handlePay">
				立即支付
			</button>
		</view>
	</view>
</template>

<script>
const PAYMENT_METHODS = [
	{
		value: 'wechat',
		label: '微信支付',
		icon: '/static/images/weixin.png'
	},
	{
		value: 'alipay',
		label: '支付宝',
		icon: '/static/images/zhifubao.png'
	},
	{
		value: 'bank',
		label: '银行卡',
		icon: '/static/images/yinhangka.png'
	},
	{
		value: 'balance',
		label: '余额',
		icon: '/static/images/wallet.png'
	}
]

function getStatusBarHeight() {
	try {
		const { statusBarHeight = 20 } = uni.getSystemInfoSync()
		return statusBarHeight
	} catch (error) {
		return 20
	}
}

export default {
	name: 'CoffeePayment',
	data() {
		return {
			statusBarHeight: getStatusBarHeight(),
			payAmount: '2,156',
			paymentMethods: PAYMENT_METHODS,
			selectedPayment: 'wechat'
		}
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		selectPayment(value) {
			this.selectedPayment = value
		},
		handlePay() {
			const method = this.paymentMethods.find((item) => item.value === this.selectedPayment)
			uni.showToast({
				title: `${method?.label || '支付'}待接入`,
				icon: 'none'
			})
		}
	}
}
</script>

<style scoped lang="scss">
.coffee-payment-wrap {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background: #ffffff;
}

.coffee-payment-nav {
	flex: none;
	padding: 8rpx 32rpx 0;
}

.coffee-payment-nav__back {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 72rpx;
	height: 72rpx;
	margin-left: -12rpx;
}

.coffee-payment-nav__title {
	display: block;
	margin-top: 8rpx;
	font-size: 48rpx;
	font-weight: 700;
	color: #1a1b1d;
	line-height: 1.2;
}

.coffee-payment-scroll {
	flex: 1;
	height: 0;
}

.coffee-payment-content {
	padding: 32rpx 32rpx calc(env(safe-area-inset-bottom) + 140rpx);
	box-sizing: border-box;
}

.coffee-payment-amount {
	position: relative;
	height: 220rpx;
	border-radius: 20rpx;
	overflow: hidden;
}

.coffee-payment-amount__bg {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
}

.coffee-payment-amount__inner {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	height: 100%;
	padding: 0 32rpx;
	box-sizing: border-box;
}

.coffee-payment-amount__label {
	font-size: 24rpx;
	color: #999999;
	line-height: 1.2;
}

.coffee-payment-amount__value {
	margin-top: 16rpx;
	font-size: 56rpx;
	font-weight: 700;
	color: #1a1b1d;
	line-height: 1.1;
}

.coffee-payment-section__title {
	display: block;
	margin-top: 40rpx;
	font-size: 30rpx;
	font-weight: 600;
	color: #1a1b1d;
	line-height: 1.2;
}

.coffee-payment-methods {
	margin-top: 24rpx;
}

.coffee-payment-method {
	display: flex;
	align-items: center;
	padding: 28rpx 0;
}

.coffee-payment-method + .coffee-payment-method {
	border-top: 2rpx solid #f3f3f4;
}

.coffee-payment-method__icon {
	flex: none;
	width: 48rpx;
	height: 48rpx;
}

.coffee-payment-method__name {
	flex: 1;
	min-width: 0;
	margin-left: 20rpx;
	font-size: 28rpx;
	color: #1a1b1d;
	line-height: 1.2;
}

.coffee-payment-method__radio {
	flex: none;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 36rpx;
	height: 36rpx;
	border: 2rpx solid #cccccc;
	border-radius: 50%;
	box-sizing: border-box;
}

.coffee-payment-method__radio.is-active {
	border-color: #143080;
	background: #143080;
}

.coffee-payment-method__radio-dot {
	width: 12rpx;
	height: 12rpx;
	border-radius: 50%;
	background: #ffffff;
}

.coffee-payment-footer {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 10;
	padding: 20rpx 32rpx calc(env(safe-area-inset-bottom) + 20rpx);
	background: #ffffff;
}

.coffee-payment-footer__btn {
	width: 100%;
	height: 88rpx;
	margin: 0;
	padding: 0;
	border: none;
	border-radius: 999rpx;
	background: #143080;
	font-size: 32rpx;
	font-weight: 600;
	color: #ffffff;
	line-height: 88rpx;
}

.coffee-payment-footer__btn::after {
	border: none;
}
</style>
