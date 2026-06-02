<template>
	<view class="surprise-activity-more-page">
		<view class="surprise-activity-more-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="surprise-activity-more-page__nav page-shell">
				<view class="surprise-activity-more-page__back" @tap="goBack">
					<u-icon name="arrow-left" size="46" color="#23262d"></u-icon>
				</view>
			</view>

			<view class="page-shell surprise-activity-more-page__toolbar">
				<view class="surprise-activity-more-page__location flex row-between">
					<view class="surprise-activity-more-page__location-main flex" @tap="openCampusSelector">
						<image class="surprise-activity-more-page__location-icon" src="/static/images/address.png" mode="aspectFit"></image>
						<text class="surprise-activity-more-page__location-text line-1">{{ locationText }}</text>
					</view>
					<view class="surprise-activity-more-page__location-switch flex" @tap="openCampusSelector">
						<image class="surprise-activity-more-page__switch-icon" src="/static/images/qiehuan.png" mode="aspectFit"></image>
						<text class="surprise-activity-more-page__switch-text">切换</text>
					</view>
				</view>

				<view class="surprise-activity-more-page__search">
					<u-icon name="search" size="40" color="#b9bcc3"></u-icon>
					<view class="surprise-activity-more-page__search-divider"></view>
					<input
						v-model.trim="keyword"
						class="surprise-activity-more-page__search-input"
						placeholder="请搜索"
						placeholder-class="surprise-activity-more-page__search-placeholder"
						confirm-type="search"
					/>
				</view>

				<scroll-view class="surprise-activity-more-page__category-scroll" scroll-x show-scrollbar="false">
					<view class="surprise-activity-more-page__category-list">
						<view
							v-for="item in categories"
							:key="item.id"
							:class="['surprise-activity-more-page__category-chip', selectedCategoryId === item.id ? 'is-active' : '']"
							@tap="selectedCategoryId = item.id"
						>
							{{ item.label }}
						</view>
					</view>
				</scroll-view>

				<view class="surprise-activity-more-page__sort-tabs">
					<view
						v-for="item in sortTabs"
						:key="item.id"
						:class="['surprise-activity-more-page__sort-tab', selectedSortId === item.id ? 'is-active' : '']"
						@tap="selectedSortId = item.id"
					>
						{{ item.label }}
					</view>
				</view>
			</view>
		</view>

		<view class="page-shell surprise-activity-more-page__body">
			<view v-if="displayGoods.length" class="surprise-activity-more-page__goods-list">
				<view
					v-for="item in displayGoods"
					:key="item.id"
					class="surprise-activity-more-page__goods-card"
					@tap="handleGoodSelect(item)"
				>
					<image class="surprise-activity-more-page__goods-image" :src="item.image" mode="aspectFill"></image>

					<view class="surprise-activity-more-page__goods-content">
						<text class="surprise-activity-more-page__goods-title line-2">{{ item.name }}</text>

						<view class="surprise-activity-more-page__goods-meta">
							<text class="surprise-activity-more-page__goods-rating">{{ item.ratingText }}</text>
							<text class="surprise-activity-more-page__goods-divider">|</text>
							<text class="surprise-activity-more-page__goods-recommend">{{ item.recommendText }}</text>
						</view>

						<view class="surprise-activity-more-page__goods-price-row">
							<text class="surprise-activity-more-page__goods-price">￥{{ item.price }}</text>
							<view class="surprise-activity-more-page__goods-market-wrap">
								<view class="surprise-activity-more-page__goods-market-icon"></view>
								<text class="surprise-activity-more-page__goods-market-price">{{ item.marketPrice }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view v-else class="surprise-activity-more-page__empty">
				<text class="surprise-activity-more-page__empty-title">没有找到相关项目</text>
				<text class="surprise-activity-more-page__empty-desc">试试更换搜索词或分类看看</text>
			</view>
		</view>
	</view>
</template>

<script>
import {
	DEFAULT_CAMPUS,
	formatCampusLocation
} from '@/config/campus'

function getStatusBarHeight() {
	try {
		const { statusBarHeight = 20 } = uni.getSystemInfoSync()
		return statusBarHeight
	} catch (error) {
		return 20
	}
}

function normalizeKeyword(keyword) {
	return String(keyword || '').trim().toLowerCase()
}

function cloneList(list) {
	return JSON.parse(JSON.stringify(list))
}

const PAGE_CATEGORIES = [
	{ id: 'skin', label: '皮肤管理' },
	{ id: 'repair', label: '补水修护' },
	{ id: 'bright', label: '美白淡斑' },
	{ id: 'antiage', label: '抗衰紧致' },
	{ id: 'inject', label: '注射微整' }
]

const PAGE_SORT_TABS = [
	{ id: 'default', label: '综合' },
	{ id: 'sales', label: '销量' },
	{ id: 'heat', label: '热度' },
	{ id: 'price', label: '价格' }
]

const PAGE_GOODS_LIST = [
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

export default {
	data() {
		return {
			statusBarHeight: getStatusBarHeight(),
			currentCampus: DEFAULT_CAMPUS,
			locationText: formatCampusLocation(DEFAULT_CAMPUS),
			keyword: '',
			categories: PAGE_CATEGORIES,
			sortTabs: PAGE_SORT_TABS,
			selectedCategoryId: PAGE_CATEGORIES[0].id,
			selectedSortId: PAGE_SORT_TABS[0].id,
			goodsList: cloneList(PAGE_GOODS_LIST)
		}
	},
	computed: {
		displayGoods() {
			const keyword = normalizeKeyword(this.keyword)
			let list = this.goodsList.filter((item) => item.categoryId === this.selectedCategoryId)

			if (!list.length) {
				list = this.goodsList.slice()
			}

			if (keyword) {
				list = list.filter((item) => {
					const searchText = [item.name, item.ratingText, item.recommendText]
						.concat(item.tags || [])
						.join(' ')
						.toLowerCase()

					return searchText.includes(keyword)
				})
			}

			const sortedList = list.slice()

			if (this.selectedSortId === 'sales') {
				return sortedList.sort((first, second) => second.salesSum - first.salesSum)
			}

			if (this.selectedSortId === 'heat') {
				return sortedList.sort((first, second) => second.heat - first.heat)
			}

			if (this.selectedSortId === 'price') {
				return sortedList.sort((first, second) => first.price - second.price)
			}

			return sortedList
		}
	},
	onLoad(options = {}) {
		if (options.categoryId) {
			const hasCategory = this.categories.some((item) => item.id === options.categoryId)
			if (hasCategory) {
				this.selectedCategoryId = options.categoryId
			}
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
				url: '/pages/surprise/surprise'
			})
		},
		openCampusSelector() {
			uni.navigateTo({
				url: `/bundle/pages/campus/campus?mode=select&source=surprise-more&currentCampusId=${this.currentCampus.id}`,
				success: (res) => {
					res.eventChannel.on('campusSelected', ({ campus }) => {
						this.currentCampus = campus
						this.locationText = formatCampusLocation(campus)
					})
				}
			})
		},
		handleGoodSelect(item) {
			if (!item || !item.id) {
				return
			}

			uni.navigateTo({
				url: `/bundle_surprise/pages/goods_detail/goods_detail?id=${item.id}&name=${encodeURIComponent(item.name || '')}&price=${item.price || ''}&marketPrice=${item.marketPrice || ''}&source=activity-more`
			})
		}
	}
}
</script>

<style scoped lang="scss">
.surprise-activity-more-page {
	min-height: 100vh;
	background: #ffffff;
}

.surprise-activity-more-page__header {
	position: sticky;
	top: 0;
	z-index: 10;
	background: rgba(255, 255, 255, 0.98);
}

.surprise-activity-more-page__nav {
	position: relative;
	display: flex;
	align-items: center;
	height: 96rpx;
}

.surprise-activity-more-page__back {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 72rpx;
	height: 72rpx;
	margin-left: -12rpx;
}

.surprise-activity-more-page__toolbar {
	padding-top: 10rpx;
	padding-bottom: 18rpx;
	background: #ffffff;
}

.surprise-activity-more-page__location {
	gap: 24rpx;
}

.surprise-activity-more-page__location-main,
.surprise-activity-more-page__location-switch {
	min-width: 0;
}

.surprise-activity-more-page__location-icon {
	width: 28rpx;
	height: 28rpx;
	margin-top: 2rpx;
	flex: none;
}

.surprise-activity-more-page__location-text {
	margin-left: 12rpx;
	color: #22262f;
	font-size: 28rpx;
	line-height: 1.4;
}

.surprise-activity-more-page__location-switch {
	flex: none;
}

.surprise-activity-more-page__switch-icon {
	width: 34rpx;
	height: 34rpx;
}

.surprise-activity-more-page__switch-text {
	margin-left: 8rpx;
	color: #323741;
	font-size: 28rpx;
	line-height: 1.2;
}

.surprise-activity-more-page__search {
	display: flex;
	align-items: center;
	height: 104rpx;
	margin-top: 34rpx;
	padding: 0 30rpx;
	border-radius: 24rpx;
	background: #f7f7f8;
}

.surprise-activity-more-page__search-divider {
	width: 2rpx;
	height: 34rpx;
	margin: 0 22rpx;
	background: #d8d9de;
}

.surprise-activity-more-page__search-input {
	flex: 1;
	min-width: 0;
	height: 104rpx;
	color: #252932;
	font-size: 32rpx;
}

.surprise-activity-more-page__search-placeholder {
	color: #c7c8cc;
	font-size: 32rpx;
}

.surprise-activity-more-page__category-scroll {
	margin-top: 30rpx;
	white-space: nowrap;
}

.surprise-activity-more-page__category-list {
	display: inline-flex;
	padding-right: 44rpx;
}

.surprise-activity-more-page__category-chip {
	flex: none;
	margin-right: 20rpx;
	padding: 20rpx 34rpx;
	border-radius: 20rpx;
	background: #f3f4f6;
	color: #8a8f9a;
	font-size: 28rpx;
	line-height: 1;
}

.surprise-activity-more-page__category-chip.is-active {
	background: #143080;
	color: #ffffff;
	font-weight: 600;
}

.surprise-activity-more-page__sort-tabs {
	display: flex;
	align-items: center;
	margin-top: 32rpx;
}

.surprise-activity-more-page__sort-tab {
	position: relative;
	margin-right: 72rpx;
	padding-bottom: 18rpx;
	color: #707584;
	font-size: 28rpx;
	line-height: 1;
}

.surprise-activity-more-page__sort-tab.is-active {
	color: #143080;
	font-weight: 700;
}

.surprise-activity-more-page__sort-tab.is-active::after {
	content: '';
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	height: 6rpx;
	border-radius: 999rpx;
	background: #143080;
}

.surprise-activity-more-page__body {
	padding-top: 20rpx;
	padding-bottom: calc(env(safe-area-inset-bottom) + 60rpx);
	background: #ffffff;
}

.surprise-activity-more-page__goods-card {
	display: flex;
	align-items: flex-start;
	padding: 28rpx 0;
}

.surprise-activity-more-page__goods-card + .surprise-activity-more-page__goods-card {
	border-top: 1rpx solid #f2f3f6;
}

.surprise-activity-more-page__goods-image {
	flex: none;
	width: 182rpx;
	height: 182rpx;
	border-radius: 18rpx;
	background: #edf1f7;
}

.surprise-activity-more-page__goods-content {
	flex: 1;
	min-width: 0;
	margin-left: 24rpx;
	padding-top: 8rpx;
}

.surprise-activity-more-page__goods-title {
	color: #1b1f27;
	font-size: 34rpx;
	line-height: 1.32;
	font-weight: 500;
}

.surprise-activity-more-page__goods-meta {
	display: flex;
	align-items: center;
	margin-top: 22rpx;
	color: #555b67;
	font-size: 24rpx;
	line-height: 1;
}

.surprise-activity-more-page__goods-divider {
	margin: 0 16rpx;
	color: #d4d7de;
}

.surprise-activity-more-page__goods-recommend {
	color: #e3b256;
}

.surprise-activity-more-page__goods-price-row {
	display: flex;
	align-items: center;
	margin-top: 44rpx;
}

.surprise-activity-more-page__goods-price {
	color: #8c919d;
	font-size: 28rpx;
	line-height: 1;
}

.surprise-activity-more-page__goods-market-wrap {
	display: flex;
	align-items: center;
	margin-left: 20rpx;
}

.surprise-activity-more-page__goods-market-icon {
	position: relative;
	width: 28rpx;
	height: 18rpx;
	border: 2rpx solid #a9aeb8;
	border-radius: 999rpx;
	box-sizing: border-box;
}

.surprise-activity-more-page__goods-market-icon::before,
.surprise-activity-more-page__goods-market-icon::after {
	content: '';
	position: absolute;
	left: -2rpx;
	width: 28rpx;
	height: 18rpx;
	border: 2rpx solid #a9aeb8;
	border-radius: 999rpx;
	box-sizing: border-box;
	background: #ffffff;
}

.surprise-activity-more-page__goods-market-icon::before {
	top: -8rpx;
}

.surprise-activity-more-page__goods-market-icon::after {
	top: 8rpx;
}

.surprise-activity-more-page__goods-market-price {
	margin-left: 12rpx;
	color: #8c919d;
	font-size: 28rpx;
	line-height: 1;
}

.surprise-activity-more-page__empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 220rpx 0 180rpx;
}

.surprise-activity-more-page__empty-title {
	color: #1f232b;
	font-size: 34rpx;
	font-weight: 600;
	line-height: 1.2;
}

.surprise-activity-more-page__empty-desc {
	margin-top: 18rpx;
	color: #959aa6;
	font-size: 26rpx;
	line-height: 1.4;
}
</style>
