<script lang="ts">
    import toast, { Toaster } from 'svelte-french-toast';
    import { onMount } from 'svelte';
    import { globalURL } from '../../lib/mainLink';
    import { currencyFormat } from '../../lib/currencyFormatter';

    let listPesanan:string[]    = []
    let currentID:number

    // Detail Modal
    let currentCode:string
    let nomorTransaksi:string       = 'Loading..'
    let penanggungJawab:string
    let totalTransaksi:number
    let transaksiDibuat:string
    let detailTransaksi:string []   = []
    let totalDeposit:number

    // Input Deposit
    let currentDeposit:number
    let historyDeposit:string[]     = []

    // Checkbox Pengerjaan Pesanan
    let isCompleteOnce:boolean      = false

    onMount(async () => {
        const getData = await fetch(globalURL + 'Daftar-Pesanan-Penjualan', {
            method: 'GET',
            credentials : 'include'
        })

        const getResponse = await getData.json()
        listPesanan = getResponse
    })

    async function getDetail(ID){
        const getData       = await fetch(globalURL + 'Daftar-Pesanan-Penjualan', {
            method: 'POST',
            headers : { 'Content-Type' : 'application/json' },
            credentials : 'include',
            body : JSON.stringify({
                ID : ID
            })
        })
        
        const getResponse   = await getData.json()

        currentCode     = getResponse.KODE
        nomorTransaksi  = getResponse.NOMOR_TRANSAKSI
        penanggungJawab = getResponse.NAMA
        totalTransaksi  = getResponse.TOTAL_TRANSAKSI
        transaksiDibuat = getResponse.TRANSAKSI_DIBUAT
        detailTransaksi = getResponse.DETAIL
        totalDeposit    = getResponse.DEPOSIT
        historyDeposit  = getResponse.SALDO

    }

    // Change Priority
    async function changePriority(currentID,priorityStatus){
        const doPost = await fetch(globalURL + 'Daftar-Pesanan-Penjualan/Rubah-Status', {
            method: 'POST',
            headers : { 'Content-Type' : 'application/json' },
            credentials: 'include',
            body : JSON.stringify({
                ID              : currentID,
                STATUS_PESANAN  : priorityStatus
            })
        })

        const postResponse = await doPost.json()

        if(postResponse == 'success'){
            toast.success('Status diupdate')
        }

    }

    async function doDeposit(){
        const doPost = await fetch(globalURL + 'Add-Deposit', {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                KODE: currentCode,
                NOMINAL : currentDeposit,
                KETERANGAN : 'Deposit Transaksi'
            })
        })

        const postResponse      = await doPost.json()
        historyDeposit          = postResponse.SALDO
        totalDeposit            = postResponse.DEPOSIT
        toast.success("Berhasil menambahkan deposit!")
    }

    async function saveCurrentProcess(){
        var inputID         = document.getElementsByName('ID[]')
        var inputPCS        = document.getElementsByName('PCS[]')

        let listID          = []
        let listPCS         = []

        var formFile = new FormData()

        for(let i = 0 ; i < inputID.length; i++){
            var totalID         = inputID[i].value
            var totalPCS        = inputPCS[i].value
            
            listID.push(totalID)
            listID = listID

            listPCS.push(totalPCS)
            listPCS = listPCS

            formFile.append('ID[]', totalID)
            formFile.append('PCS[]', totalPCS)
        }

        const doPost = await fetch(globalURL + 'Daftar-Pesanan-Penjualan/Detail-Proses-Pengerjaan',{
            method: 'POST',
            headers : { 'Content-Type' : 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                ID : listID,
                PCS : listPCS
            })
        })

        const doResponse = await doPost.json()
        toast.success("Detail berhasil diupdate!")
    }

</script>

<Toaster />

<div class="container-fluid">
    <div class="card shadow-sm my-7">
        <div class="card-header">
            <h3 class="card-title">Daftar Pesanan</h3>
            <div class="card-toolbar">
                <button type="button" class="btn btn-sm btn-light">
                    Action
                </button>
            </div>
        </div>
        <div class="card-body">
            
            <div class="table-responsive mt-4">
                <table class="table table-row-dashed table-row-gray-300 align-middle mt-2">
                    <thead>
                        <tr class="fw-bold">
                            <th>#</th>
                            <th>Tanggal Pesanan</th>
                            <th>Detail & No Transaksi</th>
                            <th>Staff Penjualan</th>
                            <th>Member</th>
                            <th>Total Transaksi</th>
                            <th>Prioritas Pengerjaan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each listPesanan as data,index }
                            <tr>
                                <td>{ index + 1 }</td>
                                <td>{ data.TRANSAKSI_DIBUAT }</td>
                                <td><button type="button" on:click={ () => getDetail(data.ID) } class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#rincianData">{ data.NOMOR_TRANSAKSI }</button></td>
                                <td>{ data.PJ }</td>
                                <td>{ data.MEMBER }</td>
                                <td>{ currencyFormat.format(data.TOTAL_TRANSAKSI) }</td>
                                <td>
                                    <select bind:value={ data.STATUS_PESANAN } on:change={ () => changePriority(data.ID, data.STATUS_PESANAN) } class="form-select form-select-sm">
                                        <option value="Belum Dikerjakan">Belum Dikerjakan</option>
                                        <option value="Sedang Dikerjakan">Sedang Dikerjakan</option>
                                    </select>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>

        </div>
    </div>
