interface IRightSidebarProps {
  className?: string;
}

export default function RightSidebar({ className }: IRightSidebarProps) {
  return (
    <section className="custom-scrollbar sticky right-0 top-0 z-20 flex h-screen w-fit flex-col justify-between gap-12 overflow-auto border-l border-l-[#1F1F22] bg-[#121417] px-10 pb-6 pt-28 max-xl:hidden">
      <div className="flex flex-col flex-1 justify-start">
        <h3>Suggested Commubities</h3>
      </div>
      <div className="flex flex-col flex-1 justify-start">
        <h3>Suggested Commubities</h3>
      </div>
    </section>
  );
}
