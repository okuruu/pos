<script lang="ts">
    import UpdateHarga from "./Page-Master-Data/Administrator/UpdateHarga.svelte";
import DaftarItem from "./Page-Master-Data/DaftarItem.svelte";
    import DaftarPelanggan from "./Page-Master-Data/DaftarPelanggan.svelte";
    import DaftarSales from "./Page-Master-Data/DaftarSales.svelte";
    import DaftarSupplier from "./Page-Master-Data/DaftarSupplier.svelte";
    import DeskripsiLain from "./Page-Master-Data/DeskripsiLain.svelte";
    import GrupPelanggan from "./Page-Master-Data/GrupPelanggan.svelte";
    import KartuStok from "./Page-Master-Data/KartuStok.svelte";
    import Promo from "./Page-Master-Data/Promo.svelte";

    let currentPage:string = 'daftarItem';
</script>

<div class="container-fluid">

    <div class="row my-7">
        <div class="col-sm-2 col-md-2 col-lg-2">
            
            <div class="card shadow-sm">
                <div class="card-body">
                    
                    <button type="button" on:click={ () => { currentPage = 'daftarItem' } } class="btn btn-sm w-100 mb-1">Daftar Item</button>
                    <button type="button" on:click={ () => { currentPage = 'kartuStok' } } class="btn btn-sm w-100 mb-1">Kartu Stok</button>
                    <button type="button" on:click={ () => { currentPage = 'promo' } } class="btn btn-sm w-100 mb-1">Promo</button>

                    <div class="separator my-2"></div>

                    <button type="button" on:click={ () => { currentPage = 'daftarSupplier' } } class="btn btn-sm w-100 mb-1">Daftar Supplier</button>
                    <button type="button" on:click={ () => { currentPage = 'daftarSales' } } class="btn btn-sm w-100 mb-1">Daftar Sales</button>

                    <div class="separator my-2"></div>

                    <button type="button" on:click={ () => { currentPage = 'daftarPelanggan' } } class="btn btn-sm w-100 mb-1">Member & Poin</button>
                    <button type="button" on:click={ () => { currentPage = 'grupPelanggan' } } class="btn btn-sm w-100 mb-1">Grup Pelanggan</button>

                    <div class="separator my-2"></div>

                    <button type="button" on:click={ () => { currentPage = 'deskripsiLain' } } class="btn btn-sm w-100 mb-1">Satuan & Deskripsi Lain</button>
                    
                    <div class="separator my-2"></div>

                    <button type="button" on:click={ () => { currentPage = 'masterUpdate' } } class="btn btn-sm w-100 mb-1">Update Item</button>

                </div>
            </div>

        </div>
        <div class="col-sm-10 col-md-10 col-lg-10">

            {#if currentPage == 'daftarItem'}
                <DaftarItem />
            {:else if currentPage == 'kartuStok'}
                <KartuStok />
            {:else if currentPage == 'promo'}
                <Promo />
            {:else if currentPage == 'daftarSupplier'}
                <DaftarSupplier />
            {:else if currentPage == 'daftarSales'}
                <DaftarSales />
            {:else if currentPage == 'daftarPelanggan'}
                <DaftarPelanggan />
            {:else if currentPage == 'grupPelanggan'}
                <GrupPelanggan />
            {:else if currentPage == 'deskripsiLain'}
                <DeskripsiLain />
            {:else if currentPage == 'masterUpdate'}
                <UpdateHarga />
            {/if}

        </div>
    </div>

</div>