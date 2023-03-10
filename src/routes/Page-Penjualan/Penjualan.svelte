<script lang="ts">
    import { onMount } from "svelte";
    import toast, { Toaster } from 'svelte-french-toast';
    import AutoComplete from "simple-svelte-autocomplete"
    import { globalURL} from "../../lib/mainLink";
    import { currencyFormat } from "../../lib/currencyFormatter";

    let lastTransactionID = null

    let productInput;
    let currentSession  = null;

    let selectedMembers:string  = null;
    let selectedSales:string    = "";
    let selectedPromo:string    = "";

    let listOfMembers = [];

    let bundlePenjualan = {
        PROMO   : null,
        SALES   : null,
        STOK    : null,
        CASHIER : null,
    };
    let listOfSales = [];
    let listOfPromo = [];

    // Checking apakah transaksi telah disimpan
    let isSaved:boolean = false

    onMount(async () => {
        const response = await fetch(globalURL + 'Bundle-Penjualan', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                tipePenjualan   : 'Stok-Outlet',
            })
        })

        const serverData = await response.json();

        currentSession  = serverData.ACTIVE;
        bundlePenjualan = {
            PROMO   : serverData.KODE_PROMO,
            SALES   : serverData.SALES,
            STOK    : serverData.STOK,
            CASHIER : serverData.ACTIVE
        };
        listOfSales = serverData.SALES;
        listOfPromo = serverData.KODE_PROMO;

    });

    // Input to cart
    let currentItem:string      = null;
    let currentQuantity:number  = null;
    let currentItemPlaceholder;
    let cartData                = [];
    let totalPrice:number       = 0;
    let submittedReceipt        = [];

    // Payment Methods
    let bayarTunai:number               = null;
    let depositPesanan:number           = null;
    let eMoney:number                   = null;
    let dpSoPesanan:number              = null;
    let bayarKredit:number              = null;
    let bayarDebit:number               = null;
    let potonganHarga:number            = null;
    let additionalInformation:string    = null;
    let totalPaid:number                = null;

    function inputToList(eventForm){
        // @ts-ignore
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
            HARGA           : currentItemPlaceholder.HARGA,
            SATUAN          : currentItemPlaceholder.SATUAN,
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

    async function showMember(keywords){
        const memberGet = await fetch(globalURL + 'Search-Member/' + encodeURIComponent(keywords) , {
            method : 'GET',
            credentials : 'include'
        });
        const showData = await memberGet.json();
        listOfMembers = showData;
        return listOfMembers;
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

    async function doPost(){
        if(cartData == undefined || cartData.length == 0){
            return toast.error("Harap mengisi produk terlebih dahulu!");
        }

        if(totalPaid == null){
            return toast.error("Harap mengisi pembayaran dengan benar!")
        }

        submittedReceipt = {
            DETAIL      : cartData,
            SALES       : selectedSales,
            PROMO       : selectedPromo,
            MEMBER      : selectedMembers,
            PEMBAYARAN  : {
                TUNAI       : bayarTunai,
                DEPOSIT     : depositPesanan,
                EMONEY      : eMoney,
                DPPESANAN   : dpSoPesanan,
                KREDIT      : bayarKredit,
                DEBIT       : bayarDebit,
                POTONGAN    : potonganHarga,
                TOTAL       : totalPrice,
            },
            KETERANGAN      : additionalInformation,
            KATEGORI        : 'Retail',
            TIPE            : 'Penjualan',
            KEMBALIAN       : totalPaid - totalPrice,
            PLATFORM        : 'Web'
        };

        const postData = await fetch(globalURL + 'Post-Penjualan', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(submittedReceipt)
        });

        const postResponse = await postData.json()
        lastTransactionID = postResponse.receiptNumber

        toast.success("Transaksi berhasil disimpan!");
        isSaved = true
    }

    function doPrint(paperSize){

        if(!isSaved){
            return toast.error("Simpan transaksi terlebih dahulu!")
        }
        // window.open('/reports/'+ paperSize +'.html?last=' + lastTransactionID ,'_blank').focus()
        window.open('/public/reports/'+ paperSize +'.html?last=' + lastTransactionID ,'_blank').focus()
    }
    
</script>

<Toaster />

<div class="container-fluid mt-1">

    <div class="row">
        <div class="col-sm-8 col-md-8 col-lg-8">

            <div class="card shadow-sm">
                <div class="card-header">
                    <h3 class="card-title fw-bold">Penjualan Kasir</h3>
                    <div class="card-toolbar">
                        <button type="button" class="btn btn-sm btn-success">Total: { currencyFormat.format(totalPrice) }</button>
                    </div>
                </div>
                <div class="card-body">
                    
                <form on:submit|preventDefault={inputToList}>
                    <div class="row">
                        <label for="inputDataPenjualan" class="col-lg-4 col-form-label required fw-bold fs-6">Stok & Jumlah</label>
                        <div class="col-lg-8">
                            <div class="row">
                                <div class="col-lg-6 fv-row">
                                    <AutoComplete items="{bundlePenjualan.STOK}" bind:this={productInput} bind:selectedItem="{currentItem}" placeholder="Nama Item" class="form-control form-control-lg mb-3 mb-lg-0" labelFieldName="NAMA" hideArrow="true" />
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
                        </tbody>
                    </table>
                </div>
        
                </div>
            </div>

        </div>
        <div class="col-sm-4 col-md-4 col-lg-4">

            <div class="card shadow-sm my-3">
                <div class="card-body">

                    <div class="row mb-2">
                        <label for="pilihCS" class="col-sm-4 col-form-label fw-bold fs-6">
                            <span>Pilih CS</span>
                        </label>
                        <select bind:value={ selectedSales } class="form-select">
                            <option value="">Pilih CS</option>
                            {#each listOfSales as salesOnline }
                                <option value="{salesOnline.CODE}">{ salesOnline.NAMA }</option>
                            {/each}
                        </select>
                    </div>

                    <div class="row mb-2">
                        <label for="kodePromo" class="col-sm-4 col-form-label fw-bold fs-6">
                            <span>Promo</span>
                        </label>
                        <select bind:value={ selectedPromo } class="form-select">
                            <option value="">Pilih Kode Promo</option>
                            {#each listOfPromo as promos }
                                <option value="{ promos.KODE }">{ promos.KETERANGAN }</option>
                            {/each}
                        </select>
                    </div>

                    <div class="row mb-2">
                        <label for="cariMember" class="col-sm-4 col-form-label fw-bold fs-6">
                            <span>Cari Member</span>
                        </label>
                        <AutoComplete searchFunction="{showMember}" delay="600" localFiltering={false} labelFieldName="NAMA" valueFieldName="KODE" bind:selectedItem="{selectedMembers}" class="form-control form-control-lg" placeholder="Cari Member.." hideArrow />
                    </div>

                    <button type="button" class="btn btn-primary w-100 mt-12" data-bs-toggle="modal" data-bs-target="#bayarPenjualan"><i class="las la-wallet fs-2 me-2"></i>Pembayaran</button>
        
                </div>
            </div>

        </div>
    </div>


</div>


<!-- Modals! -->

<div class="modal fade" tabindex="-1" id="bayarPenjualan">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Pembayaran Transaksi</h3>

                <div class="btn btn-icon btn-sm btn-active-light-primary ms-2" data-bs-dismiss="modal" aria-label="Close">
                    <span class="svg-icon svg-icon-1"></span>
                </div>
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
                <div class="me-2">
                    <button type="button" class="btn btn-sm btn-light" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-sm btn-primary" on:click={doPost} ><i class="las la-save fs-2 me-2"></i>Simpan Transaksi</button>
                    <button type="button" class="btn btn-sm btn-info" on:click={ () => doPrint('80mm')}><i class="las la-receipt fs-2 me-2"></i>80mm</button>
                    <button type="button" class="btn btn-sm btn-info" on:click={ () => doPrint('58mm')}><i class="las la-receipt fs-2 me-2"></i>58mm</button>
                </div>
            </div>
        </div>
    </div>
</div>