import MainSection from '@/components/home/MainSection'
import rootReducer from '@/redux/reducers'
import React from 'react'
import { useSelector } from 'react-redux'

const Home = () => {
  const userData = useSelector((state: ReturnType<typeof rootReducer>) => state.auth?.userData)
  return (
    <div className='main-section'>
      <MainSection userData={userData} />
    </div>
  )
}

export default Home
