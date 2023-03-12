import { getComponentCount, getComponentList } from "../api/comp";
import { getSizeCountByComponentId, getSizeList } from "../api/size";
import { ISize } from "../interfaces/Size";

/**
 * 返回组件id关联的尺寸列表
 * @param id 组件id
 * @param OmitSafety 是否过滤安全文明生产项
 * @returns 
 */
export const getSizesByComponentId = async (id: number, OmitSafety: boolean=true):Promise<ISize[]> => {
    const count = await getSizeCountByComponentId(id);
    if (count) {
      const res = await getSizeList(1, count, id, OmitSafety);
      if(!res) return []
      return res.sizes
    }
    return []
}

/**
 * 获取全量的组件数据
 * @returns 
 */
export const getComponentListForFilter = async () => {
    const count = await getComponentCount();
    if(!count) return []
    const res = await getComponentList(1, count);
    if(!res) return []
    return res.components;
}