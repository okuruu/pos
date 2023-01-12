<script lang="ts">
    import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
</script>
<div class="container">
    <div class="card card-flush shadow-sm my-7">
        <div class="card-body">

            <div class="d-flex justify-content-center my-20">
                <LottiePlayer src="/lottie/happy.json" autoplay="{true}" loop="{true}" renderer="svg" background="transparent" height="{250}" width="{250}"/>
            </div>
            <div class="text-center my-7">
                <h1 class="fw-bolder">No Reports Available.</h1>
            </div>

        </div>
    </div>
</div>