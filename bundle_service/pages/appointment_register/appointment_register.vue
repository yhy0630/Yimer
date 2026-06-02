<template>
	<view class="appointment-page">
		<view class="appointment-page__header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="page-shell appointment-page__nav">
				<view class="appointment-page__back" @tap="goBack">
					<u-icon name="arrow-left" size="48" color="#22252b"></u-icon>
				</view>
			</view>
		</view>

		<view class="page-shell appointment-page__content">
			<view class="appointment-section">
				<view class="appointment-section__head">
					<view class="section-head-mark"></view>
					<text class="appointment-section__title">已选院区</text>
				</view>

				<view class="selection-card selection-card--campus" @tap="openCampusPopup">
					<view class="selection-card__body">
						<text class="selection-card__title">{{ currentCampus.name }}</text>
						<text class="selection-card__desc">{{ currentCampus.address }}</text>
					</view>
					<u-icon name="arrow-down" size="30" color="#7e8593"></u-icon>
				</view>
			</view>

			<view class="appointment-section">
				<view class="appointment-section__head">
					<view class="section-head-mark"></view>
					<text class="appointment-section__title">已选科室</text>
				</view>

				<view class="selection-card selection-card--department" @tap="openDepartmentPopup">
					<view class="selection-card__body">
						<text class="selection-card__title selection-card__title--single">{{ currentDepartment.name }}</text>
					</view>
					<u-icon name="arrow-down" size="30" color="#7e8593"></u-icon>
				</view>
			</view>

			<view class="appointment-section">
				<view class="appointment-section__head">
					<view class="section-head-mark"></view>
					<text class="appointment-section__title">预约挂号时间</text>
				</view>

				<scroll-view scroll-x class="date-strip">
					<view class="date-strip__inner">
						<view
							v-for="item in dateOptions"
							:key="item.id"
							:class="['date-card', selectedDateId === item.id ? 'is-active' : '']"
							@tap="selectDate(item.id)"
						>
							<text class="date-card__label">{{ item.label }}</text>
							<text class="date-card__value">{{ item.date }}</text>
							<text class="date-card__status">{{ item.status }}</text>
						</view>

						<view class="date-card date-card--calendar" @tap="showCalendarToast">
							<u-icon name="calendar" size="38" color="#8b909a"></u-icon>
							<text class="date-card__calendar-text">日历</text>
						</view>
					</view>
				</scroll-view>
			</view>

			<view class="appointment-section">
				<view class="appointment-section__head">
					<view class="section-head-mark"></view>
					<text class="appointment-section__title">选择医生</text>
				</view>

				<view class="doctor-list">
					<view v-for="doctor in doctorCards" :key="doctor.id" class="doctor-block">
						<view
							:class="['doctor-card', selectedDoctorId === doctor.id ? 'doctor-card--active' : '']"
							@tap="selectDoctor(doctor.id)"
						>
							<image class="doctor-card__avatar" :src="doctor.avatar" mode="aspectFill"></image>

							<view class="doctor-card__content">
								<view class="doctor-card__top">
									<view class="doctor-card__name-group">
										<text class="doctor-card__name">{{ doctor.name }}</text>
										<text class="doctor-card__title">{{ doctor.title }}</text>
									</view>

									<text
										:class="[
											'doctor-card__status',
											doctor.statusText === '有号' ? 'doctor-card__status--active' : 'doctor-card__status--muted'
										]"
									>
										{{ doctor.statusText }}
									</text>
								</view>

								<view class="doctor-card__tag">{{ doctor.specialty }}</view>
							</view>
						</view>

						<view v-if="selectedDoctorId === doctor.id && doctor.slots.length" class="slot-grid">
							<view
								v-for="slot in doctor.slots"
								:key="slot.id"
								:class="[
									'slot-item',
									slot.available ? '' : 'slot-item--disabled',
									selectedSlotId === slot.id ? 'slot-item--active' : ''
								]"
								@tap="selectSlot(slot)"
							>
								<text class="slot-item__time">{{ slot.time }}</text>
								<text class="slot-item__remain">{{ slot.remainText }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="appointment-section">
				<view class="appointment-section__head">
					<view class="section-head-mark"></view>
					<text class="appointment-section__title">选择治疗项目</text>
				</view>

				<view class="treatment-list">
					<view
						v-for="item in treatmentOptions"
						:key="item.id"
						class="treatment-item"
						@tap="selectTreatment(item.id)"
					>
						<text class="treatment-item__name">{{ item.name }}</text>
						<view
							:class="[
								'treatment-item__radio',
								selectedTreatmentId === item.id ? 'treatment-item__radio--active' : ''
							]"
						>
							<view v-if="selectedTreatmentId === item.id" class="treatment-item__radio-dot"></view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="appointment-page__footer">
			<view class="page-shell">
				<button class="appointment-page__submit" @tap="confirmAppointment">确认挂号</button>
			</view>
		</view>

		<u-popup
			v-model="showCampusPopup"
			mode="bottom"
			border-radius="40"
			:safe-area-inset-bottom="true"
			:mask-close-able="true"
			:mask-custom-style="{ backgroundColor: 'rgba(9, 13, 20, 0.28)' }"
		>
			<view class="campus-popup">
				<text class="campus-popup__title">选择院区</text>

				<view class="campus-popup__search">
					<u-icon name="search" size="40" color="#b9bcc3"></u-icon>
					<input
						v-model.trim="campusKeyword"
						class="campus-popup__search-input"
						placeholder="搜院区"
						placeholder-class="campus-popup__search-placeholder"
						confirm-type="search"
					/>
				</view>

				<scroll-view scroll-y class="campus-popup__list">
					<view
						v-for="campus in filteredCampusList"
						:key="campus.id"
						class="campus-popup__item"
						@tap="selectCampus(campus)"
					>
						<text class="campus-popup__item-name">{{ campus.name }}</text>
						<u-icon
							v-if="currentCampus.id === campus.id"
							name="checkmark"
							size="54"
							color="#2d3138"
						></u-icon>
					</view>

					<view v-if="!filteredCampusList.length" class="campus-popup__empty">
						<text class="campus-popup__empty-text">未找到相关院区</text>
					</view>
				</scroll-view>
			</view>
		</u-popup>

		<u-popup
			v-model="showDepartmentPopup"
			mode="bottom"
			height="980rpx"
			:zoom="false"
			:safe-area-inset-bottom="true"
			:mask-close-able="true"
			:mask-custom-style="{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }"
			border-radius="40"
		>
			<view class="department-popup">
				<text class="department-popup__title">选择科室</text>

				<view class="department-popup__list">
					<view
						v-for="item in departmentOptions"
						:key="item.id"
						class="department-popup__item"
						@tap="selectDepartment(item.id)"
					>
						<text class="department-popup__item-text">{{ item.name }}</text>
						<u-icon
							v-if="selectedDepartmentId === item.id"
							name="checkmark"
							color="#2c3138"
							size="54"
						></u-icon>
					</view>
				</view>

				<button class="department-popup__confirm" @tap="confirmDepartmentSelection">确认</button>
			</view>
		</u-popup>
	</view>
