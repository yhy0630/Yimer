<template>
	<view class="sign-signature-page">
		<view class="sign-signature-page__glow sign-signature-page__glow--left"></view>
		<view class="sign-signature-page__glow sign-signature-page__glow--right"></view>

		<view class="sign-signature-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="page-shell sign-signature-page__nav">
				<view class="sign-signature-page__back" @tap="goBack">
					<u-icon name="arrow-left" size="46" color="#20232b"></u-icon>
				</view>
			</view>
		</view>

		<view class="page-shell sign-signature-page__body">
			<view class="sign-signature-page__intro">
				<text class="sign-signature-page__title">{{ copywriting.title }}</text>
				<text class="sign-signature-page__desc">{{ copywriting.desc }}</text>
			</view>

			<view class="signature-panel">
				<view class="signature-panel__inner" @tap="activateManualSignature">
					<template v-if="activeSignatureType">
						<view class="signature-preview signature-preview--board">
							<view class="signature-preview__strokes">
								<view class="signature-preview__stroke signature-preview__stroke--short"></view>
								<view class="signature-preview__stroke signature-preview__stroke--long"></view>
								<view class="signature-preview__stroke signature-preview__stroke--tail"></view>
							</view>
							<text class="signature-preview__label">{{ activeSignatureLabel }}</text>
						</view>
					</template>
					<template v-else>
						<view class="signature-placeholder">
							<view class="signature-placeholder__icon">
								<view class="signature-placeholder__pen"></view>
								<view class="signature-placeholder__line"></view>
							</view>
							<text class="signature-placeholder__text">{{ copywriting.placeholder }}</text>
						</view>
					</template>
				</view>
			</view>

			<view class="history-card" @tap="useHistorySignature">
				<text class="history-card__title">{{ copywriting.historyTitle }}</text>
				<view class="history-card__preview" :class="{ 'is-active': activeSignatureType === 'history' }">
					<view class="signature-preview signature-preview--history">
						<view class="signature-preview__strokes signature-preview__strokes--history">
							<view class="signature-preview__stroke signature-preview__stroke--history-short"></view>
							<view class="signature-preview__stroke signature-preview__stroke--history-long"></view>
							<view class="signature-preview__stroke signature-preview__stroke--history-tail"></view>
						</view>
						<text class="signature-preview__label signature-preview__label--history">
							{{ copywriting.historyPreview }}
						</text>
					</view>
				</view>
			</view>
		</view>

		<view class="sign-signature-page__footer">
			<view class="page-shell">
				<view class="agreement-row" @tap="toggleAgreement">
					<view :class="['agreement-row__checkbox', agreementChecked ? 'is-checked' : '']">
						<u-icon v-if="agreementChecked" name="checkmark" size="22" color="#ffffff"></u-icon>
					</view>
					<text class="agreement-row__text">{{ copywriting.agreementPrefix }}</text>
					<text class="agreement-row__link" @tap.stop="openAgreement">{{ copywriting.agreementLabel }}</text>
				</view>

				<button
					class="sign-signature-page__cta"
					:class="{ 'is-disabled': !canSubmit }"
					:disabled="!canSubmit"
					@tap="submitSignature"
				>
					{{ copywriting.submit }}
				</button>
			</view>
		</view>
	</view>
</template>

<script>
const COPYWRITING = Object.freeze({
	title: '手写签名',
	desc: '请在下方签名区域手写签名',
	placeholder: '请在此处手写签名',
	historyTitle: '点击使用历史签名',
	historyPreview: '历史签名预览',
	manualSigned: '当前签名已生成',
	historySigned: '已使用历史签名',
	agreementPrefix: '我已阅读并同意',
	agreementLabel: '《签字授权协议》',
	submit: '提交签署'
})

const AGREEMENT_URL = '/bundle/pages/server_explan/server_explan?type=0'
const RESULT_PAGE_URL = '/bundle/pages/sign_result/sign_result'
const DEFAULT_SUCCESS_URL = '/bundle/pages/intelligent_guide/intelligent_guide'
const DEFAULT_BACK_URL = '/bundle/pages/sign_center/sign_center'

function getStatusBarHeight() {
	try {
		const { statusBarHeight = 20 } = uni.getSystemInfoSync()
		return statusBarHeight
	} catch (error) {
		return 20
	}
}

function normalizeResultStatus(status) {
	return ['fail', 'failure', 'error', '0'].includes(String(status || '').toLowerCase())
		? 'fail'
		: 'success'
}

function decodeTitle(value) {
	if (!value) {
		return ''
	}

	try {
		return decodeURIComponent(value)
	} catch (error) {
		return value
	}
}

function buildRetryUrl({ documentKey, documentTitle, resultStatus }) {
	const query = [
		documentKey ? `documentKey=${encodeURIComponent(documentKey)}` : '',
		documentTitle ? `documentTitle=${encodeURIComponent(documentTitle)}` : '',
		resultStatus ? `resultStatus=${encodeURIComponent(resultStatus)}` : ''
	].filter(Boolean).join('&')

	return `/bundle/pages/sign_signature/sign_signature${query ? `?${query}` : ''}`
}

