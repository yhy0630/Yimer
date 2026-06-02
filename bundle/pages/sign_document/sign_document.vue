<template>
	<view class="sign-document-page">
		<view class="sign-document-page__glow sign-document-page__glow--left"></view>
		<view class="sign-document-page__glow sign-document-page__glow--right"></view>

		<view class="sign-document-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="page-shell sign-document-page__nav">
				<view class="sign-document-page__back" @tap="goBack">
					<u-icon name="arrow-left" size="46" color="#20232b"></u-icon>
				</view>
			</view>

			<scroll-view scroll-x class="page-shell sign-document-page__tabs">
				<view class="sign-document-page__tabs-inner">
					<view
						v-for="document in documents"
						:key="document.key"
						:class="['sign-document-page__tab', activeDocumentKey === document.key ? 'is-active' : '']"
						@tap="switchDocument(document.key)"
					>
						{{ document.tabLabel }}
					</view>
				</view>
			</scroll-view>
		</view>

		<view class="page-shell sign-document-page__body">
			<view class="sign-document-card">
				<u-parse
					v-if="currentDocument"
					:html="currentDocument.html"
					:tag-style="tagStyle"
					:show-with-animation="true"
					selectable
				/>
			</view>
		</view>

		<view class="sign-document-page__footer">
			<view class="page-shell">
				<button
					class="sign-document-page__cta"
					:class="{ 'is-disabled': !canConfirm }"
					:disabled="!canConfirm"
					@tap="handleConfirmSign"
				>
					{{ confirmButtonText }}
				</button>
			</view>
		</view>
	</view>
</template>

<script>
const COUNTDOWN_SECONDS = 3

const TAG_STYLE = {
	body: 'color: #3b312f; font-size: 14px; line-height: 1.75; background: transparent;',
	div: 'box-sizing: border-box;',
	p: 'margin: 0 0 10px; color: #3b312f; font-size: 14px; line-height: 1.75;',
	strong: 'color: #2c2423; font-weight: 700;',
	span: 'color: inherit;',
}

const TREATMENT_RECORD_HTML = `
	<div style="padding: 34rpx 34rpx 46rpx; background: #ffffff; border-radius: 28rpx;">
		<div style="text-align: right;">
			<div style="font-size: 58rpx; line-height: 1.1; color: #4a3734; font-weight: 700;">治疗管理记录</div>
			<div style="margin-top: 18rpx; font-size: 24rpx; color: #6f6664;">日期: __________  咨询师: __________</div>
		</div>
		<div style="display: flex; justify-content: space-between; align-items: center; margin-top: 36rpx; padding: 18rpx 22rpx; background: #54433d; color: #ffffff; font-size: 26rpx;">
			<span>个人信息</span>
			<span>贵宾档案</span>
		</div>
		<div style="margin-top: 28rpx; font-size: 24rpx; color: #4e4441;">
			<p>姓名 __________  性别 _____  生日日期 __________ （   ）岁  联系方式 ____________________</p>
			<p>地址 _________________________________________________________________</p>
			<p>微信号 ____________________  身份证号码 _______________________________</p>
		</div>
		<div style="margin-top: 28rpx;">
			<div style="font-size: 26rpx; color: #3e3533; font-weight: 700;">基本问卷</div>
			<p style="margin-top: 16rpx;">一、是否有过敏史： 有  □   无  □   过敏源头 ____________________</p>
			<p>二、您目前最关注的皮肤问题是：</p>
			<p>□ 痘痘（痤疮）  □ 痘印、痘疤  □ 毛孔粗大  □ 细纹、皱纹  □ 缺水干燥</p>
			<p>□ 色斑、色素  □ 轮廓不清  □ 皮肤暗黄、暗哑  □ 法令纹  □ 敏感或红血丝</p>
			<p>□ 肤色不均  □ T区油脂过剩  □ 粗糙、角质过厚  □ 其他（                  ）</p>
		</div>
		<div style="margin-top: 24rpx;">
			<div style="font-size: 26rpx; color: #3e3533; font-weight: 700;">日常护肤记录</div>
			<p style="margin-top: 16rpx;">三、您的日常护肤流程是：卸妆 / 清洁 / 补水 / 精华 / 眼霜 / 乳液（面霜） / 防晒</p>
			<p>四、您日常会进行防晒吗？ □ 是  □ 否  SPF □30  □50  □100以上  PA □+  □++  □+++</p>
			<p>五、您一周敷面膜的次数是： □1次  □2次  □3次  □隔天  □每天</p>
			<p>六、您使用过哪些类型的面膜：美白 / 补水保湿 / 淡斑 / 紧致 / 收缩毛孔 / 精华营养</p>
			<p>七、您一般选用什么品牌的护理产品 __________________ 使用时间 ______ 效果 __________</p>
		</div>
		<div style="margin-top: 24rpx;">
			<div style="font-size: 26rpx; color: #3e3533; font-weight: 700;">治疗评估</div>
			<p style="margin-top: 16rpx;">八、针对上述皮肤问题您有进行过专业治疗吗？ □ 有  □ 没有</p>
			<p>九、您是否能够接受 1~2 次 / 1 月的治疗疗程呢？ □ 能  □ 目前不能确定</p>
			<p>十、疗程项目、治疗时间、效果如何、最后一次治疗时间：</p>
			<div style="height: 140rpx; margin-top: 10rpx; border-bottom: 2rpx solid #d7cfcb;"></div>
		</div>
		<div style="margin-top: 40rpx; padding-top: 26rpx; border-top: 18rpx solid #f1f0f2; text-align: center;">
			<div style="font-size: 54rpx; font-weight: 700; letter-spacing: 2rpx; color: #232323;">©UNKOWN  @晚點喝可樂.</div>
			<div style="margin-top: 40rpx; font-size: 28rpx; color: #7d7572;">Design Studio</div>
		</div>
	</div>
`

