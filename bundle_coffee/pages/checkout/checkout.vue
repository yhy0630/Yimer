<template>
	<view class="coffee-checkout-wrap">
		<view class="coffee-checkout-nav" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="coffee-checkout-nav__inner">
				<view class="coffee-checkout-nav__back" @tap="goBack">
					<u-icon name="arrow-left" size="44" color="#161616"></u-icon>
				</view>
				<text class="coffee-checkout-nav__title">确认订单</text>
				<view class="coffee-checkout-nav__placeholder"></view>
			</view>
		</view>

		<scroll-view class="coffee-checkout-scroll" scroll-y :show-scrollbar="false">
			<view class="coffee-checkout-content">
				<view class="coffee-checkout-card">
					<text class="coffee-checkout-card__title">我的订单</text>
					<view
						v-for="(item, index) in orderItems"
						:key="item.id"
						:class="['coffee-checkout-item', index > 0 ? 'has-border' : '']"
					>
						<image
							class="coffee-checkout-item__cover"
							:src="item.image"
							mode="aspectFill"
						/>
						<view class="coffee-checkout-item__info">
							<view class="coffee-checkout-item__title-row">
								<text class="coffee-checkout-item__name line-1">{{ item.name }}</text>
								<text class="coffee-checkout-item__qty">x{{ item.quantity }}</text>
							</view>
							<text class="coffee-checkout-item__spec line-2">{{ item.spec }}</text>
							<view class="coffee-checkout-item__price-row">
								<text class="coffee-checkout-item__price">¥{{ item.price }}</text>
								<text class="coffee-checkout-item__origin">¥{{ item.originPrice }}</text>
							</view>
						</view>
					</view>
				</view>

				<view class="coffee-checkout-card">
					<text class="coffee-checkout-card__title">订单备注</text>
					<textarea
						class="coffee-checkout-note"
						v-model="orderNote"
						placeholder="请输入订单备注"
						placeholder-class="coffee-checkout-note__placeholder"
						maxlength="200"
						auto-height
					/>
				</view>

				<view class="coffee-checkout-card">
					<view class="coffee-checkout-row" @tap="handleCouponTap">
						<text class="coffee-checkout-row__label">优惠券</text>
						<view class="coffee-checkout-row__right">
							<view v-if="selectedCouponId" class="coffee-checkout-row__selected line-1">
								{{ selectedCouponTitle }}
							</view>
							<view v-else class="coffee-checkout-badge">{{ availableCouponCount }}张可用</view>
							<u-icon name="arrow-right" size="24" color="#cccccc"></u-icon>
						</view>
					</view>
					<view class="coffee-checkout-row" @tap="handlePointsTap">
						<text class="coffee-checkout-row__label">积分</text>
						<view class="coffee-checkout-row__right">
							<text class="coffee-checkout-row__muted">暂无可用</text>
							<u-icon name="arrow-right" size="24" color="#cccccc"></u-icon>
						</view>
					</view>
					<view class="coffee-checkout-subtotal">
						<text class="coffee-checkout-subtotal__text">总计 ¥ {{ subtotal }}</text>
					</view>
					<text class="coffee-checkout-tip">如需餐具，可联系店内咖啡师获取协助</text>
				</view>
			</view>
		</scroll-view>

		<view class="coffee-checkout-footer">
			<text class="coffee-checkout-footer__total">合计: ¥ {{ totalAmount }}</text>
			<button class="coffee-checkout-footer__submit" hover-class="none" @tap="handleSubmit">
				提交订单
			</button>
		</view>

		<u-popup
			v-model="showCouponPopup"
			mode="bottom"
			border-radius="24"
			:mask-close-able="true"
			:safe-area-inset-bottom="true"
			@close="closeCouponPopup"
		>
			<view class="coupon-popup">
				<view class="coupon-popup__header">
					<text class="coupon-popup__title">优惠券</text>
					<view class="coupon-popup__close" @tap="closeCouponPopup">
						<u-icon name="close" size="32" color="#cccccc"></u-icon>
					</view>
				</view>

				<scroll-view class="coupon-popup__scroll" scroll-y :show-scrollbar="false">
					<view
						v-for="item in couponList"
						:key="item.id"
						class="coupon-card"
						@tap="selectCoupon(item.id)"
					>
						<view class="coupon-card__main">
							<view class="coupon-card__cover-wrap">
								<image
									class="coupon-card__cover"
									:src="item.image"
									mode="aspectFill"
								/>
							</view>
							<view class="coupon-card__info">
								<text class="coupon-card__name line-2">{{ item.title }}</text>
								<text class="coupon-card__expire">有效期至{{ item.expireAt }}</text>
								<text class="coupon-card__store line-1">{{ item.store }}</text>
							</view>
							<view
								:class="[
									'coupon-card__radio',
									selectedCouponId === item.id ? 'is-active' : ''
								]"
							>
								<view
									v-if="selectedCouponId === item.id"
									class="coupon-card__radio-dot"
								></view>
							</view>
						</view>

						<view class="coupon-card__divider"></view>

						<view class="coupon-card__rules" @tap.stop="toggleCouponRules(item.id)">
							<text class="coupon-card__rules-title">优惠券规则</text>
							<u-icon
								:name="expandedCouponIds.includes(item.id) ? 'arrow-up' : 'arrow-down'"
								size="24"
								color="#999999"
							></u-icon>
						</view>

						<view v-if="expandedCouponIds.includes(item.id)" class="coupon-card__rules-list">
							<text
								v-for="(rule, ruleIndex) in item.rules"
								:key="`${item.id}-rule-${ruleIndex}`"
								class="coupon-card__rules-item"
							>
								{{ rule }}
							</text>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>
	</view>
