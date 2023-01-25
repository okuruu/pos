<script lang="ts">
    import { onMount } from "svelte";
    import toast, { Toaster } from 'svelte-french-toast';
    import { currencyFormat } from "../../../lib/currencyFormatter";
    import { globalURL } from "../../../lib/mainLink";

    let listHarga   = []
    let searchItem  = null

    // Modals
    let currentCode:string  = '-'
    let choosenValue        = {
        KODE : null,
        NAMA: null,
        HARGA: null,
        NAMA_WILAYAH: null,
        SATUAN: null,
        LEVEL_1: null,
        LEVEL_2: null,
        LEVEL_3: null,
        LEVEL_4: null,
        LEVEL_5: null,
    }

    onMount(async () => {
        getData()
    })

    async function getData(){
        const dataRequest = await fetch(globalURL + 'Deskripsi-Umum', {
            method: 'POST',
            headers : { 'Content-Type' : 'application/json' },
            credentials : 'include',
            body: JSON.stringify({
                dataRequest : 'master_produk'
            })
        })

        listHarga = await dataRequest.json()
        toast.success("Data berhasil dimuat!")
    }

    function showModals(ID){
        currentCode = ID
        let findValue = listHarga.find(e => e.KODE === currentCode )

        choosenValue        = {
            KODE            : findValue.KODE,
            NAMA            : findValue.NAMA,
            HARGA           : findValue.HARGA,
            NAMA_WILAYAH    : findValue.NAMA_WILAYAH,
            SATUAN          : findValue.SATUAN,
            LEVEL_1         : findValue.LEVEL_1,
            LEVEL_2         : findValue.LEVEL_2,
            LEVEL_3         : findValue.LEVEL_3,
            LEVEL_4         : findValue.LEVEL_4,
            LEVEL_5         : findValue.LEVEL_5,
        }
    }

    async function doPost(){
        const postData = await fetch(globalURL + 'Update-Harga', {
            method: 'POST',
            headers : { 'Content-Type' : 'application/json' },
            credentials : 'include',
            body : JSON.stringify({
                KODE            : currentCode,
                WILAYAH         : choosenValue.NAMA_WILAYAH,
                LEVEL_1         : choosenValue.LEVEL_1,
                LEVEL_2         : choosenValue.LEVEL_2,
                LEVEL_3         : choosenValue.LEVEL_3,
                LEVEL_4         : choosenValue.LEVEL_4,
                LEVEL_5         : choosenValue.LEVEL_5,
            })
        })

        const postResponse = await postData.json()
        toast.success(postResponse)
        getData()
    }

</script>

<Toaster />

