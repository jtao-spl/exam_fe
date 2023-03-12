import { message } from 'antd';
import { ITeacher } from '../interfaces/Teacher';
import request from '../utils/request';

/**
 * 按id列表查询教师信息
 * @param ids 
 * @returns 
 */
export const getTeacherByIds = async (ids: string[]): Promise<ITeacher[]> => {
    const res = await request({
        url: '/teacher/seach',
        method: 'get',
        params: { Ids: ids }
    });
    const { code, msg, data } = res.data;
    if (code !== 0) {
        message.error(`查询失败，系统错误：${msg}`);
        return []
    }
    return data;

}