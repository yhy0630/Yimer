<template>
	<view class="coffee-wrap">
		<view class="coffee-hero">
			<image
				class="coffee-hero__bg"
				src="/bundle_coffee/static/bg/bakegrond.png"
				mode="widthFix"
			/>
			<view class="coffee-hero__nav" :style="{ paddingTop: `${topInset}px` }">
				<image
					class="coffee-hero__back"
					src="/static/images/back.png"
					mode="aspectFit"
					@tap="goBack"
				/>
			</view>
		</view>

		<view class="coffee-card">
			<view class="coffee-card__user">
				<u-avatar
					class="coffee-card__avatar"
					src="/static/linshi/01.png"
					size="80rpx"
					mode="circle"
					img-mode="aspectFill"
				/>
				<text class="coffee-card__name">{{ userName }}</text>
				<view class="coffee-card__scan" @tap="handleScan">
					<image
						class="coffee-card__scan-icon"
						src="/bundle_coffee/static/images/scan.png"
						mode="aspectFit"
					/>
				</view>
			</view>

			<view class="coffee-card__actions">
				<view class="coffee-card__action" @tap="handleOnlineOrder">
					<image
						class="coffee-card__action-icon"
						src="/bundle_coffee/static/images/cub.png"
						mode="aspectFit"
					/>
					<text class="coffee-card__action-label">在线点单</text>
				</view>
				<view class="coffee-card__action" @tap="handleViewOrders">
					<image
						class="coffee-card__action-icon"
						src="/bundle_coffee/static/images/task.png"
						mode="aspectFit"
					/>
					<text class="coffee-card__action-label">查看订单</text>
				</view>
			</view>
		</view>

		<view class="coffee-activities">
			<text class="coffee-activities__title">最新活动</text>
			<view class="coffee-activities__list">
				<image
					v-for="(item, index) in activityList"
					:key="index"
					class="coffee-activities__banner"
					:src="item"
					mode="widthFix"
					@tap="handleActivityTap(index)"
				/>
			</view>
		</view>
	</view>
</template>

<script>
const getTopInset = () => {
	try {
		const { statusBarHeight = 20 } = uni.getSystemInfoSync()
		return statusBarHeight + 8
	} catch (error) {
		return 28
	}
}

const ACTIVITY_LIST = ['/static/linshi/15.png', '/static/linshi/16.png']

export default {
	name: 'BundleCoffeeIndex',
	data() {
		return {
			topInset: getTopInset(),
			userName: '小伊贝011001',
			activityList: ACTIVITY_LIST
		}
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		showPending(title) {
			uni.showToast({
				title: `${title}待接入`,
				icon: 'none'
			})
		},
		handleScan() {
			this.showPending('扫一扫')
		},
		handleOnlineOrder() {
			uni.navigateTo({
				url: '/bundle_coffee/pages/menu/menu'
			})
		},
		handleViewOrders() {
			uni.navigateTo({
				url: '/bundle_coffee/pages/order_list/order_list'
			})
		},
		handleActivityTap(index) {
			this.showPending(`活动${index + 1}`)
		}
	}
}
</script>

<style scoped lang="scss">
.coffee-wrap {
	min-height: 100vh;
	padding-bottom: calc(env(safe-area-inset-bottom) + 40rpx);
	background: #f3f4f6;
}

.coffee-hero {
	position: relative;
	width: 100%;
}

.coffee-hero__bg {
	display: block;
	width: 100%;
}

.coffee-hero__nav {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	z-index: 2;
	padding-left: 36rpx;
	padding-right: 36rpx;
}

.coffee-hero__back {
	width: 40rpx;
	height: 40rpx;
}

.coffee-card {
	position: relative;
	z-index: 3;
	margin: -72rpx 44rpx 0;
	padding: 32rpx 28rpx 28rpx;
	border-radius: 24rpx;
	background: #ffffff;
	box-shadow: 0 8rpx 32rpx rgba(15, 35, 95, 0.08);
}

.coffee-card__user {
	display: flex;
	align-items: center;
}

.coffee-card__avatar {
	flex: none;
}

.coffee-card__name {
	flex: 1;
	min-width: 0;
	margin-left: 20rpx;
	font-size: 32rpx;
	font-weight: 600;
	color: #1a1b1d;
	line-height: 1.2;
}

.coffee-card__scan {
	flex: none;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 72rpx;
	height: 72rpx;
}

.coffee-card__scan-icon {
	width: 48rpx;
	height: 48rpx;
}

.coffee-card__actions {
	display: flex;
	align-items: stretch;
	gap: 24rpx;
	margin-top: 28rpx;
}

.coffee-card__action {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 168rpx;
	padding: 24rpx 16rpx;
	border: 2rpx solid #eceef2;
	border-radius: 20rpx;
	background: #ffffff;
}

.coffee-card__action-icon {
	width: 88rpx;
	height: 88rpx;
}

.coffee-card__action-label {
	margin-top: 16rpx;
	font-size: 28rpx;
	font-weight: 500;
	color: #242424;
	line-height: 1.2;
}

.coffee-activities {
	margin-top: 40rpx;
	padding: 0 44rpx;
}

.coffee-activities__title {
	display: block;
	font-size: 34rpx;
	font-weight: 600;
	color: #1a1b1d;
	line-height: 1.2;
}

.coffee-activities__list {
	margin-top: 24rpx;
}

.coffee-activities__banner {
	display: block;
	width: 100%;
	border-radius: 20rpx;
	overflow: hidden;

	& + & {
		margin-top: 24rpx;
	}
}
</style>
