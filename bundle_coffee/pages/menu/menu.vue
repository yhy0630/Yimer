<template>
	<view class="coffee-menu-wrap">
		<view class="coffee-menu-nav" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="coffee-menu-nav__inner">
				<view class="coffee-menu-nav__back" @tap="goBack">
					<u-icon name="arrow-left" size="44" color="#161616"></u-icon>
				</view>
				<view class="coffee-menu-nav__store">
					<view class="coffee-menu-nav__store-row">
						<text class="coffee-menu-nav__store-name line-1">{{ storeName }}</text>
						<u-icon name="arrow-down" size="24" color="#333333"></u-icon>
					</view>
					<text class="coffee-menu-nav__distance">距您{{ storeDistance }}</text>
				</view>
				<view class="coffee-menu-nav__placeholder"></view>
			</view>
		</view>

		<image
			class="coffee-menu-banner"
			src="/static/linshi/16.png"
			mode="widthFix"
		/>

		<view class="coffee-menu-body">
			<scroll-view class="coffee-menu-aside" scroll-y :show-scrollbar="false">
				<view
					v-for="(item, index) in categories"
					:key="item.id"
					:class="['coffee-menu-aside__item', activeCategoryIndex === index ? 'is-active' : '']"
					@tap="switchCategory(index)"
				>
					<view v-if="activeCategoryIndex === index" class="coffee-menu-aside__line"></view>
					<text class="coffee-menu-aside__text">{{ item.name }}</text>
				</view>
			</scroll-view>

			<scroll-view class="coffee-menu-list" scroll-y :show-scrollbar="false">
				<text class="coffee-menu-list__title">{{ activeCategoryName }}</text>
				<view
					v-for="(item, index) in productList"
					:key="item.id"
					class="coffee-menu-product"
				>
					<view class="coffee-menu-product__cover-wrap">
						<image
							class="coffee-menu-product__cover"
							:src="getProductImage(index)"
							mode="aspectFill"
						/>
					</view>
					<view class="coffee-menu-product__info">
						<text class="coffee-menu-product__name line-2">{{ item.name }}</text>
						<text class="coffee-menu-product__desc line-1">{{ item.desc }}</text>
						<view class="coffee-menu-product__bottom">
							<view class="coffee-menu-product__price-row">
								<text class="coffee-menu-product__price">¥{{ item.price }}</text>
								<text class="coffee-menu-product__origin">¥{{ item.originPrice }}</text>
							</view>
							<view class="coffee-menu-product__add" @tap="addToCart(item, index)">
								<u-icon name="plus" size="28" color="#ffffff"></u-icon>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<view v-if="showCartPopup" class="cart-popup-mask" @tap="closeCartPopup">
			<view class="cart-popup" @tap.stop>
				<view class="cart-popup__header">
					<text class="cart-popup__title">购物袋</text>
					<view class="cart-popup__clear" @tap="clearCart">
						<u-icon name="trash" size="36" color="#333333"></u-icon>
					</view>
				</view>

				<scroll-view class="cart-popup__scroll" scroll-y :show-scrollbar="false">
					<view
						v-for="item in cartItems"
						:key="item.cartKey"
						class="cart-popup__item"
					>
						<view class="cart-popup__cover-wrap">
							<image
								class="cart-popup__cover"
								:src="item.image"
								mode="aspectFill"
							/>
						</view>
						<view class="cart-popup__info">
							<text class="cart-popup__name line-1">{{ item.name }}</text>
							<view class="cart-popup__spec-row">
								<text class="cart-popup__spec line-1">{{ item.spec }}</text>
								<u-icon name="arrow-down" size="20" color="#cccccc"></u-icon>
							</view>
							<view class="cart-popup__bottom">
								<text class="cart-popup__price">¥ {{ item.price }}</text>
								<view class="cart-popup__stepper">
									<view
										class="cart-popup__stepper-btn is-minus"
										@tap="changeCartQuantity(item, -1)"
									>
										<u-icon name="minus" size="24" color="#999999"></u-icon>
									</view>
									<text class="cart-popup__stepper-count">{{ item.quantity }}</text>
									<view
										class="cart-popup__stepper-btn is-plus"
										@tap="changeCartQuantity(item, 1)"
									>
										<u-icon name="plus" size="24" color="#ffffff"></u-icon>
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>

		<view class="coffee-menu-cart">
			<view class="coffee-menu-cart__main" @tap="openCartPopup">
				<view class="coffee-menu-cart__bag-wrap">
					<image
						class="coffee-menu-cart__bag"
						src="/bundle_coffee/static/images/sack.png"
						mode="aspectFit"
					/>
					<view v-if="cartCount > 0" class="coffee-menu-cart__badge">
						<text class="coffee-menu-cart__badge-text">{{ cartCount }}</text>
					</view>
				</view>
				<view class="coffee-menu-cart__price-wrap">
					<view class="coffee-menu-cart__price-row">
						<text class="coffee-menu-cart__price-label">预计到手</text>
						<text class="coffee-menu-cart__price">¥{{ cartFinalPrice }}</text>
					</view>
					<text class="coffee-menu-cart__discount">已享受最低优惠，共减免¥{{ cartDiscount }}</text>
				</view>
			</view>
			<button class="coffee-menu-cart__checkout" hover-class="none" @tap.stop="handleCheckout">
				去结算
			</button>
		</view>
	</view>
