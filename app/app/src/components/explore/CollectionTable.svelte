<script lang="ts">
</script>

<table>
	<thead>
		<tr>
			<th>ID</th>
			<th>Embedding</th>
			<th>Document</th>
			<th>Metadata</th>
			<th>Actions</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>1</td>
			<td><span class="icon icon-[mdi--check-circle-outline] icon-align"></span> 768</td>
			<td>Document 1</td>
			<td>{'{'} ... {'}'}</td>
			<td>
				<button type="button" class="btn">View</button>
				<button type="button" class="btn">Edit</button>
				<button type="button" class="btn">Delete</button>
			</td>
		</tr>
</table>

<style lang="scss">
	table {
		@apply w-full;
		@apply border-collapse;

		th, td {
			@apply border border-gray-300;
			@apply p-2;
		}

		th {
			@apply bg-gray-200;
		}
	}
</style>
