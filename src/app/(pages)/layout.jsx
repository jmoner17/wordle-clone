'use client'

import UserHeader from "@/components/UserHeader";

export default function Layout({ children }) {
    return (
      <>
        <UserHeader/>
        {children}
      </>
    )
  }