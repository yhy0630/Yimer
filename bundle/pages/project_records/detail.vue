<template>
	<view class="project-record-detail-page">
		<view class="project-record-detail-page__glow project-record-detail-page__glow--left"></view>
		<view class="project-record-detail-page__glow project-record-detail-page__glow--right"></view>
		<view class="project-record-detail-page__halo"></view>

		<view class="project-record-detail-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="page-shell project-record-detail-page__nav">
				<view class="project-record-detail-page__back" @tap="goBack">
					<u-icon name="arrow-left" size="46" color="#20232b"></u-icon>
				</view>
			</view>
		</view>

		<view class="page-shell project-record-detail-page__body" :class="{ 'has-footer': detail.pageStatus === 'pending' }">
			<text class="project-record-detail-page__title">{{ detail.pageTitle }}</text>

			<view v-if="detail.pageStatus === 'completed'" class="project-record-detail-page__stack">
				<view
					v-for="document in detail.documents"
					:key="document.key"
					:class="[
						'detail-row-card',
						document.actionable ? 'is-actionable' : '',
						document.statusTone ? `is-${document.statusTone}` : ''
					]"
					@tap="handleDocumentTap(document)"
				>
					<text class="detail-row-card__label">{{ document.label }}</text>

					<view class="detail-row-card__value-wrap">
						<text class="detail-row-card__value">{{ document.statusText }}</text>
						<u-icon
							v-if="document.actionable"
							name="arrow-right"
							size="28"
							:color="document.statusTone === 'primary' ? '#143080' : '#9aa0ad'"
						></u-icon>
					</view>
				</view>

				<view class="detail-section-card">
					<text class="detail-section-card__title">{{ detail.treatmentProjectsTitle }}</text>

					<view class="detail-project-list">
						<view
							v-for="(project, index) in detail.treatmentProjects"
							:key="`${project.name}-${index}`"
							class="detail-project-list__item"
						>
							<text class="detail-project-list__name">{{ project.name }}</text>
							<text class="detail-project-list__count">{{ project.count }}</text>
						</view>
					</view>
				</view>

				<view class="detail-section-card">
					<text class="detail-section-card__title">{{ detail.orderTitle }}</text>

					<view class="detail-info-list">
						<view v-for="item in detail.orderDetails" :key="item.label" class="detail-info-list__item">
							<text class="detail-info-list__label">{{ item.label }}</text>
							<text class="detail-info-list__value">{{ item.value }}</text>
						</view>
					</view>
				</view>

				<view class="detail-section-card">
					<text class="detail-section-card__title">{{ detail.visitTitle }}</text>

					<view class="detail-info-list">
						<view v-for="item in detail.visitDetails" :key="item.label" class="detail-info-list__item">
							<text class="detail-info-list__label">{{ item.label }}</text>
							<text class="detail-info-list__value">{{ item.value }}</text>
						</view>
					</view>
				</view>
			</view>

			<view v-else class="project-record-detail-page__stack">
				<view class="remaining-card">
					<text class="remaining-card__title">{{ detail.projectName }}</text>
					<text class="remaining-card__label">剩余次数</text>

					<view class="remaining-card__count">
						<text class="remaining-card__current">{{ detail.remaining }}</text>
						<text class="remaining-card__split">/{{ detail.total }}</text>
						<text class="remaining-card__unit">次</text>
					</view>
				</view>

				<view class="detail-section-card">
					<text class="detail-section-card__title">{{ detail.orderTitle }}</text>

					<view class="detail-info-list">
						<view v-for="item in detail.orderDetails" :key="item.label" class="detail-info-list__item">
							<text class="detail-info-list__label">{{ item.label }}</text>
							<text class="detail-info-list__value">{{ item.value }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view v-if="detail.pageStatus === 'pending'" class="project-record-detail-page__footer">
			<view class="page-shell">
				<button class="project-record-detail-page__cta" hover-class="none" @tap="handlePrimaryAction">
					{{ detail.primaryActionText }}
				</button>
			</view>
		</view>
	</view>
</template>

<script>
const SIGN_CENTER_URL = '/bundle/pages/sign_center/sign_center'
const APPOINTMENT_URL = '/bundle_service/pages/appointment_register/appointment_register'
const FALLBACK_URL = '/bundle/pages/project_records/project_records'

const DETAIL_RECORDS = Object.freeze({
	'pending-001': {
		id: 'pending-001',
		pageStatus: 'pending',
		pageTitle: '未治疗',
		projectName: '新一代高能舒适热玛吉',
		remaining: 3,
		total: 3,
		primaryActionText: '预约',
		orderTitle: '开单详情',
		orderDetails: [
			{ label: '开单院区：', value: '伊美尔北京光华Soho2期店' },
			{ label: '开单时间：', value: '2026-01-01' },
			{ label: '订单编号：', value: 'YME18289289289' }
		]
	},
	'pending-002': {
		id: 'pending-002',
		pageStatus: 'pending',
		pageTitle: '未治疗',
		projectName: '新一代高能舒适热玛吉',
		remaining: 2,
		total: 3,
		primaryActionText: '预约',
		orderTitle: '开单详情',
		orderDetails: [
			{ label: '开单院区：', value: '伊美尔北京光华Soho2期店' },
			{ label: '开单时间：', value: '2026-01-12' },
			{ label: '订单编号：', value: 'YME18289289290' }
		]
	},
	'pending-003': {
		id: 'pending-003',
		pageStatus: 'pending',
		pageTitle: '未治疗',
		projectName: '超声炮紧致提升',
		remaining: 1,
		total: 1,
		primaryActionText: '预约',
		orderTitle: '开单详情',
		orderDetails: [
			{ label: '开单院区：', value: '伊美尔北京光华Soho2期店' },
			{ label: '开单时间：', value: '2026-02-03' },
			{ label: '订单编号：', value: 'YME18289289291' }
		]
	},
	'completed-001': {
		id: 'completed-001',
		pageStatus: 'completed',
		pageTitle: '已治疗',
		documents: [
			{
				key: 'consent',
				label: '知情同意书',
				statusText: '已签字',
				statusTone: 'muted',
				actionable: false
			},
			{
				key: 'treatment',
				label: '治疗单',
				statusText: '待签字',
				statusTone: 'primary',
				actionable: true,
				targetUrl: `${SIGN_CENTER_URL}?entry=treatment`
			}
		],
		treatmentProjectsTitle: '治疗项目',
		treatmentProjects: [
			{ name: '新一代高能舒适热玛吉', count: '治疗次数: 1次' },
			{ name: '新一代高能舒适热玛吉', count: '治疗次数: 1次' },
			{ name: '新一代高能舒适热玛吉', count: '治疗次数: 1次' }
		],
		orderTitle: '开单详情',
		orderDetails: [
			{ label: '开单院区：', value: '伊美尔北京光华Soho2期店' },
			{ label: '开单时间：', value: '2026-01-01' },
			{ label: '订单编号：', value: 'YME18289289289' }
		],
		visitTitle: '治疗详情',
		visitDetails: [
			{ label: '治疗院区：', value: '伊美尔北京光华Soho2期店' },
			{ label: '治疗时间：', value: '2026-01-01' }
		]
	},
	'completed-002': {
		id: 'completed-002',
		pageStatus: 'completed',
		pageTitle: '已治疗',
		documents: [
			{
				key: 'consent',
				label: '知情同意书',
				statusText: '已签字',
				statusTone: 'muted',
				actionable: false
			},
			{
				key: 'treatment',
				label: '治疗单',
				statusText: '已签字',
				statusTone: 'muted',
				actionable: false
			}
		],
		treatmentProjectsTitle: '治疗项目',
		treatmentProjects: [
			{ name: '新一代高能舒适热玛吉', count: '治疗次数: 1次' }
		],
		orderTitle: '开单详情',
		orderDetails: [
			{ label: '开单院区：', value: '伊美尔北京光华Soho2期店' },
			{ label: '开单时间：', value: '2026-01-18' },
			{ label: '订单编号：', value: 'YME18289289292' }
		],
		visitTitle: '治疗详情',
		visitDetails: [
			{ label: '治疗院区：', value: '伊美尔北京光华Soho2期店' },
			{ label: '治疗时间：', value: '2026-01-18' }
		]
	},
	'completed-003': {
		id: 'completed-003',
		pageStatus: 'completed',
		pageTitle: '已治疗',
		documents: [
			{
				key: 'consent',
				label: '知情同意书',
				statusText: '已签字',
				statusTone: 'muted',
				actionable: false
			},
			{
				key: 'treatment',
				label: '治疗单',
				statusText: '已签字',
				statusTone: 'muted',
				actionable: false
			}
		],
		treatmentProjectsTitle: '治疗项目',
		treatmentProjects: [
			{ name: '新一代高能舒适热玛吉', count: '治疗次数: 1次' }
		],
		orderTitle: '开单详情',
		orderDetails: [
			{ label: '开单院区：', value: '伊美尔北京光华Soho2期店' },
			{ label: '开单时间：', value: '2026-01-10' },
			{ label: '订单编号：', value: 'YME18289289293' }
		],
		visitTitle: '治疗详情',
		visitDetails: [
			{ label: '治疗院区：', value: '伊美尔北京光华Soho2期店' },
			{ label: '治疗时间：', value: '2026-01-10' }
		]
	},
	'completed-004': {
		id: 'completed-004',
		pageStatus: 'completed',
		pageTitle: '已治疗',
		documents: [
			{
				key: 'consent',
				label: '知情同意书',
				statusText: '已签字',
				statusTone: 'muted',
				actionable: false
			},
			{
				key: 'treatment',
				label: '治疗单',
				statusText: '已签字',
				statusTone: 'muted',
				actionable: false
			}
		],
		treatmentProjectsTitle: '治疗项目',
		treatmentProjects: [
			{ name: '新一代高能舒适热玛吉', count: '治疗次数: 1次' }
		],
		orderTitle: '开单详情',
		orderDetails: [
			{ label: '开单院区：', value: '伊美尔北京光华Soho2期店' },
			{ label: '开单时间：', value: '2026-01-01' },
			{ label: '订单编号：', value: 'YME18289289294' }
		],
		visitTitle: '治疗详情',
		visitDetails: [
			{ label: '治疗院区：', value: '伊美尔北京光华Soho2期店' },
			{ label: '治疗时间：', value: '2026-01-01' }
		]
	}
})

function getStatusBarHeight() {
	try {
		const { statusBarHeight = 20 } = uni.getSystemInfoSync()
		return statusBarHeight
	} catch (error) {
		return 20
	}
}

function createFallbackDetail(status) {
	return status === 'completed' ? DETAIL_RECORDS['completed-001'] : DETAIL_RECORDS['pending-001']
}

function resolveDetail(options = {}) {
	const detail = DETAIL_RECORDS[options.id]
	if (detail) {
		return detail
	}

	return createFallbackDetail(options.status)
}

export default {
	data() {
		return {
			statusBarHeight: getStatusBarHeight(),
			detail: createFallbackDetail('pending')
		}
	},
	onLoad(options = {}) {
		this.detail = resolveDetail(options)
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

			uni.redirectTo({
				url: FALLBACK_URL
			})
		},
		handleDocumentTap(document) {
			if (!document || !document.actionable) {
				return
			}

			uni.navigateTo({
				url: document.targetUrl || SIGN_CENTER_URL
			})
		},
		handlePrimaryAction() {
			uni.navigateTo({
				url: APPOINTMENT_URL
			})
		}
	}
}
</script>

