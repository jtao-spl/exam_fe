import { getAllGradeClass } from "../api/student";
import { Option } from '../interfaces/Student';
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