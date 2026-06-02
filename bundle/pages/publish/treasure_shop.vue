<template>
	<view class="treasure-shop-page">
		<view class="treasure-shop-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="page-shell treasure-shop-page__nav">
				<view class="treasure-shop-page__close" @tap="goBack">
					<text class="treasure-shop-page__close-line treasure-shop-page__close-line--left"></text>
					<text class="treasure-shop-page__close-line treasure-shop-page__close-line--right"></text>
				</view>
			</view>

			<view class="page-shell treasure-shop-page__search-shell">
				<view class="treasure-shop-page__search">
					<view class="treasure-shop-page__search-icon">
						<text class="treasure-shop-page__search-circle"></text>
						<text class="treasure-shop-page__search-handle"></text>
					</view>
					<input
						v-model.trim="keyword"
						class="treasure-shop-page__search-input"
						:placeholder="searchPlaceholder"
						placeholder-class="treasure-shop-page__search-placeholder"
						confirm-type="search"
					/>
					<view class="treasure-shop-page__clear" @tap.stop="clearKeyword">
						<text class="treasure-shop-page__clear-line treasure-shop-page__clear-line--left"></text>
						<text class="treasure-shop-page__clear-line treasure-shop-page__clear-line--right"></text>
					</view>
				</view>
			</view>
		</view>

		<scroll-view class="treasure-shop-page__body" scroll-y>
			<view class="page-shell treasure-shop-page__list">
				<view
					v-for="shop in filteredShops"
					:key="shop.id"
					class="treasure-shop-item"
					@tap="handleSelect(shop)"
				>
					<image class="treasure-shop-item__cover" :src="shop.image" mode="aspectFill" />

					<view class="treasure-shop-item__content">
						<view class="treasure-shop-item__top">
							<text class="treasure-shop-item__name line-1">{{ shop.name }}</text>
							<view class="treasure-shop-item__distance">
								<text class="treasure-shop-item__distance-icon"></text>
								<text class="treasure-shop-item__distance-text">{{ shop.distance }}</text>
							</view>
						</view>

						<view class="treasure-shop-item__tags">
							<text
								v-for="tag in shop.tags"
								:key="`${shop.id}-${tag}`"
								class="treasure-shop-item__tag"
							>
								{{ tag }}
							</text>
						</view>

						<view class="treasure-shop-item__bottom">
							<text class="treasure-shop-item__address line-1">{{ shop.address }}</text>
							<view
								:class="[
									'treasure-shop-item__radio',
									selectedShopId === shop.id ? 'is-selected' : ''
								]"
							>
								<text
									v-if="selectedShopId === shop.id"
									class="treasure-shop-item__radio-dot"
								></text>
							</view>
						</view>
					</view>
				</view>

				<view v-if="!filteredShops.length" class="treasure-shop-page__empty">
					<text class="treasure-shop-page__empty-title">{{ emptyTitle }}</text>
					<text class="treasure-shop-page__empty-desc">{{ emptyDesc }}</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
