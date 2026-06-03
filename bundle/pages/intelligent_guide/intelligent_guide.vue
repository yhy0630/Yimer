<template>
	<view class="intelligent-guide-page">
		<view class="intelligent-guide-page__glow intelligent-guide-page__glow--left"></view>
		<view class="intelligent-guide-page__glow intelligent-guide-page__glow--right"></view>

		<view class="intelligent-guide-page__header" :style="{ paddingTop: statusBarHeight + 'px' }">
			<view class="page-shell intelligent-guide-page__nav">
				<view class="intelligent-guide-page__back" @tap="goBack">
					<image class="intelligent-guide-page__back-icon" src="/static/images/back.png" mode="aspectFit" />
				</view>
				<text class="intelligent-guide-page__title">智能导诊</text>
				<view class="intelligent-guide-page__nav-placeholder"></view>
			</view>
		</view>

		<view class="page-shell intelligent-guide-page__body">
			<scroll-view class="department-tabs" scroll-x enable-flex show-scrollbar="false">
				<view class="department-tabs__inner">
					<view
						v-for="(item, index) in departmentTabs"
						:key="item"
						:class="['department-tabs__item', activeDepartmentIndex === index ? 'is-active' : '']"
						@tap="setDepartment(index)"
					>
						{{ item }}
					</view>
				</view>
			</scroll-view>

			<view class="timeline-panel">
				<view class="timeline-panel__track"></view>

				<view
					v-for="section in activeDepartment.sections"
					:key="section.key"
					class="timeline-item"
				>
					<view class="timeline-item__marker">
						<view class="timeline-item__check">
							<u-icon name="checkmark" size="20" color="#ffffff"></u-icon>
						</view>
					</view>

					<view class="timeline-card">
						<view class="timeline-card__header">
							<view class="timeline-card__title-wrap">
								<view class="timeline-card__dot"></view>
								<text class="timeline-card__title-text">{{ section.title }}</text>
							</view>

							<view v-if="section.date || section.time" class="timeline-card__meta">
								<text v-if="section.date" class="timeline-card__date">{{ section.date }}</text>
								<view v-if="section.time" class="timeline-card__time">
									<u-icon name="clock" size="28" color="#3b404c"></u-icon>
									<text class="timeline-card__time-text">{{ section.time }}</text>
								</view>
							</view>
						</view>

						<view class="timeline-card__body">
							<view v-if="section.type === 'arrival'" class="person-card person-card--single">
								<image class="person-card__avatar" :src="section.consultant.avatar" mode="aspectFill" />
								<text class="person-card__role">{{ section.consultant.role }}</text>
								<text class="person-card__name">{{ section.consultant.name }}</text>
							</view>

							<view v-else-if="section.type === 'consultation'" class="staff-grid staff-grid--triple">
								<view
									v-for="member in section.members"
									:key="member.role + member.name"
									class="person-card"
								>
									<image class="person-card__avatar" :src="member.avatar" mode="aspectFill" />
									<text class="person-card__role">{{ member.role }}</text>
									<text class="person-card__name">{{ member.name }}</text>
								</view>
							</view>

							<view v-else-if="section.type === 'treatment'" class="treatment-list">
								<view
									v-for="(item, itemIndex) in section.items"
									:key="item.id"
									:class="['treatment-card', itemIndex !== 0 ? 'is-split' : '']"
								>
									<text class="treatment-card__project">
										<text class="treatment-card__project-label">治疗项目：</text>{{ item.project }}
									</text>

									<view class="staff-grid staff-grid--double">
										<view
											v-for="member in item.members"
											:key="member.role + member.name"
											class="person-card"
										>
											<image class="person-card__avatar" :src="member.avatar" mode="aspectFill" />
											<text class="person-card__role">{{ member.role }}</text>
											<text class="person-card__name">{{ member.name }}</text>
										</view>
									</view>

									<view class="action-row">
										<view
											v-for="action in item.actions"
											:key="action"
											class="action-chip"
											@tap="handleActionTap(action)"
										>
											<u-icon name="edit-pen" size="28" color="#1f2430"></u-icon>
											<text class="action-chip__text">{{ action }}</text>
										</view>
									</view>
								</view>
							</view>

							<view v-else-if="section.type === 'discharge'" class="discharge-card">
								<view class="discharge-card__content">
									<text class="discharge-card__text">{{ section.summary }}</text>
									<text class="discharge-card__text">{{ section.subSummary }}</text>
								</view>
								<view class="discharge-card__button" @tap="handleActionTap(section.action)">
									{{ section.action }}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