const CONSENT_HTML = `
	<div style="padding: 34rpx 34rpx 46rpx; background: #ffffff; border-radius: 28rpx;">
		<div style="text-align: center;">
			<div style="font-size: 54rpx; line-height: 1.15; color: #43322f; font-weight: 700;">皮肤治疗知情同意书</div>
			<div style="margin-top: 14rpx; font-size: 24rpx; color: #7b7370;">请在签署前完整阅读以下说明</div>
		</div>
		<div style="margin-top: 36rpx; padding: 24rpx 26rpx; border-radius: 20rpx; background: #f8f6f5;">
			<p><strong>适用项目：</strong>光电嫩肤、微针、水光及皮肤综合管理类项目。</p>
			<p><strong>治疗目的：</strong>通过规范治疗改善肤色不均、毛孔粗大、痘印痘坑及皮肤松弛等问题。</p>
		</div>
		<div style="margin-top: 30rpx;">
			<p><strong>一、治疗前须知</strong></p>
			<p>1. 请如实告知医生既往疾病史、药物过敏史、近期治疗史及妊娠情况。</p>
			<p>2. 若近期有暴晒、刷酸、激光、注射或创口未愈合，请主动说明。</p>
			<p>3. 治疗方案将根据您的皮肤状态、恢复周期及安全评估综合制定。</p>
		</div>
		<div style="margin-top: 24rpx;">
			<p><strong>二、治疗风险告知</strong></p>
			<p>1. 治疗后可能出现短暂性红斑、灼热、干痒、结痂、轻度肿胀或色沉。</p>
			<p>2. 个体差异可能导致恢复期延长，极少数情况下可能出现过敏、感染或瘢痕。</p>
			<p>3. 医生已向我说明治疗效果具有个体差异，无法保证一次治疗达到理想结果。</p>
		</div>
		<div style="margin-top: 24rpx;">
			<p><strong>三、治疗后护理</strong></p>
			<p>1. 按要求使用修复及防晒产品，避免暴晒、高温桑拿及刺激性护肤品。</p>
			<p>2. 若出现持续性疼痛、水泡、破溃等异常反应，请及时联系院方复诊。</p>
		</div>
		<div style="margin-top: 30rpx; padding: 26rpx; border-radius: 20rpx; border: 2rpx solid #e8e1dd;">
			<p>本人已阅读并理解以上全部内容，医生已就治疗目的、流程、风险及替代方案进行了充分说明。</p>
			<p style="margin-top: 16rpx;">受术者签名：__________________</p>
			<p>监护人签名：__________________</p>
			<p>签署日期：____________________</p>
		</div>
	</div>
`

