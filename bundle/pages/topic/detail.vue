<template>
	<view class="topic-detail-page">
		<view class="topic-detail-hero">
			<image class="topic-detail-hero__image" :src="detail.heroImage" mode="aspectFill"></image>
			<view class="topic-detail-hero__mask"></view>

			<view class="topic-detail-page__nav" :style="{ paddingTop: `${statusBarHeight}px` }">
				<view class="page-shell topic-detail-page__nav-inner">
					<view class="topic-detail-page__back" @tap="goBack">
						<u-icon name="arrow-left" size="46" color="#ffffff"></u-icon>
					</view>
				</view>
			</view>
		</view>

		<view class="topic-detail-page__body">
			<view class="topic-detail-page__summary">
				<text class="topic-detail-page__title">{{ formatTopicTitle(detail.title) }}</text>
				<text class="topic-detail-page__lead">{{ detail.lead }}</text>

				<view class="topic-guideline">
					<text class="topic-guideline__title">{{ ui.rewardTitle }}</text>
					<text
						v-for="(item, index) in detail.rewardRules"
						:key="`reward-${index}`"
						class="topic-guideline__item"
					>
						{{ index + 1 }}. {{ item }}
					</text>
				</view>

				<view class="topic-guideline">
					<text class="topic-guideline__title">{{ ui.requirementTitle }}</text>
					<text
						v-for="(item, index) in detail.requirementRules"
						:key="`requirement-${index}`"
						class="topic-guideline__item"
					>
						{{ index + 1 }}. {{ item }}
					</text>
				</view>
			</view>

			<view class="page-shell topic-detail-feed">
				<view class="topic-detail-tabs">
					<view
						v-for="tab in tabs"
						:key="tab.key"
						:class="['topic-detail-tabs__item', currentTab === tab.key ? 'is-active' : '']"
						@tap="currentTab = tab.key"
					>
						{{ tab.label }}
					</view>
				</view>

				<friend-list :list="currentPosts" @select="openMomentDetail" />
			</view>
		</view>

		<view class="topic-detail-cta">
			<view class="page-shell topic-detail-cta__inner">
				<view class="topic-detail-cta__button" @tap="handleParticipate">{{ ui.ctaLabel }}</view>
			</view>
		</view>
	</view>
</template>

<script>
import FriendList from '@/components/friend-list/friend-list.vue'

const UI_TEXT = {
	rewardTitle: '【话题激励】',
	requirementTitle: '【话题要求】',
	ctaLabel: '参与话题'
}

const TOPIC_TABS = [
	{ key: 'hot', label: '热门' },
	{ key: 'latest', label: '最新' }
]

