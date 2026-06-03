<template>
	<view class="chat-wrap" :style="{ paddingTop: statusBarHeight + 'px' }">
		<view class="nav">
			<image class="nav-back" src="/static/images/back.png" mode="aspectFit" @tap="goBack" />
			<view class="nav-center">
				<text class="nav-title">{{ chatTitle }}</text>
				<view v-if="isPersonal && burnDays" class="nav-sub">
					<text class="nav-fire">🔥</text>
					<text class="nav-sub-text">已燃烧{{ burnDays }}天</text>
				</view>
			</view>
			<image class="nav-more" src="/static/images/sandian 1.png" mode="aspectFit" @tap="goSetting" />
		</view>

		<scroll-view class="body" scroll-y :style="{ height: bodyHeight + 'px' }">
			<text class="time">4-30 15:55</text>
			<text class="notice">我们已经是好友了，可以聊天了</text>

			<view class="row row-left">
				<image class="avatar" :src="peerAvatar" mode="aspectFill" />
				<view class="bubble bubble-gray">
					<text class="text">我通过了你的朋友验证请求，现在我们可以开始聊天了</text>
				</view>
			</view>

			<text class="time">15:55</text>

			<view class="row row-right">
				<view class="bubble bubble-blue">
					<text class="text text-white">约了朋友吃火锅，先走啦，明天见！</text>
				</view>
				<image class="avatar" :src="myAvatar" mode="aspectFill" />
			</view>
		</scroll-view>

		<view class="footer" :style="{ paddingBottom: safeBottom + 'px' }">
			<u-icon name="mic" size="44" color="#1A1B1D"></u-icon>
			<view class="input-wrap">
				<input class="input" placeholder="输入内容" placeholder-class="input-ph" />
			</view>
			<text class="emoji">☺</text>
			<u-icon name="plus-circle" size="44" color="#1A1B1D"></u-icon>
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

const getBodyHeight = (statusBarHeight, safeBottom) => {
	try {
		const { windowHeight = 667 } = uni.getSystemInfoSync()
		const navHeight = 44
		const footerHeight = 56
		return windowHeight - statusBarHeight - navHeight - footerHeight - safeBottom
	} catch (error) {
		return 500
	}
}

const DEFAULT_MESSAGES = {
	personal: {
		title: '伊美尔用户00QX95',
		burnDays: 430,
		peerAvatar: '/static/linshi/02.png',
		myAvatar: '/static/linshi/01.png'
	},
	group: {
		title: '专属服务群',
		count: 4,
		peerAvatar: '/static/linshi/02.png',
		myAvatar: '/static/linshi/01.png'
	}
}

export default {
	name: 'FriendChat',
	data() {
		const statusBarHeight = getStatusBarHeight()
		const safeBottom = getSafeBottom()
		return {
			statusBarHeight,
			safeBottom,
			bodyHeight: getBodyHeight(statusBarHeight, safeBottom),
			chatType: 'personal',
			chatTitle: '',
			burnDays: 0,
			peerAvatar: '/static/linshi/02.png',
			myAvatar: '/static/linshi/01.png'
		}
	},
	computed: {
		isPersonal() {
			return this.chatType === 'personal'
		},
		isGroup() {
			return this.chatType === 'group'
		}
	},
	onLoad(options = {}) {
		const type = options.type === 'group' ? 'group' : 'personal'
		const preset = DEFAULT_MESSAGES[type]
		const rawTitle = options.title ? decodeURIComponent(options.title) : preset.title
		const count = Number(options.count || preset.count || 0)

		this.chatType = type
		this.burnDays = Number(options.burnDays || preset.burnDays || 0)
		this.peerAvatar = options.peerAvatar ? decodeURIComponent(options.peerAvatar) : preset.peerAvatar
		this.myAvatar = options.myAvatar ? decodeURIComponent(options.myAvatar) : preset.myAvatar

		if (type === 'group' && count > 0) {
			this.chatTitle = rawTitle.includes('(') ? rawTitle : `${rawTitle}(${count})`
		} else {
			this.chatTitle = rawTitle
		}
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		goSetting() {
			let settingTitle = this.chatTitle
			if (this.isPersonal && settingTitle === '伊美尔用户00QX95') {
				settingTitle = '伊美尔用户吴彦谦'
			}
			if (this.isGroup) {
				settingTitle = settingTitle.replace(/\(\d+\)$/, '') || '伊美尔专属服务群'
			}

			const title = encodeURIComponent(settingTitle)
			let url = `/bundle_friend/pages/chat_setting/chat_setting?type=${this.chatType}&title=${title}`

			if (this.isPersonal) {
				url += `&avatar=${encodeURIComponent(this.peerAvatar)}`
			}

			uni.navigateTo({ url })
		}
	}
}
</script>

