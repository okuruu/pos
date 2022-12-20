<script lang="ts">

  import toast, { Toaster } from 'svelte-french-toast';
  import Navbar from "./Navbar.svelte";

  let credentials: { email:string, password:string } = {
    email: null,
    password: null
  }

  let isAuthorized:boolean = false;

  async function checkInput(){
    
    if(credentials.email == null || credentials.email == undefined || credentials.password == undefined || credentials.password == undefined ){
      return toast.error("Lengkapi data terlebih dahulu!",{
        position: 'bottom-center'
      })
    }

    const loginAttempt = await fetch('http://localhost:8080/api/v1/Log-In', {
      method        : 'POST',
      headers : {
        'Content-Type' : 'application/json',
        'Access-Control-Allow-Origin':'http://localhost:8080/',
      },
      credentials: 'include',
      body: JSON.stringify({
        email       : credentials.email,
        password    : credentials.password
      })
    });
    
    const response = await loginAttempt.json();

    if(response.MESSAGE == 'Authenticated'){
      isAuthorized = true;
      return toast.success("Selamat Datang!");
    }
      return toast.error("Uh-oh! Identitas anda tidak kami kenali")
  }

</script>

<Toaster />
<div>
  {#if isAuthorized == false }
    <div class="container">
      
      <form on:submit|preventDefault={checkInput}>
        <div class="d-flex flex-column min-vh-100 justify-content-center align-items-center">

            <div class="card bg-white">
              <div class="card-body text-center">
                <img src="/assets/images/logoDea.jpg" class="rounded-corner-logo mb-5" alt="Logo Dea Bakery" height="75" width="75" />
                <h1 class="fw-bolder text-center mb-10">Login POS</h1>
                <div class="form-group">
                  <input type="email" bind:value={credentials.email} class="form-control rounded-input my-3 text-center" placeholder="Let's check your email" required />
                  <input type="password" bind:value={credentials.password} class="form-control rounded-input my-3 text-center" placeholder="What about your password?" required />
                  <button type="submit" class="btn btn-sm fw-bold btn-danger w-100 hover-scale">Sign In</button>
                </div>
              </div>
            </div>

        </div>
      </form>
    </div>
  {:else }
    <Navbar />
  {/if}
</div>
