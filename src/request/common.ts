const http = uni.$u.http;
// 初始化请求配置
http.setConfig((config: any) => {
  /* config 为默认全局配置*/
  config.baseURL = "http://127.0.0.1:4000/"; /* 根域名 */
  return config;
});

// 请求拦截
http.interceptors.request.use(
  (config: any) => {
    // 可使用async await 做异步操作
    // 初始化请求拦截器时，会执行此方法，此时data为undefined，赋予默认{}
    config.data = config.data || {};
    // 根据custom参数中配置的是否需要token，添加对应的请求头
    // if(config?.custom?.auth) {
    // 	// 可以在此通过vm引用vuex中的变量，具体值在vm.$store.state中
    // 	config.header.token = vm.$store.state.userInfo.token
    // }
    return config;
  },
  (config: any) => {
    // 可使用async await 做异步操作
    return Promise.reject(config);
  }
);

// 响应拦截
http.interceptors.response.use(
  (response: any) => {
    /* 对响应成功做点什么 可使用async await 做异步操作*/
    return response.data;
  },
  (response: any) => {
    // 对响应错误做点什么 （statusCode !== 200）
    return Promise.reject(response);
  }
);

export default http;
