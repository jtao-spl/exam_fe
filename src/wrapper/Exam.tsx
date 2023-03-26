import { Form, InputNumber, message, Select, TableColumnsType, Tag } from "antd";
import { getExamCriteriaApi } from "../api/exam";
import { IComponent, ITool } from "../interfaces/Component";
import { IDeliverDetail, IExam, IExamDeliverEntity, IExamInput, ITeacherTableItem, ScoreItem, sizeScopeToDelta } from "../interfaces/Exam";
import { ICriteria } from "../interfaces/ExamCriteria";
import { ISize, ISizePrecisionData, ISizeWithScore } from "../interfaces/Size";
import { IDemoTableItem } from "../pages/teacher/TeacherDemo";
import { getSizesByComponentId } from "./Component";
import { getCriteriaDescByCriteria } from "./Criteria";

export function generateExamTableColomns() {
    const columns: TableColumnsType<IExam> = [
        // { title: "考核日期", key: 'ExamDate', dataIndex: 'ExamDate' },
        // { title: "考核时间", key: 'StartTime', dataIndex: 'StartTime' },
        // { title: "交件时间", key: 'FinishTime', dataIndex: 'FinishTime' },
        { title: '考核零件', key: 'ExamComponent', dataIndex: 'ExamComponentName' },
        { title: "考核项目", key: 'ExamTarget', dataIndex: 'ExamTarget' },
        { title: '创建人', key: 'Creator', dataIndex: 'CreatorName' },
        {
            title: '零件精密等级', key: 'SizePrecisionLevel', render: (_: any, exam: IExam) => {
                let level: string;
                switch (exam.SizePrecisionLevel) {
                    case 0:
                        level = "精密f";
                        break;
                    case 1:
                        level = "中等m";
                        break;
                    case 2:
                        level = "粗糙c";
                        break;
                    case 3:
                        level = "最粗v"
                        break;
                    case 4:
                        level = "自定义"
                        break;
                    default:
                        level = "未知"
                        break;
                }
                return <Tag>{level}</Tag>
            }
        },
        // {
        //     title: '考核状态', key: 'ExamStatus', render: (_: any, exam: IExam) => {

        //         return <Tag>{ExamStatus2Desc.get(exam.Status)}</Tag>
        //     }
        // },
        // {
        //     title: '发放班级', key: 'Class', dataIndex: 'Class'
        // }
    ]
    return columns;
}

export function generateDeliverTableCommonColumns() {
    const columns: TableColumnsType<IExamDeliverEntity> = [
        {
            title: `考核id`, key: 'id', dataIndex: `Id`,
        },
        {
            title: `考核名称`, key: 'name', dataIndex: `ExamName`,
        },
        { title: `考卷id`, key: `examId`, dataIndex: `ExamId` },
        {
            title: `考核类型`, key: `type`, render: (_: any, record: IExamDeliverEntity) => {
                if (record.ExamType === 0) return `日常训练`;
                return `期末考核`
            }
        },
        {
            title: `考核时间`, key: `time`, render: (_: any, record: IExamDeliverEntity) => {
                return `${record.ExamDate} ${record.StartTime}-${record.FinishTime}`
            }
        }
    ];
    return columns
}
/**
 * 考核列表  学生侧表头
 * @returns 
 */
export function generateStudentDeliverTableColumns() {
    const columns = [
        ...generateDeliverTableCommonColumns(),
        {
            title: `状态`, key: 'status', render: (_: any, record: IExamDeliverEntity) => {
                if (record.DeliverDetailStatus === 0) {
                    return '待提交'
                }
                else if (record.DeliverDetailStatus === 1) {
                    return `已提交`
                }
                else if (record.DeliverDetailStatus === 2) {
                    return `小组测评完成`
                }
                return `教师复测完成`
            }
        }
    ]
    return columns;
}
/**
 * 考核列表  教师侧表头
 * @returns 
 */
