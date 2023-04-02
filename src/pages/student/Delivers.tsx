import React, { useEffect, useState } from 'react'
import { studentGetDeliverList } from '../../api/student';
import { IExamDeliverEntity } from '../../interfaces/Exam';
import { DeliverTable } from '../exam/deliver/DeliverList';

export default function Delivers() {
    const [delivers, setDelivers] = useState<IExamDeliverEntity[]>([]);
    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(0);
    const [loading, setLoading] = useState(true);
    // TODO: 根据开关切换查询考核状态
    const [status, setStatus] = useState(1);
    const init = async (pg: number = 1, lim: number = 10) => {
        const res = await studentGetDeliverList(pg, lim, status);
        if (!res || res.items.length === 0) {
            setLoading(false);
            return
        }

        setDelivers(res.items);
        setPageSize(res.pageSize);
        setTotal(res.total);
        setLoading(false);
    }

    useEffect(() => {
        init(0, 10)
    }, [])
    return (
        <div>
            <DeliverTable
                isTeacher={false}
                isArchived={false}
                delivers={delivers}
                callback={init}
                pageSize={pageSize}
                total={total}
                loading={loading}
                pageChangeCallback={(page: number) => init(page)}
            /></div>
    )
}
