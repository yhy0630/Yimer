<template>
	<view class="guide-review-page">
		<view class="guide-review-page__glow guide-review-page__glow--left"></view>
		<view class="guide-review-page__glow guide-review-page__glow--right"></view>

		<view class="guide-review-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="page-shell guide-review-page__nav">
				<view class="guide-review-page__back" @tap="goBack">
					<u-icon name="arrow-left" size="50" color="#1c212b"></u-icon>
				</view>
				<view class="guide-review-page__nav-placeholder"></view>
			</view>
		</view>

		<scroll-view scroll-y class="guide-review-page__scroll">
			<view class="page-shell guide-review-page__body">
				<text class="guide-review-page__title">您的评价对我们很宝贵</text>

				<view class="guide-review-card">
					<view class="guide-review-card__head" @tap="toggleProjectPanel">
						<text class="guide-review-card__heading">治疗项目</text>
						<u-icon :name="showProjectOptions ? 'arrow-up' : 'arrow-down'" size="34" color="#d6dbe6"></u-icon>
					</view>

					<view v-if="showProjectOptions" class="guide-review-projects">
						<view
							v-for="(project, index) in reviewProjects"
							:key="project"
							:class="['guide-review-projects__item', selectedProjectIndex === index ? 'is-active' : '']"
							@tap="selectProject(index)"
						>
							<text class="guide-review-projects__text">{{ project }}</text>
							<view v-if="selectedProjectIndex === index" class="guide-review-projects__dot"></view>
						</view>
					</view>
				</view>

				<view class="guide-review-card guide-review-card--ratings">
					<view
						v-for="(item, index) in reviewItems"
						:key="item.key"
						:class="['rating-row', index < reviewItems.length - 1 ? 'is-bordered' : '']"
					>
						<view class="rating-row__main">
							<image class="rating-row__avatar" :src="item.avatar" mode="aspectFill"></image>
							<text class="rating-row__label">{{ item.label }}</text>
						</view>

						<u-rate
							v-model="item.score"
							:count="5"
							:size="40"
							active-color="#ffbf1f"
							inactive-color="#d3d6df"
						></u-rate>
					</view>
				</view>

				<view class="guide-review-card guide-review-card--textarea">
					<text class="guide-review-card__heading">留下您的宝贵意见</text>

					<textarea
						v-model="commentText"
						class="guide-review-page__textarea"
						placeholder="请详细填写"
						placeholder-class="guide-review-page__textarea-placeholder"
						maxlength="400"
						cursor-spacing="24"
					></textarea>

					<text class="guide-review-page__count">{{ commentText.length }}/400</text>
				</view>
			</view>
		</scroll-view>

		<view class="guide-review-page__footer">
			<view class="page-shell guide-review-page__footer-shell">
				<button class="guide-review-page__submit" hover-class="none" @tap="submitReview">提交</button>
			</view>
		</view>
	</view>
</template>

<script>
function getStatusBarHeight() {
	try {
		const { statusBarHeight = 20 } = uni.getSystemInfoSync()
		return statusBarHeight
	} catch (error) {
		return 20
	}
}

const REVIEW_PAGE_DATA = [
	{
		projects: ['新一代高能舒适热玛吉', '超声炮紧致提升'],
		reviewItems: [
			{ key: 'environment', label: '您对院内的环境满意吗？', avatar: '/static/linshi/06.png', score: 1 },
			{ key: 'manager', label: '客户管理师：沈以诚', avatar: '/static/linshi/02.png', score: 2 },
			{ key: 'doctor', label: '医生：沈以诚', avatar: '/static/linshi/01.png', score: 3 },
			{ key: 'nurse', label: '护士：沈以诚', avatar: '/static/linshi/05.png', score: 0 }
		]
	},
	{
		projects: ['光子嫩肤焕亮管理', '术后冷喷舒缓修护'],
		reviewItems: [
			{ key: 'environment', label: '您对院内的环境满意吗？', avatar: '/static/linshi/06.png', score: 4 },
			{ key: 'manager', label: '客户管理师：王一诺', avatar: '/static/linshi/02.png', score: 5 },
			{ key: 'doctor', label: '医生：许泽', avatar: '/static/linshi/03.png', score: 4 },
			{ key: 'nurse', label: '护士：赵晴', avatar: '/static/linshi/01.png', score: 4 }
		]
	},
	{
		projects: ['玻尿酸面部精修', '术后复查登记'],
		reviewItems: [
			{ key: 'environment', label: '您对院内的环境满意吗？', avatar: '/static/linshi/06.png', score: 5 },
			{ key: 'manager', label: '客户管理师：周晓芸', avatar: '/static/linshi/01.png', score: 4 },
			{ key: 'doctor', label: '医生：林川', avatar: '/static/linshi/03.png', score: 5 },
			{ key: 'nurse', label: '护士：苏然', avatar: '/static/linshi/02.png', score: 4 }
		]
	}
]

function normalizeDepartmentIndex(value) {
	const index = Number(value)
	if (Number.isNaN(index) || index < 0 || index >= REVIEW_PAGE_DATA.length) {
		return 0
	}

	return index
}

function createReviewState(index) {
	const current = REVIEW_PAGE_DATA[index] || REVIEW_PAGE_DATA[0]

	return {
		reviewProjects: [...current.projects],
		reviewItems: current.reviewItems.map((item) => ({ ...item })),
		selectedProjectIndex: 0
	}
}