</template>

<script>
import { CAMPUS_LIST, DEFAULT_CAMPUS, getCampusById } from '@/config/campus'
import { getDoctorById } from '@/config/doctor'

const DEPARTMENT_OPTIONS = [
	{
		id: 'skin-micro',
		name: '美容皮肤科（微创）'
	},
	{
		id: 'photoelectric',
		name: '光电美肤科'
	},
	{
		id: 'injection',
		name: '注射美容科'
	},
	{
		id: 'contour',
		name: '轮廓塑形科'
	},
	{
		id: 'hair-care',
		name: '毛发养护科'
	},
	{
		id: 'repair',
		name: '术后修复科'
	}
]

const DEFAULT_DEPARTMENT = DEPARTMENT_OPTIONS[0]

const APPOINTMENT_DATES = [
	{
		id: 'today',
		label: '今日',
		date: '05-11',
		status: '有号'
	},
	{
		id: 'tomorrow',
		label: '明日',
		date: '05-12',
		status: '有号'
	},
	{
		id: 'friday',
		label: '周五',
		date: '05-13',
		status: '有号'
	},
	{
		id: 'saturday',
		label: '周六',
		date: '05-14',
		status: '有号'
	},
	{
		id: 'sunday',
		label: '周日',
		date: '05-15',
		status: '有号'
	}
]

