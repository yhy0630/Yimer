<template>
	<view class="sign-center-page">
		<view class="sign-center-page__glow sign-center-page__glow--left"></view>
		<view class="sign-center-page__glow sign-center-page__glow--right"></view>

		<view class="sign-center-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="page-shell sign-center-page__nav">
				<view class="sign-center-page__back" @tap="goBack">
					<u-icon name="arrow-left" size="46" color="#20232b"></u-icon>
				</view>
			</view>

			<view class="page-shell sign-center-page__tabs">
				<view
					v-for="tab in tabs"
					:key="tab.key"
					:class="['sign-center-page__tab', activeTab === tab.key ? 'is-active' : '']"
					@tap="setActiveTab(tab.key)"
				>
					{{ tab.label }}
				</view>
			</view>
		</view>

		<view class="page-shell sign-center-page__body" :class="{ 'has-footer': activeTab === 'pending' }">
			<view v-for="group in visibleGroups" :key="group.id" class="sign-card">
				<view class="sign-card__header">
					<view class="sign-card__title-wrap">
						<view class="sign-card__mark"></view>
						<text class="sign-card__date">{{ group.date }}</text>
						<text class="sign-card__tag">{{ group.tag }}</text>
					</view>
				</view>

				<view class="sign-card__location">
					<view class="sign-card__location-icon">
						<view class="sign-card__location-dot"></view>
					</view>
					<text class="sign-card__location-text line-1">{{ group.campus }}</text>
				</view>

				<view class="sign-card__list">
					<view
						v-for="document in group.documents"
						:key="document.id"
						class="sign-card__item"
						@tap="handleDocumentTap(document)"
					>
						<text class="sign-card__item-title line-1">{{ document.title }}</text>

						<view v-if="activeTab === 'pending'" class="sign-card__item-action">
							<view
								:class="['selection-indicator', isDocumentSelected(document.id) ? 'is-checked' : '']"
							></view>
						</view>

						<view v-else class="sign-card__history-meta">
							<text class="sign-card__history-time">{{ document.signedAt }}</text>
							<view class="sign-card__history-status">
								<text class="sign-card__history-status-text">{{ copywriting.completed }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view v-if="!visibleGroups.length" class="sign-empty">
				<text class="sign-empty__title">{{ emptyTitle }}</text>
				<text class="sign-empty__desc">{{ copywriting.emptyDesc }}</text>
			</view>
		</view>

		<view v-if="activeTab === 'pending'" class="sign-center-page__footer">
			<view class="page-shell sign-center-page__footer-inner">
				<view class="sign-center-page__select-all" @tap="toggleSelectAll">
					<view :class="['selection-indicator', isAllSelected ? 'is-checked' : '']"></view>
					<text class="sign-center-page__select-all-text">{{ copywriting.selectAll }}</text>
				</view>

				<text class="sign-center-page__count">
					{{ copywriting.selectedPrefix }} {{ selectedPendingCount }} {{ copywriting.selectedUnit }}
				</text>

				<button
					class="sign-center-page__cta"
					:class="{ 'is-disabled': !selectedPendingCount }"
					:disabled="!selectedPendingCount"
					@tap="handleStartSign"
				>
					{{ copywriting.startSign }}
				</button>
			</view>
		</view>
	</view>
</template>

<script>
const COPYWRITING = Object.freeze({
	completed: '\u5df2\u7b7e\u7f72',
	emptyPending: '\u6682\u65e0\u5f85\u7b7e\u7f72\u6587\u4ef6',
	emptyHistory: '\u6682\u65e0\u5386\u53f2\u7b7e\u7f72\u8bb0\u5f55',
	emptyDesc: '\u540e\u7eed\u63a5\u5165\u771f\u5b9e\u6570\u636e\u540e\u53ef\u76f4\u63a5\u66ff\u6362\u5f53\u524d\u9759\u6001\u914d\u7f6e\u3002',
	selectAll: '\u5168\u9009',
	selectedPrefix: '\u5df2\u9009',
	selectedUnit: '\u4efd',
	startSign: '\u5f00\u59cb\u7b7e\u7f72'
})

const PAGE_TABS = [
	{ key: 'pending', label: '\u5f85\u6211\u7b7e\u7f72' },
	{ key: 'history', label: '\u5386\u53f2\u7b7e\u7f72' }
]

const SIGN_GROUPS = [
	{
		id: 'visit-20260101-a',
		date: '2026/01/01',
		tag: '\u5230\u5e97',
		campus: '\u5317\u4eac\u4f0a\u7f8e\u5c14\u5149\u534e Soho2 \u671f\u5e97',
		documents: [
			{
				id: 'doc-001',
				title: '\u5149\u5b50\u5ae9\u80a4\u77e5\u60c5\u540c\u610f\u4e66',
				type: 'consent',
				status: 'pending'
			},
			{
				id: 'doc-002',
				title: '\u76ae\u80a4\u68c0\u6d4b\u77e5\u60c5\u540c\u610f\u4e66',
				type: 'consent',
				status: 'pending'
			},
			{
				id: 'doc-003',
				title: '\u5149\u5b50\u5ae9\u80a4\u6cbb\u7597\u5355',
				type: 'treatment',
				status: 'pending'
			},
			{
				id: 'doc-004',
				title: '\u672f\u540e\u62a4\u7406\u7b7e\u6536\u5355',
				type: 'treatment',
				status: 'completed',
				signedAt: '2026/01/01 18:12'
			}
		]
	},
	{
		id: 'visit-20260103-b',
		date: '2026/01/03',
		tag: '\u5230\u5e97',
		campus: '\u5317\u4eac\u4f0a\u7f8e\u5c14\u5149\u534e Soho2 \u671f\u5e97',
		documents: [
			{
				id: 'doc-005',
				title: '\u5fae\u9488\u6cbb\u7597\u77e5\u60c5\u540c\u610f\u4e66',
				type: 'consent',
				status: 'pending'
			},
			{
				id: 'doc-006',
				title: '\u5fae\u9488\u6cbb\u7597\u5355',
				type: 'treatment',
				status: 'pending'
			},
			{
				id: 'doc-007',
				title: '\u672f\u540e\u590d\u8bca\u786e\u8ba4\u5355',
				type: 'treatment',
				status: 'pending'
			},
			{
				id: 'doc-008',
				title: '\u9762\u8bca\u77e5\u60c5\u786e\u8ba4\u4e66',
				type: 'consent',
				status: 'completed',
				signedAt: '2026/01/03 14:36'
			}
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

function getPendingDocumentIds(groups) {
	return groups.reduce((result, group) => {
		group.documents.forEach((document) => {
			if (document.status === 'pending') {
				result.push(document.id)
			}
		})

		return result
	}, [])
}

function getDefaultSelectedIds(groups, entry) {
	let matchedDocument = null

	groups.some((group) => {
		matchedDocument = group.documents.find((document) => {
			return document.status === 'pending' && (!entry || document.type === entry)
		})

		return Boolean(matchedDocument)
	})

	return matchedDocument ? [matchedDocument.id] : []
}

export default {
	data() {
		return {
			statusBarHeight: getStatusBarHeight(),
			copywriting: COPYWRITING,
			tabs: PAGE_TABS,
			activeTab: 'pending',
			signGroups: SIGN_GROUPS,
			selectedDocumentIds: []
		}
	},
	computed: {
		visibleGroups() {
			return this.signGroups
				.map((group) => ({
					...group,
					documents: group.documents.filter((document) => {
						if (this.activeTab === 'pending') {
							return document.status === 'pending'
						}

						return document.status === 'completed'
					})
				}))
				.filter((group) => group.documents.length)
		},
		pendingDocumentIds() {
			return getPendingDocumentIds(this.signGroups)
		},
		selectedPendingCount() {
			return this.selectedDocumentIds.filter((id) => this.pendingDocumentIds.includes(id)).length
		},
		isAllSelected() {
			return this.pendingDocumentIds.length > 0 && this.selectedPendingCount === this.pendingDocumentIds.length
		},
		emptyTitle() {
			if (this.activeTab === 'pending') {
				return this.copywriting.emptyPending
			}

			return this.copywriting.emptyHistory
		}
	},
	onLoad(options = {}) {
		this.selectedDocumentIds = getDefaultSelectedIds(this.signGroups, options.entry)
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
				url: '/pages/index/index'
			})
		},
		isDocumentSelected(documentId) {
			return this.selectedDocumentIds.includes(documentId)
		},
		toggleDocumentSelection(documentId) {
			if (this.isDocumentSelected(documentId)) {
				this.selectedDocumentIds = this.selectedDocumentIds.filter((id) => id !== documentId)
				return
			}

			this.selectedDocumentIds = [...this.selectedDocumentIds, documentId]
		},
		handleDocumentTap(document) {
			if (this.activeTab === 'history') {
				uni.showToast({
					title: document.title,
					icon: 'none'
				})
				return
			}

			this.toggleDocumentSelection(document.id)
		},
		toggleSelectAll() {
			this.selectedDocumentIds = this.isAllSelected ? [] : [...this.pendingDocumentIds]
		},
		handleStartSign() {
			if (!this.selectedPendingCount) {
				return
			}

			uni.navigateTo({
				url: `/bundle/pages/sign_document/sign_document?selected=${this.selectedDocumentIds.join(',')}`
			})
		}
	}
}
</script>

<style scoped lang="scss">
.sign-center-page {
	position: relative;
	min-height: 100vh;
	background:
		radial-gradient(circle at 50% -4%, rgba(221, 227, 244, 0.9) 0, rgba(221, 227, 244, 0.24) 300rpx, rgba(255, 255, 255, 0) 720rpx),
		linear-gradient(180deg, #f8f9fd 0%, #ffffff 360rpx, #ffffff 100%);
}

.sign-center-page__glow {
	position: absolute;
	pointer-events: none;
	border-radius: 50%;
	filter: blur(18rpx);
}

.sign-center-page__glow--left {
	top: -120rpx;
	left: -110rpx;
	width: 360rpx;
	height: 360rpx;
	background: rgba(255, 255, 255, 0.9);
}

.sign-center-page__glow--right {
	top: 120rpx;
	right: -90rpx;
	width: 300rpx;
	height: 220rpx;
	background: rgba(214, 223, 246, 0.42);
}

.sign-center-page__header {
	position: sticky;
	top: 0;
	z-index: 10;
	background: linear-gradient(180deg, rgba(248, 249, 253, 0.98) 0%, rgba(248, 249, 253, 0.92) 100%);
	backdrop-filter: blur(12rpx);
}

.sign-center-page__nav {
	display: flex;
	align-items: center;
	height: 90rpx;
}

.sign-center-page__back {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 80rpx;
	height: 72rpx;
	margin-left: -8rpx;
}

.sign-center-page__tabs {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-top: 18rpx;
	padding-bottom: 20rpx;
}

.sign-center-page__tab {
	position: relative;
	padding: 10rpx 8rpx 24rpx;
	font-size: 34rpx;
	font-weight: 500;
	line-height: 1;
	color: #9a9eaa;
}

.sign-center-page__tab.is-active {
	color: #20232b;
	font-weight: 700;
}

.sign-center-page__tab.is-active::after {
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

.sign-center-page__body {
	position: relative;
	z-index: 1;
	padding-top: 28rpx;
	padding-bottom: 56rpx;
}

.sign-center-page__body.has-footer {
	padding-bottom: calc(env(safe-area-inset-bottom) + 220rpx);
}

.sign-card {
	padding: 34rpx 40rpx 20rpx;
	border-radius: 28rpx;
	background: rgba(255, 255, 255, 0.98);
	box-shadow: 0 18rpx 44rpx rgba(32, 41, 72, 0.08);
}

.sign-card + .sign-card {
	margin-top: 34rpx;
}

.sign-card__header {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.sign-card__title-wrap {
	display: flex;
	align-items: center;
	min-width: 0;
}

.sign-card__mark {
	width: 8rpx;
	height: 54rpx;
	border-radius: 999rpx;
	background: #143080;
}

.sign-card__date {
	margin-left: 18rpx;
	font-size: 34rpx;
	font-weight: 700;
	line-height: 1.1;
	color: #20232b;
}

.sign-card__tag {
	margin-left: 16rpx;
	padding: 10rpx 18rpx;
	border-radius: 999rpx;
	background: #eef3ff;
	font-size: 22rpx;
	line-height: 1;
	color: #7f8aa8;
}

.sign-card__location {
	display: flex;
	align-items: center;
	margin-top: 34rpx;
	padding-bottom: 20rpx;
}

.sign-card__location-icon {
	position: relative;
	width: 28rpx;
	height: 28rpx;
	margin-right: 20rpx;
	border: 4rpx solid #9598a0;
	border-radius: 50% 50% 50% 0;
	transform: rotate(-45deg);
	box-sizing: border-box;
	flex: none;
}

.sign-card__location-dot {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 8rpx;
	height: 8rpx;
	border-radius: 50%;
	background: #9598a0;
	transform: translate(-50%, -50%);
}

.sign-card__location-text {
	flex: 1;
	min-width: 0;
	font-size: 24rpx;
	line-height: 1.4;
	color: #8f949f;
}

.sign-card__list {
	margin-top: 2rpx;
}

.sign-card__item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	min-height: 124rpx;
	border-top: 2rpx solid #f1f2f6;
}

.sign-card__item-title {
	flex: 1;
	min-width: 0;
	padding-right: 20rpx;
	font-size: 28rpx;
	line-height: 1.3;
	color: #30343c;
}

.sign-card__item-action {
	flex: none;
	margin-left: 20rpx;
}

.sign-card__history-meta {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	flex: none;
	margin-left: 20rpx;
}

.sign-card__history-time {
	font-size: 20rpx;
	line-height: 1.2;
	color: #9a9eaa;
}

.sign-card__history-status {
	margin-top: 12rpx;
	padding: 8rpx 14rpx;
	border-radius: 999rpx;
	background: #eef3ff;
}

.sign-card__history-status-text {
	font-size: 20rpx;
	line-height: 1;
	color: #143080;
}

.selection-indicator {
	position: relative;
	width: 42rpx;
	height: 42rpx;
	border-radius: 50%;
	border: 2rpx solid #d7dbe4;
	background: #ffffff;
	box-sizing: border-box;
}

.selection-indicator.is-checked {
	border-color: #143080;
}

.selection-indicator.is-checked::after {
	content: '';
	position: absolute;
	top: 50%;
	left: 50%;
	width: 20rpx;
	height: 20rpx;
	border-radius: 50%;
	background: #143080;
	transform: translate(-50%, -50%);
}

.sign-empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 220rpx 0 160rpx;
}

.sign-empty__title {
	font-size: 30rpx;
	font-weight: 600;
	line-height: 1.2;
	color: #23262f;
}

.sign-empty__desc {
	margin-top: 18rpx;
	font-size: 24rpx;
	line-height: 1.5;
	color: #9ca1ab;
	text-align: center;
}

.sign-center-page__footer {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 12;
	padding-top: 18rpx;
	padding-bottom: calc(env(safe-area-inset-bottom) + 24rpx);
	background: rgba(255, 255, 255, 0.98);
	box-shadow: 0 -10rpx 30rpx rgba(32, 41, 72, 0.06);
}

.sign-center-page__footer-inner {
	display: flex;
	align-items: center;
}

.sign-center-page__select-all {
	display: flex;
	align-items: center;
	flex: none;
}

.sign-center-page__select-all-text {
	margin-left: 16rpx;
	font-size: 28rpx;
	line-height: 1;
	color: #20232b;
}

.sign-center-page__count {
	position: relative;
	margin-left: 28rpx;
	padding-left: 28rpx;
	font-size: 26rpx;
	line-height: 1;
	color: #4e5564;
}

.sign-center-page__count::before {
	content: '';
	position: absolute;
	left: 0;
	top: 50%;
	width: 2rpx;
	height: 34rpx;
	background: #e4e7ef;
	transform: translateY(-50%);
}

.sign-center-page__cta {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 332rpx;
	height: 96rpx;
	margin-left: auto;
	border-radius: 999rpx;
	background: #143080;
	font-size: 34rpx;
	font-weight: 600;
	line-height: 1;
	color: #ffffff;
	box-shadow: 0 16rpx 28rpx rgba(20, 48, 128, 0.18);
}

.sign-center-page__cta.is-disabled {
	background: #9ba9cf;
	box-shadow: none;
}
</style>