</template>

<script>
const COUPON_LIST = [
	{
		id: 'coupon-1',
		title: '【啡快专享】订单满35元减5元',
		expireAt: '2026-01-14 15:23:50',
		store: '伊美尔朝阳店使用',
		image: '/static/linshi/17.png',
		rules: [
			'1. 每人限领1张，每笔订单限用一张；',
			'2. 订单金额(不含运费)满100元可使用一张；',
			'3. 不与其他优惠叠加使用'
		]
	},
	{
		id: 'coupon-2',
		title: '【啡快专享】订单满35元减5元',
		expireAt: '2026-01-14 15:23:50',
		store: '伊美尔朝阳店使用',
		image: '/static/linshi/18.png',
		rules: [
			'1. 每人限领1张，每笔订单限用一张；',
			'2. 订单金额(不含运费)满100元可使用一张；',
			'3. 不与其他优惠叠加使用'
		]
	}
]

const ORDER_ITEMS = [
	{
		id: 'checkout-item-1',
		name: '茉莉花香美式',
		quantity: 1,
		spec: '大杯/冰/意式拼配/默认浓度/不另外加糖',
		price: '36.4',
		originPrice: '52',
		image: '/static/linshi/17.png'
	},
	{
		id: 'checkout-item-2',
		name: '茉莉花香美式',
		quantity: 1,
		spec: '大杯/冰/意式拼配/默认浓度/不另外加糖',
		price: '36.4',
		originPrice: '52',
		image: '/static/linshi/18.png'
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
	name: 'CoffeeCheckout',
	data() {
		return {
			statusBarHeight: getStatusBarHeight(),
			orderItems: ORDER_ITEMS,
			orderNote: '',
			subtotal: '39',
			totalAmount: '399',
			showCouponPopup: false,
			couponList: COUPON_LIST,
			selectedCouponId: 'coupon-2',
			expandedCouponIds: ['coupon-2'],
			availableCouponCount: 2
		}
	},
	computed: {
		selectedCouponTitle() {
			const coupon = this.couponList.find((item) => item.id === this.selectedCouponId)
			return coupon ? coupon.title : ''
		}
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		handleCouponTap() {
			this.showCouponPopup = true
		},
		closeCouponPopup() {
			this.showCouponPopup = false
		},
		selectCoupon(couponId) {
			this.selectedCouponId = couponId
		},
		toggleCouponRules(couponId) {
			if (this.expandedCouponIds.includes(couponId)) {
				this.expandedCouponIds = this.expandedCouponIds.filter((id) => id !== couponId)
				return
			}

			this.expandedCouponIds = [...this.expandedCouponIds, couponId]
		},
		handlePointsTap() {
			uni.showToast({
				title: '积分待接入',
				icon: 'none'
			})
		},
		handleSubmit() {
			uni.navigateTo({
				url: '/bundle_coffee/pages/payment/payment'
			})
		}
	}
}
</script>

<style scoped lang="scss">
.coffee-checkout-wrap {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background: #f5f5f6;
}

.coffee-checkout-nav {
	flex: none;
	background: #ffffff;
}

.coffee-checkout-nav__inner {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 88rpx;
	padding: 0 32rpx;
}

.coffee-checkout-nav__back,
.coffee-checkout-nav__placeholder {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 72rpx;
	height: 72rpx;
	flex: none;
}

.coffee-checkout-nav__back {
	margin-left: -12rpx;
	justify-content: flex-start;
}

.coffee-checkout-nav__title {
	flex: 1;
	text-align: center;
	font-size: 34rpx;
	font-weight: 600;
	color: #1a1b1d;
	line-height: 1.2;
}

.coffee-checkout-scroll {
	flex: 1;
	height: 0;
}

.coffee-checkout-content {
	padding: 24rpx 24rpx calc(env(safe-area-inset-bottom) + 140rpx);
	box-sizing: border-box;
}

.coffee-checkout-card {
	padding: 28rpx 24rpx;
	border-radius: 16rpx;
	background: #ffffff;

	& + & {
		margin-top: 20rpx;
	}
}

.coffee-checkout-card__title {
	display: block;
	font-size: 30rpx;
	font-weight: 700;
	color: #1a1b1d;
	line-height: 1.2;
}

.coffee-checkout-item {
	display: flex;
	align-items: flex-start;
	margin-top: 24rpx;
}

.coffee-checkout-item.has-border {
	padding-top: 24rpx;
	border-top: 2rpx solid #f3f3f4;
}

.coffee-checkout-item__cover {
	flex: none;
	width: 120rpx;
	height: 120rpx;
	border-radius: 12rpx;
	background: #f3f4f6;
}

.coffee-checkout-item__info {
	flex: 1;
	min-width: 0;
	margin-left: 20rpx;
}

.coffee-checkout-item__title-row {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
}

.coffee-checkout-item__name {
	flex: 1;
	min-width: 0;
	margin-right: 16rpx;
	font-size: 28rpx;
	font-weight: 600;
	color: #1a1b1d;
	line-height: 1.3;
}

.coffee-checkout-item__qty {
	flex: none;
	font-size: 26rpx;
	color: #999999;
	line-height: 1.3;
}

.coffee-checkout-item__spec {
	display: block;
	margin-top: 8rpx;
	font-size: 22rpx;
	color: #999999;
	line-height: 1.4;
}

.coffee-checkout-item__price-row {
	display: flex;
	align-items: baseline;
	margin-top: 12rpx;
}

.coffee-checkout-item__price {
	font-size: 28rpx;
	font-weight: 700;
	color: #ff4d4f;
	line-height: 1.2;
}

.coffee-checkout-item__origin {
	margin-left: 10rpx;
	font-size: 22rpx;
	color: #999999;
	text-decoration: line-through;
	line-height: 1.2;
}

.coffee-checkout-note {
	width: 100%;
	min-height: 120rpx;
	margin-top: 20rpx;
	padding: 0;
	font-size: 28rpx;
	color: #1a1b1d;
	line-height: 1.5;
	box-sizing: border-box;
}

.coffee-checkout-note__placeholder {
	color: #cccccc;
}

.coffee-checkout-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24rpx 0;
}

