import axios from "axios";
import { message, Modal } from 'antd';
import NProgress from "nprogress";
import { clear, get, set } from './storage';
import { REACT_APP_BASE_API } from '../config/default';

const service = axios.create({
    baseURL: REACT_APP_BASE_API,
    timeout: 5000
})

service.interceptors.request.use(
    config => {
        NProgress.start();
        if (config && config.headers) {
            // console.log(`config in axios: ${JSON.stringify(config)}`);
            const { url } = config;
            if (url && (!url.startsWith('/login') || !url.startsWith('/register'))) {
                //当请求路径不是这两个的时候, 添加token请求头
                // config.headers.Authorization = get('token');
                const user_token = get('user_token');
                if (user_token){
                    config.headers['Authorization'] = `Bearer ${get('user_token')}`;
                }
            }
        }
        return config;
    },
    error => {
        NProgress.done();
        return Promise.reject(error);
    }
)
service.interceptors.response.use(
    response => {
        NProgress.done();
        if (response.status === 200) {
            // console.log(`response in axios interceptor: ${JSON.stringify(response)}`);
            const { code, msg, token, role } = response.data;
            if (token){
                set(`user_token`, token);
                set(`role`, role);
            }
            if (code === 6) {
                message.warning(`${msg}`);
                // window.location.href='/login'
            } else if (code === 400) {
                clear();
                // window.location.href='/login';
                message.warning(`登录态已过期，请重新登录。`);
            }
            return response;
        }
        else {
            Modal.error({ title: "网络请求错误" });
            return Promise.reject('网络请求错误');
        }

    },
    error => {
        Modal.error({ title: '网络请求错误' });
        NProgress.done();
        return Promise.reject(error);
    }
)
export default service