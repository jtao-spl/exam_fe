import axios from "axios";
import {message, Modal} from 'antd';
import NProgress from "nprogress";
import {clear, get} from './storage';
import {REACT_APP_BASE_API} from '../config/default'

const service = axios.create({
    baseURL: REACT_APP_BASE_API,
    timeout: 5000
})

service.interceptors.request.use(
    (config)=>{
        NProgress.start();
        if(config && config.headers){
            config.headers['Authorization'] = get('token');
        }
        return config;
    },
    error =>{
        NProgress.done();
        return Promise.reject(error);
    }
)
service.interceptors.response.use(
    response=>{
        NProgress.done();
        if(response.status===200){
            const {code} = response.data
            if(code ===4003){
                message.warning('登录态已丢失，请重新登录');
                return Promise.reject('请登录');
            }else if (code === 4000){
                clear();
                return Promise.reject('认证失败');
            }
            return response;
        }else{
            Modal.error({title:"网络请求错误"});
            return Promise.reject('网络请求错误');
        }
        
    },
    error=>{
        Modal.error({title:'网络请求错误'});
        NProgress.done();
        return Promise.reject(error);
    }
)
export default service