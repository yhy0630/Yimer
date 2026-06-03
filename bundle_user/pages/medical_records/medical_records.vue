<template>
	<view class="medical-records-page">
		<view class="medical-records-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="page-shell medical-records-page__nav">
				<view class="medical-records-page__back" @tap="goBack">
					<u-icon name="arrow-left" size="52" color="#101010"></u-icon>
				</view>
			</view>
		</view>

		<view class="page-shell medical-records-page__body">
			<text class="medical-records-page__title">我的病历</text>

			<view class="medical-records-page__list">
				<view v-for="item in records" :key="item.id" class="record-card">
					<view class="record-card__head">
						<view class="record-card__name-row">
							<text class="record-card__name-label">姓名：</text>
							<text class="record-card__name-value">{{ item.name }}</text>
						</view>

						<view class="record-card__tag" @tap="handleRecordTap(item)">
							<text class="record-card__tag-text">病例记录</text>
						</view>
					</view>

					<view class="record-card__content">
						<view v-for="field in item.fields" :key="field.label" class="record-card__row">
							<text class="record-card__label">{{ field.label }}：</text>
							<text class="record-card__value">{{ field.value }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
const MEDICAL_RECORDS = [
	{
		id: 'mr-001',
		name: 'Monet',
		fields: [
			{ label: '性别', value: '女' },
			{ label: '出具院区', value: '北京伊美尔光华Soho2期店' },
			{ label: '出具时间', value: '2026-01-01 13:00' },
			{ label: '病历号', value: '治疗' }
		]
	},
	{
		id: 'mr-002',
		name: 'Monet',
		fields: [
			{ label: '性别', value: '女' },
			{ label: '出具院区', value: '北京伊美尔光华Soho2期店' },
			{ label: '出具时间', value: '2026-01-01 13:00' },
			{ label: '病历号', value: '治疗' }
		]
	},
	{
		id: 'mr-003',
		name: 'Monet',
		fields: [
			{ label: '性别', value: '女' },
			{ label: '出具院区', value: '北京伊美尔光华Soho2期店' },
			{ label: '出具时间', value: '2026-01-01 13:00' },
			{ label: '病历号', value: '治疗' }
		]
	}
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
			records: MEDICAL_RECORDS
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
		handleRecordTap(item) {
			uni.showToast({
				title: `${item.name}的病例详情待接入`,
				icon: 'none'
			})
		}
	}
}
</script>

<style scoped lang="scss">
	.medical-records-page {
		position: relative;
		min-height: 100vh;
		background:
			radial-gradient(circle at 18% 4%, rgba(215, 224, 244, 0.92) 0, rgba(223, 231, 247, 0.34) 34%, rgba(223, 231, 247, 0) 58%),
			linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0, rgba(255, 255, 255, 0.24) 34%, rgba(255, 255, 255, 0) 35%),
			linear-gradient(180deg, #f4f7fe 0%, #f7f8fb 520rpx, #f2f4f8 100%);
		overflow: hidden;
	}

	.medical-records-page::before {
		content: '';
		position: absolute;
		top: -180rpx;
		right: -130rpx;
		width: 760rpx;
		height: 760rpx;
		border-radius: 50%;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.66) 0%, rgba(255, 255, 255, 0.14) 100%);
		pointer-events: none;
	}

	.medical-records-page__header,
	.medical-records-page__body {
		position: relative;
		z-index: 1;
	}

	.medical-records-page__nav {
		display: flex;
		align-items: center;
		height: 96rpx;
	}

	.medical-records-page__back {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		width: 84rpx;
		height: 84rpx;
		margin-left: -18rpx;
	}

	.medical-records-page__body {
		padding-top: 58rpx;
		padding-bottom: calc(72rpx + env(safe-area-inset-bottom));
	}

	.medical-records-page__title {
		display: block;
		font-size: 80rpx;
		font-weight: 700;
		line-height: 1.08;
		letter-spacing: 2rpx;
		color: #1b1d22;
	}

	.medical-records-page__list {
		margin-top: 44rpx;
	}

	.record-card + .record-card {
		margin-top: 42rpx;
	}

	.record-card {
		padding: 38rpx 42rpx 40rpx;
		border-radius: 28rpx;
		background: rgba(255, 255, 255, 0.96);
		box-shadow: 0 24rpx 56rpx rgba(33, 42, 68, 0.08);
	}

	.record-card__head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		column-gap: 24rpx;
	}

	.record-card__name-row {
		flex: 1;
		min-width: 0;
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
	}

	.record-card__name-label,
	.record-card__name-value {
		font-size: 38rpx;
		font-weight: 700;
		line-height: 1.2;
		color: #363a42;
	}

	.record-card__tag {
		flex: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 124rpx;
		height: 60rpx;
		padding: 0 18rpx;
		border-radius: 12rpx;
		background: #e9eefb;
	}

	.record-card__tag-text {
		font-size: 24rpx;
		font-weight: 500;
		line-height: 1;
		color: #24459c;
	}

	.record-card__content {
		margin-top: 22rpx;
	}

	.record-card__row {
		display: flex;
		align-items: flex-start;
		padding-top: 30rpx;
	}

	.record-card__label {
		flex: none;
		width: 176rpx;
		font-size: 26rpx;
		line-height: 1.55;
		color: #9ea3ad;
	}

	.record-card__value {
		flex: 1;
		min-width: 0;
		font-size: 26rpx;
		line-height: 1.55;
		color: #3d434d;
		word-break: break-all;
	}

	@media screen and (max-width: 360px) {
		.medical-records-page__title {
			font-size: 72rpx;
		}

		.record-card {
			padding-left: 34rpx;
			padding-right: 34rpx;
		}

		.record-card__label {
			width: 156rpx;
		}
	}
</style>
