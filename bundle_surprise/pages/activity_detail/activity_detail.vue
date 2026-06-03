<template>
	<view class="surprise-activity-detail-page">
		<view class="surprise-activity-detail-page__hero">
			<image class="surprise-activity-detail-page__hero-image" :src="activity.heroImage" mode="aspectFill"></image>
			<view class="surprise-activity-detail-page__hero-mask"></view>

			<view class="surprise-activity-detail-page__nav" :style="{ paddingTop: `${statusBarHeight}px` }">
				<view class="page-shell surprise-activity-detail-page__nav-inner">
					<view class="surprise-activity-detail-page__nav-button is-back" @tap="goBack">
						<u-icon name="arrow-left" size="46" color="#ffffff"></u-icon>
					</view>
					<view class="surprise-activity-detail-page__nav-button" @tap="handleShare">
						<u-icon name="share" size="40" color="#ffffff"></u-icon>
					</view>
				</view>
			</view>
		</view>

		<view class="surprise-activity-detail-page__panel">
			<view class="page-shell surprise-activity-detail-page__content">
				<text class="surprise-activity-detail-page__title">{{ activity.title }}</text>

				<view class="surprise-activity-detail-page__tag-list">
					<text
						v-for="tag in activity.tags"
						:key="`${activity.id}-${tag}`"
						class="surprise-activity-detail-page__tag"
					>
						{{ tag }}
					</text>
				</view>

				<view class="surprise-activity-detail-page__info-group">
					<text class="surprise-activity-detail-page__date-range">{{ activity.dateRange }}</text>
					<text class="surprise-activity-detail-page__time-range">{{ activity.timeRange }}</text>
				</view>

				<view class="surprise-activity-detail-page__info-group is-location">
					<view class="surprise-activity-detail-page__info-main">
						<text class="surprise-activity-detail-page__venue">{{ activity.venue }}</text>
						<text class="surprise-activity-detail-page__address">{{ activity.address }}</text>
					</view>

					<view class="surprise-activity-detail-page__location-action" @tap="handleNavigate">
						<view class="surprise-activity-detail-page__location-icon">
							<view class="surprise-activity-detail-page__location-arrow"></view>
						</view>
						<text class="surprise-activity-detail-page__location-text">导航</text>
					</view>
				</view>

				<view class="surprise-activity-detail-page__info-group">
					<text class="surprise-activity-detail-page__quota">{{ activity.quotaText }}</text>
					<text class="surprise-activity-detail-page__quota-note">{{ activity.quotaNote }}</text>
				</view>

				<view class="surprise-activity-detail-page__section">
					<text class="surprise-activity-detail-page__section-title">活动介绍</text>
					<text class="surprise-activity-detail-page__section-text">{{ activity.introduction }}</text>
				</view>

				<view class="surprise-activity-detail-page__section">
					<text class="surprise-activity-detail-page__section-title">温馨提示</text>
					<text class="surprise-activity-detail-page__section-text">{{ activity.tips }}</text>
				</view>
			</view>
		</view>

		<view class="surprise-activity-detail-page__footer">
			<button
				:class="[
					'surprise-activity-detail-page__footer-button',
					`is-${footerAction.tone}`,
					footerAction.disabled ? 'is-disabled' : ''
				]"
				hover-class="none"
				:disabled="footerAction.disabled"
				@tap="handleFooterAction"
			>
				{{ footerAction.text }}
			</button>
		</view>

		<view v-if="showSuccessToast" class="surprise-activity-detail-page__toast">
			报名成功
		</view>
	</view>
</template>

<script>
import {
	ACTIVITY_STATUS,
	getSurpriseActivityById
} from './activity.data'

function getStatusBarHeight() {
	try {
		const { statusBarHeight = 20 } = uni.getSystemInfoSync()
		return statusBarHeight
	} catch (error) {
		return 20
	}
}

function normalizeNumber(value, fallback) {
	const number = Number(value)
	return Number.isFinite(number) && number > 0 ? number : fallback
}

