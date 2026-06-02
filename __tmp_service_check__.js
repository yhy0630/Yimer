import {
		DEFAULT_CAMPUS,
		formatCampusLocation
	} from '@/config/campus'

	const PAGE_CONTENT = {
		currentLocation: '',
		menuText: '全部',
		actions: [{
				key: 'consultation',
				text: '预约面诊',
				variant: 'ghost'
			},
			{
				key: 'treatment',
				text: '预约治疗',
				variant: 'solid'
			}
		]
	}

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

	export default {
		data() {
			return {
				currentCampus: DEFAULT_CAMPUS,
				showDepartmentPopup: false,
				currentAction: null,
				selectedDepartmentId: DEPARTMENT_OPTIONS[0].id,
				departmentOptions: DEPARTMENT_OPTIONS,
				pageContent: {
					...PAGE_CONTENT,
					currentLocation: formatCampusLocation(DEFAULT_CAMPUS)
				}
			}
		},
		methods: {
			handleLocationTap() {
				uni.navigateTo({
					url: `/bundle/pages/campus/campus?mode=select&source=service&currentCampusId=${this.currentCampus.id}`,
					success: (res) => {
						res.eventChannel.on('campusSelected', ({
							campus
						}) => {
							this.currentCampus = campus
							this.pageContent.currentLocation = formatCampusLocation(campus)
						})
					}
				})
			},
			handleMenuTap() {
				uni.showToast({
					title: '服务分类待接入',
					icon: 'none'
				})
			},
			handleActionTap(action) {
				this.currentAction = action
				this.selectedDepartmentId = this.departmentOptions[0].id
				this.showDepartmentPopup = true
			},
			selectDepartment(departmentId) {
				this.selectedDepartmentId = departmentId
			},
			confirmDepartmentSelection() {
				const currentDepartment = this.departmentOptions.find((item) => item.id === this.selectedDepartmentId)
				this.showDepartmentPopup = false
				uni.navigateTo({
					url: `/bundle_service/pages/appointment_register/appointment_register?campusId=${this.currentCampus.id}&departmentId=${currentDepartment ? currentDepartment.id : ''}&actionKey=${this.currentAction ? this.currentAction.key : ''}`
				})
			}
		}
	}
