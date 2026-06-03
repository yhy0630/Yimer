<template>
	<view class="payment-success-page">
		<view class="payment-success-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="page-shell payment-success-page__nav">
				<view class="payment-success-page__back" @tap="handleBack">
					<u-icon name="arrow-left" size="48" color="#171717"></u-icon>
				</view>
			</view>
		</view>

		<view class="page-shell payment-success-page__body">
			<view class="payment-success-page__icon">
				<view class="payment-success-page__check"></view>
			</view>

			<text class="payment-success-page__title">缴费成功</text>
			<text class="payment-success-page__desc">您的缴费已成功，有问题请联系客服</text>

			<button class="payment-success-page__cta" hover-class="none" @tap="handleHomeTap">返回首页</button>
		</view>
	</view>
</template>

<script>
const HOME_URL = '/pages/index/index'

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
			statusBarHeight: getStatusBarHeight()
		}
	},
	methods: {
		handleBack() {
			const pages = getCurrentPages()

			if (pages.length > 1) {
				uni.navigateBack({
					delta: 1
				})
				return
			}

			uni.switchTab({
				url: HOME_URL
			})
		},
		handleHomeTap() {
			uni.switchTab({
				url: HOME_URL
			})
		}
	}
}
</script>

<style scoped lang="scss">
.payment-success-page {
	min-height: 100vh;
	background:
		radial-gradient(circle at 50% 0, rgba(242, 242, 242, 0.95) 0, rgba(255, 255, 255, 0.96) 360rpx, #ffffff 860rpx),
		linear-gradient(180deg, #ffffff 0%, #ffffff 100%);
}

.payment-success-page__header {
	background: transparent;
}

.payment-success-page__nav {
	display: flex;
	align-items: center;
	height: 96rpx;
}

.payment-success-page__back {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 72rpx;
	height: 72rpx;
	margin-left: -12rpx;
}

.payment-success-page__body {
	display: flex;
	flex-direction: column;
	align-items: center;
	min-height: calc(100vh - 96rpx);
	padding-top: 292rpx;
	padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
	box-sizing: border-box;
}

.payment-success-page__icon {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 162rpx;
	height: 162rpx;
	border-radius: 50%;
	background: #49d978;
}

.payment-success-page__check {
	position: relative;
	width: 62rpx;
	height: 38rpx;
	border-left: 14rpx solid #ffffff;
	border-bottom: 14rpx solid #ffffff;
	border-bottom-left-radius: 10rpx;
	transform: rotate(-45deg) translateY(-6rpx);
}

.payment-success-page__title {
	margin-top: 74rpx;
	font-size: 58rpx;
	font-weight: 700;
	line-height: 1.12;
	color: #2a2d33;
}

.payment-success-page__desc {
	margin-top: 46rpx;
	font-size: 28rpx;
	line-height: 1.6;
	color: #8f949d;
	text-align: center;
}

.payment-success-page__cta {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 104rpx;
	margin-top: 86rpx;
	border: 2rpx solid #404349;
	border-radius: 999rpx;
	background: transparent;
	font-size: 34rpx;
	font-weight: 500;
	line-height: 1;
	color: #30333a;
}
</style>
