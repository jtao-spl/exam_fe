import { ISize } from "./Size"

export interface IComponent {
    Id: number,
    ComponentName: string,
    Status: number,
    Deleted: boolean,
    ClipPath: string
}

export interface IComponentListResp {
    components: IComponent[],
    pageSize: number,
    total: number
}
export interface IDeleteComponentProps {
    ComponentId: number,
    onDelete: (id: number) => void

}

export interface IEditComponentProps {
    componentId: number,
    callback: () => void
}

export interface IShowSizeListProps {
    visible: boolean,
    cancel: () => void,
    sizeList: ISize[]
}

export interface ITool {
    Id: number,
    Name: string,
    Deleted: boolean
}

export interface IToolTableProps {
    tools: ITool[],
    pageSize: number,
    total: number,
    loading: boolean,
    callback: () => void,
    showEditToolModal: (item: ITool) => void
}

export interface IEditToolProps {
    tool?: ITool,
    open: boolean,
    callback: () => void
}

export interface IAddToolProps {
    open: boolean,
    callback: () => void
}