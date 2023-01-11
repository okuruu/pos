<script lang="ts">
    import KasKeluar from "./Page-Akuntansi/KasKeluar.svelte";
    import KasMasuk from "./Page-Akuntansi/KasMasuk.svelte";
    import KasTransfer from "./Page-Akuntansi/KasTransfer.svelte";
    
    let currentPage:string = 'kasMasuk'

</script>

<div class="container-fluid">
    
    <div class="card shadow-sm my-7">
        <div class="card-header">
            <h3 class="card-title fw-bold">Akuntansi</h3>
            <div class="card-toolbar">
                <div class="me-2">
                    <button type="button" on:click={ () => { currentPage = 'kasMasuk' } } class="btn btn-sm btn-primary">Kas Masuk</button>
                    <button type="button" on:click={ () => { currentPage = 'kasKeluar' } } class="btn btn-sm btn-success">Kas Keluar</button>
                    <button type="button" on:click={ () => { currentPage = 'kasTransfer' } } class="btn btn-sm btn-info">Kas Transfer</button>
                </div>
            </div>
        </div>
    </div>

    {#if currentPage == 'kasMasuk'}
        <KasMasuk />
    {:else if currentPage == 'kasKeluar'}
        <KasKeluar />
    {:else if currentPage == 'kasTransfer'}
        <KasTransfer />
    {/if}

</div>