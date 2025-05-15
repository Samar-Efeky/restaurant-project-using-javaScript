// navigation bar  ............................................................//
export function navbar(){
    let navbarList=document.querySelector(".icons .fa-bars");
    let closedNavbar=document.querySelector(".icons .fa-xmark");
    let sidebarIcon=document.getElementById("list-navbar");
    let closeSidebar=document.getElementById("close-side-bar");
    let sidebar=document.querySelector(".side-bar");
    let navbar=document.querySelector(".navbar-links");
    let linkNavbar = document.querySelectorAll(".navbar-links a");
    const mediaQuery = window.matchMedia("(max-width: 950px)");
    // active navigation bar links .................................................//
    function removeActiveClass() {
        linkNavbar.forEach(link => link.classList.remove("active"));
    };
    linkNavbar.forEach((link)=>{
        link.addEventListener("click",(e)=>{
            if(window.innerWidth<=950){
                navbar.style.display="none";
                closedNavbar.style.display="none";
                navbarList.style.display="block";
            }
            removeActiveClass();
            e.target.classList.add("active");
        });
    });
    linkNavbar.forEach((link)=>{
        let currentUrl=location.pathname.replace("/","");
        if(link.getAttribute("href")===currentUrl||link.getAttribute("href")===currentUrl+location.hash){
            link.classList.add("active");
        }    
    })
      
    // navigation bar links in small screens ..................//
    mediaQuery.addEventListener("change",(e)=>{
        if (!e.matches) {
            navbar.style.display = "flex";
            navbarList.style.display = "none";
            closedNavbar.style.display = "none";
        } else {
            navbar.style.display = "none";
            navbarList.style.display = "block";
            closedNavbar.style.display = "none";
        }
    });
    navbarList.addEventListener("click",()=>{
        navbar.style.display = "block";
        navbarList.style.display = "none";
        closedNavbar.style.display = "block";
    });
    closedNavbar.addEventListener("click",()=>{
            navbar.style.display = "none";
            navbarList.style.display = "block";
            closedNavbar.style.display = "none";
    });
    // side bar ................................................//
    sidebarIcon.addEventListener("click",()=>{
        sidebar.style.right="0%";
    });
    closeSidebar.addEventListener("click",()=>{
        sidebar.style.right="-100%";
    });
}