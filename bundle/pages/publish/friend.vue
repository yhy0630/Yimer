<template>
	<view class="mention-page">
		<view class="mention-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="mention-page__search-row">
				<view class="mention-page__search">
					<text class="mention-page__prefix">@</text>
					<input
						v-model.trim="keyword"
						class="mention-page__input"
						placeholder="你的好友"
						placeholder-class="mention-page__input-placeholder"
						confirm-type="search"
					/>
				</view>
				<view class="mention-page__cancel" @tap="goBack">取消</view>
			</view>
		</view>

		<view class="mention-page__body">
			<scroll-view
				class="mention-page__list"
				scroll-y
				:scroll-into-view="scrollIntoView"
				scroll-with-animation
			>
				<view
					v-for="group in filteredGroups"
					:key="group.letter"
					:id="`group-${group.letter}`"
					class="mention-group"
				>
					<text class="mention-group__title">{{ group.letter }}</text>

					<view
						v-for="friend in group.items"
						:key="friend.id"
						class="mention-item"
						@tap="handleFriendSelect(friend)"
					>
						<image class="mention-item__avatar" :src="friend.avatar" mode="aspectFill" />
						<view class="mention-item__body">
							<text class="mention-item__name line-1">{{ friend.name }}</text>
						</view>
					</view>
				</view>

				<view v-if="!filteredGroups.length" class="mention-page__empty">
					<text class="mention-page__empty-title">未找到匹配好友</text>
					<text class="mention-page__empty-text">换个关键词试试</text>
				</view>
			</scroll-view>

			<view class="mention-page__index">
				<view class="mention-page__index-search" @tap="focusFirstGroup">
					<u-icon name="search" size="26" color="#143080"></u-icon>
				</view>
				<text
					v-for="letter in letterIndex"
					:key="letter"
					:class="[
						'mention-page__index-letter',
						activeLetter === letter ? 'is-active' : ''
					]"
					@tap="scrollToLetter(letter)"
				>
					{{ letter }}
				</text>
			</view>
		</view>
	</view>
</template>

<script>
const LETTER_INDEX = [
	'A',
	'B',
	'C',
	'D',
	'E',
	'F',
	'G',
	'H',
	'I',
	'J',
	'K',
	'L',
	'M',
	'N',
	'O',
	'P',
	'Q',
	'R',
	'S',
	'T',
	'U',
	'V',
	'W',
	'X',
	'Y',
	'Z',
	'#'
]

const FRIEND_LIST = [
	{ id: 'friend-1', name: '伊美尔用户胡嘉言', letter: 'Y', avatar: '/static/linshi/01.png' },
	{ id: 'friend-2', name: '伊美尔用户张丽', letter: 'Y', avatar: '/static/linshi/02.png' },
	{ id: 'friend-3', name: '伊美尔用户顾清欢', letter: 'Y', avatar: '/static/linshi/01.png' },
	{ id: 'friend-4', name: '伊美尔用户张瑾瑜', letter: 'Y', avatar: '/static/linshi/02.png' },
	{ id: 'friend-5', name: '伊美尔用户张丽', letter: 'Y', avatar: '/static/linshi/03.png' },
	{ id: 'friend-6', name: '伊美尔用户高枕书', letter: 'Y', avatar: '/static/linshi/05.png' },
	{ id: 'friend-7', name: '伊美尔用户杨梦琪', letter: 'Y', avatar: '/static/linshi/01.png' },
	{ id: 'friend-8', name: '伊美尔用户徐亦然', letter: 'Y', avatar: '/static/linshi/02.png' },
	{ id: 'friend-9', name: '伊美尔用户郑辰逸', letter: 'Y', avatar: '/static/linshi/03.png' },
	{ id: 'friend-10', name: '伊美尔用户孙昭言', letter: 'Y', avatar: '/static/linshi/04.png' },
	{ id: 'friend-11', name: '伊美尔用户张恪然', letter: 'Y', avatar: '/static/linshi/05.png' },
	{ id: 'friend-12', name: 'Alice Chen', letter: 'A', avatar: '/static/linshi/04.png' },
	{ id: 'friend-13', name: 'Bella Gu', letter: 'B', avatar: '/static/linshi/03.png' },
	{ id: 'friend-14', name: 'Cindy Xu', letter: 'C', avatar: '/static/linshi/02.png' },
	{ id: 'friend-15', name: 'Luna Zhao', letter: 'L', avatar: '/static/linshi/01.png' },
	{ id: 'friend-16', name: 'Miya Wang', letter: 'M', avatar: '/static/linshi/04.png' },
	{ id: 'friend-17', name: 'Nora Lin', letter: 'N', avatar: '/static/linshi/05.png' },
	{ id: 'friend-18', name: 'Wendy He', letter: 'W', avatar: '/static/linshi/03.png' }
]

