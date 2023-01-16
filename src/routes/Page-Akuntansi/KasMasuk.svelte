<script lang="ts">
    import { onMount } from "svelte";
    import { globalURL } from "../../lib/mainLink";
    import toast, { Toaster } from 'svelte-french-toast';
    import { currencyFormat } from "../../lib/currencyFormatter";

    let mainTable               = []

    let listAkun:string[]       = []
    let listNominal:number
    let currentKode:string
    let currentNominal          = 0
    let tanggalKasMasuk

    let masukKeAkun = []
    let ketKeAkun   = []

    onMount(async () => {
        const getData = await fetch(globalURL + 'Saldo', {
            method : 'GET',
            credentials: 'include'
        })

        const getResponse = await getData.json()

        mainTable   = getResponse.DETAIL
        listAkun    = getResponse.OPSI

        listAkun.forEach(data => {
            masukKeAkun.push(data.KODE)
            ketKeAkun.push(data.KETERANGAN)
        });

        masukKeAkun = masukKeAkun
        ketKeAkun   = ketKeAkun

    })

    function runRepeater(){

        var container   = document.getElementById('itemPlaceholder')

        // Kode
        var div         = document.createElement('div')
        div.setAttribute('class','col-md-4')

        var selectData = document.createElement('select')
        selectData.setAttribute('name','KODE[]')
        selectData.setAttribute('class','form-select form-select-sm')
        
        for(let optionContent = 0; optionContent < masukKeAkun.length; optionContent++ ){
            var option = document.createElement('option')
            option.value    = masukKeAkun[optionContent]
            option.text     = ketKeAkun[optionContent]
            selectData.appendChild(option)
        }
        
        div.appendChild(selectData)
        container.appendChild(div)
   
        // Keterangan
        var div         = document.createElement('div')
        div.setAttribute('class','col-md-4')
        
        var inputKeterangan = document.createElement('input')
        inputKeterangan.setAttribute('class','form-control form-control-sm mb-3')
        inputKeterangan.setAttribute('placeholder','Keterangan')
        inputKeterangan.setAttribute('name','KETERANGAN[]')
        
        div.appendChild(inputKeterangan)
        container.appendChild(div)
        
        // Nominal
        var div         = document.createElement('div')
        div.setAttribute('class','col-md-4')

        var inputNominal = document.createElement('input')
        inputNominal.setAttribute('inputMode','decimal')
        inputNominal.setAttribute('name','NOMINAL[]')
        inputNominal.setAttribute('class','form-control form-control-sm mb-3')
        inputNominal.setAttribute('onFocus',"this.type='number'; this.value=this.lastValue")
        inputNominal.setAttribute('onBlur',"this.type=''; this.lastValue=this.value; this.value=this.value==''?'':(+this.value).toLocaleString()")
        
        div.appendChild(inputNominal)
        container.appendChild(div)

    }

    function changeAkun(){
        let findValue   = listAkun.find( e => e.KODE === listNominal )
        currentNominal  = findValue.NOMINAL
        currentKode     = findValue.KODE
    }

    async function doPost() {
        
        var inputKode       = document.getElementsByName('KODE[]')
        var inputKeterangan = document.getElementsByName('KETERANGAN[]')
        var inputNominal    = document.getElementsByName('NOMINAL[]')

        let listKode        = []
        let listKeterangan  = []
        let listNominal     = []

        for(let i = 0; i < inputKode.length ; i++){
            var totalKode           = inputKode[i].value
            var totalKeterangan     = inputKeterangan[i].value
            var totalNominal        = inputNominal[i].value

            listKode.push(totalKode)
            listKode        = listKode

            listKeterangan.push(totalKeterangan)
            listKeterangan  = listKeterangan

            listNominal.push(totalNominal)
            listNominal     = listNominal

        }

        const postServer = await fetch(globalURL + 'Saldo', {
            method: 'POST',
            headers : { 'Content-Type' : 'application/json' },
            credentials : 'include',
            body: JSON.stringify({
                MASUK_AKUN          : currentKode,
                TANGGAL             : tanggalKasMasuk,
                INPUT_KODE          : listKode,
                INPUT_NOMINAL       : listNominal,
                INPUT_KETERANGAN    : listKeterangan,
            })
        })

        toast.success("Berhasil menyimpan data")

    }

</script>

<Toaster />

