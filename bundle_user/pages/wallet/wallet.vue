<template>
	<view class="wallet-page">
		<view class="wallet-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="page-shell wallet-page__nav">
				<view class="wallet-page__back" @tap="goBack">
					<u-icon name="arrow-left" size="48" color="#111111"></u-icon>
				</view>
				<text class="wallet-page__nav-title">我的钱包</text>
				<view class="wallet-page__nav-placeholder"></view>
			</view>
		</view>

		<view class="page-shell wallet-page__body">
			<view class="wallet-balance-card">
				<view class="wallet-balance-card__pattern"></view>
				<view class="wallet-balance-card__content">
					<text class="wallet-balance-card__label">可用余额(元)</text>
					<text class="wallet-balance-card__amount">{{ wallet.amount }}</text>
					<button class="wallet-balance-card__cta" hover-class="none" @tap="handleRecharge">
						充值
					</button>
				</view>
			</view>

			<view class="wallet-record-card">
				<text class="wallet-record-card__title">充值明细</text>

				<view
					v-for="(item, index) in wallet.records"
					:key="item.id"
					:class="['wallet-record-item', index === wallet.records.length - 1 ? 'is-last' : '']"
				>
					<view class="wallet-record-item__head">
						<text class="wallet-record-item__name">{{ item.title }}</text>
						<text :class="['wallet-record-item__amount', item.amount > 0 ? 'is-income' : 'is-expense']">
							{{ formatAmount(item.amount) }}
						</text>
					</view>
					<text class="wallet-record-item__time">{{ item.time }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
const WALLET_DATA = {
	amount: '90.00',
	records: [
		{ id: 'record-1', title: '钱包充值', time: '2022-12-04 03:59:25', amount: 24 },
		{ id: 'record-2', title: '钱包充值', time: '2022-12-04 03:59:25', amount: 24 },
		{ id: 'record-3', title: '钱包充值', time: '2022-12-04 03:59:25', amount: 24 },
		{ id: 'record-4', title: '钱包充值', time: '2022-12-04 03:59:25', amount: 24 },
		{ id: 'record-5', title: '钱包充值', time: '2022-12-04 03:59:25', amount: 24 },
		{ id: 'record-6', title: '钱包充值', time: '2022-12-04 03:59:25', amount: 24 }
	]
}

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
			wallet: WALLET_DATA
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
		handleRecharge() {
			uni.showToast({
				title: '充值流程待接入',
				icon: 'none'
			})
		},
		formatAmount(amount) {
			const prefix = amount >= 0 ? '+' : '-'
			return `${prefix}${Math.abs(amount)}`
		}
	}
}
</script>

<style scoped lang="scss">
.wallet-page {
	min-height: 100vh;
	background:
		linear-gradient(180deg, #ffffff 0%, #f6f8ff 420rpx, #f5f7fb 100%);
}

.wallet-page__nav,
.wallet-page__back,
.wallet-page__body,
.wallet-record-item__head {
	display: flex;
}

.wallet-page__nav {
	align-items: center;
	height: 96rpx;
}

.wallet-page__back,
.wallet-page__nav-placeholder {
	flex: none;
	width: 72rpx;
	height: 72rpx;
}

.wallet-page__back {
	align-items: center;
	justify-content: flex-start;
	margin-left: -12rpx;
}

.wallet-page__nav-title {
	flex: 1;
	text-align: center;
	font-size: 40rpx;
	font-weight: 700;
	line-height: 1.2;
	color: #1f2024;
}

.wallet-page__body {
	flex-direction: column;
	padding-top: 36rpx;
	padding-bottom: calc(68rpx + env(safe-area-inset-bottom));
}

.wallet-balance-card {
	position: relative;
	overflow: hidden;
	border-radius: 34rpx;
	background: linear-gradient(135deg, #22358d 0%, #243894 36%, #203182 100%);
	box-shadow: 0 22rpx 44rpx rgba(24, 42, 104, 0.18);
}

.wallet-balance-card__pattern {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background:
		repeating-linear-gradient(
			-35deg,
			rgba(255, 255, 255, 0.08) 0,
			rgba(255, 255, 255, 0.08) 24rpx,
			rgba(255, 255, 255, 0) 24rpx,
			rgba(255, 255, 255, 0) 58rpx
		),
		repeating-linear-gradient(
			180deg,
			rgba(255, 255, 255, 0.08) 0,
			rgba(255, 255, 255, 0.08) 2rpx,
			rgba(255, 255, 255, 0) 2rpx,
			rgba(255, 255, 255, 0) 188rpx
		);
	opacity: 0.9;
}

.wallet-balance-card__content {
	position: relative;
	z-index: 1;
	padding: 44rpx 38rpx 54rpx;
}

.wallet-balance-card__label,
.wallet-balance-card__amount {
	display: block;
	color: #ffffff;
}

.wallet-balance-card__label {
	font-size: 28rpx;
	line-height: 1.2;
}

.wallet-balance-card__amount {
	margin-top: 28rpx;
	font-size: 88rpx;
	font-weight: 300;
	line-height: 1;
	letter-spacing: 2rpx;
}

.wallet-balance-card__cta {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 180rpx;
	height: 70rpx;
	margin-top: 54rpx;
	padding: 0 42rpx;
	border-radius: 999rpx;
	background: #ffffff;
	font-size: 32rpx;
	font-weight: 600;
	line-height: 1;
	color: #213487;
}

.wallet-record-card {
	margin-top: 42rpx;
	padding: 40rpx 32rpx 18rpx;
	border-radius: 26rpx;
	background: #ffffff;
	box-shadow: 0 12rpx 36rpx rgba(34, 48, 93, 0.08);
}

.wallet-record-card__title {
	display: block;
	font-size: 34rpx;
	font-weight: 700;
	line-height: 1.2;
	color: #30333a;
}

.wallet-record-item {
	padding: 42rpx 0 36rpx;
	border-bottom: 2rpx solid #edf0f5;
}

.wallet-record-item.is-last {
	border-bottom: none;
	padding-bottom: 10rpx;
}

.wallet-record-item__head {
	align-items: center;
	justify-content: space-between;
	column-gap: 24rpx;
}

.wallet-record-item__name {
	flex: 1;
	min-width: 0;
	font-size: 34rpx;
	font-weight: 500;
	line-height: 1.3;
	color: #1f232a;
}

.wallet-record-item__amount {
	flex: none;
	font-size: 34rpx;
	font-weight: 700;
	line-height: 1.2;
}

.wallet-record-item__amount.is-income {
	color: #24439b;
}

.wallet-record-item__amount.is-expense {
	color: #f16a5f;
}

.wallet-record-item__time {
	display: block;
	margin-top: 26rpx;
	font-size: 24rpx;
	line-height: 1.4;
	color: #a4a9b3;
}
</style>
