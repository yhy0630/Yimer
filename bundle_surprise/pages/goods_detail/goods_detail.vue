<template>
	<view class="surprise-goods-detail-page">
		<view class="surprise-goods-detail-page__hero">
			<view class="surprise-goods-detail-page__nav" :style="{ paddingTop: `${statusBarHeight}px` }">
				<view class="page-shell surprise-goods-detail-page__nav-inner">
					<view class="surprise-goods-detail-page__nav-button" @tap="goBack">
						<u-icon name="arrow-left" size="46" color="#ffffff"></u-icon>
					</view>
					<view class="surprise-goods-detail-page__nav-button" @tap="shareGoods">
						<u-icon name="share" size="42" color="#ffffff"></u-icon>
					</view>
				</view>
			</view>

			<view class="surprise-goods-detail-page__hero-stage">
				<view class="nomi-scene nomi-scene--hero">
					<view class="nomi-scene__light nomi-scene__light--gold"></view>
					<view class="nomi-scene__light nomi-scene__light--shadow"></view>
					<view class="nomi-scene__stage nomi-scene__stage--top"></view>
					<view class="nomi-scene__stage nomi-scene__stage--base"></view>
					<view class="nomi-scene__stage-shadow"></view>

					<view class="nomi-scene__character">
						<view class="nomi-scene__hat">
							<view class="nomi-scene__hat-bow"></view>
							<view class="nomi-scene__hat-top"></view>
							<view class="nomi-scene__hat-brim"></view>
						</view>

						<view class="nomi-scene__body">
							<text class="nomi-scene__eye nomi-scene__eye--left">0</text>
							<text class="nomi-scene__eye nomi-scene__eye--right">0</text>

							<view class="nomi-scene__flashlight">
								<view class="nomi-scene__flashlight-head"></view>
								<view class="nomi-scene__flashlight-glow"></view>
							</view>
						</view>

						<view class="nomi-scene__magnifier">
							<view class="nomi-scene__magnifier-handle"></view>
						</view>

						<view class="nomi-scene__pipe">
							<view class="nomi-scene__pipe-mouth"></view>
						</view>
					</view>
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
			<view class="surprise-goods-detail-page__story-card">
				<view class="surprise-goods-detail-page__story-thumb">
					<text class="surprise-goods-detail-page__story-brand">nomi</text>
					<view class="surprise-goods-detail-page__story-mini-face">
						<text class="surprise-goods-detail-page__story-mini-eye">0</text>
						<text class="surprise-goods-detail-page__story-mini-eye">0</text>
					</view>
				</view>
				<text class="surprise-goods-detail-page__story-label">{{ detail.cardLabel }}</text>
			</view>

			<view class="nomi-scene nomi-scene--story">
				<view class="nomi-scene__light nomi-scene__light--gold"></view>
				<view class="nomi-scene__light nomi-scene__light--shadow"></view>
				<view class="nomi-scene__stage nomi-scene__stage--top"></view>
				<view class="nomi-scene__stage nomi-scene__stage--base"></view>
				<view class="nomi-scene__stage-shadow"></view>

				<view class="nomi-scene__character">
					<view class="nomi-scene__hat">
						<view class="nomi-scene__hat-bow"></view>
						<view class="nomi-scene__hat-top"></view>
						<view class="nomi-scene__hat-brim"></view>
					</view>

					<view class="nomi-scene__body">
						<text class="nomi-scene__eye nomi-scene__eye--left">0</text>
						<text class="nomi-scene__eye nomi-scene__eye--right">0</text>

						<view class="nomi-scene__flashlight">
							<view class="nomi-scene__flashlight-head"></view>
							<view class="nomi-scene__flashlight-glow"></view>
						</view>
					</view>

					<view class="nomi-scene__magnifier">
						<view class="nomi-scene__magnifier-handle"></view>
					</view>

					<view class="nomi-scene__pipe">
						<view class="nomi-scene__pipe-mouth"></view>
					</view>
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

