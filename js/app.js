/**
 * 
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 * 
 * Dependencies: None
 * 
 * JS Version: ES2015/ES6
 * 
 * Pure Vanilla JS ONLY [NO plugins or Libraries are used]
 * 
 * JS Standard: ESlint
 * 
*/

/**
 * Define Global Variables
 * 
*/
let pageHeader       = document.querySelector("header.page__header"),
    navList          = document.querySelectorAll("nav.navbar__menu ul#navbar__list"),
    allSections      = document.querySelectorAll("main section"),
    opinionsSlider   = document.querySelector(".customers .opinions"),
    slidesArray      = opinionsSlider.querySelectorAll(".opinion"),
    activeOpinion    = document.querySelector(".customers .opinions .opinion.active"),
    lastOpinion      = slidesArray[slidesArray.length -1],
    firstOpinion     = slidesArray[0],
    leftArrow        = document.querySelector(".customers i.fa-chevron-left"),
    rightArrow       = document.querySelector(".customers i.fa-chevron-right"),
    navButton        = document.querySelector(".navbar__menu[data-screen = 'mobile'] .button"),
    mobileMenu       = document.querySelector(".navbar__menu[data-screen = 'mobile'] ul#navbar__list"),
    toTopButton      = document.querySelector("button.top-button"),
    offersSpecs      = document.querySelector(".offers .offers-specs"),
    topfooter        = document.querySelector("footer.page__footer .top-footer");

const Fragment = document.createDocumentFragment();
var time;
/**
 * End Global Variables
 * Start Helper Functions
 * 
*/

// Get siblings of any element
function getSiblings(elem) {
	// Setup siblings array and get the first sibling
	let siblings = [];
    let sibling = elem.parentElement.firstChild;
    // Loop through each sibling and push to the array
	while (sibling) {
		if (sibling.nodeType === 1 && sibling !== elem) {
			siblings.push(sibling);
        }
        sibling = sibling.nextSibling
	}
    return siblings;
};

// Scroll to specific section smoothly when clicking on a navbar link
function scrollTo(element) {
    window.scroll({
      behavior: 'smooth',
      left: 0,
      top: element.offsetTop
    });
}

// Set multiple attributes for an element
function setAttributes(element, attributes) {
    Object.keys(attributes).forEach(attribute => {
      element.setAttribute(attribute, attributes[attribute]);
    });
}

/**
 * End Helper Functions
 * Begin Main Functions
 * 
*/

// Check if the user is no longer scrolling.
function checkScroll(){
    time = setTimeout(function() {
       if(window.pageYOffset > 86) {
        pageHeader.style.top = "-100%"
       }
    }, 4000); 
}

// Check the last and first slides existance state in the customers slider
function check() {
    if(lastOpinion.classList.contains("active")) {
        rightArrow.style.display = "none"; 
     } else {
         rightArrow.style.display = "initial"
     }

     if(firstOpinion.classList.contains("active")) {
        leftArrow.style.display = "none"; 
     } else {
        leftArrow.style.display = "initial";
     }
}

check();

// Build the navbar as anchors for each section existed in the page
// First Way: using appendChild, createElement & Fragment (for Best Performance)
function buildNav() {
    let listItem,
        anchor;
    allSections.forEach(section => {
        listItem = document.createElement("li");
        anchor   = document.createElement("a");
        setAttributes(anchor, {
            href: "#",
            class: "menu__link transition",
            "data-scroll": `#${section.getAttribute("id")}`
        });
        anchor.innerText = `${section.getAttribute("id")}`;
        listItem.appendChild(anchor);
        Fragment.appendChild(listItem);
    });

    let ClonedFragment = Fragment.cloneNode(true);
    for(let i = 0; i < navList.length; i++) {
        navList[0].appendChild(Fragment);
        navList[1].appendChild(ClonedFragment);
    }
}

buildNav();

// Build the navbar as anchors for each section existed in the page
// Second Way: using innerHtml & Template Literals (Not Best for Performance)
/*function buildNav() {
    let html;
    allSections.forEach(section => {
        html = `<li><a href="#" data-scroll="#${section.getAttribute("id")}" class="menu__link transition">${section.getAttribute("id")}</a></li>`
        navList.forEach(list => {
            list.innerHTML += html;
        });
    });
}

buildNav();*/

/**
 * End Main Functions
 * Begin Events
 * 
*/

