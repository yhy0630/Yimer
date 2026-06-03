<template>
	<view class="scan-take-page">
		<view class="scan-take-page__glow scan-take-page__glow--left"></view>
		<view class="scan-take-page__glow scan-take-page__glow--right"></view>

		<view class="scan-take-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="page-shell scan-take-page__nav">
				<view class="scan-take-page__back" @tap="goBack">
					<u-icon name="arrow-left" size="48" color="#20232b"></u-icon>
				</view>
			</view>

			<view class="page-shell scan-take-page__tabs">
				<view
					v-for="tab in tabs"
					:key="tab.key"
					:class="['scan-take-page__tab', activeTab === tab.key ? 'is-active' : '']"
					@tap="setActiveTab(tab.key)"
				>
					{{ tab.label }}
				</view>
			</view>
		</view>

		<view :class="['page-shell', 'scan-take-page__body', activeTab === 'booked' ? 'has-footer' : '']">
			<view
				v-for="order in visibleOrders"
				:key="order.id"
				class="pickup-card"
				@tap="handleOrderTap(order)"
			>
				<view class="pickup-card__head">
					<text class="pickup-card__order">订单号：{{ order.orderNo }}</text>
					<text
						:class="[
							'pickup-card__status',
							order.statusKey === 'booked' ? 'is-booked' : 'is-cancelled'
						]"
					>
						{{ order.statusText }}
					</text>
				</view>

				<view class="pickup-card__content">
					<view class="pickup-card__details">
						<view v-for="detail in order.details" :key="detail.label" class="pickup-card__row">
							<text class="pickup-card__label">{{ detail.label }}</text>
							<text class="pickup-card__value">{{ detail.value }}</text>
						</view>
					</view>

					<view
						v-if="activeTab === 'booked'"
						:class="['pickup-card__check', selectedOrderIds.includes(order.id) ? 'is-selected' : '']"
						@tap="toggleOrder(order.id)"
					>
						<view class="pickup-card__check-icon"></view>
					</view>
				</view>
			</view>

			<view v-if="!visibleOrders.length" class="scan-take-page__empty">
				<text class="scan-take-page__empty-title">{{ emptyState.title }}</text>
				<text class="scan-take-page__empty-desc">{{ emptyState.desc }}</text>
			</view>
		</view>

		<view v-if="activeTab === 'booked'" class="scan-take-page__footer">
			<view class="page-shell scan-take-page__footer-inner">
				<view class="scan-take-page__select-all" @tap="toggleSelectAll">
					<view :class="['scan-take-page__radio', isAllSelected ? 'is-selected' : '']">
						<view class="scan-take-page__radio-dot"></view>
					</view>
					<text class="scan-take-page__select-text">全选</text>
					<view class="scan-take-page__divider"></view>
					<text class="scan-take-page__selected-text">已选 {{ selectedCount }} 份</text>
				</view>

				<button class="scan-take-page__submit" @tap="submitTakeNumber">一键取号</button>
			</view>
		</view>
	</view>
</template>

<script>
const HOME_TAB_URL = '/pages/index/index'

const PAGE_TABS = [
	{
		key: 'booked',
		label: '已预约'
	},
	{
		key: 'cancelled',
		label: '已取消'
	}
]

const BOOKED_ORDERS = [
	{
		id: 'booked-001',
		orderNo: '78965269',
		statusText: '已预约',
		statusKey: 'booked',
		details: [
			{ label: '挂号目的：', value: '治疗' },
			{ label: '挂号院区：', value: '北京伊美尔光华Soho2期' },
			{ label: '挂号科室：', value: '美容皮肤科（微创）' },
			{ label: '挂号项目：', value: '新一代高能舒适热玛吉' },
			{ label: '挂号时间：', value: '2026-02-15 11:05' }
		]
	},
	{
		id: 'booked-002',
		orderNo: '78965270',
		statusText: '已预约',
		statusKey: 'booked',
		details: [
			{ label: '挂号目的：', value: '治疗' },
			{ label: '挂号院区：', value: '北京伊美尔光华Soho2期' },
			{ label: '挂号科室：', value: '美容皮肤科（微创）' },
			{ label: '挂号项目：', value: '超声炮紧致提升' },
			{ label: '挂号时间：', value: '2026-02-15 13:20' }
		]
	},
	{
		id: 'booked-003',
		orderNo: '78965271',
		statusText: '已预约',
		statusKey: 'booked',
		details: [
			{ label: '挂号目的：', value: '复诊' },
			{ label: '挂号院区：', value: '北京伊美尔光华Soho2期' },
			{ label: '挂号科室：', value: '美容皮肤科（微创）' },
			{ label: '挂号项目：', value: '光电嫩肤面诊' },
			{ label: '挂号时间：', value: '2026-02-16 09:40' }
		]
	}
]

