import { Button, Switch, Space, Table, TableColumnsType, Tag } from 'antd';
import React, { useEffect, useState } from 'react'
import { getTeacherList, toggleStatus } from '../../api/admin';

import { ITeacher, ITeacherTableProps, ITeacherWithKey } from '../../interfaces/Teacher';
import AddTeacherModal from './AddTeacherModal';

export default function TeacherList() {
    const [teachers, setTeachers] = useState<ITeacher[]>();
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [switchLoading, setSwitchLoading] = useState(true);
    const [switchChecked, setSwitchChecked] = useState(true);
    const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
    const queryTeachers = async (pg: number = 1, lmt: number = 10, containDeleted: boolean = true) => {
        setSwitchLoading(true);
        const resp = await getTeacherList(pg, lmt, containDeleted);
        if (resp) {
            setTeachers(resp.teachers);
            setPageSize(resp.pageSize);
            setTotal(resp.total);
            setLoading(false);
            setSwitchLoading(false);
        }
    }
    useEffect(() => {
        queryTeachers()
    }, [])
    const onChange = async (checked: boolean) => {
        setSwitchChecked(checked);
        queryTeachers(1, 10, checked);
    }
    return (<div>
        <Space direction='vertical'>
            <Button type='primary' onClick={() => setShowAddTeacherModal(true)}>新增教师信息</Button>
            <Switch
                defaultChecked
                loading={switchLoading}
                checkedChildren="全部"
                unCheckedChildren="仅启用"
                onChange={onChange} />
        </Space>
        {teachers && <TeacherTable
            teachers={teachers}
            callback={() => queryTeachers()}
            pageSize={pageSize}
            total={total}
            loading={loading}
            refreshCallback={async (id: number) => queryTeachers(id, 10, switchChecked)}
        />}
        <AddTeacherModal
            open={showAddTeacherModal}
            callback={() => {
                setShowAddTeacherModal(false);
                queryTeachers()
            }}
        />
    </div>)
}


function TeacherTable(props: ITeacherTableProps) {
    const { teachers, callback, pageSize, total, loading, refreshCallback } = props;

    const toggleAccountStatus = async (Id: string) => {
        const result = await toggleStatus(Id, 2);
        if(result){
            callback();
        }
    }
    const generateTeacherTableColumns = () => {
        const coloums: TableColumnsType<any> = [
            { title: 'Id', key: 'Id', dataIndex: 'Id' },
            { title: '姓名', key: 'Name', dataIndex: 'Name' },
            { title: '联系电话', key: 'Phone', dataIndex: 'Phone' },
            {
                title: '当前状态', key: 'status', render: (_: any, record: ITeacherWithKey) => {
                    return (<Tag color={record.Deleted ? 'red' : 'green'}>{record.Deleted ? '已禁用' : '有效'}</Tag>)
                }
            },
            {
                title: '操作', key: 'operation', render: (_: any, record: ITeacherWithKey) => {
                    return (<Space direction='vertical'>
                        <Button type='primary' disabled={!record.Deleted} onClick={() => toggleAccountStatus(record.Phone)}>启用</Button>
                        <Button type='primary' disabled={record.Deleted} danger onClick={() => toggleAccountStatus(record.Phone)}>禁用</Button>
                    </Space>)
                }
            },

        ]
        return coloums;
    }
    const onChange = async (pagenation: any) => {
        await refreshCallback(pagenation.current);
    }

    return (
        <div>
            <Table
                rowKey={record => record.Id}
                dataSource={teachers}
                columns={generateTeacherTableColumns()}
                pagination={{ position: ["bottomCenter"], total: total, pageSize: pageSize, showSizeChanger: false }}
                scroll={{ y: 400 }}
                loading={loading}
                onChange={onChange} />

        </div>
    )
}
