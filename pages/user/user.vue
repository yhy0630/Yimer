<template>
	<view class="user-page" :style="{ paddingTop: `${topInset}px` }">
		<view class="page-shell user-page__shell">
			<view class="user-page__hero">
				<view class="user-page__setting" @tap="showPending('设置')">
					<u-icon name="setting" :size="34" color="#2f3542"></u-icon>
				</view>

				<view class="user-page__avatar" @tap="goLogin">
					<view class="user-page__avatar-head"></view>
					<view class="user-page__avatar-body"></view>
				</view>

				<view class="user-page__login-row" @tap="goLogin">
					<text class="user-page__login-text">{{ profileCta.title }}</text>
					<u-icon name="arrow-right" :size="28" color="#8e96a5"></u-icon>
				</view>

				<view class="benefit-card" @tap="showPending(profileCta.memberAction)">
					<text class="benefit-card__title">{{ profileCta.memberLabel }}</text>
					<view class="benefit-card__action">
						<text class="benefit-card__action-text">{{ profileCta.memberAction }}</text>
						<u-icon name="arrow-right" :size="24" color="#273f93"></u-icon>
					</view>
				</view>
			</view>

			<view class="panel-card tools-card">
				<view
					v-for="item in toolEntries"
					:key="item.title"
					class="tools-card__item"
					@tap="handleEntryTap(item)"
				>
					<view class="tools-card__icon">
						<u-icon :name="item.icon" :size="48" color="#373b44"></u-icon>
					</view>
					<text class="tools-card__label">{{ item.title }}</text>
				</view>
			</view>

			<view class="panel-card link-card">
				<view
					v-for="(item, index) in secondaryLinks"
					:key="item.title"
					:class="['link-card__row', index === secondaryLinks.length - 1 ? 'is-last' : '']"
					@tap="handleEntryTap(item)"
				>
					<text class="link-card__title">{{ item.title }}</text>
					<u-icon name="arrow-right" :size="26" color="#3f454f"></u-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
const getTopInset = () => {
	try {
		const { statusBarHeight = 20 } = uni.getSystemInfoSync()
		return statusBarHeight + 18
	} catch (error) {
		return 38
	}
}

const PROFILE_CTA = {
	title: '点击登录注册',
	memberLabel: '我的权益',
	memberAction: '解锁会员'
}

const TOOL_ENTRIES = [
	{ title: '挂号记录', icon: 'calendar' },
	{ title: '签署', icon: 'edit-pen' },
	{ title: '自助缴费', icon: 'rmb-circle' },
	{ title: '我的病历', icon: 'file-text' },
	{ title: '我的订单', icon: 'order' },
	{ title: '购物车', icon: 'shopping-cart' },
	{ title: '我的收藏', icon: 'heart' },
	{ title: '收货地址', icon: 'map' },
	{ title: '紧急联系人', icon: 'account' },
	{ title: '投诉建议', icon: 'edit-pen-fill' }
]

const SECONDARY_LINKS = [
	{ title: '邀请有礼' },
	{ title: '首席质量服务官' },
	{ title: '我要成为代理' }
]

export default {
	data() {
		return {
			topInset: getTopInset(),
			profileCta: PROFILE_CTA,
			toolEntries: TOOL_ENTRIES,
			secondaryLinks: SECONDARY_LINKS
		}
	},
	methods: {
		goLogin() {
			uni.navigateTo({
				url: '/pages/login/login'
			})
		},
		handleEntryTap(item) {
			this.showPending(item.title)
		},
		showPending(title) {
			uni.showToast({
				title: `${title}待接入`,
				icon: 'none'
			})
		}
	}
}
</script>