const getStatusBarHeight = () => {
	try {
		const { statusBarHeight = 20 } = uni.getSystemInfoSync()
		return statusBarHeight
	} catch (error) {
		return 20
	}
}

const DEPARTMENT_TABS = ['科室A', '科室B', '科室C']

const DEPARTMENT_GUIDES = [
	{
		name: '科室A',
		sections: [
			{
				key: 'arrival',
				type: 'arrival',
				title: '已到院',
				date: '2026-01-01',
				time: '18:00',
				consultant: {
					role: '顾问',
					name: '申林乔',
					avatar: '/static/linshi/01.png'
				}
			},
			{
				key: 'consultation',
				type: 'consultation',
				title: '面诊结束',
				members: [
					{ role: '客管师', name: '申林乔', avatar: '/static/linshi/02.png' },
					{ role: '医生', name: '陈安', avatar: '/static/linshi/03.png' },
					{ role: '医助', name: '李娜', avatar: '/static/linshi/01.png' }
				]
			},
			{
				key: 'treatment',
				type: 'treatment',
				title: '治疗中',
				items: [
					{
						project: '拔牙术(上颌智齿)',
						members: [
							{ role: '护士', name: '申林乔', avatar: '/static/linshi/02.png' },
							{ role: '医生', name: '陈安', avatar: '/static/linshi/03.png' }
						],
						actions: ['签署知情同意书', '签署治疗单']
					},
					{
						project: '拔牙术(上颌智齿)',
						members: [
							{ role: '护士', name: '李娜', avatar: '/static/linshi/01.png' },
							{ role: '医生', name: '陈安', avatar: '/static/linshi/03.png' }
						],
						actions: ['签署知情同意书', '签署治疗单']
					}
				]
			},
			{
				key: 'discharge',
				type: 'discharge',
				title: '离院',
				summary: '请为我们的服务做出评价',
				subSummary: '期待您的下次光临',
				action: '去评价'
			}
		]
	},
	{
		name: '科室B',
		sections: [
			{
				key: 'arrival',
				type: 'arrival',
				title: '已到院',
				date: '2026-01-03',
				time: '14:30',
				consultant: {
					role: '顾问',
					name: '王一诺',
					avatar: '/static/linshi/02.png'
				}
			},
			{
				key: 'consultation',
				type: 'consultation',
				title: '面诊结束',
				members: [
					{ role: '客管师', name: '王一诺', avatar: '/static/linshi/02.png' },
					{ role: '医生', name: '许泽', avatar: '/static/linshi/03.png' },
					{ role: '医助', name: '赵晴', avatar: '/static/linshi/01.png' }
				]
			},
			{
				key: 'treatment',
				type: 'treatment',
				title: '治疗中',
				items: [
					{
						project: '光子嫩肤(全模式)',
						members: [
							{ role: '护士', name: '王一诺', avatar: '/static/linshi/02.png' },
							{ role: '医生', name: '许泽', avatar: '/static/linshi/03.png' }
						],
						actions: ['签署知情同意书', '签署治疗单']
					},
					{
						project: '术后冷喷修护',
						members: [
							{ role: '护士', name: '赵晴', avatar: '/static/linshi/01.png' },
							{ role: '医生', name: '许泽', avatar: '/static/linshi/03.png' }
						],
						actions: ['签署知情同意书', '签署治疗单']
					}
				]
			},
			{
				key: 'discharge',
				type: 'discharge',
				title: '离院',
				summary: '请为本次护理流程做出评价',
				subSummary: '感谢您的信任与配合',
				action: '去评价'
			}
		]
	},
	{
		name: '科室C',
		sections: [
			{
				key: 'arrival',
				type: 'arrival',
				title: '已到院',
				date: '2026-01-05',
				time: '10:00',
				consultant: {
					role: '顾问',
					name: '周晓芸',
					avatar: '/static/linshi/01.png'
				}
			},
			{
				key: 'consultation',
				type: 'consultation',
				title: '面诊结束',
				members: [
					{ role: '客管师', name: '周晓芸', avatar: '/static/linshi/01.png' },
					{ role: '医生', name: '林川', avatar: '/static/linshi/03.png' },
					{ role: '医助', name: '苏然', avatar: '/static/linshi/02.png' }
				]
			},
			{
				key: 'treatment',
				type: 'treatment',
				title: '治疗中',
				items: [
					{
						project: '玻尿酸填充(下巴)',
						members: [
							{ role: '护士', name: '周晓芸', avatar: '/static/linshi/01.png' },
							{ role: '医生', name: '林川', avatar: '/static/linshi/03.png' }
						],
						actions: ['签署知情同意书', '签署治疗单']
					},
					{
						project: '术后复查登记',
						members: [
							{ role: '护士', name: '苏然', avatar: '/static/linshi/02.png' },
							{ role: '医生', name: '林川', avatar: '/static/linshi/03.png' }
						],
						actions: ['签署知情同意书', '签署治疗单']
					}
				]
			},
			{
				key: 'discharge',
				type: 'discharge',
				title: '离院',
				summary: '欢迎反馈您的整体就诊体验',
				subSummary: '您的评价会帮助我们持续优化',
				action: '去评价'
			}
		]
	}
]