export function generateTeacherDeliverTableColumns() {
    const columns = [
        ...generateDeliverTableCommonColumns(),
        {
            title: `考核班级/组别`, key: `group`, render: (_: any, record: IExamDeliverEntity) => {
                return `${record.Grade?.Grade}年级${record.Grade?.Major}专业${record.Class}班/${record.GroupName === '' ? '全部' : record.GroupName}`
            },
        },
        {
            title: `考核状态`, key: `status`, render: (_: any, record: IExamDeliverEntity) => {
                if (record.Status === 0) return `待下发`;
                if (record.Status === 1) return `已下发`;
                if (record.Status === 2) return `已收卷`;
                return `已归档`
            },
        },
        {
            title: `提交进度`, key: `progress`, render: (_: any, record: IExamDeliverEntity) => {
                return record.Progress ? `${record.Progress.progress}%` : `未知`
            },
        }
    ]
    return columns;
}

/**
 * 根据尺寸长度计算精密等级
 * @param size 
 * @returns 
 */
export function getPricisionLevelIndexBySize(size: number) {
    let idx = -1;
    if (size && size >= 0.5 && size < 3) {
        idx = 0
    }
    else if (size && size >= 3 && size < 6) {
        idx = 1
    }
    else if (size && size >= 6 && size < 30) {
        idx = 2
    }
    else if (size && size >= 30 && size < 120) {
        idx = 3
    }
    else if (size && size >= 120 && size < 400) {
        idx = 4
    }
    else if (size && size >= 400 && size < 1000) {
        idx = 5
    }
    else if (size && size >= 1000 && size < 2000) {
        idx = 6
    }
    else if (size && size >= 2000 && size < 4000) {
        idx = 7
    }
    return idx;
}


/**
 * 根据线性尺寸公差等级来重计算尺寸的上下偏差
 * @param exam 考核entity
 * @param sizes 尺寸列表
 * @returns 
 */
export function getCalculatedSizeForExam(exam: IExam, sizes: ISize[]) {
    const { SizePrecisionLevel } = exam;
    if (exam.SizePrecisionLevel === 4 && !exam.Data?.precision) {
        message.error(`系统数据异常，自定义的尺寸偏差数据丢失，请重新创建考核。`);
        return [];
    }

    const newSize: ISize[] = sizes.map(size => {
        //非尺寸数据直接返回
        if (size.FirstType !== 0 || !size.BaseSize) {
            return size
        }
        //考核存在自定义偏差数据，处理后直接返回
        if (exam.SizePrecisionLevel === 4) {
            let temp = { ...size };
            const precisionData = exam.Data?.precision?.filter((item: ISizePrecisionData) => item.Id === size.Id);
            if (precisionData && precisionData?.length > 0) {
                temp.UpSize = precisionData[0].UpSize;
                temp.BottomSize = precisionData[0].BottomSize;
            }
            return temp;
        }
        //上下delta有一个不为0 直接返回
        if ((size.UpSize && size.UpSize * 1000 > 0) || (size.BottomSize && size.BottomSize * 1000 > 0)) {
            return size;
        }
        let temp = { ...size };
        const idx = getPricisionLevelIndexBySize(size.BaseSize);

        const delta = sizeScopeToDelta[SizePrecisionLevel][idx];
        temp.UpSize = delta;
        temp.BottomSize = -delta;
        return temp;
    })
    return newSize;

}


/**
  * 输入数值/数量的时候，计算该项的评分。
  * @param value 
  * @param size 
  * @returns 
  */
