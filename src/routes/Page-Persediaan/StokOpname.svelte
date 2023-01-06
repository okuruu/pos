<script lang="ts">
    import { onMount } from "svelte";
    import toast, { Toaster } from 'svelte-french-toast';
    import { userResponse } from "../../lib/activeUser";
    import { globalURL } from "../../lib/mainLink";

    let masterProduk:string[] = []
    let currentProducts:string
    let itemPlaceholder:string[] = {
        // @ts-ignore
        KODE        : null,
        NAMA        : null,
        HARGA       : null,
        SATUAN      : null,
        DATABASE    : null,
        FISIK       : null
    }
    let tanggalPencatatan:any
    let totalSelisih:number = 0

    onMount(async () => {
        loadStocks()
    })

    async function loadStocks(){
        const getServer = await fetch(globalURL + 'Stok-Opname', {
            method : 'POST',
            headers : { 'Content-Type' : 'application/json' },
            credentials : 'include',
            body: JSON.stringify({
                OUTLET : userResponse.outlet
            })
        })

        masterProduk            = await getServer.json()
    }

    function changeData(){

        let findValue = masterProduk.find(e => e.KODE === currentProducts )
        findValue = findValue

        // @ts-ignore
        itemPlaceholder = {
            KODE        : findValue.KODE,
            NAMA        : findValue.NAMA,
            HARGA       : findValue.HARGA,
            SATUAN      : findValue.SATUAN,
            DATABASE    : findValue.DATABASE,
            FISIK       : findValue.FISIK,
        }
        totalSelisih = 0
    }

    function hitungSelisih(){
        totalSelisih = itemPlaceholder.FISIK - itemPlaceholder.DATABASE
    }

    async function doPost() {
        const postServer = await fetch(globalURL + 'Post-Stok-Opname', {
            method : 'POST',
            headers : { 'Content-Type' : 'application/json' },
            credentials : 'include',
            body : JSON.stringify({
                NIP                 : userResponse.nip ,
                NAMA                : userResponse.name ,
                OUTLET              : userResponse.outlet,
                KODE                : itemPlaceholder.KODE,
                STOK_REAL           : itemPlaceholder.DATABASE,
                STOK_FISIK          : itemPlaceholder.FISIK,
                SELISIH             : totalSelisih,
                KATEGORI            : 'Non Retail',
                TIPE                : 'Stok Opname',
                TANGGAL             : tanggalPencatatan
            })
        })

        const serverData = await postServer.json()

        toast.success(serverData)
        return loadStocks()
    }

</script>

<Toaster />

<div class="row">
    <div class="col-sm-8 col-md-8 col-lg-8">

        <div class="card shadow-sm">
            <div class="card-header">
                <h3 class="card-title fw-bold">Stok Opname</h3>
                <div class="card-toolbar">
                    <button type="button" on:click={doPost} class="btn btn-sm btn-primary">
                        Simpan
                    </button>
                </div>
            </div>
            <div class="card-body">
                
                <div class="row mb-6">
                    <label for="pilihTanggal" class="col-sm-4 col-form-label fw-bold fs-6 required">
                        <span>Pilih Tanggal</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input type="datetime-local" bind:value={tanggalPencatatan} class="form-control" placeholder="Tanggal" required/>
                    </div>
                </div>
        
                <div class="row mb-6">
                    <label for="pilihGudang" class="col-sm-4 col-form-label fw-bold fs-6 required">
                        <span>Gudang</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <select class="form-select" required>
                            <option value="MNJ">Manajemen</option>
                        </select>
                    </div>
                </div>
        
                <div class="row mb-6">
                    <label for="pilihProduk" class="col-sm-4 col-form-label fw-bold fs-6 required">
                        <span>Pilih Produk</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <select bind:value={currentProducts} on:change={changeData} class="form-select" required>
                            <option value="">Pilih Item</option>
                            {#each masterProduk as data }
                                <option value="{ data.KODE }">{ data.KODE } - { data.NAMA }</option>
                            {/each}
                        </select>
                    </div>
                </div>
        
                <div class="separator separator-dashed border-primary my-5"></div>
        
                <div class="row mb-6">
                    <label for="kodeDanNamaItem" class="col-lg-4 col-form-label required fw-bold fs-6">Kode & Nama Item</label>
                    <div class="col-lg-8">
                        <div class="row">
                            <div class="col-lg-6 fv-row">
                                <input type="text" class="form-control form-control-lg form-control-solid form-control-flush mb-3 mb-lg-0" bind:value={itemPlaceholder.KODE} placeholder="Kode Item" readonly/>
                            </div>
                            <div class="col-lg-6 fv-row">
                                <input type="text" class="form-control form-control-lg form-control-solid form-control-flush" bind:value={itemPlaceholder.NAMA} placeholder="Nama Item" readonly/>
                            </div>
                        </div>
                    </div>
                </div>
        
                <div class="row mb-6">
                    <label for="kodeDanNamaItem" class="col-lg-4 col-form-label required fw-bold fs-6">Harga & Satuan</label>
                    <div class="col-lg-8">
                        <div class="row">
                            <div class="col-lg-6 fv-row">
                                <input type="text" class="form-control form-control-lg form-control-solid form-control-flush mb-3 mb-lg-0" bind:value={itemPlaceholder.HARGA} placeholder="Rp.0 " readonly/>
                            </div>
                            <div class="col-lg-6 fv-row">
                                <input type="text" class="form-control form-control-lg form-control-solid form-control-flush" bind:value={itemPlaceholder.SATUAN} placeholder="Satuan Item" readonly/>
                            </div>
                        </div>
                    </div>
                </div>
        
            </div>
        </div>

    </div>
    <div class="col-sm-4 col-md-4 col-lg-4">

        <div class="card shadow-sm">
            <div class="card-header">
                <h3 class="card-title fw-bold">Realisasi Stok</h3>
            </div>
            <div class="card-body">
                
                <div class="row mb-6">
                    <label for="diDatabase" class="col-sm-4 col-form-label fw-bold fs-6 ">
                        <span>Database</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input type="number" class="form-control" on:keydown={hitungSelisih} bind:value={itemPlaceholder.DATABASE} placeholder="-" min="0" max="99999" required/>
                    </div>
                </div>

                <div class="row mb-6">
                    <label for="stokFisik" class="col-sm-4 col-form-label fw-bold fs-6 ">
                        <span>Stok Fisik</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input type="number" class="form-control" on:keydown={hitungSelisih} bind:value={itemPlaceholder.FISIK} placeholder="-" min="0" max="99999" required/>
                    </div>
                </div>

                <div class="separator border-dark my-3"></div>

                <div class="row mt-6">
                    <label for="selisihData" class="col-sm-4 col-form-label fw-bold fs-6 ">
                        <span>Selisih</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input type="number" class="form-control form-control-flush" placeholder="-" min="0" max="99999" bind:value={totalSelisih} required readonly/>
                    </div>
                </div>

            </div>
        </div>

    </div>
</div>

