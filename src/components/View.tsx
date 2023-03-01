import React, { lazy, Suspense } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
// import PasswordReset from '../pages/admin/PasswordReset';
// import TeacherList from '../pages/admin/TeacherList';
// import AddExamTarget from '../pages/exam/AddExamTarget';
// import StudentUpload from '../pages/upload/StudentUpload';

import routers, { IRouter, studentRoutes, teacherRouters, unAuthRoutes } from '../router';
import LayoutComponent from './Layout';


const ChangePassword = lazy(() => import('../pages/auth/ChangePassword'));
const Exam = lazy(() => import('../pages/student/Exam'));
const Exams = lazy(() => import('../pages/student/Exams'));
const ExamList = lazy(() => import('../pages/exam/ExamList'));
const AddExamV2 = lazy(() => import('../pages/exam/AddExamV2'));
const TeacherDemo = lazy(()=>import('../pages/teacher/TeacherDemo'));
const EditComponentV2 = lazy(() => import('../pages/component/EditComponentV2'));
const ComponentList = lazy(() => import('../pages/component/ComponentList'));
const ScoreList = lazy(() => import('../pages/exam/score/ScoreList'));
const TeacherList = lazy(() => import('../pages/admin/TeacherList'));
const AddExamTarget = lazy(() => import('../pages/exam/AddExamTarget'));
const StudentUpload = lazy(() => import('../pages/upload/StudentUpload'));
const StudentList = lazy(()=>import('../pages/admin/StudentList'));
const PasswordReset = lazy(() => import('../pages/admin/PasswordReset'));
export default function View() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>加载中...</div>}>
        <Routes>
          <Route element={<LayoutComponent />}>
            <Route path='/student' key='stu'>
              <Route path='exams' key='stu_exams' element={<Exams />}></Route>
              <Route path='exam/:id' key='detail exam' element={<Exam role='student' />}></Route>
              <Route path='exam/:id/detail' key='exam score detail' element={<Exam role="student" />}></Route>
              {/* <Route path='scores' key='score list' element={<Scores />}></Route>
              <Route path='score/:id' key='score detail' element={<Score />}></Route> */}
            </Route>
            <Route path='/teacher' key='teacher'>
              <Route path='component' key='component'>
                <Route path='list' element={<ComponentList />} />
                <Route path=':id' element={<EditComponentV2 />} />
              </Route>
              <Route path='exam' key='examlist' >
                <Route path='list' element={<ExamList />} />
                <Route path='create' element={<AddExamV2 />} />
                <Route path='demo' element={<TeacherDemo />} />
                <Route path=':id/scores' element={<ScoreList />} />
                <Route path=':id/scores/:studentId/edit' element={<Exam role='teacher' />} />
                <Route path='target/create' element={<AddExamTarget />} />
              </Route>
              {/* <Route path='student' key='man_stu'>
                <Route path='upload' key='ustu' element={<StudentUpload />}> </Route>
              </Route> */}
            </Route>
            <Route path='/admin' key='admin'>
              <Route path='teacher/list' key='teachers' element={<TeacherList />} />
              <Route path='password/reset' key='pwd reset' element={<PasswordReset />} />
              <Route path='student/upload' key='ustu' element={<StudentUpload />}> </Route>
              <Route path='student/list' key='stuList' element={<StudentList />}> </Route>
            </Route>
            <Route path='/auth/modify' key='mod pass' element={<ChangePassword />} />


          </Route>
          {unAuthRoutes.map(r => (<Route path={r.path} key={r.key} element={r.element} ></Route>))}
        </Routes>
        {/* <Routes>
            {unAuthRoutes.map(r => (<Route path={r.path} key={r.key} element={r.element} ></Route>))}
          </Routes> */}
      </Suspense>
    </BrowserRouter>
  )
}
