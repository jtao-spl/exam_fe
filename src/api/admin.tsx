import { message } from 'antd';
import { IGrade } from '../interfaces/Student';
import { ITeacherListResp } from '../interfaces/Teacher';
import request from '../utils/request';

/**
 * 查询教师列表
 * @param page 分页
 * @param limit 每页数量
 * @param containDeleted 是否包含已删除的数据 
 * @returns 
 */
export const getTeacherList = async (page: number = 1, limit: number = 10, containDeleted: boolean = true): Promise<ITeacherListResp | null> => {
    const res = await request({
        url: '/admin/teachers',
        method: 'get',
        params: { page: page, limit: limit, containDeleted: containDeleted }
    })
    const { code, msg, data, total } = res.data;
    if (code !== 0) {
        message.error(`获取教师列表失败，系统错误：${msg}`);
        return null
    }
    return {
        teachers: data,
        pageSize: limit,
        total: total
    };
}

/**
 * 录入教师账号
 * @param Name 姓名
 * @param Phone 电话
 */
export const createTeacher = async (Name: string, Phone: string): Promise<boolean> => {
    const res = await request({
        url: '/admin/teachers',
        method: 'post',
        data: { Name: Name, Phone: Phone }
    })
    const { code, msg } = res.data;
    if (code !== 0) {
        message.error(`录入教师信息失败，系统错误: ${msg}`);
        return false
    }
    message.info(`录入成功`);
    return true;
}

/**
 * 禁用/启用账号
 * @param Id 
 * @param Role
 * @returns 
 */
export const toggleStatus = async (Id: number, Role: number): Promise<boolean> => {
    const res = await request({
        url: `/admin/status/toggle/${Role}/${Id}`,
        method: 'patch'
    })
    const { code, msg } = res.data;
    if (code !== 0) {
        message.error(`切换状态失败，系统错误:${msg}`);
        return false;
    }
    message.info(`操作成功`);
    return true;
}

/**
 * 批量操作账号 
 */
export const batchToggleStatus = async (ids: number[], Role: number, disable: boolean): Promise<boolean> => {
    const res = await request({
        url: `/admin/batch/toggle/${Role}`,
        method: 'patch',
        data: { Ids: ids, disable: disable }
    })
    const { code, msg } = res.data;
    if (code !== 0) {
        message.error(`设置状态失败，系统错误:${msg}`);
        return false;
    }
    message.info(`操作成功`);
    return true;
}


/**
 * 重置账号密码
 * @param type 类型 0 表示教师 1表示学生
 * @param Name 
 * @returns 
 */
export const resetAccountPassword = async (type: number, Name: string) => {
    let Role = 3;
    if (type === 0) {
        Role = 2;
    }
    const res = await request({
        url: `/admin/password/reset`,
        method: 'patch',
        data: { Role: Role, Name: Name }
    })
    const { code, msg } = res.data;
    if (code !== 0) {
        message.error(`重置失败，系统错误:${msg}`);
        return
    }
    message.info(`重置成功。`)
}

/**
 * 新增年级专业
 * @param Grade 年级
 * @param Major 专业
 * @param ClassCount 班级数量
 */
export const createGrade = async (Grade: number, Major: string, ClassCount: number): Promise<boolean> => {
    const res = await request({
        url: '/admin/grade',
        method: 'post',
        data: { Grade: Grade, Major: Major, ClassCount: ClassCount }
    });
    const { code, msg } = res.data;
    if (code !== 0) {
        message.error(`操作失败，系统错误：${msg}`);
        return false;
    }
    return true;
}

/**
 * 查询年级列表
 * @param containDeleted 是否包含已删除数据
 * @returns 
 */
export const getGrades = async (containDeleted: boolean = false): Promise<IGrade[]> => {
    const res = await request({
        url: '/admin/grade',
        method: 'get',
        params: { containDeleted: containDeleted ? 1 : 0 }
    })
    const { code, msg, data } = res.data;
    if (code !== 0) {
        message.error(`查询失败，系统错误：${msg}`);
        return [];
    }
    return data;
}
/***
 * 删除年级
 */
export const deleteGrade = async (Id: number): Promise<boolean> => {
    const res = await request({
        url: `/admin/grade/${Id}`,
        method: 'delete'
    });
    const { code, msg } = res.data;
    if (code !== 0) {
        message.error(`删除失败，系统错误：${msg}`);
        return false;
    }
    return true;
}

/**
 * 查询单个年级专业详情
 * @param Id 
 * @returns 
 */
export const getGradeById = async (Id: number): Promise<IGrade | undefined> => {
    if (Id == 0) return;
    const res = await request({
        url: `/admin/grade/${Id}`,
        method: 'get'
    });
    const { code, msg, data } = res.data;
    if (code !== 0) {
        message.error(`查询年级失败，系统错误：${msg}`);
        return;
    }
    return data;
}

/**
 * 分班
 * @param ids 学号
 * @param Class 班级
 */
export const batchUpdateClass = async (ids: number[], Class: number): Promise<boolean> => {
    const res = await request({
        url: `/admin/students`,
        method: 'patch',
        data: { Ids: ids, Class: Class }
    });
    const { code, msg } = res.data;
    if (code !== 0) {
        message.error(`分班失败，系统错误：${msg}`);
        return false;
    }
    return true;
}