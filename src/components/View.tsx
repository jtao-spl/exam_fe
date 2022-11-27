import React, { lazy, Suspense } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

import routers, { studentRoutes, unAuthRoutes } from '../router';
import LayoutComponent from './Layout';


const ChangePassword = lazy(()=>import('../pages/auth/ChangePassword'));
const Exam =  lazy(()=>import('../pages/student/Exam'));
const Exams =  lazy(()=>import('../pages/student/Exams'));
const ExamList = lazy(()=>import('../pages/exam/ExamList'));
const AddExamV2 = lazy(()=>import('../pages/exam/AddExamV2'));
const EditComponentV2 = lazy(()=>import('../pages/component/EditComponentV2'));
const ComponentList = lazy(()=>import('../pages/component/ComponentList'));

export default function View() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route element={<LayoutComponent />}>
            <Route path='/stu' key='stu'>
              <Route path='exams' key='stu_exams' element={<Exams />}></Route>
              <Route path='exam/:id' key='detail exam' element={<Exam />}></Route>
              {/* <Route path='scores' key='score list' element={<Scores />}></Route>
              <Route path='score/:id' key='score detail' element={<Score />}></Route> */}
            </Route>
            <Route path='/component' key='component'>
              <Route index={true} element={<ComponentList />} />
              <Route path=':id' element={<EditComponentV2 />} />
            </Route>
            <Route path='/exam' key='examlist' >
              <Route index={true} element={<ExamList />} />
              <Route path='create' element={<AddExamV2 />} />
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
