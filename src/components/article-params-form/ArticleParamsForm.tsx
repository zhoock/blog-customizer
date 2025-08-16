// components/article-params-form/ArticleParamsForm.tsx
import { useRef } from 'react';
import clsx from 'clsx';

import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
// import { Separator } from 'src/ui/separator';

import {
	fontFamilyOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	fontSizeOptions,
	type ArticleStateType,
} from 'src/constants/articleProps';

import { useOutsideClickClose } from 'src/ui/select/hooks/useOutsideClickClose'; // тот самый хук
import styles from './ArticleParamsForm.module.scss';

type Props = {
	isOpen: boolean;
	onToggle: () => void;
	onClose: () => void; // должен в родителе делать setIsOpen(false)
	value: ArticleStateType; // draft-настройки
	onChange: (patch: Partial<ArticleStateType>) => void; // патч draft
	onApply: () => void; // применить draft -> applied
	onReset: () => void; // сброс к initial
};

export const ArticleParamsForm = ({
	isOpen,
	onToggle,
	onClose,
	value,
	onChange,
	onApply,
	onReset,
}: Props) => {
	// ref на корневой элемент сайдбара
	const rootRef = useRef<HTMLDivElement>(null);

	// закрытие по клику вне панели
	useOutsideClickClose({
		isOpen,
		rootRef,
		onClose,
		onChange: () => {}, // стейт isOpen хранится снаружи, поэтому тут no-op
	});

	return (
		<>
			{/* Кнопка-стрелка открытия/закрытия */}
			<ArrowButton isOpen={isOpen} onClick={onToggle} />

			{/* Сайдбар */}
			<aside
				ref={rootRef}
				className={clsx(styles.container, { [styles.container_open]: isOpen })}>
				<form
					className={styles.form}
					onSubmit={(e) => {
						e.preventDefault();
						onApply();
					}}
					onReset={(e) => {
						e.preventDefault();
						onReset();
					}}>
					<Select
						title='Шрифт'
						options={fontFamilyOptions}
						selected={value.fontFamilyOption}
						placeholder='Выберите шрифт'
						onChange={(opt) => onChange({ fontFamilyOption: opt })}
						onClose={onClose}
					/>

					<RadioGroup
						title='Размер шрифта'
						name='font-size'
						options={fontSizeOptions}
						selected={value.fontSizeOption}
						onChange={(opt) => onChange({ fontSizeOption: opt })}
					/>

					{/* <Separator /> */}

					<Select
						title='Цвет шрифта'
						options={fontColors}
						selected={value.fontColor}
						placeholder='Цвет'
						onChange={(opt) => onChange({ fontColor: opt })}
						onClose={onClose}
					/>

					<Select
						title='Цвет фона'
						options={backgroundColors}
						selected={value.backgroundColor}
						placeholder='Фон'
						onChange={(opt) => onChange({ backgroundColor: opt })}
						onClose={onClose}
					/>

					<Select
						title='Ширина контента'
						options={contentWidthArr}
						selected={value.contentWidth}
						placeholder='Ширина'
						onChange={(opt) => onChange({ contentWidth: opt })}
						onClose={onClose}
					/>

					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
