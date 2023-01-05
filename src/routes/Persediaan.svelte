<script lang="ts">
    import ItemKeluar from "./Page-Persediaan/ItemKeluar.svelte";
    import StokOpname from "./Page-Persediaan/StokOpname.svelte";

    let currentPage:string  = 'itemKeluar'
    let listPages:string[]  = ['✌️ Item Keluar','🤣 Stok Opname']
</script>

<div class="container">
    <table class="table align-middle mt-3">
        <tbody>
            <tr class="fw-bold text-center">
                {#each listPages as data}
                    <td><button on:click={ () => currentPage = data } type="button" class="btn btn-sm fw-bold">{ data }</button></td>
                {/each}
            </tr>
        </tbody>
    </table>
</div>

<div class="container-fluid">
    {#if currentPage == '✌️ Item Keluar' }
        <ItemKeluar />
    {:else if currentPage == '🤣 Stok Opname'}
        <StokOpname />
    {/if}
</div>