</template>

<script>
const PRODUCT_IMAGES = [
	'/static/linshi/17.png',
	'/static/linshi/18.png',
	'/static/linshi/19.png'
]

const CATEGORIES = [
	{ id: 'hot', name: '本店热门' },
	{ id: 'americano', name: '美式' },
	{ id: 'latte', name: '拿铁' },
	{ id: 'sparkling', name: '气泡水' },
	{ id: 'seasonal', name: '当季新品' },
	{ id: 'classic', name: '经典咖啡' },
	{ id: 'special', name: '本店特供' },
	{ id: 'cappuccino', name: '卡布奇诺' },
	{ id: 'waterfall', name: '瀑布咖啡' },
	{ id: 'frappuccino', name: '星冰乐' }
]

const PRODUCTS = [
	{
		id: 'product-1',
		name: '银星专享卡1+1随心配',
		desc: '1饮1食7折优惠',
		price: '36.4',
		originPrice: '52',
		unitPrice: 36.4
	},
	{
		id: 'product-2',
		name: '银星专享卡1+1随心配',
		desc: '1饮1食7折优惠',
		price: '36.4',
		originPrice: '52',
		unitPrice: 36.4
	},
	{
		id: 'product-3',
		name: '银星专享卡1+1随心配',
		desc: '1饮1食7折优惠',
		price: '36.4',
		originPrice: '52',
		unitPrice: 36.4
	},
	{
		id: 'product-4',
		name: '银星专享卡1+1随心配',
		desc: '1饮1食7折优惠',
		price: '36.4',
		originPrice: '52',
		unitPrice: 36.4
	}
]