export default {
	data() {
		return {
			statusBarHeight: getStatusBarHeight(),
			copywriting: COPYWRITING,
			documentKey: '',
			documentTitle: '',
			agreementChecked: true,
			activeSignatureType: '',
			openerEventChannel: null,
			resultStatus: 'success'
		}
	},
	computed: {
		canSubmit() {
			return this.agreementChecked && Boolean(this.activeSignatureType)
		},
		activeSignatureLabel() {
			return this.activeSignatureType === 'history'
				? this.copywriting.historySigned
				: this.copywriting.manualSigned
		}
	},
	onLoad(options = {}) {
		this.documentKey = options.documentKey || ''
		this.documentTitle = decodeTitle(options.documentTitle)
		this.resultStatus = normalizeResultStatus(options.resultStatus || options.submitResult)
		if (typeof this.getOpenerEventChannel === 'function') {
			this.openerEventChannel = this.getOpenerEventChannel()
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

			uni.redirectTo({
				url: DEFAULT_BACK_URL
			})
		},
		activateManualSignature() {
			this.activeSignatureType = 'manual'
		},
		useHistorySignature() {
			this.activeSignatureType = 'history'
		},
		toggleAgreement() {
			this.agreementChecked = !this.agreementChecked
		},
		openAgreement() {
			uni.navigateTo({
				url: AGREEMENT_URL
			})
		},
		submitSignature() {
			if (!this.canSubmit) {
				return
			}

			if (this.resultStatus === 'success' && this.openerEventChannel) {
				this.openerEventChannel.emit('signed', {
					documentKey: this.documentKey,
					documentTitle: this.documentTitle,
					signatureType: this.activeSignatureType
				})
			}

			const retryUrl = buildRetryUrl({
				documentKey: this.documentKey,
				documentTitle: this.documentTitle,
				resultStatus: this.resultStatus
			})
			const resultUrl =
				`${RESULT_PAGE_URL}?status=${this.resultStatus}` +
				`&successUrl=${encodeURIComponent(DEFAULT_SUCCESS_URL)}` +
				`&retryUrl=${encodeURIComponent(retryUrl)}`

			setTimeout(() => {
				uni.navigateTo({
					url: resultUrl
				})
			}, 120)
		}
	}
}
</script>

