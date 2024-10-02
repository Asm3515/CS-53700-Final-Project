import React from 'react'
import Image from "next/image";

import {
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
  } from "@clerk/nextjs";

function Header() {
  return (
    <div className='p-5 pb-3 border-b-[4px] border-green-200 flex items-center justify-between w-full'>
        <Image
          src="/logo_animation.gif"
          alt="Vercel Logo"
          className="dark:invert"
          height={150}
          width={150}
        />
        <UserButton appearance={{
              elements: {
                rootBox: "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 ", 
            avatarBox: "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 ", 
              },
            }} />
    </div>
    
  )
}

export default Header