<div class="card shadow-sm">
    <div class="card-header">
        <h3 class="card-title fw-bold">Update Harga</h3>
        <div class="card-toolbar">
            <button type="button" class="btn btn-sm btn-light">
                Action
            </button>
        </div>
    </div>
    <div class="card-body">

        <div class="row">
            <div class="col-sm-3 col-md-3 col-lg-3">
                <input type="text" bind:value={searchItem} class="form-control form-control-sm" placeholder="Cari Produk" />
            </div>
            <div class="col-sm-2 col-md-2 col-lg-2">
                <button type="submit" class="btn btn-sm btn-primary"><i class="las la-search fs-2 me-2"></i>Cari</button>
            </div>
        </div>
        
        <div class="table-responsive">
            <table id="dataTable" class="table table-hover table-row-dashed table-row-gray-300 align-middle mt-2">
                <thead>
                    <tr class="fw-bold">
                        <th>Kode Item</th>
                        <th>Nama Item</th>
                        <th>Wilayah</th>
                        <th>Level 1</th>
                        <th>Level 2</th>
                        <th>Level 3</th>
                        <th>Level 4</th>
                        <th>Level 5</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {#each listHarga as data }
                    <tr>
                        <td> { data.KODE } </td>
                        <td> { data.NAMA } </td>
                        <td> <span class="badge badge-{ data.NAMA_WILAYAH == "Jawa" ? 'primary' : 'info' } text-center">{ data.NAMA_WILAYAH }</span> </td>
                        <td> { currencyFormat.format(data.LEVEL_1) } </td>
                        <td> { currencyFormat.format(data.LEVEL_2) } </td>
                        <td> { currencyFormat.format(data.LEVEL_3) } </td>
                        <td> { currencyFormat.format(data.LEVEL_4) } </td>
                        <td> { currencyFormat.format(data.LEVEL_5) } </td>
                        <td><button type="button" on:click={showModals(data.KODE)} class="btn btn-sm btn-warning" data-bs-toggle="modal" data-bs-target="#editHarga">Edit</button> </td>
                    </tr>
                    {/each}
                </tbody>
            </table>
        </div>

    </div>
</div>

<!-- Modal Edit Harga -->
<div class="modal fade" tabindex="-1" id="editHarga">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Edit Harga: {choosenValue.NAMA}</h3>

                <div class="btn btn-icon btn-sm btn-active-light-primary ms-2" data-bs-dismiss="modal" aria-label="Close">
                    <span class="svg-icon svg-icon-1"></span>
                </div>
            </div>

            <div class="modal-body">
                
                <div class="row mb-6">
                    <label for="harga" class="col-lg-4 col-form-label fw-bold fs-6">Kode Item</label>
                    <div class="col-lg-8 fv-row">
                        <input type="text" class="form-control form-control-lg form-control-solid" readonly value="{choosenValue.KODE}" />
                    </div>
                </div>
                
                <div class="row mb-6">
                    <label for="harga" class="col-lg-4 col-form-label fw-bold fs-6">Nama Item</label>
                    <div class="col-lg-8 fv-row">
                        <input type="text" class="form-control form-control-lg form-control-solid" readonly value="{choosenValue.NAMA}" />
                    </div>
                </div>
                
                <div class="row mb-6">
                    <label for="harga" class="col-lg-4 col-form-label fw-bold fs-6">Nama Wilayah</label>
                    <div class="col-lg-8 fv-row">
                        <input type="text" class="form-control form-control-lg form-control-solid" readonly value="{choosenValue.NAMA_WILAYAH}" />
                    </div>
                </div>
                
                <div class="row mb-6">
                    <label for="harga" class="col-lg-4 col-form-label fw-bold fs-6">Satuan</label>
                    <div class="col-lg-8 fv-row">
                        <input type="text" class="form-control form-control-lg form-control-solid" readonly value="{choosenValue.SATUAN}" />
                    </div>
                </div>
                
                <div class="row mb-6">
                    <label for="harga" class="col-lg-4 col-form-label fw-bold fs-6">Harga Level 1</label>
                    <div class="col-lg-8 fv-row">
                        <input type="text" class="form-control form-control-lg" placeholder="Level Harga" bind:value="{choosenValue.LEVEL_1}" />
                    </div>
                </div>
                
                <div class="row mb-6">
                    <label for="harga" class="col-lg-4 col-form-label fw-bold fs-6">Harga Level 2</label>
                    <div class="col-lg-8 fv-row">
                        <input type="text" class="form-control form-control-lg" placeholder="Level Harga" bind:value="{choosenValue.LEVEL_2}" />
                    </div>
                </div>
                
                <div class="row mb-6">
                    <label for="harga" class="col-lg-4 col-form-label fw-bold fs-6">Harga Level 3</label>
                    <div class="col-lg-8 fv-row">
                        <input type="text" class="form-control form-control-lg" placeholder="Level Harga" bind:value="{choosenValue.LEVEL_3}" />
                    </div>
                </div>
                
                <div class="row mb-6">
                    <label for="harga" class="col-lg-4 col-form-label fw-bold fs-6">Harga Level 4</label>
                    <div class="col-lg-8 fv-row">
                        <input type="text" class="form-control form-control-lg" placeholder="Level Harga" bind:value="{choosenValue.LEVEL_4}" />
                    </div>
                </div>
                
                <div class="row mb-6">
                    <label for="harga" class="col-lg-4 col-form-label fw-bold fs-6">Harga Level 5</label>
                    <div class="col-lg-8 fv-row">
                        <input type="text" class="form-control form-control-lg" placeholder="Level Harga" bind:value="{choosenValue.LEVEL_5}" />
                    </div>
                </div>
                
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-sm btn-light" data-bs-dismiss="modal"><i class="las la-times-circle fs-2 me-2"></i>Tutup</button>
                <button type="button" on:click={doPost} class="btn btn-sm btn-primary"><i class="las la-save fs-2 me-2"></i>Simpan</button>
            </div>
        </div>
    </div>
</div>