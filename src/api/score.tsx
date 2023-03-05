import { message } from 'antd';
import { ExamScoreData, IResp, IScore } from '../interfaces/Exam';
import request from '../utils/request';

/**
 * 保存考核值
 * @param ExamId 考核id
 * @param data ExamScoreData[]
 * @param score 总分
 * @param type 测量值类型
 * @param studentId 学号
 * @returns 
 */
export const saveExamScore = async (ExamId: number, data: ExamScoreData[], score: number, type: string, studentId: number): Promise<boolean> => {
    let res;
    if (type === 'self') {
        res = await request({
            url: '/score',
            method: 'POST',
            data: { ExamId: ExamId, SelfData: data, SelfScore: score }
        })
    }
    else if (type === 'group') {
        res = await request({
            url: '/score',
            method: 'POST',
            data: { ExamId: ExamId, GroupData: data, GroupScore: score }
        })
    }
    else {
        res = await request({
            url: '/score',
            method: 'POST',
            data: { ExamId: ExamId, FinalData: data, FinalScore: score, StudentId: studentId }
        })
    }
    const { code, msg } = res.data;
    if (code !== 0) {
        message.error(`保存失败，系统错误：${msg}`);
        return false
    }
    message.info(`保存成功`);
    return true;
}

/**
 * 获取考核成绩数据
 * @param ExamId 
 * @returns 
 */
export const getExamScore = async (ExamId: number) => {
    const res = await request({
        url: '/score',
        method: 'get',
        params: { ExamId: ExamId }
    })
    const { code, msg, data } = res.data;
    if (code !== 0) {
      message.error(`获取考核评测数据失败，系统错误:${msg}`);
      return;
    }
    return data;
}

/**
 * 是否已提交考核
 * @param ExamId 考核id
 */
export const isExamSubmitted = async (ExamId: number): Promise<boolean> => {
    const res = await request({
        url: '/score/issubmitted',
        method: 'get',
        params: { ExamId: ExamId }
    })
    const { code, msg, data } = res.data;
    if (code !== 0) {
        message.error(`获取是否提交考核失败，系统错误:${msg}`);
        return false;
    }
    return data.isSubmitted
}

/**
 * 教师侧获取学生考核数据列表
 * @param ExamId 考核id
 */
export const getExamScoreList = async(ExamId: number, page: number = 0, limit: number = 50):Promise<IResp<IScore>|undefined> => {
    const res = await request({
        url: '/score/list',
        method: 'get',
        params: { ExamId: ExamId, page: page, limit: limit }
    })
    const { code, msg, data, total } = res.data;
        if (code !== 0) {
            message.error(`获取考核数据失败，系统错误：${msg}`);
            return
        }
        if(!data) return;
        return {
            items: data,
            pageSize: limit,
            total: total
        }
}