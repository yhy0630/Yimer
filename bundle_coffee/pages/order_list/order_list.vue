<template>
	<view class="coffee-order-wrap">
		<view class="coffee-order-nav" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="coffee-order-nav__inner">
				<view class="coffee-order-nav__back" @tap="goBack">
					<u-icon name="arrow-left" size="44" color="#161616"></u-icon>
				</view>
				<text class="coffee-order-nav__title">订单列表</text>
				<view class="coffee-order-nav__placeholder"></view>
			</view>
		</view>

		<scroll-view class="coffee-order-scroll" scroll-y :show-scrollbar="false">
			<view class="coffee-order-list">
				<view
					v-for="item in orderList"
					:key="item.id"
					class="coffee-order-card"
					@tap="openOrderDetail(item)"
				>
					<view class="coffee-order-card__head">
						<text class="coffee-order-card__store line-1">{{ item.storeName }}</text>
						<text
							:class="[
								'coffee-order-card__status',
								item.status === 'pickup' ? 'is-pickup' : 'is-muted'
							]"
						>
							{{ item.statusText }}
						</text>
					</view>

					<view class="coffee-order-card__body">
						<view class="coffee-order-card__cover-wrap">
							<image
								class="coffee-order-card__cover"
								:src="productImage"
								mode="aspectFill"
							/>
						</view>
						<view class="coffee-order-card__info">
							<view class="coffee-order-card__title-row">
								<text class="coffee-order-card__name line-1">{{ item.productName }}</text>
								<text class="coffee-order-card__qty">x{{ item.quantity }}</text>
							</view>
							<text class="coffee-order-card__spec line-2">{{ item.spec }}</text>
							<view class="coffee-order-card__price-row">
								<text class="coffee-order-card__price">¥{{ item.price }}</text>
								<text class="coffee-order-card__origin">¥{{ item.originPrice }}</text>
							</view>
						</view>
					</view>

					<view class="coffee-order-card__summary">
						<text class="coffee-order-card__time">{{ item.time }}</text>
						<text class="coffee-order-card__total">
							共{{ item.quantity }}件商品合计:¥{{ item.totalAmount }}
						</text>
					</view>

					<view class="coffee-order-card__footer" @tap.stop>
						<text class="coffee-order-card__more" @tap="handleMore(item)">更多</text>
						<button
							v-if="item.actionLabel"
							:class="[
								'coffee-order-card__btn',
								item.actionTone === 'navy' ? 'is-navy' : 'is-primary'
							]"
							hover-class="none"
							@tap="handleAction(item)"
						>
							{{ item.actionLabel }}
						</button>
					</view>
				</view>
			</view>
		</scroll-view>

		<u-popup
			v-model="showPickupPopup"
			mode="center"
			width="600"
			:zoom="false"
			border-radius="24"
			:mask-close-able="true"
			:custom-style="{ background: 'transparent' }"
			:mask-custom-style="{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }"
			@close="closePickupPopup"
		>
			<view class="pickup-popup">
				<view class="pickup-popup__close" @tap="closePickupPopup">
					<u-icon name="close" size="32" color="#cccccc"></u-icon>
				</view>

				<text class="pickup-popup__code">{{ pickupPopup.pickupCode }}</text>
				<text class="pickup-popup__slogan">{{ pickupPopup.slogan }}</text>

				<view v-if="showPickupPopup" class="pickup-popup__qrcode">
					<tki-qrcode
						cid="coffee-pickup-qrcode"
						:val="pickupPopup.qrcodeValue"
						:size="360"
						unit="upx"
						:load-make="true"
						:show-loading="false"
					/>
				</view>

				<text class="pickup-popup__tip">{{ pickupPopup.tipText }}</text>

				<button class="pickup-popup__confirm" hover-class="none" @tap="closePickupPopup">
					确定
				</button>
			</view>
		</u-popup>
	</view>
</template>

<script>
import TkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue'
const PRODUCT_IMAGE = '/static/linshi/17.png'

