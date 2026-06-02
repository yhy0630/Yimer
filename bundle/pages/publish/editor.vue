<template>
	<view class="publish-page">
		<view class="publish-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="page-shell publish-page__nav">
				<view class="publish-page__back" @tap="goBack">
					<u-icon name="arrow-left" size="48" color="#121316"></u-icon>
				</view>
				<text
					:class="['publish-page__submit', canSubmit ? 'is-active' : '']"
					@tap="handleSubmit"
				>
					发布
				</text>
			</view>
		</view>

		<view class="page-shell publish-page__editor">
			<view class="publish-page__cover" @tap="handlePhotoTap">
				<u-icon name="camera" size="72" color="#8d929b"></u-icon>
			</view>

			<view class="publish-page__title-row">
				<text class="publish-page__title-label">标题：</text>
				<input
					v-model.trim="form.title"
					class="publish-page__title-input"
					maxlength="20"
					placeholder=""
				/>
			</view>

			<view class="publish-page__divider"></view>

			<textarea
				v-model="form.content"
				class="publish-page__textarea"
				:placeholder="pageContent.contentPlaceholder"
				placeholder-class="publish-page__textarea-placeholder"
				maxlength="500"
				auto-height
				cursor-spacing="120"
			/>

			<view class="publish-page__spacer"></view>

			<view class="publish-page__chips">
				<view
					v-for="chip in renderedChips"
					:key="`${scene}-${chip.prefix}-${chip.value}`"
					class="publish-chip"
					@tap="handleChipTap(chip)"
				>
					<text class="publish-chip__prefix">{{ chip.prefix }}</text>
					<text class="publish-chip__label">{{ chip.value }}</text>
				</view>
			</view>
		</view>

		<view class="page-shell publish-page__footer">
			<view class="publish-action" @tap="handlePrimaryAction">
				<view class="publish-action__main">
					<u-icon :name="pageContent.primaryAction.icon" size="34" color="#858b95"></u-icon>
					<text class="publish-action__label">{{ primaryActionLabel }}</text>
				</view>
				<u-icon name="arrow-right" size="28" color="#a2a7b0"></u-icon>
			</view>

			<view v-if="pageContent.secondaryAction" class="publish-action publish-action--plain">
				<view class="publish-action__main">
					<u-icon :name="pageContent.secondaryAction.icon" size="34" color="#858b95"></u-icon>
					<text class="publish-action__label">{{ pageContent.secondaryAction.label }}</text>
				</view>
				<view :class="['publish-switch', isGlobalPublish ? 'is-on' : '']" @tap.stop="toggleGlobalPublish">
					<view class="publish-switch__thumb"></view>
				</view>
			</view>
		</view>

		<u-popup
			v-model="showPublishSuccessDialog"
			mode="center"
			width="646"
			:zoom="false"
			:mask-close-able="false"
			:mask-custom-style="{ backgroundColor: 'rgba(0, 0, 0, 0.26)' }"
		>
			<view class="publish-success-dialog">
				<view class="publish-success-dialog__body">
					<text class="publish-success-dialog__title">{{ publishSuccessDialog.title }}</text>
					<text class="publish-success-dialog__message">{{ publishSuccessDialog.message }}</text>
				</view>

				<view class="publish-success-dialog__actions">
					<view class="publish-success-dialog__action" @tap="closePublishSuccessDialog">
						{{ publishSuccessDialog.cancelText }}
					</view>
					<view
						class="publish-success-dialog__action publish-success-dialog__action--confirm"
						@tap="confirmPublishSuccessDialog"
					>
						{{ publishSuccessDialog.confirmText }}
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
const PUBLISH_SCENE_MAP = {
	moment: {
		contentPlaceholder: '分享美好瞬间...',
		chips: [
			{ prefix: '#', label: '话题' },
			{ prefix: '@', label: '朋友' }
		],
		primaryAction: {
			icon: 'list-dot',
			label: '添加同步的社群'
		},
		secondaryAction: {
			icon: 'mic',
			label: '全网发布'
		}
	},
	place: {
		contentPlaceholder: '分享此刻瞬间...',
		chips: [
			{ prefix: '@', label: '朋友' }
		],
		primaryAction: {
			icon: 'list-dot',
			label: '添加宝藏小店'
		}
	}
}

const PUBLISH_SUCCESS_DIALOG_CONTENT = {
	title: '发布成功',
	message: '发布成功，审核成功后可展示',
	cancelText: '取消',
	confirmText: '确认'
}

function getStatusBarHeight() {
	try {
		const { statusBarHeight = 20 } = uni.getSystemInfoSync()
		return statusBarHeight
	} catch (error) {
		return 20
	}
}

