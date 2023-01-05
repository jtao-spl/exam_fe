import request from '../utils/request';

export const getComponentList = (page:number=1, limit:number)=>{
    return request({
        url:'/component',
        params: {page: page, limit: limit},
    })
}

export const saveComponentClip = (file: any, componentId: number)=>{
    console.log('start upload request using axios');
    let formData = new FormData();
    formData.append('file', file);
    const res = request({
        url:`/clip/${componentId}/upload`,
        method: 'post',
        data: formData, 
        headers: {'Content-type':'multipart/form-data'}
    });
    return res;
}

export const downloadOriginFile =(componentId: number)=>{
    const res = request({
        url:`clip/${componentId}/download`,
        method: 'post'
    })
}

export const SaveComponentName = (name: string, componentId: number)=>{
    const res = request({
        url:`/component/${componentId}`,
        method: 'patch',
        data: {ComponentName: name, Status: 2}, 
    });
    return res;
}

export const getComponentById = (id:number)=>{
    return request({
        url:`/component/${id}`,
        method: 'get',
    })
}

export const deleteComponent = (id: number)=>{
    return request({
        url: `/component/${id}`,
        method: 'delete'
    })
}
export const getComponentCount = () => {
    return request({
        url: '/component/count',
        method:'get'
    })
}

export const getComponentCriteriaTypes = (id: number)=>{
    return request({
        url: '/component/creterials',
        method: 'get',
        params: {ComponentId: id}
    });
}
export const updateComponentStatus = (id: number, status: number)=>{
    return request({
        url: `/component/${id}`,
        method: 'patch',
        data: {Status: status}, 
    })
}