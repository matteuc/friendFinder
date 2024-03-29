var questionContainer = $("#questionContainer");
var userInfoContainer = $("#userInfoContainer");

var matchContainer = $("#matchContainer");
var matchName = $("#match-name");
var matchPhoto = $("#match-photo");

var submitBtn = $("#submit-btn");
var submitBtn_DEFAULT = $("#default-btn-text");
var submitBtn_LOADING = $("#loading-btn-text");

var postSurveyBtns = $("#post-survey-btns");
var restartBtn = $("#restart-btn");
var homeBtn = $("#home-btn");

var name = "#name";
var photo = "#photo";
var nameError = $("#name-error-prompt");
var photoError = $("#photo-error-prompt");

var DEFAULT_VALUE = 5;
var NAME_ERROR = "Please enter your name.";
var IMAGE_ERROR = "Please enter a valid image URL.";

questionContainer.empty();

$.each(questions, function (questionNumber, questionText) {
    var questionCard = $("<div class='card slidecontainer'>");

    var cardHeader = $("<div class='card-header'>");
    cardHeader.text(`Question #${questionNumber + 1}`);

    var cardBody = $("<div class='card-body'>");
    cardBody.attr("data-questionNumber", questionNumber);


    var questionTitle = $("<h5 class='card-title text-center'>");
    questionTitle[0].innerText = questionText;
    var slider = $('<input type="range" min="0" max="10" value="5" class="slider">');
    var sliderValue = $(`<p class="text-center"><strong><span id='slider-q${questionNumber}-value'>5</span></strong></p>`)
    
    cardBody.append(questionTitle).append("<br>").append(slider).append(sliderValue);

    questionCard.append(cardHeader).append(cardBody)
    
    questionContainer.append(questionCard).append("<br>");
})

submitBtn.show();

var sliders = $(".slider");

// Update the current slider value (each time you drag the slider handle)
sliders.change(function () {
    var questionNumber = $(this).parent().attr("data-questionNumber");
    $(`#slider-q${questionNumber}-value`)[0].innerText = $(this)[0].value;
})

submitBtn.on("click", function (e) {
    e.preventDefault();

    // Clear error messages
    nameError.text("");
    photoError.text("");

    // Check if every part of the form is filled out (i.e name and photo)
    var nameVal = $(name).val().trim();
    var photoURL = $(photo).val().trim();
    if (nameVal.length === 0) {
        // Show error message in error prompt
        nameError.text(NAME_ERROR);
        return;
    }

    // Check if photo exists at the provided URL

    var img = document.createElement('img');
    img.src = photoURL;


    img.onerror = function () {
        // image did not load
        // Show error message in error prompt
        photoError.text(IMAGE_ERROR);
        return;
    }

    // Image provided exists, proceed to rest of function
    img.onload = function () {

        // Show loading while submitting the object and calculating compatibility
        submitBtn_DEFAULT.hide();
        submitBtn_LOADING.show();

        var newFriend = {
            name: nameVal,
            profile: photoURL,
            answers: []
        }

        // Retrieve the answers
        sliders.each(function () {
            newFriend.answers.push(parseInt($(this).val()));
        })

        $.post("/api/friends", newFriend,
            function (data) {
                // Hide user info input and questions
                userInfoContainer.hide();
                questionContainer.hide();

                // Reset button text but hide it from view
                submitBtn.hide();
                submitBtn_DEFAULT.show();
                submitBtn_LOADING.hide();

                var bestMatch = data;
                // Display the most compatible person for the user (from variable data)
                matchName.text(bestMatch.name);
                matchPhoto.attr("src", bestMatch.profile)
                matchContainer.show();

                // show buttons to retake quiz or go to home page
                postSurveyBtns.show();
            });


    }
})

restartBtn.on("click", function (e) {
    e.preventDefault();
    restartQuiz();
})

function resetQuestions() {
    sliders.each(function () {
        $(this).val(DEFAULT_VALUE);
    })
}

function restartQuiz() {
    // Reset Survey questions
    resetQuestions();

    // Hide match information, user info input, and questions
    matchContainer.hide();
    userInfoContainer.show();
    questionContainer.show();

    // Show submit buttons and hide post survey buttons
    submitBtn.show();
    postSurveyBtns.hide();
}

$(document).ready(function() {
    $("[data-link]").click(function() {
      window.location.href = $(this).attr("data-link");
      return false;
    });
  });