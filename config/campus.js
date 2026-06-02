export const CAMPUS_LIST = [
	{
		id: 'guanghua-soho2',
		name: '\u4f0a\u7f8e\u5c14\u533b\u7597\u673a\u6784(\u5317\u4eac\u5149\u534eSoHo2\u5e97)No.001',
		shortName: '\u5317\u4eac\u5149\u534eSoHo2\u5e97',
		address: '\u5317\u4eac\u5e02\u671d\u9633\u533a\u5149\u534e\u8defSOHO2',
		tag: '\u5230\u9662\u8fc7',
		tagTone: 'accent',
		distance: '1.5km',
		image: '/static/linshi/03.png'
	},
	{
		id: 'wangjing',
		name: '\u4f0a\u7f8e\u5c14\u533b\u7597\u673a\u6784(\u5317\u4eac\u671b\u4eac\u9662\u533a)No.002',
		shortName: '\u5317\u4eac\u671b\u4eac\u9662\u533a',
		address: '\u5317\u4eac\u5e02\u671d\u9633\u533a\u961c\u901a\u4e1c\u5927\u88576\u53f7\u9662',
		tag: '\u8ddd\u79bb\u6700\u8fd1',
		tagTone: 'default',
		distance: '1.5km',
		image: '/static/linshi/04.png'
	},
	{
		id: 'guomao',
		name: '\u4f0a\u7f8e\u5c14\u533b\u7597\u673a\u6784(\u5317\u4eac\u56fd\u8d38\u95e8\u8bca\u90e8)No.003',
		shortName: '\u5317\u4eac\u56fd\u8d38\u95e8\u8bca\u90e8',
		address: '\u5317\u4eac\u5e02\u671d\u9633\u533a\u5efa\u56fd\u95e8\u5916\u5927\u88578\u53f7',
		tag: '\u8ddd\u79bb\u6700\u8fd1',
		tagTone: 'default',
		distance: '1.5km',
		image: '/static/linshi/05.png'
	}
]

export const DEFAULT_CAMPUS = CAMPUS_LIST[0]

export function getCampusById(id) {
	return CAMPUS_LIST.find((campus) => campus.id === id) || DEFAULT_CAMPUS
}

export function formatCampusLocation(campus) {
	const resolvedCampus = campus || DEFAULT_CAMPUS
	return `\u5f53\u524d\u9662\u533a\uff1a${resolvedCampus.shortName}`
}
