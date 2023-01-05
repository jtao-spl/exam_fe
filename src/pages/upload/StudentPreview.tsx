import { Button, Space, Table, TableColumnsType } from 'antd'
import React from 'react'
export interface IStudentInfo {
    Grade: string,
    Class: string,
    Name: string,
    StudentId: number
}
interface DataType extends IStudentInfo{
    key: React.Key
}

const generateStudentTableColumn = ()=>{
    const columns: TableColumnsType<IStudentInfo> = [
        { title: "年级", key: 'Grade', dataIndex: 'Grade' },
        { title: "班级", key: 'Class', dataIndex: 'Class' },
        { title: "姓名", key: 'Name', dataIndex: 'Name' },
        { title: "学号", key: 'StudentId', dataIndex: 'StudentId' },
    ]
    return columns;
}

interface IProps{
    studentInfoList: IStudentInfo[],
    onDelete: (id:number)=>void
}
export default function StudentPreview(props: IProps) {
    const {studentInfoList, onDelete} = props;

    const onDeleteSingleStudentInfo = (id:number)=>{
        onDelete(id)
    }

    const generateStudentTable = ()=>{
        const columns = [
            ...generateStudentTableColumn(),
            {title:'操作', key:'op', render: (_:any, record:IStudentInfo)=>(
                <Space>
                    <Button type='primary' danger
                    onClick={()=>onDeleteSingleStudentInfo(record.StudentId)}
                    >删除</Button>
                </Space>
            )}
        ]
        return columns;
    }

    return (
        <div>
            <Table rowKey={record=>record.StudentId} dataSource={studentInfoList} columns={generateStudentTable()} pagination={false} />
        </div>
    )
}
