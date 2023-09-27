import { lazy, Suspense } from 'react'
import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import FallbackLoading from './components/loader/FallbackLoading'
import { privateRoutes, publicRoutes } from './routes'
import SignIn from './pages/SignIn'
import PrivateRoute from './PrivateRoute'
import { useSelector } from 'react-redux'
import rootReducer from './redux/reducers'
import AdminSignIn from './pages/AdminSignIn'
import AdminPanel from './pages/AdminPanel'

const App = () => {
  const userData = useSelector((state: ReturnType<typeof rootReducer>) => state.auth?.userData)
  const adminAccessToken = JSON.parse(localStorage.getItem('admin')!)?.accessToken
  return (
    <Suspense fallback={<FallbackLoading />}>
      <Routes>
        <Route element={<PrivateRoute userData={userData} />}>
          {privateRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
        <Route path='/signin' element={userData ? <Navigate to='/' /> : <SignIn />} />

        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        <Route path='/admin/signin' element={adminAccessToken ? <Navigate to='/admin' /> : <AdminSignIn />} />
        <Route path='/admin' element={adminAccessToken ? <AdminPanel /> : <Navigate to='/admin/signin' />} />
      </Routes>
    </Suspense>
  )
}

export default App
