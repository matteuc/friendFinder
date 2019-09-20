var questions = ["This is a question"];

var questionContainer = $("#questionContainer");
var userInfoContainer = $("#userInfoContainer");
var submitBtn = $("#submit-btn");
var submitBtn_DEFAULT = $("#default-btn-text");
var submitBtn_LOADING = $("#loading-btn-text");
var postSurveyBtns = $("#post-survey-btns");
var restartBtn = $("#restart-btn");
var homeBtn = $("#home-btn");
var name = $("#name");
var photo = $("#photo");
var nameError = $("#name-error-prompt");
var photoError = $("#photo-error-prompt");

var DEFAULT_VALUE = 5;
var NAME_ERROR = "Please enter your name.";
var IMAGE_ERROR = "Please enter a valid image URL.";

questionContainer.empty();

$.each(questions, function (questionNumber, questionText) {
    var question = $("<div class='slidecontainer'>");
    question.attr("data-questionNumber", questionNumber);
    var questionTitle = $("<h3 class='text-center'>");
    questionTitle[0].innerText = questionText;
    var slider = $('<input type="range" min="0" max="10" value="5" class="slider">');
    var sliderValue = $(`<p class="text-center"><strong><span id='slider-q${questionNumber}-value'>5</span></strong></p>`)
    question.append(questionTitle).append("<br>").append(slider).append(sliderValue);

    questionContainer.append(question);
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
    var nameVal = name.val().trim();
    var photoURL = photo.val().trim();
    if (name.length === 0) {
        // Show error message in error prompt
        nameError.text(NAME_ERROR);
        return;
    }

    // Check if photo exists at the provided URL
    var image = new Image();
    image.src = photoURL;
    var imageExists = true;

    image.onerror = function () {
        // image did not load
        imageExists = false;
    }

    if (!imageExists) {
        // Show error message in error prompt
        photoError.text(IMAGE_ERROR);
        return;
    }

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
        // var sliderValue = $(`#slider-q${questionNumber}-value`);
        newFriend.answers.push($(this).val());
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
            // ! Display the most compatible person for the user (from variable data)

            // show buttons to retake quiz or go to home page
            postSurveyBtns.show();
        });


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

    // Hide user info input and questions
    userInfoContainer.show();
    questionContainer.show();

    // Show submit buttons and hide post survey buttons
    submitBtn.show();
    postSurveyBtns.hide();
}