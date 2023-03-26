import { message } from 'antd';
import { IDeliverDetail, IExamDeliverEntity, IResp } from '../interfaces/Exam';
import { IGrade, IGradeClass, IGroupInfo, IStudent, IStudentInfo, IStudentInfoWithGroup, IStudentQueryReq, IStudentUpload } from '../interfaces/Student';
import request from '../utils/request';

/**
 * 批量保存学生信息
 * @param GradeId 年级id
 * @param students 学生列表
 * @returns 
 */
export const saveStudents = async (GradeId: number, students: IStudentUpload[]): Promise<boolean> => {
    const res = await request({
        url: '/admin/students',
        method: 'post',
        data: { students: students, GradeId: GradeId }
    })
    const { code, msg } = res.data;
    if (code !== 0) {
        message.error(`保存学生信息失败，系统错误：${msg}`);
        return false
    }
    message.info(`保存学生信息成功`);
    return true
}

/**
 * 查询系统中存在的年级he班级信息 用于下发考核时的筛选
 * @returns 
 */
export const getAllGradeClass = async (): Promise<IGradeClass[]> => {
    const res = await request({
        url: '/student/gradeclass',
        method: 'get'
    });
    const { code, msg, data } = res.data;
    if (code !== 0) {
        message.error(`查询年级&班级信息失败，系统错误：${msg}`);
        return [];
    }
    return [];//TODO:
}

/**
 * 批量查询学生信息
 * @param req 学号列表  or 班级
 * @param GroupInfoRequired 是否返回分组信息
 * @returns 
 */
export const batchGetStudentInfo = async (req: IStudentQueryReq, GroupInfoRequired: boolean = false): Promise<IStudentInfoWithGroup[]> => {
    const res = await request({
        url: '/student',
        method: 'get',
        params: req
    })
    const { code, msg, data } = res.data;
    if (code !== 0) {
        message.warn(`查询学生信息失败,系统错误：${msg}`);
        return [];
    }
    const gradeIds: number[] = data.map((item: IStudent) => item.GradeId);
    const uniqIds = Array.from(new Set(gradeIds));
    const grades = await batchGetStudentGradeInfo(uniqIds);
    let groupInfo: IGroupInfo | null = null
    //仅支持教师侧查询分组，因为每个教师的设置都不一样，管理员侧没法看。然后教师侧每次仅支持单班级的配置。
    if (GroupInfoRequired && data.length > 0) {
        groupInfo = await getGroupInfo(gradeIds[0], data[0].Class, 'A');
    }
    const result = data.map((item: IStudent) => {
        const grade = grades.filter((g: IGrade) => g.Id === item.GradeId);
        let ret;
        if (grade.length === 0) {
            ret = { StudentId: item.StudentId, Name: item.Name, Grade: 0, Major: '未知', Class: item.Class, Deleted: item.Deleted, Group: '待定' }
        } else {
            ret = { StudentId: item.StudentId, Name: item.Name, Grade: grade[0].Grade, Major: grade[0].Major, Class: item.Class, Deleted: item.Deleted, Group: '待定' }
        }
        if (GroupInfoRequired) {
            if (groupInfo !== null) {
                if (groupInfo.StudentIds.includes(item.StudentId)) {
                    ret.Group = 'A'
                } else {
                    ret.Group = 'B'
                }
            }
        }
        return ret
    })
    return result;
}

/**
 * 查询班级表信息
 * @param ids 
 * @returns 
 */
export const batchGetStudentGradeInfo = async (ids?: number[]): Promise<IGrade[]> => {
    const res = await request({
        url: '/student/grade',
        method: 'get',
        params: { ids: ids }
    });
    const { code, msg, data } = res.data;
    if (code !== 0) {
        message.error(`查询班级信息失败，系统错误：${msg}`);
        return [];
    }
    return data;

}

/**
 * 更新学生信息
 * @param student 
 * @returns 
 */
export const updateStudentInfo = async (student: IStudentInfo): Promise<boolean> => {
    const res = await request({
        url: `/student/${student.StudentId}`,
        method: 'patch',
        data: student
    });
    const { code, msg } = res.data;
    if (code !== 0) {
        message.error(`更新学生信息失败，系统错误：${msg}`);
        return false;
    }
    return true
}

/**
 * 新建或更新学生分组
 * @param Grade 年级
 * @param Major 专业
 * @param Class 班级
 * @param ids 学生id列表
 * @returns 
 */
export const createOrUpdateGroup = async (Grade: number, Major: string, Class: number, ids: number[]): Promise<boolean> => {
    const res = await request({
        url: '/student/group',
        method: 'post',
        data: { Grade, Major, Class, ids }
    });
    const { code, msg } = res.data;
    if (code !== 0) {
        message.error(`保存失败，系统错误：${msg}`);
        return false;
    }
    return true;
}

/**
 * 查询当前用户对指定年级专业班级的分组信息
 * @param GradeId 
 * @param Class 
 * @param GroupName
 * @returns 
 */
export const getGroupInfo = async (GradeId: number, Class: number, GroupName: string): Promise<IGroupInfo | null> => {
    const res = await request({
        url: '/student/group',
        method: 'get',
        params: { GradeId, Class, GroupName }
    });
    const { code, msg, data } = res.data;
    if (code !== 0) {
        message.error(`查询失败，系统错误：${msg}`);
        return null;
    }
    return data;
}

/**
 * 查询当前用户设置的所有分组信息
 * @returns 
 */
export const getGroupInfos = async (): Promise<IGroupInfo[]> => {
    const res = await request({
        url: '/student/group/all',
        method: 'get',
    })
    const { code, msg, data } = res.data;
    if (code !== 0) {
        message.error(`查询失败，系统错误：${msg}`);
        return [];
    }
    return data;
}

/**
 * 分页查询考试列表
 * @param page 
 * @param limit 
 * @param status 
 * @returns 
 */
export const studentGetDeliverList = async (page: number, limit: number, status: number): Promise<IResp<IExamDeliverEntity> | null> => {
    const res = await request({
        url: `/student/deliver/list`,
        method: 'get',
        params: { page, limit, status }
    })
    const { code, msg, data, total } = res.data;
    if (code !== 0) {
        message.error(`查询失败，系统错误：${msg}`);
        return null;
    }
    return {
        items: data,
        pageSize: page,
        total: total
    }
}

/**
 * 获取本班级待复测的考核列表
 * @param page 
 * @param limit 
 * @returns 
 */
export const getClassPendingList = async (page: number, limit: number): Promise<IResp<IExamDeliverEntity> | null> => {
    const res = await request({
        url: `/student/class/deliver/list`,
        method: 'get',
        params: { page, limit }
    })
    const { code, msg, data, total } = res.data;
    if (code !== 0) {
        message.error(`查询失败，系统错误：${msg}`);
        return null;
    }
    return {
        items: data,
        pageSize: page,
        total: total
    }
}
/**
 * 获取指定考核中待提交复测数据的考卷列表
 * @param id 
 * @returns 
 */
export const getDeliverDetailsByDeliverId = async (id: number): Promise<IDeliverDetail[]> => {
    if(id === 0) return []
    const res = await request({
        url: `/student/details`,
        method: 'get',
        params: { id, Status:1 }
    })
    const { code, msg, data } = res.data;
    if (code !== 0) {
        message.error(`查询失败，系统错误：${msg}`);
        return [];
    }
    return data;
}
