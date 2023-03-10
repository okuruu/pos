<script lang="ts">
    import { onMount } from "svelte";
    import toast from "svelte-french-toast";
    import { globalURL } from "../../lib/mainLink";

    let data:string[]       = []
    let dataGudang:string[] = []
    let startDate:any
    let endDate:any

    let currentCode:string
    let currentWarehouse:string

    let kartuStok:string[]  = []

    onMount(async () => {
        const doGet = await fetch(globalURL + 'Kartu-Stok', {
            method: 'GET',
            credentials: 'include'
        })
        const doResponse = await doGet.json()
        data        = doResponse.data
        dataGudang  = doResponse.outlet
    })

    async function doSearch(){
        const doSearch = await fetch(globalURL + 'Kartu-Stok', {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                KODE: currentCode,
                GUDANG: currentWarehouse,
                START: startDate,
                END: endDate
            })
        })

        const doResponse = await doSearch.json()
        kartuStok = doResponse.data
        doResponse.message ? toast.success("Data dimuat") : toast.error("Tidak ada catatan")
    }

</script>

<div class="card shadow-sm">
    <div class="card-header">
        <h3 class="card-title fw-bold">Kartu Stok</h3>
    </div>
    <div class="card-body">

        <div class="row">
            <div class="col-md-3 fv-row">
                <label for="pencarianKasMasuk" class="d-flex align-items-center mb-2">
                    <span class="fs-6 fw-bolder">Kode Item</span>
                </label>
                <select bind:value={currentCode} class="form-select form-select-sm">
                    <option value="" selected disabled>-</option>
                    {#each data as data }
                        <option value="{data.KODE}">{ data.NAMA}</option>
                    {/each}
                </select>
            </div>

            <div class="col-md-2 fv-row">
                <label for="pencarianGudang" class="d-flex align-items-center mb-2">
                    <span class="fs-6 fw-bolder">Gudang</span>
                </label>
                <select bind:value={currentWarehouse} class="form-select form-select-sm">
                    <option value="" selected disabled>-</option>
                    {#each dataGudang as gudang }
                        <option value="{ gudang.KODE_OUTLET }">{ gudang.NAMA }</option>
                    {/each}

                </select>
            </div>

            <div class="col-md-2 fv-row">
                <label for="pencarianKasMasuk" class="d-flex align-items-center mb-2">
                    <span class="fs-6 fw-bolder">Periode s/d</span>
                </label>
                <input type="date" bind:value={startDate} class="form-control form-control-sm" />
            </div>

            <div class="col-md-2 fv-row">
                <label for="pencarianKasMasuk" class="d-flex align-items-center mb-2">
                    <span class="fs-6 fw-bolder">Periode s/d</span>
                </label>
                <input type="date" bind:value={endDate} class="form-control form-control-sm" />
            </div>


            <div class="col-md-2 fv-row">
                <button type="button" on:click={doSearch} class="btn btn-sm btn-primary mt-8"><i class="las la-search fs-2 me-2"></i>Cari</button>
            </div>
        </div>
        
        <div class="table-responsive">
            <table class="table table-row-dashed table-row-gray-300 align-middle mt-2">
                <thead>
                    <tr class="fw-bold">
                        <th>#</th>
                        <th>Nama</th>
                        <th>Tipe</th>
                        <th>Nama Item</th>
                        <th>Jumlah Item</th>
                        <th>Stok Sebelumnya</th>
                        <th>Sisa Stok</th>
                        <th>Tanggal Tercatat</th>
                    </tr>
                </thead>
                <tbody>
                    {#each kartuStok as stok,index }
                        <tr>
                            <td>{ index + 1 }</td>
                            <td>{ stok.NAMA }</td>
                            <td>{ stok.TIPE }</td>
                            <td>{ stok.NAMA_ITEM }</td>
                            <td>{ stok.JUMLAH_ITEM }</td>
                            <td>{ stok.STOK_SEBELUMNYA }</td>
                            <td>{ stok.SISA_STOK }</td>
                            <td>{ stok.TANGGAL_TERCATAT } WIB</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>

    </div>
</div>