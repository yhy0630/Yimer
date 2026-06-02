<template>
  <view>
    <view class="flex row-between m-b-26">
      <view class="flex">
        <view class="section-head-mark flex-none m-r-12"></view>
        <text class="xl black semibold lh-1">{{ title }}</text>
      </view>
      <text class="xs text-subtle lh-1" @tap="$emit('more')">{{ moreText }}</text>
    </view>

    <view>
      <view
        v-for="(doctor, index) in doctors"
        :key="doctor.id"
        :class="['media-card', 'flex', 'col-top', index > 0 ? 'm-t-22' : '']"
        @tap="$emit('select', doctor)"
      >
        <image class="media-thumb-196 flex-none m-r-24" :src="doctor.avatar" mode="aspectFill" />
        <view class="media-body flex-1 flex-col p-t-8">
          <text class="block black nr bold m-b-12">{{ doctor.name }}</text>
          <text class="block text-warm xxs lh-14 m-b-12">{{ doctor.tags.join(" / ") }}</text>
          <text class="xxs lighter line-2 lh-16">{{ doctor.description }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'DoctorIntroSection',
  props: {
    title: {
      type: String,
      default: ''
    },
    moreText: {
      type: String,
      default: ''
    },
    doctors: {
      type: Array,
      default: function() {
        return []
      }
    }
  }
}
</script>
