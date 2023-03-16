import { Button, Space, Switch, Table, TableColumnsType } from 'antd';
import React, { useEffect, useState } from 'react'
import { getExamShares, updateExamAuditStatus } from '../../api/admin';
import { getComponentById } from '../../api/comp';
import { getExamCriteriaApi, getExamsByIds } from '../../api/exam';
import { IComponent } from '../../interfaces/Component';
import { IExam, IExamAuditTableProps, IExamShare } from '../../interfaces/Exam'
import { ICriteria } from '../../interfaces/ExamCriteria';
import { ISize } from '../../interfaces/Size';
import { getSizesByComponentId } from '../../wrapper/Component';
import { generateExamTableColomns, getCalculatedSizeForExam } from '../../wrapper/Exam';
import ExamDetail from '../exam/ExamDetail';

export default function ExamAudit() {
    const [exams, setExams] = useState<IExam[]>([]);
    const [pageSize, setPageSize] = useState(0);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [switchLoading, setSwitchLoading] = useState(false);
    const [switchChecked, setSwitchChecked] = useState(false);

    const init = async (page: number = 0, limit: number = 10, status: number) => {
        setLoading(true)
        const res = await getExamShares(page, limit, status);
        if (!res) {
            setLoading(false);
            return
        };
        const examIds = res.items.map((item: IExamShare) => item.ExamId);
        if (examIds.length === 0) {
            setLoading(false);
            setExams([])
            return
        }
        const exams = await getExamsByIds(examIds);
        setExams(exams);
        setPageSize(res.pageSize);
        setTotal(res.total);
        setLoading(false);
    }

    useEffect(() => {
        init(0, 10, switchChecked? 0: 2)
    }, []);
    const onChange = async (checked: boolean) => {
        setSwitchLoading(true);
        setSwitchChecked(checked);
        init(1, 10, checked ? 0 : 2);
        setSwitchLoading(false);
    }
    return (
        <div>
            <Space direction='vertical'>
                <Switch
                    defaultChecked={false}
                    loading={switchLoading}
                    checkedChildren="全部"
                    unCheckedChildren="待审核"
                    onChange={onChange} />
            </Space>
            <AuditTable
                exams={exams}
                pageSize={pageSize}
                total={total}
                loading={loading}
                callback={() => init(0, 10, switchChecked ? 0 : 2)}
                pageChangeCallback={(page: number) => init(page, 10, switchChecked ? 0 : 2)}
            />
        </div>
    )
}


function AuditTable(props: IExamAuditTableProps) {
    const { exams, pageSize, total, loading, callback, pageChangeCallback } = props;

    const [currentExam, setCurrentExam] = useState<IExam>();
    const [showExam, setShowExam] = useState(false);
    const [component, setComponent] = useState<IComponent>();
    const [criterias, setCriterias] = useState<ICriteria[]>([]);
    const [modalLoading, setModalLoading] = useState(false);
    const [sizes, setSizes] = useState<ISize[]>([]);
    const setShowExamDetail = async (exam: IExam) => {
        setModalLoading(true);
        setCurrentExam(exam);
        const criterias = await getExamCriteriaApi(exam.CriteriaId);
        setCriterias(criterias);
        const component = await getComponentById(exam.ExamComponent);
        setComponent(component);
        if (component) {
            const sizes = await getSizesByComponentId(exam?.ExamComponent, false);
            if (sizes.length === 0) return;
            const newSizes = getCalculatedSizeForExam(exam, sizes);
            setSizes(newSizes);
        }
        setShowExam(true);
        setModalLoading(false);
    }
    const generateAuditTableColumns = () => {
        const columns: TableColumnsType<IExam> = [
            // { title: '考核id', key: 'examId', dataIndex: 'ExamId' },
            // { title: '申请人', key: 'submitter', dataIndex: 'CreatorName' },
            // { title: '当前状态', key: 'status', dataIndex: 'Status' },
            ...generateExamTableColomns(),
            {
                title: '当前状态', key: 'status', render: (_: any, record: IExam) => {
                    if (record.Shared === 0) {
                        return '仅自见'
                    } else if (record.Shared === 1) {
                        return '已共享'
                    } else if (record.Shared === 2) {
                        return '待审核'
                    } else if (record.Shared === 3) {
                        return '已驳回'
                    }
                    return '未知'
                }
            },
            {
                title: '操作', key: 'operator', render: (_: any, record: IExam) => {
                    return (<Space direction='vertical'>
                        <Button type='primary' loading={modalLoading} onClick={() => setShowExamDetail(record)}>查看详情</Button>
                        <Button type='primary' disabled={record.Shared === 1} onClick={() => {
                            setAuditStatus(record.Id, 1);
                            callback()
                        }}>同意</Button>
                        <Button type="primary" danger disabled={record.Shared === 1} onClick={() => {
                            setAuditStatus(record.Id, 3);
                            callback()
                        }}>驳回</Button>
                    </Space >)
                }
            }
        ];
        return columns
    }
    const setAuditStatus = async (examId: number, status: number) => {
        const res = await updateExamAuditStatus(examId, status);
        if (!res) return;
        callback();
    }

    return (<div>
        <ExamDetail
            exam={currentExam}
            component={component}
            sizes={sizes}
            criterias={criterias}
            open={showExam}
            callback={() => setShowExam(false)}
        />
        {exams && <Table
            rowKey={record => record.Id}
            dataSource={exams}
            columns={generateAuditTableColumns()}
            pagination={{ position: ["bottomCenter"], total: total, pageSize: pageSize, showSizeChanger: false }}
            scroll={{ y: 400 }}
            onChange={(pagenation: any) => pageChangeCallback(pagenation.current)}
            loading={loading}
        />}
    </div>)
}
