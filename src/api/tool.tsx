import { message } from 'antd';
import { ITool } from '../interfaces/Component';
import { IResp } from '../interfaces/Exam';
import request from '../utils/request';

/**
 * 获取工具列表
 * @param pg 页码
 * @param lmt 单页数量
 * @returns 
 */
export const getToolList = async (pg: number, lmt: number,): Promise<IResp<ITool> | undefined> => {
    const res = await request({
        url: '/tool',
        method: 'get',
        params: { page: pg, limit: lmt }
    });
    const { code, msg, data, total } = res.data;
    if (code !== 0) {
        message.error(`获取测量工具列表失败，系统错误：${msg}`);
        return;
    };
    return {
        items: data,
        pageSize: lmt,
        total: total
    }
}

/**
 * 删除工具
 * @param id 
 * @returns 
 */
export const deleteTool = async (id: number): Promise<boolean> => {
    const res = await request({
        url: `/tool/${id}`,
        method: 'delete',
    })
    const { code, msg } = res.data;
    if (code !== 0) {
        message.error(`删除工具失败，系统错误：${msg}`);
        return false;
    };
    return true
}

/**
 * 更改名称
 * @param id 
 * @param Name 
 * @returns 
 */
export const updateTool = async (id: number, Name: string): Promise<boolean> => {
    const res = await request({
        url: `/tool/${id}`,
        method: 'patch',
        data: { Name: Name }
    })
    const { code, msg } = res.data;
    if (code !== 0) {
        message.error(`更新失败，系统错误：${msg}`);
        return false;
    };
    return true
}

/**
 * 新增工具
 * @param Name 
 * @returns 
 */
export const createTool = async(Name:string):Promise<boolean>=>{
    const res = await request({
        url: `/tool`,
        method: 'post',
        data: { Name:Name }
    })
    const { code, msg } = res.data;
    if (code !== 0) {
        message.error(`创建失败，系统错误：${msg}`);
        return false;
    };
    return true
}