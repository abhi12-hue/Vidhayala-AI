



import NavBar from '@/components/ui/NavBar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div>
      <NavBar/>
      <div>
        <Outlet/>
      </div>
    </div>
  )
}

export default MainLayout
