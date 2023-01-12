<script lang="ts">
    import ItemKeluar from "./Page-Persediaan/ItemKeluar.svelte";
    import StokOpname from "./Page-Persediaan/StokOpname.svelte";

    let currentPage:string  = 'Item Keluar'
</script>

<div class="container-fluid">
    <div class="card shadow-sm my-7">
        <div class="card-header">
            <h3 class="card-title fw-bold">Persediaan</h3>
            <div class="card-toolbar">
                <div class="me-2">
                    <button type="button" on:click={ () => { currentPage = 'Item Keluar' } } class="btn btn-sm btn-primary">Item Keluar</button>
                    <button type="button" on:click={ () => { currentPage = 'Stok Opname' } } class="btn btn-sm btn-success">Stok Opname</button>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="container-fluid">
    {#if currentPage == 'Item Keluar' }
        <ItemKeluar />
    {:else if currentPage == 'Stok Opname'}
        <StokOpname />
    {/if}
</div>