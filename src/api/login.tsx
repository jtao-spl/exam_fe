import request from '../utils/request';

export const login = (Id:number, password:string)=>{
    return request({
        url:'/login',
        method: 'post',
        data: {id: Id, password: password},
    })
}