export const calcuateScore = (value: number | null, size: ISizeWithScore, criterias: ICriteria[], exam: IExam): number | undefined => {
    console.log(`size: ${JSON.stringify(size)}, value: ${value}`)
    if (!value) return;
    if (size.FirstType === 0) {
        const criteria = criterias.filter((c: ICriteria) => c.FirstType === 0 && c.SizeType === size.SecondType);
        if (criteria.length === 0) return;
        if (!criteria[0].SizeDelta || !criteria[0].SizeDeductScore) return;

        if (!exam.Data) return;
        const scoreItem = exam.Data.scores?.filter((item: ScoreItem) => item.SizeId === size.Id);
        if (!scoreItem || scoreItem.length === 0) return;
        if (!size.BottomSize || !size.UpSize || !size.BaseSize) return;
        const BottomBound = size.BottomSize * 1 + size.BaseSize * 1;
        const UpBound = size.UpSize * 1 + size.BaseSize * 1
        if (value >= BottomBound && value <= UpBound) {
            return scoreItem[0].Score
        } else {
            if (value < BottomBound) {
                const score = scoreItem[0].Score - (BottomBound - value) * criteria[0].SizeDeductScore / criteria[0].SizeDelta;
                return score > 0 ? score : 0
            } else {
                const score = scoreItem[0].Score - (value - UpBound) * criteria[0].SizeDeductScore / criteria[0].SizeDelta;
                return score > 0 ? score : 0
            }
        }
    }
    if (size.FirstType === 1) {
        const criteria = criterias.filter((c: ICriteria) => c.FirstType === 1 && c.GeoType === size.GeoToleranceType);
        if (criteria.length === 0) return;
        //如果第一个字符不是数字、负号或者. ，Number.parseFloat返回NaN
        let GeoVal = size.GeoToleranceVal;
        if (!GeoVal) return;
        while (!GeoVal.startsWith('0') && !GeoVal.startsWith('-') && !GeoVal.startsWith('.')) {
            GeoVal = GeoVal.substring(1);
        }
        const ScoreVal = Number.parseFloat(GeoVal);
        if (isNaN(ScoreVal)) {
            console.log(`解析形位公差值失败，${size.GeoToleranceVal}`);
            return;
        }
        if (!exam.Data) return;
        const scoreItem = exam.Data.scores?.filter((item: ScoreItem) => item.SizeId === size.Id);
        if (!scoreItem || scoreItem.length === 0) return;

        if (value <= ScoreVal) {
            //满分
            return scoreItem[0].Score
        } else {
            if (!criteria[0].GeoDelta || !criteria[0].GeoDeductScore) return;
            const score = scoreItem[0].Score - (value - ScoreVal) * criteria[0].GeoDeductScore / criteria[0].GeoDelta;
            return score > 0 ? score : 0
        }

    }
    if (size.FirstType === 2) {
        const criteria = criterias.filter((c: ICriteria) => c.FirstType === 2 && c.SurfaceRoughnessVal === size.SurfaceRoughnessVal);
        if (criteria.length === 0) return;
        if (criteria[0].SurfaceRoughnessCount && criteria[0].SurfaceRoughnessScore) {
            const score = value * criteria[0].SurfaceRoughnessScore / criteria[0].SurfaceRoughnessCount;
            return score > 0 ? score : 0
        }
    }
    if (size.FirstType === 3) {
        const criteria = criterias.filter((c: ICriteria) => c.FirstType === 3);
        if (criteria.length === 0) return;
        if (criteria[0].UnDeclaredChamferCount && criteria[0].UnDeclaredChamferTotalVal) {
            const score = value * criteria[0].UnDeclaredChamferTotalVal / criteria[0].UnDeclaredChamferCount;
            return score > 0 ? score : 0
        }
    }
}

/**
 * 根据教师输入的尺寸测量值和当前的尺寸 计算测量结果并展示
 * @param item 
 * @param value 
 * @returns 
 */
export const getMeasureResult = (item: IDemoTableItem, value: number) => {
    const size = item.size;
    if (size.FirstType === 0) {
        if (size.BaseSize === undefined || size.UpSize === undefined || size.BottomSize === undefined) return '解析失败';
        const upBound = size.BaseSize + size.UpSize;
        const bottomBound = size.BaseSize + size.BottomSize;
        if (size.SecondType === 0) {
            if (value > upBound) return '返工';
            if (value < bottomBound) return '报废';
            return '入库';
        }
        if (size.SecondType === 1 || size.SecondType === 2) {
            if (size.DiameterType === 1) {
                if (value > upBound) return '返工';
                if (value < bottomBound) return '报废';
                return '入库';
            }
            if (size.DiameterType === 2) {
                if (value > upBound) return '报废';
                if (value < bottomBound) return '返工';
                return '入库';
            }
            return '解析失败';
        }
        if (size.SecondType === 3) {
            if (value > upBound) return '返工';
            if (value < bottomBound) return '报废';
            return '入库';
        }
    }
    if (size.FirstType === 1) {
        let GeoVal = size.GeoToleranceVal;
        if (!GeoVal) return '解析失败';
        while (!GeoVal.startsWith('0') && !GeoVal.startsWith('-') && !GeoVal.startsWith('.')) {
            GeoVal = GeoVal.substring(1);
        }
        const ScoreVal = Number.parseFloat(GeoVal);
        if (isNaN(ScoreVal)) {
            console.log(`解析形位公差值失败，${size.GeoToleranceVal}`);
            return '解析失败';
        }
        if (value <= ScoreVal) return '入库';
        return '返工';
    }
    if (size.FirstType === 2) {
        if (!size.SurfaceRoughnessVal) return '解析失败';
        if (value <= size.SurfaceRoughnessVal) return '入库';
        return '返工'
    }
    return '解析失败';
}

