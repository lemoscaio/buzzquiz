const API_BUZZQUIZZ = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";

let correctAnswerPercentage = 0;
let eachAnswerPercentage = 0;

let quiz = null

let counterAnswer = 0


// Functions definition

function getAllQuizzes() {
    let promise = axios.get(API_BUZZQUIZZ);
    promise.then(printAllQuizzes);

}

function printAllQuizzes(response) {
    let quizzesList = response.data;

    quizzesList.forEach(quiz => {
        let id = quiz.id;
        let title = quiz.title;
        let image = quiz.image;
        let questions = quiz.questions;
        let levels = quiz.levels;

        let quizTemplate = `<article class="quizzes__quiz quiz" id="${id}" onclick="openQuiz(this)">
        <img src="${image}" alt="Quizz image" class="quiz__image">
        <h3 class="quiz__title">${title}</h3>
    </article>`

        const allQuizzesEl = document.querySelector(".quizzes__all-quizzes")
        allQuizzesEl.innerHTML += quizTemplate
    });

}

function openQuiz(quiz) {
    let quizID = quiz.id;
    getQuiz(quizID);
}

function getQuiz(quizID) {
    let promise = axios.get(API_BUZZQUIZZ + `/${quizID}`);
    promise.then(displayQuiz);

}

function displayQuiz(response) {
    slidePage()

    const quizPageEl = document.querySelector(".page-quiz")

    quiz = response.data

    let id = quiz.id;
    let title = quiz.title;
    let image = quiz.image;
    let questions = quiz.questions;
    let levels = quiz.levels;

    let templateQuizQuestions = ""
    let templateQuizAnswers = ""

    questions.forEach(question => {

        let answers = question.answers.sort(() => Math.random() - 0.5)

        answers.forEach(answer => {
            templateQuizAnswers += `<div class="quiz__answer" onclick="clickCardAnswer(this)" data-isCorrectAnswer="${answer.isCorrectAnswer}"><img class="quiz__answer-image" src=${answer.image} alt=""><p class="quiz__answer-text">${answer.text}</p></div>`
        })

        templateQuizQuestions += `<article class="quiz__question" id="${"question-" + questions.indexOf(question)}"><h5 class="quiz__question-text">${question.title}</h5><div class="quiz__answers">${templateQuizAnswers}</div></article>`

        templateQuizAnswers = ""
    })

    let templateQuizGeneralInfo = `<div class="quiz"><section class="quiz__header"><img src="${image}" alt="Quiz image" class="quiz__header-image"><h4 class="quiz__header-title">${title}</h4></section><section class="quiz__questions questions">${templateQuizQuestions}</section></div>`

    quizPageEl.innerHTML += templateQuizGeneralInfo

}

function clickCardAnswer(answer) {
    let totalQuestions = document.querySelectorAll(".quiz__question").length
    counterAnswer += 1
    eachAnswerPercentage = 100 / totalQuestions



    // Get all siblings of the answer and check the answer
    let siblingAnswerEl = answer.parentNode.firstChild
    while (siblingAnswerEl !== null) {
        if (siblingAnswerEl === answer) {
            if (answer.getAttribute("data-iscorrectanswer") === "true") {
                correctAnswerPercentage += eachAnswerPercentage
                answer.classList.add("correct")
            } else {
                answer.classList.add("wrong")
            }
        } else {
            siblingAnswerEl.classList.add("not-selected");
            siblingAnswerEl.removeAttribute("onclick");
            if (siblingAnswerEl.getAttribute("data-iscorrectanswer") === "true") {
                siblingAnswerEl.classList.add("correct");
            } else { siblingAnswerEl.classList.add("wrong"); }
        }
        siblingAnswerEl = siblingAnswerEl.nextElementSibling;
    };

    // Scroll to next question after 2 seconds
    let questionEl = answer.parentNode.parentNode.nextElementSibling
    if (questionEl !== null) {
        setTimeout(() => questionEl.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" }),2000)
    }

    // Calls the result function when counter gets to total of questions
    if (counterAnswer === totalQuestions) {
        // Get the integer of the percentage
        let fixedPercentage = correctAnswerPercentage.toFixed(0)
        setTimeout(showResult, 2000, fixedPercentage)
    }
}

function showResult(correctAnswerPercentage) {
    let levels = quiz.levels;

    let templateResult = ""

    levels.forEach(level => {
        if (correctAnswerPercentage >= level.minValue) {
            templateResult = `<section class="quiz__result">
    <article class="quiz__result-card">
        <h5 class="quiz__result-title">${correctAnswerPercentage}% de acerto: ${level.title}</h5>
        <div class="quiz__result-info">
            <img class="quiz__result-image" src=${level.image} alt="">
            <p class="quiz__result-text">${level.text}</p>
        </div>
    </article>
</section>
<section class="quiz__restart">
                <button class="quiz__restart-button">Reiniciar Quizz</button>
                <p class="quiz__restart-home">Voltar pra home</p>
            </section>`}
    })

    const pageQuizEl = document.querySelector(".page-quiz")

    pageQuizEl.innerHTML += templateResult
    pageQuizEl.lastChild.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
}

// Temporary functions (for test purposes only)
function slidePage() {
    document.querySelector(".page-quizzes").classList.toggle("hide")
    document.querySelector(".page-quiz").classList.toggle("hide")
}

// initializing functions
getAllQuizzes()
