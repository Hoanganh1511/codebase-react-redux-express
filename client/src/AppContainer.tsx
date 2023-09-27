import { useState, useEffect } from 'react'
import { Provider } from 'react-redux'
import { useLocation } from 'react-router'
import CommonLoading from './components/loader/CommonLoading'
import { Helmet } from 'react-helmet'
import { getTitleFromRoute } from './utils/docTitle'
import store from './redux/store'
import App from './App'
import axios from 'axios'
import { API, BASE_URL } from './redux/api/utils'
import createAppStore from './redux/store'
const ErrorComponent = ({ errorMessage }: { errorMessage: any }) => {
  return <div className='text-red-500 font-bold text-center'>{errorMessage}</div>
}

const AppContainer = () => {
  const location = useLocation()
  const [store, setStore] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        await API.get(`/server-status`)
      } catch (err) {
        setError('Server is down. please try again later')
      } finally {
        setLoading(false)
      }
    }
    checkServerStatus()
  }, [])

  //asynchronously initialize the Redux store, including data fetching and authentication,
  // while displaying a loading indicator. Making sure that  the store is initialized with credentials and data  before rendering the app.
  useEffect(() => {
    const initializeStore = async () => {
      try {
        const appStore = await createAppStore()
        setStore(appStore)
      } catch (err) {
      } finally {
        setLoading(false)
      }
    }
    initializeStore()
  }, [])

  if (loading || error) {
    return (
      <div className='flex items-center justify-center h-screen'>
        {loading ? <CommonLoading /> : <ErrorComponent errorMessage={error} />}
      </div>
    )
  }
  return (
    <Provider store={store}>
      <Helmet>
        <title>{getTitleFromRoute(location.pathname)}</title>
      </Helmet>
      <App />
    </Provider>
  )
}
export default AppContainer
