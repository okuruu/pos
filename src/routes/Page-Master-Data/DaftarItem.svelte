<script lang="ts">
    import { onMount } from "svelte";
    import { currencyFormat } from "../../lib/currencyFormatter";
    import { globalURL } from "../../lib/mainLink";

    let activeSession:string    = 'Loading..'
    let listStok                = [];

    onMount(async () => {
        const response = await fetch(globalURL + 'Bundle-Penjualan', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                tipePenjualan   : 'Stok-Outlet',
            })
        })

        const serverData    = await response.json()
        listStok            = serverData.STOK
        activeSession       = serverData.ACTIVE.NAMA
    });

</script>

<div class="card shadow-sm">
    <div class="card-header">
        <h3 class="card-title fw-bold">Daftar Item</h3>
        <div class="card-toolbar">
            <button type="button" class="btn btn-sm btn-primary">
                Active Session: {activeSession}
            </button>
        </div>
    </div>
    <div class="card-body">
        
        <table class="table table-row-dashed table-row-gray-300 gy-2 table-hover text-center">
            <thead>
                <tr class="fw-bold">
                    <th>#</th>
                    <th>Kode</th>
                    <th>Nama</th>
                    <th>Harga Jual</th>
                    <th>Satuan</th>
                    <th>Stok</th>
                </tr>
            </thead>
            <tbody>
                {#each listStok as data, index }
                <tr>
                    <td>{ index + 1 }</td>
                    <td>{ data.KODE }</td>
                    <td>{ data.NAMA }</td>
                    <td>{ currencyFormat.format(data.HARGA) }</td>
                    <td>{ data.SATUAN }</td>
                    <td>{ data.STOK_REAL }</td>
                </tr>                    
                {/each }
            </tbody>
        </table>

    </div>
</div>