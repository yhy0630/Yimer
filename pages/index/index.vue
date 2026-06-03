<template>
	<view :class="['home-page', isMomentTab ? 'is-moment-tab' : '', isPlaceTab ? 'is-place-tab' : '']">
		<view :class="['home-nav', isMomentTab ? 'is-moment-tab' : '', isPlaceTab ? 'is-place-tab' : '']"
			:style="{ paddingTop: statusBarHeight + 'px' }">
			<view class="page-shell home-nav__inner">
				<view class="topbar flex row-between">
					<view class="top-tabs flex">
						<view v-for="(item, index) in topTabs" :key="item"
							:class="['top-tab', activeTopTab === index ? 'is-active' : '']"
							@tap="setActiveTopTab(index)">
							{{ item }}
							<image src="/static/images/active.png" class="tab_active" v-if="activeTopTab === index">
							</image>
						</view>
					</view>
					<view class="top-actions flex">
						<view class="action-icon" @tap="goMessageCenter">
							<image src="/static/images/news.png"></image>
						</view>
						<view class="action-icon" @tap="togglePlusMenu">
							<image src="/static/images/add.png"></image>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view
			:class="['page-shell', 'home-shell', isMomentTab ? 'is-moment-tab' : '', isPlaceTab ? 'is-place-tab' : '']">
			<template v-if="isMomentTab">
				<view class="moment-feed">
					<friend-list :list="momentPosts" @select="openMomentDetail" @topic-select="openMomentTopicDetail" />
				</view>
			</template>
			<template v-else-if="isPlaceTab">
				<view class="place-toolbar flex row-between">
					<view class="place-toolbar__city flex row-center" @tap="goCityPage">
						<text class="place-toolbar__city-text">{{ placeCity }}</text>
						<view class="place-toolbar__city-caret"></view>
					</view>
					<view class="place-search flex row-center" @tap="showNotice('搜索')">
						<view class="place-search__icon"></view>
						<view class="place-search__divider"></view>
						<text class="place-search__placeholder">{{ placeSearchPlaceholder }}</text>
					</view>
				</view>

				<view class="place-hero-card">
					<swiper class="place-hero-swiper" :current="placeBannerCurrent" :autoplay="true" :circular="true"
						:interval="4200" :duration="500" :indicator-dots="false" @change="handlePlaceBannerChange">
						<swiper-item v-for="item in placeBanners" :key="item.id">
							<view class="place-hero-slide" @tap="showNotice(item.noticeTitle)">
								<image class="place-hero-image" :src="item.image" mode="aspectFill" />
							</view>
						</swiper-item>
					</swiper>
					<view class="place-hero-dots">
						<view v-for="(item, index) in placeBanners" :key="index"
							:class="['place-hero-dot', placeBannerCurrent === index ? 'is-active' : '']"></view>
					</view>
				</view>

				<view class="place-section-switch flex row-between">
					<view class="place-section-tabs flex">
						<view v-for="(item, index) in placeSections" :key="item.key"
							:class="['place-section-tab', activePlaceSectionIndex === index ? 'is-active' : '']"
							@tap="activePlaceSectionIndex = index">
							{{ item.label }}
						</view>
					</view>
					<view class="place-section-switch__trigger" @tap="showNotice(activePlaceSection.label)">
						<view class="place-section-switch__caret"></view>
					</view>
				</view>

				<view v-if="activePlaceSection.key === 'shop'" class="place-treasure-list">
					<treasure-shop-list :items="activePlaceShopItems" @select="openTreasureShopCard" />
				</view>

				<view v-else class="place-card-list">
					<view v-for="card in activePlaceCards" :key="card.id" class="place-card" @tap="openPlaceCard(card)">
						<image class="place-card__image" :src="card.image" mode="aspectFill" />
						<view class="place-card__body">
							<view class="place-card__title-row flex row-between">
								<text class="place-card__title line-1">{{ card.name }}</text>
								<text class="place-card__distance">{{ card.distance }}</text>
							</view>
							<text class="place-card__meta">{{ card.category }}</text>
							<view class="place-card__address-row flex">
								<image class="place-card__address-icon" src="/static/images/address.png"
									mode="aspectFit"></image>
								<text class="place-card__address line-1">{{ card.address }}</text>
							</view>
							<view class="place-card__tag-list">
								<text v-for="(tag, tagIndex) in card.tags" :key="tagIndex" class="place-card__tag">
									{{ tag }}
								</text>
							</view>
							<text class="place-card__team-title">{{ card.teamTitle }}</text>
							<view class="place-card__team flex row-between">
								<view v-for="doctor in card.doctors" :key="doctor.id" class="place-card__doctor">
									<image class="place-card__doctor-avatar" :src="doctor.avatar" mode="aspectFill" />
									<text class="place-card__doctor-role">{{ doctor.role }}</text>
									<text class="place-card__doctor-name">{{ doctor.name }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</template>
			<template v-else>
				<view class="location-row flex row-between" @tap="goCampusPage()">
					<view class="location-main flex row-center">
						<image src="/static/images/address.png"></image>
						<text class="location-text line-1">{{ currentLocation }}</text>
					</view>
					<view class="location-switch flex row-center">
						<image src="/static/images/qiehuan.png"></image>
						<text class="location-switch-text">切换</text>
					</view>
				</view>

				<view class="hero-card">
					<swiper class="hero-swiper" :current="heroCurrent" :autoplay="true" :circular="true"
						:interval="3500" :duration="500" :indicator-dots="false" @change="handleSwiperChange">
						<swiper-item v-for="item in heroBanners" :key="item.image">
							<view class="hero-slide" @tap="showNotice(item.title)">
								<image class="hero-image" :src="item.image" mode="aspectFill" />
								<view class="hero-mask"></view>
								<view class="hero-content">
									<text class="hero-brand">{{ item.brand }}</text>
									<text class="hero-brand-sub">{{ item.subtitle }}</text>
									<text class="hero-title">{{ item.title }}</text>
								</view>
							</view>
						</swiper-item>
					</swiper>
					<view class="hero-dots">
						<view v-for="(item, index) in heroBanners" :key="index"
							:class="['hero-dot', heroCurrent === index ? 'is-active' : '']"></view>
					</view>
				</view>

				<view class="entry-grid">
					<view v-for="item in quickEntries" :key="item.title" :class="['entry-card', item.theme]"
						@tap="showNotice(item.title)">
						<image class="entry-bg" :src="item.bgImage" mode="aspectFill" />
						<view class="entry-overlay"></view>
						<text class="entry-title">{{ item.title }}</text>
					</view>
				</view>

				<view class="section-head flex row-between">
					<view class="section-head-left flex">
						<view class="section-head-mark"></view>
						<text class="section-title brand-title lg semibold black lh-1">EVERCARE</text>
					</view>
					<text class="text-subtle xs lh-1" @tap="openGuideTour">新手引导</text>
				</view>

				<view class="arrival-card" v-if="0">
					<image src="/static/images/1000.png" class="bgImg"></image>
					<view class="card-content">
						<view class="arrival-card__header flex row-between">
							<text class="arrival-card__title">待到院取号</text>
							<text class="arrival-card__action" @tap="showNotice('查看取号')">查看</text>
						</view>
						<view class="arrival-card__branch flex row-between">
							<view class="campus-name line-1">{{ currentCampus.name }}</view>
							<view class="arrival-card__time flex">
								<u-icon name="clock" size="28" color="#37445f"></u-icon>
								<text class="arrival-card__time-text">18:00</text>
							</view>
						</view>
						<view class="arrival-card__footer flex row-between">
							<text class="arrival-card__manager">客管师：张三</text>
						</view>
					</view>
				</view>

				<view class="category-tabs flex">
					<view v-for="(item, index) in categoryTabs" :key="item"
						:class="['category-tab', activeCategoryIndex === index ? 'is-active' : '']"
						@tap="activeCategoryIndex = index">
						{{ item }}
					</view>
				</view>

				<view class="guide-overview-card">
					<view class="guide-overview-card__header flex row-between">
						<text class="guide-overview-card__summary">{{ activeGuideOverview.summary }}</text>
						<text class="guide-overview-card__stage">{{ activeGuideOverview.stage }}</text>
					</view>
					<view class="guide-overview-card__list">
						<view v-for="item in activeGuideOverview.items" :key="item.label"
							class="guide-overview-card__item flex row-between">
							<text class="guide-overview-card__item-label">{{ item.label }}</text>
							<text class="guide-overview-card__item-value">{{ item.value }}</text>
						</view>
					</view>
					<view class="guide-overview-card__footer flex row-center" @tap="toGuide()">
						<text class="guide-overview-card__footer-text">点击查看详情</text>
						<u-icon name="arrow-right" size="20" color="#323437"></u-icon>
					</view>
				</view>

				<!-- <view class="guide-card">
				<view class="guide-steps">
					<view v-for="(step, index) in activeGuide.steps" :key="step.title" class="guide-step">
						<view v-if="index < activeGuide.steps.length - 1"
							:class="['guide-step-line', step.status === 'current' ? 'is-current' : '']"></view>
						<view :class="['guide-step-circle', 'is-' + step.status]">
							<view>
								{{ step.title }}
							</view>
						</view>
						<text :class="['guide-step-note', 'is-' + step.status]">{{ step.note }}</text>
						<view v-if="index < activeGuide.steps.length - 1"
							:class="['guide-step-clunm-line']"></view>
					</view>
				</view>
				<view class="guide-footer flex row-center" @tap="toGuide(activeGuide.label)">
					<text class="guide-footer-text">点击查看详情</text>
					<u-icon name="arrow-right" size="24" color="#323437" style="margin-top: 4px;"></u-icon>
				</view>
			</view> -->

				<view class="section-block">
					<doctor-intro-section title="名医简介" more-text="了解更多" :doctors="doctorList"
						@more="openDoctorList" @select="handleDoctorSelect" />
				</view>

				<view class="section-block clinic-block">
					<view class="clinic-summary">
						<text class="clinic-name">{{ currentCampus.name }}</text>
						<text class="clinic-address">{{ currentCampus.address }}</text>
					</view>
					<view class="clinic-link" @tap="goCampusPage('detail')">
						<text class="clinic-link-text">查看更多门店</text>
						<u-icon name="arrow-right" size="18" color="#143080"></u-icon>
					</view>

					<view class="store-card" @tap="goCampusDetailPage">
						<image class="store-card__image" :src="currentCampus.image" mode="widthFix"></image>
					</view>
				</view>

				<view class="section-block recommend-block">
					<home-recommend-section title="为您推荐" action-text="查看全部" :items="recommendList"
						@more="showNotice('查看全部项目')" @select="handleRecommendSelect" />
				</view>
			</template>
		</view>

		<view v-if="showPlusMenu" class="plus-menu-overlay" @tap="closePlusMenu"></view>
		<view v-if="showPlusMenu" class="plus-menu" :style="{ top: plusMenuTop + 'px' }" @tap.stop>
			<view class="plus-menu__caret"></view>
			<view v-for="item in plusMenuItems" :key="item.label" class="plus-menu__item flex"
				@tap="handlePlusMenuSelect(item)">
				<u-icon :name="item.icon" size="42" color="#ffffff"></u-icon>
				<text class="plus-menu__label">{{ item.label }}</text>
			</view>
		</view>

		<u-popup v-model="showGuideTour" mode="top" length="100%" :mask="true" :mask-close-able="false"
			:safe-area-inset-bottom="false" :zoom="false" :custom-style="{ background: 'transparent' }"
			:mask-custom-style="{ backgroundColor: 'rgba(0, 0, 0, 0.34)' }" @close="closeGuideTour">
			<view class="guide-tour">
				<view v-if="currentGuideTour.highlight === 'tabs'" class="guide-tour__tabs-focus"
					:style="guideTourTabsFocusStyle">
					<text v-for="(item, index) in topTabs" :key="index"
						:class="['guide-tour__tabs-item', index === activeTopTab ? 'is-active' : '']">
						{{ item }}
					</text>
				</view>

				<view v-if="currentGuideTour.highlight === 'entries'" class="guide-tour__entries-focus"
					:style="guideTourEntriesFocusStyle">
					<view v-for="(item, index) in quickEntries" :key="index" :class="['entry-card', item.theme]">
						<image class="entry-bg" :src="item.bgImage" mode="aspectFill" />
						<view class="entry-overlay"></view>
						<text class="entry-title">{{ item.title }}</text>
					</view>
				</view>

				<view v-if="currentGuideTour.highlight === 'home-tab'" class="guide-tour__home-focus"
					:style="guideTourHomeFocusStyle">
					<image class="guide-tour__home-icon" src="/static/tabbar/home_1.png" mode="aspectFit"></image>
					<text class="guide-tour__home-text">首页</text>
				</view>

				<view
					:class="['guide-tour__panel', 'is-' + currentGuideTour.position, 'has-arrow-' + currentGuideTour.arrow]"
					:style="guideTourPanelStyle">
					<view class="guide-tour__panel-head flex row-between">
						<text class="guide-tour__title">{{ currentGuideTour.title }}</text>
						<view class="guide-tour__close" @tap="closeGuideTour">
							<u-icon name="close" size="26" color="#2a2f3a"></u-icon>
						</view>
					</view>
					<text class="guide-tour__desc">{{ currentGuideTour.description }}</text>
					<view class="guide-tour__footer flex row-between">
						<view class="guide-tour__dots flex">
							<view v-for="(item, index) in guideTourSteps" :key="item.key"
								:class="['guide-tour__dot', index === guideTourStep ? 'is-active' : '']"></view>
						</view>
						<view class="guide-tour__actions flex">
							<view class="guide-tour__button is-secondary" @tap="prevGuideTourStep">
								<text class="guide-tour__button-text is-secondary">上一步</text>
							</view>
							<view class="guide-tour__button is-primary" @tap="nextGuideTourStep">
								<text class="guide-tour__button-text is-primary">下一步</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</u-popup>

		<u-popup v-model="showSplashPopup" mode="center" width="490" :zoom="false" :mask-close-able="true"
			:custom-style="{ background: 'transparent' }"
			:mask-custom-style="{ backgroundColor: 'rgba(0, 0, 0, 0.24)' }" @close="closeSplashPopup">
			<view class="splash-popup__card">
				<image class="splash-popup__image" src="/static/linshi/05.png" mode="widthFix"></image>
				<view class="splash-popup__close" @tap="closeSplashPopup">
					<u-icon name="close" size="27" color="#ffffff"></u-icon>
				</view>
				<view class="splash-popup__button-wrap">
					<view class="splash-popup__button" @tap="handleSplashConfirm">
						<text class="splash-popup__button-text">立即查看</text>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import DoctorIntroSection from '@/components/home/DoctorIntroSection/DoctorIntroSection.vue'
	import FriendList from '@/components/friend-list/friend-list.vue'
	import HomeRecommendSection from '@/components/home/HomeRecommendSection/HomeRecommendSection.vue'
	import TreasureShopList from '@/components/surprise/TreasureShopList/TreasureShopList.vue'
	import {
		DEFAULT_CAMPUS,
		formatCampusLocation
	} from '@/config/campus'
	import {
		DOCTOR_LIST
	} from '@/config/doctor'
	import cache from '@/utils/cache'

	const CURRENT_CITY_KEY = 'CURRENT_CITY'
	const PLACE_SEARCH_PLACEHOLDER = '搜索机构 / 项目 / 医生'

	const getStatusBarHeight = () => {
		try {
			const {
				statusBarHeight = 20
			} = uni.getSystemInfoSync()
			return statusBarHeight
		} catch (error) {
			return 20
		}
	}

	const upxToPx = (value) => {
		try {
			return uni.upx2px(value)
		} catch (error) {
			return value / 2
		}
	}

	const PLACE_DOCTORS = [{
			id: 'chen-linqiao-1',
			name: '陈林乔',
			role: '光电专家',
			avatar: '/static/linshi/02.png'
		},
		{
			id: 'chen-linqiao-2',
			name: '陈林乔',
			role: '光电专家',
			avatar: '/static/linshi/02.png'
		},
		{
			id: 'chen-linqiao-3',
			name: '陈林乔',
			role: '光电专家',
			avatar: '/static/linshi/02.png'
		},
		{
			id: 'chen-linqiao-4',
			name: '陈林乔',
			role: '光电专家',
			avatar: '/static/linshi/02.png'
		}
	]

	const PLACE_BANNERS = [{
			id: 'place-banner-1',
			image: '/static/linshi/03.png',
			noticeTitle: '春日活动'
		},
		{
			id: 'place-banner-2',
			image: '/static/linshi/03.png',
			noticeTitle: '城市精选'
		},
		{
			id: 'place-banner-3',
			image: '/static/linshi/03.png',
			noticeTitle: '宝藏店铺'
		}
	]

	const PLACE_SECTIONS = [{
			key: 'clinic',
			label: '推荐机构',
			cards: [{
					id: 'place-clinic-1',
					campusId: 'guanghua-soho2',
					name: '伊美尔光华 SOHO 门店',
					distance: '1.2km',
					category: '三级甲等 · 综合医院',
					address: '北京市朝阳区光华路 SOHO2',
					image: '/static/linshi/04.png',
					tags: ['皮肤科', '面诊预约', '会员礼遇', '+10 科室'],
					teamTitle: '名师团队',
					doctors: PLACE_DOCTORS
				},
				{
					id: 'place-clinic-2',
					campusId: 'wangjing',
					name: '伊美尔望京院区',
					distance: '1.2km',
					category: '医疗美容 · 综合门诊',
					address: '北京市朝阳区阜通东大街 6 号院',
					image: '/static/linshi/04.png',
					tags: ['轻医美', '皮肤管理', '项目咨询', '+8 服务'],
					teamTitle: '名师团队',
					doctors: PLACE_DOCTORS
				}
			]
		},
		{
			key: 'shop',
			label: '宝藏小店',
			cards: [{
					id: 'place-shop-1',
					campusId: 'guanghua-soho2',
					name: '伊美尔轻肌美学店',
					distance: '1.2km',
					category: '精选服务 · 会员到店',
					address: '北京市朝阳区光华路 SOHO2',
					image: '/static/linshi/04.png',
					tags: ['轻护理', '面诊预约', '会员权益', '+8 服务'],
					teamTitle: '主理团队',
					doctors: PLACE_DOCTORS
				},
				{
					id: 'place-shop-2',
					campusId: 'guomao',
					name: '伊美尔会员礼遇空间',
					distance: '1.2km',
					category: '精选服务 · 美学体验',
					address: '北京市朝阳区建国门外大街 8 号',
					image: '/static/linshi/04.png',
					tags: ['皮肤管理', '注射预约', '疗程咨询', '+6 服务'],
					teamTitle: '主理团队',
					doctors: PLACE_DOCTORS
				}
			]
		}
	]

	export default {
		components: {
			DoctorIntroSection,
			FriendList,
			HomeRecommendSection,
			TreasureShopList
		},
		data() {
			return {
				statusBarHeight: getStatusBarHeight(),
				activeTopTab: 0,
				activeCategoryIndex: 0,
				activePlaceSectionIndex: 0,
				heroCurrent: 0,
				placeBannerCurrent: 0,
				showPlusMenu: false,
				showGuideTour: false,
				showSplashPopup: false,
				guideTourStep: 0,
				topTabs: ['推荐', '此刻', '此地'],
				plusMenuItems: [{
						key: 'scan',
						label: '扫一扫',
						icon: 'scan'
					},
					{
						key: 'moment',
						label: '发此刻',
						icon: 'edit-pen',
						scene: 'moment'
					},
					{
						key: 'place',
						label: '发此地',
						icon: 'home',
						scene: 'place'
					}
				],
				guideTourSteps: [{
						key: 'middle',
						title: '新手引导',
						description: '这里可以快速了解首页的重要入口和常用功能，帮助你更顺畅地浏览内容。',
						position: 'middle',
						highlight: ''
					},
					{
						key: 'bottom',
						title: '新手引导',
						description: '这里可以查看推荐内容和常用入口，也可以继续浏览更完整的服务信息。',
						position: 'bottom',
						highlight: ''
					},
					{
						key: 'top',
						title: '新手引导',
						description: '顶部标签可以在推荐、此刻和此地之间切换，按你的浏览场景快速定位内容。',
						position: 'top',
						highlight: 'tabs'
					}
				],
				currentCampus: DEFAULT_CAMPUS,
				currentLocation: formatCampusLocation(DEFAULT_CAMPUS),
				placeCity: '北京',
				placeSearchPlaceholder: PLACE_SEARCH_PLACEHOLDER,
				placeBanners: PLACE_BANNERS,
				placeSections: PLACE_SECTIONS,
				heroBanners: [{
						brand: 'EVER CARE',
						subtitle: '年度主打企划',
						title: '成人之美',
						image: '/static/linshi/01.png'
					},
					{
						brand: 'EVER CARE',
						subtitle: '自然美学提案',
						title: '光影焕颜',
						image: '/static/linshi/02.png'
					},
					{
						brand: 'EVER CARE',
						subtitle: '面部年轻化计划',
						title: '轮廓新生',
						image: '/static/linshi/03.png'
					}
				],
				quickEntries: [{
						title: '预约挂号',
						bgImage: '/static/images/cate1.png',
						theme: 'theme-cate-1'
					},
					{
						title: '在线缴费',
						bgImage: '/static/images/cate2.png',
						theme: 'theme-cate-2'
					},
					{
						title: '幸运转盘',
						bgImage: '/static/images/cate3.png',
						theme: 'theme-cate-3'
					},
					{
						title: '权益中心',
						bgImage: '/static/images/cate4.png',
						theme: 'theme-cate-4'
					}
				],
				categoryTabs: ['科室A', '科室B', '科室C'],
				guideOverviewCards: [{
						summary: '已到院',
						stage: '挂号',
						items: [{
								label: '待面诊',
								value: '面诊'
							},
							{
								label: '待治疗',
								value: '治疗'
							},
							{
								label: '待离院',
								value: '离院'
							}
						]
					},
					{
						summary: '已建档',
						stage: '建档',
						items: [{
								label: '待检测',
								value: '检测'
							},
							{
								label: '待护理',
								value: '护理'
							},
							{
								label: '待回访',
								value: '离院'
							}
						]
					},
					{
						summary: '已咨询',
						stage: '咨询',
						items: [{
								label: '待方案确认',
								value: '方案'
							},
							{
								label: '待术后观察',
								value: '术后'
							},
							{
								label: '待离院',
								value: '离院'
							}
						]
					}
				],
				serviceGuides: [{
						label: '科室A导诊',
						steps: [{
								title: '挂号',
								subtitle: '已到院',
								note: '已到院',
								status: 'current'
							},
							{
								title: '面诊',
								subtitle: '约面诊',
								note: '沟通方案',
								status: 'pending'
							},
							{
								title: '诊后',
								subtitle: '待评价',
								note: '复诊提醒',
								status: 'pending'
							}
						]
					},
					{
						label: '科室B导诊',
						steps: [{
								title: '建档',
								subtitle: '已提交',
								note: '建立档案',
								status: 'done'
							},
							{
								title: '检测',
								subtitle: '待到诊',
								note: '拍照评估',
								status: 'current'
							},
							{
								title: '护理',
								subtitle: '未开始',
								note: '术后追踪',
								status: 'pending'
							}
						]
					},
					{
						label: '科室C导诊',
						steps: [{
								title: '咨询',
								subtitle: '已预约',
								note: '客服确认',
								status: 'done'
							},
							{
								title: '方案',
								subtitle: '待确认',
								note: '医生建议',
								status: 'current'
							},
							{
								title: '术后',
								subtitle: '未评价',
								note: '服务回访',
								status: 'pending'
							}
						]
					}
				],
				legacyDoctorList: [{
						id: 1,
						name: 'Light医生',
						avatar: '/static/linshi/01.png',
						tags: ['光电专家', '注射微整'],
						description: 'Light 医生从事临床工作十余年，专注面部年轻化、肤质改善和个性化联合治疗方案。'
					},
					{
						id: 2,
						name: 'Ridjk医生',
						avatar: '/static/linshi/02.png',
						tags: ['光电专家', '注射微整', '五官塑形'],
						description: '擅长光电抗衰与轮廓精修，注重自然感和恢复期管理，临床沟通细致稳定。'
					},
					{
						id: 3,
						name: 'Ridjk医生',
						avatar: '/static/linshi/03.png',
						tags: ['皮肤治疗', '抗衰管理', '面部提升'],
						description: '长期聚焦面部抗衰和综合治疗，强调分层设计与术后跟踪，经验覆盖多类复诊场景。'
					}
				],
				doctorList: DOCTOR_LIST,
				momentPosts: [{
						id: 1,
						author: 'Ever Care',
						avatar: '/static/linshi/01.png',
						memberText: '蓝卡会员',
						date: '2026-02-08',
						content: '有幸再次被你刷到，日子慢慢来，做一个干净温柔、闪闪发光的未来精致美少女。伊美尔官方 #变美计划',
						images: [
							'/static/linshi/01.png',
							'/static/linshi/02.png',
							'/static/linshi/03.png',
							'/static/linshi/04.png'
						],
						quote: {
							avatar: '/static/linshi/02.png',
							author: '逆行的森林',
							content: '牛屋这么豪，我缺的是它吗？是缺张去北京的票！'
						},
						sourceText: '社群 · 来自 伊美尔生活大本营社群',
						views: 356,
						comments: 356,
						likes: 56,
						liked: true
					},
					{
						id: 2,
						author: 'Ever Care',
						avatar: '/static/linshi/01.png',
						memberText: '蓝卡会员',
						date: '2026-02-08',
						content: '有幸再次被你刷到，日子慢慢来，做一个干净温柔、闪闪发光的未来精致美少女。伊美尔官方 #变美计划',
						images: [
							'/static/linshi/04.png',
							'/static/linshi/05.png',
							'/static/linshi/02.png',
							'/static/linshi/01.png'
						],
						quote: {
							avatar: '/static/linshi/02.png',
							author: '逆行的森林',
							content: '牛屋这么豪，我缺的是它吗？是缺张去北京的票！'
						},
						sourceText: '社群 · 来自 伊美尔生活大本营社群',
						views: 356,
						comments: 356,
						likes: 56,
						liked: false
					},
					{
						id: 3,
						author: 'Ever Care',
						avatar: '/static/linshi/01.png',
						memberText: '蓝卡会员',
						date: '2026-02-08',
						content: '有幸再次被你刷到，日子慢慢来，做一个干净温柔、闪闪发光的未来精致美少女。伊美尔官方 #变美计划',
						images: ['/static/linshi/05.png'],
						quote: {
							avatar: '/static/linshi/02.png',
							author: '逆行的森林',
							content: '牛屋这么豪，我缺的是它吗？是缺张去北京的票！'
						},
						sourceText: '社群 · 来自 伊美尔生活大本营社群',
						views: 356,
						comments: 356,
						likes: 56,
						liked: false
					}
				],
				recommendList: [{
						id: 1,
						image: '/static/linshi/01.png',
						tags: ['水光抗衰', '水光焕亮'],
						title: '年度变美计划',
						price: 798
					},
					{
						id: 2,
						image: '/static/linshi/02.png',
						tags: ['水光抗衰', '水光焕亮'],
						title: '年度变美计划',
						price: 798
					},
					{
						id: 3,
						image: '/static/linshi/03.png',
						tags: ['水光补水', '肌质修护'],
						title: '轻医美焕肤卡',
						price: 698
					},
					{
						id: 4,
						image: '/static/linshi/02.png',
						tags: ['轮廓塑形', '面部精修'],
						title: '面部精致提升',
						price: 1280
					}
				]
			}
		},
		onShow() {
			this.syncPlaceCity()
			this.showSplashPopup = true
		},
		computed: {
			isMomentTab() {
				return this.activeTopTab === 1
			},
			isPlaceTab() {
				return this.activeTopTab === 2
			},
			activePlaceSection() {
				return this.placeSections[this.activePlaceSectionIndex] || this.placeSections[0] || {
					label: '',
					cards: []
				}
			},
			activePlaceCards() {
				return this.activePlaceSection.cards || []
			},
			activePlaceShopItems() {
				if (this.activePlaceSection.key !== 'shop') {
					return []
				}

				const imagePool = [
					'/static/linshi/01.png',
					'/static/linshi/02.png',
					'/static/linshi/03.png',
					'/static/linshi/05.png'
				]
				const avatarPool = ['/static/linshi/02.png', '/static/linshi/01.png']
				const title = '啊，发量真的是得靠养！一只手都握不住了，记得高中时...'

				return (this.activePlaceSection.cards || []).reduce((result, card, index) => {
					[0, 1].forEach((offset) => {
						result.push({
							id: `${card.id}-${offset}`,
							detailId: ((index * 2 + offset) % 3) + 1,
							shopDetailId: `${card.id}-${offset}`,
							shopName: '北京宝藏小店',
							title,
							image: imagePool[index * 2 + offset] || card.image,
							authorName: '李富贵',
							authorAvatar: avatarPool[offset % avatarPool.length],
							likes: 45,
							campusId: card.campusId
						})
					})
					return result
				}, [])
			},
			activeGuideOverview() {
				return this.guideOverviewCards[this.activeCategoryIndex] || this.guideOverviewCards[0] || {
					summary: '',
					stage: '',
					items: []
				}
			},
			activeGuide() {
				return this.serviceGuides[this.activeCategoryIndex] || this.serviceGuides[0]
			},
			currentGuideTour() {
				const guideTourOrder = [2, 0, 1]
				const currentStepIndex = guideTourOrder[this.guideTourStep] ?? 0
				const guideTourMeta = [{
						position: 'top',
						highlight: 'tabs',
						arrow: 'top'
					},
					{
						position: 'middle',
						highlight: 'entries',
						arrow: 'top'
					},
					{
						position: 'bottom',
						highlight: 'home-tab',
						arrow: 'bottom'
					}
				]
				return {
					...(this.guideTourSteps[currentStepIndex] || this.guideTourSteps[0]),
					...(guideTourMeta[this.guideTourStep] || guideTourMeta[0])
				}
			},
			guideTourTabsFocusStyle() {
				return {
					top: `${this.statusBarHeight + upxToPx(12)}px`,
					left: `${upxToPx(12)}px`
				}
			},
			guideTourEntriesFocusStyle() {
				return {
					top: `${this.statusBarHeight + upxToPx(822)}px`,
					left: `${upxToPx(16)}px`,
					right: `${upxToPx(16)}px`
				}
			},
			guideTourHomeFocusStyle() {
				return {
					left: `${upxToPx(12)}px`,
					bottom: `${upxToPx(10)}px`
				}
			},
			guideTourPanelStyle() {
				if (this.currentGuideTour.highlight === 'tabs') {
					return {
						top: `${this.statusBarHeight + upxToPx(136)}px`
					}
				}
				if (this.currentGuideTour.highlight === 'entries') {
					return {
						top: `${this.statusBarHeight + upxToPx(1018)}px`
					}
				}
				if (this.currentGuideTour.highlight === 'home-tab') {
					return {
						bottom: `${upxToPx(126)}px`
					}
				}
				return {}
			},
			plusMenuTop() {
				return this.statusBarHeight + 68
			}
		},
		methods: {
			setActiveTopTab(index) {
				this.activeTopTab = index
				this.showPlusMenu = false
			},
			handleSwiperChange(event) {
				this.heroCurrent = event.detail.current
			},
			handlePlaceBannerChange(event) {
				this.placeBannerCurrent = event.detail.current
			},
			goCityPage() {
				uni.navigateTo({
					url: '/bundle/pages/city/city'
				})
			},
			goCampusPage(mode = 'select') {
				uni.navigateTo({
					url: `/bundle/pages/campus/campus?mode=${mode}&source=home&currentCampusId=${this.currentCampus.id}`,
					success: (res) => {
						if (mode !== 'select') {
							return
						}

						res.eventChannel.on('campusSelected', ({
							campus
						}) => {
							this.applyCampusSelection(campus)
						})
					}
				})
			},
			goMessageCenter() {
				uni.navigateTo({
					url: '/bundle/pages/message_center/message_center'
				})
			},
			goCampusDetailPage() {
				uni.navigateTo({
					url: `/bundle/pages/campus/detail?id=${this.currentCampus.id}&source=home`
				})
			},
			openPlaceCard(card) {
				if (!card.campusId) {
					this.showNotice(card.name)
					return
				}

				uni.navigateTo({
					url: `/bundle/pages/campus/detail?id=${card.campusId}&source=home-place`
				})
			},
			openTreasureShopCard(item) {
				if (!item || !item.detailId) {
					this.showNotice(item && (item.shopName || item.title) ? (item.shopName || item.title) : '宝藏小店')
					return
				}

				uni.navigateTo({
					url: `/bundle/pages/moment/detail?id=${item.detailId}&entry=shop&shopId=${encodeURIComponent(item.shopDetailId || item.id)}&source=home-place-shop`
				})
			},
			applyCampusSelection(campus) {
				this.currentCampus = campus
				this.currentLocation = formatCampusLocation(campus)
			},
			syncPlaceCity() {
				const currentCity = cache.get(CURRENT_CITY_KEY)
				if (currentCity && currentCity.name) {
					this.placeCity = currentCity.name
				}
			},
			handleDoctorSelect(doctor) {
				uni.navigateTo({
					url: `/bundle/pages/doctor/detail?id=${doctor.id}&source=home`
				})
			},
			openDoctorList() {
				uni.navigateTo({
					url: `/bundle/pages/doctor/list?source=home&currentCampusId=${this.currentCampus.id}`
				})
			},
			openMomentDetail(post) {
				if (!post || !post.id) {
					return
				}

				uni.navigateTo({
					url: `/bundle/pages/moment/detail?id=${post.id}&entry=moment&source=home-moment`
				})
			},
			openMomentTopicDetail(topic) {
				const title = this.normalizeTopicTitle(topic)

				if (!title) {
					return
				}

				const topicId = topic && topic.id ? topic.id : ''
				const query = topicId ?
					`id=${topicId}&title=${encodeURIComponent(title)}` :
					`title=${encodeURIComponent(title)}`

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
			},
			handleRecommendSelect(item) {
				this.showNotice(item.title)
			},
			togglePlusMenu() {
				this.showPlusMenu = !this.showPlusMenu
			},
			closePlusMenu() {
				this.showPlusMenu = false
			},
			handlePlusMenuSelect(item) {
				this.showPlusMenu = false

				if (item.key === 'scan') {
					uni.navigateTo({
						url: '/bundle/pages/scan_take_number/scan_take_number'
					})
					return
				}

				if (item.scene) {
					this.openPublishPage(item.scene)
					return
				}

				this.showNotice(item.label)
			},
			openPublishPage(scene) {
				uni.navigateTo({
					url: `/bundle/pages/publish/editor?scene=${scene}`
				})
			},
			openGuideTour() {
				this.showPlusMenu = false
				this.showSplashPopup = false
				this.guideTourStep = 0
				this.showGuideTour = true
			},
			closeGuideTour() {
				this.showGuideTour = false
			},
			prevGuideTourStep() {
				if (this.guideTourStep > 0) {
					this.guideTourStep -= 1
				}
			},
			nextGuideTourStep() {
				if (this.guideTourStep < this.guideTourSteps.length - 1) {
					this.guideTourStep += 1
					return
				}
				this.closeGuideTour()
			},
			closeSplashPopup() {
				this.showSplashPopup = false
			},
			handleSplashConfirm() {
				this.showSplashPopup = false
				this.showNotice('立即查看')
			},
			// 璺宠浆鏅鸿兘瀵艰瘖
			toGuide() {
				uni.navigateTo({
					url: "/bundle/pages/intelligent_guide/intelligent_guide"
				})
			},
			showNotice(title) {
				uni.showToast({
					title,
					icon: 'none'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.home-page {
		min-height: 100vh;
		background:
			radial-gradient(circle at top, rgba(208, 216, 242, 0.9) 0, rgba(208, 216, 242, 0.28) 260rpx, rgba(247, 248, 252, 0) 560rpx),
			linear-gradient(180deg, #f7f8fc 0%, #ffffff 460rpx, #ffffff 100%);
	}

	.home-page.is-moment-tab {
		background: #ffffff;
	}

	.home-page.is-place-tab {
		background: #ffffff;
	}

	.home-nav {
		position: sticky;
		top: 0;
		z-index: 10;
		background: linear-gradient(180deg, rgba(244, 247, 255, 1) 0%, rgba(244, 247, 255, 1) 100%);
		backdrop-filter: blur(16rpx);
	}

	.home-nav.is-moment-tab {
		background: rgba(248, 249, 252, 0.94);
	}

	.home-nav.is-place-tab {
		background: rgba(255, 255, 255, 0.96);
	}

	.home-nav__inner {
		padding-bottom: 12rpx;
	}

	.home-shell {
		padding-top: 12rpx;
		padding-bottom: 180rpx;
	}

	.home-shell.is-moment-tab {
		padding-top: 6rpx;
		padding-bottom: 146rpx;
	}

	.home-shell.is-place-tab {
		padding-top: 10rpx;
		padding-bottom: 160rpx;
	}

	.topbar {
		height: 88rpx;
	}

	.top-tab {
		position: relative;
		margin-right: 36rpx;
		padding-bottom: 14rpx;
		font-size: 28rpx;
		color: #323437;

		.tab_active {
			position: absolute;
			z-index: -1;
			left: 14rpx;
			top: 3rpx;
			width: 28rpx;
			height: 34rpx;
		}
	}

	.top-tab.is-active {
		color: #143080;
		font-weight: 700;
	}

	.action-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 52rpx;
		height: 52rpx;
		margin-left: 30rpx;
		border-radius: 50%;

		image {
			width: 40rpx;
			height: 40rpx;
		}
	}

	.location-row {
		margin-top: 10rpx;
	}

	.location-main {
		min-width: 0;

		image {
			width: 28rpx;
			height: 28rpx;
		}
	}

	.location-text {
		margin-left: 10rpx;
		font-size: 24rpx;
		color: #1A1B1D;
	}

	.location-switch {

		image {
			width: 36rpx;
			height: 36rpx;
		}
	}

	.location-switch-text {
		margin-left: 6rpx;
		font-size: 24rpx;
		color: #323437;
	}

	.place-toolbar {
		margin-top: 8rpx;
		align-items: center;
	}

	.place-toolbar__city {
		flex-shrink: 0;
	}

	.place-toolbar__city-text {
		font-size: 28rpx;
		font-weight: 600;
		color: #1a1b1d;
	}

	.place-toolbar__city-caret {
		width: 0;
		height: 0;
		margin-left: 10rpx;
		border-left: 8rpx solid transparent;
		border-right: 8rpx solid transparent;
		border-top: 10rpx solid #323437;
	}

	.place-search {
		flex: 1;
		height: 64rpx;
		margin-left: 24rpx;
		padding: 0 24rpx;
		border-radius: 20rpx;
		background: #f6f4f1;
	}

	.place-search__icon {
		position: relative;
		width: 24rpx;
		height: 24rpx;
		border: 4rpx solid #b7bcc7;
		border-radius: 50%;
		box-sizing: border-box;
	}

	.place-search__icon::after {
		content: '';
		position: absolute;
		right: -8rpx;
		bottom: -4rpx;
		width: 12rpx;
		height: 4rpx;
		border-radius: 999rpx;
		background: #b7bcc7;
		transform: rotate(45deg);
		transform-origin: center;
	}

	.place-search__divider {
		width: 2rpx;
		height: 28rpx;
		margin-left: 18rpx;
		background: #d8d3cb;
	}

	.place-search__placeholder {
		margin-left: 18rpx;
		font-size: 26rpx;
		color: #b8b1a7;
	}

	.place-hero-card {
		position: relative;
		margin-top: 32rpx;
		border-radius: 28rpx;
		overflow: hidden;
		background: #eef5ff;
		box-shadow: 0 18rpx 36rpx rgba(34, 62, 126, 0.08);
	}

	.place-hero-swiper {
		height: 672rpx;
	}

	.place-hero-slide {
		height: 100%;
	}

	.place-hero-image {
		width: 100%;
		height: 100%;
	}

	.place-hero-dots {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.place-hero-dot {
		width: 18rpx;
		height: 4rpx;
		margin: 0 4rpx;
		border-radius: 999rpx;
		background: rgba(255, 255, 255, 0.56);
	}

	.place-hero-dot.is-active {
		background: #ffffff;
	}

	.place-section-switch {
		margin-top: 42rpx;
		align-items: flex-end;
	}

	.place-section-tabs {
		align-items: flex-end;
	}

	.place-section-tab {
		position: relative;
		margin-right: 48rpx;
		padding-bottom: 16rpx;
		font-size: 26rpx;
		font-weight: 500;
		line-height: 1;
		color: #8b8e96;
	}

	.place-section-tab.is-active {
		font-size: 40rpx;
		font-weight: 700;
		color: #143080;
	}

	.place-section-tab.is-active::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 4rpx;
		border-radius: 999rpx;
		background: #143080;
	}

	.place-section-switch__trigger {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48rpx;
		height: 48rpx;
	}

	.place-section-switch__caret {
		width: 14rpx;
		height: 14rpx;
		border-right: 3rpx solid #7d818a;
		border-bottom: 3rpx solid #7d818a;
		transform: rotate(45deg) translateY(-4rpx);
	}

	.place-card-list {
		margin-top: 26rpx;
	}

	.place-treasure-list {
		margin-top: 34rpx;
	}

	.place-card {
		padding-bottom: 54rpx;
		border-bottom: 2rpx solid rgba(18, 24, 38, 0.06);
	}

	.place-card+.place-card {
		margin-top: 56rpx;
	}

	.place-card:last-child {
		border-bottom: 0;
		padding-bottom: 0;
	}

	.place-card__image {
		display: block;
		width: 100%;
		height: 338rpx;
		border-radius: 24rpx;
	}

	.place-card__body {
		margin-top: 28rpx;
	}

	.place-card__title-row {
		align-items: center;
	}

	.place-card__title {
		max-width: 500rpx;
		font-size: 44rpx;
		line-height: 1.12;
		font-weight: 700;
		color: #1a1b1d;
	}

	.place-card__distance {
		flex-shrink: 0;
		margin-left: 20rpx;
		padding: 8rpx 18rpx;
		border: 2rpx solid #b3b7c0;
		border-radius: 999rpx;
		font-size: 24rpx;
		line-height: 1;
		color: #6d7280;
	}

	.place-card__meta {
		display: block;
		margin-top: 18rpx;
		font-size: 26rpx;
		color: #737780;
	}

	.place-card__address-row {
		align-items: center;
		margin-top: 18rpx;
	}

	.place-card__address-icon {
		width: 24rpx;
		height: 24rpx;
		opacity: 0.72;
	}

	.place-card__address {
		margin-left: 12rpx;
		font-size: 30rpx;
		color: #7a7e87;
	}

	.place-card__tag-list {
		display: flex;
		flex-wrap: wrap;
		margin-top: 22rpx;
	}

	.place-card__tag {
		margin-right: 14rpx;
		margin-bottom: 14rpx;
		padding: 10rpx 18rpx;
		border-radius: 12rpx;
		background: #f8f2ec;
		font-size: 22rpx;
		line-height: 1;
		color: #9a6e4a;
	}

	.place-card__team-title {
		display: block;
		margin-top: 4rpx;
		font-size: 34rpx;
		font-weight: 700;
		color: #1e2230;
	}

	.place-card__team {
		margin-top: 24rpx;
		align-items: flex-start;
	}

	.place-card__doctor {
		width: 25%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.place-card__doctor-avatar {
		width: 92rpx;
		height: 92rpx;
		border-radius: 50%;
		background: #f1f3f8;
	}

	.place-card__doctor-role {
		margin-top: 18rpx;
		font-size: 20rpx;
		line-height: 1.2;
		color: #252936;
	}

	.place-card__doctor-name {
		margin-top: 10rpx;
		font-size: 22rpx;
		line-height: 1.2;
		color: #8b909a;
	}

	.hero-card {
		position: relative;
		margin-top: 24rpx;
		border-radius: 24rpx;
		overflow: hidden;
		box-shadow: 0 24rpx 48rpx rgba(27, 46, 106, 0.14);
	}

	.hero-swiper {
		height: 662rpx;
	}

	.hero-slide {
		position: relative;
		height: 100%;
	}

	.hero-image {
		width: 100%;
		height: 100%;
	}

	.hero-mask {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background:
			linear-gradient(135deg, rgba(244, 248, 255, 0.84) 0%, rgba(244, 248, 255, 0.16) 35%, rgba(20, 48, 128, 0.26) 100%),
			radial-gradient(circle at 32% 20%, rgba(255, 255, 255, 0.92) 0, rgba(255, 255, 255, 0) 180rpx);
	}

	.hero-content {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		padding: 34rpx 30rpx 68rpx;
	}

	.hero-brand {
		font-size: 26rpx;
		line-height: 1.05;
		letter-spacing: 8rpx;
		color: #19418d;
	}

	.hero-brand-sub {
		margin-top: 18rpx;
		font-size: 20rpx;
		letter-spacing: 4rpx;
		color: rgba(25, 65, 141, 0.7);
	}

	.hero-title {
		margin-top: auto;
		font-size: 76rpx;
		line-height: 1.02;
		letter-spacing: 8rpx;
		color: #1e3f91;
		font-weight: 300;
	}

	.hero-dots {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.hero-dot {
		width: 18rpx;
		height: 4rpx;
		margin: 0 4rpx;
		border-radius: 999rpx;
		background: rgba(255, 255, 255, 0.6);
	}

	.hero-dot.is-active {
		width: 18rpx;
		background: #ffffff;
	}

	.entry-grid {
		display: flex;
		justify-content: space-between;
		margin-top: 36rpx;
	}

	.entry-card {
		position: relative;
		width: 160rpx;
		height: 160rpx;
		padding: 16rpx;
		border-radius: 16rpx;
		overflow: hidden;
		box-sizing: border-box;
	}

	.entry-overlay {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 100%);
	}

	.entry-bg {
		position: absolute;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
	}

	.entry-title {
		position: relative;
		z-index: 1;
		display: block;
		font-size: 20rpx;
		font-weight: 700;
		line-height: 1.25;
		color: #ffffff;
	}

	.section-head {
		margin-top: 38rpx;
	}

	.section-title {
		margin-left: 12rpx;
	}

	.brand-title {
		letter-spacing: 1rpx;
	}

	.arrival-card {
		width: 100%;
		height: 192rpx;
		margin-top: 28rpx;
		padding: 26rpx 30rpx;
		border-radius: 24rpx;
		position: relative;

		.card-content {
			position: relative;
			z-index: 1;
		}

		.bgImg {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 0;
		}
	}

	.arrival-card__title {
		font-size: 32rpx;
		font-weight: 500;
		color: #121826;
	}

	.arrival-card__action {
		font-size: 24rpx;
		font-weight: 400;
		color: #143080;
	}

	.arrival-card__branch {
		margin-top: 16rpx;

		.campus-name {
			font-size: 24rpx;
			color: #2e3543;
		}
	}

	.arrival-card__footer {
		margin-top: 16rpx;
	}

	.arrival-card__manager {
		font-size: 24rpx;
		color: #77797E;
	}

	.arrival-card__time {
		margin-left: 50rpx;
		flex-shrink: 0;
	}

	.arrival-card__time-text {
		margin-left: 8rpx;
		font-size: 26rpx;
		color: #37445f;
	}

	.category-tabs {
		margin-top: 26rpx;
		overflow-x: auto;
		white-space: nowrap;
	}

	.category-tab {
		flex: none;
		min-width: 136rpx;
		height: 56rpx;
		padding: 0 28rpx;
		margin-right: 16rpx;
		border-radius: 16rpx;
		border: 1rpx solid #E1E2E5;
		background: #ffffff;
		font-size: 24rpx;
		line-height: 56rpx;
		text-align: center;
		color: #77797E;
		box-sizing: border-box;
	}

	.category-tab.is-active {
		border-color: #143080;
		color: #143080;
		// background: #f7f9ff;
	}

	.guide-overview-card {
		margin-top: 24rpx;
		padding: 20rpx 20rpx 18rpx;
		border-radius: 24rpx;
		background: linear-gradient(180deg, #f6f6f7 0%, #ffffff 100%);
		box-shadow: 0px 8rpx 24rpx rgba(0, 0, 0, 0.06);
	}

	.guide-overview-card__header {
		align-items: center;
		height: 74rpx;
		padding: 0 28rpx;
		border-radius: 12rpx;
		background: #143080;
	}

	.guide-overview-card__summary {
		font-size: 28rpx;
		font-weight: 600;
		color: #ffffff;
	}

	.guide-overview-card__stage {
		font-size: 24rpx;
		color: #ffffff;
	}

	.guide-overview-card__list {
		padding: 18rpx 0 0;
	}

	.guide-overview-card__item {
		align-items: center;
		height: 76rpx;
		padding: 0 28rpx;
		margin-top: 12rpx;
		border-radius: 12rpx;
		border: 1rpx solid #e6e7eb;
		background: #ffffff;
		box-sizing: border-box;
	}

	.guide-overview-card__item-label,
	.guide-overview-card__item-value {
		font-size: 26rpx;
		color: #77797e;
	}

	.guide-overview-card__footer {
		padding-top: 22rpx;
	}

	.guide-overview-card__footer-text {
		margin-right: 6rpx;
		font-size: 24rpx;
		color: #323437;
	}

	.guide-card {
		margin-top: 24rpx;
		padding: 34rpx 24rpx 24rpx;
		border-radius: 24rpx;
		background: #ffffff;
		box-shadow: 0px 4px 8px 0px #00000014;
	}

	.guide-steps {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.guide-step {
		position: relative;
		width: 32%;
		text-align: center;
	}

	.guide-step-line {
		position: absolute;
		top: 46rpx;
		left: 64%;
		width: 72%;
		height: 2rpx;
		// background: #d6dced;
		border: 2rpx dashed #EEEEF0;
	}

	.guide-step-clunm-line {
		position: absolute;
		width: 2rpx;
		height: 62rpx;
		background: rgba(26, 27, 29, 0.08);
		bottom: -10rpx;
		left: 100%;
	}

	.guide-step-line.is-current {
		border: 2rpx solid #143080;
	}

	.guide-step-circle {
		position: relative;
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 92rpx;
		height: 92rpx;
		margin: 0 auto;
		border-radius: 50%;
		border: 2rpx solid #E1E2E5;
		background: #ffffff;
		font-size: 24rpx;
		color: #8b93a5;
	}

	.guide-step-circle.is-done {
		border-color: #143080;
		background: #143080;
		color: #ffffff;
	}

	.guide-step-circle.is-current {
		border-color: #E1EAFD;
		// background: #eef3ff;
		// color: #143080;

		view {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 64rpx;
			height: 64rpx;
			background: #143080;
			color: #ffffff;
			border-radius: 50%;
		}
	}

	.guide-step-subtitle {
		display: block;
		margin-top: 16rpx;
		font-size: 24rpx;
		color: #1f2430;
	}

	.guide-step-note {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 94rpx;
		height: 38rpx;
		padding: 0 14rpx;
		margin-top: 50rpx;
		border-radius: 6rpx;
		background: #F4F4F8;
		font-size: 20rpx;
		color: #77797E;
		box-sizing: border-box;
	}

	.guide-step-note.is-done {
		background: #EBF0FF;
		color: #143080;
	}

	.guide-step-note.is-current {
		background: #EBF0FF;
		color: #143080;
	}

	.guide-footer {
		margin-top: 28rpx;
		padding-top: 24rpx;
		// border-top: 2rpx solid #f1f3f8;
	}

	.guide-footer-text {
		margin-right: 8rpx;
		font-size: 24rpx;
		color: #323437;
	}

	.section-block {
		margin-top: 42rpx;
	}

	.clinic-block {
		margin-top: 50rpx;
	}

	.clinic-summary {
		display: flex;
		flex-direction: column;
	}

	.clinic-name {
		font-size: 44rpx;
		line-height: 1.05;
		font-weight: 600;
		color: #121826;
	}

	.clinic-address {
		margin-top: 14rpx;
		font-size: 36rpx;
		line-height: 1.15;
		font-weight: 600;
		color: #121826;
	}

	.clinic-link {
		display: inline-flex;
		align-items: center;
		margin-top: 26rpx;
	}

	.clinic-link-text {
		margin-right: 8rpx;
		font-size: 24rpx;
		color: #143080;
	}

	.store-card {
		margin-top: 24rpx;
		border-radius: 22rpx;
		overflow: hidden;
		box-shadow: 0 18rpx 40rpx rgba(90, 60, 22, 0.12);
	}

	.store-card__image {
		display: block;
		width: 100%;
	}

	.recommend-block {
		margin-top: 48rpx;
	}

	.moment-feed {
		padding-top: 8rpx;
	}

	.plus-menu-overlay {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 40;
	}

	.plus-menu {
		position: fixed;
		right: 42rpx;
		z-index: 41;
		width: 248rpx;
		padding: 14rpx 0;
		border-radius: 8rpx;
		background: rgba(39, 39, 41, 0.82);
		box-shadow: 0 18rpx 36rpx rgba(0, 0, 0, 0.16);
		backdrop-filter: blur(10rpx);
	}

	.plus-menu__caret {
		position: absolute;
		top: -16rpx;
		right: 34rpx;
		width: 0;
		height: 0;
		border-left: 16rpx solid transparent;
		border-right: 16rpx solid transparent;
		border-bottom: 18rpx solid rgba(39, 39, 41, 0.82);
	}

	.plus-menu__item {
		padding: 24rpx 28rpx;
	}

	.plus-menu__item+.plus-menu__item {
		margin-top: 4rpx;
	}

	.plus-menu__label {
		margin-left: 18rpx;
		font-size: 26rpx;
		color: #ffffff;
	}

	.guide-tour {
		position: relative;
		width: 100vw;
		height: 100vh;
	}

	.guide-tour__tabs-focus {
		position: fixed;
		z-index: 52;
		display: flex;
		align-items: center;
		padding: 14rpx 28rpx 16rpx;
		border-radius: 16rpx;
		background: #ffffff;
		box-shadow: 0 12rpx 28rpx rgba(20, 48, 128, 0.14);
		pointer-events: none;
	}

	.guide-tour__tabs-item {
		margin-right: 34rpx;
		font-size: 26rpx;
		color: #2d3138;
	}

	.guide-tour__tabs-item:last-child {
		margin-right: 0;
	}

	.guide-tour__tabs-item.is-active {
		color: #143080;
		font-weight: 600;
	}

	.guide-tour__entries-focus {
		position: fixed;
		z-index: 52;
		display: flex;
		justify-content: space-between;
		padding: 16rpx;
		border-radius: 20rpx;
		background: #ffffff;
		box-shadow: 0 14rpx 36rpx rgba(20, 48, 128, 0.16);
		pointer-events: none;
	}

	.guide-tour__home-focus {
		position: fixed;
		z-index: 52;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 80rpx;
		height: 96rpx;
		border-radius: 16rpx;
		background: #ffffff;
		box-shadow: 0 10rpx 26rpx rgba(17, 24, 39, 0.16);
		pointer-events: none;
	}

	.guide-tour__home-icon {
		width: 42rpx;
		height: 42rpx;
	}

	.guide-tour__home-text {
		margin-top: 6rpx;
		font-size: 20rpx;
		line-height: 1;
		color: #143080;
		font-weight: 600;
	}

	.guide-tour__panel {
		position: fixed;
		left: 26rpx;
		right: 26rpx;
		z-index: 51;
		padding: 30rpx 30rpx 34rpx;
		border-radius: 18rpx;
		background: #ffffff;
		box-shadow: 0 20rpx 44rpx rgba(17, 24, 39, 0.12);
	}

	.guide-tour__panel.is-middle {
		top: 560rpx;
	}

	.guide-tour__panel.is-bottom {
		bottom: 132rpx;
	}

	.guide-tour__panel.is-top {
		top: 182rpx;
	}

	.guide-tour__panel.has-arrow-top::before {
		content: '';
		position: absolute;
		left: 34rpx;
		top: -18rpx;
		width: 0;
		height: 0;
		border-left: 16rpx solid transparent;
		border-right: 16rpx solid transparent;
		border-bottom: 18rpx solid #ffffff;
	}

	.guide-tour__panel.has-arrow-bottom::after {
		content: '';
		position: absolute;
		left: 34rpx;
		bottom: -18rpx;
		width: 0;
		height: 0;
		border-left: 16rpx solid transparent;
		border-right: 16rpx solid transparent;
		border-top: 18rpx solid #ffffff;
	}

	.guide-tour__title {
		font-size: 38rpx;
		font-weight: 600;
		color: #121826;
	}

	.guide-tour__close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 34rpx;
		height: 34rpx;
	}

	.guide-tour__desc {
		display: block;
		margin-top: 24rpx;
		font-size: 28rpx;
		line-height: 1.6;
		color: #2f3441;
	}

	.guide-tour__footer {
		margin-top: 32rpx;
	}

	.guide-tour__dots {
		align-items: center;
	}

	.guide-tour__dot {
		width: 12rpx;
		height: 12rpx;
		margin-right: 12rpx;
		border-radius: 50%;
		background: #d5dae8;
	}

	.guide-tour__dot.is-active {
		background: #143080;
	}

	.guide-tour__actions {
		align-items: center;
	}

	.guide-tour__button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 116rpx;
		height: 52rpx;
		border-radius: 4rpx;
		box-sizing: border-box;
	}

	.guide-tour__button+.guide-tour__button {
		margin-left: 14rpx;
	}

	.guide-tour__button.is-secondary {
		border: 2rpx solid #ccd3e4;
		background: #ffffff;
	}

	.guide-tour__button.is-primary {
		background: #143080;
	}

	.guide-tour__button-text {
		font-size: 26rpx;
		line-height: 1;
	}

	.guide-tour__button-text.is-secondary {
		color: #202430;
	}

	.guide-tour__button-text.is-primary {
		color: #ffffff;
	}

	.splash-popup__card {
		position: relative;
		width: 100%;
		overflow: hidden;
		background: transparent;
		box-shadow: 0 30rpx 70rpx rgba(0, 0, 0, 0.2);
	}

	.splash-popup__image {
		display: block;
		width: 100%;
		border-radius: 0;
	}

	.splash-popup__close {
		position: absolute;
		top: 26rpx;
		right: 26rpx;
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48rpx;
		height: 48rpx;
	}

	.splash-popup__button-wrap {
		position: absolute;
		left: 56rpx;
		right: 56rpx;
		bottom: 20rpx;
	}

	.splash-popup__button {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80rpx;
		border-radius: 999rpx;
		border: 3rpx solid rgba(255, 255, 255, 0.92);
		background: rgba(255, 255, 255, 0.02);
	}

	.splash-popup__button-text {
		display: block;
		width: 100%;
		text-align: center;
		line-height: 1;
		font-size: 28rpx;
		font-weight: 500;
		color: #ffffff;
	}
</style>
