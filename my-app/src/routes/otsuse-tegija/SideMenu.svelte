<script>
	import logo from '$lib/images/DMlogo.svg';
    import homeIcon from '$lib/images/home.svg';
    import choicesIcon from '$lib/images/choices.svg';
    import resultsIcon from '$lib/images/results.svg';
    import groupsIcon from '$lib/images/groups.svg';
    import premiumIcon from '$lib/images/premium.svg';
    import logoutIcon from '$lib/images/logout.svg';
</script>

<style>
    .container{
        display: flex;
        flex-direction: column;
        background: #ffffff;
        width: max-content;

        border: 1px solid black;
        box-shadow: 2px 0px 4px rgba(0, 0, 0, 0.24);
        border-radius: 0px 10px 10px 0px;

        padding: 20px;
    }

    .logo {
        display: flex;
        gap: 20px;
        padding: 20px;
        height: max-content;
        min-width: 200px;
        align-items: center;
    }

    .menu-item {
        display: flex;
        gap: 20px; 
        padding: 10px 30px; 
        border-radius: 40px;
        height: max-content;
        min-width: 200px;
        align-items: center;

    }

    .active-menu-item {
        display: flex;
        gap: 20px; 
        padding: 10px 30px; 
        border-radius: 40px;
        height: max-content;
        min-width: 200px;
        align-items: center;
        background: #CFFFCB;

    }

    .menu-item:hover,
    .menu-item.active {
        background: #CFFFCB;
        cursor: pointer;
    }
</style>

<div class="container">
    <div class="logo">
        <img src={logo} alt="logo"/>
        <p>Desicion Maker</p>
    </div>
    <div class="menu-item">
        <img src={homeIcon} alt="Home icon" width="35px" height="35px"/>
        <p><a href="/">Peamenüü</a></p>
    </div>
    <div class="active-menu-item">
        <img src={choicesIcon} alt="Choices icon" width="35px"/>
        <p>Otsuste tegija</p>
    </div>
    <div class="menu-item">
        <img src={resultsIcon} alt="Results icon" width="35px"/>
        <p>Tulemused</p>
    </div>
    <div class="menu-item">
        <img src={groupsIcon} alt="Groups icon" width="35px"/>
        <p>Grupid</p>
    </div>
    <div class="menu-item">
        <img src={premiumIcon} alt="Premium icon" width="35px"/>
        <p>Osta tasuline</p>
    </div>

    <div class="menu-item">
        <img src={logoutIcon} alt="Log Out" width="35px"/>
        <p>Logi välja</p>
    </div>
</div>