/**
 * 输入测量值/数量时计算得分
 * @param item 
 * @param value 
 * @returns 
 */
export const getMeasureScore = (item: ITeacherTableItem, value: number) => {
    const size = item.size;
    if (size.FirstType === 4) {
        if (value < item.score) return value;
        return item.score
    }
    const criteria = item.criteria;
    if (!criteria) return 0;
    if (size.FirstType === 0) {
        if (criteria.SizeDelta === undefined || criteria.SizeDelta === 0 || criteria.SizeDeductScore === undefined) return 0;
        if (size.BottomSize === undefined || size.UpSize === undefined || size.BaseSize === undefined) return 0;
        const BottomBound = size.BottomSize * 1 + size.BaseSize * 1;
        const UpBound = size.UpSize * 1 + size.BaseSize * 1
        if (value >= BottomBound && value <= UpBound) {
            return item.score
        } else {
            if (value < BottomBound) {
                const score = item.score - (BottomBound - value) * criteria.SizeDeductScore / criteria.SizeDelta;
                return score > 0 ? score.toFixed(2) : 0
            } else {
                const score = item.score - (value - UpBound) * criteria.SizeDeductScore / criteria.SizeDelta;
                return score > 0 ? score.toFixed(2) : 0
            }
        }
    }
    if (size.FirstType === 1) {
        //如果第一个字符不是数字、负号或者. ，Number.parseFloat返回NaN
        let GeoVal = size.GeoToleranceVal;
        if (!GeoVal) return 0;
        while (!GeoVal.startsWith('0') && !GeoVal.startsWith('-') && !GeoVal.startsWith('.')) {
            GeoVal = GeoVal.substring(1);
        }
        const ScoreVal = Number.parseFloat(GeoVal);
        if (isNaN(ScoreVal)) {
            console.log(`解析形位公差值失败，${size.GeoToleranceVal}`);
            return 0;
        }

        if (value <= ScoreVal) {
            //满分
            return item.score;
        } else {
            if (criteria.GeoDelta === undefined || criteria.GeoDelta === 0 || criteria.GeoDeductScore === undefined) return 0;
            const score = item.score - (value - ScoreVal) * criteria.GeoDeductScore / criteria.GeoDelta;
            return score > 0 ? score.toFixed(2) : 0
        }

    }
    if (size.FirstType === 2) {
        if (criteria.SurfaceRoughnessCount && criteria.SurfaceRoughnessScore) {
            const score = value * criteria.SurfaceRoughnessScore / criteria.SurfaceRoughnessCount;
            return score > 0 ? score.toFixed(2) : 0
        }
    }
    if (size.FirstType === 3) {
        if (criteria.UnDeclaredChamferCount && criteria.UnDeclaredChamferTotalVal) {
            const score = value * criteria.UnDeclaredChamferTotalVal / criteria.UnDeclaredChamferCount;
            return score > 0 ? score.toFixed(2) : 0
        }
    }
    return 0;
}

/**
 * 给定的考核标准列表中，根据尺寸类型返回对应的criteria
 */
