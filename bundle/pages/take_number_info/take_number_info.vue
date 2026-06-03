<template>
	<view class="take-number-info-page">
		<view class="take-number-info-page__glow take-number-info-page__glow--left"></view>
		<view class="take-number-info-page__glow take-number-info-page__glow--right"></view>

		<view class="take-number-info-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="page-shell take-number-info-page__nav">
				<view class="take-number-info-page__back" @tap="handleBack">
					<u-icon name="arrow-left" size="46" color="#20232b"></u-icon>
				</view>
			</view>
		</view>

		<view class="page-shell take-number-info-page__body">
			<view class="take-number-info-page__title-row">
				<text class="take-number-info-page__title">取号信息</text>
				<view :class="['take-number-info-page__status', `is-${currentStatus.key}`]">
					{{ currentStatus.statusText }}
				</view>
			</view>

			<view class="ticket-card">
				<view class="ticket-card__section">
					<text class="ticket-card__label">挂号单号</text>
					<text class="ticket-card__value">{{ pageData.ticketNo }}</text>
				</view>

				<view class="ticket-card__divider">
					<view class="ticket-card__divider-hole ticket-card__divider-hole--left"></view>
					<view class="ticket-card__divider-line"></view>
					<view class="ticket-card__divider-hole ticket-card__divider-hole--right"></view>
				</view>

				<view class="ticket-card__section">
					<text class="ticket-card__label">预约项目</text>
					<text class="ticket-card__project">{{ pageData.projectName }}</text>
				</view>
			</view>

			<view class="detail-card">
				<text class="detail-card__title">挂号详情</text>

				<view v-for="item in detailItems" :key="item.label" class="detail-card__row">
					<text class="detail-card__row-label">{{ item.label }}</text>
					<text class="detail-card__row-value">{{ item.value }}</text>
				</view>
			</view>
		</view>

		<view class="take-number-info-page__footer">
			<view class="page-shell take-number-info-page__footer-inner">
				<button
					:class="['take-number-info-page__cta', `is-${currentStatus.buttonStyle}`]"
					hover-class="none"
					@tap="handlePrimaryAction"
				>
					{{ currentStatus.buttonText }}
				</button>
			</view>
		</view>
	</view>
</template>

<script>
const STATUS_MAP = Object.freeze({
	booked: {
		key: 'booked',
		statusText: '已预约',
		buttonText: '确认取号',
		buttonStyle: 'primary'
	},
	cancelled: {
		key: 'cancelled',
		statusText: '已取消',
		buttonText: '重新挂号',
		buttonStyle: 'outline'
	}
})

const ORDER_MAP = Object.freeze({
	'booked-001': {
		statusKey: 'booked',
		ticketNo: 'YME292038728298',
		projectName: '新一代高能舒适热玛吉',
		campus: '北京伊美尔光华Soho2期店',
		visitTime: '2026-01-01 13:00',
		doctor: '沈以诚',
		purpose: '治疗'
	},
	'booked-002': {
		statusKey: 'booked',
		ticketNo: 'YME292038728299',
		projectName: '超声炮紧致提升',
		campus: '北京伊美尔光华Soho2期店',
		visitTime: '2026-01-01 15:20',
		doctor: '沈以诚',
		purpose: '治疗'
	},
	'booked-003': {
		statusKey: 'booked',
		ticketNo: 'YME292038728300',
		projectName: '光电嫩肤面诊',
		campus: '北京伊美尔光华Soho2期店',
		visitTime: '2026-01-02 09:40',
		doctor: '沈以诚',
		purpose: '复诊'
	},
	'cancelled-001': {
		statusKey: 'cancelled',
		ticketNo: 'YME292038728298',
		projectName: '新一代高能舒适热玛吉',
		campus: '北京伊美尔光华Soho2期店',
		visitTime: '2026-01-01 13:00',
		doctor: '沈以诚',
		purpose: '治疗'
	},
	'cancelled-002': {
		statusKey: 'cancelled',
		ticketNo: 'YME292038728301',
		projectName: '皮肤检测面诊',
		campus: '北京伊美尔光华Soho2期店',
		visitTime: '2026-01-03 10:00',
		doctor: '沈以诚',
		purpose: '咨询'
	}
})

const DEFAULT_ORDER_ID = 'booked-001'

function normalizeStatus(status) {
	const normalizedStatus = String(status || '').toLowerCase()

	if (normalizedStatus === 'cancelled' || normalizedStatus === 'canceled') {
		return 'cancelled'
	}

	return 'booked'
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
	data() {
		return {
			statusBarHeight: getStatusBarHeight(),
			pageData: ORDER_MAP[DEFAULT_ORDER_ID],
			status: 'booked'
		}
	},
	computed: {
		currentStatus() {
			return STATUS_MAP[this.status] || STATUS_MAP.booked
		},
		detailItems() {
			return [
				{
					label: '挂号院区：',
					value: this.pageData.campus
				},
				{
					label: '就诊时间：',
					value: this.pageData.visitTime
				},
				{
					label: '科室医生：',
					value: this.pageData.doctor
				},
				{
					label: '挂号目的：',
					value: this.pageData.purpose
				}
			]
		}
	},
	onLoad(options = {}) {
		const orderId = options.orderId || DEFAULT_ORDER_ID
		this.pageData = ORDER_MAP[orderId] || ORDER_MAP[DEFAULT_ORDER_ID]
		this.status = normalizeStatus(options.status || this.pageData.statusKey)
	},
	methods: {
		handleBack() {
			const pages = getCurrentPages()

			if (pages.length > 1) {
				uni.navigateBack({
					delta: 1
				})
				return
			}

			uni.redirectTo({
				url: '/bundle/pages/scan_take_number/scan_take_number'
			})
		},
		handlePrimaryAction() {
			if (this.status === 'cancelled') {
				uni.redirectTo({
					url: '/bundle/pages/scan_take_number/scan_take_number'
				})
				return
			}

			uni.redirectTo({
				url: '/bundle/pages/take_number_success/take_number_success'
			})
		}
	}
}
</script>

