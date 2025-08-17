import { useRef, useState, useMemo } from 'react';
import clsx from 'clsx';

import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
// import { Separator } from 'src/ui/separator';

import {
	defaultArticleState,
	fontFamilyOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	fontSizeOptions,
	type ArticleStateType,
} from 'src/constants/articleProps';

import { useOutsideClickClose } from 'src/ui/select/hooks/useOutsideClickClose';
import styles from './ArticleParamsForm.module.scss';

type Props = {
	// отдаём наружу только применённый результат
	onApply: (applied: ArticleStateType) => void;
};

export const ArticleParamsForm = ({ onApply }: Props) => {
	// меню
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	// состояния формы — полностью локально внутри
	const [initial] = useState<ArticleStateType>(defaultArticleState);
	const [draft, setDraft] = useState<ArticleStateType>(initial);

	// ref на панель для «клик-вне»
	const rootRef = useRef<HTMLDivElement>(null);

	// закрытие по клику вне — эффект активен ТОЛЬКО когда меню открыто
	useOutsideClickClose({
		isOpen: isMenuOpen,
		rootRef,
		onClose: () => setIsMenuOpen(false),
	});

	// апдейтер черновика (патч)
	const patchDraft = (next: Partial<ArticleStateType>) =>
		setDraft((prev) => ({ ...prev, ...next }));

	// кнопки
	const handleApply = () => {
		onApply(draft); // отдать наверх применённые значения
		setIsMenuOpen(false); // закрыть меню
	};

	const handleReset = () => {
		setDraft(initial); // откатить форму к начальному
		onApply(initial); // и применить к статье
		setIsMenuOpen(false);
	};

	// подписки для компонентов формы
	const bindings = useMemo(
		() => ({
			fontFamily: {
				selected: draft.fontFamilyOption,
				onChange: (opt: ArticleStateType['fontFamilyOption']) =>
					patchDraft({ fontFamilyOption: opt }),
			},
			fontSize: {
				selected: draft.fontSizeOption,
				onChange: (opt: ArticleStateType['fontSizeOption']) =>
					patchDraft({ fontSizeOption: opt }),
			},
			fontColor: {
				selected: draft.fontColor,
				onChange: (opt: ArticleStateType['fontColor']) =>
					patchDraft({ fontColor: opt }),
			},
			background: {
				selected: draft.backgroundColor,
				onChange: (opt: ArticleStateType['backgroundColor']) =>
					patchDraft({ backgroundColor: opt }),
			},
			width: {
				selected: draft.contentWidth,
				onChange: (opt: ArticleStateType['contentWidth']) =>
					patchDraft({ contentWidth: opt }),
			},
		}),
		[draft]
	);

	return (
		<>
			{/* стрелка открытия/закрытия */}
			<ArrowButton
				isOpen={isMenuOpen}
				onClick={() => setIsMenuOpen((v) => !v)}
			/>

			{/* сайдбар */}
			<aside
				ref={rootRef}
				className={clsx(styles.container, {
					[styles.container_open]: isMenuOpen,
				})}>
				<form
					className={styles.form}
					onSubmit={(e) => {
						e.preventDefault();
						handleApply();
					}}
					onReset={(e) => {
						e.preventDefault();
						handleReset();
					}}>
					<Select
						title='Шрифт'
						options={fontFamilyOptions}
						selected={bindings.fontFamily.selected}
						placeholder='Выберите шрифт'
						onChange={bindings.fontFamily.onChange}
						onClose={() => setIsMenuOpen(false)}
					/>

					<RadioGroup
						title='Размер шрифта'
						name='font-size'
						options={fontSizeOptions}
						selected={bindings.fontSize.selected}
						onChange={bindings.fontSize.onChange}
					/>

					{/* <Separator /> */}

					<Select
						title='Цвет шрифта'
						options={fontColors}
						selected={bindings.fontColor.selected}
						placeholder='Цвет'
						onChange={bindings.fontColor.onChange}
						onClose={() => setIsMenuOpen(false)}
					/>

					<Select
						title='Цвет фона'
						options={backgroundColors}
						selected={bindings.background.selected}
						placeholder='Фон'
						onChange={bindings.background.onChange}
						onClose={() => setIsMenuOpen(false)}
					/>

					<Select
						title='Ширина контента'
						options={contentWidthArr}
						selected={bindings.width.selected}
						placeholder='Ширина'
						onChange={bindings.width.onChange}
						onClose={() => setIsMenuOpen(false)}
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