const CANCELLED_ORDERS = [
	{
		id: 'cancelled-001',
		orderNo: '78965260',
		statusText: '已取消',
		statusKey: 'cancelled',
		details: [
			{ label: '挂号目的：', value: '治疗' },
			{ label: '挂号院区：', value: '北京伊美尔光华Soho2期' },
			{ label: '挂号科室：', value: '美容皮肤科（微创）' },
			{ label: '挂号项目：', value: '新一代高能舒适热玛吉' },
			{ label: '挂号时间：', value: '2026-02-14 15:10' }
		]
	},
	{
		id: 'cancelled-002',
		orderNo: '78965261',
		statusText: '已取消',
		statusKey: 'cancelled',
		details: [
			{ label: '挂号目的：', value: '咨询' },
			{ label: '挂号院区：', value: '北京伊美尔光华Soho2期' },
			{ label: '挂号科室：', value: '美容皮肤科（微创）' },
			{ label: '挂号项目：', value: '皮肤检测面诊' },
			{ label: '挂号时间：', value: '2026-02-13 10:00' }
		]
	}
]

const EMPTY_STATE = {
	booked: {
		title: '暂无已预约订单',
		desc: '后续接入真实扫码结果后，这里会展示可取号的预约单。'
	},
	cancelled: {
		title: '暂无已取消订单',
		desc: '取消后的预约单会在这里留档，方便后续核对。'
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

export default {
	data() {
		return {
			statusBarHeight: getStatusBarHeight(),
			tabs: PAGE_TABS,
			activeTab: 'booked',
			bookedOrders: BOOKED_ORDERS,
			cancelledOrders: CANCELLED_ORDERS,
			selectedOrderIds: BOOKED_ORDERS.slice(0, 2).map((item) => item.id)
		}
	},
	computed: {
		visibleOrders() {
			return this.activeTab === 'booked' ? this.bookedOrders : this.cancelledOrders
		},
		selectedCount() {
			return this.selectedOrderIds.length
		},
		isAllSelected() {
			return this.bookedOrders.length > 0 && this.selectedOrderIds.length === this.bookedOrders.length
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
				url: HOME_TAB_URL
			})
		},
		setActiveTab(tabKey) {
			this.activeTab = tabKey
		},
		toggleOrder(orderId) {
			const currentIndex = this.selectedOrderIds.indexOf(orderId)

			if (currentIndex > -1) {
				this.selectedOrderIds = this.selectedOrderIds.filter((id) => id !== orderId)
				return
			}

			this.selectedOrderIds = [...this.selectedOrderIds, orderId]
		},
		toggleSelectAll() {
			if (this.isAllSelected) {
				this.selectedOrderIds = []
				return
			}

			this.selectedOrderIds = this.bookedOrders.map((item) => item.id)
		},
		handleOrderTap(order) {
			if (this.activeTab !== 'cancelled') {
				return
			}

			uni.navigateTo({
				url: `/bundle/pages/take_number_info/take_number_info?orderId=${order.id}&status=cancelled`
			})
		},
		submitTakeNumber() {
			if (!this.selectedCount) {
				uni.showToast({
					title: '请先选择预约单',
					icon: 'none'
				})
				return
			}

			const targetOrder = this.bookedOrders.find((item) => this.selectedOrderIds.includes(item.id))

			uni.navigateTo({
				url: `/bundle/pages/take_number_info/take_number_info?orderId=${targetOrder ? targetOrder.id : ''}`
			})
		}
	}
}
</script>

