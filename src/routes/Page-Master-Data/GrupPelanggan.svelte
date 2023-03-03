<script lang="ts">
    import { onMount } from "svelte";
    import { globalURL } from "../../lib/mainLink";
    import toast, { Toaster } from 'svelte-french-toast'

    let data:string[]   = []

    // Form Grup Pelanggan

    let currentID:number
    let isSubmitted:boolean = false

    let kodePelanggan:string
    let levelHarga:number
    let keteranganPelanggan:string

    onMount(async () => {
        runFirst()        
    })

    async function runFirst(){
        const getData       = await fetch(globalURL + 'Grup-Pelanggan',{
            method: 'GET',
            credentials: 'include'
        })
        data = await getData.json()
        data = data
    }

    async function getDetail(ID){
        currentID = ID

        const doPost = await fetch(globalURL + 'Grup-Pelanggan/Detail', {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                ID: currentID
            })
        })

        const postResponse  = await doPost.json()
        kodePelanggan       = postResponse.KODE
        levelHarga          = postResponse.LEVEL_HARGA
        keteranganPelanggan = postResponse.KETERANGAN
    }

    async function doUpdate(){
        if(kodePelanggan == null || keteranganPelanggan == null || levelHarga == null){
            return toast.error('Lengkapi data terlebih dahulu')
        }

        if(levelHarga < 0 || levelHarga > 5){
            return toast.error("Range Level Harga 1 - 5")
        }

        const doUpdate = await fetch(globalURL + 'Grup-Pelanggan/Update', {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                ID          : currentID,
                LEVEL_HARGA : levelHarga,
                KETERANGAN  : keteranganPelanggan
            })
        })
        isSubmitted = true
        return runFirst()
    }

    async function doPost(){

        if(kodePelanggan == null || keteranganPelanggan == null || levelHarga == null){
            return toast.error('Lengkapi data terlebih dahulu')
        }

        if(levelHarga < 0 || levelHarga > 5){
            return toast.error("Range Level Harga 1 - 5")
        }

        const doPost = await fetch(globalURL + 'Grup-Pelanggan', {
            method: 'POST',
            headers : { 'Content-Type' : 'application/json' },
            credentials : 'include',
            body: JSON.stringify({
                KODE            : kodePelanggan,
                KETERANGAN      : keteranganPelanggan,
                LEVEL_HARGA     : levelHarga
            })
        })

        const postResponse = await doPost.json()
        toast.success(postResponse)
        isSubmitted = true
        return runFirst()
    }

</script>

<Toaster />

<div class="card shadow-sm">
    <div class="card-header">
        <h3 class="card-title fw-bold">Grup Pelanggan</h3>
        <div class="card-toolbar">
            <button type="button" class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#tambahGrupPelanggan"><i class="las la-plus-circle fs-2 me-2"></i>Tambah Grup Pelanggan</button>
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
                        <th>Level Harga</th>
                        <th>Terakhir Diupdate</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {#each data as data, index }
                        <tr>
                            <td>{ index + 1 }</td>
                            <td>{ data.KODE }</td>
                            <td>{ data.KETERANGAN }</td>
                            <td>Level { data.LEVEL_HARGA }</td>
                            <td>{ data.UPDATED_AT } WIB</td>
                            <td><button type="button" on:click={ getDetail(data.ID) } class="btn btn-sm btn-info" data-bs-toggle="modal" data-bs-target="#editGrupPelanggan">Detail</button></td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>

    </div>
</div>

<!-- Modal Grup Pelanggan -->

<div class="modal fade" tabindex="-1" id="tambahGrupPelanggan">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Grup Pelanggan baru</h3>
            </div>

            <div class="modal-body">
                
                <div class="row mb-6">
                    <label for="kodePelanggan" class="col-sm-4 col-form-label fw-bold fs-6 required">
                        <span>Kode Pelanggan</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input type="text" bind:value={kodePelanggan} class="form-control" placeholder="Masukkan Kode Pelanggan"/>
                    </div>
                </div>

                <div class="row mb-6">
                    <label for="kodePelanggan" class="col-sm-4 col-form-label fw-bold fs-6 required">
                        <span>Level Harga</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input type="number" min="1" max="5" bind:value={levelHarga} class="form-control" placeholder="Antara Level 1 sampai Level 5"/>
                    </div>
                </div>
                
                <div class="row mb-6">
                    <label for="grupPelanggan" class="col-sm-4 col-form-label fw-bold fs-6 required">
                        <span>Keterangan</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <textarea class="form-control" row="3" placeholder="Keterangan" bind:value={keteranganPelanggan}></textarea>
                    </div>
                </div>

            </div>

            <div class="modal-footer">
                <button type="button" on:click={ () => { isSubmitted = false } } class="btn btn-light" data-bs-dismiss="modal">Tutup</button>
                {#if isSubmitted == false}
                    <button type="button" on:click={doPost} class="btn btn-primary">Simpan Data</button>
                {/if}
            </div>
        </div>
    </div>
</div>

<!-- Modal Edit -->

<div class="modal fade" tabindex="-1" id="editGrupPelanggan">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Grup Pelanggan: {kodePelanggan}</h3>
            </div>

            <div class="modal-body">
                
                <div class="row mb-6">
                    <label for="kodePelanggan" class="col-sm-4 col-form-label fw-bold fs-6 required">
                        <span>Kode Pelanggan</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input type="text" bind:value={kodePelanggan} class="form-control form-control-solid" placeholder="Masukkan Kode Pelanggan" readonly/>
                    </div>
                </div>
    
                <div class="row mb-6">
                    <label for="kodePelanggan" class="col-sm-4 col-form-label fw-bold fs-6 required">
                        <span>Level Harga</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input type="number" min="1" max="5" bind:value={levelHarga} class="form-control" placeholder="Antara Level 1 sampai Level 5"/>
                    </div>
                </div>
                
                <div class="row mb-6">
                    <label for="grupPelanggan" class="col-sm-4 col-form-label fw-bold fs-6 required">
                        <span>Keterangan</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <textarea class="form-control" row="3" placeholder="Keterangan" bind:value={keteranganPelanggan}></textarea>
                    </div>
                </div>

            </div>


            <div class="modal-footer">
                <button type="button" on:click={ () => { isSubmitted = false } } class="btn btn-light" data-bs-dismiss="modal">Tutup</button>
                {#if isSubmitted == false}
                    <button type="button" on:click={doUpdate} class="btn btn-primary">Simpan Data</button>
                {/if}
            </div>
        </div>
    </div>
</div>