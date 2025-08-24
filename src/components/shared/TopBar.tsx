'use client'
import { OrganizationSwitcher, SignedIn, SignOutButton, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { dark } from "@clerk/themes";
import { Button } from "../ui/button";

export default function TopBar() {
  const {isSignedIn} = useAuth()
    
  return (
    <nav className="fixed top-0 z-30 flex w-full items-center justify-between bg-[#121417] px-6 py-3">
      <Link href={"/"} className="flex items-center gap-4">
        <Image src={"/logo.svg"} alt="logo" width={28} height={28} />
        <p className="leading-[140%] font-semibold text-white max-sm:hidden">
          Threads
        </p>
      </Link>

      <div className="flex items-center gap-1">
        <div className="block md:hidden">
          <SignedIn>
            <SignOutButton>
              <div className="flex cursor-pointer">
                <Image
                  src={"/assets/logout.svg"}
                  alt="logo"
                  width={24}
                  height={24}
                />
              </div>
            </SignOutButton>
          </SignedIn>
        </div>

        {isSignedIn ? (
          <OrganizationSwitcher
            appearance={{
              theme: dark,
              elements: {
                organizationSwitcherTriggerText: "",
              },
            }}
          />
        ) : (
          <Link href={'/sign-in'}>
            <Button className="bg-[#877EFF]">Sign-In</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
