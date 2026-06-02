<template>
    <view class="protocol-page">
        <u-navbar
            :is-back="true"
            :custom-back="goBack"
            :border-bottom="false"
            :background="navbarBackground"
            back-icon-color="#202226"
            back-icon-size="52"
            title=" "
        />

        <view class="protocol-page__body">
            <text class="protocol-page__title">{{ currentProtocol.title }}</text>
            <view class="protocol-page__content">
                <u-parse
                    :html="currentProtocol.html"
                    :tag-style="tagStyle"
                    selectable
                    :show-with-animation="true"
                />
            </view>
        </view>
    </view>
</template>

<script>
const USER_AGREEMENT_HTML = `
    <p>欢迎您使用平台提供的产品与服务。请您在注册、登录或使用平台服务前，认真阅读并充分理解本协议的全部内容。</p>
    <p>当您勾选同意、点击确认注册、完成登录，或以其他方式实际使用平台服务时，即视为您已经阅读、理解并接受本协议全部条款，并愿意受其约束。</p>
    <p><strong>一、账号使用</strong></p>
    <ul>
        <li>您应当保证注册信息真实、准确、完整，并及时更新相关资料。</li>
        <li>您应妥善保管账号、密码及验证码等信息，并对账号下的全部操作承担责任。</li>
        <li>未经平台书面许可，您不得出租、出借、转让或售卖账号。</li>
    </ul>
    <p><strong>二、服务规范</strong></p>
    <ul>
        <li>您在使用平台服务时，应遵守国家法律法规、公序良俗及平台发布的各项规则。</li>
        <li>您不得利用平台从事违法违规活动，不得发布虚假、误导、侵权或其他不当内容。</li>
        <li>若平台发现您存在异常使用、违规操作或其他风险行为，有权采取限制、暂停或终止服务等措施。</li>
    </ul>
    <p><strong>三、知识产权</strong></p>
    <ul>
        <li>平台依法享有平台页面、技术方案、界面设计、商标标识及相关内容的知识产权。</li>
        <li>未经平台或权利人许可，任何单位或个人不得擅自复制、传播、修改、反向工程或用于其他商业用途。</li>
    </ul>
    <p><strong>四、免责声明</strong></p>
    <ul>
        <li>平台将尽最大努力保障服务的稳定与安全，但不对因网络、系统维护、不可抗力等原因导致的服务中断承担责任。</li>
        <li>因您自身原因造成的账号丢失、信息泄露、操作失误或第三方侵权损失，由您自行承担。</li>
    </ul>
    <p><strong>五、协议变更</strong></p>
    <p>平台可根据业务发展、法律法规或监管要求，对本协议内容进行调整。变更后的协议一经发布即生效；如您继续使用平台服务，视为接受更新后的协议内容。</p>
`;

const PRIVACY_POLICY_HTML = `
    <p>平台深知个人信息对您的重要性，并将按照合法、正当、必要和诚信原则处理您的个人信息。请您在使用服务前认真阅读本条款。</p>
    <p><strong>一、我们收集的信息</strong></p>
    <ul>
        <li>当您注册、登录或使用平台服务时，我们可能收集您的手机号、昵称、头像等基础信息。</li>
        <li>为保障服务正常运行，我们可能收集设备标识、日志信息、网络状态、系统版本等必要信息。</li>
        <li>在您授权的情况下，我们可能申请相机、相册、定位、消息通知等权限，用于完成对应功能。</li>
    </ul>
    <p><strong>二、信息使用方式</strong></p>
    <ul>
        <li>用于账号注册、身份识别、安全验证、客户服务及服务通知。</li>
        <li>用于优化页面展示、分析产品使用情况、提升系统稳定性和服务体验。</li>
        <li>用于处理您主动发起的咨询、售后、投诉、活动参与等业务请求。</li>
    </ul>
    <p><strong>三、信息共享与披露</strong></p>
    <ul>
        <li>未经您的明确同意，我们不会向无关第三方出售您的个人信息。</li>
        <li>在法律法规要求、司法机关或行政机关依法要求的情形下，我们可能依法披露您的相关信息。</li>
        <li>为实现特定功能，部分服务可能由合作方提供，我们会要求其按照法律法规和约定保护您的信息安全。</li>
    </ul>
    <p><strong>四、信息存储与保护</strong></p>
    <ul>
        <li>我们会采取访问控制、数据加密、权限隔离等合理措施保护您的个人信息安全。</li>
        <li>仅在实现服务目的所必需的期限内保留您的个人信息，法律法规另有规定的除外。</li>
    </ul>
    <p><strong>五、您的权利</strong></p>
    <ul>
        <li>您有权查询、更正、删除您的个人信息，并可根据平台规则申请注销账号。</li>
        <li>您有权撤回已授权的权限，但撤回后可能导致部分功能无法继续使用。</li>
    </ul>
    <p>如您继续使用平台服务，即表示您已知悉并同意本隐私条款的相关内容。</p>
`;

