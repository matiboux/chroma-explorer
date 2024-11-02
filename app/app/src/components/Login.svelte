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
			placeholder="http://localhost:8000"
			id={`chromadbServerUrl-${idSuffix}`}
		/>
		<p class="hint">
			<span class="icon icon-[mdi--information-outline] icon-align"></span>
			Root URL of the ChromaDB server.
			The server must allow CORS from this domain or you can use a proxy:
			try <a href="http://cors-proxy.matiboux.com/">CORS Proxy</a>.
		</p>
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

	<div class="button-group">
		<button type="submit">Connect</button>
		<button type="reset">Reset</button>
	</div>

</form>

<style lang="scss">
form {
	@apply flex flex-col gap-4;
	@apply mt-4;

	.input-group {
		@apply flex flex-col
	}

	label {
		@apply pb-1 text-gray-700;
	}

	input {
		@apply px-2 py-1 border border-gray-300 rounded-md;
		@apply border border-gray-300 rounded-md;

		+ .hint {
			@apply mt-1;
		}
	}

	p.hint {
		@apply text-sm text-gray-500;

		a {
			@apply
			text-blue-500
			hover:text-blue-600 hover:underline
			;
		}
	}

	.button-group {
		@apply flex gap-4;
	}

	button {
		@apply
			bg-gray-400
			enabled:hover:bg-gray-500
			enabled:active:bg-gray-600
			disabled:bg-gray-300
			px-4 py-1 text-white font-semibold rounded-md
			disabled:cursor-not-allowed
			;

		&[type="submit"] {
			@apply
				bg-blue-500
				enabled:hover:bg-blue-600
				enabled:active:bg-blue-700
				disabled:bg-blue-300
				;
		}
	}
}
</style>
