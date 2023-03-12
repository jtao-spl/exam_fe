import request from '../utils/request';
import { message } from 'antd';
import { IExam, IExamListResp, IExamTarget, ISizeScore } from '../interfaces/Exam';
import { ISizePrecisionData } from '../interfaces/Size';
import { ICriteria } from '../interfaces/ExamCriteria';

/**
 * 新建考核
 * @param ExamTarget 考核项目
 * @param ExamComponent 考核组件号
 * @param SizePrecisionLevel 线性尺寸公差等级
 * @returns 
 */
export const saveExam = async (ExamTarget: string, ExamComponent: number, SizePrecisionLevel: number): Promise<IExam | undefined> => {
    const res = await request({
        url: '/exam',
        method: 'post',
        data: { ExamTarget: ExamTarget, ExamComponent: ExamComponent, SizePrecisionLevel: SizePrecisionLevel }
    })
    const { code, msg, data } = res.data;
    if (code !== 0) {
        message.error(`新建考核失败，系统错误：${msg}`);
        return;
    }
    message.success(`新建考核成功`);
    return data;
}

/**
 * 查询当前已创建未完成的考核，继续
 * @param ComponentId 
 * @returns 
 */
export const getPendingExam = async (ComponentId: number): Promise<IExam | null> => {
    const res = await request({
        url: '/exam/pending',
        method: 'get',
        params: { ExamComponent: ComponentId }
    });
    const { code, msg, data } = res.data;
    if (code !== 0) {
        message.warning(`查询失败，系统错误：${msg}`);
        return null;
    }
    return data;
}

/**
 * 获取考核列表
 * @param page 页码
 * @param limit 每页数量
 * @param ExamComponent 按组件id过滤
 * @param Status 考核状态
 * @param IncludeShared 是否返回共享的考卷
 * @returns 
 */
export const getExamList = async (page: number, limit: number = 10, ExamComponent: number = 0, IncludeShared: boolean = true, Status?: number): Promise<IExamListResp | undefined> => {
    let params: {
        page: number,
        limit: number,
        ExamComponent: number,
        IncludeShared: boolean,
        Status?: number
    } = { page: page, limit: limit, ExamComponent: ExamComponent, Status: 3, IncludeShared: IncludeShared }
    if (Status) {
        params = { Status: Status, ...params }
    }
    const res = await request({
        url: '/exam',
        method: 'get',
        params: params
    })
    const { code, msg, data, total } = res.data;
    if (code !== 0) {
        message.error(`获取考核列表失败，系统错误：${msg}`);
        return;
    }
    return {
        exams: data,
        pageSize: limit,
        total: total
    }
}

/**
 * 保存考核标准
 * @param criteria 考核项标准
 * @param ExamId 考试id
 * @returns 
 */
export const saveExamCriteria = async (criteria: any, ExamId: number): Promise<boolean> => {
    const res = await request({
        url: '/exam/criteria',
        method: 'post',
        data: criteria,
        params: { ExamId: ExamId }
    })
    const { code, msg } = res.data;
    if (code !== 0) {
        message.error(`保存考核标准失败，系统错误：${msg}`);
        return false
    }
    message.success(`保存考核标准成功`);
    return true
}
/**
 * 获取考试考核项标准
 * @param CriteriaId 
 * @returns 
 */
export const getExamCriteriaApi = async (CriteriaId: number): Promise<ICriteria[]> => {
    const res = await request({
        url: '/exam/criteria',
        method: 'get',
        params: { CriteriaId: CriteriaId }
    })
    const { code, msg, data } = res.data;
    if (code !== 0) {
        message.error(`获取考核标准失败，系统错误：${msg}`);
        return [];
    }
    const d2nCriterias = data.map((item: any) => ({
        ...item,
        SizeDelta: Number.parseFloat(item.SizeDelta),
        GeoDelta: Number.parseFloat(item.GeoDelta),
        SurfaceRoughnessScore: Number.parseFloat(item.SurfaceRoughnessScore),
    }))
    return d2nCriterias;
}

/**
 * 通过id查找考核
 * @param Id 考核id
 * @returns 
 */
export const getExamById = async (Id: number): Promise<IExam | undefined> => {
    const res = await request({
        url: `/exam/${Id}`,
        method: 'get',
    })
    const { code, msg, data } = res.data;
    if (code !== 0) {
        message.error(`获取考核信息失败,系统错误：${msg}`);
        return
    }
    return data;
}

/**
 * 保存考核配分
 * @param scores 尺寸id,分值
 * @param ExamId 考核id
 * @returns 
 */
export const saveExamScores = async (scores: ISizeScore[], ExamId: number): Promise<boolean> => {
    const res = await request({
        url: '/exam/scores',
        method: 'post',
        data: { scores: scores },
        params: { ExamId: ExamId }
    })
    const { code, msg } = res.data;
    if (code !== 0) {
        message.error(`保存配分失败，系统错误: ${msg}`);
        return false
    }
    message.info(`保存成功`);
    return true
}

/**
 * 下发考核时需要指定年级he班级
 * @param examId 考核id
 * @param Status 考核状态  0 未发放 1 已发放  2 已收卷
 * @param Grade 年级
 * @param Class 班级
 * @returns 
 */
export const setExamStatusApi = async (examId: number, Status: number, Grade?: number, Major?: string, Class?: number): Promise<boolean> => {
    let data: { Status: number, Grade?: number, Major?: string, Class?: Number } = { Status: Status }
    if (Grade && Major && Class) {
        data = { ...data, Grade: Grade, Major: Major, Class: Class }
    }
    const res = await request({
        url: `/exam/${examId}`,
        method: 'patch',
        data: data
    })
    const { code, msg } = res.data;
    if (code !== 0) {
        message.error(`操作失败，系统错误:${msg}`);
        return false;
    }
    message.success(`操作成功`)
    return true
}

/**
 * 新增考核项目
 * @param Name 考核项目名
 * @returns 
 */
export const saveExamTarget = async (Name: string): Promise<boolean> => {
    const res = await request({
        url: `/exam/target`,
        method: 'post',
        data: { Name: Name }
    })
    const { code, msg } = res.data;
    if (code !== 0) {
        message.error(`新增考核项目失败，系统错误：${msg}`);
        return false;
    }
    message.info(`保存成功`);
    return true;
}

/**
 * 查询考核项目列表
 * @returns 
 */
export const getExamTarget = async (): Promise<IExamTarget[]> => {
    const res = await request({
        url: `/exam/target`,
        method: 'get'
    })
    const { code, msg, data } = res.data;
    if (code !== 0) {
        message.error(`获取考核项目失败，系统错误：${msg}`);
        return []
    }
    return data;
}

/**
 * 存储考核自定义的尺寸公差
 */
export const batchUpdateSizePrecision = async (examId: number, dt: ISizePrecisionData[]): Promise<boolean> => {
    const res = await request({
        url: `/exam/${examId}/size/precision`,
        method: `patch`,
        data: { data: dt }
    });
    const { code, msg } = res.data;
    if (code !== 0) {
        message.error(`保存失败，系统错误：${msg}, 请稍后重试`);
        return false
    }
    message.info(`保存成功`);
    return true

}