const SIGN_AUTHORIZATION_HTML = `
    <div style="color: #8f8f94;">
        <p style="margin: 0 0 24px; font-size: 18px; line-height: 1.9;">乙方申请入驻平台，需同时满足以下条件：</p>
        <ul style="margin: 0; padding-left: 1.4em;">
            <li>具有合法的经营主体资格，若为企业，需持有有效的营业执照、税务登记证、组织机构代码证（已完成“三证合一”的仅需提供营业执照）；若为个体工商户，需持有有效的营业执照及经营者身份证；若为个人卖家，需持有有效的身份证及相关经营资质证明（如涉及特殊行业需提供行业许可证书）。</li>
            <li>拥有符合国家法律法规及平台规则要求的经营项目，所售商品/提供的服务质量合格，不违反国家禁止性规定，不侵犯他人的商标权、专利权、著作权等知识产权及其他合法权益。</li>
            <li>同意并遵守甲方平台的各项规则、制度（包括但不限于《平台商家管理规范》《平台交易规则》《售后服务标准》等，以下统称“平台规则”），愿意接受甲方的监督与管理。</li>
            <li>乙方承诺提交的全部资料真实、完整、有效；如资料发生变更，应及时向甲方更新，否则由此产生的风险和责任由乙方自行承担。</li>
            <li>乙方确认已充分阅读、理解并同意本授权协议内容，自愿接受本协议及平台规则的约束。</li>
        </ul>
    </div>
`;

const PROTOCOL_MAP = {
    0: {
        title: "用户授权协议",
        html: USER_AGREEMENT_HTML,
    },
    1: {
        title: "隐私条款",
        html: PRIVACY_POLICY_HTML,
    },
    2: {
        title: "签字授权协议",
        html: SIGN_AUTHORIZATION_HTML,
    },
};

const DEFAULT_PROTOCOL_TYPE = 0;
const PROTOCOL_TYPE_ALIASES = {
    user: 0,
    "user-agreement": 0,
    privacy: 1,
    "privacy-policy": 1,
    "sign-auth": 2,
    "signature-authorization": 2,
};

const NAVBAR_BACKGROUND = {
    background: "#ffffff",
};

const TAG_STYLE = {
    body: "color: #8f8f94; font-size: 16px; line-height: 1.9; word-break: break-word;",
    p: "margin: 0 0 14px; color: #8f8f94; font-size: 16px; line-height: 1.9;",
    div: "color: #8f8f94; font-size: 16px; line-height: 1.9;",
    span: "color: #8f8f94; font-size: 16px; line-height: 1.9;",
    strong: "color: #383a40; font-weight: 700;",
    b: "color: #383a40; font-weight: 700;",
    ul: "margin: 0 0 14px; padding-left: 1.4em;",
    ol: "margin: 0 0 14px; padding-left: 1.4em;",
    li: "margin-bottom: 12px; color: #8f8f94; line-height: 1.9;",
    a: "color: #143080; word-break: break-all;",
};

function normalizeProtocolType(type) {
    if (Object.prototype.hasOwnProperty.call(PROTOCOL_TYPE_ALIASES, type)) {
        return PROTOCOL_TYPE_ALIASES[type];
    }

    const normalizedType = Number(type);
    return Object.prototype.hasOwnProperty.call(PROTOCOL_MAP, normalizedType)
        ? normalizedType
        : DEFAULT_PROTOCOL_TYPE;
}

export default {
    data() {
        return {
            protocolType: DEFAULT_PROTOCOL_TYPE,
            navbarBackground: NAVBAR_BACKGROUND,
            tagStyle: TAG_STYLE,
        };
    },
    computed: {
        currentProtocol() {
            return PROTOCOL_MAP[this.protocolType] || PROTOCOL_MAP[DEFAULT_PROTOCOL_TYPE];
        },
    },
    onLoad(options = {}) {
        this.protocolType = normalizeProtocolType(options.type);
    },
    methods: {
        goBack() {
            const pages = getCurrentPages();
            if (pages.length > 1) {
                uni.navigateBack({
                    delta: 1,
                });
                return;
            }

            uni.reLaunch({
                url: "/pages/login/login",
            });
        },
    },
};
</script>

<style lang="scss">
page {
    background: #ffffff;
}

.protocol-page {
    min-height: 100vh;
    background: #ffffff;
}

.protocol-page__body {
    padding: 78rpx 58rpx calc(env(safe-area-inset-bottom) + 72rpx);
}

.protocol-page__title {
    display: block;
    color: #2f3137;
    font-size: 60rpx;
    font-weight: 700;
    line-height: 1.2;
    text-align: center;
}

.protocol-page__content {
    margin-top: 42rpx;
}
</style>
