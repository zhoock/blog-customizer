import { useMemo, useState } from 'react';
import { Article } from 'src/components/article/Article';
import { ArticleParamsForm } from 'src/components/article-params-form/ArticleParamsForm';
import {
	defaultArticleState,
	type ArticleStateType,
} from 'src/constants/articleProps';

import 'src/styles/index.scss';
import styles from 'src/styles/index.module.scss';

export default function App() {
	// применённые настройки (то, чем реально стилизуем статью)
	const [applied, setApplied] = useState<ArticleStateType>(defaultArticleState);

	// CSS custom properties из applied
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

	return (
		<main className={styles.main} style={styleVars}>
			<ArticleParamsForm onApply={setApplied} />
			<Article />
		</main>
	);
}
