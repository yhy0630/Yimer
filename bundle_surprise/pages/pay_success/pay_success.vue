<template>
	<view class="surprise-pay-success-page">
		<view class="surprise-pay-success-page__glow surprise-pay-success-page__glow--left"></view>
		<view class="surprise-pay-success-page__glow surprise-pay-success-page__glow--right"></view>

		<view class="surprise-pay-success-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="page-shell surprise-pay-success-page__nav">
				<view class="surprise-pay-success-page__back" @tap="handleBack">
					<u-icon name="arrow-left" size="46" color="#20232b"></u-icon>
				</view>
			</view>
		</view>

		<view class="page-shell surprise-pay-success-page__body">
			<view class="surprise-pay-success-page__icon">
				<view class="surprise-pay-success-page__check"></view>
			</view>

			<text class="surprise-pay-success-page__title">{{ pageContent.title }}</text>
			<text class="surprise-pay-success-page__desc">{{ pageContent.desc }}</text>

			<button class="surprise-pay-success-page__cta" hover-class="none" @tap="handleOrderTap">
				{{ pageContent.actionText }}
			</button>
		</view>
	</view>
</template>

<script>
const TAB_PAGES = ['/pages/index/index', '/pages/surprise/surprise', '/pages/service/service', '/pages/friend/friend', '/pages/user/user']
const DEFAULT_ORDER_URL = '/pages/user/user'

const PAGE_CONTENT = Object.freeze({
	title: '支付成功',
	desc: '可前往订单查看',
	actionText: '查看订单'
})

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

function isTabPage(url) {
	return TAB_PAGES.includes(url)
}

export default {
	data() {
		return {
			statusBarHeight: getStatusBarHeight(),
			pageContent: PAGE_CONTENT,
			orderUrl: DEFAULT_ORDER_URL
		}
	},
	onLoad(options = {}) {
		this.orderUrl = decodeUrlParam(options.orderUrl) || DEFAULT_ORDER_URL
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
				url: '/pages/surprise/surprise'
			})
		},
		handleOrderTap() {
			if (isTabPage(this.orderUrl)) {
				uni.switchTab({
					url: this.orderUrl
				})
				return
			}

			uni.redirectTo({
				url: this.orderUrl
			})
		}
	}
}
</script>

<style scoped lang="scss">
.surprise-pay-success-page {
	position: relative;
	min-height: 100vh;
	overflow: hidden;
	background:
		radial-gradient(circle at 50% -8%, rgba(224, 230, 243, 0.92) 0, rgba(224, 230, 243, 0.24) 340rpx, rgba(255, 255, 255, 0) 820rpx),
		linear-gradient(180deg, #f8f9fd 0%, #ffffff 320rpx, #ffffff 100%);
}

.surprise-pay-success-page__glow {
	position: absolute;
	pointer-events: none;
	border-radius: 50%;
	filter: blur(18rpx);
}

.surprise-pay-success-page__glow--left {
	top: -120rpx;
	left: -110rpx;
	width: 360rpx;
	height: 360rpx;
	background: rgba(255, 255, 255, 0.9);
}

.surprise-pay-success-page__glow--right {
	top: 150rpx;
	right: -110rpx;
	width: 320rpx;
	height: 240rpx;
	background: rgba(214, 223, 246, 0.38);
}

.surprise-pay-success-page__header {
	position: relative;
	z-index: 2;
}

.surprise-pay-success-page__nav {
	display: flex;
	align-items: center;
	height: 90rpx;
}

.surprise-pay-success-page__back {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 80rpx;
	height: 72rpx;
	margin-left: -8rpx;
}

.surprise-pay-success-page__body {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	min-height: calc(100vh - 90rpx);
	padding-top: 308rpx;
	padding-bottom: calc(env(safe-area-inset-bottom) + 120rpx);
	box-sizing: border-box;
}

.surprise-pay-success-page__icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 130rpx;
	height: 130rpx;
	border-radius: 50%;
	background: #49d978;
}

.surprise-pay-success-page__check {
	position: relative;
	width: 56rpx;
	height: 34rpx;
	border-left: 12rpx solid #ffffff;
	border-bottom: 12rpx solid #ffffff;
	border-bottom-left-radius: 10rpx;
	transform: rotate(-45deg) translateY(-4rpx);
}

.surprise-pay-success-page__title {
	margin-top: 64rpx;
	font-size: 58rpx;
	font-weight: 700;
	line-height: 1.12;
	color: #2c2f36;
}

.surprise-pay-success-page__desc {
	margin-top: 44rpx;
	font-size: 28rpx;
	line-height: 1.6;
	color: #9a9ea8;
	text-align: center;
}

.surprise-pay-success-page__cta {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 104rpx;
	margin-top: 84rpx;
	border: 2rpx solid #3a3f46;
	border-radius: 999rpx;
	background: transparent;
	font-size: 34rpx;
	font-weight: 500;
	line-height: 1;
	color: #2f333a;
}
</style>