</div>


<!-- Modals -->

<div class="modal fade" tabindex="-1" id="rincianData">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">{ nomorTransaksi }</h3>

                <div class="btn btn-icon btn-sm btn-active-light-primary ms-2" data-bs-dismiss="modal" aria-label="Close">
                    <span class="svg-icon svg-icon-1"></span>
                </div>
            </div>

            <div class="modal-body">
                
                <div class="row mb-6">
                    <label for="namaPJ" class="col-lg-4 col-form-label required fw-bold fs-6">Staff Penjualan</label>
                    <div class="col-lg-8 fv-row">
                        <input type="text" class="form-control form-control-lg form-control-solid" placeholder="Penanggung Jawab" bind:value={penanggungJawab} readonly />
                    </div>
                </div>
                
                <div class="row mb-6">
                    <label for="namaPJ" class="col-lg-4 col-form-label required fw-bold fs-6">Total Deposit</label>
                    <div class="col-lg-8 fv-row">
                        <input type="text" class="form-control form-control-lg form-control-solid" placeholder="Penanggung Jawab" value={ currencyFormat.format(totalDeposit) } readonly />
                    </div>
                </div>

                <div class="separator separator-content border-dark my-15"><span class="w-250px fw-bold">Detail Transaksi</span></div>

                <div class="table-responsive">
                    <table class="table table-row-dashed table-row-gray-300 align-middle mt-7 gy-3 ">
                        <thead>
                            <tr class="fw-bold text-center">
                                <th>#</th>
                                <th>Kode Item</th>
                                <th>Nama</th>
                                <th>Harga</th>
                                <th>Jumlah</th>
                                <th>Total</th>
                                <th>Sedang Dikerjakan(Pcs)</th>
                            </tr>
                        </thead>
                        {#each detailTransaksi as data,index }
                            <tr class="text-center">
                                <td>{index + 1}</td>
                                <td>{ data.KODE_ITEM }</td>
                                <td>{ data.NAMA_ITEM }</td>
                                <td>{ currencyFormat.format(data.HARGA) }</td>
                                <td>{ data.JUMLAH }</td>
                                <td>{ currencyFormat.format(data.TOTAL_HARGA) }</td>
                                <td>
                                    <input type="number" name="ID[]" value="{ data.ID }" hidden />
                                    <input type="number" name="PCS[]" value="{ data.PESANAN_DIKERJAKAN }" class="form-control form-control-sm" placeholder="Jumlah Sedang Diproses (Pcs)"/>
                                </td>
                            </tr>
                        {/each}
                    </table>
                </div>

                <div class="d-flex justify-content-end">
                    <button type="button" on:click={saveCurrentProcess} class="btn btn-sm btn-primary">Update Pesanan</button>
                </div>

                <div class="separator separator-content border-dark my-15"><span class="w-250px fw-bold">Deposit</span></div>

                <div class="row mb-6">
                    <label for="tambahkanDeposit" class="col-lg-4 col-form-label required fw-bold fs-6">Tambah Nominal Deposit</label>
                    <div class="col-lg-4 fv-row">
                        <input type="number" bind:value={currentDeposit} class="form-control form-control-lg form-control-solid" placeholder="Nominal Deposit" inputMode='decimal' onFocus="this.type='number'; this.value=this.lastValue" onBlur="this.type=''; this.lastValue=this.value; this.value=this.value==''?'':(+this.value).toLocaleString()" />
                    </div>
                    <div class="col-lg-4 fv-row">
                        <button type="button" on:click={doDeposit} class="btn btn-lg btn-primary"><i class="las la-plus-circle fs-2 me-2"></i>Tambah Deposit</button>
                    </div>
                </div>

                <div class="separator separator-content border-dark my-15"><span class="w-250px fw-bold">Riwayat Deposit</span></div>

                <div class="table-responsive">
                    <table class="table table-row-dashed table-row-gray-300 align-middle mt-2 gy-3 ">
                        <thead>
                            <tr class="fw-bold text-center">
                                <th>#</th>
                                <th>Saldo</th>
                                <th>Keterangan</th>
                                <th>Tanggal</th>
                            </tr>
                        </thead>
                        {#each historyDeposit as deposit,index }
                            <tr class="text-center">
                                <td>{index + 1}</td>
                                <td>{ currencyFormat.format(deposit.SALDO) }</td>
                                <td>{ deposit.KETERANGAN }</td>
                                <td>{ deposit.CREATED_AT } WIB</td>
                            </tr>
                        {/each}
                    </table>
                </div>

            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Save changes</button>
            </div>
        </div>
    </div>
</div>