const ORDER_LIST = [
	{
		id: 'coffee-order-1',
		storeName: '蓝猫咖啡(光华soho2期店)',
		status: 'pickup',
		statusText: '待取餐',
		productName: '茉莉花香美式',
		quantity: 1,
		spec: '大杯/冰/意式拼配/默认浓度/不另外加糖',
		price: '36.4',
		originPrice: '52',
		time: '2026-04-25 14:19',
		totalAmount: '13.9',
		actionLabel: '取餐码',
		actionTone: 'primary',
		actionType: 'pickup_code',
		pickupCode: '666',
		slogan: '我思故我在',
		customerName: '十七'
	},
	{
		id: 'coffee-order-2',
		storeName: '蓝猫咖啡(光华soho2期店)',
		status: 'making',
		statusText: '制作中',
		productName: '茉莉花香美式',
		quantity: 1,
		spec: '大杯/冰/意式拼配/默认浓度/不另外加糖',
		price: '36.4',
		originPrice: '52',
		time: '2026-04-25 14:19',
		totalAmount: '13.9',
		actionLabel: '',
		actionTone: '',
		actionType: ''
	},
	{
		id: 'coffee-order-3',
		storeName: '蓝猫咖啡(光华soho2期店)',
		status: 'completed',
		statusText: '已完成',
		productName: '茉莉花香美式',
		quantity: 1,
		spec: '大杯/冰/意式拼配/默认浓度/不另外加糖',
		price: '36.4',
		originPrice: '52',
		time: '2026-04-25 14:19',
		totalAmount: '13.9',
		actionLabel: '再来一单',
		actionTone: 'navy',
		actionType: 'reorder'
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
	name: 'CoffeeOrderList',
	components: {
		TkiQrcode
	},
	data() {
		return {
			statusBarHeight: getStatusBarHeight(),
			productImage: PRODUCT_IMAGE,
			orderList: ORDER_LIST,
			showPickupPopup: false,
			pickupPopup: {
				pickupCode: '',
				slogan: '',
				qrcodeValue: '',
				tipText: ''
			}
		}
	},
	methods: {
		goBack() {
			const pages = getCurrentPages()

			if (pages.length > 1) {
				uni.navigateBack({ delta: 1 })
				return
			}

			uni.navigateTo({
				url: '/bundle_coffee/pages/index/index'
			})
		},
		handleMore(item) {
			uni.showToast({
				title: '更多待接入',
				icon: 'none'
			})
		},
		handleAction(item) {
			if (item.actionType === 'pickup_code') {
				this.openPickupPopup(item)
				return
			}

			uni.showToast({
				title: `${item.actionLabel}待接入`,
				icon: 'none'
			})
		},
		openPickupPopup(item) {
			this.pickupPopup = {
				pickupCode: item.pickupCode || '666',
				slogan: item.slogan || '我思故我在',
				qrcodeValue: `coffee-pickup-${item.id}-${item.pickupCode || '666'}`,
				tipText: `${item.customerName || '十七'}，请扫码取餐`
			}
			this.showPickupPopup = true
		},
		closePickupPopup() {
			this.showPickupPopup = false
		},
		openOrderDetail(item) {
			uni.navigateTo({
				url: `/bundle_coffee/pages/order_detail/order_detail?id=${item.id}&status=${item.status}`
			})
		}
	}
}
</script>

<style scoped lang="scss">
.coffee-order-wrap {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background: #f8f8f8;
}

.coffee-order-nav {
	flex: none;
	background: #ffffff;
}

.coffee-order-nav__inner {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 88rpx;
	padding: 0 32rpx;
}

.coffee-order-nav__back,
.coffee-order-nav__placeholder {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 72rpx;
	height: 72rpx;
}

.coffee-order-nav__back {
	margin-left: -12rpx;
	justify-content: flex-start;
}

.coffee-order-nav__title {
	flex: 1;
	text-align: center;
	font-size: 34rpx;
	font-weight: 600;
	color: #333333;
	line-height: 1.2;
}

.coffee-order-scroll {
	flex: 1;
	height: 0;
}

.coffee-order-list {
	padding: 20rpx 24rpx calc(env(safe-area-inset-bottom) + 32rpx);
	box-sizing: border-box;
}

.coffee-order-card {
	padding: 0 24rpx 24rpx;
	border-radius: 20rpx;
	background: #ffffff;
	overflow: hidden;

	& + & {
		margin-top: 20rpx;
	}
}

.coffee-order-card__head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 28rpx 0 24rpx;
	border-bottom: 2rpx solid #eeeeee;
}

