import { IStudentInfo } from '../pages/upload/StudentPreview';
import request from '../utils/request';

export const saveStudents = (students:IStudentInfo[]) => {
    return request({
        url: '/student',
        method: 'post',
        data: {students: students}
    })
}