// when clicking on a navbar anchor
navList.forEach(list => {
    list.addEventListener("click", (e) => {
        if(e.target.nodeName === "A") {
            let listSiblings = getSiblings(e.target.parentElement);
            e.preventDefault();
            e.target.classList.add("active");
            listSiblings.forEach(sibling => {
                sibling.firstChild.classList.remove("active");
            });
            // Remove class 'active-section' from all sections on link click
            allSections.forEach(section => {
                section.classList.remove("active-section");
            });
    
            // Add class 'active-section' to the specific section on link click 
            let activeSection = document.querySelector(`${e.target.dataset.scroll}`);
            activeSection.classList.add("active-section");
    
            // Scroll to the active section on link click
            scrollTo(activeSection);
        }
    });
});

// Synchronous nav while scrolling
window.addEventListener("scroll", () => {
    let currentScrollPos = window.pageYOffset;
    pageHeader.style.top = "0";
    clearTimeout(time);
    checkScroll();
    for (let i = 0; i < allSections.length; i++) {
        let sectionID = allSections[i].getAttribute("id"),
            sectionHeight = allSections[i].offsetHeight,
            sectionTop = allSections[i].offsetTop - 88,
            desktopScreenAnchor = document.querySelector(`nav.navbar__menu[data-screen = 'desktop'] ul#navbar__list li a[data-scroll = '#${sectionID}']`),
            mobileScreenAnchor = document.querySelector(`nav.navbar__menu[data-screen = 'mobile'] ul#navbar__list li a[data-scroll = '#${sectionID}']`);
            
        if ((currentScrollPos > sectionTop) && (currentScrollPos <= (sectionTop + sectionHeight))) {
            desktopScreenAnchor.classList.add("active");
            mobileScreenAnchor.classList.add("active");
            allSections[i].classList.add("active-section");
        }
        else {
            desktopScreenAnchor.classList.remove("active");
            mobileScreenAnchor.classList.remove("active");
            allSections[i].classList.remove("active-section");
        }
    }

    // Control the visability of the to top button
    if (window.pageYOffset >= 800) {
        toTopButton.style.display = "block";
    } else {
        toTopButton.style.display = "none";
    }
});

// When clicking on the right arrow of the customers slider
rightArrow.addEventListener("click", () => {
    activeOpinion.classList.remove("active");
    let nextActive = activeOpinion.parentElement.nextElementSibling.firstElementChild;
    nextActive.classList.add("active");
    activeOpinion = nextActive;
    check();
});

// When clicking on the left arrow of the customers slider
leftArrow.addEventListener("click", () => {
    activeOpinion.classList.remove("active");
    let prevActive = activeOpinion.parentElement.previousElementSibling.firstElementChild;
    prevActive.classList.add("active");
    activeOpinion = prevActive;
    check();
});

// When clicking on the nav button for mobile screen mode
navButton.addEventListener("click", () => {
    navButton.classList.toggle("transformed");
    if(navButton.classList.contains("transformed")) {
        mobileMenu.style.display = "block";
    } else {
        mobileMenu.style.display = "none";
    }
});

// When clicking on the to top buuton
toTopButton.addEventListener("click", () => {
    scrollTo(pageHeader);
});

// When clicking on offers specs
offersSpecs.addEventListener("click", (e) => {
    if (e.target.classList.contains("spec")) {
        e.target.classList.add("active", "white-color", "theme__bg");
        e.target.classList.remove("text-dark", "bg-light");
        let offersSpecSiblings = getSiblings(e.target.parentElement);
        offersSpecSiblings.forEach(sibling => {
            sibling.firstElementChild.classList.remove("active", "white-color", "theme__bg");
            sibling.firstElementChild.classList.add("text-dark", "bg-light");
        });

        let offersBox = document.querySelector(`.offers-boxes .box#${e.target.getAttribute("id")}`);
        offersBox.classList.add("active");
        let offersBoxSiblings = getSiblings(offersBox);
        offersBoxSiblings.forEach(sibling => {
            sibling.classList.remove("active");
        });
    }
});

// When clicking on footer anchors
topfooter.addEventListener("click", (e) => {
    if(e.target.nodeName === "A") {
        e.preventDefault();
        let targetSection = document.querySelector(`section${e.target.dataset.scroll}`);
        scrollTo(targetSection);
    }
});