const APPOINTMENT_DOCTORS = [
	{
		doctorId: 'light',
		statusText: '有号',
		specialty: '光电专家',
		slots: [
			{
				id: 'light-09',
				time: '9:00-10:00',
				remainText: '余号13',
				available: true
			},
			{
				id: 'light-10',
				time: '10:00-11:00',
				remainText: '余号13',
				available: true
			},
			{
				id: 'light-12',
				time: '12:00-13:00',
				remainText: '余号13',
				available: true
			},
			{
				id: 'light-14',
				time: '14:00-15:00',
				remainText: '无号',
				available: false
			}
		]
	},
	{
		doctorId: 'ridjk-a',
		statusText: '无号',
		specialty: '光电专家',
		slots: []
	}
]

const APPOINTMENT_TREATMENTS = [
	{
		id: 'item-a',
		name: '准入项目名称'
	},
	{
		id: 'item-b',
		name: '准入项目名称'
	},
	{
		id: 'item-c',
		name: '准入项目名称'
	}
]

function getStatusBarHeight() {
	try {
		const { statusBarHeight = 20 } = uni.getSystemInfoSync()
		return statusBarHeight
	} catch (error) {
		return 20
	}
}

function getDepartmentById(id) {
	return DEPARTMENT_OPTIONS.find((department) => department.id === id) || DEFAULT_DEPARTMENT
}

function normalizeKeyword(keyword) {
	return String(keyword || '').trim().toLowerCase()
}

function buildDoctorCards() {
	return APPOINTMENT_DOCTORS.map((item) => {
		const doctor = getDoctorById(item.doctorId)

		return {
			id: doctor.id,
			name: doctor.name,
			title: doctor.title,
			avatar: doctor.avatar,
			specialty: item.specialty || doctor.tags[0] || '',
			statusText: item.statusText,
			slots: item.slots
		}
	})
}

function getFirstAvailableSlotId(doctorCards, doctorId) {
	const currentDoctor = doctorCards.find((item) => item.id === doctorId)
	const firstAvailableSlot = currentDoctor && currentDoctor.slots.find((slot) => slot.available)
	return firstAvailableSlot ? firstAvailableSlot.id : ''
}

