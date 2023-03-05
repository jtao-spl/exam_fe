export interface IGradeClass {
    Grade: number,
    Class: string[]
}


/**
 * 下发考核时级联选择年级班级的数据结构
 */
export interface Option {
    value: string | number;
    label: string;
    children?: Option[];
}
//上传时，拆分详细的年级，班级，专业
export interface IStudentUpload{
    Name: string,
    StudentId: number,
}

export interface IStudentInfo {
    Grade: number,
    Major: string,
    Class: number,
    Name: string,
    StudentId: number,
    Deleted?: boolean
}
//上传后，class为落库后记录的id
export interface IStudent {
    Id: number,
    StudentId: number,
    Name: string,
    GradeId: number,
    Class: number,
    Deleted: boolean
}

export interface IStudentPreviewProps {
    studentInfoList: IStudentUpload[],
    onDelete: (id: number) => void
}

export interface IStudentQueryReq {
    GradeId?: number,
    Grade?: number,
    Major?: string,
    Class?: number,
    StudentIds?: number[],
}

export interface IGrade {
    Id: number,
    Grade: number,
    Major: string,
    ClassCount: number,
    Deleted: boolean,
    createdAt: Date,
    updatedAt: Date,
}

export interface IStudentTableProps {
    students: IStudentInfo[],
    grade?:IGrade,
    callback: (req: IStudentQueryReq) => void,
    showEditModal: (student: IStudentInfo) => void
}

export interface IEditStudentProps {
    student?: IStudentInfo
    callback: (req: IStudentQueryReq) => void,
    visible: boolean
}

export interface IAddGradeProps {
    visible: boolean,
    callback: () => void
}

export interface IGradeTableProps {
    grades:IGrade[],
    defaultGradeKey: React.Key,
    delCallback: ()=>void,
    selectRowCallback:(id:number)=>void
}
