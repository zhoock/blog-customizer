import { useEffect } from 'react';

type UseOutsideClickClose = {
	isOpen: boolean;
	onChange?: (newValue: boolean) => void;
	onClose?: () => void;
	rootRef: React.RefObject<HTMLDivElement>;
};

export const useOutsideClickClose = ({
	isOpen,
	rootRef,
	onClose,
	onChange,
}: UseOutsideClickClose) => {
	useEffect(() => {
		// если меню закрыто — сразу выходим и не навешиваем обработчик
		if (!isOpen) return;

		const handleClick = (event: MouseEvent) => {
			const { target } = event;
			if (target instanceof Node && !rootRef.current?.contains(target)) {
				onClose?.();
				onChange?.(false);
			}
		};

		window.addEventListener('mousedown', handleClick);

		return () => {
			window.removeEventListener('mousedown', handleClick);
		};
	}, [onClose, onChange, isOpen, rootRef]);
};