export default {
	data() {
		const doctorCards = buildDoctorCards()
		const defaultDoctorId = doctorCards.length ? doctorCards[0].id : ''

		return {
			statusBarHeight: getStatusBarHeight(),
			currentCampus: DEFAULT_CAMPUS,
			currentDepartment: DEFAULT_DEPARTMENT,
			campusList: CAMPUS_LIST,
			campusKeyword: '',
			showCampusPopup: false,
			showDepartmentPopup: false,
			selectedDepartmentId: DEFAULT_DEPARTMENT.id,
			departmentOptions: DEPARTMENT_OPTIONS,
			dateOptions: APPOINTMENT_DATES,
			doctorCards,
			treatmentOptions: APPOINTMENT_TREATMENTS,
			selectedDateId: APPOINTMENT_DATES[1] ? APPOINTMENT_DATES[1].id : '',
			selectedDoctorId: defaultDoctorId,
			selectedSlotId: getFirstAvailableSlotId(doctorCards, defaultDoctorId),
			selectedTreatmentId: APPOINTMENT_TREATMENTS[0] ? APPOINTMENT_TREATMENTS[0].id : ''
		}
	},
	computed: {
		filteredCampusList() {
			const keyword = normalizeKeyword(this.campusKeyword)

			if (!keyword) {
				return this.campusList
			}

			return this.campusList.filter((campus) =>
				[campus.name, campus.shortName, campus.address].some((field) =>
					normalizeKeyword(field).includes(keyword)
				)
			)
		}
	},
	onLoad(options = {}) {
		this.currentCampus = getCampusById(options.campusId)
		this.currentDepartment = getDepartmentById(options.departmentId)
		this.selectedDepartmentId = this.currentDepartment.id
	},
	methods: {
		goBack() {
			const pages = getCurrentPages()

			if (pages.length > 1) {
				uni.navigateBack({
					delta: 1
				})
				return
			}

			uni.switchTab({
				url: '/pages/service/service'
			})
		},
		selectDate(dateId) {
			this.selectedDateId = dateId
		},
		openCampusPopup() {
			this.campusKeyword = ''
			this.showCampusPopup = true
		},
		selectCampus(campus) {
			this.currentCampus = campus
			this.showCampusPopup = false
		},
		openDepartmentPopup() {
			this.selectedDepartmentId = this.currentDepartment.id
			this.showDepartmentPopup = true
		},
		selectDepartment(departmentId) {
			this.selectedDepartmentId = departmentId
		},
		confirmDepartmentSelection() {
			this.currentDepartment = getDepartmentById(this.selectedDepartmentId)
			this.showDepartmentPopup = false
		},
		selectDoctor(doctorId) {
			this.selectedDoctorId = doctorId
			this.selectedSlotId = getFirstAvailableSlotId(this.doctorCards, doctorId)
		},
		selectSlot(slot) {
			if (!slot.available) {
				return
			}

			this.selectedSlotId = slot.id
		},
		selectTreatment(treatmentId) {
			this.selectedTreatmentId = treatmentId
		},
		showCalendarToast() {
			uni.showToast({
				title: '日历选择待接入',
				icon: 'none'
			})
		},
		confirmAppointment() {
			uni.showToast({
				title: '挂号信息已确认',
				icon: 'none'
			})
		}
	}
}
</script>

<style scoped lang="scss">
.appointment-page {
	min-height: 100vh;
	background: #ffffff;
}

.appointment-page__header {
	background: #ffffff;
}

.appointment-page__nav {
	display: flex;
	align-items: center;
	height: 96rpx;
}

.appointment-page__back {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 72rpx;
	height: 72rpx;
}

.appointment-page__content {
	padding-top: 18rpx;
	padding-bottom: calc(env(safe-area-inset-bottom) + 180rpx);
}

.appointment-section + .appointment-section {
	margin-top: 56rpx;
}

.appointment-section__head {
	display: flex;
	align-items: center;
}

.appointment-section__title {
	margin-left: 18rpx;
	color: #23262d;
	font-size: 34rpx;
	font-weight: 700;
	line-height: 1.2;
}