<style scoped lang="scss">
.project-record-detail-page {
	position: relative;
	min-height: 100vh;
	background:
		radial-gradient(circle at 50% -6%, rgba(226, 231, 244, 0.94) 0, rgba(226, 231, 244, 0.3) 320rpx, rgba(255, 255, 255, 0) 820rpx),
		linear-gradient(180deg, #f8f9fd 0%, #ffffff 360rpx, #ffffff 100%);
}

.project-record-detail-page__glow,
.project-record-detail-page__halo {
	position: absolute;
	pointer-events: none;
}

.project-record-detail-page__glow {
	border-radius: 50%;
	filter: blur(20rpx);
}

.project-record-detail-page__glow--left {
	top: -120rpx;
	left: -100rpx;
	width: 360rpx;
	height: 360rpx;
	background: rgba(255, 255, 255, 0.94);
}

.project-record-detail-page__glow--right {
	top: -10rpx;
	right: -120rpx;
	width: 420rpx;
	height: 460rpx;
	background: rgba(214, 223, 246, 0.42);
}

.project-record-detail-page__halo {
	top: -140rpx;
	right: -70rpx;
	width: 620rpx;
	height: 620rpx;
	border-radius: 50%;
	border: 2rpx solid rgba(255, 255, 255, 0.4);
	transform: rotate(12deg);
}

.project-record-detail-page__header {
	position: relative;
	z-index: 2;
}

.project-record-detail-page__nav {
	display: flex;
	align-items: center;
	height: 92rpx;
}

.project-record-detail-page__back {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 80rpx;
	height: 72rpx;
	margin-left: -8rpx;
}

.project-record-detail-page__body {
	position: relative;
	z-index: 1;
	padding-top: 28rpx;
	padding-bottom: 88rpx;
}

.project-record-detail-page__body.has-footer {
	padding-bottom: calc(env(safe-area-inset-bottom) + 220rpx);
	min-height: calc(100vh - env(safe-area-inset-bottom));
	box-sizing: border-box;
}

.project-record-detail-page__title {
	display: block;
	font-size: 76rpx;
	line-height: 1.1;
	font-weight: 700;
	color: #1f232c;
}

.project-record-detail-page__stack {
	margin-top: 42rpx;
}

.detail-row-card,
.detail-section-card,
.remaining-card {
	border-radius: 28rpx;
	background: rgba(255, 255, 255, 0.98);
	box-shadow: 0 18rpx 48rpx rgba(31, 39, 61, 0.08);
}

.detail-row-card + .detail-row-card,
.detail-section-card + .detail-section-card,
.remaining-card + .detail-section-card {
	margin-top: 40rpx;
}

.detail-row-card {
	display: flex;
	align-items: center;
	justify-content: space-between;
	min-height: 126rpx;
	padding: 0 42rpx;
}

.detail-row-card__label {
	font-size: 30rpx;
	line-height: 1.3;
	font-weight: 700;
	color: #232833;
}

.detail-row-card__value-wrap {
	display: flex;
	align-items: center;
}

.detail-row-card__value {
	font-size: 30rpx;
	line-height: 1.2;
	color: #8f949f;
}

.detail-row-card.is-primary .detail-row-card__value {
	color: #143080;
}

.detail-row-card.is-actionable .detail-row-card__value-wrap {
	column-gap: 10rpx;
}

.detail-section-card {
	padding: 42rpx;
}

.detail-section-card__title {
	display: block;
	font-size: 30rpx;
	line-height: 1.2;
	font-weight: 700;
	color: #232833;
}

.detail-project-list {
	margin-top: 30rpx;
}

.detail-project-list__item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 26rpx 0;
}

