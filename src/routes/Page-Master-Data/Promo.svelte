<script lang="ts">
    import { onMount } from "svelte";
    import { globalURL } from "../../lib/mainLink";
    import toast, { Toaster } from 'svelte-french-toast'

    let data:string[]   = []

    // Kode Promo
    let currentID:number
    let kodePromo:string
    let keteranganPromo:string
    let periodeAwal:any
    let periodeLimit:any

    onMount(async () => {
        runFirst()
    })

    async function runFirst() {
        const getData = await fetch(globalURL + 'Promo', {
            method: 'GET',
            credentials : 'include'
        })

        data = await getData.json()
        data = data
    }

    async function doPost(){

        const doPost = await fetch(globalURL + 'Promo', {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                KODE            : kodePromo,
                KETERANGAN      : keteranganPromo,
                PERIODE_AWAL    : periodeAwal,
                PERIODE_LIMIT   : periodeLimit
            })
        })

        const doResponse = await doPost.json()
        console.log(doResponse)
        toast.success("Berhasil diupdate!")

        runFirst()

        kodePromo           = null
        keteranganPromo     = null
        periodeAwal         = null
        periodeLimit        = null
    }

    async function deletePromo(){
        const doPost = await fetch(globalURL + 'Hapus-Promo', {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                ID : currentID
            })
        })

        currentID = null
        const doResponse = await doPost.json()
        toast.success(doResponse)
        runFirst()
    }

</script>

<Toaster />

<div class="card shadow-sm">
    <div class="card-header">
        <h3 class="card-title fw-bold">Promo</h3>
        <div class="card-toolbar">
            <button type="button" class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#buatPromo"><i class="las la-plus-circle fs-2 me-2"></i>Buat Promo Baru</button>
        </div>
    </div>
    <div class="card-body">
        
        <div class="table-responsive">
            <table class="table table-row-dashed table-row-gray-300 align-middle mt-2">
                <thead>
                    <tr class="fw-bold">
                        <th>#</th>
                        <th>Kode</th>
                        <th>Keterangan</th>
                        <th>Periode Limit</th>
                        <th>Promo Dibuat Pada</th>
                        <th>Hapus Promo</th>
                    </tr>
                </thead>
                <tbody>
                    {#each data as data, index }
                        <tr>
                            <td>{ index + 1 }</td>
                            <td>{ data.KODE }</td>
                            <td>{ data.KETERANGAN }</td>
                            <td><span class="badge badge-info">{ data.PERIODE_LIMIT }</span></td>
                            <td><span class="badge badge-success">{ data.CREATED_AT }</span></td>
                            <td><button type="button" on:click={ () => { currentID = data.ID } } class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#deletePromo"><i class="las la-trash fs-2 me-2"></i>Hapus</button></td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>

    </div>
</div>

<!-- Modal Add Promo -->

<div class="modal fade" tabindex="-1" id="buatPromo">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Buat Promo Baru</h3>
                <div class="btn btn-icon btn-sm btn-active-light-primary ms-2" data-bs-dismiss="modal" aria-label="Close">X</div>
            </div>

            <div class="modal-body">
                
                <div class="row mb-6">
                    <label for="kodePromo" class="col-sm-4 col-form-label fw-bold fs-6 required">
                        <span>Kode Promo</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input type="text" bind:value={kodePromo} class="form-control" placeholder="Kode promo harus unik!"/>
                    </div>
                </div>
                
                <div class="row mb-6">
                    <label for="keteranganPromo" class="col-sm-4 col-form-label fw-bold fs-6 required">
                        <span>Keterangan Promo</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input type="text" bind:value={keteranganPromo} class="form-control" placeholder="Masukkan Keterangan Promo"/>
                    </div>
                </div>
                
                <div class="row mb-6">
                    <label for="awalPromo" class="col-sm-4 col-form-label fw-bold fs-6 required">
                        <span>Periode Awal</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input type="datetime-local" class="form-control form-control" bind:value={periodeAwal} />
                    </div>
                </div>
                
                <div class="row mb-6">
                    <label for="akhirPromo" class="col-sm-4 col-form-label fw-bold fs-6 required">
                        <span>Periode Limit</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input type="datetime-local" class="form-control form-control" bind:value={periodeLimit} />
                    </div>
                </div>

            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Tutup</button>
                <button type="button" on:click={doPost} class="btn btn-primary">Simpan</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal Delete Promo -->

<div class="modal fade" tabindex="-1" id="deletePromo">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Apakah anda yakin?</h3>
                <div class="btn btn-icon btn-sm btn-active-light-primary ms-2" data-bs-dismiss="modal" aria-label="Close">X</div>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Tutup</button>
                {#if currentID != null }
                    <button type="button" on:click={deletePromo} class="btn btn-danger">Ya, Hapus Promo</button>
                {/if}
            </div>
        </div>
    </div>
</div>