export const filterCriteriaForSize = (criterias: ICriteria[], size: ISize) => {
    if (size.FirstType === 0) {
        const criteria = criterias.filter((c: ICriteria) => c.FirstType === 0 && c.SizeType === size.SecondType);
        if (criteria.length === 0) return;
        return criteria[0];
    }
    if (size.FirstType === 1) {
        const criteria = criterias.filter((c: ICriteria) => c.FirstType === 1 && c.GeoType === size.GeoToleranceType);
        if (criteria.length === 0) return;
        return criteria[0];
    }
    if (size.FirstType === 2) {
        console.log(`SIZE: ${JSON.stringify(size)}`);
        console.log(`criterias: ${JSON.stringify(criterias)}`);
        const criteria = criterias.filter((c: ICriteria) => c.FirstType === 2 && c.SurfaceRoughnessVal === size.SurfaceRoughnessVal);
        if (criteria.length === 0) return;
        return criteria[0];
    }
    if (size.FirstType === 3) {
        const criteria = criterias.filter((c: ICriteria) => c.FirstType === 3);
        if (criteria.length === 0) return;
        return criteria[0];
    }
    return;
}

/**
 * 教师演示时根据各尺寸数据计算零件结论
 * @param items 
 * @returns 
 */
export const getSummary = (items: IDemoTableItem[]) => {
    const fail = items.some((item: IDemoTableItem) => item.result === '报废');
    if (fail) return '报废';
    const pass = items.every((item: IDemoTableItem) => item.result === '入库');
    if (pass) return '入库';
    const done = items.every((item: IDemoTableItem) => item.result !== '待定');
    if (done) {
        const back = items.some((item: IDemoTableItem) => item.result === '返工');
        if (back) return '返工';
    }
    return '待定';
}
/**
 * 输入尺寸时  获取总分
 * @param items 
 * @returns 
 */
export const getTotalScore = (items: ITeacherTableItem[]) => {
    let result = 0
    const validItems = items.filter((item: ITeacherTableItem) => item.result !== '待定')
    validItems.forEach((item: ITeacherTableItem) => item.result === '待定' ? '' : typeof item.result === "string" ? result += Number.parseFloat(item.result) : result += (item.result as number))
    return result.toFixed(2);
}

/**
 * 互测列表表头
 * @returns 
 */
export const generateDeliverTableColumns = () => {
    const columns: TableColumnsType<IDeliverDetail> = [
        {
            title: '提交No', key: 'Id', dataIndex: 'Id',
        },
        {
            title: '学号', key: 'StudentId', dataIndex: 'StudentId',
        },
        {
            title: '姓名', key: 'StudentName', dataIndex: 'StudentName',
        },
    ]
    return columns;
}

/**
 * 复测列表表头
 * @returns 
 */
export const generateFinalDeliverTableColumns = () => {
    const columns: TableColumnsType<IDeliverDetail> = [
        ...generateDeliverTableColumns(),
        {
            title: `提交状态`, key: 'subStatus', render: (_: any, record: IDeliverDetail) => {
                const result = record.Status === 0 ? '未提交自测结果' :
                    record.Status === 1 ? '已提交自测结果' :
                        record.Status === 2 ? '已完成小组互测' :
                            '已复测'
                return <Tag>{result}</Tag>
            }
        },
        {
            title: `复测状态`, key: 'status', render: (_: any, record: IDeliverDetail) => {
                const result = record.Status !== 3 ? '待复测' : '已复测';
                return <Tag>{result}</Tag>
            }
        }
    ];
    return columns;
}

const commonHeader = {
    title: '检测项目内容', key: 'content', children: [
        { title: '检测类别', key: 'type', dataIndex: 'project'},
        {
            title: '检测要求', key: 'requirement', children: [
                {
                    title: '基本尺寸', key: 'baseSize', dataIndex: 'baseSize', 
                    onCell: (data: ITeacherTableItem) => {
                        if (data.size.FirstType !== 0) {
                            return { colSpan: 3 }
                        }
                        return { colSpan: 1 }
                    }
                },
                {
                    title: '上偏差', key: 'upSize', dataIndex: 'upSize',
                    onCell: (data: ITeacherTableItem) => {
                        if (data.size.FirstType !== 0) {
                            return { colSpan: 0 }
                        }
                        return { colSpan: 1 }
                    }
                },
                {
                    title: '下偏差', key: 'bottomSize', dataIndex: 'bottomSize', 
                    onCell: (data: ITeacherTableItem) => {
                        if (data.size.FirstType !== 0) {
                            return { colSpan: 0 }
                        }
                        return { colSpan: 1 }
                    }
                },
                {
                    title: '配分', key: 'score', dataIndex: 'score', 
                },
                {
                    title: '评分标准', key: 'criteria', render: (_: any, record: ITeacherTableItem) => {
                        return getCriteriaDescByCriteria(record.criteria)
                    },
                    ellipsis: true, 
                },
            ]
        }
    ]
}
/**
 * 提交数据页表头
 * @returns 
 */
