<template>
	<view class="order-page">
		<view class="order-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="page-shell order-page__nav">
				<view class="order-page__back" @tap="goBack">
					<u-icon name="arrow-left" size="48" color="#161616"></u-icon>
				</view>
			</view>
		</view>

		<scroll-view class="order-page__tabs-wrap" scroll-x enable-flex :show-scrollbar="false">
			<view class="page-shell order-tabs">
				<view
					v-for="item in tabs"
					:key="item.value"
					:class="['order-tabs__item', activeTab === item.value ? 'is-active' : '']"
					@tap="activeTab = item.value"
				>
					<text class="order-tabs__label">{{ item.label }}</text>
					<view class="order-tabs__line"></view>
				</view>
			</view>
		</scroll-view>

		<view class="page-shell order-page__body">
			<view v-for="item in filteredOrders" :key="item.id" class="order-card">
				<view class="order-card__head">
					<view class="order-card__head-left">
						<text class="order-card__time">{{ item.time }}</text>
						<text v-if="item.tag" class="order-card__tag">{{ item.tag }}</text>
					</view>
					<text :class="['order-card__status', `is-${item.status}`]">{{ item.statusText }}</text>
				</view>

				<view class="order-card__content">
					<image class="order-card__image" :src="item.image" mode="aspectFill"></image>

					<view class="order-card__main">
						<text class="order-card__title line-1">{{ item.title }}</text>
						<text class="order-card__amount">实付款¥{{ item.amount }}</text>
					</view>

					<view class="order-card__aside">
						<text class="order-card__count">X{{ item.quantity }}</text>
					</view>
				</view>

				<view v-if="item.notice || item.actions.length" class="order-card__footer">
					<text v-if="item.notice" class="order-card__notice">{{ item.notice }}</text>
					<view class="order-card__actions">
						<button
							v-for="action in item.actions"
							:key="action.label"
							:class="['order-card__action', `is-${action.tone}`]"
							hover-class="none"
							@tap="handleAction(action, item)"
						>
							{{ action.label }}
						</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
const TABS = [
	{ label: '全部', value: 'all' },
	{ label: '待支付', value: 'pending' },
	{ label: '已支付/待核销', value: 'paid_verify' },
	{ label: '已撤销', value: 'canceled' },
	{ label: '已完成', value: 'completed' }
]

