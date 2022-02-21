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

    let templateQuizGeneralInfo = `<div class="quiz"><section class="quiz__header"><img src="${image}" alt="Quiz image" class="quiz__header-image"><h4 class="quiz__header-title">${title}</h4></section><section class="quiz__questions questions">${templateQuizQuestions}</section></div><section class="quiz__result"></section><section class="quiz__restart"><button onclick="resetQuiz()" class="quiz__restart-button">Reiniciar Quizz</button><p class="quiz__restart-home" onclick="goToHome()">Voltar pra home</p>`

    quizPageEl.innerHTML += templateQuizGeneralInfo

    document.querySelector(".quiz__header").scrollIntoView(false)
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

            if (siblingAnswerEl.getAttribute("data-iscorrectanswer") === "true") {
                siblingAnswerEl.classList.add("correct");
            } else { siblingAnswerEl.classList.add("wrong"); }
        }
        siblingAnswerEl = siblingAnswerEl.nextElementSibling;
    };

    // Scroll to next question after 2 seconds
    let questionEl = answer.parentNode.parentNode.nextElementSibling
    if (questionEl !== null) {
        setTimeout(() => questionEl.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" }), 50)
    }

    // Calls the result function when counter gets to total of questions
    if (counterAnswer === totalQuestions) {
        // Get the integer of the percentage
        let fixedPercentage = Math.ceil(correctAnswerPercentage)
        setTimeout(showResult, 500, fixedPercentage)
    }
}

function showResult(correctAnswerPercentage) {
    let levels = quiz.levels;

    let templateResult = ""

    levels.forEach(level => {
        if (correctAnswerPercentage >= level.minValue) {
            templateResult = `<article class="quiz__result-card">
        <h5 class="quiz__result-title">${correctAnswerPercentage}% de acerto: ${level.title}</h5>
        <div class="quiz__result-info">
            <img class="quiz__result-image" src=${level.image} alt="">
            <p class="quiz__result-text">${level.text}</p>
        </div>
    </article>
</section>`}
    })

    const quizResultEl = document.querySelector(".quiz__result");

    quizResultEl.innerHTML += templateResult;
    quizResultEl.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
}

function resetQuiz() {
    correctAnswerPercentage = 0;
    eachAnswerPercentage = 0;
    counterAnswer = 0;

    const answerListEl = [...document.querySelectorAll(".quiz__answer")]

    answerListEl.map((answerEl) => {
        if (answerEl.classList.contains("not-selected")) {
            answerEl.classList.remove("not-selected")
        }
        if (answerEl.classList.contains("wrong")) {
            answerEl.classList.remove("wrong")
        } else if (answerEl.classList.contains("correct")) {
            answerEl.classList.remove("correct")
        }
    })

    document.querySelector(".quiz__header").scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })

    const quizResultEl = document.querySelector(".quiz__result");

    if (quizResultEl) {
        setTimeout(() => {
            quizResultEl.innerHTML = ""
        }, 500)
    }
}

function goToHome() {
    resetQuiz();
    slidePage();

    const quizPageEl = document.querySelector(".page-quiz");

    quizPageEl.innerHTML = "";
}


// Temporary functions (for test purposes only)
function slidePage() {
    document.querySelector(".page-quizzes").classList.toggle("hide")
    document.querySelector(".page-quiz").classList.toggle("hide")
}

// initializing functions
getAllQuizzes()


function goToCreateQuestions(){
    document.querySelector(".basic-info").classList.add("hide");
    document.querySelector(".Create-questions").classList.remove("hide");
}
function goToCreateLevels(){
    document.querySelector(".Create-questions").classList.add("hide");
    document.querySelector(".Create-levels").classList.remove("hide");
}
function goToCreationEnd(){
    document.querySelector(".Create-levels").classList.add("hide");
    document.querySelector(".Creation-End").classList.remove("hide");
}

function botaoteste(){  
    document.querySelector(".page-quizzes").classList.add("hide");
    document.querySelector(".Create-Quiz").classList.remove("hide");

}

function preventElements(event){
    event.preventDefault()
}

document.getElementById("questionForm").addEventListener("submit", function(event){
    event.preventDefault()
})
document.getElementById("levelForm").addEventListener("submit", function(event) {
    event.preventDefault();
})

function createContainerQuestion(){
    let number = document.getElementById("qInput").value 
    let htmlResute = ""
    for(i=0; i<number; i++){
        htmlResute += `<h2 class="Create-question">Pergunta ${i + 1}</h2>
        <input id="question_text_${i}" class="question-textInput" type="text" required minlength="20" placeholder="Texto da pergunta"
            name="input">
        <input id="question_background_${i}" class="question-backgroundInput" type="text" required placeholder="Cor de fundo da pergunta"
            name="input">

        <h2 class="Create-question">Resposta correta</h2>
        <input id="right_answer_${i}" class="right-answerInput" type="text" required placeholder="Resposta correta" name="input">
        <input id="right_answer_image${i}" class="URL-IMGInput" type="url" required placeholder="URL da imagem" name="input">

        <h2 class="Create-question">Respostas incorretas</h2>
        <input id="first_wrong_answer_${i}" class="wrong-answerInput" type="text" required placeholder="Resposta incorreta 1" name="input">
        <input id="first_wrong_answer_image_${i}" class="URL-IMGInput" type="url" required placeholder="URL da imagem 1" name="input">
        <input id="second_wrong_answer_${i}" class="wrong-answerInput" type="text"  placeholder="Resposta incorreta 2" name="input">
        <input id="second_wrong_answer_image_${i}" class="URL-IMGInput" type="url"  placeholder="URL da imagem 2" name="input">
        <input id="third_wrong_answer_${i}" class="wrong-answerInput" type="text"  placeholder="Resposta incorreta 3" name="input">
        <input id="third_wrong_answer_image_${i}" class="URL-IMGInput" type="url"  placeholder="URL da imagem 3" name="input">` 

    }
    let questionConteiner = document.getElementById("questionContainer")
    questionConteiner.innerHTML = htmlResute

   goToCreateQuestions()
}

function createLevelQuiz(){
    let number = document.getElementById("nInput").value 
    let htmlResute = ""
    for(i=0; i<number; i++){
        htmlResute += `<h2 class="Create-level">Nível 1</h2>
        <input id="level_text_${i}" class="wrong-answerInput" type="text" minlength="10" placeholder="Título do nível" name="input">
        <input id="level_percent_${i}" class="URL-IMGInput" type="url" placeholder="% de acerto mínima" name="input">
        <input id="level_background_${i}" class="wrong-answerInput" type="text" placeholder="URL da imagem do nível" name="input">
        <input id="level_description_${i}" class="URL-IMGInput" type="url" minlength="30" placeholder="Descrição do nível" name="input">` 
    }

    let questionConteiner = document.getElementById("levelContainer")
    questionConteiner.innerHTML = htmlResute

   goToCreateLevels()
}





function Collapse(){

}
