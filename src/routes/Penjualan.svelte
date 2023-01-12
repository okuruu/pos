<script lang="ts">
    import Penjualan from './Page-Penjualan/Penjualan.svelte';
    import Pesanan from './Page-Penjualan/Pesanan.svelte';
    import PoPesanan from './Page-Penjualan/PoPesanan.svelte';

    let currentPage:string = "Penjualan";

</script>

<div class="container-fluid">
    <div class="card shadow-sm my-7">
        <div class="card-header">
            <h3 class="card-title fw-bold">Penjualan</h3>
            <div class="card-toolbar">
                <div class="me-2">
                    <button type="button" on:click={ () => { currentPage = 'Penjualan' } } class="btn btn-sm btn-primary">Penjualan</button>
                    <button type="button" on:click={ () => { currentPage = 'Pesanan' } } class="btn btn-sm btn-success">Pesanan</button>
                    <button type="button" on:click={ () => { currentPage = 'Checkout' } } class="btn btn-sm btn-danger">Checkout</button>
                </div>
            </div>
        </div>
    </div>
</div>

{#if currentPage == 'Pesanan' }
    <Pesanan />
{:else if currentPage == 'Penjualan' }
    <Penjualan />
{:else if currentPage == 'Checkout' }
    <PoPesanan />
{/if}