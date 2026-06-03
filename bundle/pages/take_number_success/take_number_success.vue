<template>
	<view class="take-number-success-page">
		<view class="take-number-success-page__glow take-number-success-page__glow--left"></view>
		<view class="take-number-success-page__glow take-number-success-page__glow--right"></view>

		<view class="take-number-success-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="page-shell take-number-success-page__nav">
				<view class="take-number-success-page__back" @tap="handleBack">
					<u-icon name="arrow-left" size="46" color="#20232b"></u-icon>
				</view>
			</view>
		</view>

		<view class="page-shell take-number-success-page__body">
			<view class="take-number-success-page__icon">
				<view class="take-number-success-page__check"></view>
			</view>

			<text class="take-number-success-page__title">取号成功</text>
			<text class="take-number-success-page__desc">您已取号成功，有问题请联系客服</text>

			<button class="take-number-success-page__cta" hover-class="none" @tap="handleGuideTap">
				进入智能导诊
			</button>
		</view>
	</view>
</template>

<script>
const DEFAULT_GUIDE_URL = '/bundle/pages/intelligent_guide/intelligent_guide'
const DEFAULT_BACK_URL = '/bundle/pages/scan_take_number/scan_take_number'

function getStatusBarHeight() {
	try {
		const { statusBarHeight = 20 } = uni.getSystemInfoSync()
		return statusBarHeight
	} catch (error) {
		return 20
	}
}

function decodeUrlParam(value) {
	if (!value) {
		return ''
	}

	try {
		return decodeURIComponent(value)
	} catch (error) {
		return value
	}
}

export default {
	data() {
		return {
			statusBarHeight: getStatusBarHeight(),
			guideUrl: DEFAULT_GUIDE_URL,
			backUrl: DEFAULT_BACK_URL
		}
	},
	onLoad(options = {}) {
		this.guideUrl = decodeUrlParam(options.guideUrl) || DEFAULT_GUIDE_URL
		this.backUrl = decodeUrlParam(options.backUrl) || DEFAULT_BACK_URL
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

			uni.redirectTo({
				url: this.backUrl
			})
		},
		handleGuideTap() {
			uni.redirectTo({
				url: this.guideUrl
			})
		}
	}
}
</script>

<style scoped lang="scss">
.take-number-success-page {
	position: relative;
	min-height: 100vh;
	overflow: hidden;
	background:
		radial-gradient(circle at 50% -10%, rgba(228, 233, 244, 0.9) 0, rgba(228, 233, 244, 0.22) 360rpx, rgba(255, 255, 255, 0) 860rpx),
		linear-gradient(180deg, #f8f9fd 0%, #ffffff 340rpx, #ffffff 100%);
}

.take-number-success-page__glow {
	position: absolute;
	pointer-events: none;
	border-radius: 50%;
	filter: blur(18rpx);
}

.take-number-success-page__glow--left {
	top: -120rpx;
	left: -110rpx;
	width: 360rpx;
	height: 360rpx;
	background: rgba(255, 255, 255, 0.92);
}

.take-number-success-page__glow--right {
	top: 120rpx;
	right: -120rpx;
	width: 320rpx;
	height: 260rpx;
	background: rgba(214, 223, 246, 0.34);
}

.take-number-success-page__header {
	position: relative;
	z-index: 2;
}

.take-number-success-page__nav {
	display: flex;
	align-items: center;
	height: 90rpx;
}

.take-number-success-page__back {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 80rpx;
	height: 72rpx;
	margin-left: -8rpx;
}

.take-number-success-page__body {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	min-height: calc(100vh - 90rpx);
	padding-top: 306rpx;
	padding-bottom: calc(env(safe-area-inset-bottom) + 120rpx);
	box-sizing: border-box;
}

.take-number-success-page__icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 130rpx;
	height: 130rpx;
	border-radius: 50%;
	background: #49d978;
}

.take-number-success-page__check {
	position: relative;
	width: 56rpx;
	height: 34rpx;
	border-left: 12rpx solid #ffffff;
	border-bottom: 12rpx solid #ffffff;
	border-bottom-left-radius: 10rpx;
	transform: rotate(-45deg) translateY(-4rpx);
}

.take-number-success-page__title {
	margin-top: 64rpx;
	font-size: 58rpx;
	font-weight: 700;
	line-height: 1.12;
	color: #2c2f36;
}

.take-number-success-page__desc {
	margin-top: 42rpx;
	font-size: 28rpx;
	line-height: 1.6;
	color: #9a9ea8;
	text-align: center;
}

.take-number-success-page__cta {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 104rpx;
	margin-top: 82rpx;
	border: 2rpx solid #3a3f46;
	border-radius: 999rpx;
	background: transparent;
	font-size: 34rpx;
	font-weight: 500;
	line-height: 1;
	color: #2f333a;
}
</style>
