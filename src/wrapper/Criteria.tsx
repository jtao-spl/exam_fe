import { TableColumnsType, Tag } from "antd";
import { GeoToleranceEntity, ICriteria, SizedEntity } from "../interfaces/ExamCriteria";

export function generateCriteriaColumns() {
    const columns: TableColumnsType<ICriteria> = [
        {
            title: "类型", key: 'type', render: (_: any, criteria: ICriteria) => {
                if (criteria.FirstType === 0 && criteria.SizeType !== undefined) {
                    return <Tag> {SizedEntity[criteria.SizeType]['name']}</Tag>;
                }
                if (criteria.FirstType === 1 && criteria.GeoType) {
                    const currentElement = GeoToleranceEntity.filter(item => item['symbol'] === criteria.GeoType);
                    if (currentElement.length >= 1) {
                        return <Tag > {currentElement[0]['name']}</Tag>
                    }
                }
                if (criteria.FirstType === 2) {
                    return <Tag >表面粗糙度</Tag>
                }
                if (criteria.FirstType === 3) {
                    return <div>未注倒角</div>
                }
            }
        },
        {
            title: "符号", key: 'symbol', render: (_: any, criteria: ICriteria) => {
                if (criteria.FirstType === 0 && criteria.SizeType !== undefined) {
                    return <Tag> {SizedEntity[criteria.SizeType]['symbol']}</Tag>;
                }
                if (criteria.FirstType === 1 && criteria.GeoType) {
                    return <Tag className='gdt'>{criteria.GeoType}</Tag>
                }
                if (criteria.FirstType === 2) {
                    return <Tag >Ra{criteria.SurfaceRoughnessVal}</Tag>
                }
                if (criteria.FirstType === 3) {
                    return <div></div>
                }
            }
        },
        {
            title: '评测标准', key: 'criteriainfo', render: (_: any, criteria) => {
                return <Tag>{getCriteriaDescByCriteria(criteria)}</Tag>
            }
        }
    ]

    return columns;
}


export function getCriteriaDescByCriteria(criteria?: ICriteria) {
    if (!criteria) return ''
    if (criteria.FirstType === 0 && criteria.SizeDelta && criteria.SizeDeductScore) {
        return `偏差范围以得分，偏差范围外每超差${criteria.SizeDelta}扣${criteria.SizeDeductScore}分，配分扣完为止`
    }
    if (criteria.FirstType === 1 && criteria.GeoBase && criteria.GeoDelta && criteria.GeoDeductScore) {
        return `低于${criteria.GeoBase}得分，高于${criteria.GeoBase}每超差${criteria.GeoDelta}扣${criteria.GeoDeductScore}分，配分扣完为止`
    }
    if (criteria.FirstType === 2) {
        return `样块对比目测，符合要求得分`
    }
    if (criteria.FirstType === 3 && criteria.UnDeclaredChamferCount && criteria.UnDeclaredChamferCount > 0) {
        return `共计${criteria.UnDeclaredChamferCount}处，总共${criteria.UnDeclaredChamferTotalVal}分`
    }
    return ``
}