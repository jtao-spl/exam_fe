import React, { lazy, Suspense } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

import { unAuthRoutes } from '../router';
import LayoutComponent from './Layout';


const ChangePassword = lazy(() => import('../pages/auth/ChangePassword'));
const Exam = lazy(() => import('../pages/student/Exam'));
const Exams = lazy(() => import('../pages/student/Exams'));
const ExamList = lazy(() => import('../pages/exam/ExamList'));
const AddExamV2 = lazy(() => import('../pages/exam/AddExamV2'));
const TeacherDemo = lazy(() => import('../pages/teacher/TeacherDemo'));
const EditComponentV2 = lazy(() => import('../pages/component/EditComponentV2'));
const ComponentList = lazy(() => import('../pages/component/ComponentList'));
const ToolList = lazy(() => import('../pages/teacher/ToolList'));
const ScoreList = lazy(() => import('../pages/exam/score/ScoreList'));
const TeacherList = lazy(() => import('../pages/admin/TeacherList'));
const AddExamTarget = lazy(() => import('../pages/exam/AddExamTarget'));
const StudentUpload = lazy(() => import('../pages/upload/StudentUpload'));
const StudentList = lazy(() => import('../pages/admin/StudentList'));
const TeacherStuList = lazy(() => import('../pages/teacher/StudentList'));
const PasswordReset = lazy(() => import('../pages/admin/PasswordReset'));
const ExamAudit = lazy(() => import('../pages/admin/ExamAudit'));
const DeliverList = lazy(() => import('../pages/exam/deliver/DeliverList'));
const Delivers = lazy(() => import('../pages/student/Delivers'));
const ExamInput = lazy(() => import('../pages/student/ExamInput'));
const GroupInput = lazy(() => import('../pages/student/GroupInput'));
const FinalInput = lazy(() => import('../pages/teacher/FinalInput'));
const ChartStats  = lazy(()=>import('../pages/teacher/ChartStats')) ;
const ArchivedList = lazy(() => import('../pages/exam/deliver/ArchivedList'));
export default function View() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>加载中...</div>}>
        <Routes>
          <Route element={<LayoutComponent />}>
            <Route path='/student' key='stu'>
              <Route path='exams' key='stu_exams' element={<Delivers />}></Route>
              <Route path='exam/:id/:detailId' key='detail exam' element={<ExamInput />}></Route>
              <Route path='partner' key='partner' element={<GroupInput />} />
              {/* <Route path='exam/:id/detail' key='exam score detail' element={<Exam role="student" />}></Route> */}
              {/* <Route path='scores' key='score list' element={<Scores />}></Route>
              <Route path='score/:id' key='score detail' element={<Score />}></Route> */}
            </Route>
            <Route path='/teacher' key='teacher'>
              <Route path='component' key='component'>
                <Route path='list' element={<ComponentList />} />
                <Route path=':id' element={<EditComponentV2 />} />
                <Route path='tools' element={<ToolList />} />
              </Route>
              <Route path='exam' key='examlist' >
                <Route path='list' element={<ExamList />} />
                <Route path='create' element={<AddExamV2 />} />
                <Route path=':id/demo' element={<TeacherDemo />} />
                <Route path=':id/scores' element={<ScoreList />} />
                <Route path=':id/scores/:studentId/edit' element={<Exam role='teacher' />} />
                <Route path='target/create' element={<AddExamTarget />} />
                <Route path='deliver' element={<DeliverList />} />
                <Route path='deliver/archived' element={<ArchivedList />} />
                <Route path="final/:id" element={<FinalInput />} />
                <Route path='stats' element={<ChartStats />} />
              </Route>
              <Route path='student' key='student'>
                <Route path='list' element={<TeacherStuList />} />
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
              <Route path='tool/list' key='tool' element={<ToolList />}></Route>
              <Route path='exam/list' key='exam' element={<ExamAudit />}></Route>
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
