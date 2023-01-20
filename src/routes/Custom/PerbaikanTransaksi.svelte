<script lang="ts">
    import { onMount } from "svelte";
    import { globalURL } from "../../lib/mainLink";
    import toast, { Toaster } from 'svelte-french-toast';
    import { currencyFormat } from "../../lib/currencyFormatter";

    let uniqueCode:string

    // Stok Outlet
    let stokOutlet:string[]         = []

    let currentDate:string          = 'Fetching..'
    let transaksiLama
    let dataRekap                   = []
    let dataDetail                  = []
    let noTransaksiDetail:string    = 'Memuat..'
    let totalTransaksi:number       = 0
    let totalBayar:number           = 0
    let totalKembalian:number       = 0

    // Perbaikan Transaksi
    let tipeKesalahan:string
    let kategoriKesalahan:string
    let treatmentDilakukan:string
    let additionalInformation:string

    // Variabel untuk menambahkan item baru ke detail transaksi
    let kodeBaru:number
    let jumlahBaru:number

    onMount( async () => {
        fetchCustomData()
    })

    async function fetchCustomData(){
        const serverData = await fetch( globalURL + 'Data-Rekap', {
            method: 'POST',
            credentials: 'include',
        })
        const serverResponse    = await serverData.json()
        currentDate             = serverResponse.tanggal
        dataRekap               = serverResponse.data
        totalTransaksi          = serverResponse.totalTransaksi
        totalBayar              = serverResponse.totalBayar
        totalKembalian          = serverResponse.totalKembalian
    }

    async function fetchProdukOutlet(){
        const serverData        = await fetch(globalURL + 'Stok-Outlet', {
            method : 'GET',
            credentials : 'include',
        })
        stokOutlet    = await serverData.json()
    }

    async function checkDetail(KODE){

        fetchProdukOutlet()

        const getDetail = await fetch(globalURL + 'Data-Detail', {
            method: 'POST',
            headers : { 'Content-Type' : 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                KODE: KODE
            })
        })

        const detailResponse    = await getDetail.json()
        dataDetail              = detailResponse.DETAIL
        noTransaksiDetail       = detailResponse.KODE
        uniqueCode              = detailResponse.UNIQUE
        return dataDetail
    }

    async function lihatTransaksiLama(eventForm){

        const dayReport = await fetch(globalURL + 'Data-Rekap', {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                TANGGAL : transaksiLama
            })
        })
        const dayReportResponse = await dayReport.json()

        currentDate             = dayReportResponse.tanggal
        dataRekap               = dayReportResponse.data
        totalTransaksi          = dayReportResponse.totalTransaksi
        totalBayar              = dayReportResponse.totalBayar
        totalKembalian          = dayReportResponse.totalKembalian

        return toast.success("Berhasil mendapatkan data!")
    }

    function tambahkanItemBaru(){
        if( kodeBaru == null || jumlahBaru == undefined ){
            return toast.error("Harap memilih item dan mengisi jumlah terlebih dahulu!")
        }

        let findValue = stokOutlet.find(e => e.KODE === kodeBaru )

        dataDetail = [...dataDetail, {
            KODE_ITEM   : findValue.KODE,
            NAMA_ITEM   : findValue.NAMA,
            HARGA       : findValue.HARGA,
            SATUAN      : findValue.SATUAN,
            JUMLAH      : jumlahBaru,
            TOTAL_HARGA : findValue.HARGA * jumlahBaru
        }]

        dataDetail = dataDetail

        toast.success("Berhasil menambahkan item")

    }

    async function doPost(event){

        var inputJumlahTransaksi    = document.getElementsByName('jumlahTransaksi[]')
        var inputHapusItem          = document.getElementsByName('hapusItem[]')
        var inputKode               = document.getElementsByName('kodeItem[]')

        let listKodeItem    = []
        let listJumlah      = []
        let listHapus       = []

        for(let i = 0 ; i < inputJumlahTransaksi.length ; i++){
            var totalKode   = inputKode[i].value
            var totalJumlah = inputJumlahTransaksi[i].value
            var totalHapus  = inputHapusItem[i].checked

            listJumlah.push(totalJumlah)
            listJumlah = listJumlah

            listHapus.push(totalHapus)
            listHapus = listHapus

            listKodeItem.push(totalKode)
            listKodeItem = listKodeItem
        }

        const willPost      = await fetch(globalURL + 'Post-Perbaikan-Transaksi', {
            method : 'POST',
            headers : { 'Content-Type' : 'application/json' },
            credentials : 'include',
            body: JSON.stringify({
                KODE                : uniqueCode,
                TIPE_KESALAHAN      : tipeKesalahan,
                KATEGORI_KESALAHAN  : kategoriKesalahan,
                TREATMENT_DILAKUKAN : treatmentDilakukan,
                KETERANGAN          : additionalInformation,
                DETAIL              : {
                    KODE    : listKodeItem,
                    JUMLAH  : listJumlah,
                    DIHAPUS : listHapus
                }
            })
        })
        const postResponse  = await willPost.json()
        event.target.reset()
        toast.success(postResponse)
    }

