<template>
	<view class="community-detail-page">
		<view class="community-detail-hero" :style="{ paddingTop: topInset + 'px' }">
			<image class="community-detail-hero__bg" src="/static/linshi/13.png" mode="aspectFill" />
			<!-- <view class="community-detail-hero__mask"></view> -->

			<view class="community-detail-nav">
				<image class="community-detail-nav__icon" src="/static/images/back 1.png" mode="aspectFit" @tap="goBack" />
				<view class="community-detail-nav__right">
					<image class="community-detail-nav__icon" src="/static/images/share 1.png" mode="aspectFit" />
					<image class="community-detail-nav__icon m-l-20" src="/static/images/sandian.png" mode="aspectFit" />
				</view>
			</view>

			<view class="community-detail-summary">
				<image class="community-detail-summary__cover" src="/static/linshi/14.png" mode="aspectFill" />
				<view class="community-detail-summary__info">
					<text class="community-detail-summary__title">{{ pageTitle }}</text>
					<view class="community-detail-summary__tags">
						<text class="community-detail-summary__tag">北京市</text>
						<text class="community-detail-summary__tag">交友</text>
					</view>
				</view>
			</view>

			<text class="community-detail-summary__desc">
				欢迎来到「{{ pageTitle }}」社群。欢迎来到「{{ pageTitle }}」社群。欢迎来到「{{ pageTitle }}」社群。
			</text>

			<view class="community-detail-summary__member-row">
				<view class="community-detail-summary__avatars">
					<image
						v-for="(avatar, index) in memberAvatars"
						:key="`member-${index}`"
						class="community-detail-summary__avatar"
						:src="avatar"
						mode="aspectFill"
					/>
				</view>
				<text class="community-detail-summary__member-count">296名成员</text>
			</view>

			<view class="community-detail-summary__actions">
				<view class="community-detail-summary__btn" @tap="handleFollow">关注</view>
				<view class="community-detail-summary__btn" @tap="handleJoin">申请加入</view>
			</view>
		</view>

		<view class="community-detail-body">
			<view class="community-detail-tabs">
				<view
					v-for="tab in tabs"
					:key="tab.key"
					:class="['community-detail-tabs__item', currentTab === tab.key ? 'is-active' : '']"
					@tap="currentTab = tab.key"
				>
					{{ tab.label }}
				</view>
			</view>

			<friend-list
				v-if="currentTab === 'featured'"
				:list="featuredPosts"
				@select="handlePostSelect"
				@topic-select="handleTopicSelect"
			/>
			<view v-else-if="currentTab === 'topic'" class="community-topic">
				<view
					v-for="topic in topicList"
					:key="topic.id"
					class="community-topic__item"
					@tap="handleCommunityTopicTap(topic)"
				>
					<image class="community-topic__cover" :src="topic.cover" mode="aspectFill" />
					<view class="community-topic__body">
						<text class="community-topic__title line-1">#{{ topic.title }}</text>
						<text class="community-topic__sub">{{ topic.joinText }}</text>
					</view>
				</view>
			</view>
			<view v-else class="community-detail-topic-empty">内容建设中</view>
		</view>
	</view>
</template>

<script>
import FriendList from '@/components/friend-list/friend-list.vue'

const getTopInset = () => {
	try {
		const { statusBarHeight = 20 } = uni.getSystemInfoSync()
		return statusBarHeight + 10
	} catch (error) {
		return 30
	}
}

const TABS = [
	{ key: 'featured', label: '精华' },
	{ key: 'topic', label: '话题' }
]

const FEATURED_POSTS = [
	{
		id: 1,
		author: 'Ever Care',
		avatar: '/static/linshi/01.png',
		memberText: '蓝卡会员',
		date: '2026-02-08',
		content:
			'有幸再次被你刷到，日子慢慢来，做一个干净温柔、闪闪发光的未来精致美少女。#伊美尔官方 #变美计划',
		images: [
			'/static/linshi/11.png',
			'/static/linshi/12.png',
			'/static/linshi/10.png',
			'/static/linshi/13.png',
			'/static/linshi/12.png'
		],
		quote: {
			avatar: '/static/linshi/02.png',
			author: '倒塌de柏林墙',
			content: '牛屋这么豪，我缺的是C位吗？是缺去北京的票！'
		},
		sourceText: '社区 · 来自 伊美尔生活家社群',
		views: 356,
		comments: 56,
		likes: 56,
		liked: false
	}
]

const TOPIC_LIST = [
	{
		id: 'topic-1',
		title: '话题名称话题名称话题名称',
		joinText: '10w人已参与',
		cover: '/static/linshi/10.png'
	},
	{
		id: 'topic-2',
		title: '话题名称话题名称话题名称',
		joinText: '10w人已参与',
		cover: '/static/linshi/11.png'
	},
	{
		id: 'topic-3',
		title: '话题名称话题名称话题名称',
		joinText: '10w人已参与',
		cover: '/static/linshi/12.png'
	},
	{
		id: 'topic-4',
		title: '话题名称话题名称话题名称',
		joinText: '10w人已参与',
		cover: '/static/linshi/13.png'
	}
]

