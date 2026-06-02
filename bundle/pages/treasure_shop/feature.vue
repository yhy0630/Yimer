<template>
	<view class="treasure-shop-feature-page">
		<view class="treasure-shop-feature-page__nav" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="page-shell flex col-center treasure-shop-feature-page__nav-inner">
				<view class="treasure-shop-feature-page__back" @tap="goBack">
					<u-icon name="arrow-left" size="42" color="#111111"></u-icon>
				</view>
			</view>
		</view>

		<view :style="{ height: `${statusBarHeight + 96}px` }"></view>

		<view class="page-shell treasure-shop-feature-page__body">
			<text class="treasure-shop-feature-page__title block">{{ pageTitle }}</text>

			<view
				v-for="(item, index) in featureList"
				:key="item.id"
				:class="['treasure-shop-feature-card', index !== featureList.length - 1 ? 'is-separated' : '']"
			>
				<image class="treasure-shop-feature-card__image block w-full" :src="item.image" mode="aspectFill"></image>
				<text class="treasure-shop-feature-card__title block">{{ item.title }}</text>
				<text class="treasure-shop-feature-card__subtitle block">{{ item.subtitle }}</text>
			</view>
		</view>
	</view>
</template>

<script>
const DEFAULT_SHOP_ID = 'place-shop-1-0'

const DEFAULT_PAGE = {
	title: '本店特色',
	features: [
		{
			id: 'signature-1',
			title: '招牌三拼巴斯克',
			subtitle: '芝士、果香和轻甜奶感叠在一口里，适合第一次来店里点单。',
			image: '/static/linshi/03.png'
		},
		{
			id: 'signature-2',
			title: '纪念日氛围双人位',
			subtitle: '烛光、小景和近景出片位已经提前留好，约会和庆生都很合适。',
			image: '/static/linshi/01.png'
		}
	]
}

const SHOP_FEATURE_MAP = {
	'place-shop-1-0': {
		title: '本店特色',
		features: [
			{
				id: 'signature-1',
				title: '招牌三拼巴斯克',
				subtitle: '芝士、果香和轻甜奶感叠在一口里，适合第一次来店里点单。',
				image: '/static/linshi/03.png'
			},
			{
				id: 'signature-2',
				title: '纪念日氛围双人位',
				subtitle: '烛光、小景和近景出片位已经提前留好，约会和庆生都很合适。',
				image: '/static/linshi/01.png'
			}
		]
	},
	'place-shop-1-1': {
		title: '本店特色',
		features: [
			{
				id: 'signature-1',
				title: '现烤黄油早午餐盘',
				subtitle: '面包、蛋料理和热饮搭配得很完整，适合慢慢吃完一个早晨。',
				image: '/static/linshi/04.png'
			},
			{
				id: 'signature-2',
				title: '靠窗晨光座位',
				subtitle: '自然光很柔和，适合聊天、看书，也很适合顺手拍几张日常感照片。',
				image: '/static/linshi/05.png'
			}
		]
	},
	'place-shop-2-0': {
		title: '本店特色',
		features: [
			{
				id: 'signature-1',
				title: '手冲咖啡配轻食',
				subtitle: '咖啡香气偏干净明亮，搭配简餐刚好，不会让人觉得负担太重。',
				image: '/static/linshi/05.png'
			},
			{
				id: 'signature-2',
				title: '雨天也舒服的安静角落',
				subtitle: '店里保留了更松弛的停留节奏，想一个人待着或者轻声聊天都舒服。',
				image: '/static/linshi/03.png'
			}
		]
	},
	'place-shop-2-1': {
		title: '本店特色',
		features: [
			{
				id: 'signature-1',
				title: '夜晚微醺特调',
				subtitle: '酒单会跟着季节轻调风味，适合下班后约朋友来慢慢坐一会。',
				image: '/static/linshi/01.png'
			},
			{
				id: 'signature-2',
				title: '适合小聚的暗调氛围',
				subtitle: '灯光压得刚刚好，聊天不会吵，庆祝和约会都能有一点仪式感。',
				image: '/static/linshi/04.png'
			}
		]
	}
}

function getStatusBarHeight() {
	try {
		const { statusBarHeight = 20 } = uni.getSystemInfoSync()
		return statusBarHeight
	} catch (error) {
		return 20
	}
}

function cloneFeaturePage(detail) {
	return JSON.parse(JSON.stringify(detail))
}

function resolveFeaturePage(shopId) {
	return cloneFeaturePage(SHOP_FEATURE_MAP[shopId] || DEFAULT_PAGE)
}

export default {
	data() {
		return {
			statusBarHeight: getStatusBarHeight(),
			pageTitle: DEFAULT_PAGE.title,
			featureList: DEFAULT_PAGE.features
		}
	},
	onLoad(options = {}) {
		const page = resolveFeaturePage(options.shopId || DEFAULT_SHOP_ID)
		this.pageTitle = page.title
		this.featureList = page.features
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
		}
	}
}
</script>

<style scoped lang="scss">
.treasure-shop-feature-page {
	min-height: 100vh;
	background: #ffffff;
}

.treasure-shop-feature-page__nav {
	position: fixed;
	top: 0;
	right: 0;
	left: 0;
	z-index: 10;
	background: rgba(255, 255, 255, 0.96);
}

.treasure-shop-feature-page__nav-inner {
	height: 96rpx;
}

.treasure-shop-feature-page__back {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 72rpx;
	height: 72rpx;
	margin-left: -14rpx;
}

.treasure-shop-feature-page__body {
	padding-top: 48rpx;
	padding-bottom: calc(env(safe-area-inset-bottom) + 56rpx);
}

.treasure-shop-feature-page__title {
	font-size: 72rpx;
	line-height: 1.12;
	font-weight: 500;
	color: #17181c;
}

.treasure-shop-feature-card {
	padding-top: 58rpx;
}

.treasure-shop-feature-card.is-separated {
	padding-bottom: 46rpx;
	border-bottom: 2rpx solid #f0f0f0;
}

.treasure-shop-feature-card__image {
	height: 706rpx;
	background: #eef2f7;
	border-radius: 6rpx;
}

.treasure-shop-feature-card__title {
	margin-top: 40rpx;
	font-size: 38rpx;
	line-height: 1.28;
	font-weight: 700;
	color: #17181c;
}

.treasure-shop-feature-card__subtitle {
	margin-top: 18rpx;
	font-size: 28rpx;
	line-height: 1.6;
	color: #8a8f99;
}
</style>
