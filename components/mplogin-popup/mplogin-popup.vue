<template>
    <view v-if="showPop" class="bind-mobile">
        <image class="bind-mobile__bg" :src="pageAssets.background" mode="aspectFill"></image>

        <view class="bind-mobile__content">
            <view class="bind-mobile__hero">
                <view class="bind-mobile__hero-mark"></view>
                <view class="bind-mobile__hero-copy">
                    <text class="bind-mobile__hero-title">{{ pageContent.heroTitle }}</text>
                    <text class="bind-mobile__hero-subtitle">{{ heroSubtitle }}</text>
                </view>
            </view>

            <view class="bind-mobile__card">
                <view class="bind-mobile__header">
                    <text class="bind-mobile__title">{{ pageContent.cardTitle }}</text>
                    <view class="bind-mobile__title-line"></view>
                </view>

                <view class="bind-mobile__field">
                    <text class="bind-mobile__label">{{ pageContent.phoneLabel }}</text>
                    <view class="bind-mobile__input-shell">
                        <input
                            v-model="telephone"
                            class="bind-mobile__input"
                            type="number"
                            maxlength="11"
                            :placeholder="pageContent.placeholder"
                            placeholder-class="bind-mobile__placeholder"
                        />
                    </view>
                </view>

                <view class="bind-mobile__field bind-mobile__field--code">
                    <text class="bind-mobile__label">{{ pageContent.codeLabel }}</text>
                    <view class="bind-mobile__input-shell bind-mobile__input-shell--split">
                        <input
                            v-model="smsCode"
                            class="bind-mobile__input bind-mobile__input--code"
                            type="number"
                            maxlength="6"
                            :placeholder="pageContent.placeholder"
                            placeholder-class="bind-mobile__placeholder"
                        />
                        <view class="bind-mobile__divider"></view>
                        <view class="bind-mobile__code-action" @click="sendBindSms">
                            <text v-show="canSendSms">{{ pageContent.getCodeText }}</text>
                            <u-count-down
                                v-show="!canSendSms"
                                ref="countDown"
                                :show-days="false"
                                :timestamp="time"
                                :showColon="false"
                                separator="zh"
                                color="#143080"
                                separator-color="#143080"
                                :show-hours="false"
                                :show-minutes="false"
                                :autoplay="false"
                                @end="countDownFinish"
                            />
                        </view>
                    </view>
                </view>

                <button class="bind-mobile__submit" @click="handleSubmit">
                    {{ pageContent.submitText }}
                </button>
            </view>

            <view class="bind-mobile__agreement" @click="toggleAgreement">
                <view
                    class="bind-mobile__agreement-icon"
                    :class="{ 'bind-mobile__agreement-icon--active': agreePolicy }"
                >
                    <text>{{ agreePolicy ? "✓" : "" }}</text>
                </view>
                <view class="bind-mobile__agreement-copy">
                    <text class="bind-mobile__agreement-text">{{ pageContent.agreementPrefix }}</text>
                    <navigator
                        class="bind-mobile__agreement-link"
                        hover-class="none"
                        :url="agreementLinks[0].url"
                        @click.stop="stopEvent"
                    >
                        {{ agreementLinks[0].label }}
                    </navigator>
                    <text class="bind-mobile__agreement-text">{{ pageContent.agreementJoiner }}</text>
                    <navigator
                        class="bind-mobile__agreement-link"
                        hover-class="none"
                        :url="agreementLinks[1].url"
                        @click.stop="stopEvent"
                    >
                        {{ agreementLinks[1].label }}
                    </navigator>
                </view>
            </view>
        </view>
        <agreement-confirm-dialog
            :visible="showAgreementDialog"
            :content="agreementDialogContent"
            :agreement-links="agreementLinks"
            @cancel="cancelAgreementDialog"
            @confirm="confirmAgreementDialog"
        />
    </view>
</template>

<script>
import { sendSms } from "@/api/app";
import { SMSType } from "@/utils/type";

const PAGE_ASSETS = {
    background: "/static/images/loginBg.png",
};

