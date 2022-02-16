
const API_BUZZQUIZZ = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";

// Functions definition

function getQuizzes() {
    let promise = axios.get(API_BUZZQUIZZ);
    promise.then(printQuizzes);

}

function printQuizzes(response) {
    let quizzesList = response.data;
    console.log(quizzesList);

    quizzesList.forEach(quiz => {
        let id = quiz.id;
        let title = quiz.title;
        let image = quiz.image;
        let questions = quiz.questions;
        let levels = quiz.levels;

        let quizTemplate = `<article class="quizzes__quiz quiz">
        <img src="${image}" alt="Quizz image" class="quiz__image">
        <h3 class="quiz__title">${title}</h3>
    </article>`

        const allQuizzesEl = document.querySelector(".quizzes__all-quizzes")
        allQuizzesEl.innerHTML += quizTemplate
    });

}

// Temporary functions (for test purposes only)
function slidePage() {
    document.querySelector(".quizzes").classList.toggle("hide-slide")
}


// initializing functions
getQuizzes()