export default {
	data() {
		return {
			statusBarHeight: getStatusBarHeight(),
			activity: getSurpriseActivityById(1),
			currentStatus: ACTIVITY_STATUS.OPEN,
			showSuccessToast: false,
			successToastTimer: null
		}
	},
	computed: {
		footerAction() {
			if (this.currentStatus === ACTIVITY_STATUS.SIGNED) {
				return {
					text: '已报名',
					tone: 'outline',
					disabled: false
				}
			}

			if (this.currentStatus === ACTIVITY_STATUS.CLOSED) {
				return {
					text: '报名已截止',
					tone: 'muted',
					disabled: true
				}
			}

			if (this.currentStatus === ACTIVITY_STATUS.ENDED) {
				return {
					text: '活动已结束',
					tone: 'muted',
					disabled: true
				}
			}

			const pointsText = this.activity.pointsCost > 0 ? `（${this.activity.pointsCost}积分）` : ''
			return {
				text: `立即报名${pointsText}`,
				tone: 'primary',
				disabled: false
			}
		}
	},
	onLoad(options = {}) {
		const activityId = normalizeNumber(options.id, 1)
		const activity = getSurpriseActivityById(activityId)

		this.activity = activity
		this.currentStatus = activity.statusKey || ACTIVITY_STATUS.OPEN
	},
	onUnload() {
		this.clearSuccessToastTimer()
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
		handleShare() {
			uni.showToast({
				title: '分享功能开发中',
				icon: 'none'
			})
		},
		handleNavigate() {
			if (!this.activity.latitude || !this.activity.longitude) {
				uni.showToast({
					title: '暂未配置导航坐标',
					icon: 'none'
				})
				return
			}

			uni.openLocation({
				latitude: Number(this.activity.latitude),
				longitude: Number(this.activity.longitude),
				name: this.activity.venue,
				address: this.activity.address,
				fail: () => {
					uni.showToast({
						title: '导航打开失败',
						icon: 'none'
					})
				}
			})
		},
		handleFooterAction() {
			if (this.currentStatus === ACTIVITY_STATUS.OPEN) {
				this.currentStatus = ACTIVITY_STATUS.SIGNED
				this.activity.status = '已报名'
				this.activity.statusTone = 'muted'
				this.activity.statusKey = ACTIVITY_STATUS.SIGNED
				this.activity.quotaNote = '您已完成报名，可按时到场'
				this.showRegisterSuccessToast()
				return
			}

			if (this.currentStatus === ACTIVITY_STATUS.SIGNED) {
				uni.showToast({
					title: '您已报名成功',
					icon: 'none'
				})
			}
		},
		showRegisterSuccessToast() {
			this.clearSuccessToastTimer()
			this.showSuccessToast = true
			this.successToastTimer = setTimeout(() => {
				this.showSuccessToast = false
				this.successToastTimer = null
			}, 1600)
		},
		clearSuccessToastTimer() {
			if (this.successToastTimer) {
				clearTimeout(this.successToastTimer)
				this.successToastTimer = null
			}
		}
	}
}
</script>

<style scoped lang="scss">
.surprise-activity-detail-page {
	min-height: 100vh;
	padding-bottom: calc(184rpx + env(safe-area-inset-bottom));
	background: #ffffff;
}

.surprise-activity-detail-page__hero {
	position: relative;
	height: 748rpx;
	background: #dfe8f6;
}

.surprise-activity-detail-page__hero-image,
.surprise-activity-detail-page__hero-mask {
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
}

.surprise-activity-detail-page__hero-image {
	display: block;
}

.surprise-activity-detail-page__hero-mask {
	background:
		linear-gradient(180deg, rgba(18, 28, 52, 0.18) 0%, rgba(18, 28, 52, 0.06) 28%, rgba(18, 28, 52, 0) 48%),
		linear-gradient(180deg, rgba(8, 12, 22, 0) 58%, rgba(8, 12, 22, 0.08) 100%);
}

.surprise-activity-detail-page__nav {
	position: relative;
	z-index: 2;
}

.surprise-activity-detail-page__nav-inner {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 92rpx;
}

.surprise-activity-detail-page__nav-button {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 72rpx;
	height: 72rpx;
}

.surprise-activity-detail-page__nav-button.is-back {
	margin-left: -12rpx;
}

.surprise-activity-detail-page__panel {
	position: relative;
	z-index: 2;
	margin-top: -12rpx;
	border-radius: 24rpx 24rpx 0 0;
	background: #ffffff;
}

.surprise-activity-detail-page__content {
	padding-top: 44rpx;
	padding-bottom: 72rpx;
}

