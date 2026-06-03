<template>
	<view class="project-records-page">
		<view class="project-records-page__glow project-records-page__glow--left"></view>
		<view class="project-records-page__glow project-records-page__glow--right"></view>

		<view class="project-records-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="page-shell project-records-page__nav">
				<view class="project-records-page__back" @tap="goBack">
					<u-icon name="arrow-left" size="46" color="#20232b"></u-icon>
				</view>
			</view>

			<view class="page-shell project-records-page__tabs">
				<view
					v-for="tab in tabs"
					:key="tab.key"
					:class="['project-records-page__tab', activeTab === tab.key ? 'is-active' : '']"
					@tap="setActiveTab(tab.key)"
				>
					{{ tab.label }}
				</view>
			</view>
		</view>

		<view class="page-shell project-records-page__body">
			<view class="project-records-page__toolbar">
				<view class="project-records-page__filter" @tap="showSortSheet = true">
					<text class="project-records-page__filter-text">时间</text>
					<u-icon
						:name="showSortSheet ? 'arrow-up' : 'arrow-down'"
						size="26"
						color="#8e949f"
					></u-icon>
				</view>
			</view>

			<view v-if="visibleRecords.length" class="project-records-page__list">
				<view
					v-for="record in visibleRecords"
					:key="record.id"
					class="project-record-card"
					@tap="navigateToDetail(record)"
				>
					<view class="project-record-card__header">
						<text class="project-record-card__title">{{ record.title }}</text>
						<text
							:class="[
								'project-record-card__status',
								record.remaining ? 'is-remaining' : `is-${record.statusTone || 'neutral'}`
							]"
						>
							{{ record.remaining ? `剩余：${record.remaining}` : record.statusText }}
						</text>
					</view>

					<view class="project-record-card__details">
						<view v-for="detail in record.details" :key="detail.label" class="project-record-card__row">
							<text class="project-record-card__label">{{ detail.label }}</text>
							<text class="project-record-card__value">{{ detail.value }}</text>
						</view>
					</view>

					<view v-if="record.actionLabel" class="project-record-card__footer">
						<button
							class="project-record-card__button"
							hover-class="none"
							@tap.stop="handleRecordAction(record)"
						>
							{{ record.actionLabel }}
						</button>
					</view>
				</view>
			</view>

			<view v-else class="project-records-empty">
				<text class="project-records-empty__title">{{ emptyText.title }}</text>
				<text class="project-records-empty__desc">{{ emptyText.desc }}</text>
			</view>
		</view>

		<u-action-sheet
			v-model="showSortSheet"
			:list="sortSheetOptions"
			:cancel-btn="true"
			:safe-area-inset-bottom="true"
			border-radius="28"
			@click="handleSortSelect"
		></u-action-sheet>
	</view>
</template>

<script>
const USER_TAB_URL = '/pages/user/user'
const SIGN_PAGE_URL = '/bundle/pages/sign_center/sign_center'
const REVIEW_PAGE_URL = '/bundle/pages/guide_review/guide_review'
const DETAIL_PAGE_URL = '/bundle/pages/project_records/detail'

const PAGE_TABS = [
	{ key: 'pending', label: '未治疗' },
	{ key: 'completed', label: '已治疗' }
]

const SORT_OPTIONS = [
	{
		key: 'desc',
		text: '时间从近到远',
		subText: '优先查看最近治疗记录'
	},
	{
		key: 'asc',
		text: '时间从远到近',
		subText: '按最早订单顺序查看'
	}
]

const PENDING_RECORDS = [
	{
		id: 'pending-001',
		title: '新一代高能舒适热玛吉',
		remaining: 3,
		date: '2026-01-01',
		details: [
			{ label: '开单院区：', value: '伊美尔北京光华Soho2期店' },
			{ label: '开单时间：', value: '2026-01-01' },
			{ label: '订单编号：', value: 'YME18289289289' }
		]
	},
	{
		id: 'pending-002',
		title: '新一代高能舒适热玛吉',
		remaining: 2,
		date: '2026-01-12',
		details: [
			{ label: '开单院区：', value: '伊美尔北京光华Soho2期店' },
			{ label: '开单时间：', value: '2026-01-12' },
			{ label: '订单编号：', value: 'YME18289289290' }
		]
	},
	{
		id: 'pending-003',
		title: '超声炮紧致提升',
		remaining: 1,
		date: '2026-02-03',
		details: [
			{ label: '开单院区：', value: '伊美尔北京光华Soho2期店' },
			{ label: '开单时间：', value: '2026-02-03' },
			{ label: '订单编号：', value: 'YME18289289291' }
		]
	}
]

