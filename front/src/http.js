// HTTP 模块 — 替代 layui.http，基于 Axios
const BASE_URL = 'http://localhost:8080/';

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

// 请求拦截器：注入 Token
http.interceptors.request.use(config => {
  const token = localStorage.getItem('Token');
  if (token) {
    config.headers['Token'] = token;
  }
  // 添加缓存破坏参数
  if (config.method === 'get') {
    config.params = config.params || {};
    config.params.t = Date.now();
  }
  return config;
});

// 响应拦截器：统一处理错误
http.interceptors.response.use(
  response => {
    const result = response.data;
    if (result.code === 0) {
      return result;
    } else if (result.code === 401 || result.code === 403) {
      localStorage.removeItem('Token');
      localStorage.removeItem('role');
      localStorage.removeItem('userTable');
      localStorage.removeItem('sessionTable');
      localStorage.removeItem('adminName');
      localStorage.removeItem('userid');
      window.location.href = '/index.html#/login?t=' + Date.now();
      return Promise.reject(result);
    } else {
      ElMessage.error(result.msg || '请求失败');
      return Promise.reject(result);
    }
  },
  error => {
    ElMessage.error('请求接口失败');
    return Promise.reject(error);
  }
);

// API 方法
const api = {
  baseurl: BASE_URL,

  get(url, params) {
    return http.get(url, { params });
  },

  post(url, data) {
    const params = new URLSearchParams();
    if (data) {
      Object.keys(data).forEach(key => {
        params.append(key, data[key]);
      });
    }
    return http.post(url, params);
  },

  postJson(url, data) {
    return http.post(url, data, {
      headers: { 'Content-Type': 'application/json' }
    });
  },

  upload(file) {
    const formData = new FormData();
    formData.append('file', file);
    return http.post('file/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  getParam(name) {
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    const r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
  }
};
