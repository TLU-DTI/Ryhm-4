<script lang="ts">
	import '$lib/auth_style.css';
	import { goto } from "$app/navigation";
	import logo from '$lib/images/DMlogo.svg';

	</script>
<section class="container">
	<div class="header">
			<div class="about"><button on:click={() => goto("/about")} on:keydown>Meie Kohta</button></div>
			<div class="vertical-border"></div>
			<div class="login-text"><button on:click={() => goto("/login")} on:keydown>Logi sisse</button></div>
			<div class="vertical-border"></div>
			<div class="register-text"><button on:click={() => goto("/register")} on:keydown>Registreeru</button></div>
	</div>
	<div class="icontainer">
			<div class="ellipse1"></div>
			<div class="ellipse2"></div>
			<div class="ellipse3"></div>
			<div class="ellipse4">
				<img src={logo} class="logo-img" alt="logo">
		</div>
			<div class="nimi">
					<h1>Valiku Võlur</h1>
			</div>
			<div class="moto">
				<p><em>Võta juhtimine enda kätte – Valiku Võlur.<br>
					Sinu teejuht paremate valikuteni!</em></p></div>
	</div>
</section>


<style>
	* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    overflow: hidden; 
}

.container {
    width: 100vw;
    height: 100vh;
    display: flex;
    position: fixed;
    flex-direction: column;
    justify-content: center; 
    align-items: center; 
    background-color: #C4F1C0;
    overflow: hidden; 
}

.nimi {
    position: absolute;
    top: 40%; 
    left: 50%; 
    font-size: 80px;
    transform: translate(-50%, -50%); 
    text-align: center; 
    width: 100%;
}

.nimi h1 {
    color: #000;
    margin: 0;
		font-size: 100px;
		font-weight: 700;
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

.icontainer {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden; 
}

.ellipse1 {
    position: absolute;
    width: 787px;
    height: 644px;
    background-color: #035114;
    border-radius: 50% / 50%;
    bottom: -222px; 
    left: -293.5px; 
}

.moto {
    color: #000;
    text-align: center;
		position: absolute;
    top: 60%; 
    left: 50%; 
		transform: translate(-50%, -50%); 
    text-align: center; 
    width: 100%;
}

.moto p{
	font-size: 30px;
}

.ellipse2 {
    position: absolute;
    width: 787px;
    height: 644px;
    background-color: #035114;
    border-radius: 50% / 50%;
    bottom: -322px;
    right: -193.5px;
    z-index: 1;
}

.ellipse3 {
    position: absolute;
    width: 787px;
    height: 644px;
    background-color: #92D48C;
    border-radius: 50% / 50%;
    top: -150px;
    right: 0;
    transform: translate(50%, 50%);
}

.ellipse4 {
    position: absolute;
    width: 787px;
    height: 644px;
    background-color: #92D48C;
    border-radius: 50% / 50%;
    top: -400px;
    left: -593.5px;
    transform: translate(50%, 50%);
    z-index: 0; 
}
.ellipse4 img.logo-img {
		position: absolute;
		top: 230px; 
		left: 450px;
		transform: translateX(-50%);
		width: 320px;
		padding: 20px;
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
</style>