export const generateStudentExamTableColumns = (tools: ITool[]) => {
    const columns: TableColumnsType<ITeacherTableItem> = [
        {
            title: '学生测量（自测/互测）评分模块', key: 'studentExam', children: [
                commonHeader,
                {
                    title: '检测结果', key: 'result', children: [
                        {
                            title: '测量工具', key: 'tool', width: 130, fixed: "right",render: (_: any, record: ITeacherTableItem, index: number) => {
                                if ([0, 1, 2].includes(record.size.FirstType)) {
                                    return <Form.Item name={['Sizes', index, "tool"]}
                                        required={true}
                                        rules={[{
                                            required: true,
                                            message: '请选择'
                                        }]}>
                                        <Select>
                                            {
                                                tools.map((tool: ITool) =>
                                                    (<Select.Option key={tool.Id} value={tool.Id}>{tool.Name}</Select.Option>)
                                                )
                                            }
                                        </Select>
                                    </Form.Item>
                                }
                                return ''
                            }
                        },
                        {
                            title: '测量尺寸/数量', key: 'input', width: 130, fixed: "right", render: (_: any, record: ITeacherTableItem, index: number) => {
                                return <Form.Item name={['Sizes', index, "size"]}
                                    required={true}
                                    rules={[{
                                        required: true,
                                        message: '请输入'
                                    }]}
                                >
                                    {record.size.FirstType === 2 ? <InputNumber min={0} step={1} max={record.size.SurfaceRoughnessCount} /> :
                                        record.size.FirstType === 3 ? <InputNumber min={0} step={1} max={record.size.UnDeclaredChamferCount} /> :
                                            record.size.FirstType === 4 ? <InputNumber min={0} step={1} max={record.score} /> :
                                                <InputNumber min={0} />
                                    }
                                </Form.Item>
                            }
                        },
                        {
                            title: '得分', key: 'sizeResult', dataIndex: 'result', width: 60, fixed: "right",
                        }
                    ]
                }
            ]
        }
    ]
    return columns;
}

