<template>
	<view class="friend-page">
		<view class="friend-nav" :style="{ paddingTop: statusBarHeight + 'px' }">
			<view class="page-shell friend-nav__inner">
				<view class="friend-topbar flex row-between">
					<view class="friend-tabs flex">
						<view
							v-for="tab in tabs"
							:key="tab.key"
							:class="['friend-tab', activeTab === tab.key ? 'is-active' : '']"
							@tap="switchTab(tab.key)"
						>
							{{ tab.label }}
							<image
								v-if="activeTab === tab.key"
								src="/static/images/active.png"
								class="tab_active"
							/>
						</view>
					</view>

					<text v-if="activeTab === 'conversation'" class="friend-page__clear" @tap="handleClearUnread">
						清除未读
					</text>
				</view>
			</view>
		</view>

		<view class="page-shell friend-page__shell">
			<view v-if="activeTab === 'group'" class="friend-community">
				<view class="friend-community__head" @tap="goCommunityDiscover">
					<text class="friend-community__head-title">发现社群</text>
					<u-icon name="arrow-right" size="30" color="#77797E"></u-icon>
				</view>

				<view class="friend-community__banner-wrap">
					<swiper
						class="friend-community__banner-swiper"
						:current="bannerCurrent"
						autoplay
						circular
						interval="3500"
						duration="500"
						@change="handleBannerChange"
					>
						<swiper-item
							v-for="(banner, bannerIndex) in communityBannerList"
							:key="`banner-${bannerIndex}`"
						>
							<view class="friend-community__banner-card">
								<image class="friend-community__banner-image" :src="banner.image" mode="aspectFill" />
								<view class="friend-community__banner-mask"></view>
								<view class="friend-community__banner-content">
									<text class="friend-community__banner-title">{{ banner.title }}</text>
									<text class="friend-community__banner-desc">{{ banner.desc }}</text>
								</view>
							</view>
						</swiper-item>
					</swiper>
					<view class="friend-community__banner-dots">
						<view
							v-for="(banner, bannerIndex) in communityBannerList"
							:key="`banner-dot-${bannerIndex}`"
							:class="[
								'friend-community__banner-dot',
								bannerCurrent === bannerIndex ? 'is-active' : ''
							]"
						/>
					</view>
				</view>

				<view class="friend-community__list">
					<view
						v-for="(item, index) in communityList"
						:key="item.id"
						class="friend-community__item"
						@tap="handleConversationTap(item)"
					>
						<view class="friend-community__cover-wrap">
							<image
								class="friend-community__cover"
								:src="item.cover || getCommunityIcon(index)"
								mode="aspectFill"
							/>
						</view>
						<view class="friend-community__body">
							<view class="friend-community__meta">
								<text class="friend-community__meta-chip">{{ item.city }}</text>
								<text class="friend-community__meta-chip">{{ item.tag }}</text>
							</view>
							<text class="friend-community__name">{{ item.title }}</text>
							<view class="friend-community__footer">
								<view class="friend-community__members">
									<image
										v-for="(avatar, avatarIndex) in item.memberAvatars"
										:key="`${item.id}-${avatarIndex}`"
										class="friend-community__member-avatar"
										:src="avatar"
										mode="aspectFill"
									/>
									<text class="friend-community__member-count">{{ item.memberCount }}</text>
								</view>
							</view>
						</view>
						<view class="friend-community__action">查看</view>
					</view>
				</view>
			</view>

			<view v-else-if="activeTab === 'contacts'" class="friend-contacts">
				<view class="community-page__search">
					<u-icon name="search" size="32" color="#FFFFFF"></u-icon>
					<view class="community-page__search-divider"></view>
					<text class="community-page__search-text">请搜索</text>
				</view>

				<view
					v-for="section in contactSections"
					:key="section.key"
					class="friend-contacts__section"
				>
					<view class="friend-contacts__section-head" @tap="toggleContactSection(section.key)">
						<text class="friend-contacts__section-title">{{ section.title }}</text>
						<u-icon
							:name="section.expanded ? 'arrow-up' : 'arrow-down'"
							size="24"
							color="#8F949F"
						></u-icon>
					</view>

					<view v-if="section.expanded" class="friend-contacts__section-body">
						<view
							v-for="(item, itemIndex) in section.items"
							:key="item.id"
							class="friend-contacts__item"
							@tap="handleContactTap(item)"
						>
							<image class="friend-contacts__avatar" :src="item.avatar" mode="aspectFill" />
							<view
								:class="[
									'friend-contacts__item-main',
									itemIndex < section.items.length - 1 ? 'has-divider' : ''
								]"
							>
								<view class="friend-contacts__item-row">
									<text class="friend-contacts__name">{{ item.name }}</text>
									<view
										v-if="item.showUnfollow"
										class="friend-contacts__unfollow"
										@tap.stop="handleUnfollow(item)"
									>
										取关
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view v-else>
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
	</view>
