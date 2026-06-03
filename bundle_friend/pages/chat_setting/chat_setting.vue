<template>
	<view class="setting-wrap" :style="{ paddingTop: statusBarHeight + 'px' }">
		<view class="nav">
			<image class="back" src="/static/images/back.png" mode="aspectFit" @tap="goBack" />
		</view>

		<scroll-view class="body" scroll-y :style="{ height: scrollHeight + 'px' }">
			<!-- 群聊 -->
			<view v-if="isGroup" class="profile">
				<view class="group-avatar">
					<image
						v-for="(thumb, index) in groupThumbs"
						:key="index"
						class="group-thumb"
						:src="thumb"
						mode="aspectFill"
					/>
				</view>
				<text class="name">{{ displayName }}</text>
			</view>

			<!-- 个人 -->
			<view v-else class="profile">
				<image class="avatar" :src="avatar" mode="aspectFill" />
				<text class="name">{{ displayName }}</text>
			</view>

			<view v-if="isGroup" class="members">
				<text class="members-title">群成员</text>
				<view class="members-grid">
					<view v-for="member in memberList" :key="member.id" class="member">
						<image class="member-avatar" :src="member.avatar" mode="aspectFill" />
						<text class="member-name">{{ member.name }}</text>
					</view>
				</view>
				<view class="members-more" @tap="handleMoreMembers">
					<text class="members-more-text">更多群成员</text>
					<u-icon name="arrow-down" size="20" color="#8F949F"></u-icon>
				</view>
			</view>

			<view class="list">
				<view class="cell cell-arrow" @tap="handleSearch">
					<text class="cell-text">查找聊天记录</text>
					<u-icon name="arrow-right" size="24" color="#C4C6CC"></u-icon>
				</view>

				<view class="divider"></view>

				<view class="cell">
					<text class="cell-text">消息免打扰</text>
					<switch
						class="switch"
						:checked="muteOn"
						color="#143080"
						@change="onMuteChange"
					/>
				</view>

				<view class="cell cell-arrow" @tap="handleReport">
					<text class="cell-text">举报</text>
					<u-icon name="arrow-right" size="24" color="#C4C6CC"></u-icon>
				</view>

				<view class="cell" @tap="handleClear">
					<text class="cell-text">清空聊天记录</text>
				</view>

				<view class="cell">
					<text class="cell-text">拉黑</text>
					<switch
						class="switch"
						:checked="blockOn"
						color="#143080"
						@change="onBlockChange"
					/>
				</view>
			</view>
		</scroll-view>

		<view class="bottom" :style="{ paddingBottom: safeBottom + 'px' }">
			<view class="btn" @tap="handleDanger">
				{{ isGroup ? '退出并删除' : '删除' }}
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

const getSafeBottom = () => {
	try {
		const { safeAreaInsets = {} } = uni.getSystemInfoSync()
		return safeAreaInsets.bottom || 0
	} catch (error) {
		return 0
	}
}

const getScrollHeight = (statusBarHeight, safeBottom) => {
	try {
		const { windowHeight = 667 } = uni.getSystemInfoSync()
		const navHeight = 44
		const bottomHeight = 120
		return windowHeight - statusBarHeight - navHeight - bottomHeight - safeBottom
	} catch (error) {
		return 500
	}
}

const GROUP_MEMBERS = [
	{ id: 'm1', name: '冯艺莲', avatar: '/static/linshi/01.png' },
	{ id: 'm2', name: '吴彦琛', avatar: '/static/linshi/02.png' },
	{ id: 'm3', name: '赵萸艳', avatar: '/static/linshi/01.png' },
	{ id: 'm4', name: '周小艺', avatar: '/static/linshi/02.png' },
	{ id: 'm5', name: '孙思达', avatar: '/static/linshi/01.png' },
	{ id: 'm6', name: '李婷', avatar: '/static/linshi/02.png' },
	{ id: 'm7', name: '周进', avatar: '/static/linshi/01.png' },
	{ id: 'm8', name: '胡嘉言', avatar: '/static/linshi/02.png' }
]

