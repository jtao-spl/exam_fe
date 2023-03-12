import { IComponent } from "./Component"
import { IExam } from "./Exam"
import { ICriteria } from "./ExamCriteria"
import { ISize } from "./Size"

export interface ITeacher {
    Id: number,
    Name: string,
    Phone: string,
    Deleted: boolean
}
export interface ITeacherWithKey extends ITeacher {
    key: React.Key
}

export interface ITeacherListResp {
    teachers: ITeacher[],
    pageSize: number,
    total: number,

}

export interface ITeacherTableProps {
    teachers: ITeacher[],
    callback: () => void,
    pageSize: number,
    total: number,
    loading: boolean,
    refreshCallback: (pageNum: number) => void, //换页时的回调
}

export interface IAddTeacherProps {
    open: boolean,
    callback: () => void
}

export interface IExamDetailProps {
    exam?: IExam,
    component?: IComponent,
    sizes: ISize[],
    criterias: ICriteria[],
    open: boolean,
    callback: () => void
}