<script lang="ts">
    import { onMount } from "svelte";
    import { globalURL } from "../../lib/mainLink";
    import toast, { Toaster } from 'svelte-french-toast'

    let data:string[]   = []

    // Form Data
    let idSales:number
    let kodeSales:string        = '-'
    let namaSales:string
    let alamatSales:string
    let kotaSales:string
    let hpSales:string
    let rekeningSales:string
    let atasNamaSales:string
    let bankSales:string
    let keteranganSales:string

    onMount( async () => {
        runFirst()
    })

    async function runFirst(){
        const getData = await fetch(globalURL + 'Daftar-Sales', {
            method: 'GET',
            credentials: 'include'
        })

        data = await getData.json()
    }

    async function getDetail(currentID){
        const getData = await fetch(globalURL + 'Daftar-Sales', {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                ID: currentID
            })
        })

        const getResponse = await getData.json()

        idSales             = currentID
        kodeSales           = getResponse.KODE
        namaSales           = getResponse.NAMA
        alamatSales         = getResponse.ALAMAT
        kotaSales           = getResponse.KOTA
        hpSales             = getResponse.HP
        rekeningSales       = getResponse.REKENING
        atasNamaSales       = getResponse.ATAS_NAMA
        bankSales           = getResponse.BANK
        keteranganSales     = getResponse.KETERANGAN
    }

    async function doPost(){
        const doPost = await fetch(globalURL + 'Daftar-Sales/Update', {
            method: 'POST',
            headers : { 'Content-Type' : 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                ID          : idSales, 
                NAMA        : namaSales,
                ALAMAT      : alamatSales,
                KOTA        : kotaSales,
                HP          : hpSales,
                REKENING    : rekeningSales,
                ATAS_NAMA   : atasNamaSales,
                BANK        : bankSales,
                KETERANGAN  : keteranganSales,
            })
        })

        const doResponse = await doPost.json()
        toast.success('Berhasil diupdate!')
    }

</script>

<Toaster />

<div class="card shadow-sm">
    <div class="card-header">
        <h3 class="card-title fw-bold">Daftar Sales</h3>
    </div>
    <div class="card-body">
        
        <div class="table-responsive">
            <table class="table table-row-dashed table-row-gray-300 align-middle mt-2">
                <thead>
                    <tr class="fw-bold">
                        <th>#</th>
                        <th>Kode</th>
                        <th>Nama</th>
                        <th>HP</th>
                        <th>Rekening</th>
                        <th>Atas Nama</th>
                        <th>Bank</th>
                        <th>Detail</th>
                    </tr>
                </thead>
                <tbody>
                    {#each data as data, index }
                        <tr>
                            <td>{ index + 1 }</td>
                            <td>{ data.KODE }</td>
                            <td>{ data.NAMA }</td>
                            <td>{ data.HP }</td>
                            <td>{ data.REKENING }</td>
                            <td>{ data.ATAS_NAMA }</td>
                            <td>{ data.BANK }</td>
                            <td><button type="button" on:click={ getDetail(data.ID) } class="btn btn-sm btn-info"  data-bs-toggle="modal" data-bs-target="#modalSales">Detail</button></td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>

    </div>
</div>

<!-- Modal Sales -->

<div class="modal fade" tabindex="-1" id="modalSales">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title fw-bold">Sales: {kodeSales}</h3>

                <div class="btn btn-icon btn-sm btn-active-light-primary ms-2" data-bs-dismiss="modal" aria-label="Close">X</div>
            </div>

            <div class="modal-body">
                
                <div class="row mb-6">
                    <label for="namaSales" class="col-sm-4 col-form-label fw-bold fs-6">
                        <span>Nama Sales</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input type="text" bind:value={namaSales} class="form-control" placeholder="Nama Sales"/>
                    </div>
                </div>
                
                <div class="row mb-6">
                    <label for="kotaSales" class="col-sm-4 col-form-label fw-bold fs-6">
                        <span>Kota Sales</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input type="text" bind:value={kotaSales} class="form-control" placeholder="Nama Kota"/>
                    </div>
                </div>
                
                <div class="row mb-6">
                    <label for="kotaSales" class="col-sm-4 col-form-label fw-bold fs-6">
                        <span>HP</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input type="text" bind:value={hpSales} class="form-control" placeholder="Nomor WhatsApp"/>
                    </div>
                </div>
                
                <div class="row mb-6">
                    <label for="rekeningSales" class="col-sm-4 col-form-label fw-bold fs-6">
                        <span>Rekening</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input type="number" bind:value={rekeningSales} class="form-control" placeholder="Nomor Rekening"/>
                    </div>
                </div>
                
                <div class="row mb-6">
                    <label for="atasNamaSales" class="col-sm-4 col-form-label fw-bold fs-6">
                        <span>Atas Nama</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input type="text" bind:value={atasNamaSales} class="form-control" placeholder="Atas Nama"/>
                    </div>
                </div>
                
                <div class="row mb-6">
                    <label for="bankSales" class="col-sm-4 col-form-label fw-bold fs-6">
                        <span>Bank</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input type="text" bind:value={bankSales} class="form-control" placeholder="Nama Bank"/>
                    </div>
                </div>
                
                <div class="row mb-6">
                    <label for="alamatSales" class="col-sm-4 col-form-label fw-bold fs-6">
                        <span>Alamat Sales</span>
                    </label>
                    <div class="col-lg-8">
                        <textarea class="form-control" row="3" placeholder="Alamat Supplier" bind:value={alamatSales}></textarea>
                    </div>
                </div>

            </div>

            <div class="modal-footer">
                <button type="button" on:click={ () => { idSales = null } } class="btn btn-light" data-bs-dismiss="modal">Tutup</button>
                <button type="button" on:click={doPost} class="btn btn-primary">Update Data</button>
            </div>
        </div>
    </div>
</div>