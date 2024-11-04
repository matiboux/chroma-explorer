<script lang="ts">
import { onMount } from 'svelte'

import LoginCheck from '~/components/LoginCheck.svelte'
import { configStore } from '~/stores/configStore'

import { i18nFactory } from '~/i18n'
export let locale: string | undefined = undefined
const _ = i18nFactory(locale)

// Generate a random suffix for id attributes
const idSuffix = Math.random().toString(36).substring(2)

const defaultFormValues = {
	chromaServerUrl: '',
	authProvider: 'token',
	apiToken: '',
	basicUsername: '',
	basicPassword: '',
}

let formValues = {
	...defaultFormValues,
}

function onSubmit()
{
	$configStore = {
		...$configStore,
		confirmed: true,
		serverUrl: formValues.chromaServerUrl,
		authConfig: (
			  (formValues.authProvider === 'token' && formValues.apiToken)
			? { token: formValues.apiToken }
			: (formValues.authProvider === 'basic' && formValues.basicUsername && formValues.basicPassword)
			? { username: formValues.basicUsername, password: formValues.basicPassword }
			: null
		),
	}
}

function onReset()
{
	formValues = {
		...defaultFormValues,
	}
}

onMount(() => {
	formValues = {
		...defaultFormValues,
		chromaServerUrl: $configStore.serverUrl,
	}
})
</script>

<form
	on:submit|preventDefault={onSubmit}
	on:reset|preventDefault={onReset}
>

	<div class="input-group">
		<label for={`chromaServerUrl-${idSuffix}`}>
			{_({
				'en': 'Chroma Server URL:',
				'fr': 'URL du serveur Chroma :',
			})}
		</label>
		<input
			type="text" name="chromaServerUrl" required
			bind:value={formValues.chromaServerUrl}
			placeholder="http://localhost:8000"
			id={`chromaServerUrl-${idSuffix}`}
		/>
		<p class="hint">
			<span class="icon icon-[mdi--information-outline] icon-align"></span>
			{_({
				'en': 'Provide the root URL of the Chroma server.',
				'fr': 'Entrez l\'URL racine du serveur Chroma.',
			})}
			{_({
				'en': 'The server must allow CORS from this domain or you can use a proxy: try',
				'fr': 'Le serveur doit autoriser le CORS depuis ce domaine ou vous pouvez utiliser un proxy : essayez',
			})}
			<a href="http://cors-proxy.matiboux.com/">CORS Proxy</a>.
		</p>
	</div>

	<div class="input-group input-group-inline">
		<p>
			{_({
				'en': 'Authentication Method:',
				'fr': 'Méthode d\'authentification :',
			})}
		</p>
		<div class="radio-group">
			<input
				type="radio" name="authProvider" value="token" checked
				bind:group={formValues.authProvider}
				id={`authProviderToken-${idSuffix}`}
			/>
			<label for={`authProviderToken-${idSuffix}`}>
				{_({
					'en': 'Static API Token',
					'fr': 'Jeton API statique',
				})}
			</label>
		</div>
		<div class="radio-group">
			<input
				type="radio" name="authProvider" value="basic"
				bind:group={formValues.authProvider}
				id={`authProviderBasic-${idSuffix}`}
			/>
			<label for={`authProviderBasic-${idSuffix}`}>
				{_({
					'en': 'Basic Auth',
					'fr': 'Auth basique',
				})}
			</label>
		</div>
	</div>

	{#if formValues.authProvider === 'token'}
		<div class="input-group">
			<label for={`headerAuthorizationToken-${idSuffix}`}>
				{_({
					'en': 'API Token:',
					'fr': 'Jeton API :',
				})}
			</label>
			<input
				type="password" name="headerAuthorizationToken"
				bind:value={formValues.apiToken}
				placeholder={_({
					'en': 'API Token',
					'fr': 'Jeton API',
				})}
				id={`headerAuthorizationToken-${idSuffix}`}
			/>
		</div>
	{:else if formValues.authProvider === 'basic'}
		<div class="input-groups">
			<div class="input-group">
				<label for={`basicUsername-${idSuffix}`}>
					{_({
						'en': 'Username:',
						'fr': 'Nom d\'utilisateur :',
					})}
				</label>
				<input
					type="text" name="basicUsername"
					bind:value={formValues.basicUsername}
					placeholder="user"
					id={`basicUsername-${idSuffix}`}
				/>
			</div>
			<div class="input-group">
				<label for={`basicPassword-${idSuffix}`}>
					{_({
						'en': 'Password:',
						'fr': 'Mot de passe :',
					})}
				</label>
				<input
					type="password" name="basicPassword"
					bind:value={formValues.basicPassword}
					placeholder="password"
					id={`basicPassword-${idSuffix}`}
				/>
			</div>
		</div>
	{:else}
		<p class="hint">
			<span class="icon icon-[mdi--information-outline] icon-align"></span>
			{_({
				'en': 'Please select an authentication method.',
				'fr': 'Veuillez sélectionner une méthode d\'authentification.',
			})}
		</p>
	{/if}

	<LoginCheck loginRedirect="/explore" />

	<div class="button-group">
		<button type="submit">
			{_({
				'en': 'Connect',
				'fr': 'Connexion',
			})}
		</button>
		<button type="reset">
			{_({
				'en': 'Reset',
				'fr': 'Réinitialiser',
			})}
		</button>
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
