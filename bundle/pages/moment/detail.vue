<template>
	<view class="moment-detail-page">
		<view class="moment-detail-page__nav" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="page-shell moment-detail-page__nav-inner">
				<view class="moment-detail-page__nav-main">
					<view class="moment-detail-page__back" @tap="goBack">
						<u-icon name="arrow-left" size="46" color="#111111"></u-icon>
					</view>

					<image class="moment-detail-page__author-avatar" :src="detail.authorAvatar" mode="aspectFill"></image>

					<view class="moment-detail-page__author">
						<text class="moment-detail-page__author-name">{{ detail.authorName }}</text>
						<text class="moment-detail-page__author-ip">{{ ui.ipPrefix }}{{ detail.authorIp }}</text>
					</view>
				</view>

				<view class="moment-detail-page__nav-actions">
					<view class="moment-detail-page__follow" @tap="handleFollow">
						{{ detail.following ? ui.followedLabel : ui.followLabel }}
					</view>
					<view class="moment-detail-page__share" @tap="handleShare">
						<u-icon name="share" size="38" color="#111111"></u-icon>
					</view>
				</view>
			</view>
		</view>

		<view class="moment-detail-page__body">
			<view class="moment-detail-hero">
				<swiper
					class="moment-detail-hero__swiper"
					:current="heroCurrent"
					:circular="true"
					:indicator-dots="false"
					@change="handleHeroChange"
				>
					<swiper-item v-for="(slide, index) in detail.heroImages" :key="`${slide.image}-${index}`">
						<view class="moment-detail-hero__slide">
							<image class="moment-detail-hero__image" :src="slide.image" mode="aspectFill"></image>
							<view class="moment-detail-hero__overlay"></view>

							<view class="moment-detail-hero__eyebrow">{{ slide.eyebrow }}</view>

							<view class="moment-detail-hero__copy">
								<text class="moment-detail-hero__title">{{ slide.title }}</text>
								<text class="moment-detail-hero__subtitle">{{ slide.subtitle }}</text>
								<text class="moment-detail-hero__caption">{{ slide.caption }}</text>
							</view>
						</view>
					</swiper-item>
				</swiper>

				<view class="moment-detail-hero__dots">
					<view
						v-for="(slide, index) in detail.heroImages"
						:key="`${slide.image}-dot-${index}`"
						:class="['moment-detail-hero__dot', heroCurrent === index ? 'is-active' : '']"
					></view>
				</view>
			</view>

			<view class="page-shell moment-detail-content">
				<view v-if="shouldShowShopInfo" class="moment-detail-shop" @tap="openShopInfoDetail">
					<image class="moment-detail-shop__image" :src="detail.shopInfo.image" mode="aspectFill"></image>

					<view class="moment-detail-shop__body">
						<view class="moment-detail-shop__head">
							<text class="moment-detail-shop__name">{{ detail.shopInfo.name }}</text>
							<text class="moment-detail-shop__distance">{{ detail.shopInfo.distance }}</text>
						</view>

						<view class="moment-detail-shop__rating">
							<view
								v-for="(filled, index) in detail.shopInfo.ratingStars"
								:key="`shop-star-${index}`"
								:class="['moment-detail-shop__star', filled ? 'is-active' : '']"
							>
								<u-icon name="star-fill" size="16" color="#ffffff"></u-icon>
							</view>
							<text class="moment-detail-shop__rating-text">{{ detail.shopInfo.ratingText }}</text>
						</view>

						<text class="moment-detail-shop__meta">{{ detail.shopInfo.region }} | {{ detail.shopInfo.category }}</text>
						<text class="moment-detail-shop__hours">{{ detail.shopInfo.businessHoursLabel }}{{ detail.shopInfo.businessHours }}</text>
					</view>
				</view>

				<view class="moment-detail-content__summary">
					<view class="moment-detail-content__text">
						<text
							v-for="(line, index) in detail.summaryLines"
							:key="`${line}-${index}`"
							:class="['moment-detail-content__line', index === 0 ? 'is-strong' : '']"
						>
							{{ line }}
						</text>
						<text class="moment-detail-content__topic" @tap="openTopicDetail">{{ detail.topic }}</text>
					</view>

					<view class="moment-detail-content__aside">
						<view class="moment-detail-content__aside-item" @tap="handleSave">
							<u-icon name="star" size="40" color="#9f9fa6"></u-icon>
							<text class="moment-detail-content__aside-text">{{ ui.saveLabel }}</text>
						</view>
						<view class="moment-detail-content__aside-item" @tap="handleReport">
							<u-icon name="warning" size="40" color="#9f9fa6"></u-icon>
							<text class="moment-detail-content__aside-text">{{ ui.reportLabel }}</text>
						</view>
					</view>
				</view>

				<view class="moment-detail-content__meta">
					<view class="moment-detail-content__badge">{{ ui.brandInitial }}</view>
					<text class="moment-detail-content__meta-text">
						{{ ui.fromLabel }} {{ detail.communityName }} | {{ detail.publishDate }} | {{ detail.viewsText }}
					</text>
				</view>

				<view class="moment-detail-comments">
					<text class="moment-detail-comments__title">
						{{ ui.commentsLabel }}{{ ui.leftBracket }}{{ detail.commentCount }}{{ ui.itemSuffix }}{{ ui.rightBracket }}
					</text>

					<view v-for="comment in detail.comments" :key="comment.id" class="moment-comment">
						<image class="moment-comment__avatar" :src="comment.avatar" mode="aspectFill"></image>

						<view class="moment-comment__body">
							<view class="moment-comment__head">
								<view class="moment-comment__author-row">
									<text class="moment-comment__author">{{ comment.author }}</text>
									<text v-if="comment.badge" class="moment-comment__badge">{{ comment.badge }}</text>
								</view>
								<view class="moment-comment__like" @tap="toggleCommentLike(comment)">
									<text class="moment-comment__like-count">{{ comment.likes }}</text>
									<u-icon
										:name="comment.liked ? 'heart-fill' : 'heart'"
										size="34"
										:color="comment.liked ? '#ef5c4d' : '#c7c7cc'"
									></u-icon>
								</view>
							</view>

							<text class="moment-comment__content">{{ comment.content }}</text>
							<text class="moment-comment__meta">
								{{ comment.date }} {{ ui.metaSeparator }} {{ comment.location }} {{ ui.replyLabel }}
							</text>

							<view v-if="comment.replies && comment.replies.length" class="moment-comment__reply-list">
								<view v-for="reply in comment.replies" :key="reply.id" class="moment-reply">
									<image class="moment-reply__avatar" :src="reply.avatar" mode="aspectFill"></image>

									<view class="moment-reply__body">
										<view class="moment-comment__head">
											<text class="moment-comment__author">{{ reply.author }}</text>
											<view class="moment-comment__like" @tap="toggleReplyLike(reply)">
												<text class="moment-comment__like-count">{{ reply.likes }}</text>
												<u-icon
													:name="reply.liked ? 'heart-fill' : 'heart'"
													size="32"
													:color="reply.liked ? '#ef5c4d' : '#c7c7cc'"
												></u-icon>
											</view>
										</view>

										<text class="moment-reply__content">
											<text class="moment-reply__target">{{ ui.replyLabel }}{{ reply.replyTo }}{{ ui.replySuffix }}</text>
											{{ reply.content }}
										</text>
										<text class="moment-comment__meta">
											{{ reply.date }} {{ ui.metaSeparator }} {{ reply.location }} {{ ui.replyLabel }}
										</text>
									</view>
								</view>

								<view
									v-if="comment.moreReplyText"
									class="moment-comment__more"
									@tap="showNotice(ui.moreRepliesToast)"
								>
									{{ comment.moreReplyText }}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="moment-detail-bottom">
			<view class="page-shell moment-detail-bottom__inner">
				<view class="moment-detail-bottom__input" @tap="showNotice(ui.commentToast)">
					{{ ui.inputPlaceholder }}
				</view>

				<view class="moment-detail-bottom__actions">
					<view class="moment-detail-bottom__action" @tap="handleLike">
						<u-icon
							:name="detail.bottomLiked ? 'heart-fill' : 'heart'"
							size="44"
							:color="detail.bottomLiked ? '#ef5c4d' : '#b4b4b8'"
						></u-icon>
						<text class="moment-detail-bottom__count">{{ detail.bottomLikeCount }}</text>
					</view>
					<view class="moment-detail-bottom__action" @tap="showNotice(ui.commentToast)">
						<u-icon name="chat" size="42" color="#b4b4b8"></u-icon>
						<text class="moment-detail-bottom__count">{{ detail.bottomCommentCount }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
const UI_TEXT = {
	ipPrefix: 'IP:',
	followLabel: '关注',
	followedLabel: '已关注',
	saveLabel: '收藏',
	reportLabel: '举报',
	brandInitial: '伊',
	fromLabel: '来自',
	commentsLabel: '评论',
	itemSuffix: '条',
	replyLabel: '回复',
	replySuffix: '：',
	leftBracket: '（',
	rightBracket: '）',
	metaSeparator: '·',
	inputPlaceholder: '说点什么呗',
	commentToast: '评论功能开发中',
	moreRepliesToast: '更多回复开发中',
	shareToast: '分享功能开发中',
	saveToast: '已加入收藏',
	followedToast: '已关注',
	unfollowedToast: '已取消关注'
}

const TREASURE_SHOP_INFOS = {
	'place-shop-1-0': {
		name: '春夏焕颜',
		distance: '距离5km',
		ratingStars: [true, true, true, true, false],
		ratingText: '4.8',
		region: '朝阳区',
		category: '中国菜',
		businessHoursLabel: '营业时间：',
		businessHours: '8:00-20:00',
		image: '/static/linshi/04.png',
		campusId: 'guanghua-soho2'
	},
	'place-shop-1-1': {
		name: '林间晨食',
		distance: '距离3.2km',
		ratingStars: [true, true, true, true, true],
		ratingText: '4.9',
		region: '朝阳区',
		category: '早午餐',
		businessHoursLabel: '营业时间：',
		businessHours: '7:30-18:30',
		image: '/static/linshi/05.png',
		campusId: 'guanghua-soho2'
	},
	'place-shop-2-0': {
		name: '雨后小馆',
		distance: '距离4.1km',
		ratingStars: [true, true, true, true, false],
		ratingText: '4.7',
		region: '国贸',
		category: '咖啡简餐',
		businessHoursLabel: '营业时间：',
		businessHours: '9:00-21:00',
		image: '/static/linshi/03.png',
		campusId: 'guomao'
	},
	'place-shop-2-1': {
		name: '桥边晚风',
		distance: '距离6.8km',
		ratingStars: [true, true, true, true, false],
		ratingText: '4.6',
		region: '国贸',
		category: '轻食酒馆',
		businessHoursLabel: '营业时间：',
		businessHours: '11:00-23:00',
		image: '/static/linshi/04.png',
		campusId: 'guomao'
	}
}

const DETAILS = {
	1: {
		id: 1,
		authorName: '汤bliss',
		authorIp: '北京',
		authorAvatar: '/static/linshi/01.png',
		following: false,
		communityName: '伊美尔社群',
		publishDate: '2026/01/19',
		viewsText: '1.1万浏览',
		topic: '#晒出最治愈的行驶瞬间#',
		commentCount: 85,
		bottomLikeCount: 56,
		bottomCommentCount: 56,
		bottomLiked: false,
		summaryLines: [
			'最喜欢早上8点的上海',
			'没有很多人',
			'街道很安静',
			'只有偶然传来的鸟叫声',
			'适合慢慢的放空自己'
		],
		heroImages: [
			{
				image: '/static/linshi/05.png',
				eyebrow: 'JANE',
				title: '清洁\n是一切的起点',
				subtitle: '先把底子打干净\n护肤才有意义',
				caption: 'First, clean the foundation thoroughly\nskincare is meaningful'
			},
			{
				image: '/static/linshi/04.png',
				eyebrow: 'EVER CARE',
				title: '把状态留给自己',
				subtitle: '慢下来\n才能看见情绪的纹理',
				caption: 'Keep your calm and listen to yourself'
			},
			{
				image: '/static/linshi/03.png',
				eyebrow: 'MOMENT',
				title: '清晨的风景\n很适合重启',
				subtitle: '城市还没喗闹\n人也更松弛',
				caption: 'A quiet morning resets the whole day'
			}
		],
		comments: [
			{
				id: 'comment-1',
				author: 'Ever Care',
				badge: '作者',
				avatar: '/static/linshi/01.png',
				content: '积分大户',
				date: '01-14',
				location: '北京',
				likes: 56,
				liked: true,
				replies: [
					{
						id: 'reply-1',
						author: 'H太秃',
						replyTo: 'H太秃',
						avatar: '/static/linshi/02.png',
						content: '哈哈，我这个都能入精选，溜了',
						date: '01-14',
						location: '北京',
						likes: 56,
						liked: true
					},
					{
						id: 'reply-2',
						author: '刚Dahe',
						replyTo: 'H太秃',
						avatar: '/static/linshi/03.png',
						content: '留个货给你勒😂',
						date: '01-14',
						location: '北京',
						likes: 56,
						liked: false
					}
				],
				moreReplyText: '展示更多回复'
			}
		]
	},
	2: {
		id: 2,
		authorName: '汤bliss',
		authorIp: '北京',
		authorAvatar: '/static/linshi/01.png',
		following: true,
		communityName: '伊美尔社群',
		publishDate: '2026/01/20',
		viewsText: '9820浏览',
		topic: '#把今天过得有质感#',
		commentCount: 46,
		bottomLikeCount: 38,
		bottomCommentCount: 46,
		bottomLiked: true,
		summaryLines: [
			'下雨天更适合发呆',
			'咖啡馆靠窗的位置',
			'人不多',
			'音乐刚刚好',
			'像给自己按了暂停键'
		],
		heroImages: [
			{
				image: '/static/linshi/04.png',
				eyebrow: 'RAINY DAY',
				title: '慢一点\n也没关系',
				subtitle: '在节奏很快的时候\n给自己留一格空白',
				caption: 'Slow down and keep one quiet space'
			},
			{
				image: '/static/linshi/05.png',
				eyebrow: 'COFFEE',
				title: '一杯热拿铁\n刚好抵抗阴天',
				subtitle: '不必赶路\n先把心情放回原位',
				caption: 'Warm coffee steadies a grey afternoon'
			}
		],
		comments: [
			{
				id: 'comment-2',
				author: 'Miki',
				badge: '',
				avatar: '/static/linshi/02.png',
				content: '这组氛围感太强了，收藏了。',
				date: '01-20',
				location: '上海',
				likes: 12,
				liked: false,
				replies: [],
				moreReplyText: ''
			}
		]
	},
	3: {
		id: 3,
		authorName: '汤bliss',
		authorIp: '北京',
		authorAvatar: '/static/linshi/01.png',
		following: false,
		communityName: '伊美尔社群',
		publishDate: '2026/01/22',
		viewsText: '7430浏览',
		topic: '#今天也在认真感受生活#',
		commentCount: 23,
		bottomLikeCount: 24,
		bottomCommentCount: 23,
		bottomLiked: false,
		summaryLines: [
			'有时候不是非要去很远的地方',
			'只是想找个安静角落',
			'听风',
			'晒太阳',
			'把脑子里多余的声音关小一点'
		],
		heroImages: [
			{
				image: '/static/linshi/03.png',
				eyebrow: 'SUNDAY',
				title: '给情绪留白',
				subtitle: '空一点\n人才会重新变轻',
				caption: 'Make room for silence and feel lighter'
			},
			{
				image: '/static/linshi/05.png',
				eyebrow: 'REST',
				title: '放空自己\n不是浪费时间',
				subtitle: '安静下来\n很多答案会自己浮出来',
				caption: 'Rest is also part of the answer'
			}
		],
		comments: [
			{
				id: 'comment-3',
				author: '阿乐',
				badge: '',
				avatar: '/static/linshi/03.png',
				content: '好喜欢这种轻一点的表达。',
				date: '01-22',
				location: '杭州',
				likes: 8,
				liked: false,
				replies: [],
				moreReplyText: ''
			}
		]
	}
}

function getStatusBarHeight() {
	try {
		const { statusBarHeight = 20 } = uni.getSystemInfoSync()
		return statusBarHeight
	} catch (error) {
		return 20
	}
}

function cloneDetail(detail) {
	return JSON.parse(JSON.stringify(detail))
}

function getMomentDetailById(id) {
	return cloneDetail(DETAILS[id] || DETAILS[1])
}

function resolveEntryType(options = {}) {
	if (options.entry === 'shop') {
		return 'shop'
	}

	if (typeof options.source === 'string' && options.source.indexOf('shop') !== -1) {
		return 'shop'
	}

	return 'moment'
}

function getTreasureShopInfo(shopId, detailId) {
	if (shopId && TREASURE_SHOP_INFOS[shopId]) {
		return {
			id: shopId,
			...cloneDetail(TREASURE_SHOP_INFOS[shopId])
		}
	}

	const fallbackShopId = Object.keys(TREASURE_SHOP_INFOS)[(Number(detailId) || 1) - 1]
	return fallbackShopId
		? {
			id: fallbackShopId,
			...cloneDetail(TREASURE_SHOP_INFOS[fallbackShopId])
		}
		: null
}

export default {
	data() {
		return {
			ui: UI_TEXT,
			statusBarHeight: getStatusBarHeight(),
			heroCurrent: 0,
			entryType: 'moment',
			detail: Object.assign({
				shopInfo: null
			}, getMomentDetailById(1))
		}
	},
	computed: {
		shouldShowShopInfo() {
			return this.entryType === 'shop' && !!(this.detail && this.detail.shopInfo)
		}
	},
	onLoad(options = {}) {
		const detail = getMomentDetailById(options.id)

		this.heroCurrent = 0
		this.entryType = resolveEntryType(options)
		detail.shopInfo = this.entryType === 'shop' ? getTreasureShopInfo(options.shopId, detail.id) : null
		this.detail = detail
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
		handleHeroChange(event) {
			this.heroCurrent = event.detail.current
		},
		handleFollow() {
			this.detail.following = !this.detail.following
			this.showNotice(this.detail.following ? this.ui.followedToast : this.ui.unfollowedToast)
		},
		handleShare() {
			this.showNotice(this.ui.shareToast)
		},
		handleSave() {
			this.showNotice(this.ui.saveToast)
		},
		handleReport() {
			uni.navigateTo({
				url: `/bundle/pages/moment/report?id=${this.detail.id}`
			})
		},
		openShopInfoDetail() {
			const shopInfo = this.detail.shopInfo

			if (!shopInfo || !shopInfo.id) {
				this.showNotice(shopInfo && shopInfo.name ? shopInfo.name : '店铺详情')
				return
			}

			uni.navigateTo({
				url: `/bundle/pages/treasure_shop/detail?shopId=${encodeURIComponent(shopInfo.id)}&source=moment-detail-shop`
			})
		},
		openTopicDetail() {
			const title = this.normalizeTopicTitle(this.detail.topic)

			if (!title) {
				return
			}

			uni.navigateTo({
				url: `/bundle/pages/topic/detail?title=${encodeURIComponent(title)}`
			})
		},
		normalizeTopicTitle(topic) {
			return (topic || '').replace(/^#+|#+$/g, '').trim()
		},
		handleLike() {
			this.detail.bottomLiked = !this.detail.bottomLiked
			this.detail.bottomLikeCount += this.detail.bottomLiked ? 1 : -1
		},
		toggleCommentLike(comment) {
			comment.liked = !comment.liked
			comment.likes += comment.liked ? 1 : -1
		},
		toggleReplyLike(reply) {
			reply.liked = !reply.liked
			reply.likes += reply.liked ? 1 : -1
		},
		showNotice(title) {
			uni.showToast({
				title,
				icon: 'none'
			})
		}
	}
}
</script>

<style scoped lang="scss">
.moment-detail-page {
	min-height: 100vh;
	background: #ffffff;
}

.moment-detail-page__nav {
	position: sticky;
	top: 0;
	z-index: 20;
	background: rgba(255, 255, 255, 0.96);
}

.moment-detail-page__nav-inner {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 96rpx;
}

.moment-detail-page__nav-main {
	display: flex;
	align-items: center;
	min-width: 0;
	flex: 1;
}

.moment-detail-page__back {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 64rpx;
	height: 64rpx;
	margin-right: 16rpx;
	flex-shrink: 0;
}

.moment-detail-page__author-avatar {
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
	background: #edf0f5;
	flex-shrink: 0;
}

.moment-detail-page__author {
	display: flex;
	align-items: baseline;
	min-width: 0;
	margin-left: 18rpx;
}

.moment-detail-page__author-name {
	font-size: 22rpx;
	font-weight: 600;
	color: #17181c;
}

.moment-detail-page__author-ip {
	margin-left: 18rpx;
	font-size: 22rpx;
	color: #8d9099;
}

.moment-detail-page__nav-actions {
	display: flex;
	align-items: center;
	margin-left: 24rpx;
	flex-shrink: 0;
}

.moment-detail-page__follow {
	display: flex;
	align-items: center;
	justify-content: center;
	min-width: 104rpx;
	height: 52rpx;
	padding: 0 24rpx;
	border: 2rpx solid #111111;
	border-radius: 999rpx;
	font-size: 22rpx;
	font-weight: 500;
	color: #111111;
	box-sizing: border-box;
}

.moment-detail-page__share {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 60rpx;
	height: 60rpx;
	margin-left: 20rpx;
}

.moment-detail-page__body {
	padding-bottom: 158rpx;
}

.moment-detail-hero {
	background: #eef1ec;
}

.moment-detail-hero__swiper {
	height: 968rpx;
}

.moment-detail-hero__slide {
	position: relative;
	height: 100%;
}

.moment-detail-hero__image {
	width: 100%;
	height: 100%;
}

.moment-detail-hero__overlay {
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	background:
		linear-gradient(180deg, rgba(0, 0, 0, 0.08) 0%, rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0.08) 100%),
		linear-gradient(180deg, rgba(0, 0, 0, 0) 54%, rgba(0, 0, 0, 0.22) 100%);
}

.moment-detail-hero__eyebrow {
	position: absolute;
	left: 0;
	right: 0;
	top: 44rpx;
	text-align: center;
	font-size: 20rpx;
	letter-spacing: 14rpx;
	color: rgba(255, 255, 255, 0.86);
}

.moment-detail-hero__copy {
	position: absolute;
	left: 80rpx;
	right: 80rpx;
	bottom: 110rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
}

.moment-detail-hero__title {
	white-space: pre-line;
	font-size: 74rpx;
	line-height: 1.14;
	font-weight: 700;
	color: #ffffff;
}

.moment-detail-hero__subtitle {
	margin-top: 28rpx;
	white-space: pre-line;
	font-size: 24rpx;
	line-height: 1.65;
	color: rgba(255, 255, 255, 0.92);
}

.moment-detail-hero__caption {
	margin-top: 18rpx;
	white-space: pre-line;
	font-size: 18rpx;
	line-height: 1.55;
	color: rgba(255, 255, 255, 0.72);
}

.moment-detail-hero__dots {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 24rpx 0 0;
	background: #ffffff;
}

.moment-detail-hero__dot {
	width: 18rpx;
	height: 4rpx;
	margin: 0 6rpx;
	border-radius: 999rpx;
	background: #c9ccd3;
}

.moment-detail-hero__dot.is-active {
	width: 22rpx;
	background: #24458f;
}

.moment-detail-content {
	padding-top: 26rpx;
	padding-bottom: 20rpx;
}

.moment-detail-shop {
	display: flex;
	align-items: center;
	padding: 28rpx;
	margin-bottom: 42rpx;
	border-radius: 22rpx;
	background: #f6f6f8;
}

.moment-detail-shop__image {
	width: 136rpx;
	height: 136rpx;
	border-radius: 18rpx;
	background: #dfe4ea;
	flex-shrink: 0;
}

.moment-detail-shop__body {
	flex: 1;
	min-width: 0;
	margin-left: 28rpx;
}

.moment-detail-shop__head {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
}

.moment-detail-shop__name {
	flex: 1;
	min-width: 0;
	font-size: 34rpx;
	line-height: 1.25;
	font-weight: 700;
	color: #1b1c20;
}

.moment-detail-shop__distance {
	margin-left: 24rpx;
	font-size: 24rpx;
	line-height: 1.4;
	color: #2a2d33;
	flex-shrink: 0;
}

.moment-detail-shop__rating {
	display: flex;
	align-items: center;
	margin-top: 18rpx;
}

.moment-detail-shop__star {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 24rpx;
	height: 24rpx;
	margin-right: 8rpx;
	border-radius: 4rpx;
	background: #d5d8e0;
}

.moment-detail-shop__star.is-active {
	background: #24458f;
}

.moment-detail-shop__rating-text {
	margin-left: 8rpx;
	font-size: 20rpx;
	line-height: 1;
	font-weight: 600;
	color: #24458f;
}

.moment-detail-shop__meta {
	display: block;
	margin-top: 18rpx;
	font-size: 26rpx;
	line-height: 1.4;
	color: #777b84;
}

.moment-detail-shop__hours {
	display: block;
	margin-top: 14rpx;
	font-size: 28rpx;
	line-height: 1.4;
	color: #44474f;
}

.moment-detail-content__summary {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	padding-bottom: 34rpx;
	border-bottom: 1px solid rgba(19, 24, 34, 0.08);
}

.moment-detail-content__text {
	flex: 1;
	min-width: 0;
	padding-right: 30rpx;
}

.moment-detail-content__line {
	display: block;
	font-size: 30rpx;
	line-height: 1.75;
	color: #17181c;
}

.moment-detail-content__line.is-strong {
	font-size: 34rpx;
	font-weight: 700;
	line-height: 1.55;
}

.moment-detail-content__topic {
	display: block;
	margin-top: 18rpx;
	font-size: 28rpx;
	line-height: 1.55;
	font-weight: 600;
	color: #24458f;
}

.moment-detail-content__aside {
	display: flex;
	align-items: flex-start;
	flex-shrink: 0;
	padding-top: 8rpx;
}

.moment-detail-content__aside-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 72rpx;
}

