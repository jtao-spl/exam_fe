import { ISize } from '../pages/size/SizeList';
import request from '../utils/request';

export const getSizeList = (page: number = 1, limit: number = 10, ComponentId: number = 0) => {
    return request({
        url: '/size',
        method: 'get',
        params: { page: page, limit: limit, ComponentId: ComponentId },
    })
}
export const getSizeCountByComponentId = (ComponentId: number) => {
    return request({
        url: '/size/count',
        method: 'get',
        params: { ComponentId: ComponentId }
    })
}
export const updateSize = (size: ISize, values: any) => {
    let data;
    const { Id, FirstType, ComponentId } = size;
    if (FirstType === 0) {
        data = { ComponentId: ComponentId, BaseSize: values.BaseSize, UpSize: values.UpSize, BottomSize: values.BottomSize };
    }
    if (FirstType === 1) {
        data = { ComponentId: ComponentId, GeoToleranceVal: values.GeoToleranceVal };
    }
    if (FirstType === 2) {
        data = { ComponentId: ComponentId, SurfaceRoughnessVal: values.SurfaceRoughnessVal }
    }
    return request({
        url: `/size/${Id}`,
        method: 'put',
        data: data
    })
}

export const deleteSize = (id: number) => {
    return request({
        url: `/size/${id}`,
        method: 'delete'
    })
}

export const saveSize = (size: ISize) => {
    return request({
        url: `/size`,
        method: `post`,
        data: size
    })
}