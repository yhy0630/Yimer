<template>
	<view class="service-page">
		<u-navbar :is-back="false" :border-bottom="false" :title="' '" :background="{ background: 'none' }">
			<view slot="left" class="service-page__nav-location" @tap="handleLocationTap">
				<view class="service-page__location-icon">
					<view class="service-page__location-dot" />
				</view>
				<text class="service-page__location-text">{{ pageContent.currentLocation }}</text>
				<u-icon name="arrow-right" color="#fff" size="28" class="m-t-2 m-l-10"></u-icon>
			</view>
		</u-navbar>
		
		<view class="page-shell service-page__content">
			<view class="service-page__visual">
				<image class="service-page__visual-image" src="/static/linshi/06.png" mode="aspectFill" />
			</view>
		</view>

		<view class="service-page__actions-wrap">
			<view class="page-shell service-page__actions">
				<button v-for="action in pageContent.actions" :key="action.key" class="service-page__cta" :class="{
						'service-page__cta--ghost': action.variant === 'ghost',
						'service-page__cta--solid': action.variant === 'solid'
					}" @tap="handleActionTap(action)">
					{{ action.text }}
				</button>
			</view>
		</view>

		<u-popup
			v-model="showDepartmentPopup"
			mode="bottom"
			height="980rpx"
			:zoom="false"
			:safe-area-inset-bottom="true"
			:mask-close-able="true"
			:mask-custom-style="{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }"
			border-radius="40"
		>
			<view class="department-popup">
				<text class="department-popup__title">选择科室</text>

				<view class="department-popup__list">
					<view v-for="item in departmentOptions" :key="item.id" class="department-popup__item"
						@tap="selectDepartment(item.id)">
						<text class="department-popup__item-text">{{ item.name }}</text>
						<u-icon v-if="selectedDepartmentId === item.id" name="checkmark" color="#2c3138"
							size="54"></u-icon>
					</view>
				</view>

				<button class="department-popup__confirm" @tap="confirmDepartmentSelection">确认</button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		DEFAULT_CAMPUS,
		formatCampusLocation
	} from '@/config/campus'

	const PAGE_CONTENT = {
		currentLocation: '',
		menuText: '全部',
		actions: [{
				key: 'consultation',
				text: '预约面诊',
				variant: 'ghost'
			},
			{
				key: 'treatment',
				text: '预约治疗',
				variant: 'solid'
			}
		]
	}

	const DEPARTMENT_OPTIONS = [
		{
			id: 'skin-micro',
			name: '美容皮肤科（微创）'
		},
		{
			id: 'photoelectric',
			name: '光电美肤科'
		},
		{
			id: 'injection',
			name: '注射美容科'
		},
		{
			id: 'contour',
			name: '轮廓塑形科'
		},
		{
			id: 'hair-care',
			name: '毛发养护科'
		},
		{
			id: 'repair',
			name: '术后修复科'
		}
	]

	export default {
		data() {
			return {
				currentCampus: DEFAULT_CAMPUS,
				showDepartmentPopup: false,
				currentAction: null,
				selectedDepartmentId: DEPARTMENT_OPTIONS[0].id,
				departmentOptions: DEPARTMENT_OPTIONS,
				pageContent: {
					...PAGE_CONTENT,
					currentLocation: formatCampusLocation(DEFAULT_CAMPUS)
				}
			}
		},
		methods: {
			handleLocationTap() {
				uni.navigateTo({
					url: `/bundle/pages/campus/campus?mode=select&source=service&currentCampusId=${this.currentCampus.id}`,
					success: (res) => {
						res.eventChannel.on('campusSelected', ({
							campus
						}) => {
							this.currentCampus = campus
							this.pageContent.currentLocation = formatCampusLocation(campus)
						})
					}
				})
			},
			handleMenuTap() {
				uni.showToast({
					title: '服务分类待接入',
					icon: 'none'
				})
			},
			handleActionTap(action) {
				this.currentAction = action
				this.selectedDepartmentId = this.departmentOptions[0].id
				this.showDepartmentPopup = true
			},
			selectDepartment(departmentId) {
				this.selectedDepartmentId = departmentId
			},
			confirmDepartmentSelection() {
				const currentDepartment = this.departmentOptions.find((item) => item.id === this.selectedDepartmentId)
				this.showDepartmentPopup = false
				uni.navigateTo({
					url: `/bundle_service/pages/appointment_register/appointment_register?campusId=${this.currentCampus.id}&departmentId=${currentDepartment ? currentDepartment.id : ''}&actionKey=${this.currentAction ? this.currentAction.key : ''}`
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.service-page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.service-page__content {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding-top: 20rpx;
		padding-bottom: 220rpx;
		box-sizing: border-box;
	}

	.service-page__nav-location,
	.service-page__nav-menu {
		display: flex;
		align-items: center;
	}

	.service-page__nav-location {
		// max-width: 420rpx;
	}

	.service-page__location-icon {
		position: relative;
		width: 26rpx;
		height: 26rpx;
		margin-right: 16rpx;
		border: 4rpx solid rgba(255, 255, 255, 0.98);
		border-radius: 50% 50% 50% 0;
		transform: rotate(-45deg);
		box-sizing: border-box;
	}

	.service-page__location-dot {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 8rpx;
		height: 8rpx;
		background: rgba(255, 255, 255, 0.98);
		border-radius: 50%;
		transform: translate(-50%, -50%);
	}

	.service-page__location-text,
	.service-page__menu-text {
		color: rgba(255, 255, 255, 0.98);
		font-size: 30rpx;
		font-weight: 600;
		line-height: 1.2;
	}

	.service-page__location-text {
		// max-width: 340rpx;
	}

	.service-page__menu-icon {
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 42rpx;
		height: 34rpx;
		margin-right: 16rpx;
	}

	.service-page__menu-line {
		height: 4rpx;
		background: rgba(255, 255, 255, 0.98);
		border-radius: 999rpx;
	}

	.service-page__menu-line+.service-page__menu-line {
		margin-top: 8rpx;
	}

	.service-page__visual {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 0;
		position: fixed;
		z-index: 0;
		width: 100%;
		height: 100vh;
		top: 0;
		left: 0;
	}

	.service-page__visual-image {
		display: block;
		width: 100%;
		height: 100%;
	}

	.service-page__actions-wrap {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 5;
		padding-top: 24rpx;
		padding-bottom: 24rpx;
	}

	/* #ifdef APP-PLUS */
	.service-page__actions-wrap {
		padding-bottom: calc(24rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
	}
	/* #endif */

	/* #ifdef MP-WEIXIN */
	.service-page__actions-wrap {
		padding-bottom: calc(24rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
	}
	/* #endif */
	
	/* #ifdef H5 */
	.service-page__actions-wrap {
		padding-bottom: calc(124rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(124rpx + env(safe-area-inset-bottom));
	}
	/* #endif */

	.service-page__actions {
		display: flex;
		align-items: center;
		justify-content: space-between;
		column-gap: 24rpx;
	}

	.service-page__cta {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 316rpx;
		height: 110rpx;
		border-radius: 999rpx;
		font-size: 34rpx;
		font-weight: 600;
		line-height: 1;
		box-sizing: border-box;
	}

	.service-page__cta--ghost {
		border: 2rpx solid rgba(255, 255, 255, 0.96);
		color: #ffffff;
		background: rgba(24, 59, 19, 0.22);
	}

	.service-page__cta--solid {
		color: #20272c;
		background: rgba(255, 255, 255, 0.96);
		box-shadow: 0 14rpx 34rpx rgba(45, 87, 38, 0.18);
	}

	.department-popup {
		background: #ffffff;
		border-radius: 40rpx 40rpx 0 0;
		box-sizing: border-box;
		min-height: 980rpx;
		padding: 42rpx 0 30rpx;
		display: flex;
		flex-direction: column;
	}

	.department-popup__title {
		display: block;
		padding: 0 56rpx;
		font-size: 44rpx;
		font-weight: 700;
		line-height: 1.2;
		text-align: center;
		color: #22252b;
	}

	.department-popup__list {
		flex: 1;
		margin-top: 8rpx;
	}

	.department-popup__item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 108rpx;
		padding: 0 56rpx;
		box-sizing: border-box;
	}

	.department-popup__item-text {
		font-size: 34rpx;
		font-weight: 400;
		line-height: 1.3;
		color: #2b2f36;
	}

	.department-popup__confirm {
		display: flex;
		align-items: center;
		justify-content: center;
		width: calc(100% - 112rpx);
		height: 110rpx;
		margin: auto auto 0;
		border-radius: 999rpx;
		background: #243c8f;
		font-size: 34rpx;
		font-weight: 600;
		line-height: 1;
		color: #ffffff;
		letter-spacing: 1rpx;
	}

	.department-popup__confirm::after {
		border: none;
	}
</style>
