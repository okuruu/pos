<script lang="ts">
    import PerbaikanTransaksi from "./Custom/PerbaikanTransaksi.svelte";
    import PerbaikanTransaksiAdmin from "./Custom/PerbaikanTransaksiAdmin.svelte";

    let currentPage:string = 'perbaikanTransaksi'
</script>
<div class="container-fluid">
    
    <div class="row">
        <div class="col-sm-3 col-md-3 col-lg-3">
            <div class="card shadow-sm my-7">
                <div class="card-body">
                    <h4 class="menu-content mb-3 fs-7 fw-bolder text-uppercase">Sistem Outlet</h4>
                    <div class="separator my-3"></div>
                    <button type="button" on:click={ () => { currentPage = 'perbaikanTransaksi' } } class="btn btn-sm w-100 my-1 btn-danger">Perbaikan Transaksi</button>
                    <button type="button" on:click={ () => { currentPage = 'perbaikanTransaksiAdmin' } } class="btn btn-sm w-100 my-1 btn-danger">P. Transaksi (Admin)</button>
                </div>
            </div>
        </div>
        <div class="col-sm-9 col-md-9 col-lg-9">

            {#if currentPage == 'perbaikanTransaksi'}
                <PerbaikanTransaksi />
            {:else if currentPage == 'perbaikanTransaksiAdmin' }
                <PerbaikanTransaksiAdmin />
            {/if}

        </div>
    </div>

</div>