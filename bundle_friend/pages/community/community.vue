<template>
	<view class="community-page" :style="{ paddingTop: topInset + 'px' }">
		<view class="community-page__nav">
			<image class="community-page__nav-icon" src="/static/images/back.png" mode="aspectFit" @tap="goBack" />
			<image class="community-page__nav-icon" src="/static/images/share.png" mode="aspectFit" />
		</view>

		<view class="community-page__content">
			<text class="community-page__title">发现社群</text>

			<view class="community-page__search">
				<u-icon name="search" size="32" color="#B8B8B8"></u-icon>
				<view class="community-page__search-divider"></view>
				<text class="community-page__search-text">请搜索社群</text>
			</view>

			<view class="community-page__filters">
				<view class="community-page__filter-item">
					<text class="community-page__filter-text">位置</text>
					<u-icon name="arrow-down" size="24" color="#77797E"></u-icon>
				</view>
				<view class="community-page__filter-item">
					<text class="community-page__filter-text">类型</text>
					<u-icon name="arrow-down" size="24" color="#77797E"></u-icon>
				</view>
			</view>

			<view class="friend-community__list">
				<view
					v-for="(item, index) in communityList"
					:key="item.id"
					class="friend-community__item"
					@tap="handleCommunityTap(item)"
				>
					<view class="friend-community__cover-wrap">
						<image
							class="friend-community__cover"
							:src="item.cover || getCommunityIcon(index)"
							mode="aspectFill"
						/>
					</view>
					<view class="friend-community__body">
						<view class="friend-community__meta">
							<text class="friend-community__meta-chip">{{ item.city }}</text>
							<text class="friend-community__meta-chip">{{ item.tag }}</text>
						</view>
						<text class="friend-community__name">{{ item.title }}</text>
						<view class="friend-community__footer">
							<view class="friend-community__members">
								<image
									v-for="(avatar, avatarIndex) in item.memberAvatars"
									:key="`${item.id}-${avatarIndex}`"
									class="friend-community__member-avatar"
									:src="avatar"
									mode="aspectFill"
								/>
								<text class="friend-community__member-count">{{ item.memberCount }}</text>
							</view>
						</view>
					</view>
					<view class="friend-community__action" @tap.stop="openCommunityDetail(item)">查看</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
const getTopInset = () => {
	try {
		const { statusBarHeight = 20 } = uni.getSystemInfoSync()
		return statusBarHeight + 14
	} catch (error) {
		return 34
	}
}

const COMMUNITY_ICONS = [
	'/static/linshi/10.png',
	'/static/linshi/11.png',
	'/static/linshi/12.png'
]

const COMMUNITY_LIST = [
	{
		id: 'community-a',
		title: '幸福社区',
		city: '北京市',
		tag: '交友',
		memberCount: '296名成员',
		memberAvatars: ['/static/linshi/01.png', '/static/linshi/02.png', '/static/linshi/01.png']
	},
	{
		id: 'community-b',
		title: '春夏焕颜',
		city: '北京市',
		tag: '交友',
		memberCount: '296名成员',
		memberAvatars: ['/static/linshi/02.png', '/static/linshi/01.png', '/static/linshi/02.png']
	},
	{
		id: 'community-c',
		title: '种草清单',
		city: '北京市',
		tag: '交友',
		memberCount: '296名成员',
		memberAvatars: ['/static/linshi/01.png', '/static/linshi/02.png', '/static/linshi/01.png']
	},
	{
		id: 'community-d',
		title: '焕颜计划',
		city: '北京市',
		tag: '交友',
		memberCount: '296名成员',
		memberAvatars: ['/static/linshi/02.png', '/static/linshi/01.png', '/static/linshi/02.png']
	},
	{
		id: 'community-e',
		title: '幸福社区',
		city: '北京市',
		tag: '交友',
		memberCount: '296名成员',
		memberAvatars: ['/static/linshi/01.png', '/static/linshi/02.png', '/static/linshi/01.png']
	}
]

