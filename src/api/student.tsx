import { IStudentInfo } from '../pages/upload/StudentPreview';
import request from '../utils/request';

export const saveStudents = (students: IStudentInfo[]) => {
    return request({
        url: '/student',
        method: 'post',
        data: { students: students }
    })
}

/**
 * 查询系统中存在的年级he班级信息 用于下发考核时的筛选
 * @returns 
 */
export const getAllGradeClass = () => {
    return request({
        url: '/student/gradeclass',
        method: 'get'
    });
}

/**
 * 批量查询学生信息
 * @param ids 
 * @returns 
 */
export const batchGetStudentInfo = (ids: number[]) => {
    return request({
        url: '/student',
        method: 'get',
        params: { StudentIds: ids }
    })
}