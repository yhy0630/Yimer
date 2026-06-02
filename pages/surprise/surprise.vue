<template>
	<view class="surprise-page">
		<view class="home-nav surprise-nav" :style="{ paddingTop: statusBarHeight + 'px' }">
			<view class="page-shell home-nav__inner">
				<view class="topbar flex row-between">
					<view class="top-tabs flex">
						<view
							v-for="(item, index) in topTabs"
							:key="item"
							:class="['top-tab', activeTopTab === index ? 'is-active' : '']"
							@tap="setActiveTopTab(index)"
						>
							{{ item }}
							<image v-if="activeTopTab === index" src="/static/images/active.png" class="tab_active"></image>
						</view>
					</view>
					<view class="top-actions flex">
						<view class="action-icon" @tap="showNotice('消息中心')">
							<image src="/static/images/news.png"></image>
						</view>
						<view class="action-icon" @tap="showNotice('更多操作')">
							<image src="/static/images/add.png"></image>
						</view>
					</view>
				</view>
			</view>
		</view>

		<template v-if="activeTopTab === 0">
			<view class="hero">
				<view class="hero-blur hero-blur--left"></view>
				<view class="hero-blur hero-blur--right"></view>
				<view class="hero-blur hero-blur--bottom"></view>

				<view class="page-shell hero-shell">
					<view class="hero-copy">
						<text v-for="line in hero.titleLines" :key="line" class="hero-title">{{ line }}</text>
						<text class="hero-subtitle">{{ hero.subtitle }}</text>
						<text class="hero-subtitle">{{ hero.subtitleSecond }}</text>
					</view>

					<view class="hero-visual">
						<view class="hero-table"></view>
						<view class="hero-table-top"></view>
						<view class="hero-table-leg hero-table-leg--left"></view>
						<view class="hero-table-leg hero-table-leg--center"></view>
						<view class="hero-table-leg hero-table-leg--right"></view>

						<view class="hero-note">
							<view class="hero-note-pin"></view>
							<view class="hero-note-stand"></view>
							<text class="hero-note-title">一杯美式，</text>
							<text class="hero-note-title">就是春天的美事啊。</text>
							<text class="hero-note-brand">惊喜</text>
						</view>

						<view class="hero-cup">
							<view class="hero-cup-lid"></view>
							<view class="hero-cup-rim"></view>
							<view class="hero-cup-body">
								<view class="hero-cup-logo">
									<view class="hero-cup-logo-mark"></view>
								</view>
								<text class="hero-cup-logo-text">Ymi Coffee</text>
							</view>
							<view class="hero-cup-base"></view>
						</view>
					</view>

					<view class="hero-dots">
						<view
							v-for="dot in 3"
							:key="dot"
							:class="['hero-dot', dot === 2 ? 'is-active' : '']"
						></view>
					</view>
				</view>
			</view>

			<view class="content-panel">
				<view class="page-shell">
					<view class="section-head">
						<view class="section-head-left">
							<view class="section-mark"></view>
							<text class="section-title">精彩活动</text>
						</view>
						<text class="section-action" @tap="openSurpriseActivityMore">了解更多</text>
					</view>

					<view
						v-for="item in activities"
						:key="item.id"
						class="activity-item"
						@tap="showNotice(item.title)"
					>
						<view :class="['activity-thumb', item.thumbTheme]">
							<view v-if="item.thumbTheme === 'theme-sky'" class="thumb-moon"></view>
							<view v-if="item.thumbTheme === 'theme-flower'" class="thumb-petal thumb-petal--one"></view>
							<view v-if="item.thumbTheme === 'theme-flower'" class="thumb-petal thumb-petal--two"></view>
							<view v-if="item.thumbTheme === 'theme-window'" class="thumb-window-frame"></view>
							<view v-if="item.thumbTheme === 'theme-window'" class="thumb-window-sill"></view>
						</view>
						<view class="activity-body">
							<text class="activity-title line-2">{{ item.title }}</text>
							<text class="activity-date">{{ item.date }}</text>
							<view class="activity-meta">
								<text class="activity-apply">{{ item.signupText }}</text>
								<text class="activity-status">{{ item.status }}</text>
							</view>
						</view>
					</view>

					<view class="section-head section-head--community">
						<view class="section-head-left">
							<view class="section-mark"></view>
							<text class="section-title">伊美尔美学家社区</text>
						</view>
					</view>

					<view class="community-feed">
						<treasure-shop-list
							:items="communityTreasureItems"
							@select="openCommunityPost"
						/>
					</view>
				</view>
			</view>
		</template>

		<template v-else>
			<view class="page-shell selected-shell">
				<view class="location-row flex row-between" @tap="openCampusSelector">
					<view class="location-main flex row-center">
						<image src="/static/images/address.png"></image>
						<text class="location-text line-1">{{ selectedLocation }}</text>
					</view>
					<view class="location-switch flex row-center">
						<image src="/static/images/qiehuan.png"></image>
						<text class="location-switch-text">切换</text>
					</view>
				</view>

				<view class="selected-hero-card" @tap="showNotice(selectedHero.noticeTitle)">
					<view class="selected-hero-card__glow selected-hero-card__glow--one"></view>
					<view class="selected-hero-card__glow selected-hero-card__glow--two"></view>
					<text class="selected-hero-card__brand">EVER CARE</text>
					<text class="selected-hero-card__season">惊喜美季</text>
					<text class="selected-hero-card__title">{{ selectedHero.title }}</text>
					<view class="selected-hero-card__badge">
						<text class="selected-hero-card__badge-date">{{ selectedHero.date }}</text>
						<text class="selected-hero-card__badge-copy">{{ selectedHero.copy }}</text>
					</view>
					<image class="selected-hero-card__model" :src="selectedHero.image" mode="aspectFill"></image>
				</view>

				<view class="section-head section-head--selected">
					<view class="section-head-left">
						<view class="section-mark"></view>
						<text class="section-title">明星商品</text>
					</view>
					<text class="section-action" @tap="showNotice('查看更多明星商品')">查看更多</text>
				</view>

				<view class="selected-feature-list">
					<view
						v-for="item in starProducts"
						:key="item.id"
						:class="['selected-feature-card', `is-${item.theme}`]"
						@tap="showNotice(item.title)"
					>
						<view class="selected-feature-card__copy">
							<text class="selected-feature-card__eyebrow">{{ item.eyebrow }}</text>
							<text class="selected-feature-card__title">{{ item.title }}</text>
							<text class="selected-feature-card__desc">{{ item.desc }}</text>
							<view class="selected-feature-card__tags">
								<text
									v-for="tag in item.tags"
									:key="`${item.id}-${tag}`"
									class="selected-feature-card__tag"
								>
									{{ tag }}
								</text>
							</view>
						</view>
						<image class="selected-feature-card__image" :src="item.image" mode="aspectFill"></image>
					</view>
				</view>

				<scroll-view class="selected-category-scroll" scroll-x show-scrollbar="false">
					<view class="selected-category-list">
						<view
							v-for="item in selectedCategories"
							:key="item.id"
							:class="['selected-category-chip', selectedCategoryId === item.id ? 'is-active' : '']"
							@tap="selectedCategoryId = item.id"
						>
							{{ item.label }}
						</view>
					</view>
				</scroll-view>

				<view class="selected-sort-tabs">
					<view
						v-for="item in selectedSortTabs"
						:key="item.id"
						:class="['selected-sort-tab', selectedSortId === item.id ? 'is-active' : '']"
						@tap="selectedSortId = item.id"
					>
						{{ item.label }}
					</view>
				</view>

				<view class="selected-goods-wrap">
					<home-recommend-section
						entry="surprise-strict"
						:items="strictRecommendList"
						@select="handleStrictGoodSelect"
					/>
				</view>
			</view>
		</template>
	</view>
