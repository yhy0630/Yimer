<template>
	<view class="payment-list-page">
		<view class="payment-list-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="page-shell payment-list-page__nav">
				<view class="payment-list-page__back" @tap="goBack">
					<u-icon name="arrow-left" size="48" color="#161616"></u-icon>
				</view>
			</view>
		</view>

		<view class="page-shell payment-list-page__body">
			<text class="payment-list-page__title">缴费清单</text>

			<view class="payment-list-page__list">
				<view v-for="item in paymentList" :key="item.id" class="payment-card">
					<view class="payment-card__head">
						<text class="payment-card__name">{{ item.title }}</text>
						<text class="payment-card__amount">¥ {{ item.amount }}</text>
					</view>

					<view class="payment-card__detail">
						<view v-for="field in item.summaryFields" :key="field.label" class="payment-card__row">
							<text class="payment-card__label">{{ field.label }}：</text>
							<text class="payment-card__value">{{ field.value }}</text>
						</view>
					</view>

					<view class="payment-card__footer">
						<button
							:class="[
								'payment-card__button',
								item.status === 'paid' ? 'payment-card__button--paid' : 'payment-card__button--pending'
							]"
							hover-class="none"
							@tap="handlePay(item)"
						>
							{{ item.status === 'paid' ? '已缴费' : '去缴费' }}
						</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { PAYMENT_BILLS } from '@/config/payment'

function getStatusBarHeight() {
	try {
		const { statusBarHeight = 20 } = uni.getSystemInfoSync()
		return statusBarHeight
	} catch (error) {
		return 20
	}
}

export default {
	data() {
		return {
			statusBarHeight: getStatusBarHeight(),
			paymentList: PAYMENT_BILLS
		}
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
				url: '/pages/user/user'
			})
		},
		handlePay(item) {
			if (item.status === 'paid') {
				return
			}

			uni.navigateTo({
				url: `/bundle_user/pages/payment_confirm/payment_confirm?billId=${item.id}`
			})
		}
	}
}
</script>

<style scoped lang="scss">
.payment-list-page {
	min-height: 100vh;
	background: linear-gradient(180deg, #ffffff 0%, #f7f7f8 360rpx, #f5f5f6 100%);
}

.payment-list-page__header {
	background: transparent;
}

.payment-list-page__nav {
	display: flex;
	align-items: center;
	height: 96rpx;
}

.payment-list-page__back {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 72rpx;
	height: 72rpx;
	margin-left: -12rpx;
}

.payment-list-page__body {
	padding-top: 30rpx;
	padding-bottom: calc(48rpx + env(safe-area-inset-bottom));
}

.payment-list-page__title {
	display: block;
	font-size: 62rpx;
	font-weight: 700;
	line-height: 1.12;
	color: #1f2228;
}

.payment-list-page__list {
	margin-top: 54rpx;
}

.payment-card + .payment-card {
	margin-top: 28rpx;
}

.payment-card {
	padding: 36rpx 40rpx 38rpx;
	border-radius: 24rpx;
	background: #ffffff;
	box-shadow: 0 18rpx 44rpx rgba(16, 24, 40, 0.06);
}

.payment-card__head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	column-gap: 24rpx;
}

.payment-card__name,
.payment-card__amount {
	color: #23262d;
	font-size: 34rpx;
	font-weight: 700;
	line-height: 1.2;
}

.payment-card__amount {
	flex: none;
}

.payment-card__detail {
	margin-top: 34rpx;
}

.payment-card__row {
	display: flex;
	align-items: flex-start;
}

.payment-card__row + .payment-card__row {
	margin-top: 28rpx;
}

.payment-card__label {
	flex: none;
	width: 170rpx;
	color: #9aa0ab;
	font-size: 24rpx;
	line-height: 1.55;
}

.payment-card__value {
	flex: 1;
	min-width: 0;
	color: #424852;
	font-size: 24rpx;
	line-height: 1.55;
	word-break: break-all;
}

.payment-card__footer {
	display: flex;
	justify-content: flex-end;
	margin-top: 34rpx;
}

.payment-card__button {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 182rpx;
	height: 72rpx;
	border-radius: 18rpx;
	font-size: 24rpx;
	font-weight: 500;
	line-height: 1;
}

.payment-card__button--pending {
	border: 2rpx solid #ff634f;
	color: #ff634f;
	background: #ffffff;
}

.payment-card__button--paid {
	color: #8b8f98;
	background: #ebeef4;
}
</style>
