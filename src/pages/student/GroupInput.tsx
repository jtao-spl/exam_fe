import { Button, Select, Space, Table, TableColumnsType } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getClassPendingList, getDeliverDetailsByDeliverId } from '../../api/student';
import { IDeliverDetail, IExamDeliverEntity, IGroupTableProps } from '../../interfaces/Exam';
import { generateDeliverTableColumns } from '../../wrapper/Exam';

//小组复测
export default function GroupInput() {
    const [delivers, setDelivers] = useState<IExamDeliverEntity[]>([]);
    const [details, setDetails] = useState<IDeliverDetail[]>([])
    const [loading, setLoading] = useState(true);
    const [selectedDeliverId, setSelectedDeliverId] = useState(0);
    const init = async (pg: number = 1, lim: number = 10) => {
        const res = await getClassPendingList(pg, lim,);
        if (!res || res.items.length === 0) {
            setLoading(false);
            return
        }
        setDelivers(res.items);
        setLoading(false);
    }

    const getDetails = async (id: number) => {
        setLoading(true);
        setDetails([]);
        const res = await getDeliverDetailsByDeliverId(id);
        if (res.length === 0) {
            setLoading(false);
            return;
        };
        setDetails(res);
        setLoading(false);
    }


    useEffect(() => {
        init(0, 10)
    }, [])
    useEffect(() => {
        getDetails(selectedDeliverId)
    }, [selectedDeliverId])
    return (
        <div>
            <Space direction='vertical'>
                请选择考核：<Select onChange={(value: number) => setSelectedDeliverId(value)}>
                    {
                        delivers.map((item: IExamDeliverEntity) =>
                            (<Select.Option key={item.Id} value={item.Id}>{item.ExamName}</Select.Option>)
                        )
                    }
                </Select>
                <GroupTable
                    details={details}
                    loading={loading}
                />
            </Space>
        </div>
    )
}


export function GroupTable(props: IGroupTableProps) {
    const { details, loading } = props;
    const navigate = useNavigate();
    const getColumns = () => {
        const columns: TableColumnsType<IDeliverDetail> = [
            ...generateDeliverTableColumns(),
            {
                title: '操作', key: 'op', render: (_: any, record: IDeliverDetail) => {
                    return (<Space>
                        <Button
                            type="primary"
                            disabled={record.Status === 2} //已互测的不支持再次提交
                            onClick={() => navigate(`/student/exam/${record.DeliverId}/${record.Id}`)}>给TA互测</Button>
                    </Space>)
                }
            }
        ]
        return columns;
    }

    return (<div>
        <Table
            columns={getColumns()}
            dataSource={details}
            pagination={false}
            rowKey={record => record.Id}
            loading={loading}
        />
    </div>)
}