</template>

<script>
import HomeRecommendSection from '@/components/home/HomeRecommendSection/HomeRecommendSection.vue'
import TreasureShopList from '@/components/surprise/TreasureShopList/TreasureShopList.vue'
import {
	DEFAULT_CAMPUS,
	formatCampusLocation
} from '@/config/campus'

const getStatusBarHeight = () => {
	try {
		const { statusBarHeight = 20 } = uni.getSystemInfoSync()
		return statusBarHeight
	} catch (error) {
		return 20
	}
}

const SELECTED_CATEGORIES = [
	{ id: 'skin', label: '皮肤管理' },
	{ id: 'repair', label: '补水修护' },
	{ id: 'bright', label: '美白淡斑' },
	{ id: 'antiage', label: '抗衰紧致' },
	{ id: 'inject', label: '注射微整' }
]

const SELECTED_SORT_TABS = [
	{ id: 'default', label: '综合' },
	{ id: 'sales', label: '销量' },
	{ id: 'heat', label: '热度' },
	{ id: 'price', label: '价格' }
]

const SELECTED_GOODS = [
	{
		id: 101,
		categoryId: 'skin',
		name: '年度医美计划',
		image: '/static/linshi/01.png',
		price: 699,
		marketPrice: 6990,
		ratingText: '100%好评率',
		recommendText: '1w+推荐',
		salesSum: 388,
		heat: 92,
		tags: ['皮肤管理', '年度计划']
	},
	{
		id: 102,
		categoryId: 'skin',
		name: '水光亮肤年卡',
		image: '/static/linshi/02.png',
		price: 799,
		marketPrice: 7590,
		ratingText: '98%好评率',
		recommendText: '9k+推荐',
		salesSum: 356,
		heat: 90,
		tags: ['水光亮肤', '年卡']
	},
	{
		id: 103,
		categoryId: 'repair',
		name: '补水修护护理',
		image: '/static/linshi/03.png',
		price: 699,
		marketPrice: 6990,
		ratingText: '99%好评率',
		recommendText: '8k+推荐',
		salesSum: 268,
		heat: 88,
		tags: ['补水修护', '舒缓维稳']
	},
	{
		id: 104,
		categoryId: 'bright',
		name: '焕亮透白计划',
		image: '/static/linshi/04.png',
		price: 899,
		marketPrice: 8990,
		ratingText: '97%好评率',
		recommendText: '1.1w+推荐',
		salesSum: 312,
		heat: 91,
		tags: ['焕亮透白', '淡化暗沉']
	},
	{
		id: 105,
		categoryId: 'antiage',
		name: '胶原紧致管理',
		image: '/static/linshi/05.png',
		price: 999,
		marketPrice: 9990,
		ratingText: '98%好评率',
		recommendText: '7k+推荐',
		salesSum: 226,
		heat: 89,
		tags: ['抗衰紧致', '胶原提升']
	},
	{
		id: 106,
		categoryId: 'inject',
		name: '面部精修方案',
		image: '/static/linshi/02.png',
		price: 1280,
		marketPrice: 12800,
		ratingText: '96%好评率',
		recommendText: '6k+推荐',
		salesSum: 184,
		heat: 86,
		tags: ['注射微整', '面部轮廓']
	}
]

