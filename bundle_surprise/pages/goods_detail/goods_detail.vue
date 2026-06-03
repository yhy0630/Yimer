<template>
	<view class="surprise-goods-detail-page">
		<view class="surprise-goods-detail-page__hero">
			<view class="surprise-goods-detail-page__nav" :style="{ paddingTop: `${statusBarHeight}px` }">
				<view class="page-shell surprise-goods-detail-page__nav-inner">
					<view class="surprise-goods-detail-page__nav-button" @tap="goBack">
						<u-icon name="arrow-left" size="46" color="#143080"></u-icon>
					</view>
					<view class="surprise-goods-detail-page__nav-button" @tap="shareGoods">
						<u-icon name="share" size="42" color="#143080"></u-icon>
					</view>
				</view>
			</view>

			<view class="surprise-goods-detail-page__hero-stage">
				<swiper
					class="surprise-goods-detail-page__hero-swiper"
					circular
					autoplay
					interval="3200"
					duration="380"
					@change="handleHeroChange"
				>
					<swiper-item v-for="(image, index) in detail.gallery" :key="`${detail.id}-gallery-${index}`">
						<view class="surprise-goods-detail-page__hero-slide">
							<image class="surprise-goods-detail-page__hero-image" :src="image" mode="aspectFit"></image>
						</view>
					</swiper-item>
				</swiper>

				<view v-if="detail.gallery.length" class="surprise-goods-detail-page__hero-indicator">
					{{ galleryCurrent + 1 }}/{{ detail.gallery.length }}
				</view>
			</view>
		</view>

		<view class="surprise-goods-detail-page__panel">
			<view class="surprise-goods-detail-page__member-banner" @tap="openMemberAction">
				<text class="surprise-goods-detail-page__member-title">{{ detail.memberTitle }}</text>
				<view class="surprise-goods-detail-page__member-action">
					<text class="surprise-goods-detail-page__member-action-text">{{ detail.memberAction }}</text>
					<u-icon name="arrow-right" size="24" color="#8d93a3"></u-icon>
				</view>
			</view>

			<view class="page-shell surprise-goods-detail-page__info">
				<view class="surprise-goods-detail-page__title-row">
					<text class="surprise-goods-detail-page__title">{{ detail.name }}</text>
					<text class="surprise-goods-detail-page__share-text" @tap="shareGoods">分享</text>
				</view>

				<view class="surprise-goods-detail-page__price-row">
					<view class="surprise-goods-detail-page__price-wrap">
						<text class="surprise-goods-detail-page__currency">¥</text>
						<text class="surprise-goods-detail-page__price">{{ detail.price }}</text>
						<text class="surprise-goods-detail-page__market-price line-through">¥ {{ detail.marketPrice }}</text>
					</view>

					<view class="surprise-goods-detail-page__points">
						<view class="surprise-goods-detail-page__points-icon"></view>
						<text class="surprise-goods-detail-page__points-value">{{ detail.points }}</text>
					</view>
				</view>

				<view class="surprise-goods-detail-page__divider"></view>
				<text class="surprise-goods-detail-page__section-title">商品介绍</text>
			</view>
		</view>

		<view class="surprise-goods-detail-page__story">
			<view class="page-shell">
				<view class="surprise-goods-detail-page__intro-card">
					<text class="surprise-goods-detail-page__intro-title">{{ detail.cardLabel }}</text>
					<text class="surprise-goods-detail-page__intro-subtitle">精选项目实拍与品牌视觉展示</text>
				</view>

				<view class="surprise-goods-detail-page__intro-gallery">
					<image
						v-for="(image, index) in detail.introImages"
						:key="`${detail.id}-intro-${index}`"
						class="surprise-goods-detail-page__intro-image"
						:src="image"
						mode="widthFix"
					></image>
				</view>
			</view>
		</view>

		<view class="surprise-goods-detail-page__footer">
			<button class="surprise-goods-detail-page__footer-button surprise-goods-detail-page__footer-button--ghost" hover-class="none" @tap="addToCart">
				加入购物车
			</button>
			<button class="surprise-goods-detail-page__footer-button surprise-goods-detail-page__footer-button--primary" hover-class="none" @tap="buyNow">
				立即下单
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

