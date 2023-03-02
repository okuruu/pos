<script lang="ts">
    import { onMount } from "svelte";
    import { globalURL } from "../../lib/mainLink";
    import toast, { Toaster } from 'svelte-french-toast'

    let listSupplier:string[]   = []
    let dataSupplier:string[]   = []

    let currentId:string        = '-'

    // Form Data
    let namaSupplier:string
    let kotaSupplier:string
    let hpSupplier:string
    let rekeningSupplier:string
    let atasNamaSupplier:string
    let bankSupplier:string
    let kategoriSupplier:string
    let alamatSupplier:string
    let keteranganSupplier:string

    onMount(async () => {
        runFirst()
    })

    async function runFirst(){
        const getData               = await fetch(globalURL + 'Daftar-Supplier', {
            method: 'GET',
            credentials : 'include'
        })
        listSupplier                = await getData.json()
        currentId = '-'
    }

    async function detailSupplier(idSupplier){
        currentId = idSupplier

        const doPost = await fetch(globalURL + 'Daftar-Supplier', {
            method: 'POST',
            headers : { 'Content-Type' : 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                ID : currentId
            })
        })

        dataSupplier = await doPost.json()

        namaSupplier        = dataSupplier.NAMA
        kotaSupplier        = dataSupplier.KOTA
        hpSupplier          = dataSupplier.HP
        rekeningSupplier    = dataSupplier.REKENING
        atasNamaSupplier    = dataSupplier.ATAS_NAMA
        bankSupplier        = dataSupplier.BANK
        kategoriSupplier    = dataSupplier.KATEGORI
        alamatSupplier      = dataSupplier.ALAMAT
        keteranganSupplier  = dataSupplier.KETERANGAN
    }

    async function doPost(){
        const doPost = await fetch(globalURL + 'Daftar-Supplier/Update', {
            method: 'POST',
            headers : { 'Content-Type' : 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                KODE        : currentId,
                NAMA        : namaSupplier ,
                KOTA        : kotaSupplier ,
                HP          : hpSupplier ,
                REKENING    : rekeningSupplier ,
                ATAS_NAMA   : atasNamaSupplier ,
                BANK        : bankSupplier ,
                KATEGORI    : kategoriSupplier ,
                ALAMAT      : alamatSupplier ,
                KETERANGAN  : keteranganSupplier ,
            })
        })

        toast.success("Data terupdate!")
    }

</script>

<Toaster />

<div class="card shadow-sm">
    <div class="card-header">
        <h3 class="card-title fw-bold">Daftar Supplier</h3>
    </div>
    <div class="card-body">
        
        <div class="table-responsive">
            <table class="table table-row-dashed table-row-gray-300 align-middle mt-2">
                <thead>
                    <tr class="fw-bold">
                        <th>#</th>
                        <th>Kode</th>
                        <th>Nama</th>
                        <th>Kota</th>
                        <th>Handphone</th>
                        <th>Rekening</th>
                        <th>Atas Nama</th>
                        <th>Atas Bank</th>
                        <th>Detail</th>
                    </tr>
                </thead>
                <tbody>
                    {#each listSupplier as data, index}
                        <tr>
                            <td>{ index + 1 }</td>
                            <td>{ data.KODE }</td>
                            <td>{ data.NAMA }</td>
                            <td>{ data.KOTA }</td>
                            <td>{ data.HP }</td>
                            <td>{ data.REKENING }</td>
                            <td>{ data.ATAS_NAMA }</td>
                            <td>{ data.BANK }</td>
                            <td><button type="button" class="btn btn-sm btn-info" on:click={ detailSupplier(data.KODE) } data-bs-toggle="modal" data-bs-target="#detailSupplier">Detail</button></td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>

    </div>
</div>

<!-- Modal Detail -->

<div class="modal fade" tabindex="-1" id="detailSupplier">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Supplier: { currentId }</h3>

                <div class="btn btn-icon btn-sm btn-active-light-primary ms-2" data-bs-dismiss="modal" aria-label="Close">X</div>
            </div>

            <div class="modal-body">
                
                <div class="row mb-6">
                    <label for="namaSupplier" class="col-sm-4 col-form-label fw-bold fs-6">
                        <span>Nama Supplier</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input type="text" bind:value={namaSupplier} class="form-control" placeholder="Nama Supplier"/>
                    </div>
                </div>

                <div class="row mb-6">
                    <label for="kotaSupplier" class="col-sm-4 col-form-label fw-bold fs-6">
                        <span>Kota</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input type="text" bind:value={kotaSupplier} class="form-control" placeholder="Kota Supplier"/>
                    </div>
                </div>

                <div class="row mb-6">
                    <label for="hpSupplier" class="col-sm-4 col-form-label fw-bold fs-6">
                        <span>HP</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input type="text" bind:value={hpSupplier} class="form-control" placeholder="WhatsApp Supplier"/>
                    </div>
                </div>

                <div class="row mb-6">
                    <label for="rekeningSupplier" class="col-sm-4 col-form-label fw-bold fs-6">
                        <span>Rekening</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input type="text" bind:value={rekeningSupplier} class="form-control" placeholder="Nomor Rekening"/>
                    </div>
                </div>

                <div class="row mb-6">
                    <label for="atasNamaSupplier" class="col-sm-4 col-form-label fw-bold fs-6">
                        <span>Atas Nama</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input type="text" bind:value={atasNamaSupplier} class="form-control" placeholder="Atas Nama Rekening"/>
                    </div>
                </div>

                <div class="row mb-6">
                    <label for="bankSupplier" class="col-sm-4 col-form-label fw-bold fs-6">
                        <span>Bank</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input type="number" bind:value={bankSupplier} class="form-control" placeholder="Nama Bank"/>
                    </div>
                </div>

                <div class="row mb-6">
                    <label for="kategoriSupplier" class="col-sm-4 col-form-label fw-bold fs-6">
                        <span>Kategori</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input type="text" bind:value={kategoriSupplier} class="form-control" placeholder="Kategori Supplier"/>
                    </div>
                </div>

                <div class="row mb-6">
                    <label for="alamatSupplier" class="col-sm-4 col-form-label fw-bold fs-6">
                        <span>Alamat Supplier</span>
                    </label>
                    <div class="col-lg-8">
                        <textarea class="form-control" row="3" placeholder="Alamat Supplier" bind:value={alamatSupplier}></textarea>
                    </div>
                </div>

                <div class="row mb-6">
                    <label for="keteranganSupplier" class="col-sm-4 col-form-label fw-bold fs-6">
                        <span>Keterangan Supplier</span>
                    </label>
                    <div class="col-lg-8">
                        <textarea class="form-control" row="3" placeholder="Keterangan Supplier" bind:value={keteranganSupplier}></textarea>
                    </div>
                </div>

            </div>

            <div class="modal-footer">
                <button type="button" on:click={ () => { currentId = '-' } } class="btn btn-light" data-bs-dismiss="modal">Tutup</button>
                <button type="button" on:click={doPost} class="btn btn-primary">Simpan</button>
            </div>
        </div>
    </div>
</div>