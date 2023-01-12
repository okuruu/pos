<script lang="ts">
    function runRepeater(){

        let kodeNama    = ['Kode Akun','Keterangan','Nominal']
        let inputNama   = ['KODE[]','KETERANGAN[]','NOMINAL[]']
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
            }

            div.appendChild(inputData)
            container.appendChild(div)

        }

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

        console.log({
            KODE        : listKode,
            KETERANGAN  : listKeterangan,
            NOMINAL     : listNominal
        })

    }

</script>

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
                        <th>Keterangan</th>
                        <th>Kode Akun</th>
                        <th>Nama Akun</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>                                
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
                        <select class="form-select form-select-sm">
                            <option value="">Pilih Akun</option>
                            <option value="Kas Kecil">Kas Kecil</option>
                            <option value="Kas Manajemen">Kas Manajemen</option>
                        </select>
                    </div>
                </div>

                <div class="row mb-4">
                    <label for="setTanggal" class="col-sm-4 col-form-label fw-bold fs-6 required">
                        <span>Atur Tanggal</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input type="date" class="form-control form-control-sm" />
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