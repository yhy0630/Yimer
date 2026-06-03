<template>
	<view class="emergency-page">
		<view class="emergency-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="page-shell emergency-page__nav">
				<view class="emergency-page__back" @tap="goBack">
					<u-icon name="arrow-left" size="48" color="#161616"></u-icon>
				</view>
				<text class="emergency-page__title">{{ pageCopy.navTitle }}</text>
				<view class="emergency-page__more" @tap="handleMore">
					<u-icon name="more-dot-fill" size="44" color="#161616"></u-icon>
				</view>
			</view>
		</view>

		<view class="emergency-page__hero">
			<view class="emergency-page__hero-copy">
				<text class="emergency-page__hero-title">{{ pageCopy.heroTitle }}</text>
				<text class="emergency-page__hero-desc">{{ pageCopy.heroDesc }}</text>
			</view>

			<view class="emergency-page__hero-scene" aria-hidden="true">
				<view class="scene-map">
					<view class="scene-map__route scene-map__route--a"></view>
					<view class="scene-map__route scene-map__route--b"></view>
					<view class="scene-map__route scene-map__route--c"></view>
					<view class="scene-map__marker">
						<u-icon name="map-fill" size="34" color="#ffffff"></u-icon>
					</view>
				</view>

				<view class="scene-badge">
					<u-icon name="checkmark-circle-fill" size="34" color="#31c190"></u-icon>
				</view>

				<view class="scene-people">
					<view class="scene-person scene-person--primary">
						<view class="scene-person__head"></view>
						<view class="scene-person__body"></view>
						<view class="scene-person__phone"></view>
					</view>

					<view class="scene-person scene-person--secondary">
						<view class="scene-person__head"></view>
						<view class="scene-person__body"></view>
						<view class="scene-person__arm"></view>
					</view>
				</view>
			</view>
		</view>

		<view class="page-shell emergency-page__body">
			<view v-for="item in contacts" :key="item.id" class="emergency-contact-card">
				<view class="emergency-contact-card__info">
					<text class="emergency-contact-card__name">{{ item.name }} {{ item.phoneMask }}</text>
					<text class="emergency-contact-card__relation">{{ item.relation }}</text>
				</view>

				<button class="emergency-contact-card__action" hover-class="none" @tap="handleCall(item)">
					<u-icon name="phone-fill" size="42" color="#4e5561"></u-icon>
				</button>
			</view>

			<button class="emergency-page__add-card" hover-class="none" @tap="handleAddContact">
				<u-icon name="plus" size="56" color="#1f2127"></u-icon>
				<text class="emergency-page__add-text">{{ pageCopy.addLabel }}</text>
			</button>
		</view>
	</view>
</template>

<script>
const PAGE_COPY = {
	navTitle: '紧急联系人',
	heroTitle: '管理紧急联系人',
	heroDesc: '登记紧急联系电话，让出行更安心',
	addLabel: '添加紧急联系人'
}

const CONTACTS = [
	{
		id: 1,
		name: '杨志远',
		phoneMask: '175****4410',
		relation: '父子'
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
			pageCopy: PAGE_COPY,
			contacts: CONTACTS
		}
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
				url: '/pages/user/user'
			})
		},
		handleMore() {
			uni.showToast({
				title: '更多功能待接入',
				icon: 'none'
			})
		},
		handleCall(item) {
			uni.showToast({
				title: `${item.name}拨号待接入`,
				icon: 'none'
			})
		},
		handleAddContact() {
			uni.showToast({
				title: '添加联系人待接入',
				icon: 'none'
			})
		}
	}
}
</script>

<style scoped lang="scss">
.emergency-page {
	min-height: 100vh;
	padding-bottom: calc(72rpx + env(safe-area-inset-bottom));
	background: #f5f5f6;
}

.emergency-page__header {
	position: sticky;
	top: 0;
	z-index: 20;
	background: rgba(255, 255, 255, 0.98);
}

.emergency-page__nav {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 96rpx;
}

.emergency-page__back,
.emergency-page__more {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 72rpx;
	height: 72rpx;
	flex: none;
}

.emergency-page__back {
	margin-left: -12rpx;
}

.emergency-page__more {
	margin-right: -12rpx;
}

.emergency-page__title {
	font-size: 40rpx;
	line-height: 1.2;
	font-weight: 600;
	color: #1b1b1d;
}