<style scoped lang="scss">
.sign-signature-page {
	position: relative;
	min-height: 100vh;
	background:
		radial-gradient(circle at 50% -6%, rgba(221, 227, 244, 0.92) 0, rgba(221, 227, 244, 0.26) 300rpx, rgba(255, 255, 255, 0) 720rpx),
		linear-gradient(180deg, #f8f9fd 0%, #ffffff 360rpx, #ffffff 100%);
}

.sign-signature-page__glow {
	position: absolute;
	pointer-events: none;
	border-radius: 50%;
	filter: blur(18rpx);
}

.sign-signature-page__glow--left {
	top: -120rpx;
	left: -110rpx;
	width: 360rpx;
	height: 360rpx;
	background: rgba(255, 255, 255, 0.9);
}

.sign-signature-page__glow--right {
	top: 180rpx;
	right: -96rpx;
	width: 320rpx;
	height: 240rpx;
	background: rgba(214, 223, 246, 0.42);
}

.sign-signature-page__header {
	position: sticky;
	top: 0;
	z-index: 10;
	background: linear-gradient(180deg, rgba(248, 249, 253, 0.98) 0%, rgba(248, 249, 253, 0.92) 100%);
	backdrop-filter: blur(12rpx);
}

.sign-signature-page__nav {
	display: flex;
	align-items: center;
	height: 90rpx;
}

.sign-signature-page__back {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 80rpx;
	height: 72rpx;
	margin-left: -8rpx;
}

.sign-signature-page__body {
	position: relative;
	z-index: 1;
	padding-top: 26rpx;
	padding-bottom: calc(env(safe-area-inset-bottom) + 260rpx);
}

.sign-signature-page__intro {
	display: flex;
	flex-direction: column;
}

.sign-signature-page__title {
	font-size: 60rpx;
	font-weight: 700;
	line-height: 1.16;
	color: #20232b;
}

.sign-signature-page__desc {
	margin-top: 20rpx;
	font-size: 26rpx;
	line-height: 1.45;
	color: #9aa0ad;
}

.signature-panel {
	margin-top: 42rpx;
	padding: 30rpx;
	border-radius: 28rpx;
	background: rgba(255, 255, 255, 0.98);
	box-shadow: 0 18rpx 44rpx rgba(32, 41, 72, 0.08);
}

.signature-panel__inner {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 610rpx;
	border: 2rpx dashed #e1e5ee;
	border-radius: 22rpx;
	background: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, #ffffff 100%);
}

.signature-placeholder {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.signature-placeholder__icon {
	position: relative;
	width: 160rpx;
	height: 120rpx;
	filter: drop-shadow(0 18rpx 28rpx rgba(255, 243, 223, 0.9));
}

.signature-placeholder__pen {
	position: absolute;
	top: 4rpx;
	right: 26rpx;
	width: 24rpx;
	height: 98rpx;
	border: 6rpx solid #d0d4dd;
	border-radius: 18rpx 18rpx 12rpx 12rpx;
	transform: rotate(40deg);
	box-sizing: border-box;
}

.signature-placeholder__pen::before {
	content: '';
	position: absolute;
	left: 50%;
	bottom: -18rpx;
	width: 0;
	height: 0;
	border-left: 10rpx solid transparent;
	border-right: 10rpx solid transparent;
	border-top: 18rpx solid #d0d4dd;
	transform: translateX(-50%);
}

.signature-placeholder__line {
	position: absolute;
	left: 14rpx;
	bottom: 18rpx;
	width: 86rpx;
	height: 32rpx;
	border-bottom: 6rpx solid #d0d4dd;
	border-radius: 0 0 40rpx 40rpx;
	transform: skewX(-18deg);
}

.signature-placeholder__line::before {
	content: '';
	position: absolute;
	left: 6rpx;
	bottom: -6rpx;
	width: 28rpx;
	height: 20rpx;
	border-bottom: 6rpx solid #d0d4dd;
	border-radius: 0 0 20rpx 20rpx;
	transform: translateX(-12rpx) translateY(-8rpx) rotate(-22deg);
}

.signature-placeholder__text {
	margin-top: 32rpx;
	font-size: 28rpx;
	line-height: 1.2;
	color: #8e949f;
}

.history-card {
	margin-top: 44rpx;
	padding: 34rpx 30rpx 30rpx;
	border-radius: 28rpx;
	background: rgba(255, 255, 255, 0.98);
	box-shadow: 0 18rpx 44rpx rgba(32, 41, 72, 0.08);
}

.history-card__title {
	font-size: 28rpx;
	font-weight: 600;
	line-height: 1.2;
	color: #20232b;
}

.history-card__preview {
	margin-top: 28rpx;
	padding: 26rpx;
	border-radius: 22rpx;
	background: #f7f8fb;
	border: 2rpx solid transparent;
	transition: border-color 0.2s ease;
}

.history-card__preview.is-active {
	border-color: #143080;
}

.signature-preview {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.signature-preview--board {
	min-height: 610rpx;
}

.signature-preview--history {
	min-height: 184rpx;
}

.signature-preview__strokes {
	position: relative;
	width: 250rpx;
	height: 120rpx;
}

.signature-preview__strokes--history {
	width: 280rpx;
	height: 92rpx;
	opacity: 0.82;
}

.signature-preview__stroke {
	position: absolute;
	border-bottom: 6rpx solid #c9ceda;
	border-radius: 999rpx;
	transform-origin: left center;
}

.signature-preview__stroke--short {
	left: 10rpx;
	top: 42rpx;
	width: 88rpx;
	transform: rotate(-10deg);
}

.signature-preview__stroke--long {
	left: 68rpx;
	top: 18rpx;
	width: 138rpx;
	transform: rotate(14deg);
}

.signature-preview__stroke--tail {
	right: 4rpx;
	top: 58rpx;
	width: 96rpx;
	transform: rotate(1deg);
}

.signature-preview__stroke--history-short {
	left: 0;
	top: 48rpx;
	width: 116rpx;
	transform: rotate(-6deg);
}

.signature-preview__stroke--history-long {
	left: 66rpx;
	top: 12rpx;
	width: 166rpx;
	transform: rotate(11deg);
}

.signature-preview__stroke--history-tail {
	right: 0;
	top: 50rpx;
	width: 112rpx;
	transform: rotate(3deg);
}

.signature-preview__label {
	margin-top: 26rpx;
	font-size: 28rpx;
	line-height: 1.2;
	color: #8e949f;
}

.signature-preview__label--history {
	font-size: 30rpx;
}

.sign-signature-page__footer {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 12;
	padding-top: 18rpx;
	padding-bottom: calc(env(safe-area-inset-bottom) + 24rpx);
	background: rgba(255, 255, 255, 0.98);
	box-shadow: 0 -10rpx 30rpx rgba(32, 41, 72, 0.06);
}

.agreement-row {
	display: flex;
	align-items: center;
	min-height: 48rpx;
}

.agreement-row__checkbox {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 34rpx;
	height: 34rpx;
	border-radius: 8rpx;
	border: 2rpx solid #143080;
	background: #ffffff;
	box-sizing: border-box;
	flex: none;
}

.agreement-row__checkbox.is-checked {
	background: #143080;
}

.agreement-row__text {
	margin-left: 18rpx;
	font-size: 24rpx;
	line-height: 1.3;
	color: #7d818d;
}

.agreement-row__link {
	font-size: 24rpx;
	line-height: 1.3;
	color: #143080;
}

.sign-signature-page__cta {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 104rpx;
	margin-top: 34rpx;
	border-radius: 999rpx;
	background: #143080;
	font-size: 34rpx;
	font-weight: 600;
	line-height: 1;
	color: #ffffff;
	box-shadow: 0 16rpx 28rpx rgba(20, 48, 128, 0.18);
}

.sign-signature-page__cta.is-disabled {
	background: #9ba9cf;
	box-shadow: none;
}
</style>
