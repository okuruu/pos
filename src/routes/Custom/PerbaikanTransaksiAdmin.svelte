<script lang="ts">
    import { onMount } from "svelte";
    import { globalURL } from "../../lib/mainLink";
    import toast, { Toaster } from 'svelte-french-toast';
    import { currencyFormat } from "../../lib/currencyFormatter";

    let uniqueCode:string
    let personInCharge:string       = 'Memuat..'

    let data:string[] = []
    let dataDetail                  = []
    let noTransaksiDetail:string    = 'Memuat..'
    let requestPerbaikan:string[]   = []
    let totalPerbaikan:string       = currencyFormat.format(0)

    // Perbaikan Transaksi
    let tipeKesalahan:string
    let kategoriKesalahan:string
    let treatmentDilakukan:string
    let additionalInformation:string

    // Perbaikan Transaksi Admin Post!
    let statusPerbaikan:string
    let catatanAdministrator:string  = null

    onMount(async () => {
        const getData       = await fetch(globalURL + 'List-Perbaikan-Transaksi', {
            method: 'GET',
            credentials: 'include'
        })
        const getResponse   = await getData.json()
        data                = getResponse.data
        totalPerbaikan      = getResponse.totalPerbaikan
    })

    async function checkDetail(KODE){

        const getDetail = await fetch(globalURL + 'Detail-Perbaikan-Transaksi', {
            method: 'POST',
            headers : { 'Content-Type' : 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                KODE: KODE
            })
        })

        const detailResponse    = await getDetail.json()

        personInCharge          = detailResponse.PIC
        dataDetail              = detailResponse.DETAIL
        noTransaksiDetail       = detailResponse.KODE
        uniqueCode              = detailResponse.UNIQUE
        tipeKesalahan           = detailResponse.PERBAIKAN.TIPE
        kategoriKesalahan       = detailResponse.PERBAIKAN.KATEGORI
        treatmentDilakukan      = detailResponse.PERBAIKAN.TREATMENT
        additionalInformation   = detailResponse.PERBAIKAN.KETERANGAN
        requestPerbaikan        = detailResponse.REQUEST

        return dataDetail
    }

    async function doPost(event) {
        
        const postData      = await fetch(globalURL + 'Admin-Perbaikan-Transaksi', {
            method : 'POST',
            headers : { 'Content-Type' : 'application/json' },
            credentials : 'include',
            body : JSON.stringify({
                UNIQUE                  : uniqueCode,
                STATUS                  : statusPerbaikan,
                CATATAN_ADMINISTRATOR   : catatanAdministrator
            })
        });
        const postResponse  = await postData.json()

        toast.success("Berhasil memperbaiki detail transaksi!", {
            icon: '????',
        })

    }

</script>

<Toaster />