.moment-detail-content__aside-item + .moment-detail-content__aside-item {
	margin-left: 24rpx;
}

.moment-detail-content__aside-text {
	margin-top: 12rpx;
	font-size: 22rpx;
	line-height: 1;
	color: #8f939e;
}

.moment-detail-content__meta {
	display: flex;
	align-items: center;
	margin-top: 26rpx;
	padding-bottom: 38rpx;
	border-bottom: 1px solid rgba(19, 24, 34, 0.08);
}

.moment-detail-content__badge {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 30rpx;
	height: 30rpx;
	border-radius: 8rpx;
	background: #17181c;
	font-size: 18rpx;
	font-weight: 700;
	color: #f5d77a;
}

.moment-detail-content__meta-text {
	margin-left: 14rpx;
	font-size: 22rpx;
	line-height: 1.4;
	color: #8e919b;
}

.moment-detail-comments {
	padding-top: 36rpx;
}

.moment-detail-comments__title {
	display: block;
	font-size: 42rpx;
	font-weight: 700;
	line-height: 1.2;
	color: #18191d;
}

.moment-comment {
	display: flex;
	align-items: flex-start;
	margin-top: 40rpx;
}

.moment-comment__avatar {
	width: 72rpx;
	height: 72rpx;
	border-radius: 50%;
	background: #edf0f5;
	flex-shrink: 0;
}

