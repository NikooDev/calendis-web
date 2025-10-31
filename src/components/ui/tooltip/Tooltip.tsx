'use client';

import Tippy from '@tippyjs/react';
import React, { forwardRef, useState } from 'react';
import type { UITooltip } from '@Calendis/types/ui';

const Tooltip = forwardRef<HTMLSpanElement, UITooltip>(function Tooltip(
	{
		children,
		content,
		onDestroy,
		onHidden,
		onHide,
		onShow,
		render,
		placement = 'top',
		hideOnClick,
		allowHTML,
		delay,
		interactive,
		offset = [0, 8],
		animation = 'shift-away-subtle',
		className,
		...rest
	},
	forwardedRef
) {
	const [anchor, setAnchor] = useState<HTMLSpanElement | null>(null);

	const setAllRefs = (node: HTMLSpanElement | null) => {
		setAnchor(node);
		if (typeof forwardedRef === 'function') forwardedRef(node);
		else if (forwardedRef) (forwardedRef as unknown as { current: HTMLSpanElement | null }).current = node;
	};

	return (
		<>
      <span
				ref={ setAllRefs }
				tabIndex={ 0 }
				className={ className }
				style={ { display: 'inline-flex', alignItems: 'center', justifyContent: 'center' } }
			>
        { children }
      </span>

			{ content != null && (
				<Tippy
					{ ...rest }
					arrow={ false }
					render={ render }
					onDestroy={ onDestroy }
					onHidden={ onHidden }
					onShow={ onShow }
					onHide={ onHide }
					allowHTML={ allowHTML }
					animation={ animation }
					content={ content }
					placement={ placement }
					hideOnClick={ hideOnClick }
					delay={ delay }
					interactive={ interactive }
					offset={ offset as [number, number] }
					reference={ anchor as Element | null }
				/>
			) }
		</>
	);
});

export default Tooltip;