function decodeQueryText(value) {
	const text = String(value || '').trim()

	if (!text) {
		return ''
	}

	try {
		return decodeURIComponent(text)
	} catch (error) {
		return text
	}
}

function normalizeText(value, fallback) {
	const text = decodeQueryText(value)
	return text || fallback
}

function normalizeNumber(value, fallback) {
	const number = Number(value)
	return Number.isFinite(number) && number > 0 ? number : fallback
}

const GOODS_DETAIL_MAP = {
	101: {
		name: 'NOMI智能头饰套装',
		price: 199,
		marketPrice: 199,
		points: 6990,
		memberTitle: '黑金会员',
		memberAction: '会员中心',
		cardLabel: 'NFC智能卡片',
		gallery: ['/static/linshi/01.png', '/static/linshi/07.png', '/static/linshi/04.png'],
		introImages: ['/static/linshi/03.png', '/static/linshi/06.png']
	},
	102: {
		name: '水光亮肤年卡',
		price: 799,
		marketPrice: 7590,
		points: 6990,
		memberTitle: '解锁会员获得会员权益',
		memberAction: '会员解锁',
		cardLabel: '会员权益卡',
		gallery: ['/static/linshi/07.png', '/static/linshi/02.png', '/static/linshi/01.png'],
		introImages: ['/static/linshi/03.png', '/static/linshi/06.png']
	},
	103: {
		name: '补水修护护理',
		price: 699,
		marketPrice: 6990,
		points: 5990,
		memberTitle: '黑金会员',
		memberAction: '会员中心',
		cardLabel: '补水修护卡',
		gallery: ['/static/linshi/01.png', '/static/linshi/04.png', '/static/linshi/07.png'],
		introImages: ['/static/linshi/03.png', '/static/linshi/06.png']
	},
	104: {
		name: '焕亮透白计划',
		price: 899,
		marketPrice: 8990,
		points: 7390,
		memberTitle: '解锁会员获得会员权益',
		memberAction: '会员解锁',
		cardLabel: '焕亮透白卡',
		gallery: ['/static/linshi/07.png', '/static/linshi/01.png', '/static/linshi/04.png'],
		introImages: ['/static/linshi/03.png', '/static/linshi/06.png']
	},
	105: {
		name: '胶原紧致管理',
		price: 999,
		marketPrice: 9990,
		points: 8590,
		memberTitle: '黑金会员',
		memberAction: '会员中心',
		cardLabel: '胶原紧致卡',
		gallery: ['/static/linshi/05.png', '/static/linshi/01.png', '/static/linshi/04.png'],
		introImages: ['/static/linshi/03.png', '/static/linshi/06.png']
	},
	106: {
		name: '面部精修方案',
		price: 1280,
		marketPrice: 12800,
		points: 9990,
		memberTitle: '解锁会员获得会员权益',
		memberAction: '会员解锁',
		cardLabel: '面部精修卡',
		gallery: ['/static/linshi/02.png', '/static/linshi/04.png', '/static/linshi/01.png'],
		introImages: ['/static/linshi/03.png', '/static/linshi/06.png']
	}
}

function createGoodsDetail(options = {}) {
	const id = normalizeNumber(options.id, 101)
	const base = GOODS_DETAIL_MAP[id] || GOODS_DETAIL_MAP[101]

	return {
		id,
		name: normalizeText(options.name, base.name),
		price: normalizeNumber(options.price, base.price),
		marketPrice: normalizeNumber(options.marketPrice, base.marketPrice),
		points: normalizeNumber(options.points, base.points),
		memberTitle: base.memberTitle,
		memberAction: base.memberAction,
		cardLabel: base.cardLabel,
		gallery: base.gallery || [],
		introImages: base.introImages || []
	}
}