</template>

<script>
const getStatusBarHeight = () => {
	try {
		const { statusBarHeight = 20 } = uni.getSystemInfoSync()
		return statusBarHeight
	} catch (error) {
		return 20
	}
}

const TABS = [
	{ key: 'conversation', label: '会话' },
	{ key: 'group', label: '社群' },
	{ key: 'contacts', label: '通讯录' }
]

const CONTACT_SECTIONS = [
	{
		key: 'doctors',
		title: '我的医生',
		expanded: true,
		items: [
			{ id: 'doctor-1', name: '周进医生', avatar: '/static/linshi/01.png' },
			{ id: 'doctor-2', name: '胡嘉言医生', avatar: '/static/linshi/02.png' }
		]
	},
	{
		key: 'consultants',
		title: '我的顾问',
		expanded: true,
		items: [{ id: 'consultant-1', name: '冯艺莲', avatar: '/static/linshi/01.png' }]
	},
	{
		key: 'managers',
		title: '我的客管',
		expanded: true,
		items: [{ id: 'manager-1', name: '吴彦琛', avatar: '/static/linshi/02.png' }]
	},
	{
		key: 'besties',
		title: '我的闺蜜',
		expanded: true,
		items: [
			{
				id: 'bestie-1',
				name: '赵萸艳',
				avatar: '/static/linshi/01.png',
				showUnfollow: true
			}
		]
	}
]

const COMMUNITY_ICONS = [
	'/static/linshi/10.png',
	'/static/linshi/11.png',
	'/static/linshi/12.png'
]

const COMMUNITY_BANNERS = [
	{
		image: '/static/linshi/09.png',
		title: 'Care生活分享社群',
		desc: '等你来加入'
	},
	{
		image: '/static/linshi/09.png',
		title: 'Care生活分享社群',
		desc: '和有趣的人一起分享'
	},
	{
		image: '/static/linshi/09.png',
		title: 'Care生活分享社群',
		desc: '发现更多同城伙伴'
	}
]

