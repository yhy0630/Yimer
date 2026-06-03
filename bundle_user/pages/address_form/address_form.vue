<template>
	<view class="address-form-page">
		<view class="address-form-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="page-shell address-form-page__nav">
				<view class="address-form-page__back" @tap="goBack">
					<u-icon name="arrow-left" size="48" color="#161616"></u-icon>
				</view>
				<text class="address-form-page__title">收货地址</text>
				<view class="address-form-page__nav-space"></view>
			</view>
		</view>

		<view class="page-shell address-form-page__body">
			<view class="address-form-page__card">
				<view class="address-form-page__row">
					<text class="address-form-page__label">收货人</text>
					<input
						v-model="form.name"
						class="address-form-page__input"
						type="text"
						placeholder="请填写收货人姓名"
						placeholder-class="address-form-page__input-placeholder"
					/>
				</view>

				<view class="address-form-page__row">
					<text class="address-form-page__label">联系方式</text>
					<input
						v-model="form.phone"
						class="address-form-page__input"
						type="number"
						maxlength="11"
						placeholder="请填写手机号"
						placeholder-class="address-form-page__input-placeholder"
					/>
				</view>

				<pick-regions :default-region="regionNames" @getRegion="handleRegionChange">
					<view class="address-form-page__row address-form-page__row--picker">
						<text class="address-form-page__label">所在地区</text>
						<view class="address-form-page__input address-form-page__input--picker">
							<text :class="regionText ? 'address-form-page__input-value' : 'address-form-page__input-placeholder'">
								{{ regionText || '请选择省、市、区' }}
							</text>
						</view>
					</view>
				</pick-regions>

				<view class="address-form-page__row address-form-page__row--detail">
					<text class="address-form-page__label">详细地址</text>
					<input
						v-model="form.detail"
						class="address-form-page__input"
						type="text"
						placeholder="请填写小区、街道、门牌号等"
						placeholder-class="address-form-page__input-placeholder"
					/>
				</view>

				<view class="address-form-page__row address-form-page__row--switch">
					<text class="address-form-page__switch-label">设置为默认地址</text>
					<u-switch
						v-model="form.isDefault"
						:size="58"
						active-color="#243f95"
						inactive-color="#e7e7ea"
					></u-switch>
				</view>
			</view>
		</view>

		<view class="address-form-page__footer">
			<view class="page-shell">
				<button class="address-form-page__button" hover-class="none" @tap="handleSubmit">
					保存地址
				</button>
			</view>
		</view>
	</view>
</template>

<script>
import PickRegions from '@/components/pick-regions/pick-regions.vue'

function getStatusBarHeight() {
	try {
		const { statusBarHeight = 20 } = uni.getSystemInfoSync()
		return statusBarHeight
	} catch (error) {
		return 20
	}
}

function decodeQueryText(value) {
	const text = String(value || '').trim()

	if (!text) {
		return ''
	}

	try {
		return decodeURIComponent(text)
	} catch (error) {
		return text
	}
}

function parseRegionText(value) {
	const text = decodeQueryText(value)

	if (!text) {
		return []
	}

	return text
		.split(/[\s,，/]+/)
		.map((item) => item.trim())
		.filter(Boolean)
		.slice(0, 3)
}

function createForm() {
	return {
		name: '',
		phone: '',
		detail: '',
		regionCode: '',
		isDefault: false
	}
}

export default {
	components: {
		PickRegions
	},
	data() {
		return {
			statusBarHeight: getStatusBarHeight(),
			form: createForm(),
			regionNames: []
		}
	},
	computed: {
		regionText() {
			return this.regionNames.join(' ')
		}
	},
	onLoad(options = {}) {
		this.form = {
			...createForm(),
			name: decodeQueryText(options.name),
			phone: decodeQueryText(options.phone),
			detail: decodeQueryText(options.detail),
			isDefault: options.isDefault === '1'
		}
		this.regionNames = parseRegionText(options.region)
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
				url: '/pages/user/user'
			})
		},
		handleRegionChange(address = []) {
			this.regionNames = address.map((item) => item.name).filter(Boolean)
			this.form.regionCode = address[2] ? address[2].value : ''
		},
		handleSubmit() {
			uni.showToast({
				title: '保存地址待接入',
				icon: 'none'
			})
		}
	}
}
</script>

<style scoped lang="scss">
.address-form-page {
	min-height: 100vh;
	padding-bottom: calc(212rpx + env(safe-area-inset-bottom));
	background: #f7f7f8;
}

.address-form-page__header {
	position: sticky;
	top: 0;
	z-index: 10;
	background: rgba(247, 247, 248, 0.98);
}

.address-form-page__nav {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 96rpx;
}

.address-form-page__back,
.address-form-page__nav-space {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 72rpx;
	height: 72rpx;
	flex: none;
}

.address-form-page__back {
	margin-left: -12rpx;
}

.address-form-page__title {
	font-size: 40rpx;
	line-height: 1.2;
	font-weight: 600;
	color: #1b1b1d;
}

.address-form-page__body {
	padding-top: 38rpx;
}

.address-form-page__card {
	overflow: hidden;
	border-radius: 24rpx;
	background: #ffffff;
	box-shadow: 0 16rpx 40rpx rgba(23, 31, 61, 0.05);
}

.address-form-page__row {
	display: flex;
	align-items: center;
	min-height: 114rpx;
	padding: 0 42rpx;
}

.address-form-page__row + .address-form-page__row {
	border-top: 1px solid #f0f1f3;
}

.address-form-page__row--picker,
.address-form-page__row--detail {
	align-items: flex-start;
	padding-top: 34rpx;
	padding-bottom: 34rpx;
}

.address-form-page__row--switch {
	justify-content: space-between;
	min-height: 126rpx;
}

.address-form-page__label,
.address-form-page__switch-label {
	flex: none;
	width: 170rpx;
	font-size: 28rpx;
	line-height: 1.4;
	color: #202126;
}

.address-form-page__switch-label {
	width: auto;
	font-size: 30rpx;
	font-weight: 600;
}

.address-form-page__input {
	flex: 1;
	min-width: 0;
	font-size: 28rpx;
	line-height: 1.4;
	color: #202126;
}

.address-form-page__input--picker {
	display: flex;
	align-items: center;
	min-height: 40rpx;
}

.address-form-page__input-placeholder,
.address-form-page__input-value {
	font-size: 28rpx;
	line-height: 1.4;
}

.address-form-page__input-placeholder {
	color: #9a9ca3;
}

.address-form-page__input-value {
	color: #202126;
}

.address-form-page__footer {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 12;
	padding-top: 24rpx;
	padding-bottom: calc(24rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
	background: rgba(255, 255, 255, 0.96);
	box-shadow: 0 -8rpx 24rpx rgba(16, 24, 44, 0.04);
}

.address-form-page__button {
	width: 100%;
	height: 94rpx;
	border-radius: 999rpx;
	font-size: 34rpx;
	font-weight: 500;
	color: #ffffff;
	background: #243f95;
}

@media screen and (max-width: 360px) {
	.address-form-page__label {
		width: 156rpx;
	}

	.address-form-page__row {
		padding-left: 32rpx;
		padding-right: 32rpx;
	}
}
</style>
