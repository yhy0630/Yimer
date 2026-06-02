<template>
    <view class="login-page">
        <image class="login-page__bg" :src="pageAssets.background" mode="aspectFill"></image>
        <view class="login-page__content">
            <view class="login-page__hero">
                <view class="login-page__hero-mark"></view>
                <view class="login-page__hero-copy">
                    <text class="login-page__hero-title">{{ pageContent.heroTitle }}</text>
                    <text class="login-page__hero-subtitle">{{ heroSubtitle }}</text>
                </view>
            </view>

            <view class="login-card" :class="{ 'login-card--quick': isQuickLoginMode }">
                <view v-if="isCodeLoginMode">
                    <view class="login-card__header">
                        <text class="login-card__title">{{ pageContent.cardTitle }}</text>
                        <view class="login-card__title-line"></view>
                    </view>

                    <view class="login-card__field">
                        <text class="login-card__label">{{ pageContent.phoneLabel }}</text>
                        <view class="login-card__input-shell">
                            <input
                                v-model="telephone"
                                class="login-card__input"
                                type="number"
                                maxlength="11"
                                :placeholder="pageContent.placeholder"
                                placeholder-class="login-card__placeholder"
                            />
                        </view>
                    </view>

                    <view class="login-card__field login-card__field--code">
                        <text class="login-card__label">{{ pageContent.codeLabel }}</text>
                        <view class="login-card__input-shell login-card__input-shell--split">
                            <input
                                v-model="smsCode"
                                class="login-card__input login-card__input--code"
                                type="number"
                                maxlength="6"
                                :placeholder="pageContent.placeholder"
                                placeholder-class="login-card__placeholder"
                            />
                            <view class="login-card__divider"></view>
                            <view class="login-card__code-action" @click="$sendSms">
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
                </view>

                <view v-else class="login-card__quick-panel">
                    <text class="login-card__carrier">{{ pageContent.quickLoginCarrier }}</text>
                    <text class="login-card__phone">{{ maskedPhoneNumber }}</text>
                </view>

                <button class="login-card__submit" :class="{ 'login-card__submit--quick': isQuickLoginMode }" @click="handlePrimaryAction">
                    {{ pageContent.submitText }}
                </button>

                <view class="login-card__quick-entry" @click="toggleLoginMode">
                    <view class="login-card__quick-line"></view>
                    <text class="login-card__quick-text">{{ switchLoginText }}</text>
                    <view class="login-card__quick-line"></view>
                </view>
            </view>

            <view class="login-page__agreement" @click="toggleAgreement">
                <view
                    class="login-page__agreement-icon"
                    :class="{ 'login-page__agreement-icon--active': agreePolicy }"
                >
                    <text>{{ agreePolicy ? '✓' : '' }}</text>
                </view>
                <view class="login-page__agreement-copy">
                    <text class="login-page__agreement-text">{{ pageContent.agreementPrefix }}</text>
                    <navigator
                        class="login-page__agreement-link"
                        hover-class="none"
                        :url="agreementLinks[0].url"
                        @click.stop="stopEvent"
                    >
                        {{ agreementLinks[0].label }}
                    </navigator>
                    <text class="login-page__agreement-text">{{ pageContent.agreementJoiner }}</text>
                    <navigator
                        class="login-page__agreement-link"
                        hover-class="none"
                        :url="agreementLinks[1].url"
                        @click.stop="stopEvent"
                    >
                        {{ agreementLinks[1].label }}
                    </navigator>
                </view>
            </view>

            <view class="login-page__social">
                <view class="login-page__social-head">
                    <view class="login-page__social-line"></view>
                    <text class="login-page__social-title">{{ pageContent.socialTitle }}</text>
                    <view class="login-page__social-line"></view>
                </view>

                <view class="login-page__social-button" @click="handleWechatLogin">
                    <view class="wechat-badge">
                        <view class="wechat-badge__bubble wechat-badge__bubble--large">
                            <view class="wechat-badge__dot wechat-badge__dot--left"></view>
                            <view class="wechat-badge__dot wechat-badge__dot--right"></view>
                        </view>
                        <view class="wechat-badge__bubble wechat-badge__bubble--small">
                            <view class="wechat-badge__dot wechat-badge__dot--left"></view>
                            <view class="wechat-badge__dot wechat-badge__dot--right"></view>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <mplogin-popup
            v-model="showLoginPop"
            :logo="appConfig.shop_login_logo"
            :title="appConfig.website_name"
            @close="closePopup"
            @update="handleSubmitInfo"
        />
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
import { mapMutations, mapGetters } from "vuex";
import { sendSms, smsCodeLogin, opLogin, authLogin, updateUser } from "@/api/app";
import { inputInviteCode } from "@/api/user";
import wechath5 from "@/utils/wechath5";
import { isWeixinClient, currentPage } from "@/utils/tools";
import { SMSType } from "@/utils/type";
import Cache from "@/utils/cache";
import { BACK_URL } from "@/config/cachekey";
import { getWxCode, getUserProfile } from "@/utils/login";