function normalizeScene(scene) {
	if (scene === 'place' || scene === 'location') {
		return 'place'
	}

	return 'moment'
}

export default {
	data() {
		return {
			statusBarHeight: getStatusBarHeight(),
			scene: 'moment',
			selectedTopic: '',
			selectedFriend: '',
			selectedCommunity: null,
			selectedTreasureShop: null,
			form: {
				title: '',
				content: ''
			},
			isGlobalPublish: false,
			showPublishSuccessDialog: false,
			publishSuccessDialog: PUBLISH_SUCCESS_DIALOG_CONTENT
		}
	},
	computed: {
		pageContent() {
			return PUBLISH_SCENE_MAP[this.scene] || PUBLISH_SCENE_MAP.moment
		},
		renderedChips() {
			return this.pageContent.chips.map((chip) => ({
				...chip,
				value: this.getChipValue(chip)
			}))
		},
		primaryActionLabel() {
			if (this.scene === 'moment' && this.selectedCommunity && this.selectedCommunity.name) {
				return `已同步到 ${this.selectedCommunity.name}`
			}

			if (this.scene === 'place' && this.selectedTreasureShop && this.selectedTreasureShop.name) {
				return `\u5df2\u6dfb\u52a0 ${this.selectedTreasureShop.name}`
			}

			return this.pageContent.primaryAction.label
		},
		canSubmit() {
			return Boolean(this.form.title || this.form.content)
		}
	},
	onLoad(options = {}) {
		this.scene = normalizeScene(options.scene || options.type)
		this.selectedTopic = options.topic ? decodeURIComponent(options.topic) : ''
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
		handleSubmit() {
			if (!this.canSubmit) {
				uni.showToast({
					title: '请先填写内容',
					icon: 'none'
				})
				return
			}

			this.showPublishSuccessDialog = true
		},
		handlePhotoTap() {
			uni.showToast({
				title: '上传图片功能开发中',
				icon: 'none'
			})
		},
		handleChipTap(chip) {
			if (chip.prefix === '#') {
				uni.navigateTo({
					url: '/bundle/pages/publish/topic?mode=select',
					success: (res) => {
						res.eventChannel.on('topicSelected', ({ topic } = {}) => {
							if (!topic || !topic.title) {
								return
							}

							this.selectedTopic = topic.title
						})
					}
				})
				return
			}

			if (chip.prefix === '@') {
				uni.navigateTo({
					url: '/bundle/pages/publish/friend',
					success: (res) => {
						res.eventChannel.on('friendSelected', ({ friend } = {}) => {
							if (!friend || !friend.name) {
								return
							}

							this.selectedFriend = friend.name
							this.insertMention(friend.displayName || `@${friend.name}`)
						})
					}
				})
			}
		},
		getChipValue(chip) {
			if (chip.prefix === '#' && this.selectedTopic) {
				return this.selectedTopic
			}

			if (chip.prefix === '@' && this.selectedFriend) {
				return this.selectedFriend
			}

			return chip.label
		},
		insertMention(mentionText) {
			if (!mentionText) {
				return
			}

			const content = this.form.content.trim()
			const mentionWithSpace = `${mentionText} `

			if (content.includes(mentionText)) {
				return
			}

			this.form.content = content ? `${content} ${mentionWithSpace}` : mentionWithSpace
		},
		handlePrimaryAction() {
			if (this.scene === 'moment') {
				const selectedId = this.selectedCommunity ? this.selectedCommunity.id : ''
				const url = selectedId
					? `/bundle/pages/publish/community?selectedId=${selectedId}`
					: '/bundle/pages/publish/community'

				uni.navigateTo({
					url,
					success: (res) => {
						res.eventChannel.on('communitySelected', ({ community } = {}) => {
							if (!community || !community.id) {
								return
							}

							this.selectedCommunity = community
						})
					}
				})
				return
			}

			const selectedId = this.selectedTreasureShop ? this.selectedTreasureShop.id : ''
			const url = selectedId
				? `/bundle/pages/publish/treasure_shop?selectedId=${selectedId}`
				: '/bundle/pages/publish/treasure_shop'

			uni.navigateTo({
				url,
				success: (res) => {
					res.eventChannel.on('treasureShopSelected', ({ shop } = {}) => {
						if (!shop || !shop.id) {
							return
						}

						this.selectedTreasureShop = shop
					})
				}
			})
		},
		toggleGlobalPublish() {
			this.isGlobalPublish = !this.isGlobalPublish
		},
		closePublishSuccessDialog() {
			this.showPublishSuccessDialog = false
		},
		confirmPublishSuccessDialog() {
			this.showPublishSuccessDialog = false
			this.goBack()
		}
	}
}
</script>