.moment-comment__body {
	flex: 1;
	min-width: 0;
	margin-left: 22rpx;
}

.moment-comment__head {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
}

.moment-comment__author-row {
	display: flex;
	align-items: center;
	min-width: 0;
	padding-top: 2rpx;
}

.moment-comment__author {
	font-size: 28rpx;
	line-height: 1.3;
	color: #2a2b31;
}

.moment-comment__badge {
	margin-left: 12rpx;
	padding: 6rpx 12rpx;
	border-radius: 999rpx;
	background: #e9efff;
	font-size: 20rpx;
	line-height: 1;
	color: #5f77b8;
}

.moment-comment__like {
	display: flex;
	align-items: center;
	margin-left: 16rpx;
	flex-shrink: 0;
}

.moment-comment__like-count {
	margin-right: 10rpx;
	font-size: 24rpx;
	line-height: 1;
	color: #989ba4;
}

.moment-comment__content {
	display: block;
	margin-top: 18rpx;
	font-size: 28rpx;
	line-height: 1.7;
	color: #17181c;
}

.moment-comment__meta {
	display: block;
	margin-top: 16rpx;
	font-size: 22rpx;
	line-height: 1.4;
	color: #9b9ea7;
}

.moment-comment__reply-list {
	margin-top: 22rpx;
}

