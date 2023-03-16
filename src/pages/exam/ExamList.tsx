import { Button, message, Popconfirm, Space, Switch, Table, TableColumnsType } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getComponentById, getComponentByIds } from '../../api/comp'

import { getExamCriteriaApi, getExamList, sendExamPublishAudit, setExamStatusApi } from '../../api/exam'
import { getTeacherByIds } from '../../api/teacher'
import { IComponent } from '../../interfaces/Component'
import { IExam } from '../../interfaces/Exam'
import { ICriteria } from '../../interfaces/ExamCriteria'
import { ISize } from '../../interfaces/Size'
import { ITeacher } from '../../interfaces/Teacher'
import { getSizesByComponentId } from '../../wrapper/Component'
import { generateExamTableColomns, getCalculatedSizeForExam } from '../../wrapper/Exam'
import ShowSizeList from '../component/ShowSizeList'
import ExamDetail from './ExamDetail'
import PublishExam from './PublishExam'


interface IProps {
    exams: IExam[],
    total: number,
    pageSize: number,
    loading: boolean,
    callback: () => void,
    pageChangeCallback: (page: number) => void
}


export default function ExamList() {

    const [exams, setExams] = useState<IExam[]>([]);
    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(0);
    const [loading, setLoading] = useState(true);
    const [switchLoading, setSwitchLoading] = useState(false);
    const [switchChecked, setSwitchChecked] = useState(true);

    const getList = async (pg: number = 1, lim: number = 10, ExamComponent: number = 0, IncludeShared: boolean = true, Status: number = 3) => {
        setSwitchLoading(true);
        setLoading(true);
        const res = await getExamList(pg, lim, ExamComponent, IncludeShared, Status);
        if (res && res.exams.length > 0) {
            const componentIds = res.exams.map((e: IExam) => e.ExamComponent);
            const creatorIds = res.exams.map((e: IExam) => e.Creator);
            const uniqIds = Array.from(new Set(componentIds));
            const uniqCreatorIds = Array.from(new Set(creatorIds));
            const components = await getComponentByIds(uniqIds);
            const creators = await getTeacherByIds(uniqCreatorIds);
            const exams = res.exams.map((e: IExam) => {
                let name = '';
                let creatorName = '';
                const component = components.filter((c: IComponent) => c.Id === e.ExamComponent);
                if (component.length > 0) name = component[0].ComponentName;
                const creator = creators.filter((c: ITeacher) => c.Phone === e.Creator);
                if (creator.length > 0) creatorName = creator[0].Name
                return { ...e, CreatorName: creatorName, ExamComponentName: name }
            })
            setExams(exams);
            setTotal(res.total);
            setPageSize(res.pageSize);
        }
        setLoading(false);
        setSwitchLoading(false);
    }
    useEffect(() => {
        getList();
    }, []);

    return (
        <div>
            <Switch
                defaultChecked={switchChecked}
                loading={switchLoading}
                checkedChildren="全部考卷"
                unCheckedChildren="仅自建"
                onChange={(checked: boolean) => {
                    setSwitchChecked(checked);
                    getList(1, 10, 0, checked);
                }} />
            <ExamTable
                exams={exams}
                total={total}
                pageSize={pageSize}
                loading={loading}
                callback={() => getList()}
                pageChangeCallback={(page: number) => getList(page, 10, 0, switchChecked)}
            />
        </div>
    )
}


function ExamTable(props: IProps) {
    const { exams, total, pageSize, loading, callback, pageChangeCallback } = props;
    const [showSizeList, setShowSizeList] = useState(false);
    const [sizes, setSizes] = useState<ISize[]>([]);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [currentExam, setCurrentExam] = useState<IExam>();
    const [showExam, setShowExam] = useState(false);
    const [component, setComponent] = useState<IComponent>();
    const [criterias, setCriterias] = useState<ICriteria[]>([]);
    const [modalLoading, setModalLoading] = useState(false);

    const navigate = useNavigate();

    // const initSizeList = async (exam: IExam, showList: boolean = true) => {
    //     const sizes = await getSizesByComponentId(exam.ExamComponent);
    //     const calculatedSize = getCalculatedSizeForExam(exam, sizes, sizeScopeToDelta);
    //     setShowSizeList(showList);
    //     setSizes(calculatedSize);

    // }
    const hideShowSizeList = (refresh?: boolean) => {
        setShowSizeList(false);
    }

    const setExamStatus = async (exam: IExam, status: number) => {
        const res = await setExamStatusApi(exam.Id, status);
        if (!res) return;
        callback()
    }
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

    const generateTableColumns = () => {
        const columns: TableColumnsType<IExam> = [
            ...generateExamTableColomns(),
            {
                title: "操作", key: "operation", render: (_: any, exam: IExam) => {
                    return (<Space direction='vertical'>
                        <Button type='primary' loading={modalLoading} onClick={() => setShowExamDetail(exam)}>考卷详情</Button>
                        {/* <Button type='primary' key={"viewSize"}
                            onClick={() => initSizeList(exam)}
                        >查看尺寸数据</Button> */}
                        <Button type="primary" disabled={exam.Status !== 3}
                            onClick={() => { navigate(`/teacher/exam/${exam.Id}/demo`) }}
                        >教师展示</Button>
                        <Popconfirm disabled={exam.Status !== 3 || exam.Shared === 1}
                            title="共享考卷需要管理员审批，共享后全部教师可使用，确定共享？"
                            onConfirm={async () => await sendExamPublishAudit(exam.Id)}
                            onCancel={() => { message.info(`取消操作`) }}
                        >
                            <Button disabled={exam.Status !== 3 || exam.Shared === 1} type="primary">共享考卷</Button>
                        </Popconfirm>
                        <Button disabled={exam.Status !== 3} type="primary" onClick={() => {
                            setCurrentExam(exam);
                            setShowPublishModal(true);
                        }}>下发考核</Button>
                        <Popconfirm disabled={exam.Status !== 1}
                            title="收卷后考核学生不可继续提交，确认收卷？"
                            onConfirm={() => setExamStatus(exam, 2)}
                            onCancel={() => { message.info(`取消收卷成功`) }}
                        >
                            <Button disabled={exam.Status !== 1} type="primary">收卷</Button>
                        </Popconfirm>
                        <Button type='primary' disabled={exam.Status !== 2} onClick={() => navigate(`/teacher/exam/${exam.Id}/scores`)}>
                            教师复测
                        </Button>
                    </Space>)
                }
            }
        ]
        return columns
    }


    return (
        <div>
            <ExamDetail
                exam={currentExam}
                component={component}
                sizes={sizes}
                criterias={criterias}
                open={showExam}
                callback={() => setShowExam(false)}
            />
            <ShowSizeList
                visible={showSizeList}
                cancel={hideShowSizeList}
                sizeList={sizes}
            />
            {currentExam &&
                <PublishExam
                    visible={showPublishModal}
                    cancel={() => setShowPublishModal(false)}
                    exam={currentExam}
                    callback={() => {
                        setShowPublishModal(false);
                        callback()
                    }}
                />
            }
            {exams && <Table
                rowKey={record => record.Id}
                dataSource={exams}
                columns={generateTableColumns()}
                pagination={{ position: ["bottomCenter"], total: total, pageSize: pageSize, showSizeChanger: false }}
                scroll={{ y: 400 }}
                onChange={(pagenation: any) => pageChangeCallback(pagenation.current)}
                loading={loading}
            />}
        </div>
    )

}
