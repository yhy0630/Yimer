<template>
	<view class="user-page">
		<view class="page-shell user-page__hero-shell" :style="{ paddingTop: `${topInset}px` }">
			<view class="user-page__hero-action" @tap="goSettings">
				<u-icon name="setting" size="38" color="#2f3440"></u-icon>
			</view>

			<view class="user-page__profile-row">
				<u-avatar class="user-page__avatar" src="/static/linshi/01.png" size="104rpx" mode="circle"
					img-mode="aspectFill"></u-avatar>

				<view class="user-page__profile-main">
					<text class="user-page__profile-name">{{ profile.name }}</text>
					<text class="user-page__profile-desc">{{ profile.desc }}</text>
				</view>

				<button class="user-page__profile-button" hover-class="none" @tap="goHome">
					进入主页
				</button>
			</view>

			<view class="user-page__stats">
				<view v-for="item in stats" :key="item.label"
					:class="['user-page__stat-item', hasAction(item.label) ? 'is-link' : '']"
					@tap="handleStatTap(item)">
					<text class="user-page__stat-value">{{ item.value }}</text>
					<text class="user-page__stat-label">{{ item.label }}</text>
				</view>
			</view>
		</view>

		<view class="member-band" @tap="showPending(profile.memberAction)">
			<view class="page-shell member-band__inner">
				<text class="member-band__title">{{ profile.memberTitle }}</text>
				<view class="member-band__action">
					<text class="member-band__action-text">{{ profile.memberAction }}</text>
					<u-icon name="arrow-right" size="22" color="#24459c"></u-icon>
				</view>
			</view>
		</view>

		<view class="member-card">
			<view class="page-shell member-card__inner">
				<u-grid :col="4" :border="false" hover-class="none">
					<u-grid-item v-for="item in memberBenefits" :key="item.title" :custom-style="memberGridItemStyle"
						@click="handleBenefitTap(item)">
						<view class="member-benefit">
							<view :class="['member-benefit__icon-wrap', item.theme]">
								<u-icon :name="item.icon" size="52" :color="item.iconColor"></u-icon>
							</view>
							<text class="member-benefit__title">{{ item.title }}</text>
							<text class="member-benefit__desc">{{ item.desc }}</text>
						</view>
					</u-grid-item>
				</u-grid>
			</view>
		</view>

		<view class="feature-card">
			<view class="page-shell feature-card__inner">
				<u-grid :col="4" :border="false" hover-class="none">
					<u-grid-item v-for="item in toolEntries" :key="item.title" :custom-style="toolGridItemStyle"
						@click="handleEntryTap(item)">
						<view class="feature-entry">
							<view class="feature-entry__icon">
								<u-icon :name="item.icon" size="56" color="#3a3d45"></u-icon>
							</view>
							<text class="feature-entry__label">{{ item.title }}</text>
						</view>
					</u-grid-item>
				</u-grid>
			</view>
		</view>

		<view class="service-links-card">
			<u-cell-group :border="false">
				<u-cell-item v-for="(item, index) in serviceLinks" :key="item.title" :title="item.title"
					:border-bottom="index !== serviceLinks.length - 1" :bg-color="'#ffffff'"
					:title-style="cellTitleStyle" hover-class="none" @click="handleEntryTap(item)"></u-cell-item>
			</u-cell-group>
		</view>

		<view class="identity-reminder">
			<view class="identity-reminder__inner">
				<view class="identity-reminder__main">
					<u-icon name="volume" size="34" color="#4a4f5d"></u-icon>
					<text class="identity-reminder__text">{{ profile.notice }}</text>
				</view>
				<view class="identity-reminder__cta" @tap="showPending(profile.noticeAction)">
					<text class="identity-reminder__cta-text">{{ profile.noticeAction }}</text>
					<u-icon name="arrow-right" size="20" color="#23449b"></u-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const getTopInset = () => {
		try {
			const {
				statusBarHeight = 20
			} = uni.getSystemInfoSync()
			return statusBarHeight + 14
		} catch (error) {
			return 34
		}
	}

	const PROFILE = {
		name: 'Hi,小伊贝21312',
		desc: '五花马，千金裘',
		memberTitle: '蓝卡会员',
		memberAction: '领取权益',
		notice: '您的账号未实名，请尽快进行实名，感谢您的理解',
		noticeAction: '去实名'
	}

	const STATS = [{
			label: '余额',
			value: '0.00'
		},
		{
			label: '项目',
			value: '24'
		},
		{
			label: '优惠券',
			value: '8'
		},
		{
			label: '积分',
			value: '3'
		}
	]

	const MEMBER_BENEFITS = [{
			title: '饮品券',
			desc: '6张',
			icon: 'coupon-fill',
			iconColor: '#97ddd7',
			theme: 'is-mint'
		},
		{
			title: '入会礼',
			desc: '好物四选一',
			icon: 'gift-fill',
			iconColor: '#ffbf50',
			theme: 'is-amber'
		},
		{
			title: '年度礼',
			desc: '好物四选一',
			icon: 'gift-fill',
			iconColor: '#7c9eff',
			theme: 'is-blue'
		},
		{
			title: '生日礼',
			desc: '生日积分',
			icon: 'integral-fill',
			iconColor: '#b896ff',
			theme: 'is-lilac'
		}
	]

	const TOOL_ENTRIES = [{
			title: '挂号记录',
			icon: 'calendar'
		},
		{
			title: '签署',
			icon: 'edit-pen'
		},
		{
			title: '自助缴费',
			icon: 'rmb-circle'
		},
		{
			title: '我的病历',
			icon: 'file-text'
		},
		{
			title: '我的订单',
			icon: 'order'
		},
		{
			title: '购物车',
			icon: 'shopping-cart'
		},
		{
			title: '我的收藏',
			icon: 'heart'
		},
		{
			title: '收货地址',
			icon: 'map'
		},
		{
			title: '紧急联系人',
			icon: 'account'
		},
		{
			title: '投诉建议',
			icon: 'edit-pen'
		},
		{
			title: '蓝猫咖啡',
			icon: 'gift'
		},
		{
			title: '活动报名',
			icon: 'calendar-fill'
		}
	]

	const SERVICE_LINKS = [{
			title: '邀请有礼'
		},
		{
			title: '首席质量服务官'
		},
		{
			title: '我要成为代理'
		}
	]

	const ACTIONS = {
		余额: {
			type: 'navigateTo',
			url: '/bundle_user/pages/wallet/wallet'
		},
		项目: {
			type: 'navigateTo',
			url: '/bundle/pages/project_records/project_records'
		},
		挂号记录: {
			type: 'navigateTo',
			url: '/bundle_user/pages/appointment_records/appointment_records'
		},
		签署: {
			type: 'navigateTo',
			url: '/bundle/pages/sign_center/sign_center'
		},
		自助缴费: {
			type: 'navigateTo',
			url: '/bundle_user/pages/payment_list/payment_list'
		},
		我的订单: {
			type: 'navigateTo',
			url: '/bundle_user/pages/order_list/order_list'
		},
		我的病历: {
			type: 'navigateTo',
			url: '/bundle_user/pages/medical_records/medical_records'
		},
		购物车: {
			type: 'navigateTo',
			url: '/bundle_surprise/pages/cart/cart'
		},
		收货地址: {
			type: 'navigateTo',
			url: '/bundle_user/pages/address/address'
		},
		紧急联系人: {
			type: 'navigateTo',
			url: '/bundle_user/pages/emergency_contacts/emergency_contacts'
		},
		活动报名: {
			type: 'navigateTo',
			url: '/bundle_surprise/pages/activity_more/activity_more'
		},
		蓝猫咖啡: {
			type: 'navigateTo',
			url: '/bundle_coffee/pages/index/index'
		}
	}

	export default {
		data() {
			return {
				topInset: getTopInset(),
				profile: PROFILE,
				stats: STATS,
				memberBenefits: MEMBER_BENEFITS,
				toolEntries: TOOL_ENTRIES,
				serviceLinks: SERVICE_LINKS,
				memberGridItemStyle: {
					padding: '0 0 12rpx'
				},
				toolGridItemStyle: {
					padding: '0 0 46rpx'
				},
				cellTitleStyle: {
					fontSize: '34rpx',
					color: '#242833',
					fontWeight: '500'
				}
			}
		},
		methods: {
			goSettings() {
				uni.navigateTo({
					url: '/bundle_user/pages/settings/settings'
				})
			},
			goHome() {
				uni.navigateTo({
					url: '/bundle_user/pages/profile_home/profile_home'
				})
			},
			hasAction(label) {
				return Boolean(ACTIONS[label])
			},
			handleStatTap(item) {
				this.handleAction(item.label)
			},
			handleBenefitTap(item) {
				this.showPending(item.title)
			},
			handleEntryTap(item) {
				this.handleAction(item.title)
			},
			handleAction(label) {
				const action = ACTIONS[label]

				if (!action) {
					this.showPending(label)
					return
				}

				this.navigateByAction(action)
			},
			navigateByAction(action) {
				if (action.type === 'switchTab') {
					uni.switchTab({
						url: action.url
					})
					return
				}

				uni.navigateTo({
					url: action.url
				})
			},
			showPending(title) {
				uni.showToast({
					title: `${title}待接入`,
					icon: 'none'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.user-page {
		min-height: 100vh;
		padding-bottom: calc(env(safe-area-inset-bottom) + 320rpx);
		background:
			radial-gradient(circle at 12% 0, rgba(220, 228, 247, 0.94) 0, rgba(220, 228, 247, 0.24) 34%, rgba(220, 228, 247, 0) 56%),
			radial-gradient(circle at 100% 0, rgba(244, 233, 217, 0.84) 0, rgba(244, 233, 217, 0.18) 18%, rgba(244, 233, 217, 0) 38%),
			linear-gradient(180deg, #f7f8fc 0%, #f5f5f6 780rpx, #f3f3f4 100%);
	}

	.user-page__hero-shell {
		padding-bottom: 40rpx;
	}

	.user-page__hero-action {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		width: 100%;
		height: 72rpx;
	}

	.user-page__profile-row {
		display: flex;
		align-items: center;
		margin-top: 96rpx;
	}

	.user-page__avatar {
		flex: none;
	}

	.user-page__profile-main {
		flex: 1;
		min-width: 0;
		margin-left: 28rpx;
		padding-right: 24rpx;
	}

	.user-page__profile-name {
		display: block;
		font-size: 56rpx;
		font-weight: 700;
		line-height: 1.1;
		color: #252933;
	}

	.user-page__profile-desc {
		display: block;
		margin-top: 18rpx;
		font-size: 28rpx;
		line-height: 1.2;
		color: #8b8f98;
	}

	.user-page__profile-button {
		flex: none;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 170rpx;
		height: 80rpx;
		border-radius: 999rpx;
		border: 2rpx solid rgba(54, 58, 65, 0.72);
		background: rgba(255, 255, 255, 0.38);
		font-size: 24rpx;
		color: #343942;
	}

	.user-page__stats {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-top: 66rpx;
	}

	.user-page__stat-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.user-page__stat-item.is-link {
		position: relative;
	}

	.user-page__stat-item.is-link::after {
		content: '';
		position: absolute;
		left: 50%;
		bottom: -14rpx;
		width: 28rpx;
		height: 4rpx;
		border-radius: 999rpx;
		background: rgba(35, 68, 155, 0.24);
		transform: translateX(-50%);
	}

	.user-page__stat-value {
		font-size: 46rpx;
		font-weight: 700;
		line-height: 1;
		color: #232731;
	}

	.user-page__stat-label {
		margin-top: 16rpx;
		font-size: 26rpx;
		line-height: 1.2;
		color: #8b8f98;
	}

	.member-band {
		background: linear-gradient(90deg, #edf6fc 0%, #f1f5ff 54%, #f5f2fb 100%);
	}

	.member-band__inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 102rpx;
	}

	.member-band__title {
		font-size: 30rpx;
		font-weight: 500;
		color: #24459c;
	}

	.member-band__action {
		display: inline-flex;
		align-items: center;
	}

	.member-band__action-text {
		margin-right: 10rpx;
		font-size: 30rpx;
		font-weight: 500;
		color: #24459c;
	}

	.member-card,
	.feature-card,
	.service-links-card {
		background: #ffffff;
	}

	.member-card {
		border-radius: 0 0 28rpx 28rpx;
		box-shadow: 0 14rpx 32rpx rgba(22, 30, 49, 0.04);
	}

	.member-card__inner {
		padding-top: 36rpx;
		padding-bottom: 18rpx;
	}

	.member-benefit {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.member-benefit__icon-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100rpx;
		height: 100rpx;
		border-radius: 24rpx;
	}

	.member-benefit__icon-wrap.is-mint {
		background: linear-gradient(180deg, #edfafa 0%, #f4fbfb 100%);
	}

	.member-benefit__icon-wrap.is-amber {
		background: linear-gradient(180deg, #fff6e5 0%, #fff9f0 100%);
	}

	.member-benefit__icon-wrap.is-blue {
		background: linear-gradient(180deg, #eaf1ff 0%, #f1f5ff 100%);
	}

	.member-benefit__icon-wrap.is-lilac {
		background: linear-gradient(180deg, #f3edff 0%, #f8f4ff 100%);
	}

	.member-benefit__title {
		margin-top: 20rpx;
		font-size: 28rpx;
		font-weight: 500;
		line-height: 1.2;
		color: #30343d;
	}

	.member-benefit__desc {
		margin-top: 16rpx;
		font-size: 24rpx;
		line-height: 1.2;
		color: #8c9099;
	}

	.feature-card {
		margin-top: 24rpx;
		padding-top: 10rpx;
		box-shadow: 0 14rpx 32rpx rgba(22, 30, 49, 0.04);
	}

	.feature-card__inner {
		padding-top: 28rpx;
		padding-bottom: 4rpx;
	}

	.feature-entry {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.feature-entry__icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 88rpx;
		height: 88rpx;
	}

	.feature-entry__label {
		margin-top: 18rpx;
		font-size: 26rpx;
		line-height: 1.2;
		color: #343942;
	}

	.service-links-card {
		margin-top: 26rpx;
		box-shadow: 0 14rpx 32rpx rgba(22, 30, 49, 0.04);
		overflow: hidden;
	}

	.service-links-card ::v-deep .u-cell {
		min-height: 122rpx;
		padding-left: 44rpx;
		padding-right: 40rpx;
	}

	.service-links-card ::v-deep .u-cell__right-icon-wrap {
		margin-left: 18rpx;
	}

	.identity-reminder {
		position: fixed;
		left: 0;
		right: 0;
		bottom: calc(env(safe-area-inset-bottom) + 100rpx);
		z-index: 20;
		background: #eef2fb;
		box-shadow: 0 -2rpx 0 rgba(19, 35, 74, 0.04);
	}

	.identity-reminder__inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 88rpx;
		padding: 0 24rpx;
	}

	.identity-reminder__main {
		flex: 1;
		min-width: 0;
		display: flex;
		align-items: center;
	}

	.identity-reminder__text {
		margin-left: 18rpx;
		font-size: 24rpx;
		line-height: 1.2;
		color: #4a4f5d;
	}

	.identity-reminder__cta {
		flex: none;
		display: inline-flex;
		align-items: center;
		margin-left: 20rpx;
	}

	.identity-reminder__cta-text {
		margin-right: 6rpx;
		font-size: 24rpx;
		font-weight: 500;
		color: #23449b;
	}
</style>
