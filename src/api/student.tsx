import { message } from 'antd';
import { IGrade, IGradeClass, IStudent, IStudentInfo, IStudentQueryReq, IStudentUpload } from '../interfaces/Student';
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
    return [];
}

/**
 * 批量查询学生信息
 * @param req 学号列表  or 班级 
 * @returns 
 */
export const batchGetStudentInfo = async (req: IStudentQueryReq): Promise<IStudentInfo[]> => {
    const res = await request({
        url: '/student',
        method: 'get',
        params: req
    })
    const { code, msg, data } = res.data;
    if (code !== 0) {
        message.warn(`查询学生信息失败，暂时无法展示姓名,系统错误：${msg}`);
        return [];
    }
    const gradeIds:number[] = data.map((item: IStudent) => item.GradeId);
    const uniqIds = Array.from(new Set(gradeIds));
    const grades = await batchGetStudentGradeInfo(uniqIds);
    const result = data.map((item: IStudent) => {
        const grade = grades.filter((g: IGrade) => g.Id === item.GradeId);
        if (grade.length === 0) {
            return { StudentId: item.StudentId, Name: item.Name, Grade: 0, Major: '未知', Class: item.Class, Deleted: item.Deleted }
        }
        return { StudentId: item.StudentId, Name: item.Name, Grade: grade[0].Grade, Major: grade[0].Major, Class: item.Class, Deleted: item.Deleted }
    })
    return result;
}

/**
 * 查询班级表信息
 * @param ids 
 * @returns 
 */
const batchGetStudentGradeInfo = async (ids: number[]): Promise<IGrade[]> => {
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
    const { code, msg, data } = res.data;
    if (code !== 0) {
        message.error(`更新学生信息失败，系统错误：${msg}`);
        return false;
    }
    return true
}