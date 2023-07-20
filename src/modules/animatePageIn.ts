import Swup from '../Swup.js';
import { nextTick } from '../utils.js';

/**
 * Perform the in/enter animation of the next page.
 * @returns Promise<void>
 */
export const animatePageIn = async function (this: Swup) {
	if (!this.context.animation.animate) {
		return;
	}

	const animation = this.hooks.call(
		'animation:await',
		{ direction: 'in', skip: false },
		async (context, { direction, skip }) => {
			if (skip) return;
			await this.awaitAnimations({ selector: context.animation.selector, direction });
		}
	);

	await nextTick();

	await this.hooks.call('animation:in:start', undefined, () => {
		this.classes.remove('is-animating');
	});

	await animation;

	await this.hooks.call('animation:in:end');
};