</script>

<Toaster />

<div class="card shadow-sm my-7">
    <div class="card-header">
        <h3 class="card-title fw-bold">Perbaikan Transaksi  - <span class="text-danger px-2"> { currentDate } </span> </h3>
        <div class="card-toolbar">
            <form on:submit|preventDefault={lihatTransaksiLama}>
                <div class="row">
                    <div class="col">
                        <input type="date" bind:value={transaksiLama} required class="form-control form-control-sm" />
                    </div>
                    <div class="col">
                        <button type="submit" class="btn btn-sm btn-success"><i class="las la-search fs-2 me-2"></i>Lihat</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <div class="card-body">
        
        <div class="table-responsive">
            <table class="table table-row-dashed table-row-gray-300 gy-2 table-hover align-middle text-center">
                <thead>
                    <tr class="fw-bold">
                        <th>#</th>
                        <th>Tanggal Transaksi</th>
                        <th>Atas Nama</th>
                        <th>No. Transaksi</th>
                        <th>Kategori</th>
                        <th>Total Transaksi</th>
                        <th>Total Bayar</th>
                        <th>Kembalian</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {#each dataRekap as data, index }
                        <tr>
                            <td>{ index + 1 }</td>
                            <td>{ data.CREATED_AT } WIB</td>
                            <td>{ data.NAMA }</td>
                            <td>
                                {#if data.STATUS_PERBAIKAN == 'Pending' || data.STATUS_PERBAIKAN == 'Hold'}
                                    <span class="badge badge-warning">{ data.NOMOR_TRANSAKSI }</span>
                                {:else if data.STATUS_PERBAIKAN == 'On Going' }
                                    <span class="badge badge-primary">{ data.NOMOR_TRANSAKSI }</span>
                                {:else if data.STATUS_PERBAIKAN == null }
                                    { data.NOMOR_TRANSAKSI }
                                {:else}
                                    <span class="badge badge-success">{ data.NOMOR_TRANSAKSI }</span>
                                {/if}
                            </td>
                            <td>{ data.KATEGORI }</td>
                            <td>{ currencyFormat.format(data.TOTAL_TRANSAKSI) }</td>
                            <td>{ currencyFormat.format(data.TOTAL_BAYAR) }</td>
                            <td class="text-success" >{ currencyFormat.format(data.KEMBALIAN) }</td>
                            <td><button on:click={ () => checkDetail(data.KODE) } data-bs-toggle="modal" data-bs-target="#modalDetail" type="button" class="btn btn-sm btn-primary">Lihat</button></td>
                        </tr>
                    {/each}
                        <tr>
                            <td class="fw-bolder" colspan="5">Total</td>
                            <td class="fw-bolder" >{ currencyFormat.format(totalTransaksi) }</td>
                            <td class="fw-bolder" >{ currencyFormat.format(totalBayar) }</td>
                            <td class="fw-bolder" >{ currencyFormat.format(totalKembalian) }</td>
                        </tr>
                </tbody>
            </table>
        </div>

    </div>
</div>

<!-- Modal Page -->
<form on:submit|preventDefault={doPost}>
    <div class="modal fade" tabindex="-1" id="modalDetail">
        <div class="modal-dialog modal-xl modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">{noTransaksiDetail }</h3>
                    <div class="btn btn-icon btn-sm btn-active-light-primary ms-2" data-bs-dismiss="modal" aria-label="Close">
                        <span class="svg-icon svg-icon-1"></span>
                    </div>
                </div>

                <div class="modal-body">

                    <div class="row my-4">
                        <div class="col-md-4 fv-row">
                            <label for="tambahkanItemBaru" class="d-flex align-items-center mb-2">
                                <span class="text-gray-700 fs-6 fw-bolder required">Tambahkan Item</span>
                            </label>
                            <select bind:value={kodeBaru} class="form-select form-select-sm">
                                <option value="">Pilih Item</option>
                                {#each stokOutlet as stocks }
                                    <option value="{stocks.KODE}">{stocks.KODE} - {stocks.NAMA}</option>
                                {/each}
                            </select>
                        </div>
                        <div class="col-md-2 fv-row">
                            <label for="tambahkanItemBaru" class="d-flex align-items-center mb-2">
                                <span class="text-gray-700 fs-6 fw-bolder required">Jumlah Item</span>
                            </label>
                            <input bind:value={jumlahBaru} type="number" class="form-control form-control-sm" placeholder="Jumlah Item" />
                        </div>
                        <div class="col-md-4 fv-row">
                            <label for="tambahkanItemBaru" class="d-flex align-items-center mb-2">
                                <span class="text-gray-700 fs-6 fw-bolder required">Tambahkan</span>
                            </label>
                            <button type="button" on:click={tambahkanItemBaru} class="btn btn-sm btn-primary"><i class="las la-plus-circle fs-2 me-2"></i>Tambahkan</button>
                        </div>
                    </div>
                    
                    <div class="separator my-4"></div>
                    
                    <div class="table-responsive">
                        <table class="table table-row-dashed table-row-gray-300 gy-2 table-hover align-middle text-center">
                            <thead>
                                <tr class="fw-bold">
                                    <th>Kode Item</th>
                                    <th>Nama</th>
                                    <th>Satuan</th>
                                    <th>Harga</th>
                                    <th>Jumlah</th>
                                    <th>Total Harga</th>
                                    <th>Hapus Item</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each dataDetail as data }
                                    <tr>
                                        <td>
                                            { data.KODE_ITEM }
                                            <input name="kodeItem[]" type="number" value="{ data.KODE_ITEM }" readonly hidden />
                                        </td>
                                        <td>{ data.NAMA_ITEM }</td>
                                        <td>{ data.SATUAN }</td>
                                        <td>{ currencyFormat.format(data.HARGA) }</td>
                                        <td class="w-25">
                                            <input name="jumlahTransaksi[]" type="number" class="form-control form-control-sm" value="{ data.JUMLAH }" />
                                        </td>
                                        <td>{ currencyFormat.format(data.TOTAL_HARGA) }</td>
                                        <td>
                                            <input name="hapusItem[]" type="checkbox" />
                                        </td>
                                    </tr>                                
                                {/each}
                            </tbody>
                        </table>
                    </div>

                    <div class="separator separator-content border-dark my-15"><span class="w-250px fw-bold">Form Perbaikan Transaksi</span></div>

                    <div class="row">
                        <div class="col-md-4 fv-row">
                            <label for="kesalahanLuarOutlet" class="d-flex align-items-center mb-2">
                                <span class="text-gray-700 fs-6 fw-bolder required">Kesalahan Di Luar Outlet</span>
                            </label>
                            <select name="tipeKesalahan" bind:value={tipeKesalahan} class="form-select form-select-sm">
                                <option value="">Pilih Jenis Kesalahan</option>
                                <option value="Surat Jalan Outlet Lain">Karena Kesalahan Surat Jalan Outlet Lain</option>
                                <option value="Permintaan Customer">Karena Permintaan Customer</option>
                                <option value="Permintaan CS">Karena Permintaan CS</option>
                            </select>
                        </div>
                        <div class="col-md-4 fv-row">
                            <label for="kategoriKesalahan" class="mb-2">
                                <span class="text-gray-700 fs-6 fw-bolder">Kategori Kesalahan</span>
                            </label>
                            <select name="kategoriKesalahan" bind:value={kategoriKesalahan} class="form-select form-select-sm">
                                <option value="">Pilih Kategori Kesalahan</option>
                                <option value="Data Input Item Masuk / Daftar Pembelian">Data Input Item Masuk / Daftar Pembelian</option>
                                <option value="Data Input Item Keluar">Data Input Item Keluar</option>
                                <option value="Keterangan">Keterangan</option>
                                <option value="Ganti Tanggal">Ganti Tanggal</option>
                                <option value="Input Penjualan">Input Penjualan</option>
                                <option value="Input Kas Keluar">Input Kas Keluar</option>
                                <option value="Input Kas Masuk">Input Kas Masuk</option>
                                <option value="Input Kas Transfer">Input Kas Transfer</option>
                                <option value="Hapus Pesanan/Pembatalan Pesanan">Hapus Pesanan/Pembatalan Pesanan</option>
                                <option value="Edit Item Pesanan">Edit Item Pesanan</option>
                                <option value="Input Deposit">Input Deposit</option>
                                <option value="Salah Akun Kas/EDC Pada Transaksi/Deposit">Salah Akun Kas/EDC Pada Transaksi/Deposit</option>
                                <option value="Input Pelanggan">Input Pelanggan</option>
                            </select>
                        </div>
                        <div class="col-md-4 fv-row">
                            <label for="treatmentDilakukan" class="mb-2">
                                <span class="text-gray-700 fs-6 fw-bolder">Treatment Dilakukan</span>
                            </label>
                            <select name="treatmentDilakukan" bind:value={treatmentDilakukan} class="form-select form-select-sm">
                                <option value="">Pilih Jenis Treatment</option>
                                <option value="Belum Ada">Belum Ada</option>
                                <option value="Saya Telah Membuat Stok Miss / Selisih Kas Keluar atau Kas Masuk/ Transaksi Baru">Saya Telah Membuat Stok Miss / Selisih Kas Keluar atau Kas Masuk/ Transaksi Baru</option>
                                <option value="Telah Ter Opname Oleh Auditor">Telah Ter Opname Oleh Auditor</option>
                            </select>
                        </div>
                    </div>

                    <div class="d-flex flex-column mb-3 mt-5">
                        <label for="deskripsiPerbaikan" class="mb-2">
                            <span class="text-gray-700 fs-6 fw-bolder required">Deskripsi Perbaikan</span>
                        </label>
                        <div class="fv-row">
                            <textarea name="deskripsiPerbaikan" bind:value={additionalInformation} class="form-control mb-3" rows="6" placeholder="Jelaskan perbaikan yang anda inginkan" ></textarea>
                        </div>
                    </div>

                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">Tutup</button>
                    <button type="submit" class="btn btn-primary">Ajukan Perbaikan</button>
                </div>

            </div>
        </div>
    </div>
</form>