export default {
	data() {
		return {
			statusBarHeight: getStatusBarHeight(),
			detail: createGoodsDetail(),
			source: 'surprise',
			galleryCurrent: 0
		}
	},
	onLoad(options = {}) {
		this.detail = createGoodsDetail(options)
		this.source = normalizeText(options.source, 'surprise')
		this.galleryCurrent = 0
	},
	methods: {
		handleHeroChange(event) {
			this.galleryCurrent = event.detail.current || 0
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
				url: '/pages/surprise/surprise'
			})
		},
		shareGoods() {
			uni.showToast({
				title: '分享功能开发中',
				icon: 'none'
			})
		},
		openMemberAction() {
			uni.showToast({
				title: this.detail.memberAction,
				icon: 'none'
			})
		},
		addToCart() {
			uni.showToast({
				title: `${this.detail.name}已加入购物车`,
				icon: 'none'
			})
		},
		buyNow() {
			uni.navigateTo({
				url: `/bundle_surprise/pages/checkout/checkout?id=${this.detail.id}&name=${encodeURIComponent(this.detail.name || '')}&price=${this.detail.price || ''}&points=${this.detail.points || ''}`
			})
		}
	}
}
</script>

<style scoped lang="scss">
.surprise-goods-detail-page {
	min-height: 100vh;
	padding-bottom: calc(188rpx + env(safe-area-inset-bottom));
	background: #f5f6fa;
}

.surprise-goods-detail-page__hero {
	position: relative;
	background: linear-gradient(180deg, #edf4ff 0%, #f8fbff 100%);
}

.surprise-goods-detail-page__nav {
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	z-index: 3;
}

.surprise-goods-detail-page__nav-inner {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 92rpx;
}

.surprise-goods-detail-page__nav-button {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 72rpx;
	height: 72rpx;
}

.surprise-goods-detail-page__hero-stage {
	position: relative;
	height: 736rpx;
}

.surprise-goods-detail-page__hero-swiper {
	height: 100%;
}

.surprise-goods-detail-page__hero-slide {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	padding: 120rpx 44rpx 48rpx;
	box-sizing: border-box;
}

.surprise-goods-detail-page__hero-image {
	display: block;
	width: 100%;
	height: 100%;
	border-radius: 36rpx;
	background: rgba(255, 255, 255, 0.76);
	box-shadow: 0 18rpx 40rpx rgba(20, 48, 128, 0.1);
}

.surprise-goods-detail-page__hero-indicator {
	position: absolute;
	right: 44rpx;
	bottom: 34rpx;
	z-index: 2;
	min-width: 88rpx;
	padding: 10rpx 20rpx;
	border-radius: 999rpx;
	background: rgba(17, 32, 74, 0.52);
	font-size: 22rpx;
	line-height: 1;
	color: #ffffff;
	text-align: center;
	box-sizing: border-box;
}

.surprise-goods-detail-page__panel {
	position: relative;
	margin-top: -8rpx;
	border-radius: 28rpx 28rpx 0 0;
	background: #ffffff;
	overflow: hidden;
}

.surprise-goods-detail-page__member-banner {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 92rpx;
	padding: 0 44rpx;
	background: #eef2fb;
}

.surprise-goods-detail-page__member-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #143080;
}

.surprise-goods-detail-page__member-action {
	display: flex;
	align-items: center;
}

.surprise-goods-detail-page__member-action-text {
	font-size: 24rpx;
	color: #8d93a3;
}

.surprise-goods-detail-page__info {
	padding-top: 44rpx;
	padding-bottom: 46rpx;
	background: #ffffff;
}

.surprise-goods-detail-page__title-row {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
}

.surprise-goods-detail-page__title {
	flex: 1;
	min-width: 0;
	padding-right: 24rpx;
	font-size: 42rpx;
	line-height: 1.28;
	font-weight: 600;
	color: #202227;
}

.surprise-goods-detail-page__share-text {
	flex: none;
	padding-top: 12rpx;
	font-size: 26rpx;
	color: #8d93a3;
}

.surprise-goods-detail-page__price-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 30rpx;
}

.surprise-goods-detail-page__price-wrap,
.surprise-goods-detail-page__points {
	display: flex;
	align-items: baseline;
}

.surprise-goods-detail-page__currency {
	margin-right: 8rpx;
	font-size: 32rpx;
	line-height: 1;
	font-weight: 600;
	color: #1f2229;
}

