<template>
	<view class="topic-page">
		<view class="topic-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="topic-page__search-row">
				<view class="topic-page__search">
					<text class="topic-page__hash">#</text>
					<input
						v-model.trim="keyword"
						class="topic-page__input"
						:placeholder="ui.placeholder"
						placeholder-class="topic-page__input-placeholder"
						confirm-type="search"
					/>
				</view>
				<view class="topic-page__cancel" @tap="goBack">{{ ui.cancelLabel }}</view>
			</view>
		</view>

		<view class="topic-page__section-title">{{ ui.sectionTitle }}</view>

		<scroll-view class="topic-page__list" scroll-y>
			<view
				v-for="topic in filteredTopics"
				:key="topic.id"
				class="topic-item"
				@tap="handleTopicSelect(topic)"
			>
				<text class="topic-item__title">{{ formatTopicTitle(topic.title) }}</text>
				<text class="topic-item__meta">{{ topic.joinText }}</text>
			</view>

			<view v-if="!filteredTopics.length" class="topic-page__empty">
				<text class="topic-page__empty-title">{{ ui.emptyTitle }}</text>
				<text class="topic-page__empty-text">{{ ui.emptyText }}</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
const UI_TEXT = {
	placeholder: '你的话题',
	cancelLabel: '取消',
	sectionTitle: '热门话题',
	emptyTitle: '暂无匹配话题',
	emptyText: '换个关键词试试'
}

const HOT_TOPICS = [
	{ id: 'beauty-checkin', title: '变美打卡计划', joinText: '3.2万人参与' },
	{ id: 'beauty-diary', title: '我的变美恢复日记', joinText: '1.4万人参与' },
	{ id: 'decision', title: '决定做医美的那一瞬间', joinText: '16386人参与' },
	{ id: 'skin-shoot', title: '皮肤状态好时随手都是大片', joinText: '1014人参与' },
	{ id: 'summer-plan', title: '2026夏日焕颜计划', joinText: '7532人参与' },
	{ id: 'water-light', title: '到店拍水光肌变美大片', joinText: '205人参与' },
	{ id: 'pamper-self', title: '这个月值得好好宠爱自己', joinText: '612人参与' },
	{ id: 'orders', title: '晒晒我的医美项目清单', joinText: '2879人参与' },
	{ id: 'no-crowd', title: '不扎堆也能稳稳变美', joinText: '2567人参与' },
	{ id: 'reasons', title: '我选择轻医美的理由', joinText: '1227人参与' },
	{ id: 'best-state', title: '分享你的变美最佳状态', joinText: '2876人参与' },
	{ id: 'confidence', title: '认真爱自己这件小事', joinText: '1864人参与' }
]

function getStatusBarHeight() {
	try {
		const { statusBarHeight = 20 } = uni.getSystemInfoSync()
		return statusBarHeight
	} catch (error) {
		return 20
	}
}

function normalizeMode(mode) {
	return mode === 'select' ? 'select' : 'detail'
}

export default {
	data() {
		return {
			ui: UI_TEXT,
			statusBarHeight: getStatusBarHeight(),
			mode: 'detail',
			keyword: '',
			topics: HOT_TOPICS
		}
	},
	onLoad(options = {}) {
		this.mode = normalizeMode(options.mode)
	},
	computed: {
		filteredTopics() {
			const normalizedKeyword = this.keyword.trim().replace(/^#+/, '')
			if (!normalizedKeyword) {
				return this.topics
			}

			return this.topics.filter((topic) => topic.title.indexOf(normalizedKeyword) !== -1)
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
				url: '/pages/index/index'
			})
		},
		formatTopicTitle(title) {
			return `#${title}#`
		},
		handleTopicSelect(topic) {
			if (this.mode === 'select') {
				const eventChannel =
					typeof this.getOpenerEventChannel === 'function' ? this.getOpenerEventChannel() : null

				if (eventChannel) {
					eventChannel.emit('topicSelected', {
						topic: {
							...topic,
							displayTitle: this.formatTopicTitle(topic.title)
						}
					})
				}

				this.goBack()
				return
			}

			uni.navigateTo({
				url: `/bundle/pages/topic/detail?id=${topic.id}&title=${encodeURIComponent(topic.title)}`
			})
		}
	}
}
</script>

<style scoped lang="scss">
.topic-page {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background: #ffffff;
}

.topic-page__header {
	flex: none;
	background: #ffffff;
}

.topic-page__search-row {
	display: flex;
	align-items: center;
	height: 112rpx;
	padding-left: 28rpx;
	border-bottom: 2rpx solid #f1f1f1;
}

.topic-page__search {
	display: flex;
	align-items: center;
	flex: 1;
	min-width: 0;
	height: 72rpx;
}

.topic-page__hash {
	flex: none;
	margin-right: 12rpx;
	font-size: 34rpx;
	font-weight: 500;
	line-height: 1;
	color: #111111;
}

.topic-page__input {
	flex: 1;
	min-width: 0;
	height: 72rpx;
	font-size: 34rpx;
	line-height: 72rpx;
	color: #111111;
}

.topic-page__input-placeholder {
	color: #d1d1d6;
}

.topic-page__cancel {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 128rpx;
	height: 64rpx;
	margin-left: 20rpx;
	border-left: 2rpx solid #f3f3f3;
	font-size: 28rpx;
	line-height: 1;
	color: #111111;
}

.topic-page__section-title {
	flex: none;
	padding: 30rpx 28rpx 16rpx;
	font-size: 24rpx;
	line-height: 1.2;
	color: #d0d0d0;
	background: #ffffff;
}

.topic-page__list {
	flex: 1;
	min-height: 0;
	padding: 0 28rpx calc(env(safe-area-inset-bottom) + 28rpx);
	box-sizing: border-box;
}

.topic-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	min-height: 104rpx;
	padding: 18rpx 0;
	border-bottom: 2rpx solid #f5f5f5;
	box-sizing: border-box;
}

.topic-item__title {
	flex: 1;
	min-width: 0;
	padding-right: 24rpx;
	font-size: 32rpx;
	line-height: 1.45;
	color: #1e1e22;
}

.topic-item__meta {
	flex: none;
	font-size: 24rpx;
	line-height: 1.2;
	color: #9ea3ad;
}

.topic-page__empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding-top: 180rpx;
}

.topic-page__empty-title {
	font-size: 28rpx;
	line-height: 1.2;
	color: #909399;
}

.topic-page__empty-text {
	margin-top: 16rpx;
	font-size: 24rpx;
	line-height: 1.2;
	color: #c0c4cc;
}
</style>