export default {
	name: 'ChatSetting',
	data() {
		const statusBarHeight = getStatusBarHeight()
		const safeBottom = getSafeBottom()
		return {
			statusBarHeight,
			safeBottom,
			scrollHeight: getScrollHeight(statusBarHeight, safeBottom),
			settingType: 'personal',
			displayName: '',
			avatar: '/static/linshi/02.png',
			groupThumbs: [
				'/static/linshi/01.png',
				'/static/linshi/02.png',
				'/static/linshi/01.png',
				'/static/linshi/02.png',
				'/static/linshi/01.png',
				'/static/linshi/02.png',
				'/static/linshi/01.png',
				'/static/linshi/02.png',
				'/static/linshi/01.png'
			],
			memberList: GROUP_MEMBERS,
			muteOn: true,
			blockOn: false
		}
	},
	computed: {
		isGroup() {
			return this.settingType === 'group'
		}
	},
	onLoad(options = {}) {
		this.settingType = options.type === 'group' ? 'group' : 'personal'
		const title = options.title ? decodeURIComponent(options.title) : ''

		if (this.settingType === 'group') {
			this.displayName = title.replace(/\(\d+\)$/, '') || '伊美尔专属服务群'
		} else {
			this.displayName = title || '伊美尔用户吴彦谦'
			if (options.avatar) {
				this.avatar = decodeURIComponent(options.avatar)
			}
		}
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		onMuteChange(event) {
			this.muteOn = event.detail.value
		},
		onBlockChange(event) {
			this.blockOn = event.detail.value
		},
		handleSearch() {
			uni.showToast({ title: '查找聊天记录', icon: 'none' })
		},
		handleReport() {
			uni.showToast({ title: '举报', icon: 'none' })
		},
		handleClear() {
			uni.showToast({ title: '清空聊天记录', icon: 'none' })
		},
		handleMoreMembers() {
			uni.showToast({ title: '更多群成员', icon: 'none' })
		},
		handleDanger() {
			const msg = this.isGroup ? '已退出并删除' : '已删除'
			uni.showToast({ title: msg, icon: 'none' })
		}
	}
}
</script>

<style scoped lang="scss">
.setting-wrap {
	min-height: 100vh;
	background: #ffffff;
	display: flex;
	flex-direction: column;
}

.nav {
	height: 88rpx;
	padding: 0 24rpx;
	display: flex;
	align-items: center;
}

.back {
	width: 40rpx;
	height: 40rpx;
}

.body {
	flex: 1;
	padding: 0 44rpx 24rpx;
	box-sizing: border-box;
}

.profile {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 20rpx;
}

.avatar {
	width: 160rpx;
	height: 160rpx;
	border-radius: 50%;
	background: #eef2f8;
}

.group-avatar {
	width: 160rpx;
	height: 160rpx;
	display: flex;
	flex-wrap: wrap;
	padding: 8rpx;
	border-radius: 50%;
	background: #f3f4f8;
	overflow: hidden;
	box-sizing: border-box;
}

.group-thumb {
	width: calc(33.333% - 4rpx);
	height: calc(33.333% - 4rpx);
	margin: 2rpx;
	border-radius: 6rpx;
	background: #e4e9f2;
}

.name {
	margin-top: 24rpx;
	font-size: 36rpx;
	font-weight: 600;
	color: #1a1b1d;
	line-height: 1.2;
	text-align: center;
}

.members {
	margin-top: 40rpx;
}

.members-title {
	display: block;
	font-size: 28rpx;
	color: #8f949f;
	line-height: 1.2;
}

.members-grid {
	display: flex;
	flex-wrap: wrap;
	margin-top: 24rpx;
}

.member {
	width: 25%;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 28rpx;
}

.member-avatar {
	width: 96rpx;
	height: 96rpx;
	border-radius: 50%;
	background: #eef2f8;
}

.member-name {
	margin-top: 12rpx;
	font-size: 22rpx;
	color: #8f949f;
	line-height: 1.2;
	text-align: center;
	max-width: 120rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.members-more {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 8rpx 0 24rpx;
}

.members-more-text {
	font-size: 24rpx;
	color: #8f949f;
	margin-right: 6rpx;
}

.list {
	margin-top: 16rpx;
}

.cell {
	display: flex;
	align-items: center;
	justify-content: space-between;
	min-height: 96rpx;
}

.cell-text {
	font-size: 30rpx;
	color: #1a1b1d;
	line-height: 1.2;
}

.cell-arrow {
	padding-right: 4rpx;
}

.switch {
	transform: scale(0.82);
}

.divider {
	height: 1rpx;
	background: rgba(17, 24, 39, 0.06);
}

.bottom {
	padding: 24rpx 44rpx 16rpx;
}

.btn {
	height: 88rpx;
	line-height: 88rpx;
	text-align: center;
	border: 2rpx solid #e85d4a;
	border-radius: 999rpx;
	font-size: 30rpx;
	color: #e85d4a;
	background: #ffffff;
}
</style>