.coffee-checkout-row + .coffee-checkout-row {
	border-top: 2rpx solid #f3f3f4;
}

.coffee-checkout-row__label {
	font-size: 28rpx;
	color: #1a1b1d;
	line-height: 1.2;
}

.coffee-checkout-row__right {
	display: flex;
	align-items: center;
}

.coffee-checkout-badge {
	margin-right: 8rpx;
	padding: 4rpx 12rpx;
	border-radius: 8rpx;
	background: #eef2ff;
	font-size: 22rpx;
	color: #4a67d6;
	line-height: 1.2;
}

.coffee-checkout-row__muted {
	margin-right: 8rpx;
	font-size: 26rpx;
	color: #999999;
	line-height: 1.2;
}

.coffee-checkout-subtotal {
	display: flex;
	justify-content: flex-end;
	padding-top: 8rpx;
}

.coffee-checkout-subtotal__text {
	font-size: 28rpx;
	font-weight: 600;
	color: #1a1b1d;
	line-height: 1.2;
}

.coffee-checkout-tip {
	display: block;
	margin-top: 20rpx;
	font-size: 22rpx;
	color: #999999;
	line-height: 1.4;
}

.coffee-checkout-footer {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 10;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 24rpx calc(env(safe-area-inset-bottom) + 20rpx);
	background: #ffffff;
	box-shadow: 0 -4rpx 24rpx rgba(15, 35, 95, 0.06);
}

