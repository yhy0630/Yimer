<template>
	<view class="order-detail-wrap">
		<view class="order-detail-nav" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="order-detail-nav__inner">
				<view class="order-detail-nav__back" @tap="goBack">
					<u-icon name="arrow-left" size="44" color="#161616"></u-icon>
				</view>
				<text class="order-detail-nav__title">订单详情</text>
				<view class="order-detail-nav__placeholder"></view>
			</view>
		</view>

		<scroll-view class="order-detail-scroll" scroll-y :show-scrollbar="false">
			<view class="order-detail-content">
				<view class="order-detail-card">
					<text class="order-detail-card__pickup-title">取餐码</text>

					<view class="order-detail-steps">
						<template v-for="(step, index) in statusSteps">
							<view
								v-if="index > 0"
								:key="`line-${step.key}`"
								class="order-detail-steps__line"
							></view>
							<view :key="step.key" class="order-detail-steps__node">
								<image
									class="order-detail-steps__icon"
									:src="step.icon"
									mode="aspectFit"
								/>
								<text
									:class="[
										'order-detail-steps__label',
										activeStepIndex === index ? 'is-active' : ''
									]"
								>
									{{ step.label }}
								</text>
							</view>
						</template>
					</view>

					<view class="order-detail-qrcode">
						<tki-qrcode
							cid="coffee-order-detail-qrcode"
							:val="qrcodeValue"
							:size="360"
							unit="upx"
							:load-make="true"
							:show-loading="false"
						/>
					</view>
					<text class="order-detail-qrcode__tip">请出示取餐码</text>
				</view>

				<view class="order-detail-card">
					<text class="order-detail-card__section-title">商品清单</text>
					<view
						v-for="(item, index) in productItems"
						:key="item.id"
						:class="['order-detail-product', index > 0 ? 'has-border' : '']"
					>
						<image
							class="order-detail-product__cover"
							:src="item.image"
							mode="aspectFill"
						/>
						<view class="order-detail-product__info">
							<view class="order-detail-product__title-row">
								<text class="order-detail-product__name line-1">{{ item.name }}</text>
								<text class="order-detail-product__qty">x{{ item.quantity }}</text>
							</view>
							<text class="order-detail-product__spec line-2">{{ item.spec }}</text>
							<view class="order-detail-product__price-row">
								<text class="order-detail-product__price">¥{{ item.price }}</text>
								<text class="order-detail-product__origin">¥{{ item.originPrice }}</text>
							</view>
						</view>
					</view>

					<view class="order-detail-summary">
						<view class="order-detail-summary__row">
							<text class="order-detail-summary__label">商品总价</text>
							<text class="order-detail-summary__value">¥ {{ goodsTotal }}</text>
						</view>
						<view class="order-detail-summary__row">
							<text class="order-detail-summary__label">折扣金额</text>
							<text class="order-detail-summary__value is-discount">- ¥ {{ discountAmount }}</text>
						</view>
						<view class="order-detail-summary__total-row">
							<text class="order-detail-summary__total">总计 ¥ {{ finalTotal }}</text>
						</view>
					</view>
				</view>

				<view class="order-detail-card">
					<text class="order-detail-card__section-title">订单信息</text>
					<view class="order-detail-info__row">
						<text class="order-detail-info__label">订单编号</text>
						<view class="order-detail-info__value-wrap">
							<text class="order-detail-info__value">{{ orderInfo.orderNo }}</text>
							<text class="order-detail-info__copy" @tap="copyOrderNo">复制</text>
						</view>
					</view>
					<view class="order-detail-info__row">
						<text class="order-detail-info__label">下单时间</text>
						<text class="order-detail-info__value">{{ orderInfo.orderTime }}</text>
					</view>
					<view class="order-detail-info__row">
						<text class="order-detail-info__label">支付时间</text>
						<text class="order-detail-info__value">{{ orderInfo.payMethod }}</text>
					</view>
					<view class="order-detail-info__row is-last">
						<text class="order-detail-info__label">订单备注</text>
						<text class="order-detail-info__value">{{ orderInfo.remark }}</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import TkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue'

