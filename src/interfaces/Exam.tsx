import { IComponent } from "./Component";
import { ICriteria } from "./ExamCriteria";
import { ISize, ISizePrecisionData } from "./Size";
import { IGrade, IStudentInfo } from "./Student";

export const format = "HH:mm";
export const SizePrecisionLevel = ['精密f', '中等m', '粗糙c', '最粗v', '自定义']

export interface IExamTarget {
    Id: number,
    Name: string,
}

export interface IExamBasicInfoProps {
    componentId: number,
    examTargets: string[]
    callback: (examId: number, level: number) => void
}

export interface ICriteriaProps {
    ExamComponent: number,
    ExamId: number,
    callback: () => void
}
export interface ScoreItem {
    Score: number,
    SizeId: number
}
export interface IExam {
    Id: number,
    // ExamDate: Date,
    // StartTime: string,
    // FinishTime: string,
    ExamTarget: string,
    ExamComponent: number,
    ExamComponentName?: string,
    SizePrecisionLevel: number,
    Creator: string,
    CreatorName?: string,
    CriteriaId: number,
    Status: number, //创建进度。3为完成。
    Shared: number, //是否已共享
    // Class?: string, //发放的班级
    Data?: { scores?: ScoreItem[], precision?: ISizePrecisionData[] },
}

export interface IExamListResp {
    exams: IExam[],
    pageSize: number,
    total: number
}

export interface IExamWIthKey extends IExam {
    key: React.Key,
}

export const sizeScopeToDelta: number[][] = [
    [0.05, 0.05, 0.1, 0.15, 0.2, 0.3, 0.5, NaN],
    [0.1, 0.1, 0.2, 0.3, 0.5, 0.8, 1.2, 2],
    [0.2, 0.3, 0.5, 0.8, 1.2, 2, 3, 4],
    [NaN, 0.5, 1, 1.5, 2.5, 4, 6, 8]
];

export interface IPublishExamProps {
    visible: boolean,
    cancel: () => void,
    exam: IExam
    callback: () => void
}
export interface IStandardProps {
    ExamId: number
    callback: () => void
}

export interface ISizeScore {
    SizeId: number,
    Score: number
}

export interface ExamScoreData {
    SizeId: number,
    SizeValue: number,
    SizeScore: number
}

export interface IExamProps {
    role: string
}

export interface IExamCardProps {
    exam: IExam
    component: IComponent,
    sizes: ISize[],
    criterias: ICriteria[],
    role: string,
    studentId?: string
}

export interface IStudentExamProps {
    exams: IExam[],
    total: number,
    pageSize: number,
    loading: boolean,
    pageChangeCallback: (page: number) => void
}
export const ExamStatus2Desc = new Map<number, string>([[0, '待发放'], [1, '已发放'], [2, '已收卷']])

export interface IScore {
    Id: number,
    StudentId: number,
    ExamId: number,
    SelfData?: ExamScoreData[],
    SelfScore?: number,
    GroupData?: ExamScoreData[],
    GroupScore?: number,
    FinalData?: ExamScoreData[],
    FinalScore?: number,
}

export interface IResp<T> {
    items: T[],
    pageSize: number,
    total: number
}

export interface IScoreTableProps {
    scoreList: IScore[],
    total: number,
    pageSize: number,
    loading: boolean,
    exam?: IExam,
    callback: () => void,
    students?: IStudentInfo[],
    pageChangeCallback: (page: number) => void
}

export interface IExamShare {
    Id: number,
    ExamId: number,
    TeacherPhone: string,
    Status: number,
}
export interface IExamAuditTableProps {
    exams: IExam[],
    pageSize: number,
    total: number,
    loading: boolean,
    callback: () => void,
    pageChangeCallback: (page: number) => void
}
export interface IExamAudit extends IExamShare {
    ComponentName: string,
    createdAt: Date,
    updatedAt: Date,
}

export interface IExamDeliver {
    Id: number,
    ExamId: number,
    ExamName: string,
    ExamType: number,
    TeacherPhone: string,
    ExamDate: Date,
    StartTime: string,
    FinishTime: string,
    GradeId: number,
    Class: number,
    GroupName: string,
    Status: number,
    Deleted: boolean
}

export interface IExamDeliverEntity extends IExamDeliver {
    Exam?: IExam,
    Grade?: IGrade,
    DeliverDetailId?: number,
    DeliverDetailStatus?: number,
    Progress?: IDeliverProgress
}

export interface IDeleverTableProps {
    isTeacher: boolean,
    isArchived: boolean,
    delivers: IExamDeliverEntity[],
    callback: () => void,
    pageSize: number,
    total: number,
    loading: boolean,
    pageChangeCallback: (page: number) => void
}

export interface IDeliverDetail {
    Id: number,
    DeliverId: number,
    ExamId: number,
    StudentId: number,
    Status: number,
    StudentName?: string,
    SelfData?: IExamInput[],
    SelfScore?: number, //decimal待转为number
    GroupData?: IExamInput[],
    GroupScore?: number,
    GroupId?: number,
    FinalData?: IExamInput[],
    FinalScore?: number
}

export interface IExamInput {
    sizeId: number,
    score: number,
    value: number,
    toolId?: number
}

export interface IGroupTableProps {
    details: IDeliverDetail[],
    loading: boolean,
    deliver?: IExamDeliver

}

export interface IDeliverProgress {
    id: number,
    progress: number
}

export interface ITeacherTableItem {
    id: number,
    // clip: any,
    size: ISize,
    project: string | any,
    baseSize: number | string,
    upSize: number | string,
    bottomSize: number | string,
    score: number, //配分
    criteria?: ICriteria,
    toolId: number,
    result: string | number //单项得分
    selfTool?: string,
    selfSize?: number,
    selfScore?: number,
    groupSize?: number,
    groupScore?: number,
}


export interface IDeliverStat{
    Id: number,
    DeliverId: number,
    PartCnt: number,
    AvgScore: number,
    PassRate: number,
    ExclRate: number,
    LowRate: number,
    StandardDiff:number,
}

export interface IDeliverDistribution {
    Id: number,
    DeliverId: number,
    ScoreLe30: number,
    Score3040: number,
    Score4050: number,
    Score5060: number,
    Score6070: number,
    Score7080: number,
    Score8090: number,
    Score90100: number,
    Deleted: boolean,
}

export interface IDeliverSizeStat {
    Id: number,
    DeliverId: number,
    SizeId:number,
    IsSecurity: boolean,
    Total: number,
    ScoreAvg: number,//百分比
    ScoreRate: number,//百分比
}