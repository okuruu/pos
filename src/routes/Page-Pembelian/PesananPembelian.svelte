<script lang="ts">
    import { onMount } from "svelte";
    import { globalURL } from "../../lib/mainLink";
    import { userResponse } from "../../lib/activeUser";
    import toast, { Toaster } from 'svelte-french-toast';
    import AutoComplete from "simple-svelte-autocomplete"
    import { currencyFormat } from "../../lib/currencyFormatter";

    let cartData                = []
    let totalPrice:number       = 0
    let currentSession          = null

    let selectedSupplier:string = ""
    let listSupplier            = []

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

    onMount(async () => {
        const response = await fetch(globalURL + 'Bundle-Pembelian', {
            method : 'GET',
            headers : {
                'Content-Type' : 'application/json'
            },
            credentials: 'include',
        })

        const serverData = await response.json();

        currentSession  = serverData.ACTIVE;
        bundlePembelian = {
            STOK        : serverData.STOK,
        };

        listSupplier = serverData.SUPPLIER

    })

    // Bundling data penjualan
    let bundlePembelian = {
        STOK    : null,
    };

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

    async function simpanTransaksi(){

        const formPesanan = await fetch(globalURL + 'Pesanan-Pembelian', {
            method: 'POST',
            headers : { 'Content-Type' : 'application/json' },
            credentials : 'include',
            body : JSON.stringify({
                NIP         : userResponse.nip,
                NAMA        : userResponse.name,
                OUTLET      : userResponse.outlet,
                SUPPLIER    : selectedSupplier,
                KETERANGAN  : additionalInformation ,
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
                TIPE            : 'Pesanan Pembelian'
            })
        })

        toast.success("Data berhasil disimpan")
    }

</script>

<Toaster />

<div class="row">
    <div class="col-sm-8 col-md-8 col-lg-8">

        <div class="card shadow-sm mb-7">
            <div class="card-header">
                <h3 class="card-title fw-bold">Pesanan Pembelian</h3>
            </div>
            <div class="card-body">
                
                <form on:submit|preventDefault={inputToList}>
                    <div class="row">
                        <label for="inputDataPenjualan" class="col-lg-4 col-form-label required fw-bold fs-6">Stok & Jumlah</label>
                        <div class="col-lg-8">
                            <div class="row">
                                <div class="col-lg-6 fv-row">
                                    <AutoComplete items="{bundlePembelian.STOK}" bind:this={productInput} bind:selectedItem="{currentItem}" placeholder="Nama Item" class="form-control form-control-lg mb-3 mb-lg-0" labelFieldName="NAMA" hideArrow="true" />
                                </div>
                                <div class="col-lg-6 fv-row">
                                    <input type="number" min="1" bind:value={currentQuantity} class="form-control form-control-lg" placeholder="Masukkan Jumlah"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="submit" hidden class="btn btn-primary">Eastern Man</button>
                </form>

                <div class="table-responsive mt-4">
                    <table class="table table-row-dashed table-row-gray-300 align-middle mt-2">
                        <thead>
                            <tr class="fw-bold">
                                <th>Kode Item</th>
                                <th>Nama Produk</th>
                                <th>Satuan</th>
                                <th>Harga</th>
                                <th>Jumlah</th>
                                <th>Total Harga</th>
                                <th>Hapus</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each cartData as data, index}
                                <tr>
                                    <td>{ data.KODE }</td>
                                    <td>{ data.NAMA }</td>
                                    <td>{ data.SATUAN }</td>
                                    <td>{ currencyFormat.format(data.HARGA) }</td>
                                    <td>{ data.JUMLAH }</td>
                                    <td>{ currencyFormat.format(data.TOTAL_HARGA) }</td>
                                    <td>
                                        <button type="button" class="btn btn-icon btn-danger" on:click={ () => removeFromList(index) }><i class="las la-trash fs-2"></i></button>
                                    </td>
                                </tr>
                            {/each}
                            <tr class="text-center fw-bold">
                                <td colspan="5">Total</td>
                                <td colspan="2" class="bg-success text-white">{ currencyFormat.format(totalPrice) }</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
            </div>
        </div>

    </div>
    <div class="col-sm-4 col-md-4 col-lg-4">

        <div class="card shadow-sm mb-7">
            <div class="card-body">

                <div class="fv-row mb-2">
                    <label for="pilihCS" class="form-label fs-6 fw-bolder mb-3">Pilih Supplier</label>
                    <select bind:value={ selectedSupplier } class="form-select">
                        <option value="">Pilih Supplier</option>
                        {#each listSupplier as data }
                            <option value="{ data.KODE }">{ data.NAMA }</option>
                        {/each}
                    </select>
                </div>

                <div class="fv-row my-4">
                    <label for="jamPengambilan" class="form-label fs-6 fw-bolder mb-3">Jam Pengiriman</label>
                    <input type="datetime-local" bind:value={jamPengambilan} class="form-control form-control-sm" required />
                </div>

                <div class="fv-row mb-2">
                    <label for="keteranganTambahan" class="form-label fs-6 fw-bolder mb-3">Keterangan Tambahan</label>
                    <textarea class="form-control " rows="3" placeholder="Keterangan Untuk Transaksi Ini" bind:value={additionalInformation} ></textarea>
                </div>

                <button type="button" class="btn w-100 btn-primary mt-7" data-bs-toggle="modal" data-bs-target="#bayarPesanan"><i class="las la-wallet fs-2 me-2"></i>Pembayaran</button>

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
                <button type="button" on:click={simpanTransaksi} class="btn btn-primary"><i class="las la-receipt fs-2 me-2"></i>Simpan Transaksi</button>
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