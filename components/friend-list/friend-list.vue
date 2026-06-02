<template>
	<view class="friend-list">
		<view
			v-for="item in list"
			:key="item.id"
			class="friend-list__item bg-white p-t-28 p-b-32"
			@tap="$emit('select', item)"
		>
			<view class="flex row-between col-top">
				<view class="flex col-top flex-1 media-body">
					<image class="friend-list__avatar br60 flex-none" :src="item.avatar" mode="aspectFill" />
					<view class="m-l-20 flex-1 media-body">
						<text class="block md black lh-12">{{ item.author }}</text>
						<view class="flex m-t-8">
							<text class="block xxs bold primary lh-1">V</text>
							<text class="block xxs primary lh-1 m-l-6">{{ item.memberText }}</text>
						</view>
					</view>
				</view>
				<text class="block xs lighter lh-1 flex-none m-l-24">{{ item.date }}</text>
			</view>

			<view class="friend-list__content block md black lh-16 m-t-24 line-3">
				<text>{{ getTopicPrefix(item) }}</text>
				<text
					v-if="getTopicDisplay(item)"
					class="friend-list__topic"
					@tap.stop="handleTopicTap(item)"
				>
					{{ getTopicDisplay(item) }}
				</text>
				<text v-if="getTopicSuffix(item)">{{ getTopicSuffix(item) }}</text>
			</view>

			<view
				v-if="getDisplayImages(item.images).length"
				:class="[
					'friend-list__media',
					'm-t-24',
					isSingleImage(item.images) ? 'friend-list__media--single' : 'friend-list__media--grid flex flex-wrap'
				]"
			>
				<view
					v-for="(image, imageIndex) in getDisplayImages(item.images)"
					:key="imageIndex"
					class="friend-list__media-item overflow-hidden"
				>
					<image class="friend-list__media-image block w-full" :src="image" mode="aspectFill" />
					<view v-if="shouldShowCount(item.images, imageIndex)" class="friend-list__count-mask">
						<text class="block white font-size-44 semibold lh-1">{{ getImageCount(item.images) }}</text>
					</view>
				</view>
			</view>

			<view v-if="item.quote" class="friend-list__quote bg-body br16 p-20 m-t-20">
				<view class="flex col-top">
					<image class="friend-list__quote-avatar br60 flex-none" :src="item.quote.avatar" mode="aspectFill" />
					<view class="m-l-12 flex-1 media-body">
						<text class="block sm black lh-12">{{ item.quote.author }}</text>
						<text class="block xs normal lh-16 m-t-10">{{ item.quote.content }}</text>
					</view>
				</view>
			</view>

			<view class="flex row-between m-t-20">
				<text class="block xxxs text-subtle lh-1 line-1 friend-list__source">{{ item.sourceText }}</text>
				<view class="flex flex-none m-l-16">
					<view class="flex friend-list__meta-item">
						<u-icon name="eye-fill" size="24" color="#7F8595"></u-icon>
						<text class="block xxxs text-subtle lh-1 m-l-8">{{ item.views }}</text>
					</view>
					<view class="flex friend-list__meta-item m-l-24">
						<u-icon name="chat-fill" size="24" color="#7F8595"></u-icon>
						<text class="block xxxs text-subtle lh-1 m-l-8">{{ item.comments }}</text>
					</view>
					<view class="flex friend-list__meta-item m-l-24">
						<u-icon :name="item.liked ? 'thumb-up-fill' : 'thumb-up'" size="24" :color="item.liked ? '#143080' : '#7F8595'"></u-icon>
						<text class="block xxxs lh-1 m-l-8" :class="item.liked ? 'primary' : 'text-subtle'">{{ item.likes }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'FriendList',
	props: {
		list: {
			type: Array,
			default() {
				return []
			}
		}
	},
	methods: {
		getTopicMatch(item) {
			const content = item && item.content ? item.content : ''
			const match = content.match(/#[^#]+#/)

			if (!match || typeof match.index !== 'number') {
				return null
			}

			return {
				full: match[0],
				title: match[0].replace(/^#|#$/g, '').trim(),
				start: match.index,
				end: match.index + match[0].length
			}
		},
		getTopicPrefix(item) {
			const match = this.getTopicMatch(item)
			return match ? item.content.slice(0, match.start) : item.content
		},
		getTopicDisplay(item) {
			const match = this.getTopicMatch(item)
			return match ? match.full : ''
		},
		getTopicSuffix(item) {
			const match = this.getTopicMatch(item)
			return match ? item.content.slice(match.end) : ''
		},
		handleTopicTap(item) {
			const match = this.getTopicMatch(item)

			if (!match || !match.title) {
				return
			}

			this.$emit('topic-select', {
				id: item.topicId || '',
				title: match.title
			})
		},
		normalizeImages(images) {
			if (!Array.isArray(images)) {
				return []
			}

			return images.filter(Boolean)
		},
		getImageCount(images) {
			return this.normalizeImages(images).length
		},
		isSingleImage(images) {
			return this.getImageCount(images) < 4
		},
		getDisplayImages(images) {
			const list = this.normalizeImages(images)
			return list.length < 4 ? list.slice(0, 1) : list.slice(0, 4)
		},
		shouldShowCount(images, imageIndex) {
			const count = this.getImageCount(images)

			if (count <= 1) {
				return false
			}

			if (count < 4) {
				return imageIndex === 0
			}

			return imageIndex === 3
		}
	}
}
</script>

<style scoped lang="scss">
.friend-list__item + .friend-list__item {
	margin-top: 28rpx;
}

.friend-list__avatar {
	width: 72rpx;
	height: 72rpx;
}

.friend-list__content {
	word-break: break-all;
}

.friend-list__topic {
	color: #143080;
	font-weight: 600;
}

.friend-list__media--single .friend-list__media-item {
	height: 640rpx;
	border-radius: 16rpx;
}

.friend-list__media--grid {
	margin: 0 -4rpx -8rpx;
}

.friend-list__media--grid .friend-list__media-item {
	width: calc(50% - 8rpx);
	height: 320rpx;
	margin: 0 4rpx 8rpx;
	border-radius: 10rpx;
}

.friend-list__media-item {
	position: relative;
	background: #eef2fb;
}

.friend-list__media-image {
	height: 100%;
}

.friend-list__count-mask {
	position: absolute;
	right: 0;
	bottom: 0;
	left: 0;
	top: 0;
	display: flex;
	align-items: flex-end;
	justify-content: flex-end;
	padding: 0 18rpx 16rpx 0;
	background: linear-gradient(180deg, rgba(0, 0, 0, 0) 34%, rgba(0, 0, 0, 0.22) 100%);
}

.friend-list__quote-avatar {
	width: 36rpx;
	height: 36rpx;
}

.friend-list__source {
	max-width: 280rpx;
}
</style>