const COMMUNITY_LIST = [
	{
		id: 'community-a',
		title: '幸福社区',
		city: '北京市',
		tag: '交友',
		memberCount: '296名成员',
		memberAvatars: ['/static/linshi/01.png', '/static/linshi/02.png', '/static/linshi/01.png']
	},
	{
		id: 'community-b',
		title: '春夏焕颜',
		city: '北京市',
		tag: '交友',
		memberCount: '296名成员',
		memberAvatars: ['/static/linshi/02.png', '/static/linshi/01.png', '/static/linshi/02.png']
	},
	{
		id: 'community-c',
		title: '种草清单',
		city: '北京市',
		tag: '交友',
		memberCount: '296名成员',
		memberAvatars: ['/static/linshi/01.png', '/static/linshi/02.png', '/static/linshi/01.png']
	},
	{
		id: 'community-d',
		title: '焕颜计划',
		city: '北京市',
		tag: '交友',
		memberCount: '296名成员',
		memberAvatars: ['/static/linshi/02.png', '/static/linshi/01.png', '/static/linshi/02.png']
	},
	{
		id: 'community-e',
		title: '幸福社区',
		city: '北京市',
		tag: '交友',
		memberCount: '296名成员',
		memberAvatars: ['/static/linshi/01.png', '/static/linshi/02.png', '/static/linshi/01.png']
	}
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
			statusBarHeight: getStatusBarHeight(),
			tabs: TABS,
			activeTab: 'conversation',
			panels: createPanels(),
			communityBannerList: COMMUNITY_BANNERS,
			communityList: COMMUNITY_LIST,
			bannerCurrent: 0,
			contactSections: JSON.parse(JSON.stringify(CONTACT_SECTIONS))
		}
	},
	computed: {
		activeSections() {
			return this.panels[this.activeTab] || []
		}
	},
	methods: {
		switchTab(tabKey) {
			this.activeTab = tabKey
		},
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
			if (!item || item.avatarType === 'system') {
				uni.showToast({
					title: item ? item.title : '',
					icon: 'none'
				})
				return
			}

			const isGroup = item.avatarType === 'group'
			const type = isGroup ? 'group' : 'personal'
			const title = encodeURIComponent(
				isGroup && item.id === 'vip-group' ? '专属服务群' : item.title
			)
			let url = `/bundle_friend/pages/chat/chat?type=${type}&title=${title}`

			if (isGroup) {
				url += '&count=4'
			} else if (item.id === 'wuyanqian' || item.showHot) {
				url = `/bundle_friend/pages/chat/chat?type=personal&title=${encodeURIComponent('伊美尔用户00QX95')}&burnDays=430`
			}

			uni.navigateTo({ url })
		},
		getCommunityIcon(index) {
			return COMMUNITY_ICONS[index % COMMUNITY_ICONS.length]
		},
		handleBannerChange(event) {
			this.bannerCurrent = event.detail.current || 0
		},
		goCommunityDiscover() {
			uni.navigateTo({
				url: '/bundle_friend/pages/community/community'
			})
		},
		toggleContactSection(sectionKey) {
			const section = this.contactSections.find((item) => item.key === sectionKey)
			if (section) {
				section.expanded = !section.expanded
			}
		},
		handleContactTap(item) {
			uni.showToast({
				title: item.name,
				icon: 'none'
			})
		},
		handleUnfollow(item) {
			uni.showToast({
				title: `已取关${item.name}`,
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

.friend-nav {
	position: sticky;
	top: 0;
	z-index: 10;
	background: linear-gradient(180deg, rgba(244, 247, 255, 1) 0%, rgba(244, 247, 255, 1) 100%);
	backdrop-filter: blur(16rpx);
}

.friend-nav__inner {
	padding-bottom: 12rpx;
}

.friend-topbar {
	height: 88rpx;
	align-items: center;
}

.friend-tabs {
	align-items: center;
	min-width: 0;
}

.friend-tab {
	position: relative;
	margin-right: 36rpx;
	padding-bottom: 14rpx;
	font-size: 28rpx;
	color: #323437;

	.tab_active {
		position: absolute;
		z-index: -1;
		left: 14rpx;
		top: 3rpx;
		width: 28rpx;
		height: 34rpx;
	}
}

.friend-tab.is-active {
	color: #143080;
	font-weight: 700;
}

.friend-page__shell {
	// padding-top: 12rpx;
	padding-bottom: calc(env(safe-area-inset-bottom) + 180rpx);
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

.friend-community {
	margin-top: 18rpx;
}

.friend-community__head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 2rpx;
}

.friend-community__head-title {
	font-size: 34rpx;
	font-weight: 500;
	color: #1A1B1D;
	line-height: 24rpx;
	font-style: normal;
	text-align: center;
}

.friend-community__banner-wrap {
	position: relative;
	width: 100%;
	height: 330rpx;
	margin-top: 40rpx;
}

.friend-community__banner-swiper {
	width: 100%;
	height: 100%;
}

.friend-community__banner-dots {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 16rpx;
	z-index: 2;
	display: flex;
	align-items: center;
	justify-content: center;
	pointer-events: none;
}

.friend-community__banner-dot {
	width: 20rpx;
	height: 4rpx;
	margin: 0 4rpx;
	border-radius: 999rpx;
	background: rgba(255, 255, 255, 0.34);
}

.friend-community__banner-dot.is-active {
	background: rgba(255, 255, 255, 0.95);
}

.friend-community__banner-card {
	position: relative;
	height: 100%;
	border-radius: 18rpx;
	overflow: hidden;
}

.friend-community__banner-image {
	width: 100%;
	height: 100%;
}

.friend-community__banner-mask {
	position: absolute;
	inset: 0;
	background: linear-gradient(180deg, rgba(12, 15, 22, 0.06) 0%, rgba(12, 15, 22, 0.42) 100%);
}

.friend-community__banner-content {
	position: absolute;
	left: 40rpx;
	bottom: 34rpx;
	display: flex;
	flex-direction: column;
}

.friend-community__banner-title {
	font-size: 34rpx;
	font-weight: 500;
	font-style: normal;
	line-height: 48rpx;
	color: #ffffff;
	// text-align: center;
}

.friend-community__banner-desc {
	margin-top: 10rpx;
	font-size: 24rpx;
	color: #FFF;
	font-weight: 400;
	line-height: 32rpx;
	font-style: normal;
	// text-align: center;
}

.friend-community__list {
	margin-top: 20rpx;
}

.friend-community__item {
	display: flex;
	align-items: stretch;
	padding: 20rpx 0;
}

.friend-community__cover-wrap {
	width: 144rpx;
	height: 144rpx;
	flex: none;
	align-self: center;
	border-radius: 14rpx;
	overflow: hidden;
	background: #edf1f9;
}

.friend-community__cover {
	width: 100%;
	height: 100%;
	display: block;
}

.friend-community__body {
	flex: 1;
	min-width: 0;
	margin-left: 30rpx;
}

.friend-community__meta {
	display: flex;
	align-items: center;
}

.friend-community__meta-chip {
	height: 36rpx;
	padding: 2rpx 4rpx;
	margin-right: 14rpx;
	border-radius: 4rpx;
	background: #f7f7f7;
	font-size: 22rpx;
	line-height: 28rpx;
	color: #77797e;
	font-weight: 400;
	font-style: normal;
}

.friend-community__name {
	display: block;
	margin-top: 16rpx;
	font-size: 28rpx;
	font-weight: 600;
	line-height: 40rpx;
	color: #1a1b1d;
	font-style: normal;
}

.friend-community__footer {
	display: flex;
	align-items: center;
	margin-top: 16rpx;
}

.friend-community__members {
	display: flex;
	align-items: center;
	min-width: 0;
}

.friend-community__member-avatar {
	width: 24rpx;
	height: 24rpx;
	margin-right: 0;
	border-radius: 50%;
	border: 1rpx solid #ffffff;
}

.friend-community__member-count {
	margin-left: 16rpx;
	font-size: 20rpx;
	color: #77797e;
	font-weight: 400;
	line-height: 28rpx;
	font-style: normal;
}

.friend-community__action {
	display: block;
	width: 104rpx;
	height: 44rpx;
	line-height: 36rpx;
	text-align: center;
	align-self: center;
	flex: none;
	margin-left: 18rpx;
	border-radius: 22rpx;
	border: 1rpx solid #e1e2e5;
	font-size: 24rpx;
	color: #77797e;
	font-style: normal;
	font-weight: 400;
}

.community-page__search {
	display: flex;
	align-items: center;
	height: 70rpx;
	padding: 0 20rpx;
	margin-top: 30rpx;
	border-radius: 12rpx;
	background: #f1f1f2;
}

.community-page__search-text {
	margin-left: 20rpx;
	font-size: 24rpx;
	color: #b8b8b8;
	text-align: center;
	line-height: 32rpx;
	font-style: normal;
	font-weight: 400;
}

.community-page__search-divider {
	width: 2rpx;
	height: 26rpx;
	margin-left: 20rpx;
	background: #d3d3d3;
}

.friend-contacts .community-page__search {
	margin-top: 0;
}

.friend-contacts__section {
	margin-top: 28rpx;
}

.friend-contacts__section-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 8rpx 0;
}

.friend-contacts__section-title {
	font-size: 28rpx;
	color: #8f949f;
	line-height: 1.2;
}

.friend-contacts__section-body {
	margin-top: 8rpx;
	background: #ffffff;
	border-radius: 12rpx;
}

.friend-contacts__item {
	display: flex;
	align-items: stretch;
	padding-left: 0;
}

.friend-contacts__avatar {
	width: 72rpx;
	height: 72rpx;
	margin: 24rpx 20rpx 24rpx 0;
	border-radius: 50%;
	flex: none;
	background: #eef2f8;
}

.friend-contacts__item-main {
	flex: 1;
	min-width: 0;
	padding: 24rpx 0;
}

.friend-contacts__item-main.has-divider {
	border-bottom: 1rpx solid rgba(17, 24, 39, 0.06);
}

.friend-contacts__item-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	min-height: 72rpx;
	padding-right: 0;
}

.friend-contacts__name {
	flex: 1;
	min-width: 0;
	font-size: 32rpx;
	font-weight: 500;
	color: #1a1b1d;
	line-height: 1.2;
}

.friend-contacts__unfollow {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 104rpx;
	height: 44rpx;
	margin-left: 18rpx;
	border: 1rpx solid #e1e2e5;
	border-radius: 22rpx;
	font-size: 24rpx;
	color: #77797e;
	flex: none;
}
</style>
