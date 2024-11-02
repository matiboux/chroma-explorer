<script lang="ts">
// Generate a random suffix for id attributes
const idSuffix = Math.random().toString(36).substring(2)

const defaultFormValues = {
	chromadbServerUrl: 'http://localhost:8000',
	authProvider: 'token',
	apiToken: '',
	basicUsername: '',
	basicPassword: '',
}

const formValues = {
	...defaultFormValues,
}
</script>

<form>

	<div class="input-group">
		<label for={`chromadbServerUrl-${idSuffix}`}>
			ChromaDB Server URL:
		</label>
		<input
			type="text" name="chromadbServerUrl" required
			bind:value={formValues.chromadbServerUrl}
			placeholder="http://localhost:8000"
			id={`chromadbServerUrl-${idSuffix}`}
		/>
		<p class="hint">
			<span class="icon icon-[mdi--information-outline] icon-align"></span>
			Provide the root URL of the ChromaDB server.
			The server must allow CORS from this domain or you can use a proxy:
			try <a href="http://cors-proxy.matiboux.com/">CORS Proxy</a>.
		</p>
	</div>

	<div class="input-group input-group-inline">
		<p>
			Auth Provider:
		</p>
		<div class="radio-group">
			<input
				type="radio" name="authProvider" value="token" checked
				bind:group={formValues.authProvider}
				id={`authProviderToken-${idSuffix}`}
			/>
			<label for={`authProviderToken-${idSuffix}`}>API Token</label>
		</div>
		<div class="radio-group">
			<input
				type="radio" name="authProvider" value="basic"
				bind:group={formValues.authProvider}
				id={`authProviderBasic-${idSuffix}`}
			/>
			<label for={`authProviderBasic-${idSuffix}`}>Basic Auth</label>
		</div>
	</div>

	{#if formValues.authProvider === 'token'}
		<div class="input-group">
			<label for={`headerAuthorizationToken-${idSuffix}`}>
				Header Authorization Token:
			</label>
			<input
				type="text" name="headerAuthorizationToken" required
				bind:value={formValues.apiToken}
				placeholder="API Token"
				id={`headerAuthorizationToken-${idSuffix}`}
			/>
		</div>
	{:else if formValues.authProvider === 'basic'}
		<div class="input-groups">
			<div class="input-group">
				<label for={`basicUsername-${idSuffix}`}>
					Basic Auth Username:
				</label>
				<input
					type="text" name="basicUsername" required
					bind:value={formValues.basicUsername}
					placeholder="user"
					id={`basicUsername-${idSuffix}`}
				/>
			</div>
			<div class="input-group">
				<label for={`basicPassword-${idSuffix}`}>
					Basic Auth Password:
				</label>
				<input
					type="password" name="basicPassword" required
					bind:value={formValues.basicPassword}
					placeholder="password"
					id={`basicPassword-${idSuffix}`}
				/>
			</div>
		</div>
	{:else}
		<p class="hint">
			<span class="icon icon-[mdi--information-outline] icon-align"></span>
			Please select an authentication provider.
		</p>
	{/if}

	<div class="button-group">
		<button type="submit">Connect</button>
		<button type="reset">Reset</button>
	</div>

</form>

<style lang="scss">
form {
	@apply flex flex-col gap-4;
	@apply mt-4;

	.input-groups {
		@apply flex gap-4;

		> .input-group {
			@apply flex-grow;
		}
	}

	.input-group {
		@apply flex flex-col gap-2;

		.radio-group {
			@apply flex gap-4;
		}

		&.input-group-inline {
			@apply flex-row gap-4 items-center;

			.radio-group {
				@apply flex-row gap-4 items-center;
			}

			label {
				&:has(+ input) {
					@apply pb-0 pr-2;
				}

				+ input {
					@apply mt-0 -ml-4;
				}
			}

			input {
				[type="radio"], [type="checkbox"] {
					@apply align-[-0.125em];
				}

				+ label {
					@apply mt-0 -ml-4 pt-0 pl-2;
				}
			}
		}
	}

	label {
		@apply text-gray-700;

		&:has(+ input) {
			@apply pb-1;
		}

		+ input {
			@apply -mt-2;
		}
	}

	input {
		@apply px-2 py-1 border border-gray-300 rounded-md;
		@apply border border-gray-300 rounded-md;
		@apply outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500;

		+ label {
			@apply -mt-2 pt-1;
		}
	}

	p.hint {
		@apply max-w-[80%];
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
			px-4 py-2 text-white font-semibold rounded-md
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