.detail-project-list__item + .detail-project-list__item {
	border-top: 2rpx solid #eef1f6;
}

.detail-project-list__name,
.detail-project-list__count {
	font-size: 26rpx;
	line-height: 1.45;
	color: #878d98;
}

.detail-project-list__name {
	flex: 1;
	min-width: 0;
	padding-right: 24rpx;
}

.detail-project-list__count {
	flex: none;
	color: #4b515d;
}

.detail-info-list {
	margin-top: 30rpx;
}

.detail-info-list__item {
	display: flex;
	align-items: flex-start;
}

.detail-info-list__item + .detail-info-list__item {
	margin-top: 34rpx;
}

.detail-info-list__label {
	flex: none;
	width: 176rpx;
	font-size: 26rpx;
	line-height: 1.5;
	color: #9ca1ab;
}

.detail-info-list__value {
	flex: 1;
	min-width: 0;
	font-size: 26rpx;
	line-height: 1.5;
	color: #444b57;
	word-break: break-all;
}

.remaining-card {
	padding: 40rpx 42rpx 36rpx;
}

.remaining-card__title {
	display: block;
	font-size: 34rpx;
	line-height: 1.35;
	font-weight: 700;
	color: #1f232c;
}

.remaining-card__label {
	display: block;
	margin-top: 56rpx;
	font-size: 28rpx;
	line-height: 1.2;
	color: #9ca1ab;
}

