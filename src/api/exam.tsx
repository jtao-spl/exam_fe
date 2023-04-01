import request from '../utils/request';
import { message } from 'antd';
import { IDeliverDetail, IDeliverDistribution, IDeliverProgress, IDeliverSizeStat, IDeliverStat, IExam, IExamDeliver, IExamListResp, IExamTarget, IResp, ISizeScore } from '../interfaces/Exam';
import { ISizePrecisionData } from '../interfaces/Size';
import { ICriteria } from '../interfaces/ExamCriteria';
import { get } from '../utils/storage';

//exam: 概念上指考卷，与之相关联的是考核零件，考核标准和尺寸配分。exam与deliver是1对多的关系，即一张考卷可以用于多场考试中。
//deliver: 概念上是指考试，与之相关的是考试时间，考试教师，考试所用的考卷。
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
        SurfaceRoughnessVal: Number.parseFloat(item.SurfaceRoughnessVal),
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

/**
 * 申请公开考卷给所有教师可见
 * @param examId 
 * @returns 
 */
export const sendExamPublishAudit = async (examId: number): Promise<boolean> => {
    const res = await request({
        url: `/exam/${examId}/audit`,
        method: 'post',
        data: {}
    });
    const { code, msg } = res.data;
    if (code !== 0) {
        message.error(`发送审核失败，系统错误：${msg}`);
        return false
    }
    return true;
}

export const getExamsByIds = async (ids: number[]): Promise<IExam[]> => {
    const res = await request({
        url: `/exam/batch`,
        method: 'get',
        params: { ids: ids }
    });
    const { code, msg, data } = res.data;
    if (code !== 0) {
        message.error(`获取考核列表失败，系统错误：${msg}`);
        return []
    }
    return data;
}

/**
 * 新增考核
 * 
 * @param ExamId 考卷id
 * @param ExamName 考核名称
 * @param ExamType 考试类型 普通或者正式考试
 * @param ExamDate 考核时间
 * @param StartTime 开始时间
 * @param FinishTime 收卷时间
 * @param Grade 年级
 * @param Major 专业
 * @param Class 班级
 * @param Group 分组
 */
export const createNewExamDeliver = async (ExamId: number, ExamName: string, ExamType: number, ExamDate: Date,
    StartTime: string, FinishTime: string, Grade: number, Major: string, Class: number,
    Group: string): Promise<boolean> => {
    const res = await request({
        url: `/exam/${ExamId}/deliver`,
        method: 'post',
        data: { ExamName, ExamType, ExamDate, StartTime, FinishTime, Grade, Major, Class, Group }
    })
    const { code, msg } = res.data;
    if (code !== 0) {
        message.error(`新建失败，系统错误：${msg}`);
        return false
    }
    return true;
}

/**
 * 获取考核列表
 * @param page 
 * @param limit 
 * @returns 
 */
export const getExamDeliverList = async (page: number, limit: number, Status?: number): Promise<IResp<IExamDeliver> | undefined> => {
    const res = await request({
        url: `/exam/deliver`,
        method: 'get',
        params: { page, limit, Status }
    })
    const { code, msg, data, total } = res.data;
    if (code !== 0) {
        message.error(`获取考核列表失败，系统错误：${msg}`);
        return;
    }
    return {
        items: data,
        pageSize: limit,
        total: total
    }
}

/**
 * 更新考核状态
 * @param id 
 * @param status 
 * @returns 
 */
export const updateDeliverStatus = async (id: number, status: number): Promise<boolean> => {
    const res = await request({
        url: `/exam/deliver/${id}`,
        method: 'patch',
        data: { status }
    });
    const { code, msg } = res.data;
    if (code !== 0) {
        message.error(`新建失败，系统错误：${msg}`);
        return false
    }
    return true;
}
/**
 * 指定考核id查询详情
 * @param id 
 * @returns 
 */
export const getExamDeliverById = async (id: number): Promise<IExamDeliver | undefined> => {
    const res = await request({
        url: `/exam/deliver/${id}`,
        method: `get`
    })
    const { code, msg, data } = res.data;
    if (code !== 0) {
        message.error(`查询失败，系统错误：${msg}`);
        return;
    }
    return data;
}


export const getProgessByDeliverIds = async (ids: number[]): Promise<IDeliverProgress[]> => {
    if (ids.length === 0) return []
    const res = await request({
        url: `/exam/deliver/progress`,
        method: `get`,
        params: { ids }
    })
    const { code, msg, data } = res.data;
    if (code !== 0) {
        message.error(`查询失败，系统错误：${msg}`);
        return [];
    }
    return data;
}

/**
 * 查询指定id的detail详情
 * @param id 
 * @returns 
 */
export const getDeliverDetailById = async (id: number): Promise<IDeliverDetail | undefined> => {
    if (id === 0) return;
    const res = await request({
        url: `/exam/detail/${id}`,
        method: `get`,
    });
    const { code, msg, data } = res.data;
    if (code !== 0) {
        message.error(`查询失败，系统错误：${msg}`);
        return;
    }
    return data;
}

/**
 * 查询考核的统计数据
 * @param id deliver id
 * @returns 
 */
export const getExamStatsByDeliverId = async (id: number): Promise<IDeliverStat | null> => {
    const res = await request({
        url: `/exam/deliver/${id}/stat`,
        method: 'get'
    });
    const { code, msg, data } = res.data;
    if (code !== 0) {
        message.error(`查询失败，系统错误：${msg}`);
        return null;
    }
    return data;
}

/**
 * 查询考核的成绩分布
 * @param id deliver id
 * @returns 
 */
export const getExamDistributionByDeliverId = async (id: number): Promise<IDeliverDistribution | null> => {
    const res = await request({
        url: `/exam/deliver/${id}/dist`,
        method: 'get'
    });
    const { code, msg, data } = res.data;
    if (code !== 0) {
        message.error(`查询失败，系统错误：${msg}`);
        return null;
    }
    return data;
}

/**
 * 完成复测、
 * @param id 
 */
export const finishFinalReview = async (id: number): Promise<boolean> => {
    const res = await request({
        url: `/exam/deliver/${id}/finish`,
        method: 'post'
    });
    const { code, msg } = res.data;
    if (code !== 0) {
        message.error(`处理失败，系统错误：${msg}`);
        return false;
    }
    return true;
}

/**
 * 获取评分项得分情况详情
 * @param id 
 * @returns 
 */
export const getDetailedScoresByDeliverId = async(id: number):Promise<IDeliverSizeStat[]> =>{
    const res = await request({
        url: `/exam/deliver/${id}/scores`,
        method: 'get'
    })
    const { code, msg, data } = res.data;
    if (code !== 0) {
        message.error(`查询失败，系统错误：${msg}`);
        return [];
    }
    return data;
}