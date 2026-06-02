<template>
	<view class="sign-result-page">
		<view class="sign-result-page__glow sign-result-page__glow--left"></view>
		<view class="sign-result-page__glow sign-result-page__glow--right"></view>

		<view class="sign-result-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="page-shell sign-result-page__nav">
				<view class="sign-result-page__back" @tap="handleBack">
					<u-icon name="arrow-left" size="46" color="#20232b"></u-icon>
				</view>
			</view>
		</view>

		<view class="page-shell sign-result-page__body">
			<view :class="['result-icon', `is-${status}`]">
				<view v-if="isSuccess" class="result-icon__check"></view>
				<view v-else class="result-icon__error">
					<view class="result-icon__error-line"></view>
					<view class="result-icon__error-dot"></view>
				</view>
			</view>

			<text class="sign-result-page__title">{{ currentResult.title }}</text>
			<text class="sign-result-page__desc">{{ currentResult.desc }}</text>

			<button class="sign-result-page__cta" @tap="handlePrimaryAction">
				{{ currentResult.actionText }}
			</button>
		</view>
	</view>
</template>

<script>
const DEFAULT_SUCCESS_URL = '/bundle/pages/intelligent_guide/intelligent_guide'
const DEFAULT_FALLBACK_URL = '/bundle/pages/sign_center/sign_center'

// Keep result copy and action text centralized so later status expansion stays data-driven.
const RESULT_MAP = Object.freeze({
	success: {
		title: '签署成功',
		desc: '您的单据签署成功',
		actionText: '进入智能导诊'
	},
	fail: {
		title: '签署失败',
		desc: '您的合同/文件签署失败，请重新签署',
		actionText: '重新签署'
	}
})

function getStatusBarHeight() {
	try {
		const { statusBarHeight = 20 } = uni.getSystemInfoSync()
		return statusBarHeight
	} catch (error) {
		return 20
	}
}

function normalizeStatus(status) {
	return ['fail', 'failure', 'error', '0'].includes(String(status || '').toLowerCase())
		? 'fail'
		: 'success'
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
			status: 'success',
			retryUrl: '',
			successUrl: DEFAULT_SUCCESS_URL
		}
	},
	computed: {
		isSuccess() {
			return this.status === 'success'
		},
		currentResult() {
			return RESULT_MAP[this.status] || RESULT_MAP.success
		}
	},
	onLoad(options = {}) {
		this.status = normalizeStatus(options.status)
		this.retryUrl = decodeUrlParam(options.retryUrl)
		this.successUrl = decodeUrlParam(options.successUrl) || DEFAULT_SUCCESS_URL
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
				url: this.status === 'fail' && this.retryUrl ? this.retryUrl : DEFAULT_FALLBACK_URL
			})
		},
		handlePrimaryAction() {
			if (this.isSuccess) {
				uni.redirectTo({
					url: this.successUrl
				})
				return
			}

			const pages = getCurrentPages()

			if (pages.length > 1) {
				uni.navigateBack({
					delta: 1
				})
				return
			}

			uni.redirectTo({
				url: this.retryUrl || DEFAULT_FALLBACK_URL
			})
		}
	}
}
</script>

<style scoped lang="scss">
.sign-result-page {
	position: relative;
	min-height: 100vh;
	background:
		radial-gradient(circle at 50% -6%, rgba(221, 227, 244, 0.92) 0, rgba(221, 227, 244, 0.24) 320rpx, rgba(255, 255, 255, 0) 760rpx),
		linear-gradient(180deg, #f8f9fd 0%, #ffffff 360rpx, #ffffff 100%);
}

.sign-result-page__glow {
	position: absolute;
	pointer-events: none;
	border-radius: 50%;
	filter: blur(18rpx);
}

.sign-result-page__glow--left {
	top: -120rpx;
	left: -110rpx;
	width: 360rpx;
	height: 360rpx;
	background: rgba(255, 255, 255, 0.9);
}

.sign-result-page__glow--right {
	top: 180rpx;
	right: -96rpx;
	width: 320rpx;
	height: 240rpx;
	background: rgba(214, 223, 246, 0.42);
}

.sign-result-page__header {
	position: relative;
	z-index: 2;
}

.sign-result-page__nav {
	display: flex;
	align-items: center;
	height: 90rpx;
}

.sign-result-page__back {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 80rpx;
	height: 72rpx;
	margin-left: -8rpx;
}

.sign-result-page__body {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	min-height: calc(100vh - 90rpx);
	padding-top: 300rpx;
	padding-bottom: calc(env(safe-area-inset-bottom) + 120rpx);
	box-sizing: border-box;
}

.result-icon {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 132rpx;
	height: 132rpx;
	border-radius: 50%;
}

.result-icon.is-success {
	background: #48d779;
}

.result-icon.is-fail {
	background: #ff5c4d;
}

.result-icon__check {
	position: relative;
	width: 58rpx;
	height: 34rpx;
	border-left: 12rpx solid #ffffff;
	border-bottom: 12rpx solid #ffffff;
	border-bottom-left-radius: 10rpx;
	transform: rotate(-45deg) translateY(-4rpx);
}

.result-icon__error {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.result-icon__error-line {
	width: 16rpx;
	height: 54rpx;
	border-radius: 999rpx;
	background: #ffffff;
}

.result-icon__error-dot {
	width: 16rpx;
	height: 16rpx;
	margin-top: 10rpx;
	border-radius: 50%;
	background: #ffffff;
}

.sign-result-page__title {
	margin-top: 62rpx;
	font-size: 58rpx;
	font-weight: 700;
	line-height: 1.12;
	color: #2c2f36;
}

.sign-result-page__desc {
	margin-top: 42rpx;
	font-size: 28rpx;
	line-height: 1.6;
	color: #9a9ea8;
	text-align: center;
}

.sign-result-page__cta {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 104rpx;
	margin-top: 80rpx;
	border: 2rpx solid #3a3f46;
	border-radius: 999rpx;
	background: transparent;
	font-size: 34rpx;
	font-weight: 500;
	line-height: 1;
	color: #2f333a;
}
</style>