const COMPLETED_RECORDS = [
	{
		id: 'completed-001',
		title: '北京伊美尔光华Soho2期店',
		statusText: '未签字',
		statusTone: 'warning',
		actionLabel: '签字',
		actionType: 'sign',
		date: '2026-02-20',
		details: [
			{ label: '治疗院区：', value: '北京伊美尔光华Soho2期店' },
			{ label: '治疗时间：', value: '2026-02-20' },
			{ label: '治疗项目：', value: '新一代热玛吉*1' }
		]
	},
	{
		id: 'completed-002',
		title: '新一代高能舒适热玛吉',
		statusText: '未评价',
		statusTone: 'accent',
		actionLabel: '评价',
		actionType: 'review',
		reviewDepartment: 0,
		date: '2026-01-18',
		details: [
			{ label: '治疗院区：', value: '北京伊美尔光华Soho2期店' },
			{ label: '治疗时间：', value: '2026-01-18' },
			{ label: '治疗项目：', value: '新一代热玛吉*1' }
		]
	},
	{
		id: 'completed-003',
		title: '新一代高能舒适热玛吉',
		statusText: '已评价',
		statusTone: 'success',
		date: '2026-01-10',
		details: [
			{ label: '治疗院区：', value: '北京伊美尔光华Soho2期店' },
			{ label: '治疗时间：', value: '2026-01-10' },
			{ label: '治疗项目：', value: '新一代热玛吉*1' }
		]
	},
	{
		id: 'completed-004',
		title: '新一代高能舒适热玛吉',
		statusText: '已评价',
		statusTone: 'success',
		date: '2026-01-01',
		details: [
			{ label: '治疗院区：', value: '北京伊美尔光华Soho2期店' },
			{ label: '治疗时间：', value: '2026-01-01' },
			{ label: '治疗项目：', value: '新一代热玛吉*1' }
		]
	}
]