const LOGIN_MODES = {
    CODE: "code",
    QUICK: "quick",
};

const PAGE_ASSETS = {
    background: "/static/images/loginBg.png",
};

const WECHAT_BIND_DEMO_MODE = true;

const PAGE_CONTENT = {
    heroTitle: "Hello!",
    brandName: "伊美尔",
    cardTitle: "登录",
    phoneLabel: "手机号",
    codeLabel: "验证码",
    placeholder: "请输入",
    getCodeText: "获取验证码",
    submitText: "登录",
    quickLoginText: "手机号一键登录",
    codeLoginSwitchText: "使用验证码登录",
    quickLoginCarrier: "中国移动提供认证服务",
    quickLoginPhoneSample: "177****9780",
    agreementPrefix: "我已阅读并同意",
    agreementJoiner: " & ",
    socialTitle: "第三方登录",
    phoneRequiredText: "请填写手机号",
    codeRequiredText: "请填写手机验证码",
    agreementRequiredText: "请先阅读并同意协议",
    invalidPhoneText: "请输入正确的手机号",
    wechatUnsupportedText: "请在微信环境中使用该登录方式",
    quickLoginUnavailableText: "请接入本机号码一键登录能力",
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
    data() {
        return {
            isWeixin: false,
            smsCode: "",
            time: 59,
            canSendSms: true,
            telephone: "",
            showLoginPop: false,
            loginData: null,
            agreePolicy: false,
            showAgreementDialog: false,
            pendingAgreementAction: "",
            loginMode: LOGIN_MODES.QUICK,
            pageAssets: PAGE_ASSETS,
            pageContent: PAGE_CONTENT,
            agreementLinks: AGREEMENT_LINKS,
            agreementDialogContent: AGREEMENT_DIALOG_CONTENT,
        };
    },
    computed: {
        ...mapGetters(["appConfig", "isLogin"]),
        heroSubtitle() {
            const brandName = this.appConfig.website_name || this.pageContent.brandName;
            return `很高兴认识您，欢迎来到${brandName}`;
        },
        isCodeLoginMode() {
            return this.loginMode === LOGIN_MODES.CODE;
        },
        isQuickLoginMode() {
            return this.loginMode === LOGIN_MODES.QUICK;
        },
        switchLoginText() {
            return this.isQuickLoginMode ? this.pageContent.codeLoginSwitchText : this.pageContent.quickLoginText;
        },
        maskedPhoneNumber() {
            if (/^1\d{10}$/.test(this.telephone)) {
                return this.telephone.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2");
            }
            return this.pageContent.quickLoginPhoneSample;
        },
    },
    async onLoad(option) {
        // #ifdef H5
        this.isWeixin = isWeixinClient();
        if (this.isLogin) {
            uni.switchTab({
                url: "/pages/index/index",
            });
            return;
        }
        if (this.isWeixin) {
            const { code } = option;
            if (code) {
                const data = await wechath5.authLogin(code);
                this.loginHandle(data);
            }
        }
        // #endif
    },
    methods: {
        ...mapMutations(["LOGIN"]),
        stopEvent() {},
        toggleLoginMode() {
            this.loginMode = this.isQuickLoginMode ? LOGIN_MODES.CODE : LOGIN_MODES.QUICK;
        },
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
        handlePrimaryAction() {
            if (this.isQuickLoginMode) {
                this.handleQuickLogin();
                return;
            }
            this.loginFun();
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
        async mnpLoginFun() {
            if (!this.validateAgreement("mnpLoginFun")) {
                return;
            }
            const {
                userInfo: { avatarUrl, nickName },
            } = await getUserProfile();
            uni.showLoading({
                title: "登录中...",
                mask: true,
            });
            const wxCode = await getWxCode();
            const { code, data, msg } = await authLogin({
                code: wxCode,
                nickname: nickName,
                headimgurl: avatarUrl,
            });
            if (code == 1) {
                if (data.is_new_user) {
                    uni.hideLoading();
                    this.showLoginPop = true;
                    this.loginData = data;
                } else {
                    this.loginHandle(data);
                }
            } else {
                this.$toast({
                    title: msg,
                });
            }
        },
        async loginFun() {
            if (!this.validateAgreement("loginFun") || !this.validatePhone()) {
                return;
            }
            if (!this.smsCode) {
                this.$toast({
                    title: this.pageContent.codeRequiredText,
                });
                return;
            }
            const res = await smsCodeLogin({
                account: this.telephone,
                code: this.smsCode,
            });
            if (res.code == 1) {
                this.loginHandle(res.data);
            }
        },
        handleQuickLogin() {
            if (!this.validateAgreement("handleQuickLogin")) {
                return;
            }
            this.$toast({
                title: this.pageContent.quickLoginUnavailableText,
            });
        },
        async loginHandle(data) {
            this.LOGIN(data);
            uni.hideLoading();
            const inviteCode = Cache.get("INVITE_CODE");
            if (inviteCode) {
                inputInviteCode({
                    code: inviteCode,
                });
            }
            // #ifdef H5
            location.replace("/mobile" + (Cache.get(BACK_URL) || "/"));
            Cache.remove(BACK_URL);
            // #endif
            // #ifndef H5
            uni.navigateBack({
                success() {
                    const { onLoad, options } = currentPage();
                    onLoad && onLoad(options);
                },
            });
            // #endif
        },
        $sendSms() {
            if (this.canSendSms == false) {
                return;
            }
            if (!this.validateAgreement("$sendSms") || !this.validatePhone()) {
                return;
            }
            sendSms({
                mobile: this.telephone,
                key: SMSType.LOGIN,
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
        async appWxLogin() {
            if (!this.validateAgreement("appWxLogin")) {
                return;
            }
            uni.login({
                provider: "weixin",
                success: (loginRes) => {
                    uni.showLoading({
                        title: "登录中...",
                        mask: true,
                    });
                    const { openid, access_token } = loginRes.authResult;
                    opLogin({
                        openid,
                        access_token,
                    }).then((res) => {
                        uni.hideLoading();
                        if (res.code == 1) {
                            this.loginHandle(res.data);
                        }
                    });
                },
            });
        },
        handleWechatLogin() {
            if (WECHAT_BIND_DEMO_MODE) {
                if (!this.validateAgreement("handleWechatLogin")) {
                    return;
                }
                this.showLoginPop = true;
                return;
            }
            if (!this.validateAgreement("handleWechatLogin")) {
                return;
            }
            // #ifdef MP-WEIXIN
            this.mnpLoginFun();
            // #endif
            // #ifdef APP-PLUS
            this.appWxLogin();
            // #endif
            // #ifdef H5
            if (this.isWeixin) {
                wechath5.getWxUrl();
                return;
            }
            this.$toast({
                title: this.pageContent.wechatUnsupportedText,
            });
            // #endif
        },
        async handleSubmitInfo(e) {
            if (e && e.mode === "bind-mobile") {
                this.$toast({
                    title: "请接入微信登录后的手机号绑定接口",
                });
                return;
            }
            const loginData = this.loginData || {};
            const res = await updateUser(e, loginData.token);
            if (res.code == 1) {
                this.loginHandle(loginData);
            }
        },
        closePopup() {
            this.showLoginPop = false;
        },
    },
};
</script>

<style lang="scss">
page {
    min-height: 100%;
}

.login-page {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
}

.login-page__bg {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
}

.login-page__content {
    position: relative;
    z-index: 2;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding: calc(env(safe-area-inset-top) + 126rpx) 44rpx calc(env(safe-area-inset-bottom) + 60rpx);
    box-sizing: border-box;
}

.login-page__hero {
    display: flex;
    align-items: flex-start;
    padding-left: 4rpx;
}

.login-page__hero-mark {
    width: 8rpx;
    height: 66rpx;
    margin: 22rpx 26rpx 0 0;
    border-radius: 999rpx;
    background: #b8ceff;
}

.login-page__hero-copy {
    display: flex;
    flex-direction: column;
}

.login-page__hero-title {
    color: #173a8f;
    font-size: 64rpx;
    font-weight: 700;
    line-height: 1.08;
    letter-spacing: 1rpx;
}

.login-page__hero-subtitle {
    margin-top: 42rpx;
    color: #8c909a;
    font-size: 30rpx;
    line-height: 1.42;
}

.login-card {
    margin-top: 118rpx;
    padding: 54rpx 50rpx 46rpx;
    border-radius: 34rpx;
    background: rgba(255, 255, 255, 0.96);
    box-shadow: 0 18rpx 56rpx rgba(145, 168, 220, 0.14);
}

.login-card--quick {
    padding-top: 76rpx;
    padding-bottom: 50rpx;
}

.login-card__header {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.login-card__title {
    color: #1d1f24;
    font-size: 62rpx;
    font-weight: 700;
    line-height: 1.16;
}

.login-card__title-line {
    width: 38rpx;
    height: 10rpx;
    margin-top: 22rpx;
    border-radius: 999rpx;
    background: #264291;
}

.login-card__field {
    margin-top: 56rpx;
}

.login-card__quick-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    min-height: 420rpx;
    padding: 78rpx 0 12rpx;
    text-align: center;
}

.login-card__carrier {
    color: #90949c;
    font-size: 30rpx;
    line-height: 1.35;
}

.login-card__phone {
    margin-top: 90rpx;
    color: #1b1d21;
    font-size: 84rpx;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 2rpx;
}

.login-card__label {
    display: block;
    color: #30343d;
    font-size: 30rpx;
    font-weight: 500;
    line-height: 1.3;
}

.login-card__input-shell {
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

.login-card__input-shell--split {
    padding-right: 0;
}

.login-card__input {
    flex: 1;
    min-width: 0;
    height: 92rpx;
    color: #30343d;
    font-size: 28rpx;
}

.login-card__placeholder {
    color: #a7acb7;
    font-size: 28rpx;
}

.login-card__input--code {
    padding-right: 24rpx;
}

.login-card__divider {
    width: 2rpx;
    height: 42rpx;
    background: #eceef3;
}

.login-card__code-action {
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

.login-card__submit {
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

.login-card__submit::after {
    border: none;
}

.login-card__submit--quick {
    margin-top: 24rpx;
}

.login-card__quick-entry {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 48rpx;
}

.login-card__quick-line {
    width: 112rpx;
    height: 2rpx;
    background: #edf0f4;
}

.login-card__quick-text {
    margin: 0 24rpx;
    color: #22252c;
    font-size: 30rpx;
    font-weight: 500;
    line-height: 1.3;
}

.login-page__agreement {
    display: flex;
    align-items: center;
    margin-top: 52rpx;
    padding-left: 76rpx;
    padding-right: 20rpx;
}

.login-page__agreement-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34rpx;
    height: 34rpx;
    margin-right: 18rpx;
    border: 2rpx solid #bfc7d5;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.92);
    color: transparent;
    font-size: 22rpx;
    font-weight: 700;
    line-height: 1;
    flex-shrink: 0;
    transition: all 0.2s ease;
}

.login-page__agreement-icon--active {
    border-color: #244392;
    background: #244392;
    color: #ffffff;
}

.login-page__agreement-copy {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    min-width: 0;
}

.login-page__agreement-text {
    color: #90949c;
    font-size: 26rpx;
    line-height: 1.5;
}

.login-page__agreement-link {
    color: #244392;
    font-size: 26rpx;
    font-weight: 500;
    line-height: 1.5;
}

.login-page__social {
    margin-top: auto;
    padding: 0 36rpx 20rpx;
}

.login-page__social-head {
    display: flex;
    align-items: center;
    justify-content: center;
}

.login-page__social-line {
    flex: 1;
    height: 2rpx;
    background: rgba(204, 211, 223, 0.72);
}

.login-page__social-title {
    margin: 0 36rpx;
    color: #8f949d;
    font-size: 28rpx;
    line-height: 1.3;
}

.login-page__social-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 110rpx;
    height: 110rpx;
    margin: 58rpx auto 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 12rpx 38rpx rgba(148, 170, 219, 0.12);
}

.wechat-badge {
    position: relative;
    width: 62rpx;
    height: 54rpx;
}

.wechat-badge__bubble {
    position: absolute;
    border-radius: 50%;
    background: #59c509;
}

.wechat-badge__bubble::after {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
}

.wechat-badge__bubble--large {
    top: 2rpx;
    left: 0;
    width: 42rpx;
    height: 42rpx;
}

.wechat-badge__bubble--large::after {
    left: 8rpx;
    bottom: -8rpx;
    border-width: 8rpx 8rpx 0 0;
    border-color: #59c509 transparent transparent transparent;
}

.wechat-badge__bubble--small {
    right: 0;
    bottom: 0;
    width: 34rpx;
    height: 34rpx;
}

.wechat-badge__bubble--small::after {
    right: 8rpx;
    bottom: -7rpx;
    border-width: 7rpx 7rpx 0 0;
    border-color: #59c509 transparent transparent transparent;
}

.wechat-badge__dot {
    position: absolute;
    top: 12rpx;
    width: 6rpx;
    height: 6rpx;
    border-radius: 50%;
    background: #ffffff;
}

.wechat-badge__bubble--small .wechat-badge__dot {
    top: 9rpx;
    width: 5rpx;
    height: 5rpx;
}

.wechat-badge__dot--left {
    left: 12rpx;
}

.wechat-badge__dot--right {
    right: 12rpx;
}

.wechat-badge__bubble--small .wechat-badge__dot--left {
    left: 9rpx;
}

.wechat-badge__bubble--small .wechat-badge__dot--right {
    right: 9rpx;
}
</style>
