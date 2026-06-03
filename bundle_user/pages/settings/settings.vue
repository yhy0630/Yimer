<template>
	<view class="settings-page">
		<view class="settings-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="page-shell settings-page__nav">
				<view class="settings-page__back" @tap="goBack">
					<u-icon name="arrow-left" size="48" color="#111111"></u-icon>
				</view>
			</view>
		</view>

		<view class="page-shell settings-page__body">
			<text class="settings-page__title">设置</text>

			<view class="settings-page__list">
				<u-cell-group :border="false">
					<u-cell-item
						v-for="item in settingsItems"
						:key="item.key"
						:title="item.title"
						:value="item.value || ''"
						:arrow="item.arrow"
						:border-bottom="false"
						:bg-color="'transparent'"
						:title-style="titleStyle"
						:value-style="valueStyle"
						hover-class="none"
						@click="handleItemTap(item)"
					></u-cell-item>
				</u-cell-group>
			</view>

			<button class="settings-page__logout" hover-class="none" @tap="handleLogout">
				退出登录
			</button>

			<text class="settings-page__destroy" @tap="handleDestroyAccount">申请注销账号</text>
			<text class="settings-page__record">ICP备案号：京ICP备 123456789987-01A</text>
		</view>
	</view>
</template>

<script>
const SETTINGS_ITEMS = [
	{ key: 'profile', title: '个人信息', arrow: true },
	{ key: 'account', title: '账号绑定', arrow: true },
	{ key: 'privacy', title: '我的隐私', arrow: true },
	{ key: 'permission', title: '权限管理', arrow: true },
	{ key: 'notice', title: '通知管理', arrow: true },
	{ key: 'agreement', title: '用户协议', arrow: true },
	{ key: 'policy', title: '隐私政策', arrow: true },
	{ key: 'collection', title: '个人信息收集清单', arrow: true },
	{ key: 'update', title: '检测更新', value: '新版本', arrow: true },
	{ key: 'version', title: '版本', value: '2.8.6', arrow: false }
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
			settingsItems: SETTINGS_ITEMS,
			titleStyle: {
				fontSize: '34rpx',
				lineHeight: '1.2',
				color: '#20242a',
				fontWeight: '400'
			},
			valueStyle: {
				fontSize: '34rpx',
				lineHeight: '1.2',
				color: '#9fa4ae'
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
				url: '/pages/user/user'
			})
		},
		handleItemTap(item) {
			if (item.key === 'version') {
				return
			}

			if (item.key === 'update') {
				uni.showToast({
					title: '发现新版本，待接入更新流程',
					icon: 'none'
				})
				return
			}

			uni.showToast({
				title: `${item.title}待接入`,
				icon: 'none'
			})
		},
		handleLogout() {
			uni.showModal({
				title: '退出登录',
				content: '确认退出当前账号吗？',
				confirmColor: '#22262d',
				success: ({ confirm }) => {
					if (!confirm) {
						return
					}

					uni.showToast({
						title: '退出登录待接入',
						icon: 'none'
					})
				}
			})
		},
		handleDestroyAccount() {
			uni.navigateTo({
				url: '/bundle_user/pages/account_destroy/account_destroy'
			})
		}
	}
}
</script>

<style scoped lang="scss">
	.settings-page {
		min-height: 100vh;
		background: #ffffff;
	}

	.settings-page__nav {
		display: flex;
		align-items: center;
		height: 96rpx;
	}

	.settings-page__back {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		width: 72rpx;
		height: 72rpx;
		margin-left: -12rpx;
	}

	.settings-page__body {
		padding-top: 22rpx;
		padding-bottom: calc(56rpx + env(safe-area-inset-bottom));
	}

	.settings-page__title {
		display: block;
		font-size: 74rpx;
		font-weight: 700;
		line-height: 1.08;
		color: #1f2329;
	}

	.settings-page__list {
		margin-top: 68rpx;
	}

	.settings-page__list ::v-deep .u-cell {
		min-height: 112rpx;
		padding: 0;
		background: transparent !important;
	}

	.settings-page__list ::v-deep .u-cell__value {
		color: #9fa4ae;
	}

	.settings-page__list ::v-deep .u-cell__right-icon-wrap {
		margin-left: 16rpx;
		color: #9fa4ae;
		font-size: 30rpx;
	}

	.settings-page__logout {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 88rpx;
		margin-top: 78rpx;
		border: 2rpx solid #4a4d55;
		border-radius: 999rpx;
		background: #ffffff;
		font-size: 34rpx;
		font-weight: 500;
		color: #2a2d33;
	}

	.settings-page__destroy,
	.settings-page__record {
		display: block;
		text-align: center;
	}

	.settings-page__destroy {
		margin-top: 56rpx;
		font-size: 32rpx;
		line-height: 1.3;
		color: #9ea3ad;
	}

	.settings-page__record {
		margin-top: 74rpx;
		font-size: 28rpx;
		line-height: 1.4;
		color: #c4c7ce;
	}

	@media screen and (max-width: 360px) {
		.settings-page__title {
			font-size: 64rpx;
		}

		.settings-page__body {
			padding-top: 12rpx;
		}
	}
</style>
