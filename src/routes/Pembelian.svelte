<script lang="ts">
    import DaftarPembelian from "./Page-Pembelian/DaftarPembelian.svelte";
import PesananPembelian from "./Page-Pembelian/PesananPembelian.svelte";

    let currentPage:string = "Daftar Pembelian";
</script>

<div class="container-fluid">
    <div class="card shadow-sm my-7">
        <div class="card-header">
            <h3 class="card-title fw-bold">Pembelian</h3>
            <div class="card-toolbar">
                <div class="me-2">
                    <button type="button" on:click={ () => { currentPage = 'Pembelian' } } class="btn btn-sm btn-primary">Pembelian</button>
                    <button type="button" on:click={ () => { currentPage = 'Daftar Pembelian' } } class="btn btn-sm btn-success">Daftar Pembelian</button>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="container-fluid">
    {#if currentPage == "Pembelian"}
        <PesananPembelian />
    {:else if currentPage == "Daftar Pembelian" }
        <DaftarPembelian />
    {/if}
</div>