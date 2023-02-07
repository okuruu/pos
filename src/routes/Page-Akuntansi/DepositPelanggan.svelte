<script lang="ts">
    import AutoComplete from "simple-svelte-autocomplete"
    import { globalURL } from "../../lib/mainLink";

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

    function memberData(){
        console.log(selectedMembers)
    }

</script>

<div class="card shadow-sm my-7">
    <div class="card-header">
        <h3 class="card-title fw-bold">Tambah Deposit Member</h3>
        <div class="card-toolbar">
            <button on:click={memberData} type="button" class="btn btn-sm btn-light">
                Action
            </button>
        </div>
    </div>
    <div class="card-body">
        
        <div class="row mb-6">
            <label for="namaPJ" class="col-lg-4 col-form-label required fw-bold fs-6">Staff Penjualan</label>
            <div class="col-lg-8 fv-row">
                <AutoComplete searchFunction="{showMember}" delay="600" localFiltering={false} labelFieldName="NAMA" valueFieldName="KODE" bind:selectedItem="{selectedMembers}" class="form-control form-control-lg" placeholder="Cari Member.." hideArrow />
            </div>
        </div>

    </div>
</div>