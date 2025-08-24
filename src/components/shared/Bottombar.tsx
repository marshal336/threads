"use client";
import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";


export default function Bottombar( ) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <section className="fixed bottom-0 z-10 w-full rounded-t-3xl bottom-bar-bg p-4 backdrop-blur-lg xs:px-7 md:hidden">
      <div className=" flex items-center justify-between gap-3 sm:gap-5">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;
          return (
            <div key={link.route} className="">
              <Link
                className={`relative flex flex-col items-center gap-2 rounded-lg p-2 sm:flex-1 sm:px-2 sm:py-2.5 ${
                  isActive && "bg-[#877EFF]"
                }`}
                href={link.route}
              >
                <Image
                  src={link.imgURL}
                  alt={link.label}
                  width={24}
                  height={24}
                />
                <p className="leading-[16px] font-semibold text-white max-sm:hidden">
                  {link.label.split(/\s+/)[0]}
                </p>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
