<template>
	<view class="surprise-cart-page">
		<view class="surprise-cart-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="page-shell surprise-cart-page__nav">
				<view class="surprise-cart-page__nav-side" @tap="goBack">
					<u-icon name="arrow-left" size="50" color="#1f2024"></u-icon>
				</view>
				<text class="surprise-cart-page__nav-title">购物车</text>
				<view class="surprise-cart-page__nav-side"></view>
			</view>
		</view>

		<scroll-view class="surprise-cart-page__body" scroll-y>
			<view class="page-shell surprise-cart-page__content">
				<view v-for="(store, storeIndex) in storeList" :key="store.id" class="surprise-cart-store">
					<view class="surprise-cart-store__head" @tap="toggleStore(storeIndex)">
						<view :class="['surprise-cart-check', store.selected ? 'is-active' : '']">
							<u-icon v-if="store.selected" name="checkmark" size="20" color="#ffffff"></u-icon>
						</view>
						<text class="surprise-cart-store__name">{{ store.name }}</text>
					</view>

					<view class="surprise-cart-store__list">
						<view
							v-for="(item, itemIndex) in store.items"
							:key="item.id"
							class="surprise-cart-item"
						>
							<view class="surprise-cart-item__selector" @tap="toggleItem(storeIndex, itemIndex)">
								<view :class="['surprise-cart-check', item.selected ? 'is-active' : '']">
									<u-icon v-if="item.selected" name="checkmark" size="20" color="#ffffff"></u-icon>
								</view>
							</view>

							<image class="surprise-cart-item__image" :src="item.image" mode="aspectFill"></image>

							<view class="surprise-cart-item__main">
								<text class="surprise-cart-item__title line-2">{{ item.title }}</text>
								<text class="surprise-cart-item__tag">{{ item.packageName }}</text>

								<view class="surprise-cart-item__meta">
									<text class="surprise-cart-item__price">¥ {{ formatAmount(item.price) }}</text>

									<view v-if="item.points" class="surprise-cart-item__points">
										<view class="surprise-cart-item__points-icon"></view>
										<text class="surprise-cart-item__points-text">{{ item.points }}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<view class="surprise-cart-page__footer">
			<view class="surprise-cart-page__footer-check" @tap="toggleAll">
				<view :class="['surprise-cart-check', isAllSelected ? 'is-active' : '']">
					<u-icon v-if="isAllSelected" name="checkmark" size="20" color="#ffffff"></u-icon>
				</view>
				<text class="surprise-cart-page__footer-check-text">全选</text>
			</view>

			<view class="surprise-cart-page__footer-summary">
				<text class="surprise-cart-page__footer-total-label">合计：</text>
				<text class="surprise-cart-page__footer-total-value">¥ {{ formatAmount(summary.totalPrice) }}</text>
				<text class="surprise-cart-page__footer-desc">
					已选{{ summary.selectedCount }}件 共减¥{{ formatAmount(summary.discountAmount) }}
				</text>
			</view>

			<button class="surprise-cart-page__footer-button" hover-class="none" @tap="submitOrder">
				提交订单
			</button>
		</view>
	</view>
</template>

<script>
function getStatusBarHeight() {
	try {
		const { statusBarHeight = 20 } = uni.getSystemInfoSync()
		return statusBarHeight
	} catch (error) {
		return 20
	}
}

function createCartStoreList() {
	return [
		{
			id: 'store-1',
			name: '伊美尔北京光华店',
			selected: true,
			items: [
				{
					id: 'goods-101',
					title: '面部填充玻尿酸 重塑面部肌肤 无痛感 安全恢复快',
					packageName: '基础套餐',
					price: 999,
					points: 6990,
					discount: 36.6,
					image: '/static/linshi/01.png',
					selected: true
				},
				{
					id: 'goods-102',
					title: '面部填充玻尿酸 重塑面部肌肤 无痛感 安全恢复快',
					packageName: '基础套餐',
					price: 999,
					points: 0,
					discount: 36.6,
					image: '/static/linshi/01.png',
					selected: true
				}
			]
		},
		{
			id: 'store-2',
			name: '伊美尔北京光华店',
			selected: true,
			items: [
				{
					id: 'goods-103',
					title: '面部填充玻尿酸 重塑面部肌肤 无痛感 安全恢复快',
					packageName: '基础套餐',
					price: 999,
					points: 0,
					discount: 36.6,
					image: '/static/linshi/01.png',
					selected: true
				},
				{
					id: 'goods-104',
					title: '面部填充玻尿酸 重塑面部肌肤 无痛感 安全恢复快',
					packageName: '基础套餐',
					price: 999,
					points: 0,
					discount: 0,
					image: '/static/linshi/01.png',
					selected: false
				}
			]
		}
	]
}

function formatAmount(value) {
	const amount = Number(value || 0)
	return amount.toFixed(1)
}

export default {
	data() {
		return {
			statusBarHeight: getStatusBarHeight(),
			storeList: createCartStoreList()
		}
	},
	computed: {
		summary() {
			return this.storeList.reduce(
				(result, store) => {
					store.items.forEach((item) => {
						if (!item.selected) {
							return
						}

						result.selectedCount += 1
						result.totalPrice += item.price
						result.discountAmount += item.discount || 0
					})

					return result
				},
				{
					selectedCount: 0,
					totalPrice: 0,
					discountAmount: 0
				}
			)
		},
		isAllSelected() {
			const items = this.storeList.reduce((result, store) => result.concat(store.items), [])
			return items.length > 0 && items.every((item) => item.selected)
		}
	},
	methods: {
		formatAmount,
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
		toggleStore(storeIndex) {
			const store = this.storeList[storeIndex]

			if (!store) {
				return
			}

			const nextSelected = !store.selected
			const nextItems = store.items.map((item) => ({
				...item,
				selected: nextSelected
			}))

			this.$set(this.storeList, storeIndex, {
				...store,
				selected: nextSelected,
				items: nextItems
			})
		},
		toggleItem(storeIndex, itemIndex) {
			const store = this.storeList[storeIndex]
			const item = store && store.items[itemIndex]

			if (!item) {
				return
			}

			const nextItems = store.items.map((current, currentIndex) => {
				if (currentIndex !== itemIndex) {
					return current
				}

				return {
					...current,
					selected: !current.selected
				}
			})

			this.$set(this.storeList, storeIndex, {
				...store,
				items: nextItems,
				selected: nextItems.every((current) => current.selected)
			})
		},
		toggleAll() {
			const nextSelected = !this.isAllSelected
			this.storeList = this.storeList.map((store) => ({
				...store,
				selected: nextSelected,
				items: store.items.map((item) => ({
					...item,
					selected: nextSelected
				}))
			}))
		},
		submitOrder() {
			const selectedItem = this.storeList
				.reduce((list, store) => list.concat(store.items.filter((item) => item.selected)), [])
				.shift()

			if (!selectedItem) {
				uni.showToast({
					title: '请选择商品',
					icon: 'none'
				})
				return
			}

			uni.navigateTo({
				url: `/bundle_surprise/pages/checkout/checkout?id=${encodeURIComponent(selectedItem.id)}&name=${encodeURIComponent(selectedItem.title)}&price=${selectedItem.price || ''}&points=${selectedItem.points || ''}`
			})
		}
	}
}
</script>

<style scoped lang="scss">
.surprise-cart-page {
	min-height: 100vh;
	padding-bottom: calc(188rpx + env(safe-area-inset-bottom));
	background: #ffffff;
}

.surprise-cart-page__header {
	position: sticky;
	top: 0;
	z-index: 20;
	background: rgba(255, 255, 255, 0.98);
}

.surprise-cart-page__nav {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 96rpx;
}

.surprise-cart-page__nav-side {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 96rpx;
	height: 72rpx;
	margin-left: -12rpx;
}

.surprise-cart-page__nav-title {
	font-size: 48rpx;
	line-height: 1;
	font-weight: 600;
	color: #1e1f23;
}

.surprise-cart-page__body {
	height: calc(100vh - 96rpx - env(safe-area-inset-bottom));
}

.surprise-cart-page__content {
	padding-top: 34rpx;
	padding-bottom: 220rpx;
}

.surprise-cart-store + .surprise-cart-store {
	margin-top: 68rpx;
}

.surprise-cart-store__head {
	display: flex;
	align-items: center;
}

.surprise-cart-store__name {
	margin-left: 22rpx;
	font-size: 34rpx;
	line-height: 1.3;
	font-weight: 600;
	color: #22242b;
}

.surprise-cart-store__list {
	margin-top: 34rpx;
}