<div class="card card-flush shadow-sm mb-7">
    <div class="card-header">
        <h3 class="card-title fw-bold">Kas Masuk</h3>
        <div class="card-toolbar">
            <button type="button" class="btn btn-sm btn-light">
                Action
            </button>
        </div>
    </div>
    <div class="card-body">
        
        <div class="row">
            <div class="col-md-3 fv-row">
                <label for="pencarianKasMasuk" class="d-flex align-items-center mb-2">
                    <span class="fs-6 fw-bolder">Pencarian</span>
                </label>
                <input type="text" placeholder="Kata kunci pencarian" class="form-control form-control-sm" />
            </div>

            <div class="col-md-2 fv-row">
                <label for="pencarianKasMasuk" class="d-flex align-items-center mb-2">
                    <span class="fs-6 fw-bolder">Periode s/d</span>
                </label>
                <input type="date" class="form-control form-control-sm" />
            </div>

            <div class="col-md-2 fv-row">
                <label for="pencarianKasMasuk" class="d-flex align-items-center mb-2">
                    <span class="fs-6 fw-bolder">Periode s/d</span>
                </label>
                <input type="date" class="form-control form-control-sm" />
            </div>

            <div class="col-md-2 fv-row">
                <button type="button" class="btn btn-sm btn-primary mt-8"><i class="las la-search fs-2 me-2"></i>Cari Kas Masuk</button>
            </div>
        </div>

        <div class="table-responsive my-7">
            <table class="table table-row-dashed table-row-gray-300 gy-2 table-hover align-middle text-center text-dark">
                <thead>
                    <tr class="fw-bold">
                        <th>No Transaksi</th>
                        <th>Tanggal</th>
                        <th>Diupdate Oleh</th>
                        <th>Kode Akun</th>
                        <th>Nama Akun</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {#each mainTable as data }
                        <tr>
                            <td>{ data.ID }</td>
                            <td>{ data.CREATED_AT }</td>
                            <td>{ data.LAST_RESPONSIBLE }</td>
                            <td>-</td>
                            <td>{ data.KETERANGAN }</td>
                            <td>{ currencyFormat.format(data.NOMINAL) }</td>
                        </tr>                                
                    {/each}
                </tbody>
            </table>
        </div>

    </div>
    <div class="card-footer">
        <div class="me-2">
            <button type="button" class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#tambahKasMasuk"><i class="las la-plus-circle fs-2 me-2"></i>Tambah</button>
            <button type="button" class="btn btn-sm btn-info"><i class="las la-edit fs-2 me-2"></i>Edit</button>
            <button type="button" class="btn btn-sm btn-danger"><i class="las la-trash fs-2 me-2"></i>Hapus</button>
        </div>
    </div>
</div>

<!-- Kas Masuk -->
<div class="modal fade" tabindex="-1" id="tambahKasMasuk">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Tambah Kas Masuk</h3>
                <div class="btn btn-icon btn-sm btn-active-light-primary ms-2" data-bs-dismiss="modal" aria-label="Close">
                    <span class="svg-icon svg-icon-1"></span>
                </div>
            </div>

            <div class="modal-body">
                
                <div class="row mb-4">
                    <label for="masukKeAkun" class="col-sm-4 col-form-label fw-bold fs-6 required">
                        <span>Masuk ke Akun</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <select bind:value={listNominal} on:change={changeAkun} class="form-select form-select-sm">
                            <option value="">Pilih Akun</option>
                            {#each listAkun as akun}
                                <option value="{akun.KODE}">{ akun.KETERANGAN }</option>
                            {/each}
                        </select>
                    </div>
                </div>

                <div class="row mb-4">
                    <label for="setTanggal" class="col-sm-4 col-form-label fw-bold fs-6 ">
                        <span></span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input type="text" class="form-control form-control-sm form-control-flush" placeholder="Rp. 0" readonly value={ currencyFormat.format(currentNominal) } />
                    </div>
                </div>

                <div class="row mb-4">
                    <label for="setTanggal" class="col-sm-4 col-form-label fw-bold fs-6 required">
                        <span>Atur Tanggal</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input type="date" class="form-control form-control-sm" bind:value={tanggalKasMasuk} />
                    </div>
                </div>

                <div class="separator separator-dashed border-primary my-5"></div>

                <div class="table-responsive my-7">
                    <table class="table table-row-dashed table-row-gray-300 gy-2 table-hover align-middle text-center text-dark">
                        <thead>
                            <tr class="fw-bold">
                                <th>Kode Akun</th>
                                <th>Keterangan</th>
                                <th>Nominal</th>
                            </tr>
                        </thead>
                    </table>
                </div>

                <div id="itemPlaceholder" class="row"></div>

                <button type="button" on:click={runRepeater} class="btn btn-sm btn-primary"><i class="las la-plus-circle fs-2 me-2"></i>Tambah Data</button>

            </div>

            <div class="modal-footer">
                <button type="submit" on:click={doPost} class="btn btn-sm btn-primary"><i class="las la-save fs-2 me-2"></i>Simpan</button>
                <button type="button" class="btn btn-sm btn-light" data-bs-dismiss="modal">Tutup</button>
            </div>
        </div>
    </div>
</div>