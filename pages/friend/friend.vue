<template>
	<view class="friend-page" :style="{ paddingTop: topInset + 'px' }">
		<view class="page-shell friend-page__shell">
			<view class="friend-page__topbar">
				<view class="friend-page__tabs">
					<text
						v-for="tab in tabs"
						:key="tab.key"
						:class="['friend-page__tab', activeTab === tab.key ? 'is-active' : '']"
						@tap="activeTab = tab.key"
					>
						{{ tab.label }}
					</text>
				</view>

				<text class="friend-page__clear" @tap="handleClearUnread">清除未读</text>
			</view>

			<view
				v-for="section in activeSections"
				:key="section.key"
				:class="['friend-page__section', section.divider ? 'has-divider' : '']"
			>
				<view
					v-for="item in section.items"
					:key="item.id"
					class="friend-page__item"
					@tap="handleConversationTap(item)"
				>
					<view class="friend-page__avatar-shell">
						<view v-if="item.avatarType === 'system'" class="friend-page__system-avatar">
							<u-icon name="bell" size="42" color="#27449A"></u-icon>
						</view>

						<view v-else-if="item.avatarType === 'group'" class="friend-page__group-avatar">
							<image
								v-for="(thumb, thumbIndex) in item.groupThumbs"
								:key="`${item.id}-${thumbIndex}`"
								class="friend-page__group-thumb"
								:src="thumb"
								mode="aspectFill"
							/>
						</view>

						<image
							v-else
							class="friend-page__avatar"
							:src="item.avatar"
							mode="aspectFill"
						/>
					</view>

					<view class="friend-page__body">
						<view class="friend-page__main">
							<view class="friend-page__title-row">
								<view class="friend-page__title-wrap">
									<text class="friend-page__title line-1">{{ item.title }}</text>
									<view v-if="item.badges && item.badges.length" class="friend-page__badges">
										<text
											v-for="badge in item.badges"
											:key="badge.text"
											:class="[
												'friend-page__badge',
												`friend-page__badge--${badge.variant}`
											]"
										>
											{{ badge.text }}
										</text>
									</view>
									<view v-if="item.showHot" class="friend-page__hot"></view>
								</view>

								<view class="friend-page__meta">
									<text :class="['friend-page__time', item.isRecent ? 'is-recent' : '']">
										{{ item.timeText }}
									</text>
									<u-icon
										v-if="item.muted"
										name="volume-off"
										size="28"
										color="#9A9DA8"
									></u-icon>
									<text
										v-else-if="item.unreadCount"
										class="friend-page__count"
									>
										{{ item.unreadCount }}
									</text>
									<view v-else-if="item.unreadDot" class="friend-page__dot"></view>
								</view>
							</view>

							<view class="friend-page__preview-row">
								<text
									v-if="item.previewPrefix"
									class="friend-page__preview friend-page__preview--prefix"
								>
									{{ item.previewPrefix }}
								</text>
								<text class="friend-page__preview friend-page__preview--main line-1">
									{{ item.previewText }}
								</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
const getTopInset = () => {
	try {
		const { statusBarHeight = 20 } = uni.getSystemInfoSync()
		return statusBarHeight + 14
	} catch (error) {
		return 34
	}
}

const TABS = [
	{ key: 'conversation', label: '会话' },
	{ key: 'group', label: '社群' },
	{ key: 'contacts', label: '通讯录' }
]

