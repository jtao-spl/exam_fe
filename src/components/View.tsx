import React, { Component, Suspense } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import routers, { unAuthRoutes } from '../router';
import LayoutComponent from './Layout';
export default function View() {
  // const childRoute = (r: any) => {
  //   console.log(`r: ${JSON.stringify(r)}`)
  //   if (r === undefined || r.length === 0) {
  //     return null;
  //   }
  //   return r.map((value: any) => {
  //     return (<Route path={value.path} key={value.key} element={value.element} >
  //       {childRoute(value.children)}
  //     </Route>)
  //   })
  // }
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route element={<LayoutComponent />}>
            {routers.map(r => (<Route path={r.path} key={r.key} element={r.element} >
              {/* {childRoute(r.children)} */}
            </Route>))}
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
