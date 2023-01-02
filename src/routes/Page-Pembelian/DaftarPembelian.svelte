<script lang="ts">
    import { onMount } from "svelte";
    import { userResponse } from "../../lib/activeUser";
    import { currencyFormat } from "../../lib/currencyFormatter";
    import { globalURL } from "../../lib/mainLink";

    let availableOrders                 = []
    let cartData                        = []
    let indexAvailableOrders:number     = null
    let totalPrice:number               = null
    let uniqueID:string                 = null
    let nomorTransaksi:string           = '-'

    // Payment Methods
    let bayarTunai:string               = null;
    let depositPesanan:string           = null;
    let eMoney:string                   = null;
    let dpSoPesanan:string              = null;
    let bayarKredit:string              = null;
    let bayarDebit:string               = null;
    let potonganHarga:string            = null;
    let totalPaid:any                   = null;
    let jamPengambilan:any              = null;
    let additionalInformation:string    = null;

    // Carting Purpose!
    let productInput;
    let currentItem:string      = null
    let currentQuantity:number  = null
    let currentItemPlaceholder  = {
            KODE        : null,
            NAMA        : null,
            HARGA       : null,
            SATUAN      : null,
            JUMLAH      : null,
            TOTAL_HARGA : null
    }
    let supplier:string         = null

    onMount(async () => {
        const serverData = await fetch(globalURL + 'Incomplete-Order-Pembelian', {
            method: 'GET',
            credentials: 'include'
        })

        availableOrders     = await serverData.json()

    })

    function changeCurrentOrder(){
        cartData                = availableOrders[indexAvailableOrders].DETAIL
        totalPrice              = availableOrders[indexAvailableOrders].HARGA
        uniqueID                = availableOrders[indexAvailableOrders].UNIQUE
        nomorTransaksi          = availableOrders[indexAvailableOrders].KODE
        jamPengambilan          = availableOrders[indexAvailableOrders].PEMESANAN
        additionalInformation   = availableOrders[indexAvailableOrders].KETERANGAN
        supplier                = availableOrders[indexAvailableOrders].SUPPLIER
    }

    function inputToList(eventForm){
        currentItemPlaceholder = {
            KODE        : currentItem.KODE,
            NAMA        : currentItem.NAMA,
            HARGA       : currentItem.HARGA,
            SATUAN      : currentItem.SATUAN,
            JUMLAH      : currentQuantity,
            TOTAL_HARGA : currentItem.HARGA * currentQuantity
        };
        addToList(currentItemPlaceholder);
        eventForm.target.reset();
    }

    function addToList(currentItemPlaceholder){
        cartData = [...cartData, {
            KODE            : currentItemPlaceholder.KODE,
            NAMA            : currentItemPlaceholder.NAMA,
            SATUAN          : currentItemPlaceholder.SATUAN,
            HARGA           : currentItemPlaceholder.HARGA,
            JUMLAH          : currentItemPlaceholder.JUMLAH,
            TOTAL_HARGA     : currentItemPlaceholder.TOTAL_HARGA,
        }];

        cartData = cartData;
        recalculatePrice(cartData);
    }

    function removeFromList(index){
        cartData.splice(index, 1);
        cartData = cartData;
        recalculatePrice(cartData);
    }

    function recalculatePrice(cartData){
        const sumData = cartData.reduce((accumulator, object) => {
            return accumulator + object.TOTAL_HARGA;
        }, 0);

        totalPrice = sumData;
    }

    function calculatePaid(){

        const listValue     = [bayarTunai,depositPesanan,eMoney,dpSoPesanan,bayarDebit,bayarKredit,potonganHarga]
        let addSum:number   = 0

        for(let i = 0 ; i < 7; i++){
            if(listValue[i] != null){
                addSum = addSum += parseInt(listValue[i])
            }
        }
        totalPaid = addSum
    }

    async function simpanTransaksi() {

        const formData = await fetch(globalURL + 'Incomplete-Order-Pembelian', {
            method : 'POST',
            headers: { 'Content-Type' : 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                NIP         : userResponse.nip ,
                NAMA        : userResponse.name ,
                OUTLET      : userResponse.outlet,
                KODE        : uniqueID,
                SUPPLIER    : supplier,
                KETERANGAN  : additionalInformation,
                PEMBAYARAN  : {
                    TUNAI       : bayarTunai,
                    DEPOSIT     : depositPesanan,
                    EMONEY      : eMoney,
                    DPPESANAN   : dpSoPesanan,
                    KREDIT      : bayarKredit,
                    DEBIT       : bayarDebit,
                    POTONGAN    : potonganHarga,
                    KEMBALIAN   : totalPaid - totalPrice,
                    TOTAL       : totalPrice,
                },
                DETAIL          : cartData,
                PLATFORM        : 'Web',
                JAM_PENGIRIMAN  : jamPengambilan,
                KATEGORI        : 'Non Retail',
                TIPE            : 'Po Pembelian'
            })
        })

    }

