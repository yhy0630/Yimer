<template>
	<view class="surprise-activity-page">
		<view class="surprise-activity-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="page-shell surprise-activity-page__nav">
				<view class="surprise-activity-page__back" @tap="goBack">
					<u-icon name="arrow-left" size="46" color="#23262d"></u-icon>
				</view>
			</view>

			<view class="page-shell surprise-activity-page__toolbar">
				<view class="surprise-activity-page__search">
					<u-icon name="search" size="38" color="#b8b8b8"></u-icon>
					<view class="surprise-activity-page__search-divider"></view>
					<input
						v-model.trim="keyword"
						class="surprise-activity-page__search-input"
						placeholder="请搜索"
						placeholder-class="surprise-activity-page__search-placeholder"
						confirm-type="search"
					/>
				</view>

				<view class="surprise-activity-page__filters">
					<view class="surprise-activity-page__filters-main">
						<view class="surprise-activity-page__filter-item" @tap="openFilterSheet('city')">
							<text class="line-1">{{ currentCityLabel }}</text>
							<u-icon name="arrow-down" size="18" color="#8f95a3"></u-icon>
						</view>
						<view class="surprise-activity-page__filter-item" @tap="openFilterSheet('status')">
							<text class="line-1">{{ currentStatusLabel }}</text>
							<u-icon name="arrow-down" size="18" color="#8f95a3"></u-icon>
						</view>
						<view class="surprise-activity-page__filter-item" @tap="openFilterSheet('type')">
							<text class="line-1">{{ currentTypeLabel }}</text>
							<u-icon name="arrow-down" size="18" color="#8f95a3"></u-icon>
						</view>
					</view>
					<view
						:class="['surprise-activity-page__member-filter', filters.memberOnly ? 'is-active' : '']"
						@tap="toggleMemberOnly"
					>
						黑金专属
					</view>
				</view>
			</view>
		</view>

		<view class="page-shell surprise-activity-page__body">
			<view v-if="displayActivities.length" class="surprise-activity-page__list">
				<view
					v-for="item in displayActivities"
					:key="item.id"
					class="surprise-activity-page__card"
					@tap="openActivity(item)"
				>
					<image class="surprise-activity-page__thumb" :src="item.image" mode="aspectFill"></image>

					<view class="surprise-activity-page__content">
						<text class="surprise-activity-page__title line-2">{{ item.title }}</text>
						<text class="surprise-activity-page__date">{{ item.date }}</text>
						<view class="surprise-activity-page__meta">
							<text class="surprise-activity-page__signup">{{ item.signupText }}</text>
							<text class="surprise-activity-page__separator">|</text>
							<text :class="['surprise-activity-page__status', `is-${item.statusTone}`]">{{ item.status }}</text>
						</view>
					</view>
				</view>
			</view>

			<view v-else class="surprise-activity-page__empty">
				<text class="surprise-activity-page__empty-title">没有找到相关活动</text>
				<text class="surprise-activity-page__empty-desc">试试更换搜索词或筛选条件看看</text>
			</view>
		</view>

		<u-action-sheet
			v-model="showFilterSheet"
			:list="filterSheetList"
			:cancel-btn="true"
			:safe-area-inset-bottom="true"
			border-radius="28"
			@click="handleFilterSelect"
		></u-action-sheet>
	</view>
</template>

<script>
import { getSurpriseActivityList } from '../activity_detail/activity.data'

function getStatusBarHeight() {
	try {
		const { statusBarHeight = 20 } = uni.getSystemInfoSync()
		return statusBarHeight
	} catch (error) {
		return 20
	}
}

function normalizeKeyword(keyword) {
	return String(keyword || '').trim().toLowerCase()
}

const FILTER_OPTIONS = {
	city: [
		{ label: '全部城市', value: '' },
		{ label: '北京', value: '北京' },
		{ label: '上海', value: '上海' },
		{ label: '成都', value: '成都' }
	],
	status: [
		{ label: '活动状态', value: '' },
		{ label: '报名中', value: '报名中' },
		{ label: '已报名', value: '已报名' },
		{ label: '报名已截止', value: '报名已截止' },
		{ label: '活动结束', value: '活动结束' }
	],
	type: [
		{ label: '活动类型', value: '' },
		{ label: '会员专场', value: '会员专场' },
		{ label: '美食', value: '美食' },
		{ label: '美学体验', value: '美学体验' },
		{ label: '其他', value: '其他' }
	]
}