function normalizeDepartmentIndex(value) {
	const index = Number(value)
	if (Number.isNaN(index) || index < 0 || index >= DEPARTMENT_GUIDES.length) {
		return 0
	}
	return index
}

function createDepartmentGuides() {
	return DEPARTMENT_GUIDES.map((department, departmentIndex) => ({
		...department,
		sections: (department.sections || []).map((section) => {
			if (section.type !== 'treatment') {
				return section
			}

			return {
				...section,
				items: (section.items || []).map((item, itemIndex) => ({
					...item,
					id: item.id || `department-${departmentIndex}-treatment-${itemIndex}`
				}))
			}
		})
	}))
}

const SIGN_ACTION_ROUTE_MAP = {
	'\u7b7e\u7f72\u77e5\u60c5\u540c\u610f\u4e66': 'consent',
	'\u7b7e\u7f72\u6cbb\u7597\u5355': 'treatment'
}

const REVIEW_ACTION_TEXT = '去评价'

export default {
	data() {
		return {
			statusBarHeight: getStatusBarHeight(),
			departmentTabs: DEPARTMENT_TABS,
			departmentGuides: createDepartmentGuides(),
			activeDepartmentIndex: 0
		}
	},
	computed: {
		activeDepartment() {
			return this.departmentGuides[this.activeDepartmentIndex] || this.departmentGuides[0]
		}
	},
	onLoad(options = {}) {
		this.activeDepartmentIndex = normalizeDepartmentIndex(options.department)
	},
	methods: {
		setDepartment(index) {
			this.activeDepartmentIndex = index
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
		handleActionTap(action) {
			const entry = SIGN_ACTION_ROUTE_MAP[action]

			if (entry) {
				uni.navigateTo({
					url: `/bundle/pages/sign_center/sign_center?entry=${entry}`
				})
				return
			}

			if (action === REVIEW_ACTION_TEXT) {
				uni.navigateTo({
					url: `/bundle/pages/guide_review/guide_review?department=${this.activeDepartmentIndex}`
				})
				return
			}

			uni.showToast({
				title: action,
				icon: 'none'
			})
		}
	}
}
</script>

<style lang="scss">
page {
	background:
		radial-gradient(circle at 30% 0, rgba(255, 255, 255, 1) 0, rgba(244, 247, 255, 0.96) 35%, rgba(238, 242, 252, 0.92) 100%);
}

.intelligent-guide-page {
	position: relative;
	min-height: 100vh;
	overflow: hidden;
	background:
		radial-gradient(circle at top left, rgba(255, 255, 255, 0.98) 0, rgba(255, 255, 255, 0.18) 30%, rgba(255, 255, 255, 0) 60%),
		linear-gradient(180deg, #f6f8fe 0%, #f9fbff 240rpx, #ffffff 100%);
}

.intelligent-guide-page__glow {
	position: absolute;
	pointer-events: none;
	border-radius: 50%;
	filter: blur(14rpx);
}

.intelligent-guide-page__glow--left {
	top: -120rpx;
	left: -120rpx;
	width: 420rpx;
	height: 420rpx;
	background: rgba(255, 255, 255, 0.92);
}

.intelligent-guide-page__glow--right {
	top: -30rpx;
	right: -120rpx;
	width: 440rpx;
	height: 260rpx;
	background:
		linear-gradient(135deg, rgba(223, 230, 251, 0.12) 0%, rgba(198, 210, 243, 0.58) 100%);
	transform: rotate(-12deg);
}

.intelligent-guide-page__header {
	position: relative;
	z-index: 2;
}

.intelligent-guide-page__nav {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 88rpx;
}

.intelligent-guide-page__back,
.intelligent-guide-page__nav-placeholder {
	width: 72rpx;
	height: 72rpx;
	flex: none;
}

.intelligent-guide-page__back {
	display: flex;
	align-items: center;
	justify-content: flex-start;
}

.intelligent-guide-page__back-icon {
	width: 38rpx;
	height: 38rpx;
}

.intelligent-guide-page__title {
	font-size: 34rpx;
	font-weight: 600;
	line-height: 1;
	color: #1f2430;
}

.intelligent-guide-page__body {
	position: relative;
	z-index: 1;
	padding-top: 22rpx;
	padding-bottom: calc(env(safe-area-inset-bottom) + 48rpx);
}

.department-tabs {
	width: 100%;
}

.department-tabs__inner {
	display: inline-flex;
	padding: 8rpx;
	border-radius: 999rpx;
	background: rgba(255, 255, 255, 0.9);
	box-shadow: inset 0 0 0 2rpx rgba(221, 228, 244, 0.4);
}

.department-tabs__item {
	min-width: 136rpx;
	height: 60rpx;
	padding: 0 30rpx;
	border-radius: 999rpx;
	font-size: 22rpx;
	line-height: 60rpx;
	text-align: center;
	color: #8d94a4;
	box-sizing: border-box;
}

.department-tabs__item.is-active {
	color: #ffffff;
	background: #143080;
	box-shadow: 0 10rpx 20rpx rgba(20, 48, 128, 0.2);
}

.timeline-panel {
	position: relative;
	margin-top: 34rpx;
	padding: 30rpx 22rpx 24rpx;
	border-radius: 34rpx;
	background: rgba(255, 255, 255, 0.9);
	box-shadow: 0 20rpx 50rpx rgba(28, 44, 95, 0.08);
}

.timeline-panel__track {
	position: absolute;
	top: 72rpx;
	bottom: 78rpx;
	left: 52rpx;
	border-left: 2rpx dashed #cfe0ff;
}

.timeline-item {
	position: relative;
	padding-left: 66rpx;
}

.timeline-item + .timeline-item {
	margin-top: 30rpx;
}

.timeline-item__marker {
	position: absolute;
	top: 26rpx;
	left: 0;
	width: 60rpx;
	display: flex;
	justify-content: center;
}

.timeline-item__check {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 38rpx;
	height: 38rpx;
	border-radius: 50%;
	background: #143080;
	box-shadow: 0 10rpx 20rpx rgba(20, 48, 128, 0.18);
	font-size: 22rpx;
	line-height: 1;
	color: #ffffff;
}

.timeline-card {
	overflow: hidden;
	border-radius: 22rpx;
	background: #ffffff;
	box-shadow: 0 10rpx 30rpx rgba(31, 36, 48, 0.06);
}

.timeline-card__header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24rpx 26rpx;
	background: #eaf1ff;
}

.timeline-card__title-wrap,
.timeline-card__meta,
.timeline-card__time {
	display: flex;
	align-items: center;
}

.timeline-card__dot {
	width: 12rpx;
	height: 12rpx;
	margin-right: 10rpx;
	border-radius: 50%;
	color: #343842;
	background: #343842;
}

.timeline-card__title-text {
	font-size: 28rpx;
	font-weight: 600;
	line-height: 1.2;
	color: #343842;
}

.timeline-card__meta {
	flex: none;
}

.timeline-card__date,
.timeline-card__time-text {
	font-size: 22rpx;
	color: #6e7684;
}

.timeline-card__time {
	margin-left: 24rpx;
}

.timeline-card__time-text {
	margin-left: 6rpx;
}

.timeline-card__body {
	padding: 24rpx 26rpx 28rpx;
}

.person-card {
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
}

.person-card--single {
	align-items: flex-start;
	text-align: left;
}

.person-card--single .person-card__avatar {
	width: 92rpx;
	height: 92rpx;
}

.person-card__avatar {
	width: 96rpx;
	height: 96rpx;
	border-radius: 50%;
	background: #eef2f9;
}

.person-card__role {
	margin-top: 16rpx;
	font-size: 22rpx;
	line-height: 1.2;
	color: #2f3137;
}

.person-card__name {
	margin-top: 10rpx;
	font-size: 20rpx;
	line-height: 1.2;
	color: #7a8190;
}

.staff-grid {
	display: flex;
}

.staff-grid--triple {
	justify-content: space-between;
}

.staff-grid--double {
	margin-top: 30rpx;
	justify-content: flex-start;
}

.staff-grid--double .person-card + .person-card {
	margin-left: 90rpx;
}

.treatment-list {
	margin-top: -4rpx;
}

.treatment-card {
	padding-top: 6rpx;
}

.treatment-card.is-split {
	margin-top: 28rpx;
	padding-top: 34rpx;
	border-top: 2rpx solid #eef2f8;
}

.treatment-card__project {
	display: block;
	font-size: 22rpx;
	line-height: 1.5;
	color: #2f3137;
}

.treatment-card__project-label {
	color: #2454a5;
}

.action-row {
	display: flex;
	justify-content: space-between;
	margin-top: 30rpx;
}

.action-chip {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 256rpx;
	height: 72rpx;
	padding: 0 22rpx;
	border-radius: 16rpx;
	border: 2rpx solid #ccdaef;
	background: #ffffff;
	box-sizing: border-box;
}

.action-chip__text {
	margin-left: 10rpx;
	font-size: 22rpx;
	color: #2f3137;
}

.discharge-card {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.discharge-card__content {
	display: flex;
	flex-direction: column;
	min-width: 0;
}

.discharge-card__text {
	font-size: 22rpx;
	line-height: 1.5;
	color: #7a8190;
}

.discharge-card__text + .discharge-card__text {
	margin-top: 8rpx;
}

.discharge-card__button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 136rpx;
	height: 72rpx;
	margin-left: 20rpx;
	padding: 0 26rpx;
	border-radius: 16rpx;
	background: #143080;
	font-size: 22rpx;
	font-weight: 600;
	color: #ffffff;
	box-shadow: 0 12rpx 20rpx rgba(20, 48, 128, 0.18);
	box-sizing: border-box;
}
</style>