const OBSERVATION_HTML = `
	<div style="padding: 34rpx 34rpx 46rpx; background: #ffffff; border-radius: 28rpx;">
		<div style="text-align: center;">
			<div style="font-size: 54rpx; line-height: 1.15; color: #43322f; font-weight: 700;">留观同意书</div>
			<div style="margin-top: 14rpx; font-size: 24rpx; color: #7b7370;">术后观察与离院须知</div>
		</div>
		<div style="margin-top: 34rpx; padding: 26rpx; border-radius: 22rpx; background: linear-gradient(180deg, #faf8f7 0%, #f5f2f1 100%);">
			<p>为确保治疗后的恢复安全，院方建议您在治疗结束后按医嘱进行留观，并在离院前完成当次状态确认。</p>
		</div>
		<div style="margin-top: 28rpx;">
			<p><strong>留观说明</strong></p>
			<p>1. 留观期间请保持通讯畅通，避免自行外出或擅自使用药物。</p>
			<p>2. 如出现头晕、恶心、持续疼痛、局部异常肿胀或其他不适，请立即通知医护人员。</p>
			<p>3. 医护人员会结合您的皮肤反应、生命体征和离院条件进行综合评估。</p>
		</div>
		<div style="margin-top: 24rpx;">
			<p><strong>离院须知</strong></p>
			<p>1. 离院后 24 小时内避免高温环境、剧烈运动和饮酒。</p>
			<p>2. 严格按照护理单要求进行冷敷、保湿、防晒及后续复诊。</p>
			<p>3. 若在居家观察期间出现异常，请第一时间与治疗机构取得联系。</p>
		</div>
		<div style="margin-top: 30rpx; padding: 26rpx; border-radius: 20rpx; border: 2rpx solid #e8e1dd;">
			<p>本人已理解留观目的及离院后注意事项，同意按照院方要求完成观察并配合后续回访。</p>
			<p style="margin-top: 16rpx;">本人签字：__________________</p>
			<p>联系电话：__________________</p>
			<p>观察时间：__________________</p>
		</div>
	</div>
`

const DOCUMENTS = Object.freeze([
	{
		key: 'treatment-record',
		tabLabel: '\u76ae\u80a4\u6cbb\u7597\u8bb0\u5f55\u5355',
		successText: '\u6cbb\u7597\u8bb0\u5f55\u5355\u5df2\u786e\u8ba4',
		html: TREATMENT_RECORD_HTML
	},
	{
		key: 'consent',
		tabLabel: '\u77e5\u60c5\u540c\u610f\u4e66',
		successText: '\u77e5\u60c5\u540c\u610f\u4e66\u5df2\u786e\u8ba4',
		html: CONSENT_HTML
	},
	{
		key: 'observation',
		tabLabel: '\u7559\u89c2\u540c\u610f\u4e66',
		successText: '\u7559\u89c2\u540c\u610f\u4e66\u5df2\u786e\u8ba4',
		html: OBSERVATION_HTML
	}
])

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
			tagStyle: TAG_STYLE,
			documents: DOCUMENTS,
			activeDocumentKey: DOCUMENTS[0].key,
			countdownSeconds: COUNTDOWN_SECONDS,
			countdownTimer: null,
			signedDocumentKeys: []
		}
	},
	computed: {
		currentDocument() {
			return this.documents.find((document) => document.key === this.activeDocumentKey) || this.documents[0]
		},
		canConfirm() {
			return this.countdownSeconds === 0
		},
		confirmButtonText() {
			if (!this.canConfirm) {
				return `\u786e\u8ba4\u5e76\u7b7e\u5b57 (${this.countdownSeconds}s)`
			}

			return '\u786e\u8ba4\u5e76\u7b7e\u5b57'
		}
	},
	onLoad() {
		this.startCountdown()
	},
	onUnload() {
		this.clearCountdown()
	},
	methods: {
		goBack() {
			const pages = getCurrentPages()

			this.clearCountdown()

			if (pages.length > 1) {
				uni.navigateBack({
					delta: 1
				})
				return
			}

			uni.redirectTo({
				url: '/bundle/pages/sign_center/sign_center'
			})
		},
		switchDocument(documentKey) {
			if (this.activeDocumentKey === documentKey) {
				return
			}

			this.activeDocumentKey = documentKey
			this.startCountdown()
		},
		startCountdown() {
			this.clearCountdown()
			this.countdownSeconds = COUNTDOWN_SECONDS

			this.countdownTimer = setInterval(() => {
				if (this.countdownSeconds <= 1) {
					this.countdownSeconds = 0
					this.clearCountdown()
					return
				}

				this.countdownSeconds -= 1
			}, 1000)
		},
		clearCountdown() {
			if (!this.countdownTimer) {
				return
			}

			clearInterval(this.countdownTimer)
			this.countdownTimer = null
		},
		handleConfirmSign() {
			if (!this.canConfirm || !this.currentDocument) {
				return
			}

			uni.navigateTo({
				url: `/bundle/pages/sign_signature/sign_signature?documentKey=${this.currentDocument.key}&documentTitle=${encodeURIComponent(this.currentDocument.tabLabel)}`,
				success: (res) => {
					res.eventChannel.on('signed', ({ documentKey } = {}) => {
						this.handleDocumentSigned(documentKey || this.currentDocument.key)
					})
				}
			})
		},
		handleDocumentSigned(documentKey) {
			const matchedDocument = this.documents.find((document) => document.key === documentKey)

			if (!matchedDocument) {
				return
			}

			const nextSignedDocumentKeys = this.signedDocumentKeys.includes(documentKey)
				? [...this.signedDocumentKeys]
				: [...this.signedDocumentKeys, documentKey]

			this.signedDocumentKeys = nextSignedDocumentKeys

			const nextDocument = this.documents.find((document) => !nextSignedDocumentKeys.includes(document.key))

			if (nextDocument) {
				uni.showToast({
					title: matchedDocument.successText,
					icon: 'none'
				})

				this.activeDocumentKey = nextDocument.key
				this.startCountdown()
				return
			}

			uni.showToast({
				title: '\u5168\u90e8\u6587\u4ef6\u5df2\u786e\u8ba4',
				icon: 'none'
			})
		}
	}
}
</script>

