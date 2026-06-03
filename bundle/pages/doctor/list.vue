<template>
	<view class="doctor-list-page">
		<view class="doctor-list-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="doctor-list-page__nav page-shell">
				<view class="doctor-list-page__back" @tap="goBack">
					<u-icon name="arrow-left" size="46" color="#1d1f25"></u-icon>
				</view>
			</view>

			<view class="page-shell">
				<view class="doctor-list-page__location flex row-between" @tap="openCampusPage">
					<view class="doctor-list-page__location-main flex">
						<image class="doctor-list-page__location-icon" src="/static/images/address.png" mode="aspectFit"></image>
						<text class="doctor-list-page__location-text line-1">{{ currentLocation }}</text>
					</view>
					<view class="doctor-list-page__location-switch flex">
						<image class="doctor-list-page__switch-icon" src="/static/images/qiehuan.png" mode="aspectFit"></image>
						<text class="doctor-list-page__switch-text">切换</text>
					</view>
				</view>
			</view>
		</view>

		<view class="page-shell doctor-list-page__body">
			<view
				v-for="(doctor, index) in pageDoctors"
				:key="doctor.cardId"
				:class="['doctor-card', index > 0 ? 'doctor-card--spaced' : '']"
				@tap="openDoctorDetail(doctor)"
			>
				<image class="doctor-card__portrait" :src="doctor.avatar" mode="aspectFill"></image>

				<view class="doctor-card__body">
					<text class="doctor-card__name">{{ doctor.name }}</text>

					<view class="doctor-card__tag-list">
						<text v-for="tag in doctor.tags" :key="`${doctor.cardId}-${tag}`" class="doctor-card__tag">
							{{ tag }}
						</text>
					</view>

					<text class="doctor-card__label">医生简介：</text>
					<text class="doctor-card__summary line-3">{{ doctor.summary }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { DEFAULT_CAMPUS, formatCampusLocation, getCampusById } from '@/config/campus'
import { getDoctorById } from '@/config/doctor'

const DOCTOR_LIST_ENTRIES = [
	{
		cardId: 'light-1',
		doctorId: 'light'
	},
	{
		cardId: 'ridjk-a-1',
		doctorId: 'ridjk-a'
	},
	{
		cardId: 'ridjk-b-1',
		doctorId: 'ridjk-b'
	},
	{
		cardId: 'ridjk-a-2',
		doctorId: 'ridjk-a'
	},
	{
		cardId: 'light-2',
		doctorId: 'light'
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

function buildDoctorCards() {
	return DOCTOR_LIST_ENTRIES.map((entry) => {
		const doctor = getDoctorById(entry.doctorId)

		return {
			cardId: entry.cardId,
			detailId: doctor.id,
			name: doctor.name,
			avatar: doctor.avatar,
			tags: doctor.tags,
			summary: doctor.summary
		}
	})
}

export default {
	data() {
		return {
			statusBarHeight: getStatusBarHeight(),
			source: 'home',
			currentCampus: DEFAULT_CAMPUS,
			currentLocation: formatCampusLocation(DEFAULT_CAMPUS),
			pageDoctors: buildDoctorCards()
		}
	},
	onLoad(options = {}) {
		this.source = options.source || 'home'
		this.applyCampus(getCampusById(options.currentCampusId))
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
		applyCampus(campus) {
			this.currentCampus = campus || DEFAULT_CAMPUS
			this.currentLocation = formatCampusLocation(this.currentCampus)
		},
		openCampusPage() {
			uni.navigateTo({
				url: `/bundle/pages/campus/campus?mode=select&source=doctor-list&currentCampusId=${this.currentCampus.id}`,
				success: (res) => {
					res.eventChannel.on('campusSelected', ({ campus }) => {
						this.applyCampus(campus)
					})
				}
			})
		},
		openDoctorDetail(doctor) {
			uni.navigateTo({
				url: `/bundle/pages/doctor/detail?id=${doctor.detailId}&source=${this.source}-list`
			})
		}
	}
}
</script>

<style scoped lang="scss">
.doctor-list-page {
	min-height: 100vh;
	background: #ffffff;
}

.doctor-list-page__header {
	background: #ffffff;
}

.doctor-list-page__nav {
	display: flex;
	align-items: center;
	height: 104rpx;
}

.doctor-list-page__back {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 72rpx;
	height: 72rpx;
	margin-left: -10rpx;
}

.doctor-list-page__location {
	align-items: center;
	padding: 8rpx 0 0;
}

.doctor-list-page__location-main {
	flex: 1;
	min-width: 0;
	align-items: center;
}

.doctor-list-page__location-icon {
	width: 28rpx;
	height: 28rpx;
	flex: none;
}

.doctor-list-page__location-text {
	margin-left: 12rpx;
	font-size: 24rpx;
	line-height: 1.4;
	color: #1a1b1d;
}

.doctor-list-page__location-switch {
	flex: none;
	align-items: center;
	margin-left: 20rpx;
}

.doctor-list-page__switch-icon {
	width: 36rpx;
	height: 36rpx;
}

.doctor-list-page__switch-text {
	margin-left: 8rpx;
	font-size: 24rpx;
	line-height: 1.2;
	color: #323437;
}

.doctor-list-page__body {
	padding-top: 34rpx;
	padding-bottom: calc(env(safe-area-inset-bottom) + 48rpx);
}

.doctor-card {
	display: flex;
	align-items: flex-start;
}

.doctor-card--spaced {
	margin-top: 46rpx;
}

.doctor-card__portrait {
	flex: none;
	width: 252rpx;
	height: 252rpx;
	border-radius: 20rpx;
	background: #edf0f5;
}

.doctor-card__body {
	flex: 1;
	min-width: 0;
	padding: 12rpx 0 6rpx 30rpx;
}

.doctor-card__name {
	display: block;
	color: #182033;
	font-size: 30rpx;
	line-height: 1.25;
	font-weight: 700;
}

.doctor-card__tag-list {
	display: flex;
	flex-wrap: wrap;
	margin-top: 26rpx;
}

.doctor-card__tag {
	margin-right: 16rpx;
	margin-bottom: 16rpx;
	padding: 14rpx 18rpx;
	border-radius: 14rpx;
	background: #fcf6f1;
	font-size: 22rpx;
	line-height: 1;
	color: #8f6542;
}

.doctor-card__label {
	display: block;
	margin-top: 4rpx;
	font-size: 22rpx;
	line-height: 1.4;
	color: #8d929d;
}

.doctor-card__summary {
	display: block;
	margin-top: 12rpx;
	font-size: 22rpx;
	line-height: 1.7;
	color: #8d929d;
}
</style>
