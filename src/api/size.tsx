import { message } from 'antd';
import { ISize, ISizeListResp } from '../interfaces/Size';
import request from '../utils/request';

/**
 * 获取零件的尺寸列表
 * @param page 页码
 * @param limit 每页数量
 * @param ComponentId 所属组件id
 * @returns 
 */
export const getSizeList = async (page: number = 1, limit: number = 10, ComponentId: number = 0): Promise<ISizeListResp | null> => {
    const res = await request({
        url: '/size',
        method: 'get',
        params: { page: page, limit: limit, ComponentId: ComponentId },
    })
    let { code, msg, data, total } = res.data;
    if (code !== 0) {
        message.error(`查询尺寸数据失败，系统错误:${msg}`);
        return null;
    }
    //设置尺寸类型颜色
    const sizesWithColor: ISize[] = data.map((size: ISize) => {
        size.Color = size?.FirstType === 0 ? 'blue' : size?.FirstType === 1 ? 'red' : size?.FirstType === 2 ? 'green' : 'grey';
        return size
    })
    //排序
    sizesWithColor.sort((a: ISize, b: ISize) => { return a.FirstType - b.FirstType });
    return {
        sizes: sizesWithColor,
        pageSize: limit,
        total: total
    }
}

/**
 * 获取组件id关联的尺寸数量
 * @param ComponentId 组件id
 * @returns 
 */
export const getSizeCountByComponentId = async (ComponentId: number): Promise<number> => {
    const res = await request({
        url: '/size/count',
        method: 'get',
        params: { ComponentId: ComponentId }
    })
    const { code, msg, data } = res.data;
    if (code !== 0) {
        message.error(`访问零件尺寸数量失败，系统错误：${msg}`);
        return 0;
    }
    return data.count;
}

/**
 * 更新尺寸数据
 * @param size 尺寸
 * @param values 更新的类型及对应的值
 * @returns 
 */
export const updateSize = async (size: ISize, values: any): Promise<boolean> => {
    let data;
    const { Id, FirstType, ComponentId } = size;
    if (FirstType === 0) {
        data = { ComponentId: ComponentId, BaseSize: values.BaseSize, UpSize: values.UpSize, BottomSize: values.BottomSize };
    }
    if (FirstType === 1) {
        data = { ComponentId: ComponentId, GeoToleranceVal: values.GeoToleranceVal };
    }
    if (FirstType === 2) {
        data = { ComponentId: ComponentId, SurfaceRoughnessCount: values.SurfaceRoughnessCount }
    }
    if (FirstType === 3) {
        data = { ComponentId: ComponentId, UnDeclaredChamferCount: values.UnDeclaredChamferCount }
    }
    const res = await request({
        url: `/size/${Id}`,
        method: 'put',
        data: data
    })
    if (res.data.code !== 0) {
        message.error(`保存失败，错误详情：${res.data.msg}`);
        return false;
    }
    message.success('更新尺寸数据成功');
    return true;

}

/**
 * 删除尺寸
 * @param id 尺寸id
 */
export const deleteSize = async (id: number): Promise<boolean> => {
    const res = await request({
        url: `/size/${id}`,
        method: 'delete'
    })
    const { code, msg } = res.data;
    if (code !== 0) {
        message.error(`删除失败，系统错误：${msg}`);
        return false;
    }
    message.success('删除成功');
    return true
}
/**
 * 新建尺寸
 * @param size ISize
 * @returns 
 */
export const saveSize = async (size: ISize): Promise<boolean> => {
    const res = await request({
        url: `/size`,
        method: `post`,
        data: size
    });
    const { code, msg } = res.data;
    if (code !== 0) {
        message.error(`新建尺寸失败，系统错误: ${msg}`);

        return false
    }
    message.success('新建尺寸成功');
    return true

}