<style scoped lang="scss">
.user-page {
	min-height: 100vh;
	background:
		radial-gradient(circle at 18% 2%, rgba(213, 223, 248, 0.96) 0, rgba(213, 223, 248, 0.78) 18%, rgba(213, 223, 248, 0) 48%),
		radial-gradient(circle at 100% 0, rgba(241, 229, 211, 0.68) 0, rgba(241, 229, 211, 0) 28%),
		linear-gradient(180deg, #f6f8fd 0%, #f7f7f8 320rpx, #f3f4f6 100%);
}

.user-page__shell {
	padding-bottom: calc(env(safe-area-inset-bottom) + 188rpx);
}

.user-page__hero {
	position: relative;
	padding-top: 16rpx;
}

.user-page__setting {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 76rpx;
	height: 76rpx;
	margin-left: auto;
	border-radius: 24rpx;
	background: rgba(255, 255, 255, 0.56);
	box-shadow: 0 12rpx 28rpx rgba(35, 45, 79, 0.06);
}

.user-page__avatar {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 120rpx;
	height: 120rpx;
	margin-top: 128rpx;
	border-radius: 50%;
	background: linear-gradient(180deg, rgba(250, 250, 251, 0.95) 0%, rgba(236, 239, 245, 0.98) 100%);
	box-shadow: inset 0 0 0 2rpx rgba(255, 255, 255, 0.72);
}

.user-page__avatar-head {
	position: absolute;
	top: 26rpx;
	left: 50%;
	width: 42rpx;
	height: 46rpx;
	border-radius: 50% 50% 44% 44%;
	background: #d7dbe4;
	transform: translateX(-50%);
}

.user-page__avatar-head::before {
	content: '';
	position: absolute;
	left: 50%;
	top: 16rpx;
	width: 44rpx;
	height: 26rpx;
	border-radius: 24rpx 24rpx 8rpx 8rpx;
	background: #cdd2dc;
	transform: translateX(-50%);
}

.user-page__avatar-body {
	position: absolute;
	left: 50%;
	bottom: 18rpx;
	width: 68rpx;
	height: 36rpx;
	border-radius: 40rpx 40rpx 16rpx 16rpx;
	background: #c9ced8;
	transform: translateX(-50%);
}

.user-page__login-row {
	display: inline-flex;
	align-items: center;
	margin-top: 54rpx;
}

.user-page__login-text {
	font-size: 70rpx;
	font-weight: 700;
	line-height: 1.08;
	color: #1f232b;
}

.benefit-card {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 72rpx;
	padding: 0 38rpx 0 34rpx;
	height: 104rpx;
	border-radius: 22rpx;
	background:
		linear-gradient(90deg, rgba(234, 243, 253, 0.96) 0%, rgba(243, 246, 255, 0.9) 58%, rgba(246, 245, 252, 0.94) 100%);
	box-shadow: 0 16rpx 30rpx rgba(40, 55, 96, 0.04);
}

.benefit-card__title {
	font-size: 30rpx;
	color: #222833;
}

.benefit-card__action {
	display: inline-flex;
	align-items: center;
}

.benefit-card__action-text {
	margin-right: 10rpx;
	font-size: 24rpx;
	font-weight: 500;
	color: #273f93;
}

.panel-card {
	border-radius: 28rpx;
	background: #ffffff;
	box-shadow: 0 16rpx 34rpx rgba(24, 30, 52, 0.04);
}

.tools-card {
	display: flex;
	flex-wrap: wrap;
	margin-top: 12rpx;
	padding: 38rpx 0 10rpx;
}

.tools-card__item {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 25%;
	margin-bottom: 54rpx;
}

.tools-card__icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 72rpx;
	height: 72rpx;
}

.tools-card__label {
	margin-top: 20rpx;
	font-size: 24rpx;
	line-height: 1.25;
	color: #3b4049;
}

.link-card {
	margin-top: 34rpx;
	overflow: hidden;
}

.link-card__row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 116rpx;
	padding: 0 40rpx;
	border-bottom: 2rpx solid #f2f3f5;
}

.link-card__row.is-last {
	border-bottom: 0;
}

.link-card__title {
	font-size: 28rpx;
	color: #2b3038;
}
</style>
