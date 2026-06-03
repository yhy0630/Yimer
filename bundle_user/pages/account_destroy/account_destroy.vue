<template>
	<view class="account-destroy-page">
		<view class="account-destroy-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="page-shell account-destroy-page__nav">
				<view class="account-destroy-page__back" @tap="goBack">
					<u-icon name="arrow-left" size="48" color="#111111"></u-icon>
				</view>
			</view>
		</view>

		<view class="page-shell account-destroy-page__body">
			<text class="account-destroy-page__title">注销账号</text>
			<text class="account-destroy-page__intro">
				将为你注销{{ account.phoneMask }}绑定的以下账号
			</text>

			<view class="account-destroy-page__profile">
				<u-avatar :src="account.avatar" size="88" mode="circle" img-mode="aspectFill"></u-avatar>
				<view class="account-destroy-page__profile-main">
					<text class="account-destroy-page__profile-name">{{ account.name }}</text>
					<text class="account-destroy-page__profile-source">{{ account.source }}</text>
				</view>
			</view>

			<view class="account-destroy-page__section">
				<text class="account-destroy-page__section-title">你将放弃如下服务权益：</text>

				<view class="account-destroy-page__paragraphs">
					<text
						v-for="item in paragraphs"
						:key="item.id"
						class="account-destroy-page__paragraph"
					>
						{{ item.text }}
					</text>
				</view>

				<view class="account-destroy-page__checks">
					<view v-for="item in checks" :key="item.title" class="account-destroy-page__check">
						<text class="account-destroy-page__check-title">{{ item.title }}</text>
						<text class="account-destroy-page__check-desc">{{ item.desc }}</text>
					</view>
				</view>
			</view>
		</view>

		<view class="account-destroy-page__footer">
			<view class="page-shell">
				<view class="account-destroy-page__agreement">
					<u-checkbox v-model="agreed" shape="circle" :active-color="'#243f95'" :label-size="28" :size="36">
						<text class="account-destroy-page__agreement-text">我已阅读并同意</text>
						<text class="account-destroy-page__agreement-link" @tap.stop="handleNoticeTap">
							《伊美尔通用账号注销须知》
						</text>
					</u-checkbox>
				</view>

				<button
					:class="['account-destroy-page__submit', agreed ? 'is-active' : 'is-disabled']"
					hover-class="none"
					:disabled="!agreed"
					@tap="handleNextStep"
				>
					下一步
				</button>
			</view>
		</view>
	</view>
</template>

<script>
const ACCOUNT_INFO = {
	phoneMask: '198****6997',
	name: '沈以诚',
	source: '来自伊美尔',
	avatar: '/static/linshi/01.png'
}

const PARAGRAPHS = [
	{
		id: 'surrender',
		text: '1. 账号注销后，你将放弃以下服务或权益：'
	},
	{
		id: 'verify',
		text: '2. 账号注销前，我们将进行以下验证：'
	}
]

const CHECKS = [
	{
		title: '账号处于安全状态',
		desc: '最近两周内，你没有进行改密、改绑等敏感操作，你的账号没有被盗的风险。'
	},
	{
		title: '账号下无任何关联项目',
		desc: '账号下无任何关联车辆、订单、服务记录或其他仍在进行中的业务信息。'
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
			account: ACCOUNT_INFO,
			paragraphs: PARAGRAPHS,
			checks: CHECKS,
			agreed: false
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
				url: '/bundle_user/pages/settings/settings'
			})
		},
		handleNoticeTap() {
			uni.showToast({
				title: '注销须知待接入',
				icon: 'none'
			})
		},
		handleNextStep() {
			if (!this.agreed) {
				return
			}

			uni.showToast({
				title: '下一步流程待接入',
				icon: 'none'
			})
		}
	}
}
</script>

<style scoped lang="scss">
.account-destroy-page {
	min-height: 100vh;
	background: #ffffff;
}

