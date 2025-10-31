'use client';

import React, { useEffect } from 'react';
import { cl } from '@Calendis/lib/client/utils';
import './header.css';

const Header = () => {
	const [dark, setDark] = React.useState(true);

	useEffect(() => {
		document.documentElement.setAttribute('data-mode', dark ? 'dark' : 'light');
	}, [dark])

	const handleThemeMode = () => {
		setTimeout(() => setDark(prevState => !prevState), 200);
	}

	return (
		<header className="fixed z-30 flex items-center h-16 left-0 right-0 md:left-71 md:right-4 md:mx-4 pl-2 pr-4 bg-header border-l border-b md:border-r border-transparent border-r-0 dark:border-l dark:border-r-0 md:dark:border-r dark:border-b dark:border-white/5 shadow-md md:rounded-b-1xl" role="banner">
			<nav className="flex items-center h-full">
				<button className={ cl('w-11 h-11 flex items-center justify-center hover:bg-thumb/20  dark:hover:bg-thumb/50 group rounded-full transition duration-200', !dark && 'sidebar-open') }>
					<span className="bg-foreground dark:bg-foreground dark:group-hover:bg-foreground menu-toggle-bar menu-toggle-bar--top"></span>
					<span className="bg-foreground dark:bg-foreground dark:group-hover:bg-foreground menu-toggle-bar menu-toggle-bar--middle"></span>
					<span className="bg-foreground dark:bg-foreground dark:group-hover:bg-foreground menu-toggle-bar menu-toggle-bar--bottom"></span>
				</button>
			</nav>
			<nav className="flex items-center ml-auto relative">

			</nav>
		</header>
	);
};

/*
<Menu align="start" gap={14} arrow boundingBoxPadding="32" menuClassName="!bg-header !shadow-md" menuButton={({ open }) => (
					<button className="flex h-11 w-11 group rounded-full active:scale-95 transform transition-transform duration-100">
						<div className="flex items-center justify-center w-11 h-11 relative">
							<span className={ cl('absolute opacity-0 font-semibold transition-opacity duration-200 text-white pointer-events-none', !open && 'group-hover:opacity-100 z-20') }>NT</span>
							<Avatar name="Compte" size={44} showTooltip={!open} offset={[0, 7]} classNameImage={ cl('brightness-130 dark:brightness-100 transition duration-200', !open && 'group-hover:opacity-0') } classNameContainer={ cl('bg-thumb/20 dark:bg-thumb/50 group-hover:bg-thumb/20 dark:group-hover:bg-thumb shadow-none transition-colors duration-200', open && '!bg-thumb') }/>
							<div className="bg-header z-10 flex items-center justify-center transition-colors duration-[.25s] ease-in-out rounded-full h-5 w-5 absolute -right-1 -bottom-1">
								<Icon path="chevronDown" className={ cl('shrink-0 transition-transform duration-300 p-0.5', open && 'rotate-180') }/>
							</div>
						</div>
					</button>
				)} transition>
					<div className="flex items-center gap-4 px-2 pt-2 pb-4">
						<Avatar name="Nicolas Tual" classNameContainer="bg-white/5 border border-white/5" showTooltip={false} size={75}/>
						<div className="min-w-32 font-semibold text-lg">
							<p>Nicolas</p>
							<p>Tual</p>
						</div>
					</div>
					<MenuItem className="hover:!bg-theme-light dark:hover:!bg-theme" onClick={themeMode}>Mode sombre</MenuItem>
				</Menu>
 */

export default Header;