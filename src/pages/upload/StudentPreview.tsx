import { Button, Space, Table, TableColumnsType } from 'antd'
import React from 'react'
import { IStudentPreviewProps, IStudentUpload } from '../../interfaces/Student';

const generateStudentTableColumn = ()=>{
    const columns: TableColumnsType<IStudentUpload> = [
        // { title: "年级", key: 'Grade', dataIndex: 'Grade' },
        // { title: "专业", key: 'Major', dataIndex: 'Major' },
        // { title: "班级", key: 'Class', dataIndex: 'Class' },
        { title: "姓名", key: 'Name', dataIndex: 'Name' },
        { title: "学号", key: 'StudentId', dataIndex: 'StudentId' },
    ]
    return columns;
}

export default function StudentPreview(props: IStudentPreviewProps) {
    const {studentInfoList, onDelete} = props;

    const onDeleteSingleStudentInfo = (id:number)=>{
        onDelete(id)
    }

    const generateStudentTable = ()=>{
        const columns:TableColumnsType<IStudentUpload> = [
            ...generateStudentTableColumn(),
            {title:'操作', key:'op', render: (_:any, record:IStudentUpload)=>(
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