const TREASURE_SHOP_LIST = [
	{
		id: 'shop-1',
		name: 'MoYuan\u9152\u5427',
		tags: ['\u6d88\u8d39\u7f8e\u98df', '\u6d88\u8d39\u7f8e\u98df'],
		address: '\u592a\u539f\u5e02 | \u5c71\u897f\u7701\u592a\u539f\u5e02\u592a\u6986\u8def193\u53f7',
		distance: '4.5km',
		image: '/static/linshi/01.png'
	},
	{
		id: 'shop-2',
		name: 'MoYuan\u9152\u5427',
		tags: ['\u6d88\u8d39\u7f8e\u98df', '\u6d88\u8d39\u7f8e\u98df'],
		address: '\u592a\u539f\u5e02 | \u5c71\u897f\u7701\u592a\u539f\u5e02\u592a\u6986\u8def193\u53f7',
		distance: '4.5km',
		image: '/static/linshi/02.png'
	},
	{
		id: 'shop-3',
		name: 'MoYuan\u9152\u5427',
		tags: ['\u6d88\u8d39\u7f8e\u98df', '\u6d88\u8d39\u7f8e\u98df'],
		address: '\u592a\u539f\u5e02 | \u5c71\u897f\u7701\u592a\u539f\u5e02\u592a\u6986\u8def193\u53f7',
		distance: '4.5km',
		image: '/static/linshi/03.png'
	},
	{
		id: 'shop-4',
		name: 'MoYuan\u9152\u5427',
		tags: ['\u6d88\u8d39\u7f8e\u98df', '\u6d88\u8d39\u7f8e\u98df'],
		address: '\u592a\u539f\u5e02 | \u5c71\u897f\u7701\u592a\u539f\u5e02\u592a\u6986\u8def193\u53f7',
		distance: '4.5km',
		image: '/static/linshi/04.png'
	},
	{
		id: 'shop-5',
		name: 'MoYuan\u9152\u5427',
		tags: ['\u6d88\u8d39\u7f8e\u98df', '\u6d88\u8d39\u7f8e\u98df'],
		address: '\u592a\u539f\u5e02 | \u5c71\u897f\u7701\u592a\u539f\u5e02\u592a\u6986\u8def193\u53f7',
		distance: '4.5km',
		image: '/static/linshi/05.png'
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
			keyword: '',
			searchPlaceholder: '\u5b9d\u85cf\u5c0f\u5e97',
			emptyTitle: '\u6682\u65e0\u5339\u914d\u5c0f\u5e97',
			emptyDesc: '\u6362\u4e2a\u5173\u952e\u8bcd\u8bd5\u8bd5',
			selectedShopId: '',
			shops: TREASURE_SHOP_LIST
		}
	},
	computed: {
		filteredShops() {
			const normalizedKeyword = this.keyword.trim().toLowerCase()
			if (!normalizedKeyword) {
				return this.shops
			}

			return this.shops.filter((shop) => {
				const searchText = [shop.name, shop.address, ...(shop.tags || [])].join(' ').toLowerCase()
				return searchText.includes(normalizedKeyword)
			})
		}
	},
	onLoad(options = {}) {
		this.selectedShopId = options.selectedId || ''
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
		clearKeyword() {
			this.keyword = ''
		},
		handleSelect(shop) {
			this.selectedShopId = shop.id
			const eventChannel =
				typeof this.getOpenerEventChannel === 'function' ? this.getOpenerEventChannel() : null

			if (eventChannel) {
				eventChannel.emit('treasureShopSelected', {
					shop
				})
			}

			setTimeout(() => {
				uni.navigateBack({
					delta: 1
				})
			}, 120)
		}
	}
}
</script>

<style scoped lang="scss">
.treasure-shop-page {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background: #ffffff;
}

.treasure-shop-page__header {
	flex: none;
	background: #ffffff;
}

.treasure-shop-page__nav {
	display: flex;
	align-items: center;
	height: 112rpx;
}

.treasure-shop-page__close {
	position: relative;
	width: 52rpx;
	height: 52rpx;
}

.treasure-shop-page__close-line {
	position: absolute;
	left: 24rpx;
	top: 2rpx;
	width: 4rpx;
	height: 48rpx;
	border-radius: 999rpx;
	background: #26272c;
	transform-origin: center;
}

.treasure-shop-page__close-line--left {
	transform: rotate(45deg);
}

.treasure-shop-page__close-line--right {
	transform: rotate(-45deg);
}

.treasure-shop-page__search-shell {
	padding-top: 18rpx;
	padding-bottom: 18rpx;
}

.treasure-shop-page__search {
	display: flex;
	align-items: center;
	height: 88rpx;
	padding: 0 22rpx 0 26rpx;
	border-radius: 20rpx;
	background: #f7f7f8;
}

.treasure-shop-page__search-icon {
	position: relative;
	flex: none;
	width: 34rpx;
	height: 34rpx;
}

.treasure-shop-page__search-circle {
	position: absolute;
	left: 0;
	top: 0;
	width: 24rpx;
	height: 24rpx;
	border: 4rpx solid #c6c6c9;
	border-radius: 50%;
	box-sizing: border-box;
}

.treasure-shop-page__search-handle {
	position: absolute;
	right: 2rpx;
	bottom: 4rpx;
	width: 14rpx;
	height: 4rpx;
	border-radius: 999rpx;
	background: #c6c6c9;
	transform: rotate(45deg);
	transform-origin: right center;
}

