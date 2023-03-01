import  { ExamScoreData } from '../pages/student/Exam';
import request from '../utils/request';

export const saveExamScore = (ExamId: number, data: ExamScoreData[], score: number, type: string, studentId: number) => {
    if (type === 'self') {
        return request({
            url: '/score',
            method: 'POST',
            data: { ExamId: ExamId, SelfData: data, SelfScore: score }
        })
    }
    else if (type === 'group'){
        return request({
            url: '/score',
            method: 'POST',
            data: { ExamId: ExamId, GroupData: data, GroupScore: score }
        })
    }
    else{
        return request({
            url: '/score',
            method: 'POST',
            data: { ExamId: ExamId, FinalData: data, FinalScore: score, StudentId: studentId }
        })
    }
}

/**
 * 获取考核成绩数据
 * @param ExamId 
 * @returns 
 */
export const getExamScore = (ExamId: number)=>{
    return request({
        url: '/score',
        method: 'get',
        params: {ExamId: ExamId}
    })
}

/**
 * 是否已提交考核
 * @param ExamId 考核id
 */
export const isExamSubmitted = (ExamId: number)=>{
    return request({
        url: '/score/issubmitted',
        method: 'get',
        params: {ExamId: ExamId}
    })
}

/**
 * 教师侧获取学生考核数据列表
 * @param ExamId 考核id
 */
export const getExamScoreList = (ExamId: number, page: number=0, limit:number=50)=>{
    return request({
        url: '/score/list',
        method: 'get',
        params: {ExamId: ExamId, page: page, limit: limit}
    })
}