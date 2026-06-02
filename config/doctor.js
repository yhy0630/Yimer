export const DOCTOR_DETAILS = [
	{
		id: 'light',
		name: 'Light医生',
		title: '主治医师',
		avatar: '/static/linshi/01.png',
		heroImage: '/static/linshi/02.png',
		tags: ['光电专家', '注射微整'],
		description: 'Light 医生从事临床工作十余年，专注面部年轻化、肤质改善和个性化联合治疗方案。',
		summary: '主任医师专注皮肤美容与面部年轻化领域多年，擅长光电抗衰、注射微整、色斑管理及痤疮修复等项目。',
		heroDots: 3,
		heroDotIndex: 1,
		sections: [
			{
				title: '医师资格证',
				rows: [{ label: '证书编号', value: '202512110**************0729' }]
			},
			{
				title: '医师执业证',
				rows: [
					{ label: '证书编号', value: '202512110**************0729' },
					{ label: '医师级别', value: '主治医师' },
					{ label: '发证机关', value: '北京市朝阳区卫健委' }
				]
			},
			{
				title: '执业地',
				rows: [{ label: '主执业机构', value: '北京伊美尔' }]
			}
		]
	},
	{
		id: 'ridjk-a',
		name: 'Ridjk医生',
		title: '主诊医师',
		avatar: '/static/linshi/02.png',
		heroImage: '/static/linshi/02.png',
		tags: ['光电专家', '注射微整', '五官塑形'],
		description: '擅长光电抗衰与轮廓精修，注重自然感和恢复期管理，临床沟通细致稳定。',
		summary: '主诊医师长期深耕面部轮廓精修与注射年轻化管理，兼顾自然审美、恢复周期与个体化方案设计。',
		heroDots: 3,
		heroDotIndex: 1,
		sections: [
			{
				title: '医师资格证',
				rows: [{ label: '证书编号', value: '202410310**************1846' }]
			},
			{
				title: '医师执业证',
				rows: [
					{ label: '证书编号', value: '202410310**************1846' },
					{ label: '医师级别', value: '主诊医师' },
					{ label: '发证机关', value: '北京市海淀区卫健委' }
				]
			},
			{
				title: '执业地',
				rows: [{ label: '主执业机构', value: '北京伊美尔国贸门诊部' }]
			}
		]
	},
	{
		id: 'ridjk-b',
		name: 'Ridjk医生',
		title: '皮肤美容医师',
		avatar: '/static/linshi/03.png',
		heroImage: '/static/linshi/02.png',
		tags: ['皮肤治疗', '抗衰管理', '面部提升'],
		description: '长期聚焦面部抗衰和综合治疗，强调分层设计与术后跟踪，经验覆盖多类复诊场景。',
		summary: '皮肤美容医师聚焦肤质重建、色斑管理与面部提升治疗，擅长以分层方案串联面诊、治疗与复诊护理。',
		heroDots: 3,
		heroDotIndex: 1,
		sections: [
			{
				title: '医师资格证',
				rows: [{ label: '证书编号', value: '202311080**************5631' }]
			},
			{
				title: '医师执业证',
				rows: [
					{ label: '证书编号', value: '202311080**************5631' },
					{ label: '医师级别', value: '皮肤美容医师' },
					{ label: '发证机关', value: '北京市朝阳区卫健委' }
				]
			},
			{
				title: '执业地',
				rows: [{ label: '主执业机构', value: '北京伊美尔光华 SOHO 店' }]
			}
		]
	}
]

export const DOCTOR_LIST = DOCTOR_DETAILS.map((doctor) => ({
	id: doctor.id,
	name: doctor.name,
	avatar: doctor.avatar,
	tags: doctor.tags,
	description: doctor.description
}))

export const DEFAULT_DOCTOR = DOCTOR_DETAILS[0]

export function getDoctorById(id) {
	return DOCTOR_DETAILS.find((doctor) => doctor.id === id) || DEFAULT_DOCTOR
}
