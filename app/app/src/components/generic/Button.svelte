<script lang="ts">
// Props
export let buttonStyle: string = 'default'
</script>

<button class={`btn btn-${buttonStyle}`} {...$$restProps} on:click>
	<slot />
</button>

<style lang="scss">
	.btn {
		@apply px-2 py-1;
		@apply bg-gray-100;
		@apply border border-gray-200 rounded-lg;

		&:hover {
			@apply bg-gray-200;
		}
	}
</style>
