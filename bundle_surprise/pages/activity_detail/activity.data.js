export const ACTIVITY_STATUS = Object.freeze({
	OPEN: 'open',
	SIGNED: 'signed',
	CLOSED: 'closed',
	ENDED: 'ended'
})

const SURPRISE_ACTIVITY_LIST = Object.freeze([
	{
		id: 1,
		title: '社群活动 | 合伙人·怒江秘境臻品会员体验',
		date: '12月15日 星期四',
		dateRange: '12月15日 星期四 - 12月15日 星期六',
		timeRange: '13:30-15:30',
		signupText: '145人报名',
		quotaText: '已报名 1/200',
		quotaNote: '正式会员可报名',
		status: '报名中',
		statusTone: 'primary',
		statusKey: ACTIVITY_STATUS.OPEN,
		city: '北京',
		type: '会员专场',
		memberOnly: true,
		pointsCost: 100,
		tags: ['福利合伙人', '美食', '其他'],
		venue: '伊美尔 (光华SoHo)',
		address: '北京市朝阳区光华路光华SoHo2期B座',
		latitude: 39.91671,
		longitude: 116.45802,
		introduction:
			'符合话题要求且认真分享，贴合主题、富有参考价值的优质内容即有机会获得58-200积分盲盒一个，共计300个；现场将同步开放品牌体验、轻食试吃与会员专属交流环节。',
		tips:
			'报名成功后请按活动时间准时到场，名额有限，若临时无法参加请提前联系工作人员释放席位；签到后可参与现场互动抽奖与积分加赠。',
		image: '/static/linshi/01.png',
		heroImage: '/static/linshi/06.png',
		thumbTheme: 'theme-sky'
	},
	{
		id: 2,
		title: '福利合伙人 | brunch春日漫谈局',
		date: '12月18日 星期日',
		dateRange: '12月18日 星期日 - 12月18日 星期日',
		timeRange: '10:30-12:00',
		signupText: '128人报名',
		quotaText: '已报名 88/120',
		quotaNote: '您已完成报名，可按时到场',
		status: '已报名',
		statusTone: 'muted',
		statusKey: ACTIVITY_STATUS.SIGNED,
		city: '上海',
		type: '美食',
		memberOnly: false,
		pointsCost: 0,
		tags: ['福利合伙人', '轻食', '社群'],
		venue: '伊美尔 (静安会客厅)',
		address: '上海市静安区南京西路818号静安会客厅3层',
		latitude: 31.22918,
		longitude: 121.45666,
		introduction:
			'以轻松 brunch 为主题，邀请会员围绕年度疗愈、生活方式与美学消费展开分享，现场准备定制茶点、伴手礼与品牌体验环节，适合带朋友一同参与。',
		tips:
			'您已占位成功，请保留通知信息并提前10分钟到场签到；如需取消，请在活动开始前一天18:00前联系顾问处理。',
		image: '/static/linshi/02.png',
		heroImage: '/static/linshi/03.png',
		thumbTheme: 'theme-flower'
	},
	{
		id: 3,
		title: '会员午后茶叙 | 冬季焕肤私享会',
		date: '12月21日 星期三',
		dateRange: '12月21日 星期三 - 12月21日 星期三',
		timeRange: '14:00-16:30',
		signupText: '200人报名',
		quotaText: '已报名 200/200',
		quotaNote: '当前场次名额已满',
		status: '报名已截止',
		statusTone: 'muted',
		statusKey: ACTIVITY_STATUS.CLOSED,
		city: '北京',
		type: '美学体验',
		memberOnly: true,
		pointsCost: 100,
		tags: ['会员活动', '午后茶叙', '护肤'],
		venue: '伊美尔 (国贸体验中心)',
		address: '北京市朝阳区建国门外大街甲6号中环世贸D座',
		latitude: 39.91464,
		longitude: 116.45551,
		introduction:
			'围绕冬季焕肤护理方案展开主题分享，搭配现场皮肤测试、项目咨询和轻饮茶歇，让会员在轻松环境里了解更适合自己的护理节奏。',
		tips:
			'该活动当前已满额，后续如有释放席位将按候补顺序通知；建议关注惊喜页活动列表，及时报名同主题新场次。',
		image: '/static/linshi/03.png',
		heroImage: '/static/linshi/04.png',
		thumbTheme: 'theme-window'
	},
	{
		id: 4,
		title: '社群活动 | 城市香氛感官展映',
		date: '12月10日 星期六',
		dateRange: '12月10日 星期六 - 12月10日 星期六',
		timeRange: '19:00-21:00',
		signupText: '96人报名',
		quotaText: '已报名 96/120',
		quotaNote: '活动已结束，感谢参与',
		status: '活动结束',
		statusTone: 'muted',
		statusKey: ACTIVITY_STATUS.ENDED,
		city: '成都',
		type: '其他',
		memberOnly: false,
		pointsCost: 0,
		tags: ['城市灵感', '香氛', '观影'],
		venue: '伊美尔 (太古里艺术空间)',
		address: '成都市锦江区中纱帽街8号太古里艺术空间',
		latitude: 30.65264,
		longitude: 104.08386,
		introduction:
			'以城市灵感与香氛体验为线索，结合主题展映与空间漫游，带来沉浸式感官体验；活动中同步设置品牌互动打卡区和限定纪念礼领取环节。',
		tips:
			'活动已圆满结束，后续会根据现场反馈开放返场主题内容；可继续关注惊喜页，获取新一期观影与展映活动通知。',
		image: '/static/linshi/04.png',
		heroImage: '/static/linshi/05.png',
		thumbTheme: 'theme-sky'
	}
])

function cloneActivity(activity) {
	return JSON.parse(JSON.stringify(activity))
}

export function getSurpriseActivityList() {
	return SURPRISE_ACTIVITY_LIST.map((item) => cloneActivity(item))
}

export function getSurpriseActivityById(id) {
	const numericId = Number(id)
	const target = SURPRISE_ACTIVITY_LIST.find((item) => item.id === numericId) || SURPRISE_ACTIVITY_LIST[0]
	return cloneActivity(target)
}
