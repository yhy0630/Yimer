<template>
	<view class="campus-page">
		<view class="campus-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="campus-page__nav page-shell">
				<view class="campus-page__back" @tap="goBack">
					<u-icon name="arrow-left" size="46" color="#1d1f25"></u-icon>
				</view>
				<text class="campus-page__title">{{ pageContent.title }}</text>
			</view>

			<view class="page-shell">
				<view class="campus-search">
					<u-icon name="search" size="40" color="#b9bcc3"></u-icon>
					<view class="campus-search__divider"></view>
					<input
						v-model.trim="keyword"
						class="campus-search__input"
						:placeholder="pageContent.searchPlaceholder"
						placeholder-class="campus-search__placeholder"
						confirm-type="search"
					/>
				</view>
			</view>
		</view>

		<view class="page-shell campus-page__body">
			<view v-if="filteredCampusList.length" class="campus-list">
				<view
					v-for="campus in filteredCampusList"
					:key="campus.id"
					class="campus-card"
					@tap="handleCampusTap(campus)"
				>
					<image class="campus-card__cover" :src="campus.image" mode="aspectFill"></image>

					<view class="campus-card__content">
						<view class="campus-card__info">
							<text class="campus-card__name">{{ campus.name }}</text>
							<text class="campus-card__address">{{ campus.address }}</text>
						</view>

						<view class="campus-card__meta">
							<text
								class="campus-card__tag"
								:class="{ 'campus-card__tag--accent': campus.tagTone === 'accent' }"
							>
								{{ campus.tag }}
							</text>
							<text class="campus-card__distance">{{ campus.distance }}</text>
						</view>
					</view>
				</view>
			</view>

			<view v-else class="campus-empty">
				<text class="campus-empty__title">{{ pageContent.emptyTitle }}</text>
				<text class="campus-empty__desc">{{ pageContent.emptyDesc }}</text>
			</view>
		</view>
	</view>
</template>

<script>
import { CAMPUS_LIST } from '@/config/campus'

const PAGE_CONTENT = {
	title: '\u9662\u533a',
	searchPlaceholder: '\u641c\u7d22\u9662\u533a',
	emptyTitle: '\u672a\u627e\u5230\u76f8\u5173\u9662\u533a',
	emptyDesc: '\u8bf7\u5c1d\u8bd5\u66f4\u6362\u641c\u7d22\u5173\u952e\u8bcd',
	switchToastPrefix: '\u5df2\u5207\u6362\u81f3'
}

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

export default {
	data() {
		return {
			statusBarHeight: getStatusBarHeight(),
			keyword: '',
			pageContent: PAGE_CONTENT,
			campusList: CAMPUS_LIST,
			mode: 'select',
			source: '',
			currentCampusId: ''
		}
	},
	computed: {
		filteredCampusList() {
			const keyword = normalizeKeyword(this.keyword)

			if (!keyword) {
				return this.campusList
			}

			return this.campusList.filter((campus) => {
				return [campus.name, campus.shortName, campus.address].some((field) =>
					normalizeKeyword(field).includes(keyword)
				)
			})
		}
	},
	onLoad(options = {}) {
		this.mode = options.mode || 'select'
		this.source = options.source || ''
		this.currentCampusId = options.currentCampusId || ''
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
				url: '/pages/index/index'
			})
		},
		handleCampusTap(campus) {
			if (this.mode === 'detail') {
				uni.navigateTo({
					url: `/bundle/pages/campus/detail?id=${campus.id}&source=${this.source}`
				})
				return
			}

			const eventChannel = this.getOpenerEventChannel()
			if (eventChannel) {
				eventChannel.emit('campusSelected', {
					campus,
					source: this.source
				})
			}

			uni.showToast({
				title: `${this.pageContent.switchToastPrefix}${campus.shortName}`,
				icon: 'none'
			})

			setTimeout(() => {
				this.goBack()
			}, 250)
		}
	}
}
</script>

<style scoped lang="scss">
.campus-page {
	min-height: 100vh;
	background: #ffffff;
}

.campus-page__header {
	background: #ffffff;
}

.campus-page__nav {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 104rpx;
}

.campus-page__back {
	position: absolute;
	left: 6rpx;
	top: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 72rpx;
	height: 72rpx;
	transform: translateY(-50%);
}

.campus-page__title {
	color: #17191e;
	font-size: 64rpx;
	font-weight: 700;
	line-height: 1;
	letter-spacing: 2rpx;
}

.campus-search {
	display: flex;
	align-items: center;
	height: 98rpx;
	padding: 0 30rpx;
	background: #f7f7f8;
	border-radius: 24rpx;
}

.campus-search__divider {
	width: 2rpx;
	height: 36rpx;
	margin: 0 24rpx 0 22rpx;
	background: #d8d9de;
}

.campus-search__input {
	flex: 1;
	min-width: 0;
	height: 98rpx;
	color: #1f2329;
	font-size: 34rpx;
}

.campus-search__placeholder {
	color: #c7c8cc;
	font-size: 34rpx;
}

.campus-page__body {
	padding-top: 42rpx;
	padding-bottom: calc(env(safe-area-inset-bottom) + 44rpx);
}

.campus-card + .campus-card {
	margin-top: 70rpx;
}

.campus-card__cover {
	display: block;
	width: 100%;
	height: 356rpx;
	border-radius: 28rpx;
	background: linear-gradient(135deg, #ece7e0 0%, #d9c8b5 100%);
}

.campus-card__content {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	padding: 30rpx 14rpx 0;
	gap: 24rpx;
}

.campus-card__info {
	flex: 1;
	min-width: 0;
}

.campus-card__name {
	display: block;
	color: #1d1f25;
	font-size: 32rpx;
	font-weight: 700;
	line-height: 1.38;
}

.campus-card__address {
	display: block;
	margin-top: 20rpx;
	color: #8e919b;
	font-size: 26rpx;
	line-height: 1.4;
}

.campus-card__meta {
	flex: none;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	min-width: 136rpx;
	padding-top: 4rpx;
}

.campus-card__tag {
	color: #262a31;
	font-size: 26rpx;
	font-weight: 500;
	line-height: 1.3;
}

.campus-card__tag--accent {
	color: #3159c9;
}

.campus-card__distance {
	margin-top: 28rpx;
	color: #2c3037;
	font-size: 28rpx;
	line-height: 1.2;
}

.campus-empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 220rpx 0 180rpx;
}

.campus-empty__title {
	color: #20242c;
	font-size: 34rpx;
	font-weight: 600;
	line-height: 1.2;
}

.campus-empty__desc {
	margin-top: 18rpx;
	color: #9a9ea8;
	font-size: 26rpx;
	line-height: 1.4;
}
</style>
