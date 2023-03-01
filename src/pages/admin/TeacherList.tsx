import { Button, message, Switch, Space, Table, TableColumnsType, Tag } from 'antd';
import React, { useEffect, useState } from 'react'

import { getTeacherList, toggleTeacherStatus } from '../../api/admin';
import AddTeacherModal from './AddTeacherModal';
interface ITeacher {
    Id: number,
    Name: string,
    Phone: number,
    Deleted: boolean
}
interface DataType extends ITeacher {
    key: React.Key
}
export default function TeacherList() {
    const [teachers, setTeachers] = useState<ITeacher[]>();
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [switchLoading, setSwitchLoading] = useState(true);
    const [switchChecked, setSwitchChecked] = useState(true);
    const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
    const getTeachers = async (pg: number = 1, lmt: number = 10, containDeleted: boolean = true) => {
        const res = await getTeacherList(pg, lmt, containDeleted);
        const { code, msg, data, total } = res.data;
        if (code !== 0) {
            message.error(`获取教师列表失败，系统错误：${msg}`);
            return
        }
        setTeachers(data);
        setPageSize(lmt);
        setTotal(total);
        setLoading(false);
        setSwitchLoading(false);
        return data;
    }
    useEffect(() => {
        getTeachers()
    }, [])
    const onChange = async (checked: boolean) => {
        setSwitchChecked(checked);
        getTeachers(1, 10, checked);
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
            callback={() => getTeachers()}
            pageSize={pageSize}
            total={total}
            loading={loading}
            refreshCallback={async (id: number) => getTeachers(id, 10, switchChecked)}
        />}
        <AddTeacherModal
            open={showAddTeacherModal}
            callback={() => {
                setShowAddTeacherModal(false);
                getTeachers()
            }}
        />
    </div>)
}

interface IProps {
    teachers: ITeacher[],
    callback: () => void,
    pageSize: number,
    total: number,
    loading: boolean,
    refreshCallback: (pageNum: number) => void, //换页时的回调

}
function TeacherTable(props: IProps) {
    const { teachers, callback, pageSize, total, loading, refreshCallback } = props;

    const toggleAccountStatus = async (Id: number) => {
        const res = await toggleTeacherStatus(Id);
        const { code, msg } = res.data;
        if (code !== 0) {
            message.error(`切换教师状态失败，系统错误:${msg}`);
            return
        }
        message.info(`操作成功`);
        callback();
    }
    const generateTeacherTableColumns = () => {
        const coloums: TableColumnsType<any> = [
            { title: 'Id', key: 'Id', dataIndex: 'Id' },
            { title: '姓名', key: 'Name', dataIndex: 'Name' },
            { title: '联系电话', key: 'Phone', dataIndex: 'Phone' },
            {
                title: '当前状态', key: 'status', render: (_: any, record: DataType) => {
                    return (<Tag color={record.Deleted ? 'red' : 'green'}>{record.Deleted ? '已禁用' : '有效'}</Tag>)
                }
            },
            {
                title: '操作', key: 'operation', render: (_: any, record: DataType) => {
                    return (<Space direction='vertical'>
                        <Button type='primary' disabled={!record.Deleted} onClick={() => toggleAccountStatus(record.Id)}>启用</Button>
                        <Button>修改联系电话</Button>
                        <Button type='primary' disabled={record.Deleted} danger onClick={() => toggleAccountStatus(record.Id)}>禁用</Button>
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
