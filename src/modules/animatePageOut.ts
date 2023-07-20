import Swup from '../Swup.js';
import { classify } from '../helpers.js';

/**
 * Perform the out/leave animation of the current page.
 * @returns Promise<void>
 */
export const animatePageOut = async function (this: Swup) {
	if (!this.context.animation.animate) {
		await this.hooks.call('animation:skip');
		return;
	}

	await this.hooks.call('animation:out:start', undefined, () => {
		this.classes.add('is-changing', 'is-leaving', 'is-animating');
		if (this.context.history.popstate) {
			this.classes.add('is-popstate');
		}
		if (this.context.animation.name) {
			this.classes.add(`to-${classify(this.context.animation.name)}`);
		}
	});

	await this.hooks.call(
		'animation:await',
		{ direction: 'out', skip: false },
		async (context, { direction, skip }) => {
			if (skip) return;
			await this.awaitAnimations({ selector: context.animation.selector, direction });
		}
	);

	await this.hooks.call('animation:out:end');
};