.selection-card {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: space-between;
	min-height: 122rpx;
	margin-top: 26rpx;
	padding: 30rpx 32rpx;
	border-radius: 22rpx;
	background: linear-gradient(135deg, #f5f8ff 0%, #eff3fb 100%);
	overflow: hidden;
	box-sizing: border-box;
}

.selection-card::before,
.selection-card::after {
	content: '';
	position: absolute;
	border-radius: 50%;
	pointer-events: none;
}

.selection-card::before {
	right: 56rpx;
	top: 12rpx;
	width: 108rpx;
	height: 108rpx;
	background: radial-gradient(circle, rgba(255, 255, 255, 0.72) 0%, rgba(255, 255, 255, 0) 72%);
}

.selection-card::after {
	right: -24rpx;
	bottom: -34rpx;
	width: 220rpx;
	height: 220rpx;
	background: radial-gradient(circle, rgba(197, 214, 247, 0.52) 0%, rgba(197, 214, 247, 0) 72%);
}

.selection-card__body {
	position: relative;
	z-index: 1;
	flex: 1;
	min-width: 0;
	padding-right: 26rpx;
}

.selection-card__title {
	display: block;
	color: #23262e;
	font-size: 32rpx;
	font-weight: 700;
	line-height: 1.35;
}

.selection-card--campus {
	cursor: pointer;
}

.selection-card--department {
	cursor: pointer;
}

.selection-card__title--single {
	line-height: 1.4;
}

.selection-card__desc {
	display: block;
	margin-top: 16rpx;
	color: #5f6674;
	font-size: 24rpx;
	line-height: 1.45;
}

.date-strip {
	margin-top: 26rpx;
	white-space: nowrap;
}

.date-strip__inner {
	display: inline-flex;
	padding-right: 12rpx;
}

.date-card {
	display: inline-flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 120rpx;
	height: 152rpx;
	margin-right: 20rpx;
	border-radius: 22rpx;
	background: #f4f6fb;
	color: #2c3138;
	box-sizing: border-box;
}

.date-card__label {
	font-size: 24rpx;
	line-height: 1.2;
}

.date-card__value {
	margin-top: 24rpx;
	font-size: 22rpx;
	font-weight: 700;
	line-height: 1.2;
}

.date-card__status {
	margin-top: 22rpx;
	font-size: 22rpx;
	line-height: 1.2;
	color: #7c8392;
}

.date-card.is-active {
	background: #213d92;
	color: #ffffff;
	box-shadow: 0 20rpx 34rpx rgba(33, 61, 146, 0.18);
}

.date-card.is-active .date-card__status {
	color: rgba(255, 255, 255, 0.86);
}

.date-card--calendar {
	width: 108rpx;
	background: #ffffff;
	border: 1px solid #edf0f6;
}

.date-card__calendar-text {
	margin-top: 12rpx;
	color: #2d3139;
	font-size: 22rpx;
	line-height: 1.2;
}

.doctor-list {
	margin-top: 26rpx;
}

.doctor-block + .doctor-block {
	margin-top: 34rpx;
}

.doctor-card {
	display: flex;
	align-items: center;
	padding: 30rpx 28rpx;
	border: 1px solid #e5eaf4;
	border-radius: 20rpx;
	background: #f7faff;
	box-sizing: border-box;
}

.doctor-card--active {
	border-color: #d8e2f8;
	box-shadow: 0 14rpx 30rpx rgba(22, 53, 126, 0.08);
}

.doctor-card__avatar {
	flex: none;
	width: 108rpx;
	height: 108rpx;
	border-radius: 50%;
	background: #d9deea;
}

.doctor-card__content {
	flex: 1;
	min-width: 0;
	margin-left: 28rpx;
}

.doctor-card__top {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 24rpx;
}

.doctor-card__name-group {
	display: flex;
	align-items: baseline;
	flex-wrap: wrap;
	min-width: 0;
}

.doctor-card__name {
	color: #172031;
	font-size: 30rpx;
	font-weight: 700;
	line-height: 1.3;
}

.doctor-card__title {
	margin-left: 18rpx;
	color: #7f8695;
	font-size: 24rpx;
	line-height: 1.3;
}

.doctor-card__status {
	flex: none;
	font-size: 24rpx;
	font-weight: 700;
	line-height: 1.2;
}

.doctor-card__status--active {
	color: #223e92;
}

.doctor-card__status--muted {
	color: #9aa1ae;
}

.doctor-card__tag {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	height: 42rpx;
	margin-top: 18rpx;
	padding: 0 18rpx;
	border-radius: 14rpx;
	background: #fff2e5;
	color: #9c6a40;
	font-size: 22rpx;
	line-height: 1;
}

.slot-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
	margin-top: 22rpx;
}

.slot-item {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 48%;
	height: 84rpx;
	border: 1px solid #d9dee8;
	border-radius: 16rpx;
	background: #ffffff;
	box-sizing: border-box;
}

.slot-item--active {
	border-color: #213d92;
	background: rgba(33, 61, 146, 0.06);
}

.slot-item--disabled {
	border-color: #e3e4e8;
	background: #ebebee;
}

.slot-item__time,
.slot-item__remain {
	font-size: 24rpx;
	line-height: 1.2;
}

.slot-item__time {
	color: #585f6c;
}

.slot-item__remain {
	margin-left: 16rpx;
	color: #717987;
}

.slot-item--active .slot-item__time,
.slot-item--active .slot-item__remain {
	color: #213d92;
}

.slot-item--disabled .slot-item__time,
.slot-item--disabled .slot-item__remain {
	color: #a9adb5;
}

