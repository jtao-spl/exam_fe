import { message, TableColumnsType, Tag } from "antd";
import { ExamStatus2Desc, IExam, ScoreItem } from "../interfaces/Exam";
import { ICriteria } from "../interfaces/ExamCriteria";
import { ISize, ISizePrecisionData, ISizeWithScore } from "../interfaces/Size";

export function generateExamTableColomns() {
    const columns: TableColumnsType<IExam> = [
        { title: "考核日期", key: 'ExamDate', dataIndex: 'ExamDate' },
        { title: "考核时间", key: 'StartTime', dataIndex: 'StartTime' },
        { title: "交件时间", key: 'FinishTime', dataIndex: 'FinishTime' },
        { title: "考核项目", key: 'ExamTarget', dataIndex: 'ExamTarget' },
        { title: '考核教师', key: 'ExamTeacher', dataIndex: 'ExamTeacher' },
        { title: '考核零件', key: 'ExamComponent', dataIndex: 'ExamComponent' },
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
        {
            title: '考核状态', key: 'ExamStatus', render: (_: any, exam: IExam) => {

                return <Tag>{ExamStatus2Desc.get(exam.Status)}</Tag>
            }
        },
        {
            title: '发放班级', key: 'Class', dataIndex: 'Class'
        }
    ]
    return columns;
}

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
 * @param sizeScopeToDelta 标准尺寸范围&公差等级对照表
 * @returns 
 */
export function getCalculatedSizeForExam(exam: IExam, sizes: ISize[], sizeScopeToDelta: number[][]) {
    const { SizePrecisionLevel } = exam;
    if (exam.SizePrecisionLevel === 4 && !exam.Data?.precision) {
        message.error(`系统数据异常，自定义的尺寸偏差数据丢失，请重新创建考核。`);
        return [];
    }

    const newSize = sizes.map(size => {
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