export default {
	data() {
		return {
			statusBarHeight: getStatusBarHeight(),
			keyword: '',
			filters: {
				city: '',
				status: '',
				type: '',
				memberOnly: false
			},
			showFilterSheet: false,
			activeFilterKey: 'city',
			activities: getSurpriseActivityList()
		}
	},
	computed: {
		currentCityLabel() {
			return this.getFilterLabel('city', this.filters.city)
		},
		currentStatusLabel() {
			return this.getFilterLabel('status', this.filters.status)
		},
		currentTypeLabel() {
			return this.getFilterLabel('type', this.filters.type)
		},
		filterSheetList() {
			const options = FILTER_OPTIONS[this.activeFilterKey] || []
			const selectedValue = this.filters[this.activeFilterKey]

			return options.map((item) => ({
				text: item.label,
				color: item.value === selectedValue ? '#143080' : '#1f232b'
			}))
		},
		displayActivities() {
			const keyword = normalizeKeyword(this.keyword)

			return this.activities.filter((item) => {
				if (this.filters.city && item.city !== this.filters.city) {
					return false
				}

				if (this.filters.status && item.status !== this.filters.status) {
					return false
				}

				if (this.filters.type && item.type !== this.filters.type) {
					return false
				}

				if (this.filters.memberOnly && !item.memberOnly) {
					return false
				}

				if (!keyword) {
					return true
				}

				const searchText = [item.title, item.date, item.signupText, item.status, item.city, item.type]
					.join(' ')
					.toLowerCase()

				return searchText.includes(keyword)
			})
		}
	},
	methods: {
		getFilterLabel(key, value) {
			const options = FILTER_OPTIONS[key] || []
			const activeItem = options.find((item) => item.value === value)
			return activeItem ? activeItem.label : options[0].label
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
				url: '/pages/surprise/surprise'
			})
		},
		openFilterSheet(key) {
			this.activeFilterKey = key
			this.showFilterSheet = true
		},
		handleFilterSelect(index) {
			const options = FILTER_OPTIONS[this.activeFilterKey] || []
			const target = options[index]

			if (!target) {
				return
			}

			this.filters[this.activeFilterKey] = target.value
		},
		toggleMemberOnly() {
			this.filters.memberOnly = !this.filters.memberOnly
		},
		openActivity(item) {
			uni.navigateTo({
				url: `/bundle_surprise/pages/activity_detail/activity_detail?id=${item.id}`
			})
		}
	}
}
</script>

<style scoped lang="scss">
.surprise-activity-page {
	min-height: 100vh;
	background: #ffffff;
}

.surprise-activity-page__header {
	position: sticky;
	top: 0;
	z-index: 10;
	background: rgba(255, 255, 255, 0.98);
}

.surprise-activity-page__nav {
	display: flex;
	align-items: center;
	height: 96rpx;
}

.surprise-activity-page__back {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 72rpx;
	height: 72rpx;
	margin-left: -12rpx;
}

.surprise-activity-page__toolbar {
	padding-top: 8rpx;
	padding-bottom: 20rpx;
	background: #ffffff;
}

.surprise-activity-page__search {
	display: flex;
	align-items: center;
	height: 100rpx;
	padding: 0 30rpx;
	border-radius: 20rpx;
	background: #f7f7f7;
}

.surprise-activity-page__search-divider {
	width: 2rpx;
	height: 32rpx;
	margin: 0 22rpx;
	background: #dddddd;
}

.surprise-activity-page__search-input {
	flex: 1;
	min-width: 0;
	height: 100rpx;
	font-size: 32rpx;
	color: #22262d;
}

.surprise-activity-page__search-placeholder {
	font-size: 32rpx;
	color: #c8c8c8;
}

.surprise-activity-page__filters {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 34rpx;
	gap: 20rpx;
}

.surprise-activity-page__filters-main {
	display: flex;
	align-items: center;
	flex: 1;
	min-width: 0;
}

.surprise-activity-page__filter-item {
	display: flex;
	align-items: center;
	max-width: 190rpx;
	margin-right: 42rpx;
	font-size: 28rpx;
	line-height: 1.2;
	color: #2c313d;
}

.surprise-activity-page__filter-item .u-icon {
	flex: none;
	margin-left: 10rpx;
}

.surprise-activity-page__member-filter {
	flex: none;
	font-size: 28rpx;
	line-height: 1.2;
	color: #2c313d;
}

.surprise-activity-page__member-filter.is-active {
	color: #143080;
	font-weight: 600;
}

.surprise-activity-page__body {
	padding-top: 6rpx;
	padding-bottom: calc(env(safe-area-inset-bottom) + 56rpx);
	background: #ffffff;
}

.surprise-activity-page__card {
	display: flex;
	align-items: flex-start;
	padding: 28rpx 0;
}

.surprise-activity-page__thumb {
	flex: none;
	width: 184rpx;
	height: 184rpx;
	border-radius: 18rpx;
	background: #edf1f7;
}

.surprise-activity-page__content {
	flex: 1;
	min-width: 0;
	margin-left: 30rpx;
	padding-top: 8rpx;
}

.surprise-activity-page__title {
	font-size: 34rpx;
	line-height: 1.34;
	color: #1d2129;
}

.surprise-activity-page__date {
	display: block;
	margin-top: 18rpx;
	font-size: 24rpx;
	line-height: 1.2;
	color: #9a9ea9;
}

.surprise-activity-page__meta {
	display: flex;
	align-items: center;
	margin-top: 24rpx;
	font-size: 24rpx;
	line-height: 1.2;
}

.surprise-activity-page__signup,
.surprise-activity-page__separator {
	color: #9a9ea9;
}

.surprise-activity-page__separator {
	margin: 0 12rpx;
}

.surprise-activity-page__status {
	color: #9a9ea9;
}

.surprise-activity-page__status.is-primary {
	color: #143080;
}

.surprise-activity-page__status.is-muted {
	color: #9a9ea9;
}

.surprise-activity-page__empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 220rpx 0 180rpx;
}

.surprise-activity-page__empty-title {
	font-size: 34rpx;
	line-height: 1.2;
	font-weight: 600;
	color: #1f232b;
}

.surprise-activity-page__empty-desc {
	margin-top: 18rpx;
	font-size: 26rpx;
	line-height: 1.4;
	color: #959aa6;
}
</style>