const EMPTY_TEXT = {
	pending: {
		title: '暂无未治疗项目',
		desc: '后续接入真实项目订单后，这里会自动展示剩余次数和开单信息。'
	},
	completed: {
		title: '暂无已治疗记录',
		desc: '完成治疗后，这里会展示签字和评价状态。'
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

function sortRecords(records, sortOrder) {
	return [...records].sort((current, next) => {
		const currentTime = new Date(current.date).getTime()
		const nextTime = new Date(next.date).getTime()
		return sortOrder === 'asc' ? currentTime - nextTime : nextTime - currentTime
	})
}

export default {
	data() {
		return {
			statusBarHeight: getStatusBarHeight(),
			tabs: PAGE_TABS,
			activeTab: 'pending',
			sortOrder: SORT_OPTIONS[0].key,
			sortSheetOptions: SORT_OPTIONS,
			showSortSheet: false,
			pendingRecords: PENDING_RECORDS,
			completedRecords: COMPLETED_RECORDS
		}
	},
	computed: {
		visibleRecords() {
			const records = this.activeTab === 'pending' ? this.pendingRecords : this.completedRecords
			return sortRecords(records, this.sortOrder)
		},
		emptyText() {
			return EMPTY_TEXT[this.activeTab] || EMPTY_TEXT.pending
		}
	},
	methods: {
		setActiveTab(tabKey) {
			this.activeTab = tabKey
		},
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
		handleSortSelect(index) {
			const selectedOption = SORT_OPTIONS[index]
			if (!selectedOption) {
				return
			}

			this.sortOrder = selectedOption.key
		},
		handleRecordAction(record) {
			if (record.actionType === 'sign') {
				uni.navigateTo({
					url: SIGN_PAGE_URL
				})
				return
			}

			if (record.actionType === 'review') {
				uni.navigateTo({
					url: `${REVIEW_PAGE_URL}?department=${record.reviewDepartment || 0}`
				})
				return
			}
		},
		navigateToDetail(record) {
			if (!record || !record.id) {
				return
			}

			uni.navigateTo({
				url: `${DETAIL_PAGE_URL}?id=${encodeURIComponent(record.id)}&status=${this.activeTab}`
			})
		}
	}
}
</script>

<style scoped lang="scss">
.project-records-page {
	position: relative;
	min-height: 100vh;
	background:
		radial-gradient(circle at 50% -8%, rgba(224, 230, 243, 0.92) 0, rgba(224, 230, 243, 0.24) 340rpx, rgba(255, 255, 255, 0) 820rpx),
		linear-gradient(180deg, #f8f9fd 0%, #ffffff 320rpx, #ffffff 100%);
}

.project-records-page__glow {
	position: absolute;
	pointer-events: none;
	border-radius: 50%;
	filter: blur(18rpx);
}

.project-records-page__glow--left {
	top: -120rpx;
	left: -110rpx;
	width: 360rpx;
	height: 360rpx;
	background: rgba(255, 255, 255, 0.9);
}

.project-records-page__glow--right {
	top: 0;
	right: -110rpx;
	width: 380rpx;
	height: 420rpx;
	background: rgba(214, 223, 246, 0.38);
}

.project-records-page__header {
	position: sticky;
	top: 0;
	z-index: 10;
	background: linear-gradient(180deg, rgba(248, 249, 253, 0.98) 0%, rgba(248, 249, 253, 0.92) 100%);
	backdrop-filter: blur(12rpx);
}

.project-records-page__nav {
	display: flex;
	align-items: center;
	height: 90rpx;
}

.project-records-page__back {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 80rpx;
	height: 72rpx;
	margin-left: -8rpx;
}

.project-records-page__tabs {
	display: flex;
	align-items: center;
	justify-content: center;
	column-gap: 204rpx;
	padding-top: 10rpx;
	padding-bottom: 20rpx;
}

.project-records-page__tab {
	position: relative;
	padding: 12rpx 8rpx 24rpx;
	font-size: 34rpx;
	font-weight: 500;
	line-height: 1;
	color: #9a9eaa;
}

.project-records-page__tab.is-active {
	color: #20232b;
	font-weight: 700;
}

.project-records-page__tab.is-active::after {
	content: '';
	position: absolute;
	left: 50%;
	bottom: 0;
	width: 42rpx;
	height: 6rpx;
	border-radius: 999rpx;
	background: #143080;
	transform: translateX(-50%);
}

.project-records-page__body {
	position: relative;
	z-index: 1;
	padding-top: 30rpx;
	padding-bottom: calc(env(safe-area-inset-bottom) + 64rpx);
}

.project-records-page__toolbar {
	display: flex;
	align-items: center;
}

.project-records-page__filter {
	display: inline-flex;
	align-items: center;
	min-height: 58rpx;
}

.project-records-page__filter-text {
	margin-right: 10rpx;
	font-size: 30rpx;
	line-height: 1;
	color: #4a4f5a;
}

.project-records-page__list {
	margin-top: 20rpx;
}

.project-record-card {
	padding: 40rpx 42rpx 34rpx;
	border-radius: 28rpx;
	background: rgba(255, 255, 255, 0.98);
	box-shadow: 0 18rpx 44rpx rgba(32, 41, 72, 0.08);
}

.project-record-card + .project-record-card {
	margin-top: 34rpx;
}

.project-record-card__header {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	column-gap: 24rpx;
}

.project-record-card__title {
	flex: 1;
	min-width: 0;
	font-size: 34rpx;
	font-weight: 700;
	line-height: 1.35;
	color: #2a2f38;
}

.project-record-card__status {
	flex: none;
	font-size: 34rpx;
	font-weight: 700;
	line-height: 1.2;
}

.project-record-card__status.is-remaining {
	color: #143080;
}

.project-record-card__status.is-warning {
	color: #ff694d;
}

.project-record-card__status.is-accent {
	color: #ff8c49;
}

.project-record-card__status.is-success {
	color: #50d86f;
}

.project-record-card__status.is-neutral {
	color: #8e949f;
}

.project-record-card__details {
	margin-top: 26rpx;
}

.project-record-card__row {
	display: flex;
	align-items: flex-start;
}

.project-record-card__row + .project-record-card__row {
	margin-top: 26rpx;
}

.project-record-card__label {
	flex: none;
	width: 176rpx;
	font-size: 26rpx;
	line-height: 1.5;
	color: #9ca1ab;
}

.project-record-card__value {
	flex: 1;
	min-width: 0;
	font-size: 26rpx;
	line-height: 1.5;
	color: #444b57;
	word-break: break-all;
}

.project-record-card__footer {
	display: flex;
	justify-content: flex-end;
	margin-top: 28rpx;
}

.project-record-card__button {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 184rpx;
	height: 76rpx;
	border: 2rpx solid #143080;
	border-radius: 22rpx;
	font-size: 28rpx;
	line-height: 1;
	color: #143080;
	background: #ffffff;
}

.project-records-empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 260rpx 40rpx 160rpx;
}

.project-records-empty__title {
	font-size: 30rpx;
	font-weight: 600;
	line-height: 1.2;
	color: #23262f;
}

.project-records-empty__desc {
	margin-top: 18rpx;
	font-size: 24rpx;
	line-height: 1.6;
	color: #9ca1ab;
	text-align: center;
}
</style>
