import type { Preview, Decorator } from '@storybook/react';

const StoryDecorator: Decorator = (Story) => (
	<div id='app-shell'>
		<Story />
	</div>
);

const preview: Preview = {
	parameters: {
		actions: { argTypesRegex: '^on[A-Z].*' },
		controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
	},
	decorators: [StoryDecorator],
};

export default preview;
