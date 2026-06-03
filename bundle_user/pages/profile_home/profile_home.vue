<template>
	<view class="profile-home-page">
		<view class="profile-home-page__hero">
			<view class="profile-home-page__hero-mask"></view>

			<view class="profile-home-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
				<view class="page-shell profile-home-page__nav">
					<view class="profile-home-page__back" @tap="goBack">
						<u-icon name="arrow-left" size="52" color="#ffffff"></u-icon>
					</view>
				</view>
			</view>
		</view>

		<view class="profile-home-page__panel">
			<view class="profile-home-page__profile">
				<view class="profile-home-page__name-row">
					<text class="profile-home-page__name">{{ profile.name }}</text>
					<view class="profile-home-page__member-chip">
						<view class="profile-home-page__member-dot"></view>
						<text class="profile-home-page__member-text">{{ profile.memberLevel }}</text>
					</view>
				</view>

				<view class="profile-home-page__tags">
					<view v-for="tag in profile.tags" :key="tag" class="profile-home-page__tag">
						{{ tag }}
					</view>
					<text class="profile-home-page__tag-add" @tap="showPending('添加标签')">添加标签</text>
				</view>

				<view class="profile-home-page__stats">
					<view v-for="item in profile.stats" :key="item.label" class="profile-home-page__stat">
						<text class="profile-home-page__stat-value">{{ item.value }}</text>
						<text class="profile-home-page__stat-label">{{ item.label }}</text>
					</view>
				</view>
			</view>

			<view class="profile-home-page__tabs">
				<text
					v-for="tab in tabs"
					:key="tab.key"
					:class="['profile-home-page__tab', activeTab === tab.key ? 'is-active' : '']"
					@tap="activeTab = tab.key"
				>
					{{ tab.label }}
				</text>
			</view>

			<view class="profile-home-page__tab-line"></view>

			<view v-if="activeTab === 'posts'" class="profile-home-page__tab-panel">
				<view v-for="item in posts" :key="item.id" class="post-card">
					<view class="post-card__header">
						<u-avatar
							class="post-card__avatar"
							:src="item.author.avatar"
							size="84rpx"
							mode="circle"
							img-mode="aspectFill"
						></u-avatar>

						<view class="post-card__author">
							<text class="post-card__author-name">{{ item.author.name }}</text>
							<view class="post-card__author-badge">
								<view class="post-card__author-mark"></view>
								<text class="post-card__author-badge-text">{{ item.author.badge }}</text>
							</view>
						</view>

						<view class="post-card__audit">{{ item.auditStatus }}</view>
					</view>

					<text class="post-card__content">{{ item.content }}</text>

					<view class="post-card__gallery">
						<view
							v-for="media in item.gallery"
							:key="media.id"
							:class="['post-card__gallery-item', media.theme]"
						>
							<view class="post-card__gallery-glow"></view>
							<text v-if="media.countLabel" class="post-card__gallery-count">{{ media.countLabel }}</text>
						</view>
					</view>

					<view class="post-card__quote">
						<view class="post-card__quote-top">
							<u-avatar
								:src="item.quote.avatar"
								size="42rpx"
								mode="circle"
								img-mode="aspectFill"
							></u-avatar>
							<text class="post-card__quote-name">{{ item.quote.name }}</text>
						</view>
						<text class="post-card__quote-text">{{ item.quote.text }}</text>
					</view>

					<view class="post-card__community">
						<text class="post-card__community-icon">社群</text>
						<text class="post-card__community-text">{{ item.community }}</text>
					</view>

					<view class="post-card__footer">
						<text class="post-card__date">{{ item.date }}</text>

						<view class="post-card__metrics">
							<view class="post-card__metric">
								<u-icon name="eye-fill" size="24" color="#9fa5b0"></u-icon>
								<text class="post-card__metric-text">{{ item.metrics.views }}</text>
							</view>
							<view class="post-card__metric">
								<u-icon name="chat-fill" size="24" color="#9fa5b0"></u-icon>
								<text class="post-card__metric-text">{{ item.metrics.comments }}</text>
							</view>
							<view class="post-card__metric">
								<u-icon name="thumb-up" size="24" color="#9fa5b0"></u-icon>
								<text class="post-card__metric-text">{{ item.metrics.likes }}</text>
							</view>
						</view>
					</view>

					<view class="post-card__actions">
						<text class="post-card__action post-card__action--muted" @tap="showPending('编辑')">编辑</text>
						<text class="post-card__action post-card__action--danger" @tap="showPending('删除')">删除</text>
					</view>
				</view>
			</view>

			<view v-else-if="activeTab === 'comments'" class="profile-home-page__tab-panel">
				<view class="placeholder-card" v-for="item in commentItems" :key="item.id">
					<text class="placeholder-card__title">{{ item.title }}</text>
					<text class="placeholder-card__desc">{{ item.desc }}</text>
				</view>
			</view>

			<view v-else class="profile-home-page__tab-panel">
				<view class="placeholder-card" v-for="item in groups" :key="item.id">
					<view class="placeholder-card__row">
						<text class="placeholder-card__title">{{ item.title }}</text>
						<text class="placeholder-card__badge">{{ item.badge }}</text>
					</view>
					<text class="placeholder-card__desc">{{ item.desc }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
const PROFILE = {
	name: '沈以陈',
	memberLevel: '黑金会员',
	tags: ['艺术家', '其他'],
	stats: [
		{ label: '获赞', value: '232' },
		{ label: '关注', value: '232' },
		{ label: '粉丝', value: '232' }
	]
}

const TABS = [
	{ key: 'posts', label: '帖子' },
	{ key: 'comments', label: '评论' },
	{ key: 'groups', label: '社群' }
]

const POSTS = [
	{
		id: 'post-1',
		author: {
			name: 'Ever Care',
			badge: '蓝卡会员',
			avatar: '/static/linshi/01.png'
		},
		auditStatus: '审核中',
		content:
			'有幸再次被你刷到，日子慢慢来，做一个干净温柔、闪闪发光的未来精致美少女。#伊美尔官方 #变美计划 #美好生活',
		gallery: [
			{ id: 'lake', theme: 'is-lake' },
			{ id: 'mountain-road', theme: 'is-road' },
			{ id: 'bay', theme: 'is-bay' },
			{ id: 'window', theme: 'is-window', countLabel: '9' }
		],
		quote: {
			name: '倒塌de柏林墙',
			text: '牛屋这么豪，我缺的是C位吗?是缺张去北京的票!',
			avatar: '/static/linshi/02.png'
		},
		community: '来自 伊美尔生活大本营社群',
		date: '2026-02-08',
		metrics: {
			views: 356,
			comments: 356,
			likes: 56
		}
	}
]

const COMMENT_ITEMS = [
	{
		id: 'comment-1',
		title: '最新评论',
		desc: '“做完护理后状态很稳，底妆都更服帖了。”'
	},
	{
		id: 'comment-2',
		title: '互动记录',
		desc: '你在 3 个帖子下留下了温柔又有梗的评论。'
	}
]

const GROUPS = [
	{
		id: 'group-1',
		title: '伊美尔生活大本营',
		badge: '活跃中',
		desc: '群内 1286 人，今日新增 32 条美学打卡。'
	},
	{
		id: 'group-2',
		title: '术后护理交流社',
		badge: '已加入',
		desc: '这里会同步恢复日历、饮食建议和医生提醒。'
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
			profile: PROFILE,
			tabs: TABS,
			posts: POSTS,
			commentItems: COMMENT_ITEMS,
			groups: GROUPS,
			activeTab: 'posts'
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
				url: '/pages/user/user'
			})
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
.profile-home-page {
	min-height: 100vh;
	background: linear-gradient(180deg, #f6f8fc 0%, #ffffff 320rpx, #ffffff 100%);
}

.profile-home-page__hero {
	position: relative;
	height: 392rpx;
	background:
		linear-gradient(180deg, rgba(115, 164, 235, 0.42) 0%, rgba(238, 244, 253, 0.2) 58%, rgba(255, 255, 255, 0) 100%),
		url('/static/images/loginBg.png') center top / cover no-repeat;
}

.profile-home-page__hero-mask {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background:
		radial-gradient(circle at 18% 0, rgba(163, 202, 255, 0.44) 0, rgba(163, 202, 255, 0.16) 36%, rgba(163, 202, 255, 0) 68%),
		radial-gradient(circle at 100% 18%, rgba(255, 240, 221, 0.62) 0, rgba(255, 240, 221, 0.18) 24%, rgba(255, 240, 221, 0) 56%);
}

.profile-home-page__header {
	position: relative;
	z-index: 1;
}

.profile-home-page__nav {
	display: flex;
	align-items: center;
	height: 96rpx;
}

.profile-home-page__back {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 72rpx;
	height: 72rpx;
	margin-left: -12rpx;
}

.profile-home-page__panel {
	position: relative;
	z-index: 2;
	margin-top: -52rpx;
	padding: 44rpx 42rpx calc(54rpx + env(safe-area-inset-bottom));
	border-radius: 56rpx 56rpx 0 0;
	background: #ffffff;
	box-shadow: 0 -10rpx 24rpx rgba(47, 71, 117, 0.04);
}

.profile-home-page__name-row,
.profile-home-page__tags,
.profile-home-page__stats,
.profile-home-page__tabs,
.post-card__header,
.post-card__quote-top,
.post-card__community,
.post-card__footer,
.post-card__metrics,
.post-card__metric,
.post-card__actions,
.placeholder-card__row {
	display: flex;
	align-items: center;
}

.profile-home-page__name-row {
	flex-wrap: wrap;
}

.profile-home-page__name {
	font-size: 64rpx;
	font-weight: 700;
	line-height: 1.1;
	color: #111317;
}

.profile-home-page__member-chip {
	display: inline-flex;
	align-items: center;
	height: 56rpx;
	margin-left: 22rpx;
	padding: 0 22rpx;
	border-radius: 999rpx;
	background: linear-gradient(180deg, #2d2f34 0%, #1f2125 100%);
}

.profile-home-page__member-dot {
	width: 12rpx;
	height: 12rpx;
	margin-right: 14rpx;
	border-radius: 50%;
	background: #f0d2a3;
	box-shadow: 0 0 16rpx rgba(240, 210, 163, 0.45);
}

.profile-home-page__member-text {
	font-size: 28rpx;
	line-height: 1;
	color: #f3d3a3;
}

.profile-home-page__tags {
	margin-top: 42rpx;
	flex-wrap: wrap;
}

.profile-home-page__tag {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 116rpx;
	height: 56rpx;
	padding: 0 22rpx;
	border-radius: 18rpx;
	background: #f6f6f7;
	font-size: 22rpx;
	color: #777c86;
}

.profile-home-page__tag + .profile-home-page__tag {
	margin-left: 18rpx;
}

.profile-home-page__tag-add {
	margin-left: auto;
	font-size: 24rpx;
	color: #a0a4ad;
}

.profile-home-page__stats {
	margin-top: 46rpx;
}

.profile-home-page__stat {
	margin-right: 54rpx;
}

.profile-home-page__stat:last-child {
	margin-right: 0;
}

.profile-home-page__stat-value {
	font-size: 28rpx;
	font-weight: 700;
	line-height: 1;
	color: #1d2129;
}

.profile-home-page__stat-label {
	margin-left: 10rpx;
	font-size: 24rpx;
	line-height: 1;
	color: #8f95a0;
}

.profile-home-page__tabs {
	justify-content: space-between;
	margin-top: 78rpx;
	padding: 0 34rpx;
}

.profile-home-page__tab {
	position: relative;
	padding-bottom: 20rpx;
	font-size: 34rpx;
	line-height: 1.2;
	color: #b0b4bc;
}

.profile-home-page__tab.is-active {
	font-weight: 700;
	color: #1e2025;
}

.profile-home-page__tab.is-active::after {
	content: '';
	position: absolute;
	left: 8rpx;
	right: 8rpx;
	bottom: -2rpx;
	height: 8rpx;
	border-radius: 999rpx;
	background: #1d3f99;
}

.profile-home-page__tab-line {
	height: 2rpx;
	background: #eef0f4;
}

.profile-home-page__tab-panel {
	padding-top: 42rpx;
}

.post-card__header {
	align-items: flex-start;
}

.post-card__avatar {
	flex: none;
}

.post-card__author {
	flex: 1;
	min-width: 0;
	margin-left: 22rpx;
}

.post-card__author-name {
	display: block;
	font-size: 28rpx;
	font-weight: 500;
	line-height: 1.2;
	color: #282b31;
}

.post-card__author-badge {
	display: inline-flex;
	align-items: center;
	margin-top: 12rpx;
}

.post-card__author-mark {
	width: 14rpx;
	height: 24rpx;
	margin-right: 8rpx;
	border-radius: 2rpx 8rpx 8rpx 8rpx;
	background: #1f6dff;
	transform: skew(-12deg);
}

.post-card__author-badge-text {
	font-size: 24rpx;
	color: #2566e9;
}

.post-card__audit {
	flex: none;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 104rpx;
	height: 50rpx;
	padding: 0 18rpx;
	border-radius: 14rpx;
	background: #eef2ff;
	font-size: 26rpx;
	color: #4162bd;
}

.post-card__content {
	display: block;
	margin-top: 30rpx;
	font-size: 28rpx;
	line-height: 1.6;
	color: #22252b;
}

.post-card__gallery {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	margin-top: 26rpx;
}

.post-card__gallery-item {
	position: relative;
	width: calc(50% - 5rpx);
	height: 338rpx;
	margin-bottom: 10rpx;
	overflow: hidden;
	border-radius: 10rpx;
}

.post-card__gallery-item:nth-last-child(-n + 2) {
	margin-bottom: 0;
}

.post-card__gallery-item.is-lake {
	background:
		linear-gradient(180deg, rgba(255, 202, 137, 0.42) 0%, rgba(255, 202, 137, 0) 38%),
		linear-gradient(180deg, #759dc1 0%, #6e8ea8 44%, #345774 45%, #7aa19d 72%, #d2bf78 100%);
}

.post-card__gallery-item.is-road {
	background:
		linear-gradient(180deg, rgba(240, 224, 184, 0.12) 0%, rgba(240, 224, 184, 0.28) 100%),
		linear-gradient(180deg, #d5dee6 0%, #7a8fa4 38%, #3f596b 56%, #547173 66%, #d09e42 100%);
}

.post-card__gallery-item.is-road::before {
	content: '';
	position: absolute;
	left: 44%;
	right: 44%;
	top: 44%;
	bottom: 0;
	background: linear-gradient(180deg, rgba(235, 238, 243, 0.22) 0%, rgba(246, 246, 248, 0.94) 100%);
}

.post-card__gallery-item.is-bay {
	background:
		linear-gradient(180deg, rgba(226, 214, 136, 0.26) 0%, rgba(226, 214, 136, 0) 38%),
		linear-gradient(180deg, #4a6738 0%, #214129 44%, #1b3f2a 56%, #4ad0df 58%, #6de0ea 100%);
}

.post-card__gallery-item.is-window {
	background:
		linear-gradient(180deg, rgba(255, 245, 236, 0.18) 0%, rgba(255, 245, 236, 0.56) 100%),
		linear-gradient(140deg, #e7d2d7 0%, #f6f0d9 24%, #bed9f2 48%, #7fd5e9 68%, #f3e0b0 100%);
}

.post-card__gallery-item.is-window::before {
	content: '';
	position: absolute;
	top: 24rpx;
	right: 28rpx;
	width: 176rpx;
	height: 220rpx;
	border-left: 8rpx solid rgba(255, 255, 255, 0.45);
	border-top: 8rpx solid rgba(255, 255, 255, 0.45);
	transform: rotate(4deg);
}

.post-card__gallery-glow {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background:
		radial-gradient(circle at 74% 18%, rgba(255, 255, 255, 0.34) 0, rgba(255, 255, 255, 0) 24%),
		radial-gradient(circle at 18% 82%, rgba(255, 255, 255, 0.2) 0, rgba(255, 255, 255, 0) 28%);
}

.post-card__gallery-count {
	position: absolute;
	right: 20rpx;
	bottom: 18rpx;
	font-size: 36rpx;
	font-weight: 700;
	line-height: 1;
	color: #ffffff;
	text-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.22);
}

.post-card__quote {
	margin-top: 24rpx;
	padding: 20rpx 24rpx;
	border-radius: 20rpx;
	background: #f7f7f8;
}

.post-card__quote-name {
	margin-left: 12rpx;
	font-size: 22rpx;
	color: #5c616c;
}

.post-card__quote-text {
	display: block;
	margin-top: 16rpx;
	font-size: 24rpx;
	line-height: 1.6;
	color: #30343a;
}

.post-card__community {
	margin-top: 28rpx;
}

.post-card__community-icon {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	height: 34rpx;
	padding: 0 12rpx;
	border-radius: 10rpx;
	background: #111111;
	font-size: 18rpx;
	line-height: 1;
	color: #f6d37e;
}

.post-card__community-text {
	margin-left: 14rpx;
	font-size: 24rpx;
	color: #8a909a;
}

.post-card__footer {
	justify-content: space-between;
	margin-top: 28rpx;
}

.post-card__date {
	font-size: 22rpx;
	color: #9ea4af;
}

.post-card__metrics {
	display: flex;
	align-items: center;
}

.post-card__metric {
	display: flex;
	align-items: center;
}

.post-card__metric + .post-card__metric {
	margin-left: 26rpx;
}

.post-card__metric-text {
	margin-left: 10rpx;
}

.post-card__actions {
	justify-content: flex-end;
	margin-top: 28rpx;
	padding-bottom: 26rpx;
	border-bottom: 2rpx solid #f0f1f3;
}

.post-card__action + .post-card__action {
	margin-left: 40rpx;
}

.post-card__action {
	font-size: 24rpx;
	line-height: 1.2;
}

.post-card__metric-text {
	font-size: 22rpx;
	color: #9ea4af;
}

.post-card__action--muted {
	color: #878c96;
}

.post-card__action--danger {
	color: #ff6c64;
}

.placeholder-card + .placeholder-card {
	margin-top: 20rpx;
}

.placeholder-card {
	padding: 28rpx 30rpx;
	border-radius: 24rpx;
	background: #f7f8fb;
}

.placeholder-card__row {
	justify-content: space-between;
}

.placeholder-card__title {
	font-size: 30rpx;
	font-weight: 600;
	line-height: 1.3;
	color: #22252b;
}

.placeholder-card__badge {
	font-size: 22rpx;
	color: #3256b3;
	background: #edf2ff;
	padding: 10rpx 14rpx;
	border-radius: 999rpx;
}

.placeholder-card__desc {
	display: block;
	margin-top: 14rpx;
	font-size: 24rpx;
	line-height: 1.6;
	color: #8a909a;
}
</style>