<div class="card shadow-sm my-7">
    <div class="card-header">
        <h3 class="card-title fw-bold">Perbaikan Transaksi (Administrator)</h3>
        <div class="card-toolbar">
            <button type="button" class="btn btn-sm btn-light">
                Action
            </button>
        </div>
    </div>
    <div class="card-body">

        
        <div class="table-responsive">
            <table class="table table-row-dashed table-row-gray-300 gy-2 table-hover align-middle text-center">
                <thead>
                    <tr class="fw-bold">
                        <th>#</th>
                        <th>Tanggal Kesalahan</th>
                        <th>Atas Nama</th>
                        <th>No. Transaksi</th>
                        <th>Outlet</th>
                        <th>Total Transaksi</th>
                        <th>Total Bayar</th>
                        <th>Kembalian</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {#each data as data, index }
                        <tr>
                            <td>{ index + 1 }</td>
                            <td>
                                <span class="text-danger">{ data.JAM } WIB</span>
                                <br> { data.CREATED_AT } 
                            </td>
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
                            <td>{ data.OUTLET }</td>
                            <td>{ currencyFormat.format(data.TOTAL_TRANSAKSI) }</td>
                            <td>{ currencyFormat.format(data.TOTAL_BAYAR) }</td>
                            <td class="text-success" >{ currencyFormat.format(data.KEMBALIAN) }</td>
                            <td><button on:click={ () => checkDetail(data.KODE) } data-bs-toggle="modal" data-bs-target="#modalDetail" type="button" class="btn btn-sm btn-primary">Lihat</button></td>
                        </tr>
                    {/each}
                    <tr>
                        <td colspan="5" class="text-center fw-bold">Nominal Permintaan Perbaikan</td>
                        <td colspan="4" class="fw-bold text-center text-white bg-success">{currencyFormat.format(totalPerbaikan)}</td>
                    </tr>
                </tbody>
            </table>
        </div>

    </div>
</div>

<!-- Satan -->

<div class="modal fade" tabindex="-1" id="modalDetail">
    <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">{ noTransaksiDetail }</h3>
                <div class="btn btn-icon btn-sm btn-active-light-primary ms-2" data-bs-dismiss="modal" aria-label="Close">
                    <span class="svg-icon svg-icon-1"></span>
                </div>
            </div>

            <div class="modal-body">

                <div class="row">
                    <div class="col">

                        <div class="separator separator-content border-dark my-5"><span class="w-250px fw-bold">Detail Transaksi</span></div>

                        <div class="table-responsive">
                            <table class="table table-row-dashed table-row-gray-300 gy-2 table-hover align-middle text-center text-dark">
                                <thead>
                                    <tr class="fw-bold bg-opacity-75 bg-primary text-white">
                                        <th>Kode Item</th>
                                        <th>Nama</th>
                                        <th>Satuan</th>
                                        <th>Harga</th>
                                        <th>Jumlah</th>
                                        <th>Total Harga</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-opacity-5 bg-primary">
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

                    </div>
                    <div class="col">

                        <div class="separator separator-content border-dark my-5"><span class="w-250px fw-bold">Permintaan Perbaikan</span></div>

                        <div class="table-responsive">
                            <table class="table table-row-dashed table-row-gray-300 gy-2 table-hover align-middle text-center text-dark">
                                <thead>
                                    <tr class="fw-bold bg-opacity-75 bg-info text-white">
                                        <th>Kode Item</th>
                                        <th>Nama</th>
                                        <th>Satuan</th>
                                        <th>Harga</th>
                                        <th>Jumlah</th>
                                        <th>Total Harga</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-opacity-5 bg-info">
                                    {#each requestPerbaikan as dataRequest }
                                        <tr class:strikethrough="{ dataRequest.DIHAPUS === true }" >
                                            <td>{ dataRequest.KODE_ITEM }</td>
                                            <td>{ dataRequest.NAMA_ITEM }</td>
                                            <td>{ dataRequest.SATUAN }</td>
                                            <td>{ currencyFormat.format(dataRequest.HARGA) }</td>
                                            <td>{ dataRequest.JUMLAH }</td>
                                            <td>{ currencyFormat.format(dataRequest.TOTAL_HARGA) }</td>
                                        </tr>                                
                                    {/each}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>

                <div class="separator separator-content border-dark my-15"><span class="w-350px fw-bold">{personInCharge}</span></div>

                <div class="row mb-5">
                    <div class="col-md-6 fv-row">
                        <label for="kesalahanLuarOutlet" class="d-flex align-items-center mb-2">
                            <span class="text-gray-700 fs-6 fw-bolder required">Jenis Kesalahan</span>
                        </label>
                        <input type="text" class="form-control form-control-solid" readonly bind:value={tipeKesalahan} />
                    </div>
                    <div class="col-md-6 fv-row">
                        <label for="kategoriKesalahan" class="mb-2">
                            <span class="text-gray-700 fs-6 fw-bolder">Kategori Kesalahan</span>
                        </label>
                        <input type="text" class="form-control form-control-solid" readonly bind:value={kategoriKesalahan} />
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6 fv-row">
                        <label for="treatmentDilakukan" class="mb-2">
                            <span class="text-gray-700 fs-6 fw-bolder">Treatment Dilakukan</span>
                        </label>
                        <input type="text" class="form-control form-control-solid" readonly bind:value={treatmentDilakukan} />
                    </div>
                    <div class="col-md-6 fv-row">
                        <label for="pilihStatus" class="required fs-6 fw-bold mb-2">Rubah Status</label>
                        <select bind:value={statusPerbaikan} class="form-select">
                            <option value="">Pilih Status...</option>
                            <option value="Hold">Pending</option>		
                            <option value="Reject">Reject</option>
                            <option value="Approved">Approved</option>
                            <option value="On Going">Approved + Proses</option>
                            <option value="Done">Approved + Done</option>
                        </select>
                    </div>
                </div>

                <div class="row">
                    <div class="col">

                        <div class="d-flex flex-column mb-3 mt-5">
                            <label for="deskripsiPerbaikan" class="mb-2">
                                <span class="text-gray-700 fs-6 fw-bolder required">Deskripsi Perbaikan</span>
                            </label>
                            <div class="fv-row">
                                <textarea bind:value={additionalInformation} class="form-control form-control-solid mb-3" readonly rows="6" placeholder="Deskripsi Perbaikan" ></textarea>
                            </div>
                        </div>

                    </div>
                    <div class="col">

                        <div class="d-flex flex-column mb-3 mt-5">
                            <label for="deskripsiAdmin" class="mb-2">
                                <span class="text-gray-700 fs-6 fw-bolder required">Catatan Administrator</span>
                            </label>
                            <div class="fv-row">
                                <textarea bind:value={catatanAdministrator} class="form-control mb-3" rows="6" placeholder="Deskripsi Administrator" ></textarea>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Tutup</button>
                <button type="button" on:click={doPost} class="btn btn-info">Lakukan Perbaikan</button>
            </div>
        </div>
    </div>
</div>

<style>
    .strikethrough {
        text-decoration: line-through;
        color: red;
    }
</style>