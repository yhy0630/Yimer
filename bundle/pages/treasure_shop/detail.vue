<template>
	<view class="treasure-shop-detail-page">
		<view class="treasure-shop-detail-map">
			<view class="treasure-shop-detail-page__nav" :style="{ paddingTop: `${statusBarHeight}px` }">
				<view class="page-shell flex col-center treasure-shop-detail-page__nav-inner">
					<view class="treasure-shop-detail-page__back" @tap="goBack">
						<u-icon name="arrow-left" size="42" color="#111111"></u-icon>
					</view>
				</view>
			</view>

			<view class="treasure-shop-detail-map__shape treasure-shop-detail-map__shape--a"></view>
			<view class="treasure-shop-detail-map__shape treasure-shop-detail-map__shape--b"></view>
			<view class="treasure-shop-detail-map__shape treasure-shop-detail-map__shape--c"></view>
			<view class="treasure-shop-detail-map__road treasure-shop-detail-map__road--main"></view>
			<view class="treasure-shop-detail-map__road treasure-shop-detail-map__road--cross"></view>

			<view
				v-for="poi in detail.mapPois"
				:key="poi.name"
				class="treasure-shop-detail-map__poi flex col-center"
				:style="{ top: poi.top, left: poi.left }"
			>
				<text class="treasure-shop-detail-map__poi-dot"></text>
				<text class="treasure-shop-detail-map__poi-text xxs">{{ poi.name }}</text>
			</view>

			<view class="treasure-shop-detail-map__focus flex-col col-center">
				<image class="treasure-shop-detail-map__focus-avatar br-circle" :src="detail.host.avatar" mode="aspectFill"></image>
				<text class="treasure-shop-detail-map__focus-title block text-center semibold">{{ detail.mapTitle }}</text>
				<text class="treasure-shop-detail-map__focus-subtitle block nr text-center">{{ detail.mapSubtitle }}</text>
			</view>
		</view>

		<image class="treasure-shop-detail-page__hero block w-full" :src="detail.heroImage" mode="widthFix"></image>

		<view class="page-shell treasure-shop-detail-page__body">
			<view class="treasure-shop-host-card flex col-top">
				<image class="treasure-shop-host-card__avatar flex-none br-circle bg-soft-avatar" :src="detail.host.avatar" mode="aspectFill"></image>

				<view class="treasure-shop-host-card__body flex-1">
					<text class="treasure-shop-host-card__greeting block black">{{ detail.host.greeting }}</text>
					<text class="treasure-shop-host-card__name block black">{{ detail.host.name }}</text>

					<view class="treasure-shop-host-card__badges flex flex-wrap">
						<text
							v-for="badge in detail.badges"
							:key="badge"
							class="treasure-shop-host-card__badge xxs lh-1"
						>
							{{ badge }}
						</text>
					</view>
				</view>
			</view>

			<view class="treasure-shop-story-card">
				<text class="treasure-shop-story-card__title block black bold">{{ detail.storyTitle }}</text>
				<text class="treasure-shop-story-card__desc block nr">{{ detail.storyDescription }}</text>
			</view>

			<view class="treasure-shop-section-head flex row-between col-center" @tap="openFeaturePage">
				<text class="treasure-shop-section-head__title black bold">{{ ui.featureTitle }}</text>
				<u-icon name="arrow-right" size="24" color="#161616"></u-icon>
			</view>

			<image
				class="treasure-shop-feature-poster block w-full"
				:src="detail.featurePoster"
				mode="widthFix"
				@tap="openFeaturePage"
			></image>

			<view class="treasure-shop-info-section">
				<text class="treasure-shop-info-section__title block black bold">{{ ui.infoTitle }}</text>

				<view class="treasure-shop-info-card flex row-between col-center" @tap="handleOpenMap">
					<text class="treasure-shop-info-card__address flex-1 nr">{{ detail.address }}</text>

					<view class="treasure-shop-info-card__action flex-col col-center row-center flex-none">
						<u-icon name="map" size="30" color="#2f3542"></u-icon>
						<text class="treasure-shop-info-card__action-text xxs lh-1">{{ ui.navigateLabel }}</text>
					</view>
				</view>

				<view class="treasure-shop-info-row">
					<text class="treasure-shop-info-row__label block xl black">{{ ui.businessLabel }}</text>
					<text class="treasure-shop-info-row__value block nr">{{ detail.businessHours }}</text>
				</view>

				<view class="treasure-shop-info-row treasure-shop-info-row--phone flex row-between col-center">
					<view class="treasure-shop-info-row__main flex-1">
						<text class="treasure-shop-info-row__label block xl black">{{ ui.phoneLabel }}</text>
						<text class="treasure-shop-info-row__value block nr">{{ detail.phone }}</text>
					</view>

					<view class="treasure-shop-info-row__call flex row-center col-center br-circle bg-white" @tap.stop="handlePhoneCall">
						<u-icon name="phone" size="28" color="#2f3542"></u-icon>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