const PAGE_CONTENT = {
    heroTitle: "Hello!",
    cardTitle: "绑定手机号",
    phoneLabel: "手机号",
    codeLabel: "验证码",
    placeholder: "请输入",
    getCodeText: "获取验证码",
    submitText: "登录",
    agreementPrefix: "我已阅读并同意",
    agreementJoiner: " & ",
    phoneRequiredText: "请填写手机号",
    codeRequiredText: "请填写手机验证码",
    agreementRequiredText: "请先阅读并同意协议",
    invalidPhoneText: "请输入正确的手机号",
};

const AGREEMENT_LINKS = [
    {
        label: "《用户协议》",
        url: "/bundle/pages/server_explan/server_explan?type=0",
    },
    {
        label: "《隐私条款》",
        url: "/bundle/pages/server_explan/server_explan?type=1",
    },
];

const AGREEMENT_DIALOG_CONTENT = {
    title: "用户协议及隐私协议",
    prefix: "需阅读并同意",
    joiner: "\n& ",
    cancelText: "取消",
    confirmText: "同意并继续",
};

export default {
    name: "mplogin-popup",
    props: {
        logo: {
            type: String,
            default: "",
        },
        value: {
            type: Boolean,
            required: true,
        },
        title: {
            type: String,
            default: "",
        },
    },
    data() {
        return {
            telephone: "",
            smsCode: "",
            time: 59,
            canSendSms: true,
            agreePolicy: false,
            showAgreementDialog: false,
            pendingAgreementAction: "",
            pageAssets: PAGE_ASSETS,
            pageContent: PAGE_CONTENT,
            agreementLinks: AGREEMENT_LINKS,
            agreementDialogContent: AGREEMENT_DIALOG_CONTENT,
        };
    },
    computed: {
        heroSubtitle() {
            const brandName = this.title || "伊美尔";
            return `很高兴认识您，欢迎来到${brandName}`;
        },
        showPop: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit("input", val);
            },
        },
    },
    methods: {
        stopEvent() {},
        toggleAgreement() {
            this.agreePolicy = !this.agreePolicy;
        },
        countDownFinish() {
            this.canSendSms = true;
        },
        cancelAgreementDialog() {
            this.showAgreementDialog = false;
            this.pendingAgreementAction = "";
        },
        confirmAgreementDialog() {
            const actionName = this.pendingAgreementAction;
            this.agreePolicy = true;
            this.showAgreementDialog = false;
            this.pendingAgreementAction = "";
            if (actionName && typeof this[actionName] === "function") {
                this[actionName]();
            }
        },
        validateAgreement(actionName = "") {
            if (this.agreePolicy) {
                return true;
            }
            this.pendingAgreementAction = actionName;
            this.showAgreementDialog = true;
            return false;
        },
        validatePhone() {
            if (!this.telephone) {
                this.$toast({
                    title: this.pageContent.phoneRequiredText,
                });
                return false;
            }
            if (!/^1\d{10}$/.test(this.telephone)) {
                this.$toast({
                    title: this.pageContent.invalidPhoneText,
                });
                return false;
            }
            return true;
        },
        sendBindSms() {
            if (this.canSendSms == false) {
                return;
            }
            if (!this.validateAgreement("sendBindSms") || !this.validatePhone()) {
                return;
            }
            sendSms({
                mobile: this.telephone,
                key: SMSType.BIND,
            }).then((res) => {
                if (res.code == 1) {
                    this.canSendSms = false;
                    this.$refs.countDown.start();
                    this.$toast({
                        title: res.msg,
                    });
                }
            });
        },
        handleSubmit() {
            if (!this.validateAgreement("handleSubmit") || !this.validatePhone()) {
                return;
            }
            if (!this.smsCode) {
                this.$toast({
                    title: this.pageContent.codeRequiredText,
                });
                return;
            }
            this.$emit("update", {
                mode: "bind-mobile",
                mobile: this.telephone,
                code: this.smsCode,
            });
        },
        onClose() {
            this.showPop = false;
            this.$emit("close");
        },
    },
};
</script>

<style lang="scss">
.bind-mobile {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 999;
    overflow: hidden;
}

