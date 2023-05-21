import { TableColumnsType, Tag } from "antd";
import { batchGetStudentGradeInfo, getAllGradeClass, getGroupInfos } from "../api/student";
import { IGrade, IGroupInfo, IStudentInfo, Option } from '../interfaces/Student';
import { range } from "../utils/common";
export const getOptions = async () => {
  const res = await getAllGradeClass();
  // data: :[{"Grade":2022,"Class":['机械-1,钳工-2]},...]
  const options: Option[] = res.map(input => ({
    label: `${input.Grade}级`,
    value: input.Grade,
    children: input.Class.map((cls: string) => ({
      value: cls,
      label: `${cls}班`
    }))
  }))
  return options;
}

/**
 * 年级专业班级三连下拉框
 * @returns 
 */
export const getOptionsV2 = async (returnGroup: boolean = false) => {
  const res = await batchGetStudentGradeInfo();
  const Grades = res.map((grade: IGrade) => grade.Grade);
  const uniqGrades = Array.from(new Set(Grades));
  const options: Option[] = await Promise.all(uniqGrades.map(async (grade: number) => {
    const majors = res.filter((g: IGrade) => g.Grade === grade);
    const majorOpts = await Promise.all(majors.map(async (g: IGrade) => {
      if (returnGroup) {
        const groupMap = new Map<number, string>();
        const groups = await getGroupInfos();
        range(g.ClassCount).map((cls: number) => {
          let gList = [];
          gList.push({
            label: `全部`,
            value: '全部'
          });
          const hasGrouped = groups.find((group: IGroupInfo) => group.GradeId === g.Id && group.Class === cls +1);
          gList.push(...['A', 'B'].map((gName: string) => ({ label: `${gName}组`, value: gName, disabled: !hasGrouped })))
          groupMap.set(cls, JSON.stringify(gList))
        })
        return {
          label: `${g.Major}`,
          value: g.Major,
          children: range(g.ClassCount).map((cls: number) => ({ label: `${cls + 1}班`, value: cls + 1, children: JSON.parse(groupMap.get(cls)!) }))
        }
      }
      return {
        label: `${g.Major}`,
        value: g.Major,
        children: range(g.ClassCount).map((cls: number) => ({ label: `${cls + 1}班`, value: cls + 1 }))
      }
    }))
    return {
      label: `${grade}`,
      value: grade,
      children: majorOpts
    }
  }))
  return options;
}

/**
 * 学生列表通用字段
 * @returns 
 */
export const generateStudentTableColumn = () => {
  const coloums: TableColumnsType<IStudentInfo> = [
    { title: '学号', key: 'StudentId', dataIndex: 'StudentId' },
    { title: '姓名', key: 'Name', dataIndex: 'Name' },
    { title: '年级', key: 'Grade', dataIndex: 'Grade' },
    { title: '专业', key: 'Major', dataIndex: 'Major' },
    {
      title: '班级', key: 'Class', render: (_: any, record: IStudentInfo) => {
        return (<div>{record.Class === 0 ? '待定' : record.Class + '班'} </div>)
      }
    },
    {
      title: '状态', key: 'status', render: (_: any, record: IStudentInfo) => {
        return (<Tag color={record.Deleted ? 'red' : 'green'}>{record.Deleted ? '已禁用' : '有效'}</Tag>)
      }
    }
  ]
  return coloums;
}