const UI_TEXT = {
	featureTitle: '给大家介绍本店特色',
	infoTitle: '看看本店信息',
	navigateLabel: '导航',
	businessLabel: '营业信息',
	phoneLabel: '店铺电话'
}

const DEFAULT_SHOP_ID = 'place-shop-1-0'

const SHOP_DETAIL_MAP = {
	'place-shop-1-0': {
		mapTitle: '三与叁山生日蛋糕',
		mapSubtitle: '糕点·甜品·下午茶',
		heroImage: '/static/linshi/05.png',
		featurePoster: '/static/linshi/01.png',
		host: {
			avatar: '/static/linshi/02.png',
			greeting: 'Hi~',
			name: '我是大冠先生'
		},
		badges: ['2026最佳宝藏小店', '2026最佳宝藏小店'],
		storyTitle: 'Buscoco杏子小食堂',
		storyDescription:
			'“感谢各位伊美尔闺蜜的支持，欢迎联系客服领取优惠福利，微信搜索 Buscoco 杏子小食堂小程序预约下单。”',
		address: '北京市朝阳区光华路9号光华路SOHO2期F8层',
		businessHours: '每天 9:00-22:00',
		phone: '13260081522',
		mapPois: [
			{ name: '扶摇湘院·小院', top: '66rpx', left: '390rpx' },
			{ name: '云和小笼包', top: '118rpx', left: '438rpx' },
			{ name: '瓜果蔬菜', top: '398rpx', left: '420rpx' },
			{ name: '鲜乐够', top: '560rpx', left: '176rpx' },
			{ name: '光辉五金建材', top: '596rpx', left: '520rpx' }
		]
	},
	'place-shop-1-1': {
		mapTitle: '林间晨食',
		mapSubtitle: '早午餐·手作烘焙',
		heroImage: '/static/linshi/04.png',
		featurePoster: '/static/linshi/03.png',
		host: {
			avatar: '/static/linshi/01.png',
			greeting: '早安呀~',
			name: '我是晨食主理人'
		},
		badges: ['2026朝阳精选店', '附近人气早午餐'],
		storyTitle: '林间晨食 Brunch Lab',
		storyDescription:
			'“小店主打轻负担早午餐和现场烘焙，想把一天里最松弛的一顿饭，认真做好给每位到店的朋友。”',
		address: '北京市朝阳区光华路11号院3号楼2层',
		businessHours: '每天 7:30-18:30',
		phone: '13260080001',
		mapPois: [
			{ name: '晨光花店', top: '84rpx', left: '402rpx' },
			{ name: '慢慢咖啡', top: '164rpx', left: '468rpx' },
			{ name: '果蔬集市', top: '420rpx', left: '404rpx' },
			{ name: '书与面包', top: '544rpx', left: '164rpx' },
			{ name: '木作实验室', top: '610rpx', left: '498rpx' }
		]
	},
	'place-shop-2-0': {
		mapTitle: '雨后小馆',
		mapSubtitle: '咖啡简餐·城市慢食',
		heroImage: '/static/linshi/03.png',
		featurePoster: '/static/linshi/05.png',
		host: {
			avatar: '/static/linshi/02.png',
			greeting: '欢迎来坐坐',
			name: '我是阿雨'
		},
		badges: ['2026国贸人气店', '适合约会的小馆'],
		storyTitle: '雨后小馆 Rainy Table',
		storyDescription:
			'“雨后的小馆想提供一顿舒服的饭、一杯温热的咖啡，还有能让人愿意多停留一会儿的聊天角落。”',
		address: '北京市朝阳区建国门外大街8号国贸商城北区3层',
		businessHours: '每天 9:00-21:00',
		phone: '13260080002',
		mapPois: [
			{ name: '花艺工作室', top: '72rpx', left: '414rpx' },
			{ name: '云朵吐司', top: '132rpx', left: '462rpx' },
			{ name: '轻食便利', top: '404rpx', left: '426rpx' },
			{ name: '手作甜品屋', top: '572rpx', left: '150rpx' },
			{ name: '家居买手店', top: '622rpx', left: '514rpx' }
		]
	},
	'place-shop-2-1': {
		mapTitle: '桥边晚风',
		mapSubtitle: '轻食酒馆·夜间小聚',
		heroImage: '/static/linshi/01.png',
		featurePoster: '/static/linshi/04.png',
		host: {
			avatar: '/static/linshi/01.png',
			greeting: '晚上见呀',
			name: '我是晚风主理人'
		},
		badges: ['2026夜生活推荐', '小聚氛围感门店'],
		storyTitle: '桥边晚风 Afterglow Bar',
		storyDescription:
			'“从傍晚到深夜，我们准备了轻食、特调和舒服的灯光，希望每次见面都能慢下来，多聊一会。”',
		address: '北京市朝阳区建国门外大街12号1层101',
		businessHours: '每天 11:00-23:00',
		phone: '13260080003',
		mapPois: [
			{ name: '拾光花束', top: '78rpx', left: '408rpx' },
			{ name: '和风小馆', top: '148rpx', left: '466rpx' },
			{ name: '夜猫便利', top: '420rpx', left: '412rpx' },
			{ name: '桥边书店', top: '584rpx', left: '168rpx' },
			{ name: '玻璃器皿屋', top: '620rpx', left: '508rpx' }
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

function cloneDetail(detail) {
	return JSON.parse(JSON.stringify(detail))
}

function resolveShopDetail(shopId) {
	return cloneDetail(SHOP_DETAIL_MAP[shopId] || SHOP_DETAIL_MAP[DEFAULT_SHOP_ID])
}

export default {
	data() {
		return {
			ui: UI_TEXT,
			statusBarHeight: getStatusBarHeight(),
			shopId: DEFAULT_SHOP_ID,
			detail: resolveShopDetail(DEFAULT_SHOP_ID)
		}
	},
	onLoad(options = {}) {
		this.shopId = options.shopId || DEFAULT_SHOP_ID
		this.detail = resolveShopDetail(this.shopId)
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
		handleOpenMap() {
			uni.showToast({
				title: '导航功能开发中',
				icon: 'none'
			})
		},
		openFeaturePage() {
			uni.navigateTo({
				url: `/bundle/pages/treasure_shop/feature?shopId=${encodeURIComponent(this.shopId)}`
			})
		},
		handlePhoneCall() {
			if (!this.detail.phone) {
				return
			}

			uni.makePhoneCall({
				phoneNumber: this.detail.phone,
				fail: () => {
					uni.showToast({
						title: this.detail.phone,
						icon: 'none'
					})
				}
			})
		}
	}
}
</script>

<style scoped lang="scss">
.treasure-shop-detail-page {
	min-height: 100vh;
	background: #ffffff;
}

.treasure-shop-detail-map {
	position: relative;
	height: 920rpx;
	overflow: hidden;
	background:
		linear-gradient(180deg, #edf3fb 0%, #f8fafc 100%);
}

.treasure-shop-detail-page__nav {
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	z-index: 8;
}

.treasure-shop-detail-page__nav-inner {
	height: 96rpx;
}

.treasure-shop-detail-page__back {
	width: 72rpx;
	height: 72rpx;
	margin-left: -14rpx;
}

.treasure-shop-detail-map__shape {
	position: absolute;
	border-radius: 42rpx;
	background: rgba(223, 228, 238, 0.92);
}

.treasure-shop-detail-map__shape--a {
	left: 28rpx;
	top: 118rpx;
	width: 320rpx;
	height: 250rpx;
	transform: rotate(-12deg);
}

.treasure-shop-detail-map__shape--b {
	left: 180rpx;
	top: 238rpx;
	width: 332rpx;
	height: 284rpx;
	transform: rotate(16deg);
}

.treasure-shop-detail-map__shape--c {
	left: 86rpx;
	top: 516rpx;
	width: 486rpx;
	height: 218rpx;
	transform: rotate(-8deg);
}

.treasure-shop-detail-map__road {
	position: absolute;
	background: rgba(207, 217, 233, 0.95);
}

.treasure-shop-detail-map__road--main {
	top: 0;
	right: 84rpx;
	width: 110rpx;
	height: 100%;
	box-shadow:
		inset 4rpx 0 0 rgba(126, 220, 168, 0.8),
		inset -4rpx 0 0 rgba(126, 220, 168, 0.8);
}

.treasure-shop-detail-map__road--cross {
	left: 112rpx;
	top: 296rpx;
	width: 392rpx;
	height: 72rpx;
	transform: rotate(-24deg);
	border-radius: 999rpx;
}

.treasure-shop-detail-map__poi {
	position: absolute;
}

.treasure-shop-detail-map__poi-dot {
	width: 18rpx;
	height: 18rpx;
	border-radius: 50%;
	background: #e8c1f8;
	box-shadow: 0 0 0 8rpx rgba(232, 193, 248, 0.24);
}

.treasure-shop-detail-map__poi-text {
	margin-left: 12rpx;
	color: #c2a7d3;
}

.treasure-shop-detail-map__focus {
	position: absolute;
	left: 50%;
	top: 288rpx;
	width: 250rpx;
	transform: translateX(-50%);
}

.treasure-shop-detail-map__focus-avatar {
	width: 94rpx;
	height: 94rpx;
	border: 8rpx solid rgba(255, 255, 255, 0.94);
	box-shadow: 0 16rpx 30rpx rgba(49, 58, 78, 0.14);
}

.treasure-shop-detail-map__focus-title {
	margin-top: 18rpx;
	font-size: 42rpx;
	line-height: 1.22;
	color: #3b3e46;
}

.treasure-shop-detail-map__focus-subtitle {
	margin-top: 8rpx;
	line-height: 1.3;
	color: #5f6470;
}

.treasure-shop-detail-page__hero {
}

.treasure-shop-detail-page__body {
	padding-top: 48rpx;
	padding-bottom: calc(env(safe-area-inset-bottom) + 48rpx);
}

.treasure-shop-host-card {
}

.treasure-shop-host-card__avatar {
	width: 88rpx;
	height: 88rpx;
}

.treasure-shop-host-card__body {
	min-width: 0;
	margin-left: 24rpx;
}

.treasure-shop-host-card__greeting {
	font-size: 40rpx;
	line-height: 1.15;
}

.treasure-shop-host-card__name {
	margin-top: 10rpx;
	font-size: 40rpx;
	line-height: 1.18;
}

.treasure-shop-host-card__badges {
	margin-top: 22rpx;
}

.treasure-shop-host-card__badge {
	margin-right: 16rpx;
	margin-bottom: 12rpx;
	padding: 10rpx 16rpx;
	border-radius: 10rpx;
	background: #f8e7bd;
	color: #9a7d43;
}

.treasure-shop-story-card {
	margin-top: 34rpx;
	padding: 34rpx 30rpx;
	border-radius: 24rpx;
	background: #f7f7fa;
}

.treasure-shop-story-card__title {
	font-size: 52rpx;
	line-height: 1.16;
}

.treasure-shop-story-card__desc {
	margin-top: 22rpx;
	line-height: 1.72;
	color: #40434a;
}

.treasure-shop-section-head {
	margin-top: 50rpx;
}

.treasure-shop-section-head__title {
	font-size: 42rpx;
	line-height: 1.2;
}

.treasure-shop-feature-poster {
	margin-top: 28rpx;
	border-radius: 8rpx;
}

.treasure-shop-info-section {
	margin-top: 52rpx;
	padding-top: 44rpx;
	border-top: 2rpx solid #efeff2;
}

.treasure-shop-info-section__title {
	font-size: 42rpx;
	line-height: 1.2;
}

.treasure-shop-info-card {
	gap: 28rpx;
	margin-top: 28rpx;
	padding: 28rpx 30rpx;
	border-radius: 22rpx;
	background:
		radial-gradient(circle at right top, rgba(255, 255, 255, 0.76) 0, rgba(255, 255, 255, 0) 180rpx),
		linear-gradient(135deg, #f8f9fc 0%, #f0f2f8 100%);
}

.treasure-shop-info-card__address {
	min-width: 0;
	line-height: 1.5;
	color: #25262b;
}

.treasure-shop-info-card__action {
	width: 88rpx;
}

.treasure-shop-info-card__action-text {
	margin-top: 8rpx;
	color: #2f3542;
}

.treasure-shop-info-row {
	padding-top: 34rpx;
}

.treasure-shop-info-row--phone {
}

.treasure-shop-info-row__main {
	min-width: 0;
}

.treasure-shop-info-row__label {
	line-height: 1.2;
	font-weight: 500;
}

.treasure-shop-info-row__value {
	margin-top: 18rpx;
	line-height: 1.5;
	color: #6d717a;
}

.treasure-shop-info-row__call {
	width: 72rpx;
	height: 72rpx;
	margin-left: 24rpx;
	border: 2rpx solid #dfe3ed;
}
</style>
