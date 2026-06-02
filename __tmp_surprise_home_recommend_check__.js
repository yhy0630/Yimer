import FriendList from '@/components/friend-list/friend-list.vue'
import HomeRecommendSection from '@/components/home/HomeRecommendSection/HomeRecommendSection.vue'
import {
	DEFAULT_CAMPUS,
	formatCampusLocation
} from '@/config/campus'

const getStatusBarHeight = () => {
	try {
		const { statusBarHeight = 20 } = uni.getSystemInfoSync()
		return statusBarHeight
	} catch (error) {
		return 20
	}
}

const SELECTED_CATEGORIES = [
	{ id: 'skin', label: '皮肤管理' },
	{ id: 'repair', label: '补水修护' },
	{ id: 'bright', label: '美白淡斑' },
	{ id: 'antiage', label: '抗衰紧致' },
	{ id: 'inject', label: '注射微整' }
]

const SELECTED_SORT_TABS = [
	{ id: 'default', label: '综合' },
	{ id: 'sales', label: '销量' },
	{ id: 'heat', label: '热度' },
	{ id: 'price', label: '价格' }
]

const SELECTED_GOODS = [
	{
		id: 101,
		categoryId: 'skin',
		name: '年度医美计划',
		image: '/static/linshi/01.png',
		price: 699,
		marketPrice: 6990,
		ratingText: '100%好评率',
		recommendText: '1w+推荐',
		salesSum: 388,
		heat: 92,
		tags: ['皮肤管理', '年度计划']
	},
	{
		id: 102,
		categoryId: 'skin',
		name: '水光亮肤年卡',
		image: '/static/linshi/02.png',
		price: 799,
		marketPrice: 7590,
		ratingText: '98%好评率',
		recommendText: '9k+推荐',
		salesSum: 356,
		heat: 90,
		tags: ['水光亮肤', '年卡']
	},
	{
		id: 103,
		categoryId: 'repair',
		name: '补水修护护理',
		image: '/static/linshi/03.png',
		price: 699,
		marketPrice: 6990,
		ratingText: '99%好评率',
		recommendText: '8k+推荐',
		salesSum: 268,
		heat: 88,
		tags: ['补水修护', '舒缓维稳']
	},
	{
		id: 104,
		categoryId: 'bright',
		name: '焕亮透白计划',
		image: '/static/linshi/04.png',
		price: 899,
		marketPrice: 8990,
		ratingText: '97%好评率',
		recommendText: '1.1w+推荐',
		salesSum: 312,
		heat: 91,
		tags: ['焕亮透白', '淡化暗沉']
	},
	{
		id: 105,
		categoryId: 'antiage',
		name: '胶原紧致管理',
		image: '/static/linshi/05.png',
		price: 999,
		marketPrice: 9990,
		ratingText: '98%好评率',
		recommendText: '7k+推荐',
		salesSum: 226,
		heat: 89,
		tags: ['抗衰紧致', '胶原提升']
	},
	{
		id: 106,
		categoryId: 'inject',
		name: '面部精修方案',
		image: '/static/linshi/02.png',
		price: 1280,
		marketPrice: 12800,
		ratingText: '96%好评率',
		recommendText: '6k+推荐',
		salesSum: 184,
		heat: 86,
		tags: ['注射微整', '面部轮廓']
	}
]

const SELECTED_HERO = {
	noticeTitle: '我的人生“夏”一下',
	title: '我的人生“夏”一下',
	date: '8.15-8.31',
	copy: '转场入夏 捕捉夏日实况\n预定制作专属旅行收纳袋',
	image: '/static/linshi/01.png'
}

const STAR_PRODUCTS = [
	{
		id: 'star-serum',
		theme: 'blue',
		eyebrow: '初见礼遇',
		title: '水光美白',
		desc: '焕亮肌肤 水润透亮',
		tags: ['水光亮白精华'],
		image: '/static/linshi/05.png'
	},
	{
		id: 'star-cream',
		theme: 'gold',
		eyebrow: '初见礼遇',
		title: '水光美白',
		desc: '深层补水 透亮年轻',
		tags: ['深层补水', '提亮肤色', '紧致精华'],
		image: '/static/linshi/03.png'
	}
]

