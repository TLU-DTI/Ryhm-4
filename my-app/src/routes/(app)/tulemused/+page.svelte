<script>
    import Button from "$lib/components/Button.svelte";
    import { goto } from "$app/navigation";
</script>
<svelte:head>
    <title>Home</title>
    <meta name="description" content="Svelte demo app" />
</svelte:head>
<section class="container">
    <div class="icontainer">
        <div class="header">
        <h2>Otsusmudeli tulemused:</h2>
        </div>
        <div class="box">
            <div class="otsusnimi">
                <p>Otsusmudeli nimi:</p>
                <div class="nimi">
                    <p>Nimi</p>
                </div>
            </div>
            <div class="kritnimi">
                <p>Kriteeriumid:</p>
                <div class="kriteerium1">
                    <p>kriteerium1</p>
                </div>
                <div class="kriteerium2">
                    <p>kriteerium2</p>
                </div>
                <div class="kriteerium3">
                    <p>kriteerium3</p>
                </div>
                <div class="kriteerium4">
                    <p>kriteerium4</p>
                </div>
            </div>
            <div class="prioriteet">
                <p>Prioriteet:</p>
                <div class="protsent1">
                    <p>40.0%</p>
                </div>
                <div class="protsent2">
                    <p>10.0%</p>
                </div>
                <div class="protsent3">
                    <p>20.0%</p>
                </div>
                <div class="protsent4">
                    <p>30.0%</p>
                </div>
            </div>
            <div class="tulemused">
                <div class="tul">
                    <div class="tul1">
                        <p>BMW</p>
                    </div>
                    <div class="tul2">
                        <p>Audi</p>
                    </div>
                    <div class="tul3">
                        <p>VW</p>
                    </div>
                    <div class="tul4">
                        <p>Volvo</p>
                    </div>
                </div>
                <div class="prosad">
                    <div class="prosa1">
                        <p>6.6%</p>
                    </div>
                    <div class="prosa2">
                        <p>15.2%</p>
                    </div>
                    <div class="prosa3">
                        <p>67.4%</p>
                    </div>
                    <div class="prosa4">
                        <p>10.9%</p>
                    </div>
                </div>
            </div>
        </div>
        <br>
        <div class="buttons">
            <Button size="large" on:click={() => goto("/")} on:keydown>Lõpeta
            </Button>
        </div>
    </div>
</section>
<style>
    .buttons{
        margin-top: 20px;
        display: flex;
        justify-content: center;
    }
    section.container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 0.7;
    }
    .icontainer {
        background-color: white;
        border-radius: 20px;
        width: 100%;
        height: 500px;
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1); /* varjuefekt */
        padding-bottom: 90px;
    }

    .icontainer h2{
        text-align: center;
        margin-right: 10px;
        font-size: 35px;
    }
    .header{
        padding: 15px;
    }

    .box {
        display: flex;
        flex-direction: row;
        gap: 10px; 
    }
    .otsusnimi {
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 30px;
        background-color: #F2F1E7;
        border-width: 1px;
        width: 220px;
        height: 200px;
        margin-left: 25px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
    }

    .otsusnimi p {
        text-align: center;
        font-size: 25px;
        margin-top: 10px;
    }

    .nimi {
        border-radius: 30px;
        background-color: white;
        border-width: 10px;
        width: 80px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
        padding: 0 10px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    }

    .nimi p {
        margin: 0; 
        text-align: center;
        font-size: 20px;
    }
    .kritnimi{
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 30px;
        background-color: #F2F1E7;
        border-width: 1px;
        width: 200px;
        height: 340px;
        margin-left: 1px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
    }
    .kritnimi p{
        text-align: center;
        font-size: 25px;
    }
    .kriteerium1{
        border-radius: 20px;
        background-color: white;
        border-width: 1px;
        margin-bottom: 10px;
        width: 150px;
        border-radius: 30px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    }
    .kriteerium2{
        border-radius: 20px;
        background-color: white;
        border-width: 1px;
        margin-bottom: 10px;
        width: 150px;
        border-radius: 30px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    }
    .kriteerium3{
        border-radius: 20px;
        background-color: white;
        border-width: 1px;
        border-radius: 30px;
        width: 150px;
        margin-bottom: 10px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    }
    .kriteerium4{
        border-radius: 20px;
        background-color: white;
        border-width: 1px;
        border-radius: 30px;
        width: 150px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    }
    .kriteerium1 p {
        margin: 0; 
        font-size: 20px;
        text-align: center;
    }
    .kriteerium2 p {
        margin: 0; 
        font-size: 20px;
        text-align: center;
    }
    .kriteerium3 p {
        margin: 0; 
        font-size: 20px;
        text-align: center;
    }
    .kriteerium4 p {
        margin: 0; 
        font-size: 20px;
        text-align: center;
    }
    .prioriteet{
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 30px;
        background-color: #F2F1E7;
        border-width: 1px;
        width: 150px;
        height: 340px;
        margin-left: 1px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
    }
    .prioriteet p{
        text-align: center;
        font-size: 25px;
    }
    .protsent1{
        border-radius: 20px;
        background-color: #C4F1C0;
        border-width: 1px;
        margin-bottom: 10px;
        width: 100px;
        border-radius: 30px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    }
    .protsent2{
        border-radius: 20px;
        background-color: #C4F1C0;
        border-width: 1px;
        margin-bottom: 10px;
        width: 100px;
        border-radius: 30px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    }
    .protsent3{
        border-radius: 20px;
        background-color: #C4F1C0;
        border-width: 1px;
        border-radius: 30px;
        width: 100px;
        margin-bottom: 10px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    }
    .protsent4{
        border-radius: 20px;
        background-color: #C4F1C0;
        border-width: 1px;
        border-radius: 30px;
        width: 100px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    }
    .protsent1 p {
        margin: 0; 
        font-size: 20px;
        text-align: center;
    }
    .protsent2 p {
        margin: 0; 
        font-size: 20px;
        text-align: center;
    }
    .protsent3 p {
        margin: 0; 
        font-size: 20px;
        text-align: center;
    }
    .protsent4 p {
        margin: 0; 
        font-size: 20px;
        text-align: center;
    }
    .tulemused {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 30px;
    background-color: #F2F1E7;
    border-width: 1px;
    width: 300px;
    height: 110px;
    padding: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
}

.tul, .prosad {
    display: flex;
    flex-direction: row;
    gap: 5px; 
}

.tul1, .prosa1,
.tul2, .prosa2,
.tul3, .prosa3,
.tul4, .prosa4 {
    border-radius: 30px;
    background-color: #C4F1C0;;
    border-width: 1px;
    margin-bottom: 5px; 
    margin-top: 5px;    
    width: 65px;        
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    text-align: center; 
    font-size: 14px;    
    padding: 5px; 
}
.prosa1, .prosa2, .prosa3, .prosa4{
    background-color: white;;
    }

.prosa3{
    background-color: #058521;
    color: white;
}
</style>