function normalizeText(value, fallback) {
	const text = String(value || '').trim()
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
		cardLabel: 'NFC智能卡片'
	},
	102: {
		name: '水光亮肤年卡',
		price: 799,
		marketPrice: 7590,
		points: 6990,
		memberTitle: '解锁会员获得会员权益',
		memberAction: '会员解锁',
		cardLabel: '会员权益卡'
	},
	103: {
		name: '补水修护护理',
		price: 699,
		marketPrice: 6990,
		points: 5990,
		memberTitle: '黑金会员',
		memberAction: '会员中心',
		cardLabel: '补水修护卡'
	},
	104: {
		name: '焕亮透白计划',
		price: 899,
		marketPrice: 8990,
		points: 7390,
		memberTitle: '解锁会员获得会员权益',
		memberAction: '会员解锁',
		cardLabel: '焕亮透白卡'
	},
	105: {
		name: '胶原紧致管理',
		price: 999,
		marketPrice: 9990,
		points: 8590,
		memberTitle: '黑金会员',
		memberAction: '会员中心',
		cardLabel: '胶原紧致卡'
	},
	106: {
		name: '面部精修方案',
		price: 1280,
		marketPrice: 12800,
		points: 9990,
		memberTitle: '解锁会员获得会员权益',
		memberAction: '会员解锁',
		cardLabel: '面部精修卡'
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
		cardLabel: base.cardLabel
	}
}