<style scoped lang="scss">
.scan-take-page {
	position: relative;
	min-height: 100vh;
	background:
		radial-gradient(circle at 50% -8%, rgba(231, 235, 244, 0.95) 0, rgba(231, 235, 244, 0.28) 340rpx, rgba(255, 255, 255, 0) 900rpx),
		linear-gradient(180deg, #f6f7fb 0%, #ffffff 320rpx, #ffffff 100%);
}

.scan-take-page__glow {
	position: absolute;
	border-radius: 50%;
	pointer-events: none;
	filter: blur(18rpx);
}

.scan-take-page__glow--left {
	top: -140rpx;
	left: -120rpx;
	width: 380rpx;
	height: 380rpx;
	background: rgba(255, 255, 255, 0.92);
}

.scan-take-page__glow--right {
	top: -20rpx;
	right: -120rpx;
	width: 400rpx;
	height: 420rpx;
	background: rgba(221, 227, 245, 0.55);
}

.scan-take-page__header {
	position: sticky;
	top: 0;
	z-index: 10;
	background: linear-gradient(180deg, rgba(246, 247, 251, 0.98) 0%, rgba(246, 247, 251, 0.92) 100%);
	backdrop-filter: blur(12rpx);
}

.scan-take-page__nav {
	display: flex;
	align-items: center;
	height: 88rpx;
}

.scan-take-page__back {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 80rpx;
	height: 72rpx;
	margin-left: -8rpx;
}

.scan-take-page__tabs {
	display: flex;
	align-items: center;
	justify-content: center;
	column-gap: 206rpx;
	padding-top: 12rpx;
	padding-bottom: 18rpx;
}

.scan-take-page__tab {
	position: relative;
	padding: 12rpx 4rpx 28rpx;
	font-size: 34rpx;
	font-weight: 500;
	line-height: 1;
	color: #9ca0ab;
}

.scan-take-page__tab.is-active {
	color: #20232b;
	font-weight: 700;
}

.scan-take-page__tab.is-active::after {
	content: '';
	position: absolute;
	left: 50%;
	bottom: 0;
	width: 42rpx;
	height: 6rpx;
	border-radius: 999rpx;
	background: #20232b;
	transform: translateX(-50%);
}

.scan-take-page__body {
	position: relative;
	z-index: 1;
	padding-top: 26rpx;
	padding-bottom: calc(env(safe-area-inset-bottom) + 72rpx);
}

.scan-take-page__body.has-footer {
	padding-bottom: calc(env(safe-area-inset-bottom) + 220rpx);
}

.pickup-card {
	padding: 40rpx 42rpx 36rpx;
	border-radius: 28rpx;
	background: rgba(255, 255, 255, 0.98);
	box-shadow: 0 18rpx 44rpx rgba(27, 35, 63, 0.08);
}

.pickup-card + .pickup-card {
	margin-top: 34rpx;
}

.pickup-card__head {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	column-gap: 24rpx;
}

.pickup-card__order {
	flex: 1;
	min-width: 0;
	font-size: 34rpx;
	font-weight: 700;
	line-height: 1.35;
	color: #333844;
}

.pickup-card__status {
	flex: none;
	font-size: 34rpx;
	font-weight: 700;
	line-height: 1.2;
}

.pickup-card__status.is-booked {
	color: #143080;
}

.pickup-card__status.is-cancelled {
	color: #9ca0ab;
}

.pickup-card__content {
	display: flex;
	align-items: center;
	margin-top: 28rpx;
}

.pickup-card__details {
	flex: 1;
	min-width: 0;
}

.pickup-card__row {
	display: flex;
	align-items: flex-start;
}

.pickup-card__row + .pickup-card__row {
	margin-top: 26rpx;
}

.pickup-card__label {
	flex: none;
	width: 176rpx;
	font-size: 26rpx;
	line-height: 1.5;
	color: #9ca1ab;
}

.pickup-card__value {
	flex: 1;
	min-width: 0;
	font-size: 26rpx;
	line-height: 1.5;
	color: #444b57;
	word-break: break-all;
}

.pickup-card__check {
	position: relative;
	flex: none;
	width: 52rpx;
	height: 52rpx;
	margin-left: 24rpx;
	border: 2rpx solid #d9dde8;
	border-radius: 8rpx;
	background: #ffffff;
	box-sizing: border-box;
}

.pickup-card__check.is-selected {
	border-color: #143080;
	background: #143080;
}

.pickup-card__check-icon {
	position: absolute;
	left: 16rpx;
	top: 8rpx;
	width: 12rpx;
	height: 24rpx;
	border-right: 4rpx solid transparent;
	border-bottom: 4rpx solid transparent;
	transform: rotate(45deg);
}

.pickup-card__check.is-selected .pickup-card__check-icon {
	border-right-color: #ffffff;
	border-bottom-color: #ffffff;
}

.scan-take-page__empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 260rpx 40rpx 160rpx;
}

.scan-take-page__empty-title {
	font-size: 30rpx;
	font-weight: 600;
	line-height: 1.2;
	color: #23262f;
}

.scan-take-page__empty-desc {
	margin-top: 18rpx;
	font-size: 24rpx;
	line-height: 1.6;
	color: #9ca1ab;
	text-align: center;
}

.scan-take-page__footer {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 20;
	padding: 18rpx 0 24rpx;
	background: rgba(255, 255, 255, 0.96);
	box-shadow: 0 -10rpx 30rpx rgba(26, 34, 59, 0.06);
}

/* #ifdef APP-PLUS */
.scan-take-page__footer {
	padding-bottom: calc(24rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
}
/* #endif */

/* #ifdef MP-WEIXIN */
.scan-take-page__footer {
	padding-bottom: calc(24rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
}
/* #endif */

.scan-take-page__footer-inner {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.scan-take-page__select-all {
	display: flex;
	align-items: center;
	flex: 1;
	min-width: 0;
	padding-right: 24rpx;
}

.scan-take-page__radio {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 44rpx;
	height: 44rpx;
	border: 3rpx solid #143080;
	border-radius: 50%;
	box-sizing: border-box;
}

.scan-take-page__radio-dot {
	width: 18rpx;
	height: 18rpx;
	border-radius: 50%;
	background: transparent;
}

.scan-take-page__radio.is-selected .scan-take-page__radio-dot {
	background: #143080;
}

.scan-take-page__select-text {
	margin-left: 18rpx;
	font-size: 30rpx;
	font-weight: 600;
	line-height: 1;
	color: #27303d;
}

.scan-take-page__divider {
	width: 2rpx;
	height: 36rpx;
	margin: 0 20rpx;
	background: #e3e6ef;
}

.scan-take-page__selected-text {
	font-size: 26rpx;
	line-height: 1;
	color: #3a4251;
}

.scan-take-page__submit {
	flex: none;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 356rpx;
	height: 96rpx;
	border-radius: 999rpx;
	background: #143080;
	font-size: 34rpx;
	font-weight: 600;
	line-height: 1;
	color: #ffffff;
}

.scan-take-page__submit::after {
	border: none;
}
</style>
