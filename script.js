var fruitList = document.getElementById("fruitList");
var leftButton = document.getElementById("left");
var rightButton = document.getElementById("right");

var fruits = document.querySelectorAll(".item");

var currentPosition = 0;
var fruitGap = 10;
var fruitsPerPage = 4;

var selectedFruit = null;
var originalFruit = null;
var originalItem = null;
var startBox = null;

var moveX = 0;
var moveY = 0;

function getAvailableFruits() {

    var availableFruits = [];

    fruits.forEach(function(item) {

        if (item.parentElement === fruitList) {
            availableFruits.push(item);
        }

    });

    return availableFruits;
}

function showFruits() {

    var availableFruits = getAvailableFruits();

    var fruitWindow = fruitList.parentElement;

    var firstFruit = availableFruits[0];

    var fruitWidth = firstFruit
        ? firstFruit.getBoundingClientRect().width + fruitGap
        : 95;

    var visibleWidth = fruitWindow.clientWidth;

    var visibleCount = Math.floor(
        (visibleWidth + fruitGap) / fruitWidth
    );

    if (visibleCount < fruitsPerPage) {
        visibleCount = fruitsPerPage;
    }

    var maxPosition = Math.max(
        0,
        (availableFruits.length - visibleCount) * fruitWidth
    );

    currentPosition = Math.max(
        0,
        Math.min(currentPosition, maxPosition)
    );

    fruitList.style.transform =
        "translateX(-" + currentPosition + "px)";

    leftButton.disabled = currentPosition <= 0;
    rightButton.disabled = currentPosition >= maxPosition;

}

rightButton.onclick = function() {

    var availableFruits = getAvailableFruits();

    if (availableFruits.length === 0) {
        return;
    }

    var firstFruit = availableFruits[0];

    var fruitWidth =
        firstFruit.getBoundingClientRect().width + fruitGap;

    currentPosition += fruitWidth * fruitsPerPage;

    showFruits();

};

leftButton.onclick = function() {

    var availableFruits = getAvailableFruits();

    if (availableFruits.length === 0) {
        currentPosition = 0;
        showFruits();
        return;
    }

    var fruitWidth =
        availableFruits[0].getBoundingClientRect().width + fruitGap;

    currentPosition -= fruitWidth * fruitsPerPage;

    if (currentPosition < 0) {
        currentPosition = 0;
    }

    showFruits();

};

var fruitWindow = fruitList.parentElement;

fruitWindow.addEventListener("wheel", function(event) {

    event.preventDefault();

    var availableFruits = getAvailableFruits();

    if (availableFruits.length === 0) {
        return;
    }

    var fruitWidth =
        availableFruits[0].getBoundingClientRect().width + fruitGap;

    if (event.deltaY > 0 || event.deltaX > 0) {
        currentPosition += fruitWidth;
    } else {
        currentPosition -= fruitWidth;
    }

    showFruits();

}, { passive: false });

document.addEventListener("mousedown", function(event) {

    var fruit = event.target.closest(".fruit-icon");

    if (fruit == null) {
        return;
    }

    originalFruit = fruit;

    originalItem = fruit._originalItem || fruit.closest(".item");

    startBox = fruit.closest(".name-box");

    selectedFruit = fruit.cloneNode(true);

    selectedFruit.style.position = "fixed";
    selectedFruit.style.zIndex = "1000";
    selectedFruit.style.pointerEvents = "none";
    selectedFruit.style.margin = "0";
    selectedFruit.style.transform = "scale(1.3)";

    document.body.appendChild(selectedFruit);

    var rect = fruit.getBoundingClientRect();

    moveX = event.clientX - rect.left;
    moveY = event.clientY - rect.top;

    moveFruit(event);

    event.preventDefault();

});

document.addEventListener("mousemove", function(event) {

    if (selectedFruit == null) {
        return;
    }

    moveFruit(event);

    document.querySelectorAll(".name-box").forEach(function(box) {
        box.classList.remove("drag-over");
    });

    var target = document.elementFromPoint(
        event.clientX,
        event.clientY
    );

    if (target != null) {

        var box = target.closest(".name-box");

        if (box != null) {
            box.classList.add("drag-over");
        }

    }

});

function moveFruit(event) {

    selectedFruit.style.left =
        (event.clientX - moveX) + "px";

    selectedFruit.style.top =
        (event.clientY - moveY) + "px";

}

document.addEventListener("mouseup", function(event) {

    if (selectedFruit == null) {
        return;
    }

    var target = document.elementFromPoint(
        event.clientX,
        event.clientY
    );

    var nameBox = target
        ? target.closest(".name-box")
        : null;

    var inPanel = target != null &&
        (target === fruitList || fruitList.contains(target));

    if (nameBox != null) {

        originalFruit._originalItem = originalItem;

        nameBox.appendChild(originalFruit);

        originalFruit.style.position = "static";
        originalFruit.style.pointerEvents = "auto";
        originalFruit.style.transform = "none";

        if (originalItem != null) {
            originalItem.style.display = "none";
        }

    }

    else if (inPanel && startBox != null) {

        if (originalItem != null) {

            originalItem.insertBefore(
                originalFruit,
                originalItem.querySelector("p")
            );

            originalItem.style.display = "block";

            originalFruit.style.position = "static";
            originalFruit.style.pointerEvents = "auto";
            originalFruit.style.transform = "none";

        }

    }

    else if (startBox != null && originalItem != null) {

        originalItem.insertBefore(
            originalFruit,
            originalItem.querySelector("p")
        );

        originalItem.style.display = "block";

        originalFruit.style.position = "static";
        originalFruit.style.pointerEvents = "auto";
        originalFruit.style.transform = "none";

    }

    selectedFruit.remove();

    document.querySelectorAll(".name-box").forEach(function(box) {
        box.classList.remove("drag-over");
    });

    selectedFruit = null;
    originalFruit = null;
    originalItem = null;
    startBox = null;

    currentPosition = 0;
    showFruits();

});

showFruits()