<template>
	<view class="message-page">
		<view class="message-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="page-shell message-page__nav">
				<view class="message-page__back" @tap="goBack">
					<u-icon name="arrow-left" size="46" color="#111111"></u-icon>
				</view>
				<text class="message-page__clear" @tap="handleClearUnread">清除未读</text>
			</view>

			<view class="page-shell message-page__tabs">
				<text
					v-for="tab in tabs"
					:key="tab.key"
					:class="['message-page__tab', activeTab === tab.key ? 'is-active' : '']"
					@tap="activeTab = tab.key"
				>
					{{ tab.label }}
				</text>
			</view>
		</view>

		<view class="page-shell message-page__body">
			<view
				v-for="item in activeMessages"
				:key="item.id"
				class="message-item"
				@tap="handleMessageTap(item)"
			>
				<view class="message-item__icon-shell">
					<view class="message-item__icon">
						<u-icon name="bell" size="42" color="#1d3f96"></u-icon>
					</view>
				</view>

				<view class="message-item__content">
					<view class="message-item__row">
						<text class="message-item__title line-1">{{ item.title }}</text>
						<text class="message-item__date">{{ item.date }}</text>
					</view>
					<view class="message-item__row message-item__row--bottom">
						<text class="message-item__desc line-1">{{ item.summary }}</text>
						<view v-if="item.unread" class="message-item__dot"></view>
					</view>
				</view>
			</view>

			<view v-if="!activeMessages.length" class="message-empty">
				<text class="message-empty__title">暂无通知</text>
				<text class="message-empty__desc">当前分类下还没有新的消息提醒</text>
			</view>
		</view>
	</view>
</template>

<script>
const TABS = [
	{ key: 'all', label: '全部' },
	{ key: 'system', label: '系统' },
	{ key: 'trade', label: '交易' },
	{ key: 'activity', label: '活动' }
]

const MESSAGE_LIST = [
	{
		id: 'system-1',
		type: 'system',
		title: '系统通知',
		summary: '沿途您好，您的预约临近时间，请注意行程安排',
		date: '04/25',
		unread: true
	},
	{
		id: 'trade-1',
		type: 'trade',
		title: '交易通知',
		summary: '沿途您好，您的预约临近时间，请注意行程安排',
		date: '04/25',
		unread: true
	},
	{
		id: 'activity-1',
		type: 'activity',
		title: '活动通知',
		summary: '沿途您好，您的预约临近时间，请注意行程安排',
		date: '04/25',
		unread: true
	},
	{
		id: 'activity-2',
		type: 'activity',
		title: '活动通知',
		summary: '沿途您好，您的预约临近时间，请注意行程安排',
		date: '04/25',
		unread: false
	},
	{
		id: 'activity-3',
		type: 'activity',
		title: '活动通知',
		summary: '沿途您好，您的预约临近时间，请注意行程安排',
		date: '04/25',
		unread: false
	},
	{
		id: 'activity-4',
		type: 'activity',
		title: '活动通知',
		summary: '沿途您好，您的预约临近时间，请注意行程安排',
		date: '04/25',
		unread: false
	}
]

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
			tabs: TABS,
			activeTab: 'all',
			messageList: MESSAGE_LIST.map((item) => ({ ...item }))
		}
	},
	computed: {
		activeMessages() {
			if (this.activeTab === 'all') {
				return this.messageList
			}

			return this.messageList.filter((item) => item.type === this.activeTab)
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
				url: '/pages/index/index'
			})
		},
		handleClearUnread() {
			const targetTypes = this.activeTab === 'all' ? null : [this.activeTab]

			this.messageList = this.messageList.map((item) => {
				if (!targetTypes || targetTypes.includes(item.type)) {
					return {
						...item,
						unread: false
					}
				}

				return item
			})

			uni.showToast({
				title: '\u672a\u8bfb\u5df2\u6e05\u9664',
				icon: 'none'
			})
		},
		handleMessageTap(item) {
			if (item.unread) {
				this.messageList = this.messageList.map((message) => {
					if (message.id === item.id) {
						return {
							...message,
							unread: false
						}
					}

					return message
				})
			}

			uni.showToast({
				title: item.title,
				icon: 'none'
			})
		}
	}
}
</script>

<style scoped lang="scss">
.message-page {
	min-height: 100vh;
	background:
		radial-gradient(circle at 50% -6%, rgba(216, 223, 241, 0.92) 0, rgba(216, 223, 241, 0.36) 260rpx, rgba(255, 255, 255, 0) 660rpx),
		linear-gradient(180deg, #fdfdfe 0%, #ffffff 320rpx, #ffffff 100%);
}

.message-page__header {
	position: sticky;
	top: 0;
	z-index: 10;
	background:
		linear-gradient(180deg, rgba(246, 248, 253, 0.98) 0%, rgba(246, 248, 253, 0.94) 100%);
	backdrop-filter: blur(12rpx);
}

.message-page__nav {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 96rpx;
}

.message-page__back {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 84rpx;
	height: 72rpx;
	margin-left: -6rpx;
}

.message-page__clear {
	font-size: 26rpx;
	line-height: 1;
	color: #3b404a;
}

.message-page__tabs {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-top: 30rpx;
	padding-bottom: 18rpx;
}

.message-page__tab {
	position: relative;
	padding-bottom: 18rpx;
	font-size: 34rpx;
	font-weight: 500;
	line-height: 1;
	color: #8e919b;
}

.message-page__tab.is-active {
	color: #143080;
	font-weight: 700;
}

.message-page__tab.is-active::after {
	content: '';
	position: absolute;
	left: 50%;
	bottom: 0;
	width: 44rpx;
	height: 6rpx;
	border-radius: 999rpx;
	background: #143080;
	transform: translateX(-50%);
}

.message-page__body {
	padding-top: 28rpx;
	padding-bottom: calc(env(safe-area-inset-bottom) + 60rpx);
}

.message-item {
	display: flex;
	align-items: flex-start;
	padding: 26rpx 0 34rpx;
}

.message-item + .message-item {
	margin-top: 18rpx;
}

.message-item__icon-shell {
	flex: none;
	margin-right: 26rpx;
	padding-top: 4rpx;
}

.message-item__icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 96rpx;
	height: 96rpx;
	border-radius: 50%;
	background: linear-gradient(180deg, #ffffff 0%, #f6f7fb 100%);
	box-shadow: inset 0 0 0 2rpx rgba(20, 48, 128, 0.04);
}

.message-item__content {
	flex: 1;
	min-width: 0;
	padding-top: 8rpx;
}

.message-item__row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 20rpx;
}

.message-item__row--bottom {
	align-items: flex-start;
	margin-top: 18rpx;
}

.message-item__title {
	flex: 1;
	min-width: 0;
	font-size: 32rpx;
	font-weight: 700;
	line-height: 1.2;
	color: #20232b;
}

.message-item__date {
	flex: none;
	font-size: 24rpx;
	line-height: 1.2;
	color: #9a9eaa;
}

.message-item__desc {
	flex: 1;
	min-width: 0;
	font-size: 24rpx;
	line-height: 1.5;
	color: #8f949f;
}

.message-item__dot {
	flex: none;
	width: 18rpx;
	height: 18rpx;
	margin-top: 8rpx;
	border-radius: 50%;
	background: #ff5d4f;
}

.message-empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 220rpx 0 160rpx;
}

.message-empty__title {
	font-size: 32rpx;
	font-weight: 600;
	line-height: 1.2;
	color: #22252d;
}

.message-empty__desc {
	margin-top: 18rpx;
	font-size: 24rpx;
	line-height: 1.4;
	color: #9ca1ab;
}
</style>
