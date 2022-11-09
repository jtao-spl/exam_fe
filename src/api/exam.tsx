import { IExam } from '../pages/exam/ExamList';
import request from '../utils/request';

export const saveExam = (exam:IExam)=>{
    return request({
        url: '/exam',
        method:'post',
        data: exam
    })
}

export const getExamList = (page: number, limit:number=10, ExamComponent:number=0)=>{
    return request({
        url: '/exam',
        method:'get',
        params: {page: page, limit:limit, ExamComponent: ExamComponent}
    })
}
export const saveExamCriteria = (criteria:any,ExamId:number)=>{
    return request({
        url:'/exam/criteria',
        method: 'post',
        data: criteria,
        params: {ExamId:ExamId}
    })
}
export const getExamById = (Id: number)=>{
    return request({
        url:`/exam/${Id}`,
        method: 'get',
    })
}
export const saveExamScores =(scores: any, ExamId: number)=>{
    return request({
        url:'/exam/scores',
        method: 'post',
        data: {scores: scores},
        params: {ExamId: ExamId}
    })
}