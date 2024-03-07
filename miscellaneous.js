//dölj eller visa sorting och filter knappar, flytta till todo sen
//välja knapparna
let showFiltersBtnsNodes = document.querySelectorAll(".showFiltersBtn");
let showSortingBtnsNodes = document.querySelectorAll(".showSortingBtn");

//eventlisteners på knapparna
showFiltersBtnsNodes.forEach(function(button) {
    button.addEventListener('click', function() {
        //välja rutan
        let parentBox = this.parentNode;
        let parentColumn = parentBox.parentNode;//tekniskt sett väljer detta grandparent till knappen, men ändå

        let closestFilterBox = parentColumn.querySelector('.filterBox');

        //toggla klassen .hide när man klickar
        closestFilterBox.classList.toggle('hide');
    });
});

//sortering
showSortingBtnsNodes.forEach(function(button) {
    button.addEventListener('click', function() {
        //välja rutan
        let parentBox = this.parentNode;
        let parentColumn = parentBox.parentNode;
        let closestSortingBox = parentColumn.querySelector('.sortingBox');

        //toggla klassen .hide när man klickar
        closestSortingBox.classList.toggle('hide');
    });
});