.remaining-card__count {
	display: flex;
	align-items: baseline;
	margin-top: 34rpx;
}

.remaining-card__current {
	font-size: 84rpx;
	line-height: 1;
	font-weight: 700;
	color: #143080;
}

.remaining-card__split {
	margin-left: 10rpx;
	font-size: 52rpx;
	line-height: 1;
	font-weight: 700;
	color: #7f8591;
}

.remaining-card__unit {
	margin-left: 24rpx;
	font-size: 30rpx;
	line-height: 1;
	color: #7f8591;
}

.project-record-detail-page__footer {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 8;
	padding: 22rpx 0 calc(28rpx + env(safe-area-inset-bottom));
	background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.92) 28%, #ffffff 100%);
}

.project-record-detail-page__cta {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 106rpx;
	border-radius: 999rpx;
	background: #143080;
	font-size: 34rpx;
	font-weight: 600;
	line-height: 1;
	color: #ffffff;
	box-shadow: 0 18rpx 34rpx rgba(20, 48, 128, 0.16);
}

@media screen and (max-width: 360px) {
	.project-record-detail-page__title {
		font-size: 66rpx;
	}

	.detail-row-card {
		padding-left: 34rpx;
		padding-right: 34rpx;
	}

	.detail-section-card,
	.remaining-card {
		padding-left: 34rpx;
		padding-right: 34rpx;
	}

	.detail-info-list__label {
		width: 156rpx;
	}
}
</style>