const createPanels = () => ({
	conversation: [
		{
			key: 'service',
			items: [
				{
					id: 'notice',
					title: '通知',
					avatarType: 'system',
					timeText: '04/25',
					previewText: '沿途您好，您的预约临近时间，请注意行程安排',
					unreadDot: true,
					unreadCount: 0,
					muted: false,
					badges: [],
					showHot: false,
					isRecent: false
				},
				{
					id: 'official-consult',
					title: 'Monet-伊美尔顾问',
					avatarType: 'image',
					avatar: '/static/linshi/01.png',
					timeText: '04/25',
					previewText: '沿途您好，您的预约临近时间，请注意行程安排',
					unreadDot: true,
					unreadCount: 0,
					muted: true,
					badges: [{ text: '官方', variant: 'official' }],
					showHot: false,
					isRecent: false
				}
			]
		},
		{
			key: 'friends',
			divider: true,
			items: [
				{
					id: 'vip-group',
					title: '伊美尔专属服务群',
					avatarType: 'group',
					timeText: '04/25',
					previewPrefix: '[361条未读]',
					previewText: '沿途您好，您的预约临近时间，请注意行程安排',
					groupThumbs: [
						'/static/linshi/01.png',
						'/static/linshi/02.png',
						'/static/linshi/02.png',
						'/static/linshi/01.png'
					],
					unreadDot: true,
					unreadCount: 0,
					muted: false,
					badges: [],
					showHot: false,
					isRecent: false
				},
				{
					id: 'wuyanqian',
					title: '吴彦谦',
					avatarType: 'image',
					avatar: '/static/linshi/02.png',
					timeText: '刚刚',
					previewText: '沿途您好，您的预约临近时间，请注意行程安排',
					unreadDot: false,
					unreadCount: 8,
					muted: false,
					badges: [{ text: '闺蜜', variant: 'bestie' }],
					showHot: true,
					isRecent: true
				},
				{
					id: 'zhouxiaoyi',
					title: '周小艺',
					avatarType: 'image',
					avatar: '/static/linshi/01.png',
					timeText: '04/25',
					previewText: '沿途您好，您的预约临近时间，请注意行程安排',
					unreadDot: false,
					unreadCount: 0,
					muted: false,
					badges: [],
					showHot: false,
					isRecent: false
				},
				{
					id: 'sunsida',
					title: '孙思达',
					avatarType: 'image',
					avatar: '/static/linshi/02.png',
					timeText: '04/25',
					previewText: '沿途您好，您的预约临近时间，请注意行程安排',
					unreadDot: false,
					unreadCount: 0,
					muted: false,
					badges: [],
					showHot: false,
					isRecent: false
				},
				{
					id: 'liqi',
					title: '李婷',
					avatarType: 'image',
					avatar: '/static/linshi/01.png',
					timeText: '04/25',
					previewText: '沿途您好，您的预约临近时间，请注意行程安排',
					unreadDot: false,
					unreadCount: 0,
					muted: false,
					badges: [],
					showHot: false,
					isRecent: false
				}
			]
		}
	],
	group: [
		{
			key: 'group-list',
			items: [
				{
					id: 'vip-group-panel',
					title: '伊美尔专属服务群',
					avatarType: 'group',
					timeText: '04/25',
					previewPrefix: '[361条未读]',
					previewText: '本周社群活动已发布，点击查看报名入口',
					groupThumbs: [
						'/static/linshi/01.png',
						'/static/linshi/02.png',
						'/static/linshi/02.png',
						'/static/linshi/01.png'
					],
					unreadDot: true,
					unreadCount: 0,
					muted: false,
					badges: [],
					showHot: false,
					isRecent: false
				},
				{
					id: 'beauty-club',
					title: '悦己抗衰打卡群',
					avatarType: 'group',
					timeText: '04/24',
					previewPrefix: '[12条新消息]',
					previewText: '今晚 20:00 医生答疑直播开始，记得准时进入',
					groupThumbs: [
						'/static/linshi/02.png',
						'/static/linshi/01.png',
						'/static/linshi/01.png',
						'/static/linshi/02.png'
					],
					unreadDot: false,
					unreadCount: 3,
					muted: false,
					badges: [],
					showHot: false,
					isRecent: false
				}
			]
		}
	],
	contacts: [
		{
			key: 'contact-list',
			items: [
				{
					id: 'doctor-assistant',
					title: 'Monet-伊美尔顾问',
					avatarType: 'image',
					avatar: '/static/linshi/01.png',
					timeText: '在线',
					previewText: '点击开始沟通，咨询面诊、预约与术后服务',
					unreadDot: false,
					unreadCount: 0,
					muted: false,
					badges: [{ text: '官方', variant: 'official' }],
					showHot: false,
					isRecent: true
				},
				{
					id: 'friend-a',
					title: '周小艺',
					avatarType: 'image',
					avatar: '/static/linshi/01.png',
					timeText: '好友',
					previewText: '已添加为好友，可以发起聊天或查看她的动态',
					unreadDot: false,
					unreadCount: 0,
					muted: false,
					badges: [],
					showHot: false,
					isRecent: false
				},
				{
					id: 'friend-b',
					title: '孙思达',
					avatarType: 'image',
					avatar: '/static/linshi/02.png',
					timeText: '好友',
					previewText: '已添加为好友，可以发起聊天或查看她的动态',
					unreadDot: false,
					unreadCount: 0,
					muted: false,
					badges: [],
					showHot: false,
					isRecent: false
				}
			]
		}
	]
})

export default {
	data() {
		return {
			topInset: getTopInset(),
			tabs: TABS,
			activeTab: 'conversation',
			panels: createPanels()
		}
	},
	computed: {
		activeSections() {
			return this.panels[this.activeTab] || []
		}
	},
	methods: {
		handleClearUnread() {
			this.activeSections.forEach((section) => {
				section.items.forEach((item) => {
					item.unreadDot = false
					item.unreadCount = 0
				})
			})

			uni.showToast({
				title: '未读已清除',
				icon: 'none'
			})
		},
		handleConversationTap(item) {
			uni.showToast({
				title: item.title,
				icon: 'none'
			})
		}
	}
}
</script>

<style scoped lang="scss">
.friend-page {
	min-height: 100vh;
	background:
		radial-gradient(circle at 50% -4%, rgba(217, 223, 241, 0.9) 0, rgba(217, 223, 241, 0.34) 240rpx, rgba(255, 255, 255, 0) 620rpx),
		linear-gradient(180deg, #fefefe 0%, #ffffff 320rpx, #ffffff 100%);
}

.friend-page__shell {
	padding-bottom: calc(env(safe-area-inset-bottom) + 180rpx);
}

.friend-page__topbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-top: 14rpx;
}