export const generateTeacherExamTableColumns = () => {
    const columns: TableColumnsType<ITeacherTableItem> = [
        {
            title: '教师复测测量评分模块', key: 'teacherExam', children: [
                commonHeader,
                {
                    title: '检测结果', key: 'result', children: [
                        {
                            title: `学生自测`, key: `selfData`, children: [
                                {
                                    title: `测量工具`, key: `selfTool`, dataIndex: 'selfTool',
                                },
                                {
                                    title: `测量尺寸`, key: `selfSize`, dataIndex: `selfSize`,
                                },
                                {
                                    title: `得分`, key: `selfScore`, dataIndex: `selfScore`,
                                }
                            ]
                        },
                        {
                            title: `学生互测`, key: `groupData`, children: [
                                {
                                    title: `测量尺寸`, key: `groupSize`, dataIndex: `groupSize`
                                },
                                {
                                    title: `得分`, key: `groupScore`, dataIndex: `gourpScore`
                                }
                            ]
                        },
                        {
                            title: '教师评测', key: 'teacherScore', children: [
                                {
                                    title: '测量尺寸/数量', key: 'input',width: 130, fixed:"right", render: (_: any, record: ITeacherTableItem, index: number) => {
                                        return <Form.Item name={['Sizes', index, "size"]}
                                            required={true}
                                            rules={[{
                                                required: true,
                                                message: '请输入'
                                            }]}
                                        >
                                            {record.size.FirstType === 2 ? <InputNumber min={0} step={1} max={record.size.SurfaceRoughnessCount} /> :
                                                record.size.FirstType === 3 ? <InputNumber min={0} step={1} max={record.size.UnDeclaredChamferCount} /> :
                                                    record.size.FirstType === 4 ? <InputNumber min={0} step={1} max={record.score} /> :
                                                        <InputNumber min={0} />
                                            }
                                        </Form.Item>
                                    }
                                },
                                {
                                    title: '得分', key: 'sizeResult', dataIndex: 'result', width: 60, fixed:"right",
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ];
    return columns;
}

/**
 * 构造填写数据时的基本考核零件表单项
 * @param component 
 * @param exam 
 * @returns 
 */
export const generateTableItem = async (component: IComponent, exam: IExam, detail?: IDeliverDetail, tools?: ITool[]): Promise<ITeacherTableItem[]> => {
    const sizes = await getSizesByComponentId(component.Id, false);
    const calSizes = getCalculatedSizeForExam(exam, sizes);
    const scoreData = exam.Data;
    const criterias = await getExamCriteriaApi(exam.CriteriaId);

    let items: ITeacherTableItem[] = calSizes.map((size: ISize) => {
        let currentScore = 0;
        const curScores = scoreData!.scores!.filter((item: ScoreItem) => item.SizeId === size.Id);
        if (curScores.length > 0) currentScore = curScores[0].Score;
        return {
            id: size.Id,
            size: size,
            project: size.FirstType === 0 && size.SecondType !== undefined && size.SecondType === 0 ? '线性（L）' :
                size.FirstType === 0 && size.SecondType !== undefined && size.SecondType === 1 && size.DiameterType !== undefined && size.DiameterType === 2 ? '内径（d）' :
                    size.FirstType === 0 && size.SecondType !== undefined && size.SecondType === 1 ? '外径（D）' :
                        size.FirstType === 0 && size.SecondType !== undefined && size.SecondType === 2 ? '半径（r）' :
                            size.FirstType === 0 && size.SecondType !== undefined && size.SecondType === 3 ? '角度（∠）' :
                                size.FirstType === 1 ? <span className='gdt'>{`形位公差（${size.GeoToleranceType}）`}</span> :
                                    size.FirstType === 2 && size.SurfaceRoughnessVal !== undefined ? `表面粗糙度(Ra${size.SurfaceRoughnessVal})` :
                                        size.FirstType === 3 ? `未注倒角` :
                                            size.FirstType === 4 ? `安全文明生产` : `未知FirstType：${size.FirstType}`,
            baseSize: size.FirstType === 0 && size.BaseSize !== undefined ? size.BaseSize :
                size.FirstType === 1 && size.GeoToleranceVal !== undefined ? size.GeoToleranceVal :
                    size.FirstType === 2 && size.SurfaceRoughnessCount !== undefined ? `${size.SurfaceRoughnessCount}处` :
                        size.FirstType === 3 && size.UnDeclaredChamferCount !== undefined ? `${size.UnDeclaredChamferCount}处` :
                            size.FirstType === 4 && size.SafetyRequirement !== undefined ? size.SafetyRequirement : 0,
            upSize: size.FirstType === 0 && size.UpSize !== undefined ? size.UpSize : '-',
            bottomSize: size.FirstType === 0 && size.BottomSize !== undefined ? size.BottomSize : '-',
            score: currentScore,
            criteria: filterCriteriaForSize(criterias, size),
            toolId: 1,
            result: `待定`
        }
    })

    if (detail) {
        items = items.map((item: ITeacherTableItem) => {
            const sizeId = item.id;
            const selfData = getInputOfSizeId(sizeId, detail.SelfData)
            const groupData = getInputOfSizeId(sizeId, detail.GroupData)
            return ({
                ...item,
                selfTool: getToolNameById(selfData?.toolId, tools),
                selfSize: selfData?.value,
                selfScore: selfData?.score,
                groupSize: groupData?.value,
                groupScore: groupData?.score
            })
        })
    }
    items.sort((a: ITeacherTableItem, b: ITeacherTableItem) => a.id - b.id);
    return items;
}

const getInputOfSizeId = (sizeId: number, data?: IExamInput[]) => {
    if (!data) return;
    const target = data.filter((item: IExamInput) => item.sizeId === sizeId);
    if (target.length > 0) return target[0];
    return;
}
const getToolNameById = (toolId?: number, tools?: ITool[]) => {
    if (!toolId || !tools) return '';
    const target = tools.filter((tool: ITool) => tool.Id === toolId);
    if (target.length > 0) return target[0].Name;
    return ''
}