const DEFAULT_CART_ITEMS = [
	{
		cartKey: 'cart-item-1',
		productId: 'frappuccino-1',
		name: '焙茶星冰乐',
		spec: '大杯/冰/香草风味/全脂牛奶/标准甜/经典糖/标准搅...',
		price: 32,
		unitPrice: 32,
		quantity: 1,
		image: PRODUCT_IMAGES[0]
	},
	{
		cartKey: 'cart-item-2',
		productId: 'frappuccino-2',
		name: '焙茶星冰乐',
		spec: '大杯/冰/香草风味/全脂牛奶/标准甜/经典糖/标准搅...',
		price: 32,
		unitPrice: 32,
		quantity: 1,
		image: PRODUCT_IMAGES[1]
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
	name: 'CoffeeMenu',
	data() {
		return {
			statusBarHeight: getStatusBarHeight(),
			storeName: '蓝猫咖啡 (光华soho2期店)',
			storeDistance: '1.87千米',
			categories: CATEGORIES,
			activeCategoryIndex: 0,
			productList: PRODUCTS,
			cartItems: DEFAULT_CART_ITEMS.map((item) => ({ ...item })),
			showCartPopup: false,
			cartCount: 0,
			cartFinalPrice: '0.0',
			cartDiscount: '0.0'
		}
	},
	computed: {
		activeCategoryName() {
			return this.categories[this.activeCategoryIndex]?.name || ''
		}
	},
	created() {
		this.updateCartSummary()
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		switchCategory(index) {
			this.activeCategoryIndex = index
		},
		getProductImage(index) {
			return PRODUCT_IMAGES[index % PRODUCT_IMAGES.length]
		},
		updateCartSummary() {
			const cartCount = this.cartItems.reduce((sum, item) => sum + item.quantity, 0)
			const originTotal = this.cartItems.reduce(
				(sum, item) => sum + item.unitPrice * item.quantity,
				0
			)
			const finalTotal = originTotal * 0.7
			const discount = originTotal - finalTotal

			this.cartCount = cartCount
			this.cartFinalPrice = finalTotal.toFixed(1)
			this.cartDiscount = discount.toFixed(1)
		},
		addToCart(item, index) {
			const image = this.getProductImage(index)
			const existItem = this.cartItems.find((cartItem) => cartItem.productId === item.id)

			if (existItem) {
				existItem.quantity += 1
			} else {
				this.cartItems.push({
					cartKey: `cart-${item.id}-${Date.now()}`,
					productId: item.id,
					name: item.name,
					spec: '大杯/冰/意式拼配/默认浓度/不另外加糖',
					price: item.unitPrice,
					unitPrice: item.unitPrice,
					quantity: 1,
					image
				})
			}

			this.updateCartSummary()
		},
		openCartPopup() {
			if (this.cartCount <= 0) {
				uni.showToast({
					title: '购物袋是空的',
					icon: 'none'
				})
				return
			}

			this.showCartPopup = true
		},
		closeCartPopup() {
			this.showCartPopup = false
		},
		clearCart() {
			this.cartItems = []
			this.updateCartSummary()
			this.closeCartPopup()
		},
		changeCartQuantity(item, delta) {
			const nextQuantity = item.quantity + delta

			if (nextQuantity <= 0) {
				this.cartItems = this.cartItems.filter((cartItem) => cartItem.cartKey !== item.cartKey)
			} else {
				item.quantity = nextQuantity
			}

			this.updateCartSummary()

			if (this.cartCount <= 0) {
				this.closeCartPopup()
			}
		},
		handleCheckout() {
			if (this.cartCount <= 0) {
				uni.showToast({
					title: '请先添加商品',
					icon: 'none'
				})
				return
			}

			uni.navigateTo({
				url: '/bundle_coffee/pages/checkout/checkout'
			})
		}
	}
}
</script>

<style scoped lang="scss">
.coffee-menu-wrap {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background: #ffffff;
}

.coffee-menu-nav {
	flex: none;
	background: #ffffff;
}

.coffee-menu-nav__inner {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 88rpx;
	padding: 0 24rpx;
}

.coffee-menu-nav__back,
.coffee-menu-nav__placeholder {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 72rpx;
	height: 72rpx;
	flex: none;
}

.coffee-menu-nav__back {
	margin-left: -8rpx;
	justify-content: flex-start;
}

.coffee-menu-nav__store {
	flex: 1;
	min-width: 0;
	padding: 0 12rpx;
}

.coffee-menu-nav__store-row {
	display: flex;
	align-items: center;
	justify-content: center;
}

.coffee-menu-nav__store-name {
	max-width: 420rpx;
	font-size: 32rpx;
	font-weight: 700;
	color: #1a1b1d;
	line-height: 1.3;
}

.coffee-menu-nav__distance {
	display: block;
	margin-top: 4rpx;
	text-align: center;
	font-size: 22rpx;
	color: #999999;
	line-height: 1.2;
}

.coffee-menu-banner {
	flex: none;
	display: block;
	width: 100%;
}

.coffee-menu-body {
	flex: 1;
	display: flex;
	height: 0;
	min-height: 0;
	padding-bottom: calc(136rpx + env(safe-area-inset-bottom));
	background: #ffffff;
	box-sizing: border-box;
}

.coffee-menu-aside {
	flex: none;
	width: 168rpx;
	height: 100%;
	background: #f5f5f6;
}

.coffee-menu-aside__item {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 96rpx;
	padding: 20rpx 12rpx;
	box-sizing: border-box;
}

.coffee-menu-aside__line {
	position: absolute;
	left: 0;
	top: 50%;
	width: 6rpx;
	height: 36rpx;
	border-radius: 0 6rpx 6rpx 0;
	background: #143080;
	transform: translateY(-50%);
}

.coffee-menu-aside__text {
	font-size: 26rpx;
	color: #666666;
	line-height: 1.3;
	text-align: center;
}

.coffee-menu-aside__item.is-active .coffee-menu-aside__text {
	font-weight: 700;
	color: #143080;
}

.coffee-menu-list {
	flex: 1;
	height: 100%;
	padding: 0 24rpx;
	box-sizing: border-box;
}

.coffee-menu-list__title {
	display: block;
	padding: 28rpx 0 8rpx;
	font-size: 28rpx;
	font-weight: 700;
	color: #1a1b1d;
	line-height: 1.2;
}

.coffee-menu-product {
	display: flex;
	align-items: flex-start;
	padding: 24rpx 0;
}

.coffee-menu-product + .coffee-menu-product {
	border-top: 2rpx solid #f3f3f4;
}

.coffee-menu-product__cover-wrap {
	flex: none;
	width: 160rpx;
	height: 160rpx;
	border-radius: 50%;
	overflow: hidden;
	background: #f3f4f6;
}

.coffee-menu-product__cover {
	width: 100%;
	height: 100%;
}

.coffee-menu-product__info {
	flex: 1;
	min-width: 0;
	margin-left: 20rpx;
	min-height: 160rpx;
	display: flex;
	flex-direction: column;
}

.coffee-menu-product__name {
	font-size: 28rpx;
	font-weight: 700;
	color: #1a1b1d;
	line-height: 1.35;
}

.coffee-menu-product__desc {
	margin-top: 8rpx;
	font-size: 22rpx;
	color: #999999;
	line-height: 1.3;
}

.coffee-menu-product__bottom {
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	margin-top: auto;
	padding-top: 12rpx;
}

.coffee-menu-product__price-row {
	display: flex;
	align-items: baseline;
}

.coffee-menu-product__price {
	font-size: 32rpx;
	font-weight: 700;
	color: #1a1b1d;
	line-height: 1.2;
}

.coffee-menu-product__origin {
	margin-left: 10rpx;
	font-size: 22rpx;
	color: #999999;
	text-decoration: line-through;
	line-height: 1.2;
}

.coffee-menu-product__add {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 48rpx;
	height: 48rpx;
	border-radius: 50%;
	background: #143080;
}

.cart-popup-mask {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: calc(136rpx + env(safe-area-inset-bottom));
	z-index: 1001;
	background: rgba(0, 0, 0, 0.45);
}

.cart-popup {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	flex-direction: column;
	max-height: 100%;
	border-radius: 24rpx 24rpx 0 0;
	background: #ffffff;
	overflow: hidden;
}

.cart-popup__header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex: none;
	padding: 32rpx 32rpx 24rpx;
}