.friend-page__tabs {
	display: flex;
	align-items: center;
	min-width: 0;
}

.friend-page__tab {
	position: relative;
	padding: 12rpx 0 14rpx;
	margin-right: 44rpx;
	font-size: 32rpx;
	font-weight: 600;
	color: #2e3138;
	z-index: 0;
}

.friend-page__tab.is-active {
	color: #143080;
}

.friend-page__tab.is-active::before {
	content: '';
	position: absolute;
	left: 22rpx;
	bottom: 8rpx;
	width: 18rpx;
	height: 44rpx;
	border-radius: 999rpx;
	background: linear-gradient(180deg, #f7cb60 0%, #d89e2b 100%);
	transform: rotate(28deg);
	z-index: -1;
}

.friend-page__clear {
	flex: none;
	font-size: 26rpx;
	color: #3f444d;
}

.friend-page__section {
	margin-top: 34rpx;
}

.friend-page__section.has-divider {
	padding-top: 18rpx;
	border-top: 2rpx solid rgba(17, 24, 39, 0.06);
}

.friend-page__item {
	display: flex;
	align-items: flex-start;
	padding: 30rpx 0;
}

.friend-page__avatar-shell {
	flex: none;
	margin-right: 22rpx;
}

.friend-page__avatar,
.friend-page__system-avatar,
.friend-page__group-avatar {
	width: 92rpx;
	height: 92rpx;
	border-radius: 50%;
}

.friend-page__avatar {
	display: block;
	background: #eef2f8;
}

.friend-page__system-avatar {
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(180deg, #ffffff 0%, #f6f7fb 100%);
	box-shadow: inset 0 0 0 2rpx rgba(20, 48, 128, 0.04);
}

.friend-page__group-avatar {
	display: flex;
	flex-wrap: wrap;
	padding: 8rpx;
	background: #f3f4f8;
	overflow: hidden;
	box-sizing: border-box;
}

.friend-page__group-thumb {
	width: calc(50% - 3rpx);
	height: calc(50% - 3rpx);
	margin: 1.5rpx;
	border-radius: 10rpx;
	background: #e4e9f2;
}

.friend-page__body {
	flex: 1;
	min-width: 0;
}

.friend-page__main {
	display: flex;
	flex-direction: column;
	min-width: 0;
}

.friend-page__title-row {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
}

.friend-page__title-wrap {
	display: flex;
	align-items: center;
	flex: 1;
	min-width: 0;
	padding-top: 4rpx;
}

.friend-page__title {
	flex: none;
	max-width: 360rpx;
	font-size: 32rpx;
	font-weight: 600;
	line-height: 1.2;
	color: #20232d;
}

.friend-page__badges {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	margin-left: 12rpx;
}

.friend-page__badge {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	height: 40rpx;
	padding: 0 16rpx;
	border-radius: 999rpx;
	font-size: 22rpx;
	line-height: 1;
	box-sizing: border-box;
}

.friend-page__badge--official {
	border: 2rpx solid #2b4ba4;
	color: #2b4ba4;
	background: rgba(255, 255, 255, 0.92);
}

.friend-page__badge--bestie {
	border: 2rpx solid #ebb452;
	color: #d9a03d;
	background: #fffaf0;
}

.friend-page__hot {
	position: relative;
	width: 24rpx;
	height: 30rpx;
	margin-left: 14rpx;
	border-radius: 16rpx 16rpx 18rpx 18rpx;
	background: linear-gradient(180deg, #ff8747 0%, #ff543c 100%);
	transform: rotate(-12deg);
}

.friend-page__hot::before {
	content: '';
	position: absolute;
	left: 8rpx;
	top: -6rpx;
	width: 12rpx;
	height: 14rpx;
	border-radius: 999rpx 999rpx 0 999rpx;
	background: #ffb15d;
	transform: rotate(26deg);
}

.friend-page__meta {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	flex: none;
	min-width: 86rpx;
	margin-left: 18rpx;
}

.friend-page__time {
	font-size: 24rpx;
	line-height: 1.1;
	color: #9ea2ac;
}

.friend-page__time.is-recent {
	color: #a0a4ad;
}

.friend-page__meta .u-icon,
.friend-page__count,
.friend-page__dot {
	margin-top: 18rpx;
}

.friend-page__dot {
	width: 18rpx;
	height: 18rpx;
	border-radius: 50%;
	background: #ff5e4f;
}

.friend-page__count {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 38rpx;
	height: 38rpx;
	padding: 0 10rpx;
	border-radius: 999rpx;
	background: #ff5a42;
	font-size: 24rpx;
	font-weight: 600;
	line-height: 1;
	color: #ffffff;
	box-sizing: border-box;
}

.friend-page__preview-row {
	display: flex;
	align-items: center;
	min-width: 0;
	margin-top: 18rpx;
}

.friend-page__preview {
	font-size: 24rpx;
	line-height: 1.45;
	color: #8f949f;
}

.friend-page__preview--prefix {
	flex: none;
	margin-right: 10rpx;
	color: #8d919b;
}

.friend-page__preview--main {
	flex: 1;
	min-width: 0;
}
</style>