.surprise-activity-detail-page__title {
	display: block;
	font-size: 56rpx;
	line-height: 1.28;
	font-weight: 500;
	color: #1d2028;
}

.surprise-activity-detail-page__tag-list {
	display: flex;
	flex-wrap: wrap;
	margin-top: 38rpx;
}

.surprise-activity-detail-page__tag {
	margin-right: 18rpx;
	margin-bottom: 18rpx;
	padding: 14rpx 26rpx;
	background: #f5f5f6;
	font-size: 24rpx;
	line-height: 1;
	color: #8f9197;
}

.surprise-activity-detail-page__info-group {
	padding-top: 40rpx;
}

.surprise-activity-detail-page__date-range,
.surprise-activity-detail-page__venue,
.surprise-activity-detail-page__quota {
	display: block;
	font-size: 34rpx;
	line-height: 1.35;
	font-weight: 600;
	color: #1f2229;
}

.surprise-activity-detail-page__time-range,
.surprise-activity-detail-page__address,
.surprise-activity-detail-page__quota-note {
	display: block;
	margin-top: 16rpx;
	font-size: 28rpx;
	line-height: 1.5;
	color: #9296a1;
}

.surprise-activity-detail-page__info-group.is-location {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
}

.surprise-activity-detail-page__info-main {
	flex: 1;
	min-width: 0;
	padding-right: 28rpx;
}

.surprise-activity-detail-page__location-action {
	flex: none;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 6rpx;
}

.surprise-activity-detail-page__location-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 88rpx;
	height: 88rpx;
	border: 2rpx solid #ebedf0;
	border-radius: 50%;
	background: #ffffff;
}

.surprise-activity-detail-page__location-arrow {
	position: relative;
	width: 24rpx;
	height: 24rpx;
	border-top: 4rpx solid #6a7388;
	border-right: 4rpx solid #6a7388;
	border-radius: 2rpx;
	transform: rotate(12deg);
}

.surprise-activity-detail-page__location-arrow::after {
	content: '';
	position: absolute;
	left: -4rpx;
	top: 9rpx;
	width: 28rpx;
	height: 4rpx;
	border-radius: 999rpx;
	background: #6a7388;
	transform: rotate(-58deg);
	transform-origin: left center;
}

.surprise-activity-detail-page__location-text {
	margin-top: 12rpx;
	font-size: 26rpx;
	line-height: 1;
	color: #8e919a;
}

.surprise-activity-detail-page__section {
	padding-top: 70rpx;
}

.surprise-activity-detail-page__section-title {
	display: block;
	font-size: 52rpx;
	line-height: 1.2;
	font-weight: 500;
	color: #171a21;
}

.surprise-activity-detail-page__section-text {
	display: block;
	margin-top: 36rpx;
	font-size: 30rpx;
	line-height: 1.7;
	color: #3d424c;
}

.surprise-activity-detail-page__footer {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 6;
	padding: 24rpx 44rpx calc(24rpx + env(safe-area-inset-bottom));
	background: rgba(255, 255, 255, 0.98);
}

.surprise-activity-detail-page__footer-button {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 90rpx;
	border-radius: 999rpx;
	font-size: 32rpx;
	line-height: 1;
	font-weight: 500;
}

.surprise-activity-detail-page__footer-button.is-primary {
	color: #ffffff;
	background: #143080;
}

.surprise-activity-detail-page__footer-button.is-outline {
	color: #143080;
	border: 2rpx solid #143080;
	background: #ffffff;
}

.surprise-activity-detail-page__footer-button.is-muted {
	color: #ffffff;
	background: #b7bac1;
}

.surprise-activity-detail-page__footer-button.is-disabled {
	opacity: 1;
}

.surprise-activity-detail-page__toast {
	position: fixed;
	left: 50%;
	top: 48%;
	z-index: 8;
	transform: translate(-50%, -50%);
	padding: 26rpx 44rpx;
	border-radius: 12rpx;
	background: rgba(24, 24, 24, 0.82);
	font-size: 28rpx;
	line-height: 1;
	color: #ffffff;
}

@media screen and (max-width: 360px) {
	.surprise-activity-detail-page__title {
		font-size: 48rpx;
	}

	.surprise-activity-detail-page__section-title {
		font-size: 46rpx;
	}

	.surprise-activity-detail-page__footer {
		padding-left: 30rpx;
		padding-right: 30rpx;
	}
}
</style>