.coffee-checkout-footer__total {
	font-size: 32rpx;
	font-weight: 700;
	color: #143080;
	line-height: 1.2;
}

.coffee-checkout-footer__submit {
	flex: none;
	margin: 0;
	padding: 0 56rpx;
	height: 80rpx;
	line-height: 80rpx;
	border: none;
	border-radius: 999rpx;
	background: #143080;
	font-size: 30rpx;
	font-weight: 600;
	color: #ffffff;
}

.coffee-checkout-footer__submit::after {
	border: none;
}

.coupon-popup {
	display: flex;
	flex-direction: column;
	max-height: 72vh;
	background: #f5f5f6;
}

.coupon-popup__header {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	flex: none;
	height: 96rpx;
	background: #ffffff;
}

.coupon-popup__title {
	font-size: 34rpx;
	font-weight: 600;
	color: #1a1b1d;
	line-height: 1.2;
}

.coupon-popup__close {
	position: absolute;
	top: 50%;
	right: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 56rpx;
	height: 56rpx;
	transform: translateY(-50%);
}

.coupon-popup__scroll {
	flex: 1;
	height: 0;
	min-height: 480rpx;
	max-height: calc(72vh - 96rpx);
	padding: 20rpx 24rpx 24rpx;
	box-sizing: border-box;
}

.coupon-card {
	padding: 24rpx;
	border-radius: 16rpx;
	background: #ffffff;
	box-shadow: 0 4rpx 20rpx rgba(15, 35, 95, 0.06);

	& + & {
		margin-top: 20rpx;
	}
}

.coupon-card__main {
	display: flex;
	align-items: flex-start;
}

.coupon-card__cover-wrap {
	flex: none;
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	overflow: hidden;
	background: #f3f4f6;
}

.coupon-card__cover {
	width: 100%;
	height: 100%;
}

.coupon-card__info {
	flex: 1;
	min-width: 0;
	margin: 0 16rpx;
}

.coupon-card__name {
	display: block;
	font-size: 28rpx;
	font-weight: 700;
	color: #1a1b1d;
	line-height: 1.35;
}

.coupon-card__expire,
.coupon-card__store {
	display: block;
	margin-top: 8rpx;
	font-size: 22rpx;
	color: #999999;
	line-height: 1.3;
}

.coupon-card__radio {
	flex: none;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 36rpx;
	height: 36rpx;
	margin-top: 8rpx;
	border: 2rpx solid #cccccc;
	border-radius: 50%;
	box-sizing: border-box;
}

.coupon-card__radio.is-active {
	border-color: #143080;
	background: #143080;
}

.coupon-card__radio-dot {
	width: 12rpx;
	height: 12rpx;
	border-radius: 50%;
	background: #ffffff;
}

.coupon-card__divider {
	margin: 20rpx 0 16rpx;
	border-top: 2rpx dashed #e8e8e8;
}

.coupon-card__rules {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.coupon-card__rules-title {
	font-size: 24rpx;
	color: #666666;
	line-height: 1.2;
}

.coupon-card__rules-list {
	margin-top: 12rpx;
}

.coupon-card__rules-item {
	display: block;
	font-size: 22rpx;
	color: #999999;
	line-height: 1.5;

	& + & {
		margin-top: 4rpx;
	}
}

.coffee-checkout-row__selected {
	max-width: 360rpx;
	margin-right: 8rpx;
	font-size: 24rpx;
	color: #143080;
	line-height: 1.2;
}
</style>