const STATUS_STEPS = [
	{
		key: 'ordered',
		label: '已下单',
		icon: '/bundle_coffee/static/images/list.png'
	},
	{
		key: 'making',
		label: '制作中',
		icon: '/bundle_coffee/static/images/juicer.png'
	},
	{
		key: 'pickup',
		label: '待取餐',
		icon: '/bundle_coffee/static/images/beverages.png'
	}
]

const PRODUCT_ITEMS = [
	{
		id: 'detail-product-1',
		name: '茉莉花香美式',
		quantity: 1,
		spec: '大杯/冰/意式拼配/默认浓度/不另外加糖',
		price: '36.4',
		originPrice: '52',
		image: '/static/linshi/17.png'
	},
	{
		id: 'detail-product-2',
		name: '茉莉花香美式',
		quantity: 1,
		spec: '大杯/冰/意式拼配/默认浓度/不另外加糖',
		price: '36.4',
		originPrice: '52',
		image: '/static/linshi/18.png'
	}
]

const STATUS_STEP_INDEX = {
	pickup: 2,
	making: 1,
	completed: 2,
	ordered: 0
}

function getStatusBarHeight() {
	try {
		const { statusBarHeight = 20 } = uni.getSystemInfoSync()
		return statusBarHeight
	} catch (error) {
		return 20
	}
}

export default {
	name: 'CoffeeOrderDetail',
	components: {
		TkiQrcode
	},
	data() {
		return {
			statusBarHeight: getStatusBarHeight(),
			statusSteps: STATUS_STEPS,
			activeStepIndex: 2,
			qrcodeValue: 'coffee-order-DD2042038403294039',
			productItems: PRODUCT_ITEMS,
			goodsTotal: '82',
			discountAmount: '82',
			finalTotal: '39',
			orderInfo: {
				orderNo: 'DD2042038403294039',
				orderTime: '2024-01-13 16:40:12',
				payMethod: '微信支付',
				remark: '无'
			}
		}
	},
	onLoad(options = {}) {
		const status = options.status || 'pickup'
		this.activeStepIndex = STATUS_STEP_INDEX[status] ?? 2

		if (options.id) {
			this.qrcodeValue = `coffee-order-${options.id}`
		}
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		copyOrderNo() {
			uni.setClipboardData({
				data: this.orderInfo.orderNo,
				success: () => {
					uni.showToast({
						title: '复制成功',
						icon: 'none'
					})
				}
			})
		}
	}
}
</script>

<style scoped lang="scss">
.order-detail-wrap {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background: #f5f5f6;
}

.order-detail-nav {
	flex: none;
	background: #ffffff;
}

.order-detail-nav__inner {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 88rpx;
	padding: 0 32rpx;
}

.order-detail-nav__back,
.order-detail-nav__placeholder {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 72rpx;
	height: 72rpx;
	flex: none;
}

.order-detail-nav__back {
	margin-left: -12rpx;
	justify-content: flex-start;
}

.order-detail-nav__title {
	flex: 1;
	text-align: center;
	font-size: 34rpx;
	font-weight: 600;
	color: #1a1b1d;
	line-height: 1.2;
}

.order-detail-scroll {
	flex: 1;
	height: 0;
}

.order-detail-content {
	padding: 24rpx 24rpx calc(env(safe-area-inset-bottom) + 32rpx);
	box-sizing: border-box;
}

.order-detail-card {
	padding: 28rpx 24rpx;
	border-radius: 16rpx;
	background: #ffffff;

	& + & {
		margin-top: 20rpx;
	}
}

.order-detail-card__pickup-title {
	display: block;
	text-align: center;
	font-size: 30rpx;
	font-weight: 700;
	color: #1a1b1d;
	line-height: 1.2;
}

.order-detail-steps {
	display: flex;
	align-items: flex-start;
	justify-content: center;
	margin-top: 32rpx;
	padding: 0 16rpx;
}

.order-detail-steps__line {
	flex: 1;
	height: 0;
	margin-top: 28rpx;
	border-top: 2rpx dashed #dddddd;
}

