<script lang="ts">
	import '$lib/auth_style.css';
	import { goto } from "$app/navigation";
	import meie from "$lib/images/meie.jpg";
	import logo from '$lib/images/DMlogo.svg';
</script>

<section class="container">
	<div class="header">
		<div class="logo">
			<button on:click={() => goto("/home")} on:keydown> <img src={logo} class="logo-img" alt="logo"></button>
		</div>
		<div class="vertical-border"></div>
		<div class="login-text">
			<button on:click={() => goto("/login")} on:keydown>Logi sisse</button>
		</div>
		<div class="vertical-border"></div>
		<div class="register-text">
			<button on:click={() => goto("/register")} on:keydown>Registreeru</button>
		</div>
	</div>
	<div class="rectangle">
		<h1>Kes me oleme?</h1>
		<img src={meie} class="meie-img" alt=“meie”>
		<div class="tekst">
			<p>
				Meie oleme Tallinna Ülikooli Digitehnoloogiate Instituudi informaatika esimese aasta tudengid. <br> <br>Meie õpingud ja huvid ulatuvad tarkvaraarendusest digitaalsete meedialahendusteni, ning oleme valmis jagama oma teekonda ja eesmärke.
				<br><br>
				Jarl Koha on pühendunud tarkvaraarenduse suunale. Elika Laur, Õnnela Link, Albert Berkman ja Gertrud Roos on kõik spetsialiseerunud digitaalsele meediale.
				<br><br>
				Meil on hea meel tutvustada meie rakendust nimega Valiku Võlur, mis on loodud selleks, et aidata kasutajatel teha innovatiivseid ja teadlikke otsuseid. Valiku Võlur on mõeldud neile, kes soovivad oma valikuid optimeerida ja leida parimaid lahendusi keerulistes olukordades.
				<br><br>
				Valiku Võlur kasutab erinevaid meetodeid ja algoritme, et pakkuda kasutajatele personaliseeritud soovitusi ja lahendusi. Rakendus analüüsib kasutaja sisestatud andmeid ja eelistusi, et pakkuda optimaalseid valikuvõimalusi.
				<br><br>
				Meie eesmärk on rakendada oma teadmisi ja oskusi, et lahendada reaalseid probleeme ning panustada innovatsiooni ja arengusse nii tehnoloogia kui ka meedia valdkonnas. Oleme põnevil oma tuleviku ees ja ootame, et saaksime oma teadmisi ja loomingulisust rakendada erinevates projektides ja algatustes.
			</p>
		</div>
	</div>
</section>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh; 
	}

	.rectangle {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start; 
		border-radius: 20px;
		width: 100vh; 
		height: auto; 
		background: white; 
		border-top-right-radius: 38px; 
		border-bottom-right-radius: 38px;
		box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
		padding-top: 300px; 
	}

	.rectangle h1 {
		font-size: 80px;
		font-weight: 700;
		padding-top: 300px;
	}

	.header {
		background-color: #C4F1C0;
		box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.3);
		width: 100%;
		height: 90px;
		display: grid;
		grid-template-columns: 10fr max-content 1fr max-content 1fr;
		justify-content: flex-end;
		align-items: center;
		position: fixed;
		top: 0;
		border-bottom: 4px solid #035114;
		z-index: 2;
		overflow: hidden;
		border-right: 4px solid #035114;
	}

	.vertical-border {
		height: 100%;
		width: 0;
		border-left: 4px solid #035114;
	}

	button {
		background-color: #C4F1C0;
		font-family: 'Merriweather', serif;
		justify-content: center;
		color: #000;
		font-size: 20px;
		border: none;
		padding: 10px 20px; 
		cursor: pointer; 
		transition: background-color 0.3s; 
		margin-left: 10px;
	}

	button:hover {
		background-color: #a8e0a4; 
	}

	.logo-img:hover{
		background-color: #a8e0a4;
	}

	.meie-img {
		padding: 10px;
		width: 600px; 
		height: auto;
	}

	.tekst{
		padding: 30px;
	}

	.login-text{
		padding-right: 15px;
	}

	.logo img.logo-img {
		transform: translateX(-50%);
		width: 100px;
		height: 80px;
	}

	.logo-img{
		padding-left: 100px;
	}
</style>
