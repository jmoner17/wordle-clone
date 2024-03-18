'use client'

import UserHeader from "@/components/UserHeader";
import Navbar from "@/components/(pages)/Navbar"

export default function Layout({ children }) {
    return (
      <>
        <UserHeader/>
        <Navbar />
        {children}
      </>
    )
  }