export const PAYMENT_BILLS = Object.freeze([
	{
		id: 'bill-001',
		title: '订单 610********0989',
		orderNo: '610********0989',
		amount: '2156.00',
		status: 'pending',
		summaryFields: [
			{
				label: '开单院区',
				value: '伊美尔北京光华Soho2期店'
			},
			{
				label: '治疗项目',
				value: '玻尿酸填充联合光子嫩肤'
			},
			{
				label: '开单时间',
				value: '2026-02-15 11:05'
			}
		],
		confirmFields: [
			{
				label: '就诊院区',
				value: '伊美尔北京光华Soho2期店'
			},
			{
				label: '就诊科室',
				value: '整形外科'
			},
			{
				label: '开单人',
				value: '张三'
			},
			{
				label: '客户姓名',
				value: '李四'
			},
			{
				label: '订单编号',
				value: '610********0989'
			}
		],
		feeItems: [
			{
				id: 'fee-001',
				name: '玻尿酸填充',
				unitPrice: '340.00',
				quantity: 2,
				amount: '680.00'
			},
			{
				id: 'fee-002',
				name: '光子嫩肤治疗',
				unitPrice: '738.00',
				quantity: 2,
				amount: '1476.00'
			}
		]
	},
	{
		id: 'bill-002',
		title: '订单 610********0752',
		orderNo: '610********0752',
		amount: '980.00',
		status: 'paid',
		summaryFields: [
			{
				label: '开单院区',
				value: '伊美尔北京望京院区'
			},
			{
				label: '治疗项目',
				value: '水光焕肤护理'
			},
			{
				label: '开单时间',
				value: '2026-02-08 14:30'
			}
		],
		confirmFields: [
			{
				label: '就诊院区',
				value: '伊美尔北京望京院区'
			},
			{
				label: '就诊科室',
				value: '美容皮肤科'
			},
			{
				label: '开单人',
				value: '王医生'
			},
			{
				label: '客户姓名',
				value: '韩梅梅'
			},
			{
				label: '订单编号',
				value: '610********0752'
			}
		],
		feeItems: [
			{
				id: 'fee-003',
				name: '水光焕肤护理',
				unitPrice: '490.00',
				quantity: 2,
				amount: '980.00'
			}
		]
	}
])

export const DEFAULT_PAYMENT_BILL = PAYMENT_BILLS[0]

export function getPaymentBillById(id) {
	return PAYMENT_BILLS.find((item) => item.id === id) || DEFAULT_PAYMENT_BILL
}
