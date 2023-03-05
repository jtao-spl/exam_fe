import { message } from 'antd';
import { IComponent, IComponentListResp } from '../interfaces/Component';
import { IEntityRequired } from '../interfaces/ExamCriteria';
import request from '../utils/request';

/**
 * 获取组件列表
 * @param page 页码
 * @param limit 每页数量
 * @returns 
 */
export const getComponentList = async (page: number = 1, limit: number): Promise<IComponentListResp | undefined> => {
    const res = await request({
        url: '/component',
        params: { page: page, limit: limit },
    })
    const { code, msg, data, total } = res.data;
    if (code !== 0) {
        message.error(`获取零件列表失败，系统错误：${msg}`);
        return;
    }
    return {
        components: data,
        total: total,
        pageSize: limit
    }
}

/**
 * 上传零件示意图
 * @param file 二进制图片资源
 * @param componentId 组件id
 * @returns 
 */
export const saveComponentClip = async (file: any, componentId: number): Promise<boolean> => {
    let formData = new FormData();
    formData.append('file', file);
    const res = await request({
        url: `/clip/${componentId}/upload`,
        method: 'post',
        data: formData,
        headers: { 'Content-type': 'multipart/form-data' }
    });
    const { code, msg } = res.data;
    if (code !== 0) {
        message.error(`上传失败，系统错误：${msg}`);
        return false
    }
    return true;
}

export const downloadOriginFile = (componentId: number) => {
    const res = request({
        url: `clip/${componentId}/download`,
        method: 'post'
    })
}

/**
 * 自定义组件名字
 * @param name 组件名
 * @param componentId 组件id 
 * @returns 
 */
export const SaveComponentName = async (name: string, componentId: number): Promise<boolean> => {
    const res = await request({
        url: `/component/${componentId}`,
        method: 'patch',
        data: { ComponentName: name, Status: 2 },
    });
    const { code, msg } = res.data;
    if (code !== 0) {
        message.error(`零件重命名失败，系统错误：${msg}`);
        return false
    }
    return true;
}

/**
 * 通过id查找组件
 * @param id 组件id
 * @returns 
 */
export const getComponentById = async (id: number): Promise<IComponent | undefined> => {
    const res = await request({
        url: `/component/${id}`,
        method: 'get',
    })
    const { code, msg, data } = res.data;
    if (code !== 0) {
        message.error(`查询失败，系统错误${msg}`);
        return
    }
    return data;
}

/**
 * 软删除组件
 * @param id 组件id 
 * @returns 
 */
export const deleteComponent = async (id: number): Promise<boolean> => {
    const res = await request({
        url: `/component/${id}`,
        method: 'delete'
    })
    const { msg } = res.data;
    if (msg !== "success") {
        message.error(`删除零件失败:${msg}`);
        return false
    }
    return true
}
/**
 * 获取组件数量
 */
export const getComponentCount = async():Promise<number> => {
    const res = await request({
        url: '/component/count',
        method: 'get'
    })
    const {code, msg,data} = res.data;
    if(code !== 0){
        message.error(`获取组件总量失败，系统错误：${msg}`);
        return 0
    };
    return data.count;
}

/**
 * 获取组件考核标准需要涉及的类型
 * @param id 
 * @returns 
 */
export const getComponentCriteriaTypes = async (id: number):Promise<IEntityRequired[]> => {
    const res = await request({
        url: '/component/criterials',
        method: 'get',
        params: { ComponentId: id }
    });
    const { code, msg, data } = res.data;
    if (code !== 0) {
        message.error(`获取零件${id}的评测项失败，系统错误：${msg}`);
        return [];
    }
    return data;
}

/**
 * 设置组件编辑的步骤/状态
 * @param id 组件id
 * @param status 状态值
 * @returns 
 */
export const updateComponentStatus = async (id: number, status: number): Promise<boolean> => {
    const res = await request({
        url: `/component/${id}`,
        method: 'patch',
        data: { Status: status },
    })
    const { code, msg } = res.data;
    if (code !== 0) {
        message.error(`更新组件状态出错，系统错误${msg}`);
        return false;
    }
    message.success(`更新组件状态成功`);
    return true;
}