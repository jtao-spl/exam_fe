import request from '../utils/request';

export const login = (Id:number, password:string)=>{
    return request({
        url:'/auth/login',
        method: 'post',
        data: {id: Id, password: password},
    })
}

export const changePassword = (origin: string, newPwd: string)=>{
    return request({
        url: '/auth/modify',
        method: 'patch',
        data: {Password: origin, newPwd: newPwd}
    })
}