.treatment-list {
	margin-top: 16rpx;
}

.treatment-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	min-height: 114rpx;
	border-bottom: 1px solid #eef1f6;
}

.treatment-item__name {
	color: #30343c;
	font-size: 24rpx;
	line-height: 1.4;
}

.treatment-item__radio {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40rpx;
	height: 40rpx;
	border: 2rpx solid #d8dde8;
	border-radius: 50%;
	box-sizing: border-box;
}

.treatment-item__radio--active {
	border-color: #213d92;
}

.treatment-item__radio-dot {
	width: 18rpx;
	height: 18rpx;
	border-radius: 50%;
	background: #213d92;
}

.appointment-page__footer {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 10;
	padding: 18rpx 0 24rpx;
	background: rgba(255, 255, 255, 0.96);
}

/* #ifdef APP-PLUS */
.appointment-page__footer {
	padding-bottom: calc(24rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
}
/* #endif */

/* #ifdef MP-WEIXIN */
.appointment-page__footer {
	padding-bottom: calc(24rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
}
/* #endif */

.appointment-page__submit {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 96rpx;
	border-radius: 999rpx;
	background: #213d92;
	color: #ffffff;
	font-size: 34rpx;
	font-weight: 600;
	line-height: 1;
}

.campus-popup {
	background: #ffffff;
	border-radius: 40rpx 40rpx 0 0;
	padding: 38rpx 42rpx 0;
}

.campus-popup__title {
	display: block;
	text-align: center;
	color: #20242b;
	font-size: 44rpx;
	font-weight: 700;
	line-height: 1.2;
}

.campus-popup__search {
	display: flex;
	align-items: center;
	height: 98rpx;
	margin-top: 42rpx;
	padding: 0 26rpx;
	border-radius: 14rpx;
	background: #f6f7f9;
}

.campus-popup__search-input {
	flex: 1;
	min-width: 0;
	height: 98rpx;
	margin-left: 18rpx;
	color: #1f2329;
	font-size: 34rpx;
}

.campus-popup__search-placeholder {
	color: #c7c8cc;
	font-size: 34rpx;
}

.campus-popup__list {
	height: 960rpx;
	padding-top: 18rpx;
	padding-bottom: calc(env(safe-area-inset-bottom) + 32rpx);
	box-sizing: border-box;
}

.campus-popup__item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	min-height: 104rpx;
}

.campus-popup__item-name {
	flex: 1;
	min-width: 0;
	padding-right: 24rpx;
	color: #333842;
	font-size: 32rpx;
	line-height: 1.45;
}

.campus-popup__empty {
	display: flex;
	align-items: center;
	justify-content: center;
	padding-top: 180rpx;
}

.campus-popup__empty-text {
	color: #a0a6b2;
	font-size: 26rpx;
	line-height: 1.4;
}

.department-popup {
	background: #ffffff;
	border-radius: 40rpx 40rpx 0 0;
	box-sizing: border-box;
	min-height: 980rpx;
	padding: 42rpx 0 30rpx;
	display: flex;
	flex-direction: column;
}

.department-popup__title {
	display: block;
	padding: 0 56rpx;
	font-size: 44rpx;
	font-weight: 700;
	line-height: 1.2;
	text-align: center;
	color: #22252b;
}

.department-popup__list {
	flex: 1;
	margin-top: 8rpx;
}

.department-popup__item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	min-height: 108rpx;
	padding: 0 56rpx;
	box-sizing: border-box;
}

.department-popup__item-text {
	font-size: 34rpx;
	font-weight: 400;
	line-height: 1.3;
	color: #2b2f36;
}

.department-popup__confirm {
	display: flex;
	align-items: center;
	justify-content: center;
	width: calc(100% - 112rpx);
	height: 110rpx;
	margin: auto auto 0;
	border-radius: 999rpx;
	background: #243c8f;
	font-size: 34rpx;
	font-weight: 600;
	line-height: 1;
	color: #ffffff;
	letter-spacing: 1rpx;
}

.department-popup__confirm::after {
	border: none;
}
</style>
