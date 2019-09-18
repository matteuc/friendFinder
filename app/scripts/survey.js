var questions = ["This is a question"];

var questionContainer = $("#questionContainer")

$.each(questions, function(questionNumber, questionText) {
    var question = $("<div class='slidecontainer'>");
    question.attr("data-questionNumber", questionNumber);
    var questionTitle = $("<h3 class='text-center'>");
    questionTitle[0].innerText = questionText;
    var slider = $('<input type="range" min="0" max="10" value="5" class="slider">');
    var sliderValue = $(`<p class="text-center"><strong><span id='slider-q${questionNumber}-value'>5</span></strong></p>`)
    question.append(questionTitle).append("<br>").append(slider).append(sliderValue);
    
    questionContainer.append(question);
})

var sliders = $(".slider");

// Update the current slider value (each time you drag the slider handle)
sliders.change(function () {
    var questionNumber = $(this).parent().attr("data-questionNumber");
    $(`#slider-q${questionNumber}-value`)[0].innerText = $(this)[0].value;
})