function getStatusBarHeight() {
	try {
		const { statusBarHeight = 20 } = uni.getSystemInfoSync()
		return statusBarHeight
	} catch (error) {
		return 20
	}
}

function groupFriends(list) {
	return LETTER_INDEX.map((letter) => ({
		letter,
		items: list.filter((item) => item.letter === letter)
	})).filter((group) => group.items.length)
}

export default {
	data() {
		return {
			statusBarHeight: getStatusBarHeight(),
			keyword: '',
			scrollIntoView: '',
			activeLetter: 'Y',
			letterIndex: LETTER_INDEX,
			friends: FRIEND_LIST
		}
	},
	computed: {
		filteredFriends() {
			const normalizedKeyword = this.keyword.trim().toLowerCase()
			if (!normalizedKeyword) {
				return this.friends
			}

			return this.friends.filter((friend) => friend.name.toLowerCase().includes(normalizedKeyword))
		},
		filteredGroups() {
			return groupFriends(this.filteredFriends)
		}
	},
	watch: {
		filteredGroups: {
			immediate: true,
			handler(groups) {
				this.activeLetter = groups.length ? groups[0].letter : ''
			}
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
		handleFriendSelect(friend) {
			const eventChannel =
				typeof this.getOpenerEventChannel === 'function' ? this.getOpenerEventChannel() : null

			if (eventChannel) {
				eventChannel.emit('friendSelected', {
					friend: {
						...friend,
						displayName: `@${friend.name}`
					}
				})
			}

			uni.navigateBack({
				delta: 1
			})
		},
		scrollToLetter(letter) {
			const targetGroup = this.filteredGroups.find((group) => group.letter === letter)
			if (!targetGroup) {
				return
			}

			this.activeLetter = letter
			this.scrollIntoView = ''
			this.$nextTick(() => {
				this.scrollIntoView = `group-${letter}`
			})
		},
		focusFirstGroup() {
			if (!this.filteredGroups.length) {
				return
			}

			this.scrollToLetter(this.filteredGroups[0].letter)
		}
	}
}
</script>

<style scoped lang="scss">
.mention-page {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background: #ffffff;
}

.mention-page__header {
	flex: none;
	background: #ffffff;
}

.mention-page__search-row {
	display: flex;
	align-items: center;
	height: 112rpx;
	padding-left: 28rpx;
	border-bottom: 2rpx solid #f1f1f1;
}

.mention-page__search {
	display: flex;
	align-items: center;
	flex: 1;
	min-width: 0;
	height: 72rpx;
}

.mention-page__prefix {
	flex: none;
	margin-right: 12rpx;
	font-size: 34rpx;
	font-weight: 500;
	line-height: 1;
	color: #111111;
}

.mention-page__input {
	flex: 1;
	min-width: 0;
	height: 72rpx;
	font-size: 34rpx;
	line-height: 72rpx;
	color: #111111;
}

.mention-page__input-placeholder {
	color: #d1d1d6;
}

.mention-page__cancel {
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

.mention-page__body {
	position: relative;
	flex: 1;
	min-height: 0;
	background: #ffffff;
}

.mention-page__list {
	height: 100%;
	padding: 0 72rpx calc(env(safe-area-inset-bottom) + 28rpx) 28rpx;
	box-sizing: border-box;
}

.mention-group__title {
	display: block;
	padding: 20rpx 0 12rpx;
	font-size: 24rpx;
	line-height: 1.2;
	color: #c8c9cf;
}

.mention-item {
	display: flex;
	align-items: center;
	min-height: 120rpx;
}

.mention-item__avatar {
	flex: none;
	width: 74rpx;
	height: 74rpx;
	border-radius: 50%;
	background: #f3f4f7;
}

.mention-item__body {
	flex: 1;
	min-width: 0;
	margin-left: 26rpx;
	padding: 34rpx 0;
	border-bottom: 2rpx solid #f5f5f5;
}

.mention-item__name {
	font-size: 32rpx;
	line-height: 1.35;
	color: #1d1e22;
}

.mention-page__index {
	position: absolute;
	top: 50%;
	right: 14rpx;
	transform: translateY(-50%);
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 10rpx 0;
}

.mention-page__index-search {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 34rpx;
	height: 34rpx;
	margin-bottom: 8rpx;
}

.mention-page__index-letter {
	min-width: 34rpx;
	font-size: 20rpx;
	line-height: 1.55;
	text-align: center;
	color: #143080;
}

.mention-page__index-letter.is-active {
	font-weight: 700;
}

.mention-page__empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 220rpx;
}

.mention-page__empty-title {
	font-size: 28rpx;
	line-height: 1.2;
	color: #909399;
}

.mention-page__empty-text {
	margin-top: 16rpx;
	font-size: 24rpx;
	line-height: 1.2;
	color: #c0c4cc;
}
</style>
