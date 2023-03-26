import { Space, TableColumnsType, Button, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { getDeliverDetailsByDeliverId } from '../../api/student';
import { IDeliverDetail, IGroupTableProps } from '../../interfaces/Exam';
import { generateFinalDeliverTableColumns } from '../../wrapper/Exam';

export default function FinalInput() {
    const [details, setDetails] = useState<IDeliverDetail[]>([])
    const [loading, setLoading] = useState(true);

    let id = 0;
    const params = useParams();
    if (params.id && !isNaN(Number.parseInt(params.id))) {
        id = Number.parseInt(params.id);
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
        getDetails(id)
    }, [])
    return (
        <div>
            <Space direction='vertical'>
                <FinalTable
                    details={details}
                    loading={loading}
                />
            </Space>
        </div>
    )
}


export function FinalTable(props: IGroupTableProps) {
    const { details, loading } = props;
    const navigate = useNavigate();
    const getColumns = () => {
        const columns: TableColumnsType<IDeliverDetail> = [
            ...generateFinalDeliverTableColumns(),
            {
                title: '操作', key: 'op', render: (_: any, record: IDeliverDetail) => {
                    return (<Space>
                        <Button
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
