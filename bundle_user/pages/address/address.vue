<template>
	<view class="user-address-page">
		<view class="user-address-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="page-shell user-address-page__nav">
				<view class="user-address-page__back" @tap="goBack">
					<u-icon name="arrow-left" size="48" color="#161616"></u-icon>
				</view>
				<text class="user-address-page__title">我的地址</text>
				<view class="user-address-page__nav-space"></view>
			</view>
		</view>

		<view :class="[
				'page-shell',
				'user-address-page__body',
				hasAddress ? '' : 'user-address-page__body--empty'
			]">
			<template v-if="hasAddress">
				<view v-for="item in addressList" :key="item.id" class="user-address-page__card">
					<view class="user-address-page__card-top">
						<view class="user-address-page__profile">
							<text v-if="item.isDefault" class="user-address-page__tag">默认</text>
							<text class="user-address-page__name">{{ item.name }}</text>
							<text class="user-address-page__phone">{{ item.phone }}</text>
						</view>

						<view class="user-address-page__edit" @tap="handleEdit(item)">
							<u-icon name="edit-pen" size="40" color="#262626"></u-icon>
						</view>
					</view>

					<text class="user-address-page__address">{{ item.fullAddress }}</text>
				</view>
			</template>
			<default-state v-else type="noAddress" class="user-address-page__empty-state" @action="handleCreate" />
		</view>

		<view v-if="hasAddress" class="user-address-page__footer">
			<view class="page-shell user-address-page__footer-shell">
				<button class="user-address-page__button" hover-class="none" @tap="handleCreate">
					新增地址
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	import DefaultState from '@/components/default/default.vue'

	const ADDRESS_LIST = []

	function getStatusBarHeight() {
		try {
			const {
				statusBarHeight = 20
			} = uni.getSystemInfoSync()
			return statusBarHeight
		} catch (error) {
			return 20
		}
	}

	export default {
		components: {
			DefaultState
		},
		data() {
			return {
				statusBarHeight: getStatusBarHeight(),
				addressList: ADDRESS_LIST
			}
		},
		computed: {
			hasAddress() {
				return this.addressList.length > 0
			}
		},
		methods: {
			openAddressForm(query = {}) {
				const queryString = Object.keys(query)
					.filter((key) => query[key] !== undefined && query[key] !== null && query[key] !== '')
					.map((key) => `${key}=${encodeURIComponent(query[key])}`)
					.join('&')
				const url = queryString ?
					`/bundle_user/pages/address_form/address_form?${queryString}` :
					'/bundle_user/pages/address_form/address_form'

				uni.navigateTo({
					url
				})
			},
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
			handleEdit(item) {
				this.openAddressForm({
					mode: 'edit',
					name: item.name,
					phone: item.phone,
					region: item.region || item.regionText,
					detail: item.fullAddress,
					isDefault: item.isDefault ? '1' : '0'
				})
			},
			handleCreate() {
				this.openAddressForm()
			}
		}
	}
</script>

<style scoped lang="scss">
	.user-address-page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: #ffffff;
	}

	.user-address-page__header {
		position: sticky;
		top: 0;
		z-index: 10;
		background: rgba(255, 255, 255, 0.98);
	}

	.user-address-page__nav,
	.user-address-page__card-top,
	.user-address-page__profile,
	.user-address-page__footer-shell {
		display: flex;
		align-items: center;
	}

	.user-address-page__nav {
		justify-content: space-between;
		height: 96rpx;
	}

	.user-address-page__back,
	.user-address-page__nav-space {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 72rpx;
		height: 72rpx;
		flex: none;
	}

	.user-address-page__back {
		margin-left: -12rpx;
	}

	.user-address-page__title {
		font-size: 40rpx;
		font-weight: 600;
		line-height: 1.2;
		color: #1a1a1a;
	}

	.user-address-page__body {
		flex: 1;
		padding-top: 52rpx;
		padding-bottom: calc(200rpx + env(safe-area-inset-bottom));
	}

	.user-address-page__body--empty {
		padding-top: 0;
		padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
		display: flex;
	}

	.user-address-page__empty-state {
		flex: 1;
	}

	.user-address-page__card {
		padding: 0 0 40rpx;
	}

	.user-address-page__card-top {
		justify-content: space-between;
		align-items: flex-start;
	}

	.user-address-page__profile {
		flex: 1;
		min-width: 0;
		flex-wrap: wrap;
	}

	.user-address-page__tag {
		flex: none;
		margin-top: 8rpx;
		margin-right: 22rpx;
		padding: 0 16rpx;
		height: 42rpx;
		border-radius: 12rpx;
		font-size: 24rpx;
		line-height: 42rpx;
		color: #4d68b0;
		background: #edf2ff;
	}

	.user-address-page__name {
		font-size: 30rpx;
		font-weight: 600;
		line-height: 1.5;
		color: #1e1f22;
	}

	.user-address-page__phone {
		margin-left: 30rpx;
		font-size: 30rpx;
		line-height: 1.5;
		color: #8b919d;
	}

	.user-address-page__edit {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 56rpx;
		height: 56rpx;
		margin-top: 4rpx;
		margin-right: -8rpx;
		flex: none;
	}

	.user-address-page__address {
		display: block;
		margin-top: 34rpx;
		padding-right: 64rpx;
		font-size: 28rpx;
		line-height: 1.7;
		color: #4f5560;
	}

	.user-address-page__footer {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 12;
		padding-top: 20rpx;
		padding-bottom: calc(24rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
		background: rgba(255, 255, 255, 0.98);
	}

	.user-address-page__footer-shell {
		justify-content: center;
	}

	.user-address-page__button {
		width: 100%;
		height: 94rpx;
		border-radius: 999rpx;
		font-size: 34rpx;
		font-weight: 500;
		color: #ffffff;
		background: #243f95;
	}
</style>