.coffee-order-card__store {
	flex: 1;
	min-width: 0;
	margin-right: 20rpx;
	font-size: 30rpx;
	font-weight: 500;
	color: #333333;
	line-height: 1.3;
}

.coffee-order-card__status {
	flex: none;
	font-size: 28rpx;
	line-height: 1.2;
}

.coffee-order-card__status.is-pickup {
	color: #4a67d6;
}

.coffee-order-card__status.is-muted {
	color: #999999;
}

.coffee-order-card__body {
	display: flex;
	align-items: flex-start;
	padding-top: 24rpx;
}

.coffee-order-card__cover-wrap {
	flex: none;
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	overflow: hidden;
	background: #f3f4f6;
}

.coffee-order-card__cover {
	width: 100%;
	height: 100%;
}

.coffee-order-card__info {
	flex: 1;
	min-width: 0;
	margin-left: 20rpx;
}

.coffee-order-card__title-row {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
}

.coffee-order-card__name {
	flex: 1;
	min-width: 0;
	margin-right: 16rpx;
	font-size: 30rpx;
	font-weight: 600;
	color: #333333;
	line-height: 1.3;
}

.coffee-order-card__qty {
	flex: none;
	font-size: 26rpx;
	color: #999999;
	line-height: 1.3;
}

.coffee-order-card__spec {
	display: block;
	margin-top: 10rpx;
	font-size: 24rpx;
	color: #999999;
	line-height: 1.4;
}

.coffee-order-card__price-row {
	display: flex;
	align-items: baseline;
	margin-top: 14rpx;
}

.coffee-order-card__price {
	font-size: 32rpx;
	font-weight: 700;
	color: #ff4d4f;
	line-height: 1.2;
}

.coffee-order-card__origin {
	margin-left: 12rpx;
	font-size: 24rpx;
	color: #999999;
	text-decoration: line-through;
	line-height: 1.2;
}

.coffee-order-card__summary {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 24rpx;
}

.coffee-order-card__time {
	font-size: 24rpx;
	color: #999999;
	line-height: 1.2;
}

.coffee-order-card__total {
	font-size: 26rpx;
	color: #333333;
	line-height: 1.2;
}

.coffee-order-card__footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 20rpx;
	min-height: 64rpx;
}

.coffee-order-card__more {
	font-size: 26rpx;
	color: #999999;
	line-height: 1.2;
}

.coffee-order-card__btn {
	flex: none;
	margin: 0;
	padding: 0 36rpx;
	height: 60rpx;
	line-height: 58rpx;
	border-radius: 999rpx;
	background: #ffffff;
	font-size: 26rpx;
}

.coffee-order-card__btn.is-primary {
	border: 2rpx solid #4a67d6;
	color: #4a67d6;
}

.coffee-order-card__btn.is-navy {
	border: 2rpx solid #143080;
	color: #143080;
}

.coffee-order-card__btn::after {
	border: none;
}

.pickup-popup {
	position: relative;
	width: 600rpx;
	padding: 48rpx 40rpx 40rpx;
	border-radius: 24rpx;
	background: #ffffff;
	box-sizing: border-box;
}

.pickup-popup__close {
	position: absolute;
	top: 24rpx;
	right: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 56rpx;
	height: 56rpx;
}

.pickup-popup__code {
	display: block;
	text-align: center;
	font-size: 72rpx;
	font-weight: 700;
	color: #000000;
	line-height: 1.1;
}

.pickup-popup__slogan {
	display: block;
	margin-top: 16rpx;
	text-align: center;
	font-size: 28rpx;
	color: #999999;
	line-height: 1.3;
}

.pickup-popup__qrcode {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 40rpx;
}

.pickup-popup__tip {
	display: block;
	margin-top: 32rpx;
	text-align: center;
	font-size: 28rpx;
	color: #999999;
	line-height: 1.3;
}

.pickup-popup__confirm {
	width: 100%;
	height: 88rpx;
	margin: 40rpx 0 0;
	padding: 0;
	border: none;
	border-radius: 999rpx;
	background: #1a337e;
	font-size: 32rpx;
	font-weight: 500;
	color: #ffffff;
	line-height: 88rpx;
}

.pickup-popup__confirm::after {
	border: none;
}
</style>
