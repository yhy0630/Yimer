<template>
	<view class="bg-white">
		<view v-if="shouldShowHeader" class="flex row-between m-b-30">
			<view class="flex">
				<view class="section-head-mark flex-none m-r-12"></view>
				<text class="xl black semibold lh-1">{{ title }}</text>
			</view>
			<text v-if="actionText" class="xs text-subtle lh-1" @tap="$emit('more')">{{ actionText }}</text>
		</view>

		<view class="grid-two flex flex-wrap col-top">
			<view
				v-for="item in items"
				:key="item.id"
				class="grid-two-item"
				@tap="$emit('select', item)"
			>
				<image class="cover-image-320" :src="item.image" mode="aspectFill" />
				<text class="block xxxs muted lh-14 m-t-12">{{ item.tags.join(' / ') }}</text>
				<text class="block nr black line-2 lh-125 m-t-8">{{ item.title }}</text>
				<text class="block md bold primary lh-1 m-t-10">¥ {{ item.price }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'HomeRecommendSection',
		props: {
			title: {
				type: String,
				default: ''
			},
			actionText: {
				type: String,
				default: ''
			},
			entry: {
				type: String,
				default: 'default'
			},
			showHeader: {
				type: Boolean,
				default: true
			},
			items: {
				type: Array,
				default: function() {
					return []
				}
			}
		},
		computed: {
			shouldShowHeader() {
				if (!this.showHeader) {
					return false
				}

				return this.entry !== 'surprise-strict'
			}
		}
	}
</script>
