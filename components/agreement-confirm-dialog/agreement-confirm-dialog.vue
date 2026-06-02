<template>
    <view v-if="visible" class="agreement-dialog">
        <view class="agreement-dialog__mask"></view>
        <view class="agreement-dialog__panel">
            <view class="agreement-dialog__body">
                <text class="agreement-dialog__title">{{ content.title }}</text>
                <view class="agreement-dialog__copy">
                    <text class="agreement-dialog__text">{{ content.prefix }}</text>
                    <navigator
                        class="agreement-dialog__link"
                        hover-class="none"
                        :url="agreementLinks[0].url"
                        @click.stop="stopEvent"
                    >
                        {{ agreementLinks[0].label }}
                    </navigator>
                    <text class="agreement-dialog__text">{{ content.joiner }}</text>
                    <navigator
                        class="agreement-dialog__link"
                        hover-class="none"
                        :url="agreementLinks[1].url"
                        @click.stop="stopEvent"
                    >
                        {{ agreementLinks[1].label }}
                    </navigator>
                </view>
            </view>

            <view class="agreement-dialog__actions">
                <view class="agreement-dialog__action agreement-dialog__action--cancel" @click="$emit('cancel')">
                    {{ content.cancelText }}
                </view>
                <view class="agreement-dialog__action agreement-dialog__action--confirm" @click="$emit('confirm')">
                    {{ content.confirmText }}
                </view>
            </view>
        </view>
    </view>
</template>

<script>
const DEFAULT_CONTENT = {
    title: "用户协议及隐私协议",
    prefix: "需阅读并同意",
    joiner: "\n& ",
    cancelText: "取消",
    confirmText: "同意并继续",
};

const DEFAULT_LINKS = [
    {
        label: "《用户协议》",
        url: "/bundle/pages/server_explan/server_explan?type=0",
    },
    {
        label: "《隐私条款》",
        url: "/bundle/pages/server_explan/server_explan?type=1",
    },
];

export default {
    name: "agreement-confirm-dialog",
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        content: {
            type: Object,
            default: () => DEFAULT_CONTENT,
        },
        agreementLinks: {
            type: Array,
            default: () => DEFAULT_LINKS,
        },
    },
    methods: {
        stopEvent() {},
    },
};
</script>

<style lang="scss">
.agreement-dialog {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1200;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 54rpx;
    box-sizing: border-box;
}

.agreement-dialog__mask {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(29, 35, 49, 0.28);
}

.agreement-dialog__panel {
    position: relative;
    z-index: 1;
    width: 100%;
    border-radius: 24rpx;
    background: rgba(255, 255, 255, 0.98);
    overflow: hidden;
}

.agreement-dialog__body {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 56rpx 42rpx 48rpx;
    text-align: center;
}

.agreement-dialog__title {
    color: #1b1d21;
    font-size: 36rpx;
    font-weight: 700;
    line-height: 1.3;
}

.agreement-dialog__copy {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
    margin-top: 68rpx;
}

.agreement-dialog__text {
    color: #7f848d;
    font-size: 28rpx;
    line-height: 1.6;
    white-space: pre-line;
}

.agreement-dialog__link {
    color: #244392;
    font-size: 28rpx;
    font-weight: 500;
    line-height: 1.6;
}

.agreement-dialog__actions {
    display: flex;
    align-items: center;
    border-top: 2rpx solid #eceef2;
}

.agreement-dialog__action {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 112rpx;
    font-size: 32rpx;
    font-weight: 600;
    line-height: 1;
}

.agreement-dialog__action--cancel {
    color: #1b1d21;
}

.agreement-dialog__action--confirm {
    color: #244392;
    border-left: 2rpx solid #eceef2;
}
</style>
