<script lang="ts">
    import PerbaikanTransaksi from "./Custom/PerbaikanTransaksi.svelte";

    let currentPage:string = 'perbaikanTransaksi'
</script>
<div class="container-fluid">
    
    <div class="row">
        <div class="col-sm-2 col-md-2 col-lg-2">
            <div class="card shadow-sm my-7">
                <div class="card-body">
                    <h4 class="menu-content text-muted mb-3 fs-7 text-uppercase">Sistem Outlet</h4>
                    <button type="button" class="btn btn-sm menu-link">Perbaikan Transaksi</button>
                </div>
            </div>
        </div>
        <div class="col-sm-10 col-md-10 col-lg-10">

            {#if currentPage == 'perbaikanTransaksi'}
                <PerbaikanTransaksi />
            {/if}

        </div>
    </div>

</div>