.emergency-page__hero {
	display: flex;
	align-items: center;
	justify-content: space-between;
	min-height: 274rpx;
	padding: 40rpx 44rpx 36rpx;
	background:
		radial-gradient(circle at 0 50%, rgba(217, 238, 233, 0.9) 0, rgba(217, 238, 233, 0.28) 38%, rgba(217, 238, 233, 0) 70%),
		linear-gradient(90deg, #eef7f2 0%, #eef7f6 42%, #f4f7fb 100%);
}

.emergency-page__hero-copy {
	flex: 1;
	min-width: 0;
	padding-right: 18rpx;
}

.emergency-page__hero-title,
.emergency-page__hero-desc,
.emergency-contact-card__name,
.emergency-contact-card__relation,
.emergency-page__add-text {
	display: block;
}

.emergency-page__hero-title {
	font-size: 72rpx;
	line-height: 1.08;
	font-weight: 700;
	color: #111216;
}

.emergency-page__hero-desc {
	margin-top: 30rpx;
	font-size: 30rpx;
	line-height: 1.35;
	color: #8d9199;
}

.emergency-page__hero-scene {
	position: relative;
	width: 286rpx;
	height: 206rpx;
	flex: none;
}

.scene-map {
	position: absolute;
	top: 8rpx;
	left: 18rpx;
	width: 144rpx;
	height: 164rpx;
	border: 6rpx solid rgba(255, 255, 255, 0.9);
	border-radius: 34rpx;
	background: linear-gradient(180deg, rgba(235, 243, 255, 0.95) 0%, rgba(248, 251, 255, 0.95) 100%);
	box-shadow: 0 12rpx 28rpx rgba(78, 102, 144, 0.08);
}

.scene-map__route {
	position: absolute;
	background: rgba(223, 231, 241, 0.88);
}

.scene-map__route--a {
	top: 24rpx;
	left: 18rpx;
	width: 92rpx;
	height: 18rpx;
	border-radius: 999rpx;
	transform: rotate(-10deg);
}

.scene-map__route--b {
	top: 72rpx;
	left: 26rpx;
	width: 102rpx;
	height: 18rpx;
	border-radius: 999rpx;
	transform: rotate(12deg);
}

.scene-map__route--c {
	top: 110rpx;
	left: 18rpx;
	width: 72rpx;
	height: 58rpx;
	border-radius: 30rpx;
	background: rgba(219, 240, 231, 0.9);
}

.scene-map__marker {
	position: absolute;
	top: -26rpx;
	left: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 58rpx;
	height: 58rpx;
	border-radius: 50%;
	background: linear-gradient(180deg, #2b7cff 0%, #1a61f0 100%);
	box-shadow: 0 10rpx 24rpx rgba(39, 104, 238, 0.28);
}

.scene-badge {
	position: absolute;
	top: 22rpx;
	right: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 72rpx;
	height: 54rpx;
	border-radius: 30rpx;
	background: rgba(255, 255, 255, 0.92);
	box-shadow: 0 8rpx 20rpx rgba(78, 102, 144, 0.08);
}

.scene-people {
	position: absolute;
	right: 6rpx;
	bottom: 0;
	display: flex;
	align-items: flex-end;
}

.scene-person {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.scene-person--primary {
	z-index: 2;
	width: 118rpx;
}

.scene-person--secondary {
	width: 106rpx;
	margin-left: -10rpx;
}

.scene-person__head {
	width: 48rpx;
	height: 48rpx;
	border-radius: 50%;
	background: #ffd7c7;
	box-shadow: inset 0 -6rpx 0 rgba(0, 0, 0, 0.03);
}

.scene-person--primary .scene-person__head {
	background: linear-gradient(180deg, #1f242a 0%, #181c22 58%, #ffd7c7 58%, #ffd7c7 100%);
}

.scene-person--secondary .scene-person__head {
	background: linear-gradient(180deg, #282d34 0%, #1f242a 54%, #ffd9cb 54%, #ffd9cb 100%);
}

.scene-person__body {
	margin-top: 10rpx;
	border-radius: 28rpx 28rpx 12rpx 12rpx;
}

.scene-person--primary .scene-person__body {
	width: 112rpx;
	height: 114rpx;
	background: linear-gradient(180deg, #2f84ff 0%, #1b67f0 100%);
}

.scene-person--secondary .scene-person__body {
	width: 94rpx;
	height: 98rpx;
	background: #ffffff;
	box-shadow: 0 10rpx 20rpx rgba(52, 57, 73, 0.06);
}

.scene-person__phone {
	position: absolute;
	left: -4rpx;
	top: 84rpx;
	width: 24rpx;
	height: 42rpx;
	border-radius: 8rpx;
	background: #20242a;
	transform: rotate(-14deg);
}

.scene-person__arm {
	position: absolute;
	right: -4rpx;
	top: 96rpx;
	width: 38rpx;
	height: 18rpx;
	border-radius: 999rpx;
	background: #ffd9cb;
	transform: rotate(24deg);
}

.emergency-page__body {
	padding-top: 36rpx;
}

.emergency-contact-card,
.emergency-page__add-card {
	display: flex;
	align-items: center;
	border-radius: 26rpx;
	background: #ffffff;
	box-shadow: 0 14rpx 34rpx rgba(25, 33, 52, 0.04);
}

.emergency-contact-card {
	justify-content: space-between;
	padding: 34rpx 32rpx 34rpx 42rpx;
}

.emergency-contact-card__info {
	flex: 1;
	min-width: 0;
	padding-right: 24rpx;
}

.emergency-contact-card__name {
	font-size: 34rpx;
	line-height: 1.35;
	font-weight: 600;
	color: #202228;
}

.emergency-contact-card__relation {
	margin-top: 18rpx;
	font-size: 28rpx;
	line-height: 1.25;
	color: #9a9ea7;
}

.emergency-contact-card__action {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 92rpx;
	height: 92rpx;
	border: 2rpx solid #e6e8ed;
	border-radius: 50%;
	background: #ffffff;
	flex: none;
}

.emergency-page__add-card {
	justify-content: center;
	height: 150rpx;
	margin-top: 30rpx;
}

.emergency-page__add-text {
	margin-left: 20rpx;
	font-size: 34rpx;
	line-height: 1.2;
	font-weight: 600;
	color: #1f2127;
}

@media screen and (max-width: 360px) {
	.emergency-page__hero {
		padding-left: 34rpx;
		padding-right: 34rpx;
	}

	.emergency-page__hero-title {
		font-size: 60rpx;
	}

	.emergency-page__hero-desc {
		font-size: 28rpx;
	}

	.emergency-page__hero-scene {
		width: 252rpx;
		transform: scale(0.94);
		transform-origin: center right;
	}
}
</style>
