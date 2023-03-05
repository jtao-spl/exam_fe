import { message } from 'antd';
import request from '../utils/request';

export const login = (Id: number, password: string) => {
    return request({
        url: '/auth/login',
        method: 'post',
        data: { id: Id, password: password },
    })
}

export const changePassword = async(origin: string, newPwd: string): Promise<boolean> => {
    const res = await request({
        url: '/auth/modify',
        method: 'patch',
        data: { Password: origin, newPwd: newPwd }
    });
    const { code, msg } = res.data;
    if (code !== 0) {
        message.error(`修改密码失败，系统错误：${msg}`);
        return false
    }
    message.info(`修改密码成功`);
    return true
}