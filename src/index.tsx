import { createRoot } from 'react-dom/client';
import { StrictMode, useMemo, useState } from 'react';
import clsx from 'clsx';

import { Article } from './components/article/Article';
import { ArticleParamsForm } from './components/article-params-form/ArticleParamsForm';
import {
	defaultArticleState,
	type ArticleStateType,
} from './constants/articleProps';

import './styles/index.scss';
import styles from './styles/index.module.scss';

const domNode = document.getElementById('root')!;
const root = createRoot(domNode);

function App() {
	// 1) Панель
	const [isOpen, setIsOpen] = useState(false);

	// 2) Состояния настроек
	const [initial] = useState<ArticleStateType>(defaultArticleState); // фиксируем «как при открытии страницы»
	const [draft, setDraft] = useState<ArticleStateType>(initial); // редактируем в форме
	const [applied, setApplied] = useState<ArticleStateType>(initial); // применено к статье

	// 3) Применение/сброс
	const apply = () => {
		setApplied(draft);
		setIsOpen(false);
	};
	const reset = () => {
		setDraft(initial);
		setApplied(initial);
		setIsOpen(false);
	};

	// 4) CSS custom properties берём из applied
	const styleVars = useMemo(
		() => ({
			['--font-family' as any]: applied.fontFamilyOption.value,
			['--font-size' as any]: applied.fontSizeOption.value,
			['--font-color' as any]: applied.fontColor.value,
			['--container-width' as any]: applied.contentWidth.value,
			['--bg-color' as any]: applied.backgroundColor.value,
		}),
		[applied]
	);

	// 5) универсальный апдейтер черновика
	const patchDraft = (next: Partial<ArticleStateType>) =>
		setDraft((prev) => ({ ...prev, ...next }));

	return (
		<main className={clsx(styles.main)} style={styleVars}>
			<ArticleParamsForm
				isOpen={isOpen}
				onToggle={() => setIsOpen((prev) => !prev)}
				onClose={() => setIsOpen(false)}
				value={draft}
				onChange={patchDraft}
				onApply={apply}
				onReset={reset}
			/>
			<Article />
		</main>
	);
}

root.render(
	<StrictMode>
		<App />
	</StrictMode>
);
