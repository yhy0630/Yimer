<template>
	<view class="community-sync-page">
		<view class="community-sync-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="page-shell community-sync-page__header-shell">
				<view class="community-sync-page__back" @tap="goBack">
					<u-icon name="arrow-left" size="52" color="#121316"></u-icon>
				</view>
				<view class="community-sync-page__intro">
					<text class="community-sync-page__title">同步到社群</text>
					<text class="community-sync-page__desc">
						选择同步的社群后，内容将同时发布到动态和社群
					</text>
				</view>
			</view>
		</view>

		<scroll-view class="community-sync-page__body" scroll-y>
			<view class="page-shell community-sync-page__list">
				<view
					v-for="community in communities"
					:key="community.id"
					class="community-card"
				>
					<image class="community-card__cover" :src="community.cover" mode="aspectFill" />

					<view class="community-card__content">
						<view class="community-card__tags">
							<text
								v-for="tag in community.tags"
								:key="`${community.id}-${tag}`"
								class="community-card__tag"
							>
								{{ tag }}
							</text>
						</view>

						<text class="community-card__title line-1">{{ community.name }}</text>

						<view class="community-card__meta">
							<view class="community-card__avatars">
								<image
									v-for="(avatar, index) in community.avatars"
									:key="`${community.id}-${avatar}-${index}`"
									:class="['community-card__avatar', index > 0 ? 'is-overlap' : '']"
									:src="avatar"
									mode="aspectFill"
								/>
							</view>
							<text class="community-card__members">{{ community.memberText }}</text>
						</view>
					</view>

					<view
						:class="['community-card__action', selectedCommunityId === community.id ? 'is-selected' : '']"
						@tap="handleSelect(community)"
					>
						{{ selectedCommunityId === community.id ? '已同步' : '同步' }}
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
const COMMUNITY_LIST = [
	{
		id: 'happy-club',
		name: '幸福社区',
		tags: ['北京市', '交友'],
		memberText: '296名成员',
		cover: '/static/linshi/01.png',
		avatars: ['/static/linshi/02.png', '/static/linshi/03.png', '/static/linshi/04.png']
	},
	{
		id: 'spring-summer',
		name: '春夏焕颜',
		tags: ['北京市', '交友'],
		memberText: '296名成员',
		cover: '/static/linshi/02.png',
		avatars: ['/static/linshi/03.png', '/static/linshi/04.png', '/static/linshi/05.png']
	},
	{
		id: 'seed-list',
		name: '种草清单',
		tags: ['北京市', '交友'],
		memberText: '296名成员',
		cover: '/static/linshi/03.png',
		avatars: ['/static/linshi/01.png', '/static/linshi/04.png', '/static/linshi/05.png']
	},
	{
		id: 'renew-plan',
		name: '焕颜计划',
		tags: ['北京市', '交友'],
		memberText: '296名成员',
		cover: '/static/linshi/04.png',
		avatars: ['/static/linshi/02.png', '/static/linshi/03.png', '/static/linshi/05.png']
	},
	{
		id: 'happy-club-sea',
		name: '幸福社区',
		tags: ['北京市', '交友'],
		memberText: '296名成员',
		cover: '/static/linshi/05.png',
		avatars: ['/static/linshi/01.png', '/static/linshi/02.png', '/static/linshi/04.png']
	},
	{
		id: 'happy-club-weekend',
		name: '幸福社区',
		tags: ['北京市', '交友'],
		memberText: '296名成员',
		cover: '/static/linshi/01.png',
		avatars: ['/static/linshi/02.png', '/static/linshi/03.png', '/static/linshi/04.png']
	},
	{
		id: 'happy-club-autumn',
		name: '幸福社区',
		tags: ['北京市', '交友'],
		memberText: '296名成员',
		cover: '/static/linshi/02.png',
		avatars: ['/static/linshi/01.png', '/static/linshi/04.png', '/static/linshi/05.png']
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

export default {
	data() {
		return {
			statusBarHeight: getStatusBarHeight(),
			selectedCommunityId: '',
			communities: COMMUNITY_LIST
		}
	},
	onLoad(options = {}) {
		this.selectedCommunityId = options.selectedId || ''
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
		handleSelect(community) {
			this.selectedCommunityId = community.id
			const eventChannel =
				typeof this.getOpenerEventChannel === 'function' ? this.getOpenerEventChannel() : null

			if (eventChannel) {
				eventChannel.emit('communitySelected', {
					community
				})
			}

			uni.navigateBack({
				delta: 1
			})
		}
	}
}
</script>

<style scoped lang="scss">
.community-sync-page {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background: #ffffff;
}

.community-sync-page__header {
	background: #ffffff;
}

.community-sync-page__header-shell {
	padding-top: 24rpx;
	padding-bottom: 24rpx;
}

.community-sync-page__back {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 84rpx;
	height: 72rpx;
	margin-left: -10rpx;
}

.community-sync-page__intro {
	margin-top: 40rpx;
	padding-bottom: 34rpx;
	border-bottom: 2rpx solid #f0f0f2;
}

.community-sync-page__title {
	display: block;
	font-size: 72rpx;
	font-weight: 300;
	line-height: 1.14;
	color: #202125;
}

.community-sync-page__desc {
	display: block;
	margin-top: 32rpx;
	font-size: 28rpx;
	line-height: 1.6;
	color: #9599a3;
}

.community-sync-page__body {
	flex: 1;
	min-height: 0;
}

.community-sync-page__list {
	padding-top: 18rpx;
	padding-bottom: calc(env(safe-area-inset-bottom) + 40rpx);
}

.community-card {
	display: flex;
	align-items: center;
	padding: 24rpx 0;
}

.community-card + .community-card {
	margin-top: 18rpx;
}

.community-card__cover {
	flex: none;
	width: 184rpx;
	height: 184rpx;
	border-radius: 18rpx;
	background: #f2f3f6;
}

.community-card__content {
	flex: 1;
	min-width: 0;
	margin-left: 22rpx;
	padding-right: 16rpx;
}

.community-card__tags {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
}

.community-card__tag {
	height: 42rpx;
	padding: 0 20rpx;
	margin-right: 12rpx;
	border-radius: 10rpx;
	background: #f7f7f8;
	font-size: 22rpx;
	line-height: 42rpx;
	color: #8f939b;
}

.community-card__title {
	display: block;
	margin-top: 26rpx;
	font-size: 38rpx;
	font-weight: 700;
	line-height: 1.2;
	color: #1f2024;
}

.community-card__meta {
	display: flex;
	align-items: center;
	margin-top: 22rpx;
}

.community-card__avatars {
	display: flex;
	align-items: center;
	flex: none;
}

.community-card__avatar {
	width: 34rpx;
	height: 34rpx;
	border: 2rpx solid #ffffff;
	border-radius: 50%;
	background: #ebeef4;
	box-sizing: border-box;
}

.community-card__avatar.is-overlap {
	margin-left: -10rpx;
}

.community-card__members {
	margin-left: 16rpx;
	font-size: 24rpx;
	line-height: 1.2;
	color: #8f939b;
}

.community-card__action {
	flex: none;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 112rpx;
	height: 54rpx;
	border: 2rpx solid #dfe2e8;
	border-radius: 999rpx;
	font-size: 24rpx;
	line-height: 1;
	color: #8c9198;
	background: #ffffff;
}

.community-card__action.is-selected {
	border-color: #143080;
	color: #143080;
	background: #eef3ff;
}
</style>
