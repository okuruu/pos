<script lang="ts">
    import { onMount } from "svelte";
    import toast from "svelte-french-toast";
    import { userResponse } from "../../lib/activeUser";
    import { currencyFormat } from "../../lib/currencyFormatter";
    import { globalURL } from "../../lib/mainLink";

    let currentDate:string      = 'Fetching..'
    let transaksiLama
    let dataRekap               = []
    let dataDetail              = []
    let totalTransaksi:number   = 0
    let totalBayar:number       = 0
    let totalKembalian:number   = 0

    onMount( async () => {
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
    })

    async function checkDetail(KODE){

        const getDetail = await fetch(globalURL + 'Data-Detail', {
            method: 'POST',
            headers : { 'Content-Type' : 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                KODE: KODE
            })
        })

        dataDetail              = await getDetail.json()
        return dataDetail
    }

    async function lihatTransaksiLama(eventForm){

        const dayReport = await fetch(globalURL + 'Data-Rekap', {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                NIP : userResponse.nip,
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

</script>

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
                        <button type="submit" class="btn btn-sm btn-success">Lihat Transaksi</button>
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
                            <td>{ data.NOMOR_TRANSAKSI }</td>
                            <td>{ data.KATEGORI }</td>
                            <td>{ currencyFormat.format(data.TOTAL_TRANSAKSI) }</td>
                            <td>{ currencyFormat.format(data.TOTAL_BAYAR) }</td>
                            <td class="text-success" >{ currencyFormat.format(data.KEMBALIAN) }</td>
                            <td><button on:click={ () => checkDetail(data.KODE) } data-bs-toggle="modal" data-bs-target="#modalDetail" type="button" class="btn btn-sm btn-primary">Lihat</button></td>
                        </tr>
                    {/each}
                        <tr>
                            <td class="fw-bolder"  colspan="4">Total</td>
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

<div class="modal fade" tabindex="-1" id="modalDetail">
    <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Modal title</h3>

                <!--begin::Close-->
                <div class="btn btn-icon btn-sm btn-active-light-primary ms-2" data-bs-dismiss="modal" aria-label="Close">
                    <span class="svg-icon svg-icon-1"></span>
                </div>
                <!--end::Close-->
            </div>

            <div class="modal-body">
                
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
                            </tr>
                        </thead>
                        <tbody>
                            {#each dataDetail as data }
                                <tr>
                                    <td>{ data.KODE_ITEM }</td>
                                    <td>{ data.NAMA_ITEM }</td>
                                    <td>{ data.SATUAN }</td>
                                    <td>{ currencyFormat.format(data.HARGA) }</td>
                                    <td>{ data.JUMLAH }</td>
                                    <td>{ currencyFormat.format(data.TOTAL_HARGA) }</td>
                                </tr>                                
                            {/each}
                        </tbody>
                    </table>
                </div>

                <div class="separator separator-content border-dark my-15"><span class="w-250px fw-bold">Form Perbaikan Transaksi</span></div>

                <div class="row">
                    <div class="col-md-6 fv-row">
                        <label for="jenisPerbaikan" class="mb-2">
                            <span class="text-gray-700 fs-6 fw-bolder">Jenis Perbaikan</span>
                        </label>
                        <select class="form-select form-select-sm" required>
                            <option value="">Pilih Jenis Perbaikan</option>
                            <option value="Persediaan">Persediaan</option>
                            <option value="Penjualan">Penjualan</option>
                            <option value="Keuangan">Keuangan</option>
                        </select>
                    </div>
                    <div class="col-md-6 fv-row">
                        <label for="kesalahanLuarOutlet" class="d-flex align-items-center mb-2">
                        <span class="text-gray-700 fs-6 fw-bolder required">Kesalahan Di Luar Outlet</span>
                            <i class="fas fa-exclamation-circle ms-2 fs-7" data-bs-toggle="tooltip" title="Kesalahan yang terjadi bukan karena pihak outlet"></i>
                        </label>
                        <select class="form-select form-select-sm">
                            <option value="">Pilih Jenis Kesalahan</option>
                            <option value="Surat Jalan Outlet Lain">Karena kesalahan surat jalan outlet lain</option>
                            <option value="Permintaan Customer">Karena permintaan customer</option>
                            <option value="Permintaan CS">Karena permintaan CS</option>
                        </select>
                    </div>
                </div>

                <div class="row mt-5">
                    <div class="col-md-6 fv-row">
                        <label for="kategoriKesalahan" class="mb-2">
                            <span class="text-gray-700 fs-6 fw-bolder">Kategori Kesalahan</span>
                        </label>
                        <select class="form-select form-select-sm">
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
                    <div class="col-md-6 fv-row">
                        <label for="treatmentDilakukan" class="mb-2">
                            <span class="text-gray-700 fs-6 fw-bolder">Treatment Dilakukan</span>
                        </label>
                        <select class="form-select form-select-sm">
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
                        <textarea class="form-control mb-3" rows="6" placeholder="Jelaskan perbaikan yang anda inginkan" ></textarea>
                    </div>
                </div>

            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Save changes</button>
            </div>
        </div>
    </div>
</div>