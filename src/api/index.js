import ajax from '../utils/request'


// 请求轮播图
export const reqGetSwiper = () => ajax.get('http://localhost:8080/home/swiper')

// 请求租房小组

export const reqGetGroups = (params) => ajax.get('http://localhost:8080/home/groups', { params })


// 请求最新资讯

export const reqGetNews = (params) => ajax.get('/home/news', { params })

// 请求城市信息

export const reqGetCityInfo = (params) => ajax.get(`/area/info`, { params })

// 请求城市列表数据

export const reqGetCityList = (params) => ajax.get(`/area/city`, { params })

// 请求热门城市

export const reqGetHotCity = () => ajax.get(`/area/hot`)

//  请求房源信息
export const reqGetMap = (id) => ajax.get(`/area/map?id=${id}`)


// 请求小区房源信息
export const reqGetHouses = (id) => ajax.get(`/houses?cityid${id}`)