export default {
	name: 'CommunityDiscover',
	data() {
		return {
			topInset: getTopInset(),
			communityList: COMMUNITY_LIST
		}
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		getCommunityIcon(index) {
			return COMMUNITY_ICONS[index % COMMUNITY_ICONS.length]
		},
		handleCommunityTap(item) {
			uni.showToast({
				title: item.title,
				icon: 'none'
			})
		},
		openCommunityDetail(item) {
			uni.navigateTo({
				url: `/bundle_friend/pages/community_detail/community_detail?title=${encodeURIComponent(item.title)}`
			})
		}
	}
}
</script>

<style scoped lang="scss">
.community-page {
	min-height: 100vh;
	background: #ffff;
}

.community-page__nav {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 18rpx 36rpx 0;
}

.community-page__nav-icon {
	width: 40rpx;
	height: 40rpx;
}

.community-page__content {
	padding: 30rpx 44rpx calc(env(safe-area-inset-bottom) + 30rpx);
}

.community-page__title {
	font-size: 34rpx;
	font-weight: 550;
	color:  #1A1B1D;
	font-style: normal;
	line-height: 48rpx;

}

.community-page__search {
	display: flex;
	align-items: center;
	height: 70rpx;
	padding: 0 20rpx;
	margin-top: 30rpx;
	border-radius: 12rpx;
	background: #f1f1f2;
}

.community-page__search-text {
	margin-left: 20rpx;
	font-size: 24rpx;
	color: #b8b8b8;
	text-align: center;
	line-height: 32rpx;
	font-style: normal;
	font-weight: 400;
}

.community-page__search-divider {
	width: 2rpx;
	height: 26rpx;
	margin-left: 20rpx;
	background: #d3d3d3;
}

.community-page__filters {
	display: flex;
	align-items: center;
	margin-top: 40rpx;
}

.community-page__filter-item {
	display: inline-flex;
	align-items: center;
	margin-right: 34rpx;
}

.community-page__filter-text {
	margin-right: 8rpx;
	font-size: 28rpx;
	color: #77797e;
	font-style: normal;
	line-height: 20rpx;
	font-weight: 400;
}

.friend-community__list {
	margin-top: 20rpx;
}

.friend-community__item {
	display: flex;
	align-items: stretch;
	padding: 20rpx 0;
}

.friend-community__cover-wrap {
	width: 144rpx;
	height: 144rpx;
	flex: none;
	align-self: center;
	border-radius: 14rpx;
	overflow: hidden;
	background: #edf1f9;
}

.friend-community__cover {
	width: 100%;
	height: 100%;
	display: block;
}

.friend-community__body {
	flex: 1;
	min-width: 0;
	margin-left: 30rpx;
}

.friend-community__meta {
	display: flex; 
	align-items: center;
}

.friend-community__meta-chip {
	height: 36rpx;
	padding: 2rpx 4rpx;
	margin-right: 14rpx;
	border-radius: 4rpx;
	background: #f7f7f7;
	font-size: 22rpx;
	line-height: 28rpx;
	color: #77797e;
	justify-content: center;
	align-items: center;
	font-style: 400;
	line-height: 28rpx;
}

.friend-community__name {
	display: block;
	margin-top: 16rpx;
	font-size: 28rpx;
	font-weight: 600;
	line-height: 40rpx;
	color: #1A1b1d;
	font-style: normal;
}

.friend-community__footer {
	display: flex;
	align-items: center;
	margin-top: 16rpx;
}

.friend-community__members {
	display: flex;
	align-items: center;
	min-width: 0;
}

.friend-community__member-avatar {
	width: 24rpx;
	height: 24rpx;
	margin-right: 0rpx;
	border-radius: 50%;
	border: 1rpx solid #ffffff;
	// background: #edf0f8;
}

.friend-community__member-count {
	margin-left: 16rpx;
	font-size: 20rpx;
	color: #77797e;
	font-weight: 400;
	line-height: 28rpx;
	font-style: normal;
}

.friend-community__action {
	display: block;
	width: 104rpx;
	height: 44rpx;
	line-height: 44rpx;
	text-align: center;
	align-self: center;
	flex: none;
	margin-left: 18rpx;
	border-radius: 22rpx;
	border: 1rpx solid #e1e2e5;
	// background: #ffffff;
	font-size: 24rpx;
	color: #77797e;
	font-style: normal;
	font-weight: 400;
	line-height: 36rpx;
}
</style>
