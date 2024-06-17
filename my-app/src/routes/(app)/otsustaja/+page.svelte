<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import { goto } from "$app/navigation";
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { page } from "$app/stores";
  let code: number | null = null

onMount(() => {
const urlCode = get(page).url.searchParams.get("code");
if (urlCode) {
  code = parseInt(urlCode, 10);
}
});

let valikud:{ title:string, lk: number}[] =[
  { title: "valik 1",lk:1 },
  { title: "valik 2",lk:2 },
  { title: "valik 3",lk:3 },
  { title: "valik 4",lk:4 }
]

let kriteeriumid: { title: string, lk: number}[] = [
  { title: "kriteerium 1",lk:1 },
  { title: "kriteerium 2",lk:2 },
  { title: "kriteerium 3",lk:3 },
  { title: "kriteerium 4",lk:4 }
];

</script>

<section class="container">
  <div class="button-container">
      <h2>Milline on Sinu valik, kui kriteeriumiks on:</h2>
      <div class="button-name">
          {#each kriteeriumid as kriteerium }
              {#if code===kriteerium.lk}
              <div class="nupp">{kriteerium.title}</div>
              {/if}
          {/each}
          <br>
          <div class="form">
          <form class="likert-form">
              <input type="radio" id="radio5" name="likert" value="5">
              <label for="radio5"></label>
              <input type="radio" id="radio4" name="likert" value="4">
              <label for="radio4"></label>
          
              <input type="radio" id="radio3" name="likert" value="3">
              <label for="radio3"></label>
          
              <input type="radio" id="radio2" name="likert" value="2">
              <label for="radio2"></label>
          
              <input type="radio" id="radio1" name="likert" value="1">
              <label for="radio1"></label>
            </form>
          </div>

      </div>
      <br>
      <div class="buttons">
          <Button style="secondary" on:click={() => goto("/")} on:keydown>Tagasi
          </Button>
          <Button on:click={() => goto("/tasuline-ot-valikud/otsusemudel")} on:keydown>Jätka</Button>
      </div>
  </div>
</section>

<style>
  section.container {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 0.7;
  }

  .button-container {
      background-color: white;
      display: flex;
      flex-direction: column;
      border-radius: 20px;
      padding: 50px;
      width: 1000px;
      height: 500px;
      height: auto;
      box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1); /* varjuefekt */
  }

  .button-name {
      display: flex; 
      align-items: center;
      flex-direction: column;
  }
  .nupp{
      padding: 10px;
      background-color: green;
      
  }
  
  .buttons{
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
  }

  h2{
      font-size: 30px;
  }
  
  .form{
      background-color: #fff;
box-shadow: 0 0 10px rgba(0,0,0,0.1);
padding: 20px;
width: 70%;
  }
  .likert-form {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      align-items: center;
      flex-direction: row;
  }

  input[type="radio"] + label {
  cursor: pointer;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-bottom: 5px;
  border-radius: 4px;
}


</style>