.treasure-shop-page__search-input {
	flex: 1;
	min-width: 0;
	height: 88rpx;
	margin-left: 18rpx;
	padding-left: 22rpx;
	border-left: 2rpx solid #dddddf;
	font-size: 28rpx;
	color: #2f3137;
}

.treasure-shop-page__search-placeholder {
	color: #999aa0;
}

.treasure-shop-page__clear {
	position: relative;
	flex: none;
	width: 44rpx;
	height: 44rpx;
	margin-left: 18rpx;
	border-radius: 50%;
	background: #7f7f92;
}

.treasure-shop-page__clear-line {
	position: absolute;
	left: 20rpx;
	top: 10rpx;
	width: 4rpx;
	height: 24rpx;
	border-radius: 999rpx;
	background: #ffffff;
	transform-origin: center;
}

.treasure-shop-page__clear-line--left {
	transform: rotate(45deg);
}

.treasure-shop-page__clear-line--right {
	transform: rotate(-45deg);
}

.treasure-shop-page__body {
	flex: 1;
	min-height: 0;
	background: #ffffff;
}

.treasure-shop-page__list {
	padding-top: 6rpx;
	padding-bottom: calc(env(safe-area-inset-bottom) + 44rpx);
}

.treasure-shop-item {
	display: flex;
	align-items: flex-start;
	padding: 22rpx 0 34rpx;
}

.treasure-shop-item__cover {
	flex: none;
	width: 156rpx;
	height: 156rpx;
	border-radius: 20rpx;
	background: #edf1f7;
}

.treasure-shop-item__content {
	flex: 1;
	min-width: 0;
	margin-left: 28rpx;
	padding-top: 6rpx;
}

.treasure-shop-item__top {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 20rpx;
}

.treasure-shop-item__name {
	flex: 1;
	min-width: 0;
	font-size: 34rpx;
	font-weight: 500;
	line-height: 1.2;
	color: #22242a;
}

.treasure-shop-item__distance {
	display: flex;
	align-items: center;
	flex: none;
	padding-left: 8rpx;
}

.treasure-shop-item__distance-icon {
	position: relative;
	width: 24rpx;
	height: 24rpx;
	margin-right: 12rpx;
	border: 3rpx solid #34363d;
	border-radius: 6rpx 50% 50% 50%;
	transform: rotate(45deg);
	box-sizing: border-box;
}

.treasure-shop-item__distance-icon::after {
	content: '';
	position: absolute;
	left: 5rpx;
	top: 5rpx;
	width: 6rpx;
	height: 6rpx;
	border-radius: 50%;
	background: #34363d;
	transform: rotate(-45deg);
}

.treasure-shop-item__distance-text {
	font-size: 24rpx;
	line-height: 1.2;
	color: #3a3c43;
}

.treasure-shop-item__tags {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	margin-top: 18rpx;
}

.treasure-shop-item__tag {
	height: 40rpx;
	padding: 0 18rpx;
	margin-right: 14rpx;
	border-radius: 8rpx;
	background: #f5f5f6;
	font-size: 22rpx;
	line-height: 40rpx;
	color: #8f9299;
}

.treasure-shop-item__bottom {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 20rpx;
	margin-top: 22rpx;
}

.treasure-shop-item__address {
	flex: 1;
	min-width: 0;
	font-size: 24rpx;
	line-height: 1.2;
	color: #a0a3aa;
}

.treasure-shop-item__radio {
	flex: none;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 36rpx;
	height: 36rpx;
	border: 2rpx solid #d9d9de;
	border-radius: 50%;
	background: #ffffff;
	box-sizing: border-box;
}

.treasure-shop-item__radio.is-selected {
	border-color: #143080;
}

.treasure-shop-item__radio-dot {
	width: 16rpx;
	height: 16rpx;
	border-radius: 50%;
	background: #143080;
}

.treasure-shop-page__empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 220rpx;
}

.treasure-shop-page__empty-title {
	font-size: 28rpx;
	line-height: 1.2;
	color: #909399;
}

.treasure-shop-page__empty-desc {
	margin-top: 16rpx;
	font-size: 24rpx;
	line-height: 1.2;
	color: #c0c4cc;
}
</style>