<style scoped lang="scss">
.chat-wrap {
	min-height: 100vh;
	background: #ffffff;
	display: flex;
	flex-direction: column;
}

.nav {
	display: flex;
	align-items: center;
	height: 88rpx;
	padding: 0 24rpx;
	border-bottom: 1rpx solid #f0f1f3;
}

.nav-back {
	width: 40rpx;
	height: 40rpx;
	flex: none;
}

.nav-center {
	flex: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 0 16rpx;
}

.nav-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #1a1b1d;
	line-height: 1.2;
}

.nav-sub {
	display: flex;
	align-items: center;
	margin-top: 4rpx;
}

.nav-fire {
	font-size: 22rpx;
	line-height: 1;
}

.nav-sub-text {
	margin-left: 4rpx;
	font-size: 22rpx;
	color: #e85d4a;
	line-height: 1.2;
}

.nav-more {
	width: 40rpx;
	height: 40rpx;
	flex: none;
}

.body {
	flex: 1;
	padding: 24rpx 24rpx 12rpx;
	box-sizing: border-box;
}

.time {
	display: block;
	text-align: center;
	font-size: 22rpx;
	color: #b0b3b9;
	line-height: 1.4;
	margin-bottom: 16rpx;
}

.notice {
	display: block;
	text-align: center;
	font-size: 22rpx;
	color: #b0b3b9;
	line-height: 1.4;
	margin-bottom: 28rpx;
}

.row {
	display: flex;
	align-items: flex-start;
	margin-bottom: 28rpx;
}

.row-left {
	justify-content: flex-start;
}

.row-right {
	justify-content: flex-end;
}

.avatar {
	width: 72rpx;
	height: 72rpx;
	border-radius: 50%;
	flex: none;
	background: #eef2f8;
}

.row-left .avatar {
	margin-right: 16rpx;
}

.row-right .avatar {
	margin-left: 16rpx;
}

.bubble {
	max-width: 520rpx;
	padding: 20rpx 24rpx;
	border-radius: 12rpx;
}

.bubble-gray {
	background: #f2f3f5;
}

.bubble-blue {
	background: #143080;
}

.text {
	font-size: 28rpx;
	line-height: 1.5;
	color: #1a1b1d;
	word-break: break-all;
}

.text-white {
	color: #ffffff;
}

.footer {
	display: flex;
	align-items: center;
	padding: 12rpx 24rpx;
	border-top: 1rpx solid #f0f1f3;
	background: #ffffff;
}

.input-wrap {
	flex: 1;
	min-width: 0;
	margin: 0 20rpx;
	padding-bottom: 8rpx;
	border-bottom: 1rpx solid #e6e7eb;
}

.input {
	width: 100%;
	height: 56rpx;
	font-size: 28rpx;
	color: #1a1b1d;
}

.input-ph {
	color: #b8b8b8;
	font-size: 28rpx;
}

.emoji {
	margin-right: 20rpx;
	font-size: 44rpx;
	line-height: 1;
	color: #1a1b1d;
}
</style>