.surprise-goods-detail-page__price {
	font-size: 58rpx;
	line-height: 1;
	font-weight: 700;
	color: #1f2229;
}

.surprise-goods-detail-page__market-price {
	margin-left: 12rpx;
	font-size: 24rpx;
	line-height: 1;
	color: #9a9eaa;
}

.surprise-goods-detail-page__points {
	flex: none;
}

.surprise-goods-detail-page__points-icon {
	position: relative;
	width: 32rpx;
	height: 20rpx;
	margin-right: 14rpx;
	border: 2rpx solid #1f2229;
	border-radius: 999rpx;
	box-sizing: border-box;
}

.surprise-goods-detail-page__points-icon::before,
.surprise-goods-detail-page__points-icon::after {
	content: '';
	position: absolute;
	left: -2rpx;
	width: 32rpx;
	height: 20rpx;
	border: 2rpx solid #1f2229;
	border-radius: 999rpx;
	box-sizing: border-box;
	background: #ffffff;
}

.surprise-goods-detail-page__points-icon::before {
	top: -8rpx;
}

.surprise-goods-detail-page__points-icon::after {
	top: 8rpx;
}

.surprise-goods-detail-page__points-value {
	font-size: 30rpx;
	line-height: 1;
	font-weight: 600;
	color: #1f2229;
}

.surprise-goods-detail-page__divider {
	height: 2rpx;
	margin-top: 48rpx;
	background: #edf0f4;
}

.surprise-goods-detail-page__section-title {
	display: block;
	margin-top: 38rpx;
	font-size: 34rpx;
	line-height: 1;
	font-weight: 600;
	color: #1f2229;
}

.surprise-goods-detail-page__story {
	position: relative;
	padding: 22rpx 0 56rpx;
	background: #f5f6fa;
}

.surprise-goods-detail-page__intro-card {
	margin-bottom: 24rpx;
	padding: 28rpx 30rpx;
	border-radius: 24rpx;
	background: linear-gradient(135deg, #ffffff 0%, #eef4ff 100%);
	box-shadow: 0 12rpx 28rpx rgba(20, 48, 128, 0.06);
}

.surprise-goods-detail-page__intro-title {
	display: block;
	font-size: 30rpx;
	line-height: 1.2;
	font-weight: 600;
	color: #1f2229;
}

.surprise-goods-detail-page__intro-subtitle {
	display: block;
	margin-top: 12rpx;
	font-size: 24rpx;
	line-height: 1.5;
	color: #7f8595;
}

.surprise-goods-detail-page__intro-gallery {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}

.surprise-goods-detail-page__intro-image {
	display: block;
	width: 100%;
	border-radius: 24rpx;
	background: #e9eef8;
	box-shadow: 0 12rpx 28rpx rgba(18, 33, 72, 0.08);
}

.surprise-goods-detail-page__footer {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 6;
	display: flex;
	align-items: center;
	padding: 24rpx 44rpx calc(24rpx + env(safe-area-inset-bottom));
	background: rgba(255, 255, 255, 0.98);
	box-shadow: 0 -10rpx 24rpx rgba(10, 18, 38, 0.08);
}

.surprise-goods-detail-page__footer-button {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 78rpx;
	border-radius: 999rpx;
	font-size: 28rpx;
}

.surprise-goods-detail-page__footer-button + .surprise-goods-detail-page__footer-button {
	margin-left: 20rpx;
}

.surprise-goods-detail-page__footer-button--ghost {
	flex: 0 0 322rpx;
	color: #143080;
	border: 2rpx solid #143080;
	background: #ffffff;
}

.surprise-goods-detail-page__footer-button--primary {
	flex: 1;
	color: #ffffff;
	background: #143080;
}

@media screen and (max-width: 360px) {
	.surprise-goods-detail-page__title {
		font-size: 38rpx;
	}

	.surprise-goods-detail-page__footer {
		padding-left: 30rpx;
		padding-right: 30rpx;
	}

	.surprise-goods-detail-page__footer-button--ghost {
		flex-basis: 280rpx;
	}
}
</style>