.order-detail-steps__node {
	display: flex;
	flex-direction: column;
	align-items: center;
	flex: none;
	width: 140rpx;
}

.order-detail-steps__icon {
	width: 56rpx;
	height: 56rpx;
}

.order-detail-steps__label {
	margin-top: 12rpx;
	font-size: 22rpx;
	color: #999999;
	line-height: 1.2;
	text-align: center;
	white-space: nowrap;
}

.order-detail-steps__label.is-active {
	font-weight: 700;
	color: #1a1b1d;
}

.order-detail-qrcode {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 36rpx;
}

.order-detail-qrcode__tip {
	display: block;
	margin-top: 20rpx;
	text-align: center;
	font-size: 26rpx;
	color: #666666;
	line-height: 1.2;
}

.order-detail-card__section-title {
	display: block;
	font-size: 30rpx;
	font-weight: 700;
	color: #1a1b1d;
	line-height: 1.2;
}

.order-detail-product {
	display: flex;
	align-items: flex-start;
	margin-top: 24rpx;
}

.order-detail-product.has-border {
	padding-top: 24rpx;
	border-top: 2rpx solid #f3f3f4;
}

.order-detail-product__cover {
	flex: none;
	width: 120rpx;
	height: 120rpx;
	border-radius: 12rpx;
	background: #f3f4f6;
}

.order-detail-product__info {
	flex: 1;
	min-width: 0;
	margin-left: 20rpx;
}

.order-detail-product__title-row {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
}

.order-detail-product__name {
	flex: 1;
	min-width: 0;
	margin-right: 16rpx;
	font-size: 28rpx;
	font-weight: 600;
	color: #1a1b1d;
	line-height: 1.3;
}

.order-detail-product__qty {
	flex: none;
	font-size: 26rpx;
	color: #999999;
	line-height: 1.3;
}

.order-detail-product__spec {
	display: block;
	margin-top: 8rpx;
	font-size: 22rpx;
	color: #999999;
	line-height: 1.4;
}

.order-detail-product__price-row {
	display: flex;
	align-items: baseline;
	margin-top: 12rpx;
}

.order-detail-product__price {
	font-size: 28rpx;
	font-weight: 700;
	color: #ff4d4f;
	line-height: 1.2;
}

.order-detail-product__origin {
	margin-left: 10rpx;
	font-size: 22rpx;
	color: #999999;
	text-decoration: line-through;
	line-height: 1.2;
}

.order-detail-summary {
	margin-top: 24rpx;
	padding-top: 24rpx;
	border-top: 2rpx solid #f3f3f4;
}

.order-detail-summary__row {
	display: flex;
	align-items: center;
	justify-content: space-between;

	& + & {
		margin-top: 16rpx;
	}
}

.order-detail-summary__label {
	font-size: 26rpx;
	color: #666666;
	line-height: 1.2;
}

.order-detail-summary__value {
	font-size: 26rpx;
	color: #1a1b1d;
	line-height: 1.2;
}

.order-detail-summary__value.is-discount {
	color: #ff4d4f;
}

.order-detail-summary__total-row {
	display: flex;
	justify-content: flex-end;
	margin-top: 20rpx;
}

.order-detail-summary__total {
	font-size: 32rpx;
	font-weight: 700;
	color: #1a1b1d;
	line-height: 1.2;
}

.order-detail-info__row {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	margin-top: 24rpx;
}

.order-detail-info__row.is-last {
	margin-bottom: 0;
}

.order-detail-info__label {
	flex: none;
	font-size: 26rpx;
	color: #999999;
	line-height: 1.4;
}

.order-detail-info__value-wrap {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	flex: 1;
	min-width: 0;
	margin-left: 24rpx;
}

.order-detail-info__value {
	font-size: 26rpx;
	color: #1a1b1d;
	line-height: 1.4;
	text-align: right;
	word-break: break-all;
}

.order-detail-info__copy {
	flex: none;
	margin-left: 16rpx;
	font-size: 24rpx;
	color: #143080;
	line-height: 1.2;
}
</style>
