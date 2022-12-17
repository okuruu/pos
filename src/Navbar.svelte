<script lang="ts">
    import { Router, Link, Route } from 'svelte-navigator'
    import Akuntansi from './routes/Akuntansi.svelte';
    import MasterData from './routes/MasterData.svelte';
    import Pembelian from './routes/Pembelian.svelte';
    import Penjualan from './routes/Penjualan.svelte';
    import Persediaan from './routes/Persediaan.svelte';
    import Laporan from './routes/Laporan.svelte';
</script>

<Router>

    <div id="kt_header" class="header" data-kt-sticky="true" data-kt-sticky-name="header" data-kt-sticky-animation="false">
        <div class="container-xxl d-flex align-items-center flex-lg-stack">
            <div class="d-flex align-items-center flex-grow-1 flex-lg-grow-0 me-2 me-lg-5">
                <div class="flex-grow-2 me-2">
                    <img alt="Logo" src="/public/assets/images/logoDea.jpg" class="h-55px h-lg-55px rounded-corner-logo ">
                </div>
                <div class="me-4">
                    <Link to="Master-Data" class="btn me-2 fw-bold">Master Data</Link>
                    <Link to="Pembelian" class="btn me-2 fw-bold">Pembelian</Link>
                    <Link to="Penjualan" class="btn me-2 fw-bold">Penjualan</Link>
                    <Link to="Persediaan" class="btn me-2 fw-bold">Persediaan</Link>
                    <Link to="Akuntansi" class="btn me-2 fw-bold">Akuntansi</Link>
                    <Link to="Laporan" class="btn me-2 fw-bold">Laporan</Link>
                </div>
            </div>
            <div class="d-flex align-items-stretch flex-shrink-0">
                <div class="d-flex align-items-center ms-1 ms-lg-3">
                    <img src="/public/assets/images/evilDuck.jpg" alt="Press evil duck to logout" class="h-55px h-lg-55px rounded-corner-logo"/>
                </div>
            </div>
        </div>
    </div>

    <div class="card card-flush">
        <div class="card-header">
            <Route path="Master-Data" primary={false}>
                <MasterData />
            </Route>
            <Route path="Pembelian" primary={false}>
                <Pembelian />
            </Route>
            <Route path="Penjualan" primary={false}>
                <Penjualan />
            </Route>
            <Route path="Persediaan" primary={false}>
                <Persediaan />
            </Route>
            <Route path="Akuntansi" primary={false}>
                <Akuntansi />
            </Route>
            <Route path="Laporan" primary={false}>
                <Laporan />
            </Route>
        </div>
    </div>

</Router>