.account-destroy-page__header {
	position: relative;
	z-index: 2;
	background: #ffffff;
}

.account-destroy-page__nav {
	display: flex;
	align-items: center;
	height: 96rpx;
}

.account-destroy-page__back {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 72rpx;
	height: 72rpx;
	margin-left: -12rpx;
}

.account-destroy-page__body {
	padding-top: 26rpx;
	padding-bottom: calc(260rpx + env(safe-area-inset-bottom));
}

.account-destroy-page__title {
	display: block;
	font-size: 74rpx;
	font-weight: 700;
	line-height: 1.08;
	color: #1f2329;
}

.account-destroy-page__intro {
	display: block;
	margin-top: 62rpx;
	font-size: 34rpx;
	line-height: 1.5;
	color: #525762;
}

.account-destroy-page__profile {
	display: flex;
	align-items: center;
	margin-top: 54rpx;
}

.account-destroy-page__profile-main {
	min-width: 0;
	margin-left: 24rpx;
}

.account-destroy-page__profile-name {
	display: block;
	font-size: 34rpx;
	font-weight: 500;
	line-height: 1.25;
	color: #252932;
}

.account-destroy-page__profile-source {
	display: block;
	margin-top: 12rpx;
	font-size: 24rpx;
	line-height: 1.25;
	color: #9fa4ae;
}

.account-destroy-page__section {
	margin-top: 138rpx;
}

.account-destroy-page__section-title {
	display: block;
	font-size: 58rpx;
	font-weight: 700;
	line-height: 1.18;
	color: #111317;
}

.account-destroy-page__paragraphs {
	margin-top: 52rpx;
}

.account-destroy-page__paragraph {
	display: block;
	font-size: 34rpx;
	line-height: 1.65;
	color: #1f2329;
}

.account-destroy-page__paragraph + .account-destroy-page__paragraph {
	margin-top: 40rpx;
}

.account-destroy-page__checks {
	margin-top: 50rpx;
}

.account-destroy-page__check + .account-destroy-page__check {
	margin-top: 58rpx;
}

.account-destroy-page__check-title {
	display: block;
	font-size: 34rpx;
	font-weight: 600;
	line-height: 1.35;
	color: #3f434b;
}

.account-destroy-page__check-desc {
	display: block;
	margin-top: 22rpx;
	font-size: 30rpx;
	line-height: 1.55;
	color: #a3a8b2;
}

.account-destroy-page__footer {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 10;
	padding-top: 14rpx;
	padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
	background: rgba(255, 255, 255, 0.98);
}

.account-destroy-page__agreement {
	padding: 0 2rpx;
}

.account-destroy-page__agreement ::v-deep .u-checkbox {
	display: flex;
	align-items: center;
}

.account-destroy-page__agreement ::v-deep .u-checkbox__icon-wrap {
	border-color: #dddddf;
}

.account-destroy-page__agreement ::v-deep .u-checkbox__label {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	margin-right: 0;
	color: #9ea3ad;
}

.account-destroy-page__agreement-text,
.account-destroy-page__agreement-link {
	font-size: 28rpx;
	line-height: 1.5;
}

.account-destroy-page__agreement-text {
	color: #9ea3ad;
}

.account-destroy-page__agreement-link {
	color: #244392;
}

.account-destroy-page__submit {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 104rpx;
	margin-top: 22rpx;
	border-radius: 999rpx;
	font-size: 40rpx;
	font-weight: 500;
	line-height: 1;
	color: #ffffff;
}

.account-destroy-page__submit.is-active {
	background: #243f95;
}

.account-destroy-page__submit.is-disabled {
	background: #9aa7d3;
}

@media screen and (max-width: 360px) {
	.account-destroy-page__title {
		font-size: 64rpx;
	}

	.account-destroy-page__section-title {
		font-size: 50rpx;
	}

	.account-destroy-page__section {
		margin-top: 108rpx;
	}
}
</style>
