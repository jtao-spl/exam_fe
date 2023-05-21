import { Button, Cascader, Form, message, Popconfirm, Space, Table, TableColumnsType } from 'antd'
import React, { useEffect, useState } from 'react'
import { batchGetStudentInfo, createOrUpdateGroup } from '../../api/student';
import { IStudentInfoWithGroup, IStudentQueryReq } from '../../interfaces/Student';
import { Option } from '../../interfaces/Student';
import { generateStudentTableColumn, getOptionsV2 } from '../../wrapper/Student';

export default function StudentList() {
    const [students, setStudents] = useState<IStudentInfoWithGroup[]>([]);
    const [options, setOptions] = useState<Option[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [Grade, setGrade] = useState(0);
    const [Major, setMajor] = useState("");
    const [Class, setClass] = useState(0);

    const getOpts = async () => {
        const options = await getOptionsV2();
        setOptions(options);
    }
    useEffect(() => {
        getOpts()
    }, [])
    const queryStudents = async (req: { Grade: number, Major: string, Class: number }) => {
        const resp = await batchGetStudentInfo(req, true);
        if (resp) {
            setStudents(resp);
        }
        setGrade(req.Grade);
        setMajor(req.Major);
        setClass(req.Class);
    }

    const selectCallBack = async (values: any) => {
        console.log(`values: ${JSON.stringify(values)}`); // [2021,"钳工",0]
        const [Grade, Major, Class] = values;
        const req = { Grade, Major, Class };
        await queryStudents(req);
    }

    const generateColumns = () => {
        const columns: TableColumnsType<IStudentInfoWithGroup> = [
            ...generateStudentTableColumn(),
            { title: '分组', key: 'group', dataIndex: 'Group' },
        ]
        return columns
    }
    const hasSelected = selectedRowKeys.length > 0;
    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(newSelectedRowKeys);
        }
    };

    const saveGroup = async () => {
        const res = await createOrUpdateGroup(Grade, Major, Class, selectedRowKeys as number[]);
        if (!res) return;
        queryStudents({ Grade, Major, Class });
    }

    return (
        <div>
            <Cascader
                // style={{ width: '60%' }}
                options={options}
                onChange={selectCallBack}
                // multiple
                maxTagCount="responsive"
                placeholder="请选择班级" />
            <Space direction='horizontal'>
                <Popconfirm
                    title={`选中学生将被分配至A组，班上其余学生将被分配至B组。确认分配？`}
                    onConfirm={saveGroup}
                    onCancel={() => message.info(`取消操作`)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type='primary' disabled={!hasSelected}>分配至A组</Button>
                </Popconfirm>
            </Space>
            <Table
                rowSelection={rowSelection}
                bordered={true}
                rowKey={record => record.StudentId} //此处设置每个行的key为学号，勾选时key就是学号
                columns={generateColumns()}
                dataSource={students}
                pagination={false}
                scroll={{ y: 400 }}
            />
        </div>
    )
}
