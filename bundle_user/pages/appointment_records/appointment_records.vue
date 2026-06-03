<template>
	<view class="appointment-records-page">
		<view class="appointment-records-page__glow appointment-records-page__glow--left"></view>
		<view class="appointment-records-page__glow appointment-records-page__glow--right"></view>

		<view class="appointment-records-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="page-shell appointment-records-page__nav">
				<view class="appointment-records-page__back" @tap="goBack">
					<u-icon name="arrow-left" size="50" color="#20232b"></u-icon>
				</view>
			</view>

			<view class="appointment-records-page__tabs">
				<view class="page-shell appointment-records-page__tabs-inner">
					<view
						v-for="tab in tabs"
						:key="tab.key"
						:class="['appointment-records-page__tab', activeTab === tab.key ? 'is-active' : '']"
						@tap="setActiveTab(tab.key)"
					>
						<text class="appointment-records-page__tab-text">{{ tab.label }}</text>
					</view>
				</view>
			</view>
		</view>

		<view class="page-shell appointment-records-page__body">
			<view v-if="visibleRecords.length" class="appointment-records-page__list">
				<view v-for="record in visibleRecords" :key="record.id" class="record-card">
					<view class="record-card__head">
						<text class="record-card__title">{{ record.title }}</text>
						<view :class="['record-card__status', `is-${record.status}`]">
							{{ getStatusLabel(record.status) }}
						</view>
					</view>

					<view class="record-card__details">
						<view v-for="field in record.fields" :key="field.label" class="record-card__row">
							<text class="record-card__label">{{ field.label }}</text>
							<text class="record-card__value">{{ field.value }}</text>
						</view>
					</view>

					<view v-if="getActionText(record.status)" class="record-card__footer">
						<button
							:class="['record-card__action', `is-${record.status}`]"
							hover-class="none"
							@tap="handleAction(record)"
						>
							{{ getActionText(record.status) }}
						</button>
					</view>
				</view>
			</view>

			<view v-else class="appointment-records-page__empty">
				<text class="appointment-records-page__empty-title">{{ emptyState.title }}</text>
				<text class="appointment-records-page__empty-desc">{{ emptyState.desc }}</text>
			</view>
		</view>
	</view>
</template>

<script>
const USER_TAB_URL = '/pages/user/user'
const APPOINTMENT_REGISTER_URL = '/bundle_service/pages/appointment_register/appointment_register'

const PAGE_TABS = [
	{
		key: 'booked',
		label: '已预约'
	},
	{
		key: 'issued',
		label: '已取号'
	},
	{
		key: 'cancelled',
		label: '已取消'
	},
	{
		key: 'expired',
		label: '已过号'
	}
]

const STATUS_CONFIG = Object.freeze({
	booked: {
		label: '已预约',
		actionText: '取消挂号'
	},
	issued: {
		label: '已取号',
		actionText: ''
	},
	cancelled: {
		label: '已取消',
		actionText: '重新挂号'
	},
	expired: {
		label: '已过号',
		actionText: '重新挂号'
	}
})

const EMPTY_STATE = Object.freeze({
	booked: {
		title: '暂无已预约记录',
		desc: '后续接入真实挂号数据后，这里会展示待到院的预约单。'
	},
	issued: {
		title: '暂无已取号记录',
		desc: '到院取号完成后，这里会保留对应挂号记录。'
	},
	cancelled: {
		title: '暂无已取消记录',
		desc: '取消后的挂号单会归档到这里，方便后续核对。'
	},
	expired: {
		title: '暂无已过号记录',
		desc: '过号记录会展示在这里，便于后续重新安排时间。'
	}
})