const BASE_POSTS = {
	hot: [
		{
			id: 1,
			author: 'Ever Care',
			avatar: '/static/linshi/01.png',
			memberText: '蓝卡会员',
			date: '2026-06-01',
			content:
				'有幸再次被你刷到，日子慢慢来，做一个干净温柔、闪闪发光的未来精致美少女。#伊美尔官方 #变美计划',
			images: [
				'/static/linshi/03.png',
				'/static/linshi/04.png',
				'/static/linshi/01.png',
				'/static/linshi/05.png',
				'/static/linshi/03.png'
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
			liked: true
		},
		{
			id: 2,
			author: '慢慢变好呀',
			avatar: '/static/linshi/01.png',
			memberText: '银卡会员',
			date: '2026-05-30',
			content:
				'最近的关键词就是稳定和坚持。没有一下子变成别人眼里的样子，而是越来越接近自己喜欢的状态。#变美打卡计划',
			images: ['/static/linshi/01.png'],
			quote: null,
			sourceText: '社区 · 来自 焕颜体验小组',
			views: 218,
			comments: 22,
			likes: 18,
			liked: false
		}
	],
	latest: [
		{
			id: 3,
			author: '认真护肤中',
			avatar: '/static/linshi/01.png',
			memberText: '蓝卡会员',
			date: '2026-06-01',
			content:
				'今天也来打卡一下恢复期。情绪稳定下来以后，才发现认真记录这件事本身就很治愈。#变美打卡计划',
			images: ['/static/linshi/05.png', '/static/linshi/03.png'],
			quote: null,
			sourceText: '社区 · 来自 术后恢复打卡营',
			views: 96,
			comments: 11,
			likes: 9,
			liked: false
		},
		{
			id: 1,
			author: 'Ever Care',
			avatar: '/static/linshi/01.png',
			memberText: '官方账号',
			date: '2026-05-29',
			content:
				'欢迎把你的体验、术前准备、术后护理和真实感受分享出来，我们会认真看到每一条用心记录。#变美打卡计划',
			images: ['/static/linshi/03.png'],
			quote: null,
			sourceText: '社区 · 来自 伊美尔官方',
			views: 182,
			comments: 28,
			likes: 36,
			liked: true
		}
	]
}

const BASE_TOPIC_DETAIL = {
	id: 'beauty-checkin',
	title: '变美打卡计划',
	heroImage: '/static/linshi/03.png',
	lead: '变美从来不是冲动，而是认真爱自己的开始。来聊聊你的变美体验吧！',
	rewardRules: [
		'符合话题要求且认真分享、贴合主题、富有参考价值的优质内容即有机会获得58-200积分盲盒一个，共计300个；',
		'更有机会额外斩获200积分热文奖励，积分将在次月15日之前发放。'
	],
	requirementRules: [
		'请尊重原创，分享真实体验与个人感受，禁止搬运他人内容；',
		'内容可围绕医美项目体验、术前准备、术后恢复、皮肤管理、抗衰护理、避坑心得等方向展开；',
		'文案不少于50字，图片不少于2张；如发布15秒以上视频，视频需有标题或封面，并配置对应字幕；'
	],
	posts: BASE_POSTS
}

function getStatusBarHeight() {
	try {
		const { statusBarHeight = 20 } = uni.getSystemInfoSync()
		return statusBarHeight
	} catch (error) {
		return 20
	}
}

function decodeText(value = '') {
	try {
		return decodeURIComponent(value)
	} catch (error) {
		return value
	}
}

function clonePosts() {
	return JSON.parse(JSON.stringify(BASE_POSTS))
}

function buildTopicDetail(options = {}) {
	const customTitle = decodeText(options.title || '').replace(/^#+|#+$/g, '').trim()
	const title = customTitle || BASE_TOPIC_DETAIL.title
	const lead =
		title === BASE_TOPIC_DETAIL.title
			? BASE_TOPIC_DETAIL.lead
			: `围绕「${title}」分享你的真实体验、恢复感受与变美心得，让更多人看见认真爱自己的过程。`

	return {
		...BASE_TOPIC_DETAIL,
		id: options.id || BASE_TOPIC_DETAIL.id,
		title,
		lead,
		posts: clonePosts()
	}
}

export default {
	components: {
		FriendList
	},
	data() {
		return {
			ui: UI_TEXT,
			statusBarHeight: getStatusBarHeight(),
			tabs: TOPIC_TABS,
			currentTab: 'hot',
			detail: buildTopicDetail()
		}
	},
	computed: {
		currentPosts() {
			return this.detail.posts[this.currentTab] || []
		}
	},
	onLoad(options = {}) {
		this.currentTab = 'hot'
		this.detail = buildTopicDetail(options)
	},
	methods: {
		formatTopicTitle(title) {
			return `#${title}#`
		},
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
		openMomentDetail(post) {
			if (!post || !post.id) {
				return
			}

			uni.navigateTo({
				url: `/bundle/pages/moment/detail?id=${post.id}&source=topic-detail`
			})
		},
		handleParticipate() {
			uni.navigateTo({
				url: `/bundle/pages/publish/editor?scene=moment&topic=${encodeURIComponent(this.detail.title)}`
			})
		}
	}
}
</script>

<style scoped lang="scss">
.topic-detail-page {
	min-height: 100vh;
	background: #ffffff;
}

.topic-detail-hero {
	position: relative;
	height: 760rpx;
	background: #dbe3ef;
	overflow: hidden;
}

.topic-detail-hero__image {
	width: 100%;
	height: 100%;
}

.topic-detail-hero__mask {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background:
		linear-gradient(180deg, rgba(10, 18, 32, 0.24) 0%, rgba(10, 18, 32, 0) 34%, rgba(10, 18, 32, 0.08) 100%),
		linear-gradient(180deg, rgba(10, 18, 32, 0) 56%, rgba(10, 18, 32, 0.16) 100%);
}

.topic-detail-page__nav {
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	z-index: 5;
}

.topic-detail-page__nav-inner {
	display: flex;
	align-items: center;
	height: 96rpx;
}

.topic-detail-page__back {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 72rpx;
	height: 72rpx;
	margin-left: -14rpx;
}

.topic-detail-page__body {
	position: relative;
	margin-top: -24rpx;
	padding-bottom: 176rpx;
	border-radius: 32rpx 32rpx 0 0;
	background: #ffffff;
}

.topic-detail-page__summary {
	padding: 42rpx 44rpx 0;
}

.topic-detail-page__title {
	display: block;
	font-size: 56rpx;
	line-height: 1.18;
	font-weight: 700;
	color: #17181c;
}

.topic-detail-page__lead {
	display: block;
	margin-top: 26rpx;
	font-size: 30rpx;
	line-height: 1.7;
	color: #6f7581;
}

.topic-guideline {
	margin-top: 22rpx;
}

.topic-guideline__title {
	display: block;
	font-size: 30rpx;
	line-height: 1.5;
	font-weight: 600;
	color: #545964;
}

.topic-guideline__item {
	display: block;
	margin-top: 10rpx;
	font-size: 30rpx;
	line-height: 1.72;
	color: #6f7581;
}

.topic-detail-feed {
	margin-top: 34rpx;
	padding-top: 10rpx;
	border-top: 2rpx solid #f0f2f5;
}

.topic-detail-tabs {
	display: flex;
	align-items: center;
}

.topic-detail-tabs__item {
	position: relative;
	padding: 22rpx 2rpx 24rpx;
	margin-right: 52rpx;
	font-size: 34rpx;
	line-height: 1;
	color: #8b9099;
}

.topic-detail-tabs__item.is-active {
	font-weight: 700;
	color: #17181c;
}

.topic-detail-tabs__item.is-active::after {
	content: '';
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	height: 6rpx;
	border-radius: 999rpx;
	background: #21408d;
}

.topic-detail-cta {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 20;
	padding: 20rpx 0 calc(env(safe-area-inset-bottom) + 20rpx);
	background: rgba(255, 255, 255, 0.98);
	border-top: 1px solid rgba(18, 24, 38, 0.06);
}

.topic-detail-cta__button {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 96rpx;
	border-radius: 999rpx;
	background: #21408d;
	font-size: 32rpx;
	font-weight: 600;
	color: #ffffff;
	box-shadow: 0 18rpx 36rpx rgba(33, 64, 141, 0.18);
}
</style>
