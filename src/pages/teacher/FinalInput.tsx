import { Space, TableColumnsType, Button, Table, Popconfirm, message } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { finishFinalReview, getExamDeliverById } from '../../api/exam';
import { getDeliverDetailsByDeliverId } from '../../api/student';
import { IDeliverDetail, IExamDeliver, IGroupTableProps } from '../../interfaces/Exam';
import { generateFinalDeliverTableColumns } from '../../wrapper/Exam';

export default function FinalInput() {
    const [details, setDetails] = useState<IDeliverDetail[]>([])
    const [loading, setLoading] = useState(true);
    const [deliver, setDeliver] = useState<IExamDeliver>();

    let id = 0;
    const params = useParams();
    const navigate = useNavigate();
    if (params.id && !isNaN(Number.parseInt(params.id))) {
        id = Number.parseInt(params.id);
    }

    const getDetails = async (id: number) => {
        setLoading(true);
        const deliver = await getExamDeliverById(id);
        if (deliver) setDeliver(deliver);
        setDetails([]);
        const res = await getDeliverDetailsByDeliverId(id);
        if (res.length === 0) {
            setLoading(false);
            return;
        };
        setDetails(res);
        setLoading(false);
    }

    const confirmFinishAll = async (id: number) => {
        if (id === 0) return;
        const res = await finishFinalReview(id);
        if (!res) return;
        message.info(`归档成功,即将跳转成绩分析页`);
        setTimeout(() => {
            navigate(`/teacher/exam/stats`);
        }, 500);
    }


    useEffect(() => {
        getDetails(id)
    }, [])
    return (
        <div>
            <Space direction='vertical'>
                <Popconfirm
                    title="归档后不能再修改，确认归档？"
                    disabled={deliver?.Status === 3}
                    onConfirm={() => confirmFinishAll(id)}
                    onCancel={() => message.info(`取消归档成功`)}
                >
                    <Button type='primary' disabled={deliver?.Status === 3}>完成复测并归档</Button>
                </Popconfirm>
                <FinalTable
                    details={details}
                    loading={loading}
                    deliver={deliver}
                />
            </Space>
        </div>
    )
}


export function FinalTable(props: IGroupTableProps) {
    const { details, loading, deliver } = props;
    const navigate = useNavigate();
    const getColumns = () => {
        const columns: TableColumnsType<IDeliverDetail> = [
            ...generateFinalDeliverTableColumns(),
            {
                title: '操作', key: 'op', render: (_: any, record: IDeliverDetail) => {
                    return (<Space>
                        <Button
                            disabled={deliver?.Status === 3}
                            type="primary"
                            onClick={() => navigate(`/student/exam/${record.DeliverId}/${record.Id}`)}>提交复测</Button>
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