</script>

<div class="row my-7">
    <div class="col-sm-8 col-md-8 col-lg-8">

        <div class="card shadow-sm">
            <div class="card-header">
                <h3 class="card-title fw-bold">Daftar Pembelian</h3>
                <div class="card-toolbar">
                    <button type="button" class="btn btn-sm btn-info">
                        Nomor Transaksi: { nomorTransaksi }
                    </button>
                </div>
            </div>
            <div class="card-body">

                <div class="table-responsive">
                    <table class="table table-row-dashed table-row-gray-300 align-middle mt-2">
                        <thead>
                            <tr class="fw-bold">
                                <th class="text-center">#</th>
                                <th>Kode Item</th>
                                <th>Nama Item</th>
                                <th>Harga</th>
                                <th>Satuan</th>
                                <th>Jumlah</th>
                                <th>Total Harga</th>
                                <th>Hapus</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each cartData as data,index }
                                <tr>
                                    <td class="text-center">{ index + 1 }</td>
                                    <td>{ data.KODE }</td>
                                    <td>{ data.NAMA }</td>
                                    <td>{ currencyFormat.format(data.HARGA) }</td>
                                    <td>{ data.SATUAN }</td>
                                    <td>{ data.JUMLAH }</td>
                                    <td>{ currencyFormat.format(data.TOTAL_HARGA) }</td>
                                    <td>
                                        <button type="button" class="btn btn-icon btn-danger"><i class="las la-trash-alt fs-2"></i></button>
                                    </td>
                                </tr>
                            {/each}
                            <tr>
                                <td class="fw-bold text-center" colspan="6">Total</td>
                                <td class="bg-success text-white text-center fw-bold" colspan="2" >{ currencyFormat.format(totalPrice) }</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>

    </div>
    <div class="col-sm-4 col-md-4 col-lg-4">

        <div class="card shadow-sm">
            <div class="card-header">
                <h3 class="card-title fw-bold">Detail</h3>
                <div class="card-toolbar">
                    <button type="button" class="btn btn-sm btn-success" data-bs-toggle="modal" data-bs-target="#bayarPesanan">
                        Bayaren
                    </button>
                </div>
            </div>
            <div class="card-body">
                
                <div class="form-group">
                    <label for="selectOrder" class="form-label fw-bold">Pilih Daftar Pembelian</label>
                    <select bind:value={indexAvailableOrders} on:change={changeCurrentOrder} class="form-select">
                        <option value="">Pilih Pesanan</option>
                        {#each availableOrders as orders, index }
                            <option value="{ index }">{ orders.KODE }</option>
                        {/each}
                    </select>
                </div>

                <div class="form-group my-4">
                    <label for="pilihSupplier" class="form-label fw-bold">Pilih Supplier</label>
                    <select bind:value={supplier} class="form-select">
                        <option value="">Pilih Pesanan</option>
                        {#each availableOrders as orders }
                            <option value="{ orders.SUPPLIER }">{ orders.SUPPLIER }</option>
                        {/each}
                    </select>
                </div>

                <div class="fv-row my-4">
                    <label for="jamPengambilan" class="form-label fs-6 fw-bolder mb-3">Jam Pengiriman</label>
                    <input type="datetime-local" bind:value={jamPengambilan} class="form-control form-control-sm" required />
                </div>

                <div class="fv-row mb-2">
                    <label for="keteranganTambahan" class="form-label fs-6 fw-bolder mb-3">Keterangan Tambahan</label>
                    <textarea class="form-control " rows="3" placeholder="Keterangan Untuk Transaksi Ini" bind:value={additionalInformation}></textarea>
                </div>

            </div>
        </div>

    </div>
</div>

<!-- Modal Modul -->

<div class="modal fade" tabindex="-1" id="bayarPesanan">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Pembayaran</h3>

                <!--begin::Close-->
                <div class="btn btn-icon btn-sm btn-active-light-primary ms-2" data-bs-dismiss="modal" aria-label="Close">
                    <span class="svg-icon svg-icon-1"></span>
                </div>
                <!--end::Close-->
            </div>

            <div class="modal-body">

                <div class="row mb-2">
                    <label for="bayarTunai" class="col-sm-4 col-form-label fw-bold fs-6">
                        <span>Bayar Tunai</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input type="text" class="form-control" placeholder="Bayar Tunai" on:keyup={calculatePaid} bind:value="{bayarTunai}" inputMode='decimal' onFocus="this.type='number'; this.value=this.lastValue" onBlur="this.type=''; this.lastValue=this.value; this.value=this.value==''?'':(+this.value).toLocaleString()" />
                    </div>
                </div>

                <div class="row mb-2">
                    <label for="dpPesanan" class="col-sm-4 col-form-label fw-bold fs-6">
                        <span>Deposit Pesanan</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input type="text" class="form-control" placeholder="Bayar Tunai" on:keyup={calculatePaid} bind:value="{depositPesanan}" inputMode='decimal' onFocus="this.type='number'; this.value=this.lastValue" onBlur="this.type=''; this.lastValue=this.value; this.value=this.value==''?'':(+this.value).toLocaleString()" />
                    </div>
                </div>

                <div class="row mb-2">
                    <label for="eMoney" class="col-sm-4 col-form-label fw-bold fs-6">
                        <span>E-Money</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input type="text" class="form-control" placeholder="E-Money" on:keyup={calculatePaid} bind:value="{eMoney}" inputMode='decimal' onFocus="this.type='number'; this.value=this.lastValue" onBlur="this.type=''; this.lastValue=this.value; this.value=this.value==''?'':(+this.value).toLocaleString()" />
                    </div>
                </div>

                <div class="row mb-2">
                    <label for="dpSoPesanan" class="col-sm-4 col-form-label fw-bold fs-6">
                        <span>DP / SO Pesanan</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input type="text" class="form-control" placeholder="DP / SO Pesanan" on:keyup={calculatePaid} bind:value="{dpSoPesanan}" inputMode='decimal' onFocus="this.type='number'; this.value=this.lastValue" onBlur="this.type=''; this.lastValue=this.value; this.value=this.value==''?'':(+this.value).toLocaleString()" />
                    </div>
                </div>

                <div class="row mb-2">
                    <label for="bayarKredit" class="col-sm-4 col-form-label fw-bold fs-6">
                        <span>Bayar Kredit</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input type="text" class="form-control" placeholder="Bayar Kredit" on:keyup={calculatePaid} bind:value="{bayarKredit}" inputMode='decimal' onFocus="this.type='number'; this.value=this.lastValue" onBlur="this.type=''; this.lastValue=this.value; this.value=this.value==''?'':(+this.value).toLocaleString()" />
                    </div>
                </div>

                <div class="row mb-2">
                    <label for="group" class="col-sm-4 col-form-label fw-bold fs-6">
                        <span>Bayar Debit</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input type="text" class="form-control" placeholder="Bayar Kredit" on:keyup={calculatePaid} bind:value="{bayarDebit}" inputMode='decimal' onFocus="this.type='number'; this.value=this.lastValue" onBlur="this.type=''; this.lastValue=this.value; this.value=this.value==''?'':(+this.value).toLocaleString()" />
                    </div>
                </div>

                <div class="row mb-2">
                    <label for="totalTagihan" class="col-sm-4 col-form-label fw-bold fs-6">
                        <span>Total Tagihan</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input type="text" class="form-control border-0 bg-danger fw-bolder text-white" readonly value="{ currencyFormat.format(totalPrice) }" />
                    </div>
                </div>

                <div class="row mb-2">
                    <label for="pembayaran" class="col-sm-4 col-form-label fw-bold fs-6">
                        <span>Pembayaran</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input type="text" class="form-control border-0 bg-warning fw-bolder text-white" readonly value="{ currencyFormat.format(totalPaid) }" />
                    </div>
                </div>

                <div class="row mb-2">
                    <label for="kembalian" class="col-sm-4 col-form-label fw-bold fs-6">
                        <span>Kembalian</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input type="text" class="form-control border-0 bg-success fw-bolder text-white" readonly value="{ currencyFormat.format(totalPaid - totalPrice) }" />
                    </div>
                </div>

            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Tutup</button>
                <button type="button" on:click={simpanTransaksi} class="btn btn-primary">Simpan</button>
            </div>
        </div>
    </div>
</div>

<style>
div.my-currency-input :global(input.currencyInput__formatted) { 
    display: block;
    width: 100%;
    padding: .775rem 1rem;
    font-size: 1.1rem;
    font-weight: 500;
    line-height: 1.5;
    color: #5e6278;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #e4e6ef;
    appearance: none;
    border-radius: 0.95rem;
    box-shadow: inset 0 1px 2px rgb(0 0 0 / 8%);
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
}
</style>