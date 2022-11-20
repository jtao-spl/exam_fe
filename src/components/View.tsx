import React, { Component, lazy, Suspense } from 'react';
import { Routes, Route, BrowserRouter, useNavigate } from 'react-router-dom';
import routers, { studentRoutes, unAuthRoutes } from '../router';
import LayoutComponent from './Layout';


const ChangePassword = lazy(()=>import('../pages/auth/ChangePassword'));
const Exam =  lazy(()=>import('../pages/student/Exam'));
const Exams =  lazy(()=>import('../pages/student/Exams'));

export default function View() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route element={<LayoutComponent />}>
            {routers.map(r => (<Route path={r.path} key={r.key} element={r.element} >
              {/* {childRoute(r.children)} */}
            </Route>))}
          </Route>
          <Route element={<LayoutComponent />}>
            <Route path='/stu' key='stu'>
              <Route path='exams' key='stu_exams' element={<Exams />}></Route>
              <Route path='exam/:id' key='detail exam' element={<Exam />}></Route>
              {/* <Route path='scores' key='score list' element={<Scores />}></Route>
              <Route path='score/:id' key='score detail' element={<Score />}></Route> */}
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