const RECORD_LIST = [
	{
		id: 'appointment-001',
		status: 'booked',
		title: '缴费单编号',
		fields: [
			{ label: '挂号目的：', value: '治疗' },
			{ label: '挂号院区：', value: '北京伊美尔光华Soho2期店' },
			{ label: '挂号科室：', value: '美容科' },
			{ label: '挂号项目：', value: '新一代高能舒适热玛吉' },
			{ label: '挂号时间：', value: '2026-01-01 13:00' }
		]
	},
	{
		id: 'appointment-002',
		status: 'issued',
		title: '缴费单编号',
		fields: [
			{ label: '挂号目的：', value: '治疗' },
			{ label: '挂号院区：', value: '北京伊美尔光华Soho2期店' },
			{ label: '挂号科室：', value: '美容科' },
			{ label: '挂号项目：', value: '新一代高能舒适热玛吉' },
			{ label: '挂号时间：', value: '2026-01-01 13:00' }
		]
	},
	{
		id: 'appointment-003',
		status: 'cancelled',
		title: '缴费单编号',
		fields: [
			{ label: '挂号目的：', value: '治疗' },
			{ label: '挂号院区：', value: '北京伊美尔光华Soho2期店' },
			{ label: '挂号科室：', value: '美容科' },
			{ label: '挂号项目：', value: '新一代高能舒适热玛吉' },
			{ label: '挂号时间：', value: '2026-01-01 13:00' }
		]
	},
	{
		id: 'appointment-004',
		status: 'expired',
		title: '缴费单编号',
		fields: [
			{ label: '挂号目的：', value: '复诊' },
			{ label: '挂号院区：', value: '北京伊美尔光华Soho2期店' },
			{ label: '挂号科室：', value: '美容科' },
			{ label: '挂号项目：', value: '光电嫩肤面诊' },
			{ label: '挂号时间：', value: '2026-01-02 10:30' }
		]
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

function cloneRecords() {
	return RECORD_LIST.map((record) => ({
		...record,
		fields: record.fields.map((field) => ({ ...field }))
	}))
}

export default {
	data() {
		return {
			statusBarHeight: getStatusBarHeight(),
			tabs: PAGE_TABS,
			activeTab: 'booked',
			records: cloneRecords()
		}
	},
	computed: {
		visibleRecords() {
			return this.records.filter((record) => record.status === this.activeTab)
		},
		emptyState() {
			return EMPTY_STATE[this.activeTab] || EMPTY_STATE.booked
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
				url: USER_TAB_URL
			})
		},
		setActiveTab(tabKey) {
			this.activeTab = tabKey
		},
		getStatusLabel(status) {
			return STATUS_CONFIG[status] ? STATUS_CONFIG[status].label : ''
		},
		getActionText(status) {
			return STATUS_CONFIG[status] ? STATUS_CONFIG[status].actionText : ''
		},
		handleAction(record) {
			if (record.status === 'booked') {
				uni.showModal({
					title: '取消挂号',
					content: '确认取消当前挂号吗？',
					confirmColor: '#143080',
					success: ({ confirm }) => {
						if (!confirm) {
							return
						}

						this.records = this.records.map((item) =>
							item.id === record.id
								? {
									...item,
									status: 'cancelled'
								}
								: item
						)
						this.activeTab = 'cancelled'
						uni.showToast({
							title: '已取消挂号',
							icon: 'none'
						})
					}
				})
				return
			}

			uni.navigateTo({
				url: APPOINTMENT_REGISTER_URL
			})
		}
	}
}
</script>