<style scoped lang="scss">
.publish-page {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	background: #ffffff;
}

.publish-page__header {
	background: #ffffff;
}

.publish-page__nav {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 100rpx;
}

.publish-page__back {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 84rpx;
	height: 72rpx;
	margin-left: -8rpx;
}

.publish-page__submit {
	font-size: 26rpx;
	line-height: 1;
	color: #d5d8de;
}

.publish-page__submit.is-active {
	color: #143080;
}

.publish-page__editor {
	display: flex;
	flex: 1;
	flex-direction: column;
	padding-top: 32rpx;
	padding-bottom: 36rpx;
}

.publish-page__cover {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 168rpx;
	height: 168rpx;
	border-radius: 20rpx;
	background: linear-gradient(180deg, #f7f7f8 0%, #f4f4f5 100%);
}

.publish-page__title-row {
	display: flex;
	align-items: center;
	margin-top: 52rpx;
}

.publish-page__title-label {
	flex: none;
	font-size: 28rpx;
	font-weight: 600;
	line-height: 1.2;
	color: #7f848c;
}

.publish-page__title-input {
	flex: 1;
	min-width: 0;
	height: 44rpx;
	margin-left: 8rpx;
	font-size: 30rpx;
	color: #1d2128;
}

.publish-page__divider {
	height: 2rpx;
	margin-top: 46rpx;
	background: #eff0f2;
}

.publish-page__textarea {
	width: 100%;
	min-height: 260rpx;
	margin-top: 34rpx;
	font-size: 28rpx;
	line-height: 1.7;
	color: #1f2329;
}

.publish-page__textarea-placeholder {
	color: #d3d7dd;
}

.publish-page__spacer {
	flex: 1;
	min-height: 280rpx;
}

.publish-page__chips {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
}

.publish-chip {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	height: 58rpx;
	padding: 0 24rpx;
	margin-right: 20rpx;
	margin-bottom: 12rpx;
	border: 2rpx solid #ececef;
	border-radius: 999rpx;
	background: #ffffff;
	box-sizing: border-box;
}

.publish-chip__prefix,
.publish-chip__label {
	font-size: 26rpx;
	font-weight: 600;
	line-height: 1;
	color: #2d3036;
}

.publish-chip__label {
	margin-left: 8rpx;
}

.publish-page__footer {
	padding-top: 8rpx;
	padding-bottom: calc(env(safe-area-inset-bottom) + 28rpx);
	border-top: 2rpx solid #f1f2f4;
}

.publish-action {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 92rpx;
}

.publish-action--plain {
	margin-top: 6rpx;
}

.publish-action__main {
	display: flex;
	align-items: center;
	min-width: 0;
}

.publish-action__label {
	margin-left: 16rpx;
	font-size: 26rpx;
	line-height: 1.2;
	color: #7f848c;
}

.publish-switch {
	position: relative;
	width: 74rpx;
	height: 40rpx;
	border-radius: 999rpx;
	background: #d8dade;
	transition: background-color 0.2s ease;
}

.publish-switch.is-on {
	background: #143080;
}

.publish-switch__thumb {
	position: absolute;
	left: 4rpx;
	top: 4rpx;
	width: 32rpx;
	height: 32rpx;
	border-radius: 50%;
	background: #ffffff;
	box-shadow: 0 4rpx 10rpx rgba(17, 24, 39, 0.12);
	transition: transform 0.2s ease;
}

.publish-switch.is-on .publish-switch__thumb {
	transform: translateX(34rpx);
}

.publish-success-dialog {
	overflow: hidden;
	border-radius: 24rpx;
	background: #ffffff;
}

.publish-success-dialog__body {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 54rpx 48rpx 52rpx;
	text-align: center;
}

.publish-success-dialog__title {
	font-size: 54rpx;
	font-weight: 700;
	line-height: 1.18;
	color: #1b1d21;
}

.publish-success-dialog__message {
	margin-top: 68rpx;
	font-size: 30rpx;
	line-height: 1.5;
	color: #7f848d;
}

.publish-success-dialog__actions {
	display: flex;
	align-items: stretch;
	border-top: 2rpx solid #eceef2;
}

.publish-success-dialog__action {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 112rpx;
	font-size: 32rpx;
	font-weight: 700;
	line-height: 1;
	color: #1b1d21;
}

.publish-success-dialog__action--confirm {
	color: #244392;
	border-left: 2rpx solid #eceef2;
}
</style>