<style scoped lang="scss">
.sign-document-page {
	position: relative;
	min-height: 100vh;
	background:
		radial-gradient(circle at 50% -6%, rgba(221, 227, 244, 0.92) 0, rgba(221, 227, 244, 0.28) 300rpx, rgba(255, 255, 255, 0) 720rpx),
		linear-gradient(180deg, #f8f9fd 0%, #ffffff 360rpx, #ffffff 100%);
}

.sign-document-page__glow {
	position: absolute;
	pointer-events: none;
	border-radius: 50%;
	filter: blur(18rpx);
}

.sign-document-page__glow--left {
	top: -120rpx;
	left: -110rpx;
	width: 360rpx;
	height: 360rpx;
	background: rgba(255, 255, 255, 0.9);
}

.sign-document-page__glow--right {
	top: 140rpx;
	right: -100rpx;
	width: 320rpx;
	height: 240rpx;
	background: rgba(214, 223, 246, 0.44);
}

.sign-document-page__header {
	position: sticky;
	top: 0;
	z-index: 10;
	background: linear-gradient(180deg, rgba(248, 249, 253, 0.98) 0%, rgba(248, 249, 253, 0.94) 100%);
	backdrop-filter: blur(12rpx);
}

.sign-document-page__nav {
	display: flex;
	align-items: center;
	height: 90rpx;
}

.sign-document-page__back {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 80rpx;
	height: 72rpx;
	margin-left: -8rpx;
}

.sign-document-page__tabs {
	padding-bottom: 16rpx;
	white-space: nowrap;
}

.sign-document-page__tabs-inner {
	display: inline-flex;
	align-items: center;
	min-width: 100%;
}

.sign-document-page__tab {
	position: relative;
	flex: none;
	padding: 12rpx 6rpx 24rpx;
	margin-right: 72rpx;
	font-size: 34rpx;
	font-weight: 500;
	line-height: 1;
	color: #9a9eaa;
}

.sign-document-page__tab:last-child {
	margin-right: 0;
}

.sign-document-page__tab.is-active {
	color: #20232b;
	font-weight: 700;
}

.sign-document-page__tab.is-active::after {
	content: '';
	position: absolute;
	left: 50%;
	bottom: 0;
	width: 42rpx;
	height: 6rpx;
	border-radius: 999rpx;
	background: #20232b;
	transform: translateX(-50%);
}

.sign-document-page__body {
	position: relative;
	z-index: 1;
	padding-top: 22rpx;
	padding-bottom: calc(env(safe-area-inset-bottom) + 236rpx);
}

.sign-document-card {
	padding: 22rpx;
	border-radius: 30rpx;
	background: rgba(255, 255, 255, 0.98);
	box-shadow: 0 18rpx 44rpx rgba(32, 41, 72, 0.08);
}

.sign-document-page__footer {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 12;
	padding-top: 18rpx;
	padding-bottom: calc(env(safe-area-inset-bottom) + 24rpx);
	background: rgba(255, 255, 255, 0.98);
	box-shadow: 0 -10rpx 30rpx rgba(32, 41, 72, 0.06);
}

.sign-document-page__cta {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 104rpx;
	border-radius: 999rpx;
	background: #143080;
	font-size: 34rpx;
	font-weight: 600;
	line-height: 1;
	color: #ffffff;
	box-shadow: 0 16rpx 28rpx rgba(20, 48, 128, 0.18);
}

.sign-document-page__cta.is-disabled {
	background: #9ba9cf;
	box-shadow: none;
}
</style>