<style scoped lang="scss">
.appointment-records-page {
	position: relative;
	min-height: 100vh;
	background:
		radial-gradient(circle at 24% 0, rgba(232, 236, 245, 0.96) 0, rgba(232, 236, 245, 0.24) 340rpx, rgba(255, 255, 255, 0) 760rpx),
		linear-gradient(180deg, #f8f8f9 0%, #f3f3f4 340rpx, #f5f5f6 100%);
}

.appointment-records-page__glow {
	position: absolute;
	border-radius: 50%;
	pointer-events: none;
	filter: blur(20rpx);
}

.appointment-records-page__glow--left {
	top: -160rpx;
	left: -130rpx;
	width: 380rpx;
	height: 380rpx;
	background: rgba(255, 255, 255, 0.96);
}

.appointment-records-page__glow--right {
	top: 40rpx;
	right: -140rpx;
	width: 360rpx;
	height: 320rpx;
	background: rgba(219, 226, 244, 0.4);
}

.appointment-records-page__header {
	position: sticky;
	top: 0;
	z-index: 10;
	background: rgba(248, 248, 249, 0.96);
	backdrop-filter: blur(10rpx);
}

.appointment-records-page__nav {
	display: flex;
	align-items: center;
	height: 176rpx;
}

.appointment-records-page__back {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 86rpx;
	height: 72rpx;
	margin-left: -8rpx;
}

.appointment-records-page__tabs {
	border-bottom: 1px solid rgba(20, 48, 128, 0.06);
}

.appointment-records-page__tabs-inner {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.appointment-records-page__tab {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	min-width: 120rpx;
	padding: 18rpx 0 24rpx;
}

.appointment-records-page__tab-text {
	font-size: 34rpx;
	font-weight: 500;
	line-height: 1.2;
	color: #9ea3ad;
}

.appointment-records-page__tab.is-active .appointment-records-page__tab-text {
	color: #143080;
	font-weight: 700;
}

.appointment-records-page__tab.is-active::after {
	content: '';
	position: absolute;
	left: 50%;
	bottom: 0;
	width: 74rpx;
	height: 8rpx;
	border-radius: 999rpx 999rpx 0 0;
	background: #143080;
	transform: translateX(-50%);
}

.appointment-records-page__body {
	position: relative;
	z-index: 1;
	padding-top: 40rpx;
	padding-bottom: calc(env(safe-area-inset-bottom) + 56rpx);
}

.record-card + .record-card {
	margin-top: 34rpx;
}

.record-card {
	padding: 36rpx 40rpx 34rpx;
	border-radius: 26rpx;
	background: rgba(255, 255, 255, 0.98);
	box-shadow: 0 14rpx 34rpx rgba(31, 40, 62, 0.06);
}

.record-card__head {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	column-gap: 24rpx;
}

.record-card__title {
	flex: 1;
	min-width: 0;
	font-size: 36rpx;
	font-weight: 700;
	line-height: 1.25;
	color: #20232b;
}

.record-card__status {
	flex: none;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 112rpx;
	height: 58rpx;
	padding: 0 18rpx;
	border-radius: 14rpx;
	font-size: 22rpx;
	font-weight: 500;
	line-height: 1;
}

.record-card__status.is-booked {
	background: #e9eefb;
	color: #143080;
}

.record-card__status.is-issued {
	background: #eceef2;
	color: #666c77;
}

.record-card__status.is-cancelled {
	background: #ffeaea;
	color: #ff6d67;
}

.record-card__status.is-expired {
	background: #fff2de;
	color: #b37a2d;
}

.record-card__details {
	margin-top: 22rpx;
}

.record-card__row {
	display: flex;
	align-items: flex-start;
}

.record-card__row + .record-card__row {
	margin-top: 28rpx;
}

.record-card__label {
	flex: none;
	width: 166rpx;
	font-size: 26rpx;
	line-height: 1.6;
	color: #989eaa;
}

.record-card__value {
	flex: 1;
	min-width: 0;
	font-size: 26rpx;
	line-height: 1.6;
	color: #3f4652;
	word-break: break-all;
}

.record-card__footer {
	display: flex;
	justify-content: flex-end;
	margin-top: 28rpx;
}

.record-card__action {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 174rpx;
	height: 78rpx;
	padding: 0 32rpx;
	border-radius: 20rpx;
	font-size: 24rpx;
	font-weight: 500;
	line-height: 1;
	box-sizing: border-box;
}

.record-card__action.is-booked {
	border: 2rpx solid #8d939d;
	background: #ffffff;
	color: #6c727d;
}

.record-card__action.is-cancelled,
.record-card__action.is-expired {
	border: 2rpx solid #143080;
	background: #ffffff;
	color: #143080;
}

.appointment-records-page__empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 260rpx 40rpx 140rpx;
}

.appointment-records-page__empty-title {
	font-size: 30rpx;
	font-weight: 600;
	line-height: 1.2;
	color: #23262f;
}

.appointment-records-page__empty-desc {
	margin-top: 18rpx;
	font-size: 24rpx;
	line-height: 1.6;
	color: #99a0ab;
	text-align: center;
}

@media screen and (max-width: 360px) {
	.appointment-records-page__tab-text {
		font-size: 30rpx;
	}

	.record-card {
		padding-left: 34rpx;
		padding-right: 34rpx;
	}

	.record-card__label {
		width: 152rpx;
	}
}
</style>
