<script lang="ts">
// Props
export let buttonStyle: string = 'default'
</script>

<button class={`btn btn-${buttonStyle}`} type="button" {...$$restProps} on:click|preventDefault>
	<slot />
</button>

<style lang="scss">
@reference "tailwindcss/theme";

.btn {
	@apply px-2 py-1;
	@apply bg-gray-100 hover:bg-gray-200 active:bg-gray-300;
	@apply border border-gray-200 rounded-lg;

	&-gray {
		@apply bg-gray-200 hover:bg-gray-300 active:bg-gray-400;
	}
}
</style>