export default {
	name: 'CommunityDetail',
	components: {
		FriendList
	},
	data() {
		return {
			topInset: getTopInset(),
			pageTitle: 'Care生活分享社群',
			tabs: TABS,
			currentTab: 'featured',
			memberAvatars: ['/static/linshi/01.png', '/static/linshi/02.png', '/static/linshi/01.png', '/static/linshi/02.png', '/static/linshi/01.png'],
			featuredPosts: FEATURED_POSTS,
			topicList: TOPIC_LIST
		}
	},
	onLoad(options) {
		if (options && options.title) {
			this.pageTitle = decodeURIComponent(options.title)
		}
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		handleFollow() {
			uni.showToast({
				title: '已关注',
				icon: 'none'
			})
		},
		handleJoin() {
			uni.showToast({
				title: '申请已提交',
				icon: 'none'
			})
		},
		handlePostSelect(post) {
			uni.showToast({
				title: post.author,
				icon: 'none'
			})
		},
		handleTopicSelect(topic) {
			uni.showToast({
				title: topic.title,
				icon: 'none'
			})
		},
		handleCommunityTopicTap(topic) {
			if (!topic || !topic.title) {
				return
			}

			const query = topic.id
				? `id=${topic.id}&title=${encodeURIComponent(topic.title)}`
				: `title=${encodeURIComponent(topic.title)}`

			uni.navigateTo({
				url: `/bundle/pages/topic/detail?${query}`
			})
		}
	}
}
</script>

<style scoped lang="scss">
.community-detail-page {
	min-height: 100vh;
	background: #f6f7fb;
}

.community-detail-hero {
	position: relative;
	padding: 0 44rpx 36rpx;
	color: #ffffff;
}

.community-detail-hero__bg {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
}

.community-detail-hero__mask {
	position: absolute;
	inset: 0;
	background: linear-gradient(180deg, rgba(7, 15, 28, 0.35) 0%, rgba(34, 62, 98, 0.44) 58%, rgba(25, 40, 66, 0.28) 100%);
}

.community-detail-nav,
.community-detail-summary,
.community-detail-summary__desc,
.community-detail-summary__member-row,
.community-detail-summary__actions {
	position: relative;
	z-index: 1;
}

.community-detail-nav {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.community-detail-nav__right {
	display: flex;
	align-items: center;
}

.community-detail-nav__icon {
	width: 44rpx;
	height: 44rpx;
}

.community-detail-summary {
	display: flex;
	align-items: flex-start;
	margin-top: 33rpx;
}

.community-detail-summary__cover {
	width: 140rpx;
	height: 140rpx;
	// border-radius: 12rpx;
}

.community-detail-summary__info {
	flex: 1;
	min-width: 0;
	margin-left: 30rpx;
	// padding-top: 10rpx;
}

.community-detail-summary__title {
	display: block;
	font-size: 32rpx;
	font-weight: 500;
	line-height: 44rpx;
	color: #ffffff;
	font-style: normal;

}

.community-detail-summary__tags {
	display: flex;
	align-items: center;
	margin-top: 60rpx;
}

.community-detail-summary__tag {
	height: 34rpx;
	padding: 0 14rpx;
	margin-right: 12rpx;
	border-radius: 4rpx;
	background: rgba(255, 255, 255, 0.25);
	font-size: 20rpx;
	line-height: 34rpx;
	color: #FFF;
} 

.community-detail-summary__desc {
	display: block;
	margin-top: 40rpx;
	font-size: 24rpx;
	line-height: 1.5;
	color: rgba(255, 255, 255, 0.95);
}

.community-detail-summary__member-row {
	display: flex;
	align-items: center;
	margin-top: 44rpx;
}

.community-detail-summary__avatars {
	display: flex;
	align-items: center;
}

.community-detail-summary__avatar {
	width: 28rpx;
	height: 28rpx;
	margin-right: -8rpx;
	border: 1rpx solid #fff;
	border-radius: 50%;
}

.community-detail-summary__member-count {
	margin-left: 20rpx;
	font-size: 24rpx;
	color: #fff;
	font-style: normal;
	line-height: 32rpx;
	font-weight: 400;
}

.community-detail-summary__actions {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 98rpx;
}

.community-detail-summary__btn {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 316rpx;
	height: 62rpx;
	border: 2rpx solid rgba(255, 255, 255, 0.8);
	border-radius: 999rpx;
	font-size: 24rpx;
	color: #ffffff;
}

.community-detail-body {
	margin-top: -2rpx;
	border-radius: 22rpx 44rpx 0 0;
	background: #ffffff;
	padding: 22rpx 44rpx calc(env(safe-area-inset-bottom) + 24rpx);
}

.community-detail-tabs {
	display: flex;
	align-items: center;
	margin-bottom: 48rpx;
}

.community-detail-tabs__item {
	position: relative;
	margin-right: 48rpx;
	padding: 8rpx 0;
	font-size: 32rpx;
	color: #777;
	line-height: 44rpx;
	font-weight: 400;
	font-style: normal;
}

.community-detail-tabs__item.is-active {
	font-weight: 500;
	color: #143080;
	font-size: 32rpx;
	line-height: 44rpx;

}

.community-detail-tabs__item.is-active::after {
	content: '';
	position: absolute;
	left: 16rpx;
	right: 0;
	bottom: -8rpx;
	height: 4rpx;
	width: 32rpx;
	border-radius: 26rpx;
	background: #143080;
}

.community-detail-topic-empty {
	padding: 60rpx 0;
	text-align: center;
	font-size: 26rpx;
	color: #7777;
}

.community-topic {
	padding-top: 10rpx;
}

.community-topic__item {
	display: flex;
	align-items: flex-start;
	padding: 22rpx 0;
}

.community-topic__cover {
	width: 144rpx;
	height: 144rpx;
	border-radius: 14rpx;
	background: #edf1f9;
	flex: none;
}

.community-topic__body {
	flex: 1;
	min-width: 0;
	margin-left: 22rpx;
}

.community-topic__title {
	display: block;
	font-size: 28rpx;
	font-weight: 400;
	line-height: 1.2;
	color: #1a1b1d;
}

.community-topic__sub {
	display: block;
	margin-top: 16rpx;
	font-size: 24rpx;
	color: #77797e;
	font-weight: 400;

	
}
</style>
