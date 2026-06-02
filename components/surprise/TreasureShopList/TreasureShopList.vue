<template>
	<view>
		<view class="treasure-shop-list__grid">
			<view
				v-for="item in items"
				:key="item.id"
				class="treasure-shop-card"
				@tap="$emit('select', item)"
			>
				<view class="treasure-shop-card__media br24 overflow-hidden bg-soft-card">
					<image
						class="treasure-shop-card__image"
						:src="item.image"
						mode="aspectFill"
					/>
					<text class="treasure-shop-card__shop-name block line-1 white xs lh-12">{{ item.shopName }}</text>
				</view>

				<text class="treasure-shop-card__title block line-2 m-t-18 text-ink nr lh-145">{{ item.title }}</text>

				<view class="treasure-shop-card__meta flex row-between col-center m-t-18">
					<view class="treasure-shop-card__author flex col-center">
						<image
							class="treasure-shop-card__avatar br-circle bg-soft-avatar"
							:src="item.authorAvatar"
							mode="aspectFill"
						/>
						<text class="treasure-shop-card__author-name line-1 m-l-12 muted xs flex-1">{{ item.authorName }}</text>
					</view>
					<view class="treasure-shop-card__like flex col-center text-faint">
						<u-icon name="heart" size="36" color="#909399" />
						<text class="treasure-shop-card__like-count m-l-6 xs lh-1">{{ item.likes }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'TreasureShopList',
	props: {
		items: {
			type: Array,
			default: function() {
				return []
			}
		}
	}
}
</script>

<style scoped lang="scss">
.treasure-shop-list__grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	column-gap: 28rpx;
	row-gap: 36rpx;
}

.treasure-shop-card {
	min-width: 0;
}

.treasure-shop-card__media {
	position: relative;
}

.treasure-shop-card__image {
	display: block;
	width: 100%;
	height: 392rpx;
}

.treasure-shop-card__shop-name {
	position: absolute;
	left: 18rpx;
	right: 18rpx;
	bottom: 18rpx;
	text-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.28);
}

.treasure-shop-card__title {
	word-break: break-all;
}

.treasure-shop-card__meta {
	gap: 16rpx;
}

.treasure-shop-card__author {
	min-width: 0;
	flex: 1;
}

.treasure-shop-card__avatar {
	width: 44rpx;
	height: 44rpx;
	flex: none;
}

.treasure-shop-card__author-name {
	min-width: 0;
}

.treasure-shop-card__like {
	flex: none;
}
</style>
