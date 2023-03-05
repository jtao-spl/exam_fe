import { IComponent } from "./Component";
import { ICriteria } from "./ExamCriteria";
import { ISize, ISizePrecisionData } from "./Size";
import { IStudentInfo } from "./Student";

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
    ExamDate: Date,
    StartTime: string,
    FinishTime: string,
    ExamTarget: string,
    ExamComponent: number,
    SizePrecisionLevel: number,
    ExamTeacher: string,
    CriteriaId: number,
    Status: number, //0 初始状态 1 已下发 2 已收卷
    Class?: string, //发放的班级
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

export interface  IScoreTableProps {
    scoreList: IScore[],
    total: number,
    pageSize: number,
    loading: boolean,
    exam?: IExam,
    callback: () => void,
    students?: IStudentInfo[],
    pageChangeCallback: (page: number) => void
}