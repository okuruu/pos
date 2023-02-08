<script lang="ts">
    import { globalURL } from "../../lib/mainLink";
    import AutoComplete from "simple-svelte-autocomplete"
    import toast, { Toaster } from 'svelte-french-toast';
    import { currencyFormat } from "../../lib/currencyFormatter";

    let currentDeposit:number
    
    // Alert color & Content
    let alertColor:string   = 'info'
    let alertTitle:string   = 'Dashboard Penambahan Deposit Member'
    let alertContent:string = 'Silahkan mengisi form yang tersedia untuk menambah saldo pada member!'

    // Search Member
    let listOfMembers:string[] = [];
    let selectedMembers:string  = null;

    async function showMember(keywords){
        const memberGet = await fetch(globalURL + 'Search-Member/' + encodeURIComponent(keywords) , {
            method : 'GET',
            credentials : 'include'
        });
        const showData = await memberGet.json();
        listOfMembers = showData;
        return listOfMembers;
    }

    async function doDeposit(){

        if(selectedMembers == null || currentDeposit == null ){
            return toast.error("Silahkan melengkapi form terlebih dahulu")
        }

        const doPost = await fetch(globalURL + 'Add-Deposit',{
            method: 'POST',
            headers : { 'Content-Type' : 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                KODE: selectedMembers,
                NOMINAL: currentDeposit,
                KETERANGAN : 'Deposit Membership'
            })
        })
        const postResponse = await doPost.json()
        toast.success(postResponse.MESSAGE)

        alertColor      = 'success'
        alertTitle      = 'Saldo Deposit anda sekarang: ' + currencyFormat.format(postResponse.SALDO[0].SALDO)
        alertContent    = 'Saldo Deposit telah ditambahkan pada tanggal ' + postResponse.SALDO[0].CREATED_AT + ' WIB'
    }

</script>

<Toaster />

<div class="card shadow-sm my-7">
    <div class="card-header">
        <h3 class="card-title fw-bold">Tambah Deposit Member</h3>
    </div>
    <div class="card-body">

        <div class="alert alert-dismissible bg-light-{alertColor} border border-{alertColor} border-3 border-dashed d-flex flex-column flex-sm-row w-100 p-5 mb-10">
            <span class="svg-icon svg-icon-2hx svg-icon-{alertColor} me-4 mb-5 mb-sm-0"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.3" d="M12 22C13.6569 22 15 20.6569 15 19C15 17.3431 13.6569 16 12 16C10.3431 16 9 17.3431 9 19C9 20.6569 10.3431 22 12 22Z" fill="currentColor"/>
            <path d="M19 15V18C19 18.6 18.6 19 18 19H6C5.4 19 5 18.6 5 18V15C6.1 15 7 14.1 7 13V10C7 7.6 8.7 5.6 11 5.1V3C11 2.4 11.4 2 12 2C12.6 2 13 2.4 13 3V5.1C15.3 5.6 17 7.6 17 10V13C17 14.1 17.9 15 19 15ZM11 10C11 9.4 11.4 9 12 9C12.6 9 13 8.6 13 8C13 7.4 12.6 7 12 7C10.3 7 9 8.3 9 10C9 10.6 9.4 11 10 11C10.6 11 11 10.6 11 10Z" fill="currentColor"/>
            </svg>
            </span>

            <div class="d-flex flex-column pe-0 pe-sm-10">
                <h5 class="mb-1">{alertTitle}</h5>
                <span>{alertContent}</span>
            </div>

            <button type="button" class="position-absolute position-sm-relative m-2 m-sm-0 top-0 end-0 btn btn-icon ms-sm-auto" data-bs-dismiss="alert">
                <i class="bi bi-x fs-1 text-info"></i>
            </button>
        </div>

        <div class="separator my-10"></div>
        
        <div class="row mb-6">
            <label for="namaPJ" class="col-lg-4 col-form-label required fw-bold fs-6">Nama Member</label>
            <div class="col-lg-8 fv-row">
                <AutoComplete searchFunction="{showMember}" delay="600" localFiltering={false} labelFieldName="NAMA" valueFieldName="KODE" bind:selectedItem="{selectedMembers}" class="form-control form-control-lg" placeholder="Cari Member.." hideArrow />
            </div>
        </div>

        <div class="row mb-6">
            <label for="tambahkanDeposit" class="col-lg-4 col-form-label required fw-bold fs-6">Tambah Nominal Deposit</label>
            <div class="col-lg-4 fv-row">
                <input type="number" bind:value={currentDeposit} class="form-control form-control-lg" placeholder="Nominal Deposit"  inputMode='decimal' onFocus="this.type='number'; this.value=this.lastValue" onBlur="this.type=''; this.lastValue=this.value; this.value=this.value==''?'':(+this.value).toLocaleString()" />
            </div>
            <div class="col-lg-4 fv-row">
                <button type="button" on:click={doDeposit} class="btn btn-lg btn-primary"><i class="las la-plus-circle fs-2 me-2"></i>Tambah Deposit</button>
            </div>
        </div>

    </div>
</div>