.bind-mobile__bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.bind-mobile__content {
    position: relative;
    z-index: 2;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding: calc(env(safe-area-inset-top) + 126rpx) 44rpx calc(env(safe-area-inset-bottom) + 60rpx);
    box-sizing: border-box;
}

.bind-mobile__hero {
    display: flex;
    align-items: flex-start;
    padding-left: 4rpx;
}

.bind-mobile__hero-mark {
    width: 8rpx;
    height: 66rpx;
    margin: 22rpx 26rpx 0 0;
    border-radius: 999rpx;
    background: #b8ceff;
}

.bind-mobile__hero-copy {
    display: flex;
    flex-direction: column;
}

.bind-mobile__hero-title {
    color: #173a8f;
    font-size: 64rpx;
    font-weight: 700;
    line-height: 1.08;
    letter-spacing: 1rpx;
}

.bind-mobile__hero-subtitle {
    margin-top: 42rpx;
    color: #8c909a;
    font-size: 30rpx;
    line-height: 1.42;
}

.bind-mobile__card {
    margin-top: 118rpx;
    padding: 54rpx 50rpx 46rpx;
    border-radius: 34rpx;
    background: rgba(255, 255, 255, 0.96);
    box-shadow: 0 18rpx 56rpx rgba(145, 168, 220, 0.14);
}

.bind-mobile__header {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.bind-mobile__title {
    color: #1d1f24;
    font-size: 62rpx;
    font-weight: 700;
    line-height: 1.16;
}

.bind-mobile__title-line {
    width: 38rpx;
    height: 10rpx;
    margin-top: 22rpx;
    border-radius: 999rpx;
    background: #264291;
}

.bind-mobile__field {
    margin-top: 56rpx;
}

.bind-mobile__label {
    display: block;
    color: #30343d;
    font-size: 30rpx;
    font-weight: 500;
    line-height: 1.3;
}

.bind-mobile__input-shell {
    display: flex;
    align-items: center;
    height: 92rpx;
    margin-top: 28rpx;
    padding: 0 40rpx;
    border: 2rpx solid #dde5f2;
    border-radius: 18rpx;
    background: #ffffff;
    box-sizing: border-box;
}

.bind-mobile__input-shell--split {
    padding-right: 0;
}

.bind-mobile__input {
    flex: 1;
    min-width: 0;
    height: 92rpx;
    color: #30343d;
    font-size: 28rpx;
}

.bind-mobile__placeholder {
    color: #a7acb7;
    font-size: 28rpx;
}

.bind-mobile__input--code {
    padding-right: 24rpx;
}

.bind-mobile__divider {
    width: 2rpx;
    height: 42rpx;
    background: #eceef3;
}

.bind-mobile__code-action {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 228rpx;
    height: 92rpx;
    color: #173a8f;
    font-size: 28rpx;
    font-weight: 500;
    flex-shrink: 0;
}

.bind-mobile__submit {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 96rpx;
    margin-top: 58rpx;
    border: 0;
    border-radius: 999rpx;
    background: #243f8f;
    color: #ffffff;
    font-size: 30rpx;
    font-weight: 500;
    line-height: 1;
    box-shadow: none;
}

.bind-mobile__submit::after {
    border: none;
}

.bind-mobile__agreement {
    display: flex;
    align-items: center;
    margin-top: 52rpx;
    padding-left: 76rpx;
    padding-right: 20rpx;
}

.bind-mobile__agreement-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34rpx;
    height: 34rpx;
    margin-right: 18rpx;
    border: 2rpx solid #d9d9d9;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.96);
    color: transparent;
    font-size: 22rpx;
    font-weight: 700;
    line-height: 1;
    flex-shrink: 0;
}

.bind-mobile__agreement-icon--active {
    border-color: #244392;
    background: #244392;
    color: #ffffff;
}

.bind-mobile__agreement-copy {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    min-width: 0;
}

.bind-mobile__agreement-text {
    color: #90949c;
    font-size: 26rpx;
    line-height: 1.5;
}

.bind-mobile__agreement-link {
    color: #244392;
    font-size: 26rpx;
    font-weight: 500;
    line-height: 1.5;
}
</style>
