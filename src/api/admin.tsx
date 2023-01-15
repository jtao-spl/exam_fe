import request from '../utils/request';

/**
 * 查询教师列表
 * @param page 分页
 * @param limit 每页数量
 * @param containDeleted 是否包含已删除的数据 
 * @returns 
 */
export const getTeacherList = (page: number=1, limit: number=10, containDeleted:boolean=true )=>{
    return request({
        url: '/admin/teachers',
        method: 'get',
        params: {page: page, limit: limit, containDeleted: containDeleted}
    })
}

/**
 * 录入教师账号
 * @param Name 姓名
 * @param Phone 电话
 */
 export const createTeacher = (Name:string, Phone:string)=>{
    return request({
        url: '/admin/teachers',
        method: 'post',
        data: {Name:Name, Phone:Phone}
    })
}

/**
 * 禁用/启动教师账号
 * @param Id 
 * @returns 
 */
export const toggleTeacherStatus = (Id: number)=>{
    return request({
        url: `/admin/teacher/${Id}/status/toggle`,
        method: 'patch'
    })
}

export const resetAccountPassword = (type: number, Name:string)=>{
    let Role=3;
    if(type===0){
        Role = 2;
    }
    return request({
        url:`/admin/password/reset`,
        method: 'patch',
        data: {Role: Role, Name: Name}
    })
}