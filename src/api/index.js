import ajax from '../utils/request'


// 请求轮播图
export const reqGetSwiper = () => ajax.get('http://localhost:8080/home/swiper')

// 请求租房小组

export const reqGetGroups = (params) => ajax.get('http://localhost:8080/home/groups', { params})


// 请求最新资讯

export const reqGetNews = (params) => ajax.get('http://localhost:8080/home/news', { params})