.surprise-cart-item {
	display: flex;
	align-items: flex-start;
}

.surprise-cart-item + .surprise-cart-item {
	margin-top: 56rpx;
}

.surprise-cart-item__selector {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 56rpx;
	padding-top: 72rpx;
}

.surprise-cart-check {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 38rpx;
	height: 38rpx;
	border: 2rpx solid #cfd5e3;
	border-radius: 50%;
	box-sizing: border-box;
	background: #ffffff;
}

.surprise-cart-check.is-active {
	border-color: #1d3e97;
	background: #1d3e97;
}

.surprise-cart-item__image {
	flex: none;
	width: 180rpx;
	height: 180rpx;
	margin-left: 10rpx;
	border-radius: 18rpx;
	background: #edf2f8;
}

.surprise-cart-item__main {
	flex: 1;
	min-width: 0;
	margin-left: 22rpx;
	padding-top: 6rpx;
}

.surprise-cart-item__title {
	font-size: 34rpx;
	line-height: 1.45;
	color: #22242a;
}

.surprise-cart-item__tag {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	height: 48rpx;
	margin-top: 18rpx;
	padding: 0 22rpx;
	border-radius: 10rpx;
	background: #f2f2f4;
	font-size: 24rpx;
	color: #a8aab2;
}

.surprise-cart-item__meta {
	display: flex;
	align-items: center;
	margin-top: 30rpx;
}

.surprise-cart-item__price {
	font-size: 34rpx;
	line-height: 1;
	font-weight: 700;
	color: #1f2024;
}

.surprise-cart-item__points {
	display: flex;
	align-items: center;
	margin-left: 24rpx;
}

.surprise-cart-item__points-icon {
	position: relative;
	width: 26rpx;
	height: 18rpx;
	border: 2rpx solid #23252b;
	border-radius: 999rpx;
	box-sizing: border-box;
}

.surprise-cart-item__points-icon::before,
.surprise-cart-item__points-icon::after {
	content: '';
	position: absolute;
	left: -2rpx;
	width: 26rpx;
	height: 18rpx;
	border: 2rpx solid #23252b;
	border-radius: 999rpx;
	background: #ffffff;
	box-sizing: border-box;
}

.surprise-cart-item__points-icon::before {
	top: -8rpx;
}

.surprise-cart-item__points-icon::after {
	top: 8rpx;
}

.surprise-cart-item__points-text {
	margin-left: 12rpx;
	font-size: 28rpx;
	line-height: 1;
	font-weight: 600;
	color: #23252b;
}

.surprise-cart-page__footer {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 24;
	display: flex;
	align-items: center;
	padding: 24rpx 44rpx calc(24rpx + env(safe-area-inset-bottom));
	background: rgba(255, 255, 255, 0.98);
	box-shadow: 0 -8rpx 24rpx rgba(16, 24, 44, 0.05);
}

.surprise-cart-page__footer-check {
	display: flex;
	align-items: center;
	flex: none;
}

.surprise-cart-page__footer-check-text {
	margin-left: 18rpx;
	font-size: 26rpx;
	font-weight: 600;
	color: #202127;
}

.surprise-cart-page__footer-summary {
	flex: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
	margin-left: 34rpx;
	padding-right: 18rpx;
}

.surprise-cart-page__footer-total-label,
.surprise-cart-page__footer-total-value {
	font-size: 32rpx;
	line-height: 1.1;
}

.surprise-cart-page__footer-total-label {
	color: #6f7480;
}

.surprise-cart-page__footer-total-value {
	font-weight: 700;
	color: #1d3e97;
}

.surprise-cart-page__footer-desc {
	margin-top: 12rpx;
	font-size: 24rpx;
	line-height: 1.2;
	color: #8f949d;
}

.surprise-cart-page__footer-button {
	flex: none;
	width: 250rpx;
	height: 92rpx;
	border-radius: 999rpx;
	font-size: 32rpx;
	font-weight: 600;
	color: #ffffff;
	background: #1f3e95;
}

@media screen and (max-width: 360px) {
	.surprise-cart-page__nav-title {
		font-size: 42rpx;
	}

	.surprise-cart-item__title {
		font-size: 30rpx;
	}

	.surprise-cart-page__footer {
		padding-left: 30rpx;
		padding-right: 30rpx;
	}

	.surprise-cart-page__footer-button {
		width: 220rpx;
	}
}
</style>