const SELECTED_HERO = {
	noticeTitle: '我的人生“夏”一下',
	title: '我的人生“夏”一下',
	date: '8.15-8.31',
	copy: '转场入夏 捕捉夏日实况\n预定制作专属旅行收纳袋',
	image: '/static/linshi/01.png'
}

const STAR_PRODUCTS = [
	{
		id: 'star-serum',
		theme: 'blue',
		eyebrow: '初见礼遇',
		title: '水光美白',
		desc: '焕亮肌肤 水润透亮',
		tags: ['水光亮白精华'],
		image: '/static/linshi/05.png'
	},
	{
		id: 'star-cream',
		theme: 'gold',
		eyebrow: '初见礼遇',
		title: '水光美白',
		desc: '深层补水 透亮年轻',
		tags: ['深层补水', '提亮肤色', '紧致精华'],
		image: '/static/linshi/03.png'
	}
]

export default {
	components: {
		HomeRecommendSection,
		TreasureShopList
	},
	data() {
		return {
			statusBarHeight: getStatusBarHeight(),
			activeTopTab: 0,
			topTabs: ['活动', '严选'],
			currentCampus: DEFAULT_CAMPUS,
			selectedLocation: formatCampusLocation(DEFAULT_CAMPUS),
			selectedHero: SELECTED_HERO,
			starProducts: STAR_PRODUCTS,
			selectedCategories: SELECTED_CATEGORIES,
			selectedCategoryId: SELECTED_CATEGORIES[0].id,
			selectedSortTabs: SELECTED_SORT_TABS,
			selectedSortId: 'default',
			selectedGoods: SELECTED_GOODS,
			hero: {
				titleLines: ['一杯美式，', '就是春天的美事啊。'],
				subtitle: '让生活的小确幸，',
				subtitleSecond: '在平凡日常里悄悄发光。'
			},
			activities: [
				{
					id: 1,
					title: '制“燥”惊喜 | 积分福利月月抽',
					date: '4月13日 星期一',
					signupText: '145人报名',
					status: '报名中',
					thumbTheme: 'theme-sky'
				},
				{
					id: 2,
					title: '春日特辑 | 承包您和朋友们的下午茶',
					date: '4月13日 星期一',
					signupText: '145人报名',
					status: '报名中',
					thumbTheme: 'theme-flower'
				},
				{
					id: 3,
					title: '福利合伙人 | 马选齿科儿童口腔游园会',
					date: '4月13日 星期一',
					signupText: '145人报名',
					status: '报名中',
					thumbTheme: 'theme-window'
				}
			],
			communityPosts: [
				{
					id: 1,
					author: '李富贵',
					avatar: '/static/linshi/02.png',
					memberText: '美学体验官',
					date: '2026-05-29',
					content: '发量真的是得靠养，最近认真护理之后状态稳定了很多。#头皮养护日记#',
					images: ['/static/linshi/01.png'],
					sourceText: '社区 · 来自 伊美尔美学家社区',
					views: 128,
					comments: 16,
					likes: 45,
					liked: true
				},
				{
					id: 2,
					author: '林间晚风',
					avatar: '/static/linshi/01.png',
					memberText: '蓝卡会员',
					date: '2026-05-27',
					content: '春天总要留一杯咖啡时间，把舒服和松弛感都装进窗边。#春日变美计划#',
					images: ['/static/linshi/02.png', '/static/linshi/05.png'],
					sourceText: '社区 · 来自 伊美尔美学家社区',
					views: 96,
					comments: 12,
					likes: 45,
					liked: false
				},
				{
					id: 3,
					author: '慢慢变好呀',
					avatar: '/static/linshi/02.png',
					memberText: '银卡会员',
					date: '2026-05-24',
					content: '把恢复期认真记录下来以后，反而更能感受到每一天细微的变化。#恢复期打卡#',
					images: ['/static/linshi/03.png', '/static/linshi/04.png', '/static/linshi/01.png', '/static/linshi/05.png'],
					sourceText: '社区 · 来自 伊美尔美学家社区',
					views: 182,
					comments: 28,
					likes: 63,
					liked: false
				}
			]
		}
	},
	computed: {
		communityTreasureItems() {
			return this.communityPosts.map(item => ({
				id: item.id,
				image: (item.images && item.images[0]) || '/static/linshi/01.png',
				shopName: '伊美尔美学家社区',
				title: item.content.replace(/#[^#]+#/g, '').trim(),
				authorAvatar: item.avatar,
				authorName: item.author,
				likes: item.likes
			}))
		},
		strictGoodsList() {
			const filteredList = this.selectedGoods.filter(item => item.categoryId === this.selectedCategoryId)
			const list = filteredList.length ? filteredList.slice() : this.selectedGoods.slice()

			if (this.selectedSortId === 'sales') {
				return list.sort((first, second) => second.salesSum - first.salesSum)
			}

			if (this.selectedSortId === 'heat') {
				return list.sort((first, second) => second.heat - first.heat)
			}

			if (this.selectedSortId === 'price') {
				return list.sort((first, second) => first.price - second.price)
			}

			return list
		},
		strictRecommendList() {
			return this.strictGoodsList.map(item => ({
				id: item.id,
				image: item.image,
				tags: item.tags || ['水光抗衰', '水光焕亮'],
				title: item.title || item.name,
				price: item.price
			}))
		}
	},
	methods: {
		openGoodsDetail(item) {
			if (!item || !item.id) {
				return
			}

			const url = `/bundle_surprise/pages/goods_detail/goods_detail?id=${item.id}&name=${encodeURIComponent(item.title || item.name || '')}&price=${item.price || ''}&marketPrice=${item.marketPrice || ''}&source=surprise`

			uni.navigateTo({
				url
			})
		},
		setActiveTopTab(index) {
			this.activeTopTab = index
		},
		openSurpriseActivityMore() {
			uni.navigateTo({
				url: `/bundle_surprise/pages/activity_more/activity_more?categoryId=${this.selectedCategoryId}`
			})
		},
		openCampusSelector() {
			uni.navigateTo({
				url: `/bundle/pages/campus/campus?mode=select&source=surprise&currentCampusId=${this.currentCampus.id}`,
				success: (res) => {
					res.eventChannel.on('campusSelected', ({ campus }) => {
						this.currentCampus = campus
						this.selectedLocation = formatCampusLocation(campus)
					})
				}
			})
		},
		showNotice(title) {
			uni.showToast({
				title,
				icon: 'none'
			})
		},
		handleStrictGoodSelect(item) {
			const selectedItem = this.selectedGoods.find((goods) => goods.id === item.id)
			this.openGoodsDetail(selectedItem || item)
		},
		openCommunityPost(post) {
			if (!post || !post.id) {
				return
			}

			uni.navigateTo({
				url: `/bundle/pages/moment/detail?id=${post.id}&entry=moment&source=surprise`
			})
		}
	}
}
</script>

<style scoped lang="scss">
.surprise-page {
	min-height: 100vh;
	background: #ffffff;
}

.surprise-nav {
	position: sticky;
	top: 0;
	z-index: 10;
	background: linear-gradient(180deg, rgba(244, 247, 255, 1) 0%, rgba(244, 247, 255, 1) 100%);
	backdrop-filter: blur(16rpx);
}

.home-nav__inner {
	padding-bottom: 12rpx;
}

.topbar {
	height: 88rpx;
}

.top-tab {
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

.top-tab.is-active {
	color: #143080;
	font-weight: 700;
}

.action-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 52rpx;
	height: 52rpx;
	margin-left: 30rpx;
	border-radius: 50%;

	image {
		width: 40rpx;
		height: 40rpx;
	}
}

.selected-shell {
	padding-top: 12rpx;
	padding-bottom: calc(180rpx + env(safe-area-inset-bottom));
}

.location-row {
	margin-top: 10rpx;
}

.location-main {
	min-width: 0;

	image {
		width: 28rpx;
		height: 28rpx;
	}
}

.location-text {
	margin-left: 10rpx;
	font-size: 24rpx;
	color: #1a1b1d;
}

.location-switch {
	flex-shrink: 0;

	image {
		width: 36rpx;
		height: 36rpx;
	}
}

.location-switch-text {
	margin-left: 6rpx;
	font-size: 24rpx;
	color: #323437;
}

.selected-hero-card {
	position: relative;
	height: 930rpx;
	margin-top: 20rpx;
	padding: 42rpx 34rpx;
	border-radius: 18rpx;
	overflow: hidden;
	background:
		radial-gradient(circle at 24% 18%, rgba(186, 241, 255, 0.42) 0, rgba(186, 241, 255, 0) 180rpx),
		radial-gradient(circle at 78% 22%, rgba(255, 255, 255, 0.26) 0, rgba(255, 255, 255, 0) 160rpx),
		linear-gradient(180deg, #52bcff 0%, #45b7ff 38%, #30a6f0 100%);
	box-shadow: 0 24rpx 44rpx rgba(50, 115, 191, 0.18);
}

.selected-hero-card__glow {
	position: absolute;
	border-radius: 50%;
	filter: blur(12rpx);
	opacity: 0.8;
}

.selected-hero-card__glow--one {
	left: -50rpx;
	bottom: 180rpx;
	width: 200rpx;
	height: 200rpx;
	background: rgba(173, 255, 238, 0.4);
}

.selected-hero-card__glow--two {
	right: -30rpx;
	top: 100rpx;
	width: 240rpx;
	height: 240rpx;
	background: rgba(230, 245, 255, 0.34);
}

.selected-hero-card__brand,
.selected-hero-card__season,
.selected-hero-card__title,
.selected-hero-card__badge {
	position: relative;
	z-index: 2;
}

.selected-hero-card__brand {
	display: block;
	font-size: 30rpx;
	font-weight: 600;
	letter-spacing: 2rpx;
	color: rgba(20, 48, 128, 0.8);
}

.selected-hero-card__season {
	display: block;
	margin-top: 8rpx;
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.92);
}

.selected-hero-card__title {
	display: block;
	width: 440rpx;
	margin-top: 54rpx;
	font-size: 92rpx;
	line-height: 1.06;
	font-weight: 400;
	letter-spacing: 2rpx;
	color: rgba(207, 255, 240, 0.92);
}

.selected-hero-card__badge {
	width: 238rpx;
	margin-top: 72rpx;
	padding: 28rpx 24rpx;
	border-radius: 18rpx;
	background: rgba(76, 128, 196, 0.34);
	backdrop-filter: blur(8rpx);
}

.selected-hero-card__badge-date {
	display: block;
	font-size: 58rpx;
	line-height: 1;
	font-weight: 500;
	color: #ffffff;
}

.selected-hero-card__badge-copy {
	display: block;
	margin-top: 14rpx;
	font-size: 24rpx;
	line-height: 1.5;
	white-space: pre-line;
	color: rgba(255, 255, 255, 0.94);
}

.selected-hero-card__model {
	position: absolute;
	right: -30rpx;
	bottom: 0;
	width: 580rpx;
	height: 720rpx;
}

.section-head--selected {
	margin-top: 42rpx;
}

.selected-feature-list {
	margin-top: 22rpx;
}

.selected-feature-card {
	position: relative;
	display: flex;
	align-items: center;
	min-height: 280rpx;
	padding: 34rpx 36rpx;
	border-radius: 18rpx;
	overflow: hidden;
}

.selected-feature-card + .selected-feature-card {
	margin-top: 22rpx;
}

.selected-feature-card.is-blue {
	background:
		radial-gradient(circle at 72% 52%, rgba(255, 255, 255, 0.84) 0, rgba(255, 255, 255, 0) 120rpx),
		linear-gradient(135deg, #edf5ff 0%, #cce1ff 42%, #edf6ff 100%);
}

.selected-feature-card.is-gold {
	background:
		radial-gradient(circle at 78% 54%, rgba(255, 255, 255, 0.76) 0, rgba(255, 255, 255, 0) 138rpx),
		linear-gradient(135deg, #fdf5e8 0%, #f5e4c6 48%, #fff8ef 100%);
}

.selected-feature-card__copy {
	position: relative;
	z-index: 2;
	flex: 1;
	min-width: 0;
}

.selected-feature-card__eyebrow {
	display: block;
	font-size: 30rpx;
	color: rgba(45, 52, 74, 0.8);
}

.selected-feature-card__title {
	display: block;
	margin-top: 12rpx;
	font-size: 66rpx;
	line-height: 1.08;
	font-weight: 500;
	color: #245ec7;
}

.selected-feature-card.is-gold .selected-feature-card__title {
	color: #9a6a3b;
}

.selected-feature-card__desc {
	display: block;
	margin-top: 18rpx;
	font-size: 26rpx;
	color: rgba(60, 66, 82, 0.72);
}

.selected-feature-card__tags {
	display: flex;
	flex-wrap: wrap;
	margin-top: 26rpx;
}

.selected-feature-card__tag {
	margin-right: 14rpx;
	margin-bottom: 10rpx;
	padding: 8rpx 18rpx;
	border-radius: 999rpx;
	font-size: 20rpx;
	color: rgba(60, 66, 82, 0.72);
	background: rgba(255, 255, 255, 0.5);
}

.selected-feature-card__image {
	position: relative;
	z-index: 1;
	flex: none;
	width: 208rpx;
	height: 208rpx;
	margin-left: 16rpx;
	border-radius: 28rpx;
}

.selected-category-scroll {
	margin-top: 48rpx;
	white-space: nowrap;
}

.selected-category-list {
	display: inline-flex;
	padding-right: 20rpx;
}

.selected-category-chip {
	flex: none;
	margin-right: 18rpx;
	padding: 18rpx 30rpx;
	border-radius: 18rpx;
	font-size: 26rpx;
	line-height: 1;
	color: #6f7583;
	background: #f4f5f7;
}

.selected-category-chip.is-active {
	color: #143080;
	background: #eaf0ff;
	font-weight: 600;
}

.selected-sort-tabs {
	display: flex;
	align-items: center;
	margin-top: 28rpx;
	padding: 0 4rpx;
}

.selected-sort-tab {
	position: relative;
	margin-right: 58rpx;
	padding-bottom: 18rpx;
	font-size: 28rpx;
	line-height: 1;
	color: #626878;
}

.selected-sort-tab.is-active {
	color: #143080;
	font-weight: 700;
}

.selected-sort-tab.is-active::after {
	content: '';
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	height: 6rpx;
	border-radius: 999rpx;
	background: #143080;
}

.selected-goods-wrap {
	margin-top: 8rpx;
}

.hero {
	position: relative;
	overflow: hidden;
	background:
		radial-gradient(circle at 18% 16%, rgba(245, 255, 232, 0.98) 0, rgba(245, 255, 232, 0.24) 180rpx, transparent 340rpx),
		radial-gradient(circle at 78% 22%, rgba(255, 255, 255, 0.88) 0, rgba(255, 255, 255, 0.12) 160rpx, transparent 320rpx),
		radial-gradient(circle at 50% 48%, rgba(255, 255, 255, 0.56) 0, rgba(255, 255, 255, 0.08) 120rpx, transparent 260rpx),
		linear-gradient(180deg, #edf8c2 0%, #dceeb7 22%, #eff8de 66%, #f7fbef 100%);
}

.hero-shell {
	position: relative;
	z-index: 2;
	padding-top: 48rpx;
	padding-bottom: 34rpx;
}

.hero-blur {
	position: absolute;
	border-radius: 50%;
	filter: blur(36rpx);
	opacity: 0.8;
}

.hero-blur--left {
	left: -50rpx;
	top: 140rpx;
	width: 240rpx;
	height: 240rpx;
	background: rgba(214, 241, 150, 0.7);
}

.hero-blur--right {
	right: -40rpx;
	top: 280rpx;
	width: 220rpx;
	height: 220rpx;
	background: rgba(188, 227, 145, 0.62);
}

.hero-blur--bottom {
	left: 180rpx;
	bottom: 110rpx;
	width: 260rpx;
	height: 180rpx;
	background: rgba(255, 255, 255, 0.56);
}

.hero-copy {
	margin-top: 24rpx;
}

.hero-title {
	display: block;
	font-size: 74rpx;
	line-height: 1.18;
	font-weight: 600;
	letter-spacing: -1rpx;
	color: #2d241f;
}

.hero-subtitle {
	display: block;
	font-size: 28rpx;
	line-height: 1.5;
	color: rgba(45, 36, 31, 0.78);
}

.hero-subtitle:first-of-type {
	margin-top: 26rpx;
}

.hero-visual {
	position: relative;
	height: 560rpx;
	margin-top: 34rpx;
}

.hero-table {
	position: absolute;
	left: -44rpx;
	right: -44rpx;
	bottom: 116rpx;
	height: 26rpx;
	border-radius: 999rpx;
	background: rgba(255, 255, 255, 0.76);
	box-shadow: 0 20rpx 34rpx rgba(130, 135, 68, 0.18);
}

.hero-table-top {
	position: absolute;
	left: -10rpx;
	right: -10rpx;
	bottom: 120rpx;
	height: 116rpx;
	border-radius: 999rpx;
	background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(239, 244, 221, 0.96) 100%);
	box-shadow: 0 28rpx 42rpx rgba(128, 124, 84, 0.16);
}

.hero-table-leg {
	position: absolute;
	bottom: 0;
	width: 18rpx;
	height: 154rpx;
	border-radius: 999rpx;
	background: linear-gradient(180deg, #825b2d 0%, #5d3918 100%);
	box-shadow: 0 12rpx 20rpx rgba(84, 56, 24, 0.18);
	transform-origin: top center;
}

.hero-table-leg--left {
	left: 148rpx;
	transform: rotate(7deg);
}

.hero-table-leg--center {
	left: 258rpx;
	height: 166rpx;
}

.hero-table-leg--right {
	right: 154rpx;
	transform: rotate(-8deg);
}

.hero-note {
	position: absolute;
	left: 82rpx;
	bottom: 182rpx;
	width: 330rpx;
	height: 214rpx;
	padding: 94rpx 28rpx 24rpx;
	border-radius: 4rpx;
	background: linear-gradient(180deg, rgba(247, 239, 237, 0.96) 0%, rgba(255, 250, 248, 0.98) 100%);
	box-shadow: 0 18rpx 34rpx rgba(118, 88, 70, 0.14);
	box-sizing: border-box;
}

.hero-note-pin {
	position: absolute;
	left: 50%;
	top: -40rpx;
	width: 12rpx;
	height: 46rpx;
	margin-left: -6rpx;
	border-radius: 999rpx;
	background: linear-gradient(180deg, #8a642f 0%, #6f491f 100%);
}

.hero-note-pin::before {
	content: '';
	position: absolute;
	left: 50%;
	top: -18rpx;
	width: 28rpx;
	height: 28rpx;
	margin-left: -14rpx;
	border-radius: 50%;
	background: radial-gradient(circle at 32% 30%, #f0d6a1 0, #c08b34 40%, #7a541f 100%);
	box-shadow: 0 6rpx 14rpx rgba(119, 81, 28, 0.26);
}

.hero-note-stand {
	position: absolute;
	left: 30rpx;
	right: 30rpx;
	bottom: -18rpx;
	height: 22rpx;
	border-radius: 999rpx;
	background: linear-gradient(180deg, #e0cfaa 0%, #f0e6cf 100%);
	box-shadow: 0 10rpx 16rpx rgba(99, 77, 45, 0.18);
}

.hero-note-title {
	display: block;
	font-size: 26rpx;
	line-height: 1.4;
	color: #2f241f;
}

.hero-note-brand {
	position: absolute;
	left: 28rpx;
	bottom: 22rpx;
	font-size: 20rpx;
	color: rgba(47, 36, 31, 0.42);
}

.hero-cup {
	position: absolute;
	right: 82rpx;
	bottom: 150rpx;
	width: 132rpx;
}

.hero-cup-lid {
	height: 24rpx;
	border-radius: 20rpx 20rpx 10rpx 10rpx;
	background: linear-gradient(180deg, #fbf8f3 0%, #f0ebe2 100%);
	box-shadow: 0 10rpx 16rpx rgba(150, 140, 120, 0.14);
}

.hero-cup-rim {
	width: 118rpx;
	height: 12rpx;
	margin: -2rpx auto 0;
	border-radius: 999rpx;
	background: #ffffff;
}

.hero-cup-body {
	width: 110rpx;
	height: 188rpx;
	margin: 0 auto;
	padding-top: 42rpx;
	border-radius: 6rpx 6rpx 18rpx 18rpx;
	background: linear-gradient(180deg, #3153bf 0%, #203e9d 100%);
	box-shadow: 0 18rpx 26rpx rgba(53, 76, 152, 0.16);
	box-sizing: border-box;
}

.hero-cup-logo {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 42rpx;
	height: 42rpx;
	margin: 0 auto;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.9);
}

.hero-cup-logo-mark {
	width: 18rpx;
	height: 22rpx;
	border-radius: 10rpx 10rpx 12rpx 12rpx;
	background: #203e9d;
}

.hero-cup-logo-text {
	display: block;
	margin-top: 12rpx;
	font-size: 16rpx;
	text-align: center;
	color: rgba(255, 255, 255, 0.84);
}

.hero-cup-base {
	width: 126rpx;
	height: 16rpx;
	margin: -2rpx auto 0;
	border-radius: 999rpx;
	background: linear-gradient(180deg, #f8f4ef 0%, #ebe4da 100%);
}

.hero-dots {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 18rpx;
}

.hero-dot {
	width: 16rpx;
	height: 4rpx;
	margin: 0 5rpx;
	border-radius: 999rpx;
	background: rgba(255, 255, 255, 0.76);
}

.hero-dot.is-active {
	width: 34rpx;
	background: #ffffff;
}

.content-panel {
	position: relative;
	margin-top: -8rpx;
	padding-top: 26rpx;
	padding-bottom: calc(180rpx + env(safe-area-inset-bottom));
	border-radius: 32rpx 32rpx 0 0;
	background: #ffffff;
}

.section-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.section-head--community {
	margin-top: 40rpx;
}

.community-feed {
	margin-top: 24rpx;
}

.section-head-left {
	display: flex;
	align-items: center;
}

.section-mark {
	width: 6rpx;
	height: 32rpx;
	border-radius: 999rpx;
	background: #143080;
}

.section-title {
	margin-left: 12rpx;
	font-size: 34rpx;
	line-height: 1;
	font-weight: 600;
	color: #141824;
}

.section-action {
	font-size: 22rpx;
	color: #8d92a2;
}

.activity-item {
	display: flex;
	align-items: flex-start;
	padding: 30rpx 0 2rpx;
}

.activity-thumb {
	position: relative;
	flex: none;
	width: 104rpx;
	height: 104rpx;
	border-radius: 16rpx;
	overflow: hidden;
	box-shadow: 0 10rpx 22rpx rgba(36, 47, 84, 0.08);
}

.theme-sky {
	background:
		linear-gradient(180deg, rgba(255, 255, 255, 0.26) 0%, rgba(255, 255, 255, 0) 36%),
		linear-gradient(180deg, #77b8ff 0%, #d8ecff 65%, #f8fbff 100%);
}

.theme-sky::after {
	content: '';
	position: absolute;
	left: -8rpx;
	right: -8rpx;
	bottom: -14rpx;
	height: 42rpx;
	border-radius: 40rpx 40rpx 0 0;
	background: #111629;
	transform: rotate(-6deg);
}

.theme-sky::before {
	content: '';
	position: absolute;
	left: 20rpx;
	right: 20rpx;
	bottom: 10rpx;
	height: 18rpx;
	border-radius: 999rpx;
	background: rgba(17, 22, 41, 0.56);
	transform: rotate(6deg);
}

.thumb-moon {
	position: absolute;
	left: 24rpx;
	top: 26rpx;
	width: 10rpx;
	height: 10rpx;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.94);
}

.theme-flower {
	background:
		linear-gradient(180deg, rgba(255, 246, 220, 0.2) 0%, rgba(255, 246, 220, 0) 30%),
		linear-gradient(180deg, #4d98ea 0%, #7fc0ff 48%, #f2a842 48%, #f8d287 100%);
}

.theme-flower::after {
	content: '';
	position: absolute;
	left: -10rpx;
	right: -10rpx;
	bottom: -16rpx;
	height: 52rpx;
	border-radius: 50%;
	background: #121217;
}

.thumb-petal {
	position: absolute;
	width: 32rpx;
	height: 20rpx;
	border-radius: 999rpx;
	background: linear-gradient(180deg, #fff2df 0%, #ffe0ac 100%);
	box-shadow: 0 6rpx 10rpx rgba(124, 78, 11, 0.16);
	transform: rotate(24deg);
}

.thumb-petal--one {
	right: 20rpx;
	top: 18rpx;
}

.thumb-petal--two {
	right: 10rpx;
	top: 42rpx;
	width: 26rpx;
}

.theme-window {
	background: linear-gradient(180deg, #7fb662 0%, #d2f0aa 42%, #f5f1df 100%);
}

.thumb-window-frame {
	position: absolute;
	left: 26rpx;
	right: 26rpx;
	top: 10rpx;
	bottom: 18rpx;
	border: 6rpx solid rgba(49, 34, 18, 0.92);
	box-sizing: border-box;
}

.thumb-window-frame::before {
	content: '';
	position: absolute;
	left: 50%;
	top: 0;
	bottom: 0;
	width: 4rpx;
	margin-left: -2rpx;
	background: rgba(49, 34, 18, 0.92);
}

.thumb-window-frame::after {
	content: '';
	position: absolute;
	left: 0;
	right: 0;
	top: 50%;
	height: 4rpx;
	margin-top: -2rpx;
	background: rgba(49, 34, 18, 0.92);
}

.thumb-window-sill {
	position: absolute;
	left: 12rpx;
	right: 12rpx;
	bottom: 14rpx;
	height: 12rpx;
	border-radius: 999rpx;
	background: rgba(255, 248, 228, 0.84);
}

.activity-body {
	flex: 1;
	min-width: 0;
	padding-left: 22rpx;
}

.activity-title {
	font-size: 32rpx;
	line-height: 1.36;
	color: #1a1f2b;
}

.activity-date {
	display: block;
	margin-top: 10rpx;
	font-size: 24rpx;
	color: #8c90a0;
}

.activity-meta {
	display: flex;
	align-items: center;
	margin-top: 14rpx;
	font-size: 22rpx;
}

.activity-apply {
	color: #8c90a0;
}

.activity-status {
	margin-left: 10rpx;
	color: #143080;
}

</style>