const ORDER_LIST = [
	{
		id: 'order-001',
		time: '2026/05/12 17:11',
		tag: '',
		status: 'pending',
		statusText: '待支付',
		title: '年度医美计划',
		amount: '15.4',
		quantity: 1,
		image: '/static/linshi/01.png',
		notice: '剩余支付时间: 15:00',
		actions: [
			{ label: '取消', tone: 'minor', type: 'cancel' },
			{ label: '付款', tone: 'primary', type: 'pay' }
		]
	},
	{
		id: 'order-002',
		time: '2026/05/12 17:11',
		tag: '',
		status: 'paid',
		statusText: '已支付',
		title: '年度医美计划',
		amount: '15.4',
		quantity: 1,
		image: '/static/linshi/02.png',
		notice: '',
		actions: [{ label: '申请售后', tone: 'primary', type: 'after_sale' }]
	},
	{
		id: 'order-003',
		time: '2026/05/12 17:11',
		tag: '权益订单',
		status: 'verify',
		statusText: '待核销',
		title: '年度医美计划',
		amount: '15.4',
		quantity: 1,
		image: '/static/linshi/03.png',
		notice: '请您在院区前台出示订单信息核销',
		actions: [{ label: '去核销', tone: 'primary', type: 'verify' }]
	},
	{
		id: 'order-004',
		time: '2026/05/12 17:11',
		tag: '',
		status: 'canceled',
		statusText: '已撤销',
		title: '年度医美计划',
		amount: '15.4',
		quantity: 1,
		image: '/static/linshi/04.png',
		notice: '',
		actions: []
	},
	{
		id: 'order-005',
		time: '2026/05/12 17:11',
		tag: '',
		status: 'completed',
		statusText: '已完成',
		title: '年度医美计划',
		amount: '15.4',
		quantity: 1,
		image: '/static/linshi/05.png',
		notice: '',
		actions: []
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

function getInitialTab(tab) {
	const values = TABS.map((item) => item.value)
	return values.includes(tab) ? tab : 'all'
}

export default {
	data() {
		return {
			statusBarHeight: getStatusBarHeight(),
			tabs: TABS,
			activeTab: 'all',
			orderList: ORDER_LIST
		}
	},
	computed: {
		filteredOrders() {
			if (this.activeTab === 'all') {
				return this.orderList
			}

			if (this.activeTab === 'paid_verify') {
				return this.orderList.filter((item) => ['paid', 'verify'].includes(item.status))
			}

			return this.orderList.filter((item) => item.status === this.activeTab)
		}
	},
	onLoad(options = {}) {
		this.activeTab = getInitialTab(options.tab)
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
		handleAction(action) {
			uni.showToast({
				title: `${action.label}待接入`,
				icon: 'none'
			})
		}
	}
}
</script>

<style scoped lang="scss">
	.order-page {
		min-height: 100vh;
		background: #ffffff;
	}

	.order-page__nav {
		display: flex;
		align-items: center;
		height: 96rpx;
	}

	.order-page__back {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		width: 72rpx;
		height: 72rpx;
		margin-left: -12rpx;
	}

	.order-page__tabs-wrap {
		background: #ffffff;
	}

	.order-tabs {
		display: inline-flex;
		align-items: flex-end;
		min-width: 100%;
		padding-top: 26rpx;
		padding-bottom: 12rpx;
		box-sizing: border-box;
	}

	.order-tabs__item {
		position: relative;
		flex: none;
		margin-right: 64rpx;
		padding-bottom: 18rpx;
	}

	.order-tabs__item:last-child {
		margin-right: 0;
	}

	.order-tabs__label {
		display: block;
		font-size: 32rpx;
		line-height: 1.2;
		color: #8d919a;
		white-space: nowrap;
	}

	.order-tabs__line {
		position: absolute;
		left: 50%;
		bottom: 0;
		width: 0;
		height: 6rpx;
		border-radius: 999rpx;
		background: #143080;
		transform: translateX(-50%);
		transition: width 0.2s ease;
	}

	.order-tabs__item.is-active .order-tabs__label {
		font-weight: 700;
		color: #143080;
	}

	.order-tabs__item.is-active .order-tabs__line {
		width: 40rpx;
	}

	.order-page__body {
		padding-top: 34rpx;
		padding-bottom: calc(80rpx + env(safe-area-inset-bottom));
	}

	.order-card + .order-card {
		margin-top: 52rpx;
	}

	.order-card__head,
	.order-card__head-left,
	.order-card__content,
	.order-card__footer,
	.order-card__actions {
		display: flex;
	}

	.order-card__head,
	.order-card__footer {
		align-items: center;
		justify-content: space-between;
	}

	.order-card__head-left,
	.order-card__content {
		align-items: flex-start;
	}

	.order-card__time {
		font-size: 28rpx;
		line-height: 1.2;
		color: #8f949e;
	}

	.order-card__tag {
		margin-left: 20rpx;
		padding: 10rpx 18rpx;
		border-radius: 12rpx;
		background: #eef3ff;
		font-size: 24rpx;
		line-height: 1;
		color: #4963aa;
	}

	.order-card__status {
		margin-left: 24rpx;
		font-size: 28rpx;
		line-height: 1.2;
		color: #21242b;
	}

	.order-card__status.is-pending {
		padding: 12rpx 18rpx;
		border-radius: 12rpx;
		background: #fff1ef;
		color: #ff765f;
	}

	.order-card__status.is-canceled {
		color: #8f949e;
	}

	.order-card__content {
		margin-top: 28rpx;
	}

	.order-card__image {
		flex: none;
		width: 184rpx;
		height: 184rpx;
		border-radius: 18rpx;
		background: #eef1f5;
	}

	.order-card__main {
		flex: 1;
		min-width: 0;
		margin-left: 24rpx;
		padding-top: 8rpx;
	}

	.order-card__title {
		display: block;
		font-size: 34rpx;
		font-weight: 500;
		line-height: 1.3;
		color: #191b20;
	}

	.order-card__amount {
		display: block;
		margin-top: 30rpx;
		font-size: 28rpx;
		line-height: 1.2;
		color: #8f949e;
	}

	.order-card__aside {
		flex: none;
		display: flex;
		align-items: flex-start;
		justify-content: flex-end;
		width: 72rpx;
		padding-top: 18rpx;
	}

	.order-card__count {
		font-size: 34rpx;
		line-height: 1.2;
		color: #242731;
	}

	.order-card__footer {
		margin-top: 28rpx;
		min-height: 48rpx;
	}

	.order-card__notice {
		flex: 1;
		min-width: 0;
		padding-right: 24rpx;
		font-size: 24rpx;
		line-height: 1.5;
		color: #8f949e;
	}

	.order-card__actions {
		flex: none;
		align-items: center;
		justify-content: flex-end;
	}

	.order-card__action {
		flex: none;
		font-size: 26rpx;
		line-height: 1.2;
	}

	.order-card__action + .order-card__action {
		margin-left: 32rpx;
	}

	.order-card__action.is-minor {
		color: #8f949e;
	}

	.order-card__action.is-primary {
		color: #143080;
		font-weight: 500;
	}
</style>
