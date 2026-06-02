<template>
	<view :class="['default-state', 'w-full', 'box-border', fullPage ? 'default-state--page' : '']">
		<view class="default-state__body flex-col col-center text-center">
			<image
				class="default-state__image w-full max-w-full"
				:src="currentImage"
				mode="widthFix"
			/>
			<text class="block m-t-44 font-size-44 semibold black lh-12">{{ currentTitle }}</text>
			<text class="block m-t-28 xs muted lh-16">{{ currentDesc }}</text>
		</view>

		<button
			v-if="currentButtonText"
			class="default-state__button w-full"
			type="primary"
			size="lg"
			@click="handleAction"
		>
			{{ currentButtonText }}
		</button>
	</view>
</template>

<script>
const DEFAULT_STATE_MAP = {
	weakGps: {
		image: '/static/defaultImg/weak_GPS_signal.png',
		title: 'GPS信号弱',
		desc: '请移步到开阔地带，或检查设备设置',
		buttonText: '手动输入地址'
	},
	locationFail: {
		image: '/static/defaultImg/positioningFailed.png',
		title: '定位失败',
		desc: '暂时无法获取当前位置，请手动输入地址',
		buttonText: '手动输入地址'
	},
	networkError: {
		image: '/static/defaultImg/networkAnomaly.png',
		title: '网络异常',
		desc: '当前网络不稳定，请检查网络后重试',
		buttonText: '重新加载'
	},
	noContent: {
		image: '/static/defaultImg/noContent.png',
		title: '暂无信息',
		desc: '当前暂无可展示信息',
		buttonText: ''
	},
	noMessage: {
		image: '/static/defaultImg/noNews.png',
		title: '暂无消息',
		desc: '当前暂无消息通知',
		buttonText: ''
	},
	noCoupons: {
		image: '/static/defaultImg/noCoupons.png',
		title: '暂无优惠券',
		desc: '当前暂无可用优惠券',
		buttonText: ''
	},
	noCity: {
		image: '/static/defaultImg/noCity.png',
		title: '暂无相关城市',
		desc: '请重新搜索或切换其他关键词',
		buttonText: ''
	}
}

const DEFAULT_STATE_ALIAS_MAP = {
	weak_gps: 'weakGps',
	gps: 'weakGps',
	gpsWeak: 'weakGps',
	positioningFailed: 'locationFail',
	locationFailed: 'locationFail',
	locationError: 'locationFail',
	network: 'networkError',
	noInfo: 'noContent',
	empty: 'noContent',
	noNews: 'noMessage',
	message: 'noMessage',
	coupon: 'noCoupons',
	city: 'noCity'
}

export default {
	name: 'DefaultState',
	props: {
		type: {
			type: String,
			default: 'noContent'
		},
		title: {
			type: String,
			default: ''
		},
		desc: {
			type: String,
			default: ''
		},
		buttonText: {
			type: String,
			default: ''
		},
		image: {
			type: String,
			default: ''
		},
		fullPage: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		normalizedType() {
			return DEFAULT_STATE_ALIAS_MAP[this.type] || this.type
		},
		currentConfig() {
			return DEFAULT_STATE_MAP[this.normalizedType] || DEFAULT_STATE_MAP.noContent
		},
		currentImage() {
			return this.image || this.currentConfig.image
		},
		currentTitle() {
			return this.title || this.currentConfig.title
		},
		currentDesc() {
			return this.desc || this.currentConfig.desc
		},
		currentButtonText() {
			return this.buttonText || this.currentConfig.buttonText
		}
	},
	methods: {
		handleAction() {
			this.$emit('action', this.normalizedType)
		}
	}
}
</script>

<style scoped lang="scss">
.default-state {
	padding: 40rpx 32rpx 0;
}

.default-state--page {
	min-height: 100vh;
	padding: 180rpx 54rpx 56rpx;
	display: flex;
	flex-direction: column;
}

.default-state__body {
}

.default-state--page .default-state__body {
	flex: 1;
}

.default-state__image {
	width: 640rpx;
}

.default-state__button {
	margin-top: 88rpx;
	border-radius: 999rpx;
}
</style>
