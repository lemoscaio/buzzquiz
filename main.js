
const API_BUZZQUIZZ = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";

// Functions definition

function getAllQuizzes() {
    let promise = axios.get(API_BUZZQUIZZ);
    promise.then(printAllQuizzes);

}

function printAllQuizzes(response) {
    let quizzesList = response.data;
    console.log(quizzesList);

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

// Temporary functions (for test purposes only)
function slidePage() {
    document.querySelector(".page-quizzes").classList.toggle("hide")
    document.querySelector(".page-quiz").classList.toggle("hide")
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

    let quiz = response.data

    let id = quiz.id;
    let title = quiz.title;
    let image = quiz.image;
    let questions = quiz.questions;
    let levels = quiz.levels;


    let templateQuizQuestions = ""
    let templateQuizOptions = ""

    questions.forEach(question => {

        let options = question.answers

        options.forEach(option => {
            templateQuizOptions += `<div class="quiz__option">
            <img class="quiz__option-image" src=${option.image} alt="">
            <p class="quiz__option-text">${option.text}</p>
            </div>`
        })

        templateQuizQuestions += `<article class="quiz__question">
            <h5 class="quiz__question-text">${question.title}</h5>
        <div class="quiz__options">
                ${templateQuizOptions}
            </div>
        </article>`

        templateQuizOptions = ""
    })

    let templateQuizGeneralInfo = `<div class="quiz">

    <section class="quiz__header">
        <img src="${image}" alt="Quiz image" class="quiz__header-image">
        <h4 class="quiz__header-title">${title}</h4>
    </section>
    <section class="quiz__questions questions">
        ${templateQuizQuestions}        
    </section>
</div>`

    quizPageEl.innerHTML += templateQuizGeneralInfo

}

// initializing functions
getAllQuizzes()
