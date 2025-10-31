import React from 'react';
import Logo from '@Calendis/components/shared/logo/Logo';
import Link from 'next/link';

const Sidebar = () => {
	return (
		<aside className="fixed w-0 md:w-67 h-full dark:text-foreground" role="complementary">
			<div className="sidebar flex flex-col h-full overflow-hidden bg-sidebar text-foreground-sidebar dark:text-foreground md:shadow-right md:border-r border-transparent dark:border-white/5 md:p-0.5">
				<Link href={'/dashboard'} className="flex items-center shrink-0 gap-4 p-4 h-18 pointer-events-none md:pointer-events-auto">
					<Logo size={36} strokeWidth={15} className="shrink-0 opacity-0 md:opacity-100 duration-200"/>
					<span className="flex flex-col self-center pb-0.5 opacity-0 md:opacity-100 duration-200">
						<p className="font-title font-bold tracking-tighter text-2xl"><span className="font-black">C</span>alendis</p>
						<p className="text-sm font-title self-end font-extrabold"></p>
					</span>
				</Link>
				<nav className="p-4 overflow-y-scroll h-full scrollable">

				</nav>
				<div className="px-4 py-4">

				</div>
			</div>
		</aside>
	);
};

export default Sidebar;