export default {
	components: {
		FriendList,
		HomeRecommendSection
	},
	data() {
		return {
			statusBarHeight: getStatusBarHeight(),
			activeTopTab: 0,
			topTabs: ['活动', '严选'],
			currentCampus: DEFAULT_CAMPUS,
			selectedLocation: formatCampusLocation(DEFAULT_CAMPUS),
			selectedHero: SELECTED_HERO,
			starProducts: STAR_PRODUCTS,
			selectedCategories: SELECTED_CATEGORIES,
			selectedCategoryId: SELECTED_CATEGORIES[0].id,
			selectedSortTabs: SELECTED_SORT_TABS,
			selectedSortId: 'default',
			selectedGoods: SELECTED_GOODS,
			hero: {
				titleLines: ['一杯美式，', '就是春天的美事啊。'],
				subtitle: '让生活的小确幸，',
				subtitleSecond: '在平凡日常里悄悄发光。'
			},
			activities: [
				{
					id: 1,
					title: '制“燥”惊喜 | 积分福利月月抽',
					date: '4月13日 星期一',
					signupText: '145人报名',
					status: '报名中',
					thumbTheme: 'theme-sky'
				},
				{
					id: 2,
					title: '春日特辑 | 承包您和朋友们的下午茶',
					date: '4月13日 星期一',
					signupText: '145人报名',
					status: '报名中',
					thumbTheme: 'theme-flower'
				},
				{
					id: 3,
					title: '福利合伙人 | 马选齿科儿童口腔游园会',
					date: '4月13日 星期一',
					signupText: '145人报名',
					status: '报名中',
					thumbTheme: 'theme-window'
				}
			],
			communityPosts: [
				{
					id: 1,
					author: '李富贵',
					avatar: '/static/linshi/02.png',
					memberText: '美学体验官',
					date: '2026-05-29',
					content: '发量真的是得靠养，最近认真护理之后状态稳定了很多。#头皮养护日记#',
					images: ['/static/linshi/01.png'],
					sourceText: '社区 · 来自 伊美尔美学家社区',
					views: 128,
					comments: 16,
					likes: 45,
					liked: true
				},
				{
					id: 2,
					author: '林间晚风',
					avatar: '/static/linshi/01.png',
					memberText: '蓝卡会员',
					date: '2026-05-27',
					content: '春天总要留一杯咖啡时间，把舒服和松弛感都装进窗边。#春日变美计划#',
					images: ['/static/linshi/02.png', '/static/linshi/05.png'],
					sourceText: '社区 · 来自 伊美尔美学家社区',
					views: 96,
					comments: 12,
					likes: 45,
					liked: false
				},
				{
					id: 3,
					author: '慢慢变好呀',
					avatar: '/static/linshi/02.png',
					memberText: '银卡会员',
					date: '2026-05-24',
					content: '把恢复期认真记录下来以后，反而更能感受到每一天细微的变化。#恢复期打卡#',
					images: ['/static/linshi/03.png', '/static/linshi/04.png', '/static/linshi/01.png', '/static/linshi/05.png'],
					sourceText: '社区 · 来自 伊美尔美学家社区',
					views: 182,
					comments: 28,
					likes: 63,
					liked: false
				}
			]
		}
	},
	computed: {
		strictGoodsList() {
			const filteredList = this.selectedGoods.filter(item => item.categoryId === this.selectedCategoryId)
			const list = filteredList.length ? filteredList.slice() : this.selectedGoods.slice()

			if (this.selectedSortId === 'sales') {
				return list.sort((first, second) => second.salesSum - first.salesSum)
			}

			if (this.selectedSortId === 'heat') {
				return list.sort((first, second) => second.heat - first.heat)
			}

			if (this.selectedSortId === 'price') {
				return list.sort((first, second) => first.price - second.price)
			}

			return list
		},
		strictRecommendList() {
			return this.strictGoodsList.map(item => ({
				id: item.id,
				image: item.image,
				tags: item.tags || ['水光抗衰', '水光焕亮'],
				title: item.title || item.name,
				price: item.price
			}))
		}
	},
	methods: {
		setActiveTopTab(index) {
			this.activeTopTab = index
		},
		openSurpriseActivityMore() {
			uni.navigateTo({
				url: `/bundle_surprise/pages/activity_more/activity_more?categoryId=${this.selectedCategoryId}`
			})
		},
		openCampusSelector() {
			uni.navigateTo({
				url: `/bundle/pages/campus/campus?mode=select&source=surprise&currentCampusId=${this.currentCampus.id}`,
				success: (res) => {
					res.eventChannel.on('campusSelected', ({ campus }) => {
						this.currentCampus = campus
						this.selectedLocation = formatCampusLocation(campus)
					})
				}
			})
		},
		showNotice(title) {
			uni.showToast({
				title,
				icon: 'none'
			})
		},
		handleStrictGoodSelect(item) {
			this.showNotice(item.title || item.name || '查看商品')
		},
		openCommunityPost(post) {
			if (!post || !post.id) {
				return
			}

			uni.navigateTo({
				url: `/bundle/pages/moment/detail?id=${post.id}&entry=moment&source=surprise`
			})
		},
		openCommunityTopicDetail(topic) {
			const title = this.normalizeTopicTitle(topic)

			if (!title) {
				return
			}

			const topicId = topic && topic.id ? topic.id : ''
			const query = topicId
				? `id=${topicId}&title=${encodeURIComponent(title)}`
				: `title=${encodeURIComponent(title)}`

			uni.navigateTo({
				url: `/bundle/pages/topic/detail?${query}`
			})
		},
		normalizeTopicTitle(topic) {
			if (!topic) {
				return ''
			}

			const rawTitle = typeof topic === 'string' ? topic : topic.title || ''
			return rawTitle.replace(/^#+|#+$/g, '').trim()
		}
	}
}
