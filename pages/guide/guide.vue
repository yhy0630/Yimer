<template>
	<view class="guide-page flex-col">
		<view class="guide-page__panel page-shell">
			<view class="guide-page__skip-wrap flex">
				<button class="guide-page__skip flex row-center br60 primary" hover-class="none" @click="goHome">
					<text>{{ skipText }}</text>
				</button>
			</view>

			<view class="guide-page__hero">
				<text class="guide-page__title block black">{{ guideContent.title }}</text>
				<text class="guide-page__subtitle block normal nr lh-16 m-t-30">{{ guideContent.subtitle }}</text>
			</view>
		</view>

		<view class="guide-page__visual">
			<image class="guide-page__image block w-full" :src="guideContent.image" mode="widthFix" />
		</view>
	</view>
</template>

<script>
	const GUIDE_COUNTDOWN = 3
	const GUIDE_CONTENT = {
		title: '欢迎您加入伊美尔',
		subtitle: '让我们一起享受愉悦的生活方式',
		image: '/static/images/guidance.png',
		homePath: '/pages/index/index',
		skipSuffix: 's跳过'
	}

	export default {
		data() {
			return {
				countdown: GUIDE_COUNTDOWN,
				timer: null,
				isRedirecting: false,
				guideContent: GUIDE_CONTENT
			}
		},
		computed: {
			skipText() {
				return `${this.countdown}${this.guideContent.skipSuffix}`
			}
		},
		onLoad() {
			this.startCountdown()
		},
		onShow() {
			if (!this.isRedirecting && !this.timer) {
				this.startCountdown()
			}
		},
		onHide() {
			this.clearCountdown()
		},
		onUnload() {
			this.clearCountdown()
		},
		methods: {
			startCountdown() {
				this.clearCountdown()
				this.countdown = GUIDE_COUNTDOWN
				this.timer = setInterval(() => {
					if (this.countdown <= 1) {
						this.goHome()
						return
					}
					this.countdown -= 1
				}, 1000)
			},
			clearCountdown() {
				if (this.timer) {
					clearInterval(this.timer)
					this.timer = null
				}
			},
			goHome() {
				if (this.isRedirecting) {
					return
				}
				this.isRedirecting = true
				this.clearCountdown()
				uni.switchTab({
					url: this.guideContent.homePath,
					fail: () => {
						uni.reLaunch({
							url: this.guideContent.homePath,
							fail: () => {
								this.isRedirecting = false
							}
						})
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.guide-page {
		position: relative;
		min-height: 100vh;
		overflow: hidden;
	}

	.guide-page__panel {
		position: relative;
		z-index: 2;
		padding-top: calc(env(safe-area-inset-top) + 88rpx);
	}

	.guide-page__skip-wrap {
		width: 100%;
		padding-right: 2rpx;
	}

	/* #ifdef APP-PLUS */
	.guide-page__skip-wrap {
		justify-content: flex-end;
	}
	/* #endif */

	/* #ifdef MP-WEIXIN */
	.guide-page__skip-wrap {
		justify-content: flex-start;
		padding-right: 0;
	}
	/* #endif */

	.guide-page__skip {
		width: 172rpx;
		height: 72rpx;
		border: 2rpx solid #244392;
		background: rgba(255, 255, 255, 0.98);
		font-size: 26rpx;
		font-weight: 400;
	}

	.guide-page__hero {
		width: 100%;
		max-width: 640rpx;
		margin-top: 68rpx;
	}

	.guide-page__title {
		font-size: 78rpx;
		font-weight: 400;
		line-height: 1.18;
		letter-spacing: 0;
	}

	.guide-page__subtitle {
		max-width: 440rpx;
		color: #2f3137;
		font-size: 29rpx;
	}

	.guide-page__visual {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		margin-top: auto;
	}
</style>
