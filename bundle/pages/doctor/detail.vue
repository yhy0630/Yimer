<template>
	<view class="doctor-detail-page">
		<view class="doctor-detail-page__hero">
			<view class="doctor-detail-page__nav" :style="{ paddingTop: `${statusBarHeight}px` }">
				<view class="page-shell doctor-detail-page__nav-inner">
					<view class="doctor-detail-page__back" @tap="goBack">
						<u-icon name="arrow-left" size="50" color="#ffffff"></u-icon>
					</view>
				</view>
			</view>

			<view class="doctor-detail-page__hero-inner">
				<image class="doctor-detail-page__portrait" :src="doctor.heroImage" mode="widthFix"></image>
			</view>

			<view class="doctor-detail-page__dots">
				<view
					v-for="dotIndex in doctor.heroDots"
					:key="dotIndex"
					:class="[
						'doctor-detail-page__dot',
						doctor.heroDotIndex === dotIndex - 1 ? 'is-active' : ''
					]"
				></view>
			</view>
		</view>

		<view class="doctor-detail-page__body">
			<view class="page-shell doctor-detail-page__content">
				<view class="doctor-profile">
					<text class="doctor-profile__title">
						<text class="doctor-profile__title-label">{{ doctor.title }}：</text>
						<text class="doctor-profile__title-name">{{ doctor.name }}</text>
					</text>
					<text class="doctor-profile__summary">{{ doctor.summary }}</text>
				</view>

				<view class="doctor-section">
					<text class="doctor-section__title">资质信息</text>
				</view>

				<view
					v-for="section in doctor.sections"
					:key="section.title"
					class="doctor-section doctor-section--spaced"
				>
					<text class="doctor-section__caption">{{ section.title }}</text>
					<view class="doctor-card">
						<view
							v-for="(row, rowIndex) in section.rows"
							:key="`${section.title}-${row.label}`"
							:class="['doctor-card__row', rowIndex < section.rows.length - 1 ? 'is-bordered' : '']"
						>
							<text class="doctor-card__label">{{ row.label }}</text>
							<text class="doctor-card__value">{{ row.value }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { DEFAULT_DOCTOR, getDoctorById } from '@/config/doctor'

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
			doctor: DEFAULT_DOCTOR
		}
	},
	onLoad(options = {}) {
		this.doctor = getDoctorById(options.id)
	},
	methods: {
		goBack() {
			uni.navigateBack({
				delta: 1
			})
		}
	}
}
</script>

<style scoped lang="scss">
.doctor-detail-page {
	min-height: 100vh;
	background: #ffffff;
}

.doctor-detail-page__hero {
	position: relative;
	overflow: hidden;
	background:
		radial-gradient(circle at 50% 18%, rgba(255, 255, 255, 0.92) 0, rgba(255, 255, 255, 0) 320rpx),
		linear-gradient(180deg, #dbe6fb 0%, #cfdcf6 52%, #c8d7f3 100%);
}

.doctor-detail-page__hero::after {
	content: '';
	position: absolute;
	right: -80rpx;
	bottom: 120rpx;
	width: 320rpx;
	height: 320rpx;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.16);
	filter: blur(8rpx);
}

.doctor-detail-page__nav {
	position: relative;
	z-index: 2;
}

.doctor-detail-page__nav-inner {
	display: flex;
	align-items: center;
	height: 96rpx;
}

.doctor-detail-page__back {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 72rpx;
	height: 72rpx;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.08);
}

.doctor-detail-page__hero-inner {
	position: relative;
	z-index: 1;
	display: flex;
	align-items: flex-end;
	justify-content: center;
	min-height: 760rpx;
	padding: 18rpx 40rpx 76rpx;
	box-sizing: border-box;
}

.doctor-detail-page__portrait {
	display: block;
	width: 520rpx;
	max-width: 100%;
}

.doctor-detail-page__dots {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 32rpx;
	z-index: 2;
	display: flex;
	align-items: center;
	justify-content: center;
}

.doctor-detail-page__dot {
	width: 18rpx;
	height: 6rpx;
	margin: 0 6rpx;
	border-radius: 999rpx;
	background: rgba(255, 255, 255, 0.42);
}

.doctor-detail-page__dot.is-active {
	width: 30rpx;
	background: rgba(255, 255, 255, 0.95);
}

.doctor-detail-page__body {
	position: relative;
	margin-top: -4rpx;
	border-radius: 44rpx 44rpx 0 0;
	background: #ffffff;
}

.doctor-detail-page__content {
	padding-top: 50rpx;
	padding-bottom: calc(env(safe-area-inset-bottom) + 64rpx);
}

.doctor-profile__title {
	display: block;
	font-size: 38rpx;
	line-height: 1.35;
	font-weight: 500;
	color: #1c2437;
}

.doctor-profile__title-label {
	color: #173b8d;
	font-weight: 700;
}

.doctor-profile__title-name {
	color: #1c2437;
}

.doctor-profile__summary {
	display: block;
	margin-top: 40rpx;
	font-size: 24rpx;
	line-height: 1.9;
	color: #343b4c;
}

.doctor-section {
	margin-top: 60rpx;
}

.doctor-section--spaced + .doctor-section--spaced {
	margin-top: 46rpx;
}

.doctor-section__title {
	display: block;
	font-size: 30rpx;
	line-height: 1.3;
	font-weight: 700;
	color: #141a27;
}

.doctor-section__caption {
	display: block;
	margin-bottom: 28rpx;
	font-size: 22rpx;
	line-height: 1.3;
	color: #c3c8d3;
}

.doctor-card {
	padding: 0 30rpx;
	border-radius: 18rpx;
	background: #f7f8fb;
}

.doctor-card__row {
	display: flex;
	align-items: flex-start;
	padding: 30rpx 0;
}

.doctor-card__row.is-bordered {
	border-bottom: 1px solid rgba(221, 225, 234, 0.8);
}

.doctor-card__label {
	flex: none;
	width: 200rpx;
	font-size: 24rpx;
	line-height: 1.5;
	color: #9096a3;
}

.doctor-card__value {
	flex: 1;
	min-width: 0;
	font-size: 24rpx;
	line-height: 1.5;
	color: #1f2635;
	word-break: break-all;
}
</style>