export default {
	data() {
		return {
			statusBarHeight: getStatusBarHeight(),
			departmentIndex: 0,
			showProjectOptions: true,
			reviewProjects: [],
			reviewItems: [],
			selectedProjectIndex: 0,
			commentText: ''
		}
	},
	onLoad(options = {}) {
		this.departmentIndex = normalizeDepartmentIndex(options.department)
		this.applyReviewState(this.departmentIndex)
	},
	methods: {
		applyReviewState(index) {
			const state = createReviewState(index)
			this.reviewProjects = state.reviewProjects
			this.reviewItems = state.reviewItems
			this.selectedProjectIndex = state.selectedProjectIndex
		},
		toggleProjectPanel() {
			this.showProjectOptions = !this.showProjectOptions
		},
		selectProject(index) {
			this.selectedProjectIndex = index
		},
		goBack() {
			const pages = getCurrentPages()

			if (pages.length > 1) {
				uni.navigateBack({
					delta: 1
				})
				return
			}

			uni.redirectTo({
				url: `/bundle/pages/intelligent_guide/intelligent_guide?department=${this.departmentIndex}`
			})
		},
		submitReview() {
			uni.redirectTo({
				url: '/bundle/pages/guide_review_success/guide_review_success'
			})
		}
	}
}
</script>

<style scoped lang="scss">
.guide-review-page {
	position: relative;
	min-height: 100vh;
	background:
		radial-gradient(circle at 50% -2%, rgba(228, 232, 241, 0.84) 0, rgba(228, 232, 241, 0.22) 320rpx, rgba(255, 255, 255, 0) 760rpx),
		linear-gradient(180deg, #f9fafc 0%, #ffffff 380rpx, #ffffff 100%);
}

.guide-review-page__glow {
	position: absolute;
	border-radius: 50%;
	pointer-events: none;
	filter: blur(16rpx);
}

.guide-review-page__glow--left {
	top: -80rpx;
	left: -80rpx;
	width: 320rpx;
	height: 320rpx;
	background: rgba(255, 255, 255, 0.92);
}

.guide-review-page__glow--right {
	top: 120rpx;
	right: -70rpx;
	width: 280rpx;
	height: 220rpx;
	background: rgba(220, 227, 244, 0.42);
}

.guide-review-page__header {
	position: relative;
	z-index: 2;
}

.guide-review-page__nav {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 92rpx;
}

.guide-review-page__back,
.guide-review-page__nav-placeholder {
	width: 72rpx;
	height: 72rpx;
	flex: none;
}

.guide-review-page__back {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	margin-left: -8rpx;
}

.guide-review-page__scroll {
	position: relative;
	z-index: 1;
	height: calc(100vh - env(safe-area-inset-bottom));
}

.guide-review-page__body {
	padding-top: 32rpx;
	padding-bottom: calc(220rpx + env(safe-area-inset-bottom));
}

.guide-review-page__title {
	display: block;
	padding: 26rpx 18rpx 0;
	font-size: 58rpx;
	line-height: 1.22;
	font-weight: 700;
	color: #1f232c;
	text-align: center;
}

.guide-review-card {
	margin-top: 34rpx;
	padding: 0 42rpx;
	border-radius: 28rpx;
	background: rgba(255, 255, 255, 0.96);
	box-shadow: 0 18rpx 48rpx rgba(30, 38, 58, 0.08);
}

.guide-review-card__head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	min-height: 112rpx;
}

.guide-review-card__heading {
	font-size: 28rpx;
	line-height: 1.3;
	font-weight: 700;
	color: #1f232c;
}

.guide-review-projects__item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	min-height: 92rpx;
	border-top: 2rpx solid #eff1f4;
}

.guide-review-projects__text {
	font-size: 26rpx;
	line-height: 1.4;
	color: #8f949e;
}

.guide-review-projects__item.is-active .guide-review-projects__text {
	color: #30353f;
}

.guide-review-projects__dot {
	width: 16rpx;
	height: 16rpx;
	border-radius: 50%;
	background: #143080;
	box-shadow: 0 0 0 8rpx rgba(20, 48, 128, 0.1);
}

.guide-review-card--ratings {
	padding-top: 10rpx;
	padding-bottom: 10rpx;
}

.rating-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 36rpx 0;
	column-gap: 24rpx;
}

.rating-row.is-bordered {
	border-bottom: 2rpx solid #eff1f4;
}

.rating-row__main {
	display: flex;
	align-items: center;
	flex: 1;
	min-width: 0;
}

.rating-row__avatar {
	width: 68rpx;
	height: 68rpx;
	margin-right: 22rpx;
	border-radius: 50%;
	background: #eef1f7;
	flex: none;
}

.rating-row__label {
	flex: 1;
	min-width: 0;
	font-size: 28rpx;
	line-height: 1.45;
	color: #1f232c;
}

.guide-review-card--textarea {
	padding-top: 42rpx;
	padding-bottom: 30rpx;
}

.guide-review-page__textarea {
	width: 100%;
	height: 300rpx;
	margin-top: 40rpx;
	font-size: 26rpx;
	line-height: 1.7;
	color: #2a2f38;
}

.guide-review-page__textarea-placeholder {
	color: #c5c9d2;
}

.guide-review-page__count {
	display: block;
	margin-top: 18rpx;
	font-size: 24rpx;
	line-height: 1;
	color: #c5c9d2;
	text-align: right;
}

.guide-review-page__footer {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 6;
	padding: 20rpx 0 calc(24rpx + env(safe-area-inset-bottom));
	background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.92) 28%, #ffffff 100%);
}

.guide-review-page__submit {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 104rpx;
	border-radius: 999rpx;
	background: #143080;
	font-size: 34rpx;
	font-weight: 600;
	line-height: 1;
	color: #ffffff;
	box-shadow: 0 18rpx 34rpx rgba(20, 48, 128, 0.14);
}

@media screen and (max-width: 360px) {
	.guide-review-page__title {
		font-size: 50rpx;
	}

	.rating-row {
		align-items: flex-start;
	}

	.rating-row__main {
		padding-top: 4rpx;
	}
}
</style>
