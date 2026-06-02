<template>
	<view class="moment-report-page">
		<view class="moment-report-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="page-shell moment-report-page__nav">
				<view class="moment-report-page__back" @tap="goBack">
					<u-icon name="arrow-left" size="46" color="#111111"></u-icon>
				</view>
			</view>
		</view>

		<view class="page-shell moment-report-page__body">
			<view class="moment-report-card">
				<text class="moment-report-card__title">{{ ui.descriptionTitle }}</text>
				<textarea
					v-model="form.description"
					class="moment-report-card__textarea"
					:placeholder="ui.descriptionPlaceholder"
					placeholder-class="moment-report-card__textarea-placeholder"
					maxlength="400"
					cursor-spacing="140"
				/>
				<text class="moment-report-card__counter">{{ descriptionCount }}/400</text>
			</view>

			<view class="moment-report-card moment-report-card--upload">
				<view class="moment-report-card__head">
					<text class="moment-report-card__title">{{ ui.uploadTitle }}</text>
					<text class="moment-report-card__tip">{{ ui.uploadTip }}</text>
				</view>

				<view class="moment-report-upload">
					<view
						v-for="(image, index) in form.images"
						:key="`${image}-${index}`"
						class="moment-report-upload__item"
					>
						<image
							class="moment-report-upload__preview"
							:src="image"
							mode="aspectFill"
							@tap="previewImage(index)"
						></image>
						<view class="moment-report-upload__remove" @tap.stop="removeImage(index)">
							<u-icon name="close" size="18" color="#ffffff"></u-icon>
						</view>
					</view>

					<view
						v-if="canAddMoreImages"
						class="moment-report-upload__item moment-report-upload__item--add"
						@tap="chooseImages"
					>
						<u-icon name="camera" size="62" color="#8f8f92"></u-icon>
					</view>
				</view>
			</view>
		</view>

		<view class="moment-report-page__footer">
			<view class="page-shell">
				<button class="moment-report-page__submit" type="primary" @tap="handleSubmit">
					{{ ui.submitLabel }}
				</button>
			</view>
		</view>

		<u-popup
			v-model="showConfirmDialog"
			mode="center"
			width="644"
			:zoom="false"
			:mask-close-able="false"
			:mask-custom-style="{ backgroundColor: 'rgba(0, 0, 0, 0.34)' }"
		>
			<view class="moment-report-dialog">
				<view class="moment-report-dialog__body">
					<text class="moment-report-dialog__title">{{ confirmDialog.title }}</text>
					<text class="moment-report-dialog__desc">{{ confirmDialog.description }}</text>
				</view>

				<view class="moment-report-dialog__actions">
					<view class="moment-report-dialog__action" @tap="closeConfirmDialog">
						{{ confirmDialog.cancelText }}
					</view>
					<view
						class="moment-report-dialog__action moment-report-dialog__action--confirm"
						@tap="confirmSubmit"
					>
						{{ confirmDialog.confirmText }}
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
const UI_TEXT = {
	descriptionTitle: '举报描述',
	descriptionPlaceholder: '请详细填写，以提高举报通过率',
	uploadTitle: '图片上传',
	uploadTip: '最多上传9张',
	submitLabel: '提交',
	emptyToast: '请填写举报描述或上传图片',
	submitToast: '举报已提交'
}

