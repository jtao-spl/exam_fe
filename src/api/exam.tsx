import { IExam } from '../pages/exam/ExamList';
import request from '../utils/request';

export const saveExam = (exam: IExam) => {
    return request({
        url: '/exam',
        method: 'post',
        data: exam
    })
}

export const getExamList = (page: number, limit: number = 10, ExamComponent: number = 0, Status?: number) => {
    let params: {
        page: number,
        limit: number,
        ExamComponent: number,
        Status?: number
    } = { page: page, limit: limit, ExamComponent: ExamComponent }
    if (Status) {
        params = { Status: Status, ...params }
    }
    return request({
        url: '/exam',
        method: 'get',
        params: params
    })
}
export const saveExamCriteria = (criteria: any, ExamId: number) => {
    return request({
        url: '/exam/criteria',
        method: 'post',
        data: criteria,
        params: { ExamId: ExamId }
    })
}
export const getExamCriteriaApi = (CriteriaId: number) => {
    return request({
        url: '/exam/criteria',
        method: 'get',
        params: { CriteriaId: CriteriaId }
    })
}
export const getExamById = (Id: number) => {
    return request({
        url: `/exam/${Id}`,
        method: 'get',
    })
}
export const saveExamScores = (scores: any, ExamId: number) => {
    return request({
        url: '/exam/scores',
        method: 'post',
        data: { scores: scores },
        params: { ExamId: ExamId }
    })
}

/**
 * 下发考核时需要指定年级he班级
 * @param examId 考核id
 * @param Status 考核状态  0 未发放 1 已发放  2 已收卷
 * @param Grade 年级
 * @param Class 班级
 * @returns 
 */
export const setExamStatusApi = (examId: number, Status: number, Grade?: number, Class?: number) => {
    let data: { Status: number, Grade?: number, Class?: Number } = { Status: Status }
    if (Grade && Class) {
        data = { ...data, Grade: Grade, Class: Class }
    }
    return request({
        url: `/exam/${examId}`,
        method: 'patch',
        data: data
    })
}

export const saveExamTarget = (Name: string) => {
    return request({
        url: `/exam/target`,
        method: 'post',
        data: { Name: Name }
    })
}

export const getExamTarget = () => {
    return request({
        url: `/exam/target`,
        method: 'get'
    })
}