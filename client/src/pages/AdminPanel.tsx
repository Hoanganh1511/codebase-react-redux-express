import CommunityManagement from '@/components/admin/CommunityManagement'
import Logs from '@/components/admin/Logs'
import Settings from '@/components/admin/Settings'
import Tab from '@/components/admin/Tab'
import { logoutAction } from '@/redux/actions/adminActions'
import rootReducer from '@/redux/reducers'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

export enum Tabs {
  LOGS = 'logs',
  SETTINGS = 'settings',
  COMMUNITY_MANAGEMENT = 'Community Management',
  LOGOUT = 'logout'
}

const AdminPanel = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.LOGS)

  const adminPanelError = useSelector((state: ReturnType<typeof rootReducer>) => state.admin?.adminPanelError)

  const handleTabClick = (tab: Tabs) => {
    setActiveTab(tab)
  }

  useEffect(() => {
    if (adminPanelError === 'Unauthorized') {
      dispatch(logoutAction()).then(() => {
        navigate('/admin/signin')
      })
    }
  }, [adminPanelError, dispatch, navigate])

  return (
    <div className='pt-5 max-w-6xl mx-auto flex flex-col justify-center items-center'>
      <Tab activeTab={activeTab} handleTabClick={handleTabClick} />

      {activeTab === Tabs.LOGS && <Logs />}
      {activeTab === Tabs.SETTINGS && <Settings />}
      {activeTab === Tabs.COMMUNITY_MANAGEMENT && <CommunityManagement />}
    </div>
  )
}

export default AdminPanel
