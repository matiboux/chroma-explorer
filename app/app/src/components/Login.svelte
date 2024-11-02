<script lang="ts">
</script>

<form>

	<div class="input-group">
		<label>ChromaDB Server URL:</label>
		<input type="text" name="chromadbServerUrl" required>
	</div>

	<div class="input-group">
		<label>Header Authorization Token:</label>
		<input type="text" name="headerAuthorizationToken" required>
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