export default {
	data() {
		return {
			statusBarHeight: getStatusBarHeight(),
			detail: createGoodsDetail(),
			source: 'surprise'
		}
	},
	onLoad(options = {}) {
		this.detail = createGoodsDetail(options)
		this.source = normalizeText(options.source, 'surprise')
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
			uni.showToast({
				title: `立即下单 · ${this.detail.name}`,
				icon: 'none'
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
	background: #130e10;
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
	padding: 42rpx 0 56rpx;
	background:
		radial-gradient(circle at 24% 18%, rgba(232, 173, 75, 0.32) 0, rgba(232, 173, 75, 0) 240rpx),
		linear-gradient(180deg, #22140f 0%, #110d10 42%, #0b0a0f 100%);
}

.surprise-goods-detail-page__story-card {
	position: absolute;
	left: 44rpx;
	top: 88rpx;
	z-index: 2;
	width: 118rpx;
}

.surprise-goods-detail-page__story-thumb {
	position: relative;
	height: 154rpx;
	padding: 14rpx 10rpx 10rpx;
	border-radius: 14rpx;
	background:
		linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0) 24%),
		linear-gradient(180deg, #171317 0%, #2a221f 38%, #8a5e42 58%, #23366e 100%);
	box-shadow: 0 14rpx 24rpx rgba(0, 0, 0, 0.18);
	box-sizing: border-box;
}

.surprise-goods-detail-page__story-brand {
	display: block;
	font-size: 28rpx;
	line-height: 1;
	font-weight: 500;
	letter-spacing: 1rpx;
	color: #f4f4f6;
	text-transform: lowercase;
}

.surprise-goods-detail-page__story-mini-face {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 72rpx;
	margin-top: 62rpx;
	padding: 0 4rpx;
}

.surprise-goods-detail-page__story-mini-eye {
	font-size: 34rpx;
	line-height: 1;
	font-weight: 700;
	color: #ffffff;
}

.surprise-goods-detail-page__story-label {
	display: block;
	margin-top: 10rpx;
	font-size: 18rpx;
	line-height: 1.3;
	color: rgba(255, 255, 255, 0.9);
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

.nomi-scene {
	position: relative;
	overflow: hidden;
}

.nomi-scene::before {
	content: '';
	position: absolute;
	inset: 0;
	background:
		repeating-linear-gradient(
			180deg,
			rgba(74, 48, 30, 0.06) 0,
			rgba(74, 48, 30, 0.06) 94rpx,
			rgba(96, 68, 47, 0.58) 94rpx,
			rgba(96, 68, 47, 0.58) 100rpx
		),
		repeating-linear-gradient(
			90deg,
			transparent 0,
			transparent 168rpx,
			rgba(89, 63, 45, 0.48) 168rpx,
			rgba(89, 63, 45, 0.48) 174rpx
		),
		linear-gradient(180deg, rgba(60, 37, 22, 0.84) 0%, rgba(12, 10, 14, 0.98) 44%, rgba(7, 8, 12, 1) 100%);
	opacity: 0.95;
}

.nomi-scene--hero {
	height: 100%;
}

.nomi-scene--story {
	height: 760rpx;
}

.nomi-scene__light {
	position: absolute;
	border-radius: 50%;
	filter: blur(12rpx);
	z-index: 1;
}

.nomi-scene__light--gold {
	left: 78rpx;
	top: 0;
	width: 260rpx;
	height: 520rpx;
	background: linear-gradient(180deg, rgba(230, 168, 66, 0.62) 0%, rgba(230, 168, 66, 0) 100%);
	transform: rotate(8deg);
}

.nomi-scene__light--shadow {
	right: -60rpx;
	top: -20rpx;
	width: 360rpx;
	height: 880rpx;
	background: linear-gradient(180deg, rgba(0, 0, 0, 0.14) 0%, rgba(0, 0, 0, 0.5) 36%, rgba(0, 0, 0, 0.82) 100%);
	transform: rotate(10deg);
}

.nomi-scene__stage,
.nomi-scene__stage-shadow {
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	z-index: 1;
}

.nomi-scene__stage--top {
	bottom: 48rpx;
	width: 660rpx;
	height: 158rpx;
	border-radius: 50%;
	background: radial-gradient(circle at 50% 40%, rgba(90, 101, 132, 0.44) 0%, rgba(29, 35, 54, 0.9) 72%, rgba(13, 14, 22, 0.98) 100%);
}

.nomi-scene__stage--base {
	bottom: 18rpx;
	width: 760rpx;
	height: 54rpx;
	border-radius: 50%;
	background: linear-gradient(180deg, rgba(38, 43, 62, 0.96) 0%, rgba(14, 16, 25, 1) 100%);
	filter: blur(1rpx);
}

.nomi-scene__stage-shadow {
	bottom: 100rpx;
	width: 520rpx;
	height: 88rpx;
	border-radius: 50%;
	background: rgba(0, 0, 0, 0.42);
	filter: blur(8rpx);
}

.nomi-scene__character {
	position: absolute;
	left: 50%;
	bottom: 108rpx;
	width: 470rpx;
	height: 472rpx;
	transform: translateX(-50%);
	z-index: 2;
}

.nomi-scene--story .nomi-scene__character {
	width: 506rpx;
	height: 510rpx;
	bottom: 70rpx;
}

.nomi-scene__hat {
	position: absolute;
	left: 64rpx;
	top: 0;
	width: 340rpx;
	height: 188rpx;
}

.nomi-scene__hat-top {
	position: absolute;
	left: 24rpx;
	top: 20rpx;
	width: 292rpx;
	height: 144rpx;
	border: 6rpx solid rgba(181, 125, 96, 0.88);
	border-bottom: none;
	border-radius: 170rpx 170rpx 26rpx 26rpx;
	background:
		repeating-linear-gradient(
			90deg,
			rgba(235, 212, 196, 0.18) 0,
			rgba(235, 212, 196, 0.18) 6rpx,
			rgba(171, 139, 119, 0.2) 6rpx,
			rgba(171, 139, 119, 0.2) 11rpx
		),
		linear-gradient(180deg, #b99a8d 0%, #967567 100%);
	box-sizing: border-box;
}

.nomi-scene__hat-brim {
	position: absolute;
	left: 0;
	bottom: 0;
	width: 340rpx;
	height: 56rpx;
	border-radius: 28rpx 28rpx 80rpx 80rpx;
	background: linear-gradient(180deg, #cd9d7f 0%, #a6785b 100%);
	box-shadow: inset 0 6rpx 10rpx rgba(255, 255, 255, 0.18);
}

.nomi-scene__hat-bow {
	position: absolute;
	left: 144rpx;
	top: 0;
	width: 52rpx;
	height: 18rpx;
	border-radius: 999rpx;
	background: linear-gradient(180deg, #c59679 0%, #a97a5c 100%);
}

.nomi-scene__hat-bow::before,
.nomi-scene__hat-bow::after {
	content: '';
	position: absolute;
	top: -6rpx;
	width: 28rpx;
	height: 20rpx;
	border: 4rpx solid #c59679;
	border-radius: 999rpx 999rpx 0 999rpx;
	box-sizing: border-box;
}

.nomi-scene__hat-bow::before {
	left: -18rpx;
	transform: rotate(-22deg);
}

.nomi-scene__hat-bow::after {
	right: -18rpx;
	border-radius: 999rpx 999rpx 999rpx 0;
	transform: rotate(22deg);
}

.nomi-scene__body {
	position: absolute;
	left: 86rpx;
	top: 126rpx;
	width: 298rpx;
	height: 298rpx;
	border-radius: 50%;
	background: radial-gradient(circle at 42% 30%, rgba(46, 52, 72, 0.2) 0%, rgba(3, 5, 8, 0.8) 34%, #000000 68%);
	box-shadow:
		inset -18rpx -24rpx 34rpx rgba(255, 255, 255, 0.06),
		0 24rpx 32rpx rgba(0, 0, 0, 0.32);
}

.nomi-scene__eye {
	position: absolute;
	top: 84rpx;
	font-size: 84rpx;
	line-height: 1;
	font-weight: 700;
	color: #ffffff;
	text-shadow: 0 0 10rpx rgba(255, 255, 255, 0.24);
}

.nomi-scene__eye--left {
	left: 86rpx;
}

.nomi-scene__eye--right {
	right: 82rpx;
}

.nomi-scene__flashlight {
	position: absolute;
	left: 102rpx;
	bottom: 54rpx;
	width: 118rpx;
	height: 56rpx;
}

.nomi-scene__flashlight-head {
	position: absolute;
	left: 0;
	top: 12rpx;
	width: 66rpx;
	height: 32rpx;
	border: 6rpx solid #ffffff;
	border-radius: 10rpx;
	box-sizing: border-box;
}

.nomi-scene__flashlight-head::after {
	content: '';
	position: absolute;
	right: -22rpx;
	top: -6rpx;
	width: 18rpx;
	height: 42rpx;
	border: 6rpx solid #ffffff;
	border-left: none;
	border-radius: 0 8rpx 8rpx 0;
	box-sizing: border-box;
}

.nomi-scene__flashlight-glow {
	position: absolute;
	left: 56rpx;
	top: 14rpx;
	width: 124rpx;
	height: 52rpx;
	background: radial-gradient(circle at left center, rgba(255, 223, 75, 0.88) 0%, rgba(255, 223, 75, 0.46) 36%, rgba(255, 223, 75, 0) 78%);
	filter: blur(3rpx);
}

.nomi-scene__magnifier {
	position: absolute;
	left: 20rpx;
	top: 166rpx;
	width: 140rpx;
	height: 140rpx;
	border: 10rpx solid #b19a43;
	border-radius: 50%;
	box-shadow:
		inset 0 0 0 10rpx rgba(238, 211, 111, 0.22),
		0 10rpx 20rpx rgba(0, 0, 0, 0.22);
	box-sizing: border-box;
}

.nomi-scene__magnifier-handle {
	position: absolute;
	left: -44rpx;
	top: 70rpx;
	width: 70rpx;
	height: 18rpx;
	border-radius: 999rpx;
	background: linear-gradient(180deg, #b98a63 0%, #936244 100%);
	transform: rotate(-4deg);
}

.nomi-scene__magnifier-handle::after {
	content: '';
	position: absolute;
	left: -16rpx;
	top: -2rpx;
	width: 18rpx;
	height: 22rpx;
	border-radius: 10rpx;
	background: linear-gradient(180deg, #a87554 0%, #875537 100%);
}

.nomi-scene__pipe {
	position: absolute;
	right: 18rpx;
	top: 230rpx;
	width: 120rpx;
	height: 76rpx;
	border: 8rpx solid rgba(122, 117, 88, 0.8);
	border-left: none;
	border-bottom: none;
	border-radius: 0 72rpx 0 0;
	transform: rotate(6deg);
	box-sizing: border-box;
}

.nomi-scene__pipe-mouth {
	position: absolute;
	right: -14rpx;
	top: 36rpx;
	width: 56rpx;
	height: 94rpx;
	border-radius: 36rpx 36rpx 42rpx 42rpx;
	background: linear-gradient(180deg, #8a8164 0%, #575343 100%);
	transform: rotate(14deg);
	box-shadow: inset 0 6rpx 10rpx rgba(255, 255, 255, 0.08);
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
