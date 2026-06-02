<template>
	<view class="campus-detail-page">
		<view class="campus-detail-page__hero">
			<image class="campus-detail-page__cover" :src="campus.image" mode="aspectFill"></image>
			<view class="campus-detail-page__cover-mask"></view>

			<view class="campus-detail-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
				<view class="page-shell campus-detail-page__nav">
					<view class="campus-detail-page__back" @tap="goBack">
						<u-icon name="arrow-left" size="42" color="#ffffff"></u-icon>
					</view>
				</view>
			</view>
		</view>

		<view class="campus-detail-page__content">
			<view class="page-shell">
				<view class="campus-hero-card">
					<text class="campus-hero-card__name">{{ campus.name }}</text>
					<text class="campus-hero-card__status">{{ campusDetail.businessStatus }}</text>
					<text class="campus-hero-card__hours">营业时间 {{ campusDetail.businessHours }}</text>

					<view class="campus-location-card" @tap="handleOpenMap">
						<view class="campus-location-card__main">
							<text class="campus-location-card__address">{{ campusDetail.fullAddress }}</text>
						</view>
						<view class="campus-location-card__action">
							<u-icon name="map" size="28" color="#2f3542"></u-icon>
							<text class="campus-location-card__action-text">导航</text>
						</view>
					</view>
				</view>
			</view>

			<view class="campus-detail-page__section-gap"></view>

			<view class="page-shell campus-section">
				<text class="campus-section__title">服务设施</text>
				<view class="campus-facility-grid">
					<view
						v-for="facility in campusDetail.facilities"
						:key="facility.label"
						class="campus-facility-item"
					>
						<view class="campus-facility-item__icon">
							<text class="campus-facility-item__symbol">{{ facility.symbol }}</text>
						</view>
						<text class="campus-facility-item__label">{{ facility.label }}</text>
					</view>
				</view>
			</view>

			<view class="campus-detail-page__section-gap"></view>

			<view class="page-shell campus-section campus-section--doctors">
				<text class="campus-section__title">名医团队</text>
				<view
					v-for="doctor in campusDetail.doctors"
					:key="doctor.id"
					class="doctor-card"
					@tap="handleDoctorTap(doctor)"
				>
					<image class="doctor-card__avatar" :src="doctor.avatar" mode="aspectFill"></image>

					<view class="doctor-card__body">
						<text class="doctor-card__name">{{ doctor.name }}</text>

						<view class="doctor-card__tags">
							<text
								v-for="tag in doctor.tags"
								:key="tag"
								class="doctor-card__tag"
							>
								{{ tag }}
							</text>
						</view>

						<text class="doctor-card__summary-title">医生简介：</text>
						<text class="doctor-card__summary line-3">{{ doctor.description }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { DEFAULT_CAMPUS, getCampusById } from '@/config/campus'

const CAMPUS_DETAIL_MAP = {
	'guanghua-soho2': {
		businessStatus: '营业中',
		businessHours: '9:00-22:00',
		fullAddress: '北京市朝阳区光华路9号光华路SOHO2期F8层',
		facilities: [
			{ symbol: 'Wi', label: 'WIFI覆盖' },
			{ symbol: '护', label: '术后护理' },
			{ symbol: '猫', label: '蓝猫咖啡' },
			{ symbol: 'P', label: '停车场' }
		]
	},
	wangjing: {
		businessStatus: '营业中',
		businessHours: '10:00-21:30',
		fullAddress: '北京市朝阳区阜通东大街6号院3号楼2层',
		facilities: [
			{ symbol: 'Wi', label: 'WIFI覆盖' },
			{ symbol: '护', label: '恢复护理' },
			{ symbol: '茶', label: '茶歇休息' },
			{ symbol: 'P', label: '停车场' }
		]
	},
	guomao: {
		businessStatus: '营业中',
		businessHours: '9:30-21:00',
		fullAddress: '北京市朝阳区建国门外大街8号国贸商城北区3层',
		facilities: [
			{ symbol: 'Wi', label: 'WIFI覆盖' },
			{ symbol: '护', label: '术后护理' },
			{ symbol: '吧', label: '饮品吧台' },
			{ symbol: 'P', label: '停车场' }
		]
	}
}

const DOCTOR_LIST = [
	{
		id: 1,
		name: 'Light医生',
		avatar: '/static/linshi/01.png',
		tags: ['光电专家', '注射微整'],
		description: 'Light 医生从事临床工作十余年，专注光电科疾病的诊断与治疗，临床经验丰富，擅长围绕肤质改善与面部年轻化制定个性化联合方案。'
	},
	{
		id: 2,
		name: 'Ridjk医生',
		avatar: '/static/linshi/02.png',
		tags: ['光电专家', '注射微整', '五官塑形'],
		description: '擅长光电抗衰与轮廓精修，注重自然感与恢复期管理，对面部精细化设计和微整联合治疗有稳定成熟的临床经验。'
	},
	{
		id: 3,
		name: 'Ridjk医生',
		avatar: '/static/linshi/03.png',
		tags: ['皮肤治疗', '抗衰管理', '面部提升'],
		description: '长期聚焦面部抗衰和综合治疗，强调分层设计与术后跟踪，在轻医美复诊场景和长期皮肤管理方面积累了大量实践经验。'
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

function getCampusDetailById(id) {
	return {
		...(CAMPUS_DETAIL_MAP[id] || CAMPUS_DETAIL_MAP[DEFAULT_CAMPUS.id]),
		doctors: DOCTOR_LIST
	}
}

export default {
	data() {
		return {
			statusBarHeight: getStatusBarHeight(),
			campus: DEFAULT_CAMPUS,
			campusDetail: getCampusDetailById(DEFAULT_CAMPUS.id)
		}
	},
	onLoad(options = {}) {
		const campus = getCampusById(options.id)
		this.campus = campus
		this.campusDetail = getCampusDetailById(campus.id)
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
		handleDoctorTap(doctor) {
			uni.showToast({
				title: doctor.name,
				icon: 'none'
			})
		}
	}
}
</script>

<style scoped lang="scss">
.campus-detail-page {
	min-height: 100vh;
	background: #f5f5f7;
}

.campus-detail-page__hero {
	position: relative;
	height: 760rpx;
	overflow: hidden;
	border-bottom-left-radius: 36rpx;
	border-bottom-right-radius: 36rpx;
}

.campus-detail-page__cover {
	display: block;
	width: 100%;
	height: 100%;
}

.campus-detail-page__cover-mask {
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	height: 220rpx;
	background: linear-gradient(180deg, rgba(18, 20, 28, 0.36) 0%, rgba(18, 20, 28, 0) 100%);
}

.campus-detail-page__header {
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	z-index: 2;
}

.campus-detail-page__nav {
	display: flex;
	align-items: center;
	height: 96rpx;
}

.campus-detail-page__back {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 72rpx;
	height: 72rpx;
	border-radius: 50%;
	background: rgba(15, 18, 27, 0.18);
	backdrop-filter: blur(10rpx);
}

.campus-detail-page__content {
	position: relative;
	margin-top: -24rpx;
	padding-bottom: calc(env(safe-area-inset-bottom) + 48rpx);
}

.campus-hero-card {
	padding: 42rpx 0 24rpx;
}

.campus-hero-card__name {
	display: block;
	color: #20232b;
	font-size: 56rpx;
	font-weight: 700;
	line-height: 1.28;
}

.campus-hero-card__status {
	display: block;
	margin-top: 38rpx;
	color: #173f9b;
	font-size: 48rpx;
	font-weight: 700;
	line-height: 1.2;
}

.campus-hero-card__hours {
	display: block;
	margin-top: 18rpx;
	color: #3e424d;
	font-size: 34rpx;
	line-height: 1.5;
}

.campus-location-card {
	display: flex;
	align-items: center;
	margin-top: 34rpx;
	padding: 28rpx 28rpx 28rpx 32rpx;
	border-radius: 22rpx;
	background:
		linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(247, 248, 252, 0.96) 52%, rgba(242, 244, 250, 0.94) 100%),
		linear-gradient(120deg, rgba(202, 211, 235, 0.16) 0%, rgba(255, 255, 255, 0) 58%);
	box-shadow: 0 10rpx 24rpx rgba(26, 34, 58, 0.05);
}

.campus-location-card__main {
	flex: 1;
	min-width: 0;
	padding-right: 24rpx;
}

.campus-location-card__address {
	color: #2d313b;
	font-size: 34rpx;
	font-weight: 600;
	line-height: 1.45;
}

.campus-location-card__action {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 84rpx;
	flex-shrink: 0;
}

.campus-location-card__action-text {
	margin-top: 10rpx;
	color: #2f3542;
	font-size: 24rpx;
	line-height: 1;
}

.campus-detail-page__section-gap {
	height: 24rpx;
	background: #ececef;
}

.campus-section {
	padding-top: 48rpx;
	padding-bottom: 40rpx;
	background: #ffffff;
}

.campus-section--doctors {
	padding-bottom: 12rpx;
}

.campus-section__title {
	display: block;
	color: #1f232d;
	font-size: 50rpx;
	font-weight: 600;
	line-height: 1.2;
}

.campus-facility-grid {
	display: flex;
	justify-content: space-between;
	margin-top: 46rpx;
	gap: 12rpx;
}

.campus-facility-item {
	display: flex;
	flex: 1;
	flex-direction: column;
	align-items: center;
	min-width: 0;
}

.campus-facility-item__icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 86rpx;
	height: 86rpx;
	border-radius: 24rpx;
	background: linear-gradient(180deg, #f8fbff 0%, #edf3ff 100%);
	box-shadow: inset 0 -6rpx 0 rgba(28, 77, 181, 0.04);
}

.campus-facility-item__symbol {
	color: #17459e;
	font-size: 30rpx;
	font-weight: 700;
	line-height: 1;
}

.campus-facility-item__label {
	margin-top: 22rpx;
	color: #3b404b;
	font-size: 30rpx;
	line-height: 1.35;
	text-align: center;
}

.doctor-card {
	display: flex;
	align-items: flex-start;
	margin-top: 34rpx;
}

.doctor-card__avatar {
	display: block;
	width: 226rpx;
	height: 226rpx;
	flex-shrink: 0;
	border-radius: 20rpx;
	background: linear-gradient(180deg, #eef1f7 0%, #dfe5f1 100%);
}

.doctor-card__body {
	flex: 1;
	min-width: 0;
	margin-left: 26rpx;
	padding-top: 4rpx;
}

.doctor-card__name {
	display: block;
	color: #1c2230;
	font-size: 42rpx;
	font-weight: 700;
	line-height: 1.3;
}

.doctor-card__tags {
	display: flex;
	flex-wrap: wrap;
	margin: 18rpx -8rpx 0 0;
}

.doctor-card__tag {
	margin: 0 8rpx 8rpx 0;
	padding: 10rpx 16rpx;
	border-radius: 14rpx;
	background: #faf3ee;
	color: #8b613f;
	font-size: 28rpx;
	line-height: 1;
}

.doctor-card__summary-title {
	display: block;
	margin-top: 14rpx;
	color: #7a818e;
	font-size: 30rpx;
	line-height: 1.4;
}

.doctor-card__summary {
	display: block;
	margin-top: 6rpx;
	color: #7f8591;
	font-size: 30rpx;
	line-height: 1.6;
}
</style>
