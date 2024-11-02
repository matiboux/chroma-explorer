<script lang="ts">
// Generate a random suffix for id attributes
const idSuffix = Math.random().toString(36).substring(2)
</script>

<form>

	<div class="input-group">
		<label for={`chromadbServerUrl-${idSuffix}`}>
			ChromaDB Server URL:
		</label>
		<input
			type="text" name="chromadbServerUrl" required
			id={`chromadbServerUrl-${idSuffix}`}
		/>
	</div>

	<div class="input-group">
		<label for={`headerAuthorizationToken-${idSuffix}`}>
			Header Authorization Token:
		</label>
		<input
			type="text" name="headerAuthorizationToken" required
			id={`headerAuthorizationToken-${idSuffix}`}
		/>
	</div>

	<button type="submit">Connect</button>

</form>

<style lang="scss">
form {
	@apply flex flex-col;
	@apply mx-2 mt-6 p-4 border-2 border-blue-200 rounded-md;

	.input-group {
		@apply flex flex-col;

		+ .input-group {
			@apply flex flex-col;
			@apply mt-4;
		}
	}

	label {
		@apply pb-1 text-gray-700;
	}

	input {
		@apply px-2 py-1 border border-gray-300 rounded-md;
		@apply border border-gray-300 rounded-md;
	}
}
</style>
