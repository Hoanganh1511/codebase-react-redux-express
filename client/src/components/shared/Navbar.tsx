import { logoutAction } from '@/redux/actions/authActions'
import { User } from '@/redux/types'
import React, { memo, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { IoLogOutOutline } from 'react-icons/io5'
import { CgMenuGridO } from 'react-icons/cg'
import { BiLogoMessenger, BiSolidBell } from 'react-icons/bi'
import { Link } from 'react-router-dom'
import Logo from '../../assets/logo.png'
import { RxCross1 } from 'react-icons/rx'
import { AiOutlineBars } from 'react-icons/ai'
import Search from './Search'
import { Transition } from '@headlessui/react'
interface INavbar {
  userData: User
  toggleLeftbar: () => void
  showLeftbar: boolean
}
const Navbar = ({ userData, toggleLeftbar, showLeftbar }: INavbar) => {
  const dispatch = useDispatch()
  const [loggingOut, setLoggingOut] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown)
  }
  const logout = async () => {
    setLoggingOut(true)
    await dispatch(logoutAction())
    setLoggingOut(false)
  }

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('click', handleOutsideClick)
  }, [])
  return (
    <nav className='sticky top-0 z-20 mb-5 flex justify-center  border bg-white p-2 md:items-center md:justify-between md:px-16'>
      <Link to='/' className='hidden md:inline-block'>
        <img src={Logo} alt='' className='w-48' />
      </Link>

      <button className='inline-block md:hidden'>{showLeftbar ? <RxCross1 /> : <AiOutlineBars />}</button>
      <Search />
      <div className='relative flex gap-[8px] justify-end '>
        <button className='inline-flex h-[40px] w-[40px] bg-gray-200/70 cursor-pointer items-center justify-center rounded-full'>
          <CgMenuGridO className='text-[24px]' />
        </button>
        <button className='inline-flex h-[40px] w-[40px] bg-gray-200/70 cursor-pointer items-center justify-center rounded-full'>
          <BiLogoMessenger className='text-[24px]' />
        </button>
        <button className='inline-flex h-[40px] w-[40px] bg-gray-200/70 cursor-pointer items-center justify-center rounded-full'>
          <BiSolidBell className='text-[24px]' />
        </button>

        <button
          type='button'
          className='inline-flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-full'
          onClick={handleProfileClick}
        >
          <img src={userData.avatar} alt='profile' className='h-8 w-8 rounded-full object-cover' />
          <Transition
            show={showDropdown}
            enter='transition ease-out duration-100 transform'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='transition ease-in duration-75 transform'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            {() => (
              <div
                ref={dropdownRef}
                className='absolute right-0 top-10 mt-2 w-72 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
                role='menu'
                aria-orientation='vertical'
                aria-labelledby='user-menu'
              >
                <div className='py-1' role='none'>
                  <div className='flex flex-col items-center'>
                    <img src={userData.avatar} alt='profile' className='mb-2 h-16 w-16 rounded-full object-cover' />
                    <div className='text-sm font-semibold text-gray-700 hover:underline'>
                      <Link to='/'>{userData.name}</Link>
                    </div>
                    <div className='text-sm text-gray-500'>{userData.email}</div>
                  </div>
                  <hr className='my-2' />
                  <div className='flex justify-center'>
                    <button
                      type='button'
                      className='block w-full px-4 py-2 text-left text-sm text-red-400 hover:cursor-pointer hover:text-red-600'
                      role='menuitem'
                      onClick={logout}
                      disabled={loggingOut}
                    >
                      {loggingOut ? (
                        <div className='text-center'>Logging out...</div>
                      ) : (
                        <div className=' flex items-center justify-center'>
                          <span>Logout</span>
                          <IoLogOutOutline className='ml-2' />
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Transition>
        </button>
      </div>
    </nav>
  )
}

export default memo(Navbar)