.cart-popup__title {
	font-size: 34rpx;
	font-weight: 700;
	color: #1a1b1d;
	line-height: 1.2;
}

.cart-popup__clear {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 56rpx;
	height: 56rpx;
}

.cart-popup__scroll {
	flex: 1;
	height: 0;
	min-height: 0;
	max-height: calc(100vh - 360rpx - 136rpx - env(safe-area-inset-bottom));
	padding: 0 32rpx 24rpx;
	box-sizing: border-box;
}

.cart-popup__item {
	display: flex;
	align-items: flex-start;
	padding: 24rpx 0;
}

.cart-popup__item + .cart-popup__item {
	border-top: 2rpx solid #f3f3f4;
}

.cart-popup__cover-wrap {
	flex: none;
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	overflow: hidden;
	background: #f3f4f6;
}

.cart-popup__cover {
	width: 100%;
	height: 100%;
}

.cart-popup__info {
	flex: 1;
	min-width: 0;
	margin-left: 20rpx;
}

.cart-popup__name {
	display: block;
	font-size: 28rpx;
	font-weight: 600;
	color: #1a1b1d;
	line-height: 1.3;
}

.cart-popup__spec-row {
	display: flex;
	align-items: center;
	margin-top: 8rpx;
}

.cart-popup__spec {
	flex: 1;
	min-width: 0;
	margin-right: 8rpx;
	font-size: 22rpx;
	color: #999999;
	line-height: 1.3;
}