const CONFIRM_DIALOG_CONTENT = {
	title: '确认举报',
	description: '感谢您的反馈，我们将第一时间处理',
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

export default {
	data() {
		return {
			ui: UI_TEXT,
			statusBarHeight: getStatusBarHeight(),
			showConfirmDialog: false,
			confirmDialog: CONFIRM_DIALOG_CONTENT,
			form: {
				description: '',
				images: []
			}
		}
	},
	computed: {
		descriptionCount() {
			return this.form.description.length
		},
		canAddMoreImages() {
			return this.form.images.length < 9
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
		chooseImages() {
			const remainCount = 9 - this.form.images.length

			if (remainCount <= 0) {
				return
			}

			uni.chooseImage({
				count: remainCount,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: ({ tempFilePaths = [] }) => {
					this.form.images = [...this.form.images, ...tempFilePaths].slice(0, 9)
				}
			})
		},
		previewImage(index) {
			uni.previewImage({
				current: this.form.images[index],
				urls: this.form.images
			})
		},
		removeImage(index) {
			this.form.images.splice(index, 1)
		},
		handleSubmit() {
			const hasDescription = this.form.description.trim().length > 0
			const hasImages = this.form.images.length > 0

			if (!hasDescription && !hasImages) {
				uni.showToast({
					title: this.ui.emptyToast,
					icon: 'none'
				})
				return
			}

			this.showConfirmDialog = true
		},
		closeConfirmDialog() {
			this.showConfirmDialog = false
		},
		confirmSubmit() {
			this.showConfirmDialog = false

			uni.showToast({
				title: this.ui.submitToast,
				icon: 'none'
			})

			setTimeout(() => {
				this.goBack()
			}, 600)
		}
	}
}
</script>

<style scoped lang="scss">
.moment-report-page {
	min-height: 100vh;
	background: #f5f5f7;
}

.moment-report-page__header {
	background: #f5f5f7;
}

.moment-report-page__nav {
	display: flex;
	align-items: center;
	height: 96rpx;
}

.moment-report-page__back {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 84rpx;
	height: 72rpx;
	margin-left: -8rpx;
}

.moment-report-page__body {
	padding-top: 28rpx;
	padding-bottom: calc(env(safe-area-inset-bottom) + 220rpx);
}

.moment-report-card {
	position: relative;
	padding: 34rpx 32rpx 30rpx;
	border-radius: 24rpx;
	background: #ffffff;
}

.moment-report-card + .moment-report-card {
	margin-top: 28rpx;
}

.moment-report-card--upload {
	min-height: 316rpx;
}

.moment-report-card__head {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.moment-report-card__title {
	font-size: 32rpx;
	font-weight: 600;
	line-height: 1.2;
	color: #202127;
}

.moment-report-card__tip {
	font-size: 24rpx;
	line-height: 1.2;
	color: #c9cbd3;
}

.moment-report-card__textarea {
	width: 100%;
	min-height: 308rpx;
	margin-top: 38rpx;
	font-size: 30rpx;
	line-height: 1.7;
	color: #1d2129;
}

.moment-report-card__textarea-placeholder {
	color: #d6d8dd;
}

.moment-report-card__counter {
	position: absolute;
	right: 32rpx;
	bottom: 30rpx;
	font-size: 24rpx;
	line-height: 1;
	color: #c9cbd3;
}

.moment-report-upload {
	display: flex;
	flex-wrap: wrap;
	margin-top: 34rpx;
	margin-right: -18rpx;
	margin-bottom: -18rpx;
}

.moment-report-upload__item {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 164rpx;
	height: 164rpx;
	margin-right: 18rpx;
	margin-bottom: 18rpx;
	border-radius: 18rpx;
	overflow: hidden;
	background: #f5f5f7;
}

.moment-report-upload__item--add {
	border: 2rpx solid #f0f1f4;
	box-sizing: border-box;
}

.moment-report-upload__preview {
	width: 100%;
	height: 100%;
}

.moment-report-upload__remove {
	position: absolute;
	top: 10rpx;
	right: 10rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 36rpx;
	height: 36rpx;
	border-radius: 50%;
	background: rgba(17, 17, 17, 0.52);
}

.moment-report-page__footer {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 20;
	padding: 18rpx 0 calc(env(safe-area-inset-bottom) + 34rpx);
	background: #ffffff;
	box-shadow: 0 -12rpx 30rpx rgba(19, 24, 34, 0.04);
}

.moment-report-page__submit {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 92rpx;
	border-radius: 999rpx;
	background: #143080;
	font-size: 34rpx;
	font-weight: 600;
	color: #ffffff;
}

.moment-report-dialog {
	overflow: hidden;
	border-radius: 24rpx;
	background: #ffffff;
}

.moment-report-dialog__body {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 52rpx 40rpx 54rpx;
	text-align: center;
}

.moment-report-dialog__title {
	font-size: 32rpx;
	font-weight: 700;
	line-height: 1.25;
	color: #202127;
}

.moment-report-dialog__desc {
	margin-top: 72rpx;
	font-size: 26rpx;
	line-height: 1.5;
	color: #7c8088;
}

.moment-report-dialog__actions {
	display: flex;
	align-items: stretch;
	border-top: 1px solid #eceef2;
}

.moment-report-dialog__action {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 110rpx;
	font-size: 30rpx;
	font-weight: 700;
	line-height: 1;
	color: #202127;
}

.moment-report-dialog__action--confirm {
	color: #143080;
	border-left: 1px solid #eceef2;
}
</style>