.moment-reply {
	display: flex;
	align-items: flex-start;
}

.moment-reply + .moment-reply {
	margin-top: 24rpx;
}

.moment-reply__avatar {
	width: 46rpx;
	height: 46rpx;
	border-radius: 50%;
	background: #edf0f5;
	flex-shrink: 0;
}

.moment-reply__body {
	flex: 1;
	min-width: 0;
	margin-left: 18rpx;
}

.moment-reply__content {
	display: block;
	margin-top: 14rpx;
	font-size: 28rpx;
	line-height: 1.65;
	color: #17181c;
}

.moment-reply__target {
	color: #24458f;
}

.moment-comment__more {
	margin-top: 24rpx;
	font-size: 22rpx;
	line-height: 1.4;
	color: #6d7180;
}

.moment-detail-bottom {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 30;
	padding: 14rpx 0 calc(env(safe-area-inset-bottom) + 14rpx);
	background: rgba(255, 255, 255, 0.96);
	border-top: 1px solid rgba(19, 24, 34, 0.06);
}

.moment-detail-bottom__inner {
	display: flex;
	align-items: center;
}

.moment-detail-bottom__input {
	flex: 1;
	min-width: 0;
	height: 74rpx;
	padding: 0 30rpx;
	border-radius: 999rpx;
	background: #f3f4f6;
	font-size: 28rpx;
	line-height: 74rpx;
	color: #a0a3ac;
}

.moment-detail-bottom__actions {
	display: flex;
	align-items: center;
	flex-shrink: 0;
	margin-left: 24rpx;
}

.moment-detail-bottom__action {
	display: flex;
	align-items: center;
}

.moment-detail-bottom__action + .moment-detail-bottom__action {
	margin-left: 26rpx;
}

.moment-detail-bottom__count {
	margin-left: 10rpx;
	font-size: 26rpx;
	line-height: 1;
	color: #8b8e97;
}
</style>

