<script>
	/**
	 * @typedef {Object} PageButtonProps
	 * @property {import('svelte').Snippet} children
	 * @property {number} page_number
	 * @property {boolean} [disabled]
	 * @property {string} path
	 */

	/**
	 * @type {PageButtonProps}
	 */
	const { page_number, disabled, path, children } = $props();
</script>

<a
	class={`border-[1px] border-gray-500 px-4 py-2 ${disabled ? 'text-gray-800 no-underline cursor-default pointer-events-none' : 'text-red-700 underline'} hover:no-underline`}
	href={`${path}?page=${page_number}`}
>
	{@render children()}
</a>