<style scoped lang="scss">
.take-number-info-page {
	position: relative;
	min-height: 100vh;
	overflow: hidden;
	background:
		radial-gradient(circle at 18% 0, rgba(230, 235, 245, 0.94) 0, rgba(230, 235, 245, 0.3) 320rpx, rgba(255, 255, 255, 0) 740rpx),
		radial-gradient(circle at 100% 12%, rgba(242, 245, 251, 0.86) 0, rgba(242, 245, 251, 0) 360rpx),
		linear-gradient(180deg, #f8f9fd 0%, #ffffff 360rpx, #ffffff 100%);
}

.take-number-info-page__glow {
	position: absolute;
	pointer-events: none;
	border-radius: 50%;
	filter: blur(18rpx);
}

.take-number-info-page__glow--left {
	top: -140rpx;
	left: -120rpx;
	width: 360rpx;
	height: 360rpx;
	background: rgba(255, 255, 255, 0.92);
}

.take-number-info-page__glow--right {
	top: -10rpx;
	right: -120rpx;
	width: 420rpx;
	height: 380rpx;
	background: rgba(219, 227, 244, 0.4);
}

.take-number-info-page__header {
	position: relative;
	z-index: 2;
}

.take-number-info-page__nav {
	display: flex;
	align-items: center;
	height: 90rpx;
}

.take-number-info-page__back {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 80rpx;
	height: 72rpx;
	margin-left: -8rpx;
}

.take-number-info-page__body {
	position: relative;
	z-index: 1;
	padding-top: 22rpx;
	padding-bottom: calc(env(safe-area-inset-bottom) + 210rpx);
}

.take-number-info-page__title-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.take-number-info-page__title {
	font-size: 58rpx;
	font-weight: 700;
	line-height: 1.18;
	color: #20232b;
}

.take-number-info-page__status {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 116rpx;
	height: 52rpx;
	padding: 0 24rpx;
	border-radius: 999rpx;
	font-size: 24rpx;
	line-height: 1;
	box-sizing: border-box;
}

.take-number-info-page__status.is-booked {
	border: 2rpx solid #143080;
	color: #143080;
}

.take-number-info-page__status.is-cancelled {
	border: 2rpx solid #8f949f;
	color: #8f949f;
}

.ticket-card,
.detail-card {
	background: rgba(255, 255, 255, 0.98);
	box-shadow: 0 18rpx 44rpx rgba(32, 41, 72, 0.08);
}

.ticket-card {
	position: relative;
	margin-top: 44rpx;
	border-radius: 24rpx;
	overflow: hidden;
}

.ticket-card__section {
	padding: 34rpx 44rpx 30rpx;
}

.ticket-card__label {
	display: block;
	font-size: 32rpx;
	font-weight: 700;
	line-height: 1.25;
	color: #20232b;
}

.ticket-card__value {
	display: block;
	margin-top: 40rpx;
	font-size: 34rpx;
	line-height: 1.3;
	color: #404652;
	word-break: break-all;
}

.ticket-card__divider {
	position: relative;
	display: flex;
	align-items: center;
}

.ticket-card__divider-line {
	flex: 1;
	margin: 0 40rpx;
	border-top: 2rpx dashed #e7e9ef;
}

.ticket-card__divider-hole {
	position: absolute;
	top: 50%;
	width: 24rpx;
	height: 24rpx;
	border-radius: 50%;
	background: #f8f9fd;
	transform: translateY(-50%);
}

.ticket-card__divider-hole--left {
	left: -12rpx;
}

.ticket-card__divider-hole--right {
	right: -12rpx;
}

.ticket-card__project {
	display: block;
	margin-top: 34rpx;
	font-size: 34rpx;
	line-height: 1.45;
	color: #404652;
}

.detail-card {
	margin-top: 36rpx;
	padding: 36rpx 44rpx 20rpx;
	border-radius: 24rpx;
}

.detail-card__title {
	display: block;
	font-size: 32rpx;
	font-weight: 700;
	line-height: 1.25;
	color: #20232b;
}

.detail-card__row {
	display: flex;
	align-items: flex-start;
	margin-top: 34rpx;
}

.detail-card__row-label {
	flex: none;
	width: 140rpx;
	font-size: 24rpx;
	line-height: 1.6;
	color: #8f949f;
}

.detail-card__row-value {
	flex: 1;
	min-width: 0;
	font-size: 24rpx;
	line-height: 1.6;
	color: #404652;
	word-break: break-all;
}

.take-number-info-page__footer {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 12;
	padding: 20rpx 0 calc(env(safe-area-inset-bottom) + 26rpx);
	background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.94) 22%, rgba(255, 255, 255, 0.98) 100%);
}

.take-number-info-page__footer-inner {
	display: flex;
}

.take-number-info-page__cta {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 80rpx;
	border-radius: 999rpx;
	font-size: 32rpx;
	font-weight: 600;
	line-height: 1;
}

.take-number-info-page__cta.is-primary {
	background: #143080;
	color: #ffffff;
	box-shadow: 0 16rpx 28rpx rgba(20, 48, 128, 0.2);
}

.take-number-info-page__cta.is-outline {
	border: 2rpx solid #143080;
	background: #ffffff;
	color: #143080;
}
</style>