.cart-popup__bottom {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 16rpx;
}

.cart-popup__price {
	font-size: 28rpx;
	font-weight: 600;
	color: #1a1b1d;
	line-height: 1.2;
}

.cart-popup__stepper {
	display: flex;
	align-items: center;
}

.cart-popup__stepper-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 48rpx;
	height: 48rpx;
	border-radius: 50%;
	box-sizing: border-box;
}

.cart-popup__stepper-btn.is-minus {
	border: 2rpx solid #dddddd;
	background: #ffffff;
}

.cart-popup__stepper-btn.is-plus {
	background: #143080;
}

.cart-popup__stepper-count {
	min-width: 48rpx;
	text-align: center;
	font-size: 28rpx;
	font-weight: 600;
	color: #1a1b1d;
	line-height: 1;
}

.coffee-menu-cart {
	position: fixed;
	left: 24rpx;
	right: 24rpx;
	bottom: calc(env(safe-area-inset-bottom) + 16rpx);
	z-index: 1002;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 16rpx 16rpx 16rpx 24rpx;
	border-radius: 999rpx;
	background: #ffffff;
	box-shadow: 0 8rpx 32rpx rgba(15, 35, 95, 0.12);
}

.coffee-menu-cart__main {
	display: flex;
	align-items: center;
	flex: 1;
	min-width: 0;
}

.coffee-menu-cart__bag-wrap {
	position: relative;
	flex: none;
	width: 88rpx;
	height: 88rpx;
}

.coffee-menu-cart__bag {
	width: 88rpx;
	height: 88rpx;
}

.coffee-menu-cart__badge {
	position: absolute;
	top: 4rpx;
	right: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	min-width: 32rpx;
	height: 32rpx;
	padding: 0 8rpx;
	border-radius: 999rpx;
	background: #143080;
	box-sizing: border-box;
}

.coffee-menu-cart__badge-text {
	font-size: 20rpx;
	font-weight: 600;
	color: #ffffff;
	line-height: 1;
}

.coffee-menu-cart__price-wrap {
	flex: 1;
	min-width: 0;
	margin-left: 12rpx;
}

.coffee-menu-cart__price-row {
	display: flex;
	align-items: baseline;
}

.coffee-menu-cart__price-label {
	font-size: 24rpx;
	color: #333333;
	line-height: 1.2;
}

.coffee-menu-cart__price {
	margin-left: 8rpx;
	font-size: 36rpx;
	font-weight: 700;
	color: #ff6b00;
	line-height: 1.1;
}

.coffee-menu-cart__discount {
	display: block;
	margin-top: 4rpx;
	font-size: 20rpx;
	color: #999999;
	line-height: 1.2;
}

.coffee-menu-cart__checkout {
	flex: none;
	margin: 0;
	padding: 0 48rpx;
	height: 80rpx;
	line-height: 80rpx;
	border: none;
	border-radius: 999rpx;
	background: #143080;
	font-size: 30rpx;
	font-weight: 600;
	color: #ffffff;
}

.coffee-menu-cart__checkout::after {
	border: none;
}
</style>
