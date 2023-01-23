<script lang="ts">
    import { onMount } from "svelte";
    import { globalURL } from "../../lib/mainLink";
    import toast, { Toaster } from 'svelte-french-toast';
    import { currencyFormat } from "../../lib/currencyFormatter";

    let pilihAkun:string
    let pilihTanggal:any

    let listItemKeluar:string[] = []
    let listAkun:string[]       = []

    onMount(async () => {
        getData()
    })

    async function getData(){
        const getData = await fetch(globalURL + 'Kas-Keluar', {
            method : 'GET',
            credentials: 'include'
        })

        const getResponse = await getData.json()
        listAkun        = getResponse.OPSI
        listItemKeluar  = getResponse.DETAIL
    }

    function runRepeater(){
        let kodeNama    = ['Judul','buktiUpload','Nominal']
        let inputNama   = ['JUDUL[]','BUKTI[]','NOMINAL[]']
        var container   = document.getElementById('itemPlaceholder')

        for(let i = 0 ; i < kodeNama.length ; i++){
            var div         = document.createElement('div')
            div.setAttribute('class','col-md-4')

            var inputData = document.createElement('input')
                inputData.setAttribute('class','form-control form-control-sm mb-3')
                inputData.setAttribute('placeholder',kodeNama[i])
                inputData.setAttribute('name',inputNama[i])

            if(kodeNama[i] == 'Nominal'){
                inputData.setAttribute('inputMode','decimal')
                inputData.setAttribute('onFocus',"this.type='number'; this.value=this.lastValue")
                inputData.setAttribute('onBlur',"this.type=''; this.lastValue=this.value; this.value=this.value==''?'':(+this.value).toLocaleString()")
            } else if(kodeNama[i] == 'buktiUpload'){
                var inputData = document.createElement('input')
                inputData.setAttribute('type','file')
                inputData.setAttribute('class','form-control form-control-sm mb-3')
                inputData.setAttribute('placeholder',kodeNama[i])
                inputData.setAttribute('name',inputNama[i])                    
            }

            div.appendChild(inputData)
            container.appendChild(div)
        }
    }

    function clearAll(){
        pilihAkun       = null 
        pilihTanggal    = null
    }

    async function doPost(){
        var inputJudul      = document.getElementsByName('JUDUL[]')
        var inputBukti      = document.getElementsByName('BUKTI[]')
        var inputNominal    = document.getElementsByName('NOMINAL[]')

        let listJudul       = []
        let listBukti       = []
        let listNominal     = []

        var formFile = new FormData()
        formFile.append("AKUN",pilihAkun)
        formFile.append("TANGGAL",pilihTanggal)

        for(let i = 0 ; i < inputJudul.length; i++){
            var totalJudul      = inputJudul[i].value
            var totalBukti      = inputBukti[i].files[0]
            var totalNominal    = inputNominal[i].value
            
            listJudul.push(totalJudul)
            listJudul = listJudul

            listBukti.push(totalBukti)
            listBukti = listBukti

            listNominal.push(totalNominal)
            listNominal = listNominal

            formFile.append('JUDUL[]', totalJudul)
            formFile.append('BUKTI[]', totalBukti)
            formFile.append('NOMINAL[]', totalNominal)

        }

        const postData = await fetch(globalURL + 'Kas-Keluar', {
            method: 'POST',
            credentials: 'include',
            body : formFile
        })

        const respo = await postData.json()
        toast.success(respo)
        getData()
    }

</script>

<Toaster />

<div class="card card-flush shadow-sm mb-7">
    <div class="card-header">
        <h3 class="card-title fw-bold">Kas Keluar</h3>
        <div class="card-toolbar">
            <button type="button" class="btn btn-sm btn-light">
                Action
            </button>
        </div>
    </div>
    <div class="card-body py-5">
        
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
                <button type="button" class="btn btn-sm btn-primary mt-8"><i class="las la-search fs-2 me-2"></i>Cari Kas Keluar</button>
            </div>
        </div>

        <div class="table-responsive my-7">
            <table class="table table-row-dashed table-row-gray-300 gy-2 table-hover align-middle text-center text-dark">
                <thead>
                    <tr class="fw-bold">
                        <th>No.</th>
                        <th>Tanggal</th>
                        <th>Person in Charge</th>
                        <th>Nama Akun</th>
                        <th>Total</th>
                        <th>Tanggal Dibuat</th>
                    </tr>
                </thead>
                <tbody>
                    {#each listItemKeluar as data, index }
                    <tr>
                        <td>{ index + 1 }</td>
                        <td>{ data.TANGGAL }</td>
                        <td>{ data.NAMA }</td>
                        <td>{ data.MASUK_AKUN }</td>
                        <td>{ currencyFormat.format(data.NOMINAL) }</td>
                        <td>{ data.CREATED_AT }</td>
                    </tr>
                    {/each}
                </tbody>
            </table>
        </div>

    </div>
    <div class="card-footer">
        <div class="me-2">
            <button type="button" class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#tambahKasKeluar"><i class="las la-plus-circle fs-2 me-2"></i>Tambah</button>
            <button type="button" class="btn btn-sm btn-info"><i class="las la-edit fs-2 me-2"></i>Edit</button>
            <button type="button" class="btn btn-sm btn-danger"><i class="las la-trash fs-2 me-2"></i>Hapus</button>
        </div>
    </div>
</div>

<!-- Kas Keluar -->
<div class="modal fade" tabindex="-1" id="tambahKasKeluar">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Tambah Kas Keluar</h3>
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
                        <select bind:value={pilihAkun} class="form-select form-select-sm">
                            <option value="">Pilih Akun</option>
                            {#each listAkun as akun}
                                <option value="{akun.KODE}">{ akun.KETERANGAN }</option>
                            {/each}
                        </select>
                    </div>
                </div>

                <div class="row mb-4">
                    <label for="setTanggal" class="col-sm-4 col-form-label fw-bold fs-6 required">
                        <span>Atur Tanggal</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input bind:value={pilihTanggal} type="date" class="form-control form-control-sm" />
                    </div>
                </div>

                <div class="separator separator-dashed border-primary my-5"></div>

                <div class="table-responsive my-7">
                    <table class="table table-row-dashed table-row-gray-300 gy-2 table-hover align-middle text-center text-dark">
                        <thead>
                            <tr class="fw-bold">
                                <th>Judul Pengeluaran</th>
                                <th>Bukti Pengeluaran</th>
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
                <button type="button" on:click={clearAll} class="btn btn-sm btn-light" data-bs-dismiss="modal">Tutup</button>
            </div>
        </div>
    </div>
</div>