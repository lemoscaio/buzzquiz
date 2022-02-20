const API_BUZZQUIZZ = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";


let correctAnswerPercentage = 0;
let eachAnswerPercentage = 0;

let quiz = null

let counterAnswer = 0


// Functions definition

function getAllQuizzes() {
    let promise = axios.get(API_BUZZQUIZZ);

    showLoading("allQuizzes");

    // SetTimeout only for demonstration purposes (loading animation)
    setTimeout(() => { promise.then(printAllQuizzes) }, 1500);
}

function printAllQuizzes(response) {
    hideLoading("allQuizzes")

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

function getUserQuizzes() {
    let promise = axios.get(API_BUZZQUIZZ);

    showLoading("userQuizzes");

    // SetTimeout only for demonstration purposes (loading animation)
    setTimeout(() => { promise.then(printAllQuizzes) }, 1500);
}

function openQuiz(quiz) {
    let quizID = quiz.id;
    let promise = axios.get(API_BUZZQUIZZ + `/${quizID}`);
    promise.then(displayQuiz);
}

function displayQuiz(response) {
    changePage("page-quizzes", "page-quiz")

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
    changePage("page-quiz", "page-quizzes");

    const quizPageEl = document.querySelector(".page-quiz");

    quizPageEl.innerHTML = "";
}

function showLoading(dataAttribute) {
    let parentDiv = (document.querySelector("[data-quizzes=" + dataAttribute + "]"))
    parentDiv.querySelector(".loading.hide").classList.remove("hide")
}

function hideLoading(dataAttribute) {
    let parentDiv = (document.querySelector("[data-quizzes=" + dataAttribute + "]"))
    parentDiv.querySelector(".loading").classList.add("hide")
}

function changePage(pageOut, pageIn) {
    document.querySelector("." + pageOut).classList.toggle("hide")
    document.querySelector("." + pageIn).classList.toggle("hide")
}

// Temporary functions (for test purposes only)

let resposta = null
let dados = null
let quizzDoCaio = {}
let quizID = null

function createQuiz() {
    quizzDoCaio = {
        title: "Título do quizz (eeee)",
        image: "https://http.cat/411.jpg",
        questions: [
            {
                title: "Título da pergunta 1",
                color: "#123456",
                answers: [
                    {
                        text: "Texto da resposta 1",
                        image: "https://http.cat/411.jpg",
                        isCorrectAnswer: true
                    },
                    {
                        text: "Texto da resposta 2",
                        image: "https://http.cat/412.jpg",
                        isCorrectAnswer: false
                    }
                ]
            },
            {
                title: "Título da pergunta 2",
                color: "#123456",
                answers: [
                    {
                        text: "Texto da resposta 1",
                        image: "https://http.cat/411.jpg",
                        isCorrectAnswer: true
                    },
                    {
                        text: "Texto da resposta 2",
                        image: "https://http.cat/412.jpg",
                        isCorrectAnswer: false
                    }
                ]
            },
            {
                title: "Título da pergunta 3",
                color: "#123456",
                answers: [
                    {
                        text: "Texto da resposta 1",
                        image: "https://http.cat/411.jpg",
                        isCorrectAnswer: true
                    },
                    {
                        text: "Texto da resposta 2",
                        image: "https://http.cat/412.jpg",
                        isCorrectAnswer: false
                    }
                ]
            }
        ],
        levels: [
            {
                title: "Título do nível 1",
                image: "https://http.cat/411.jpg",
                text: "Descrição do nível 1",
                minValue: 0
            },
            {
                title: "Título do nível 2",
                image: "https://http.cat/412.jpg",
                text: "Descrição do nível 2",
                minValue: 50
            }
        ]
    }

    axios.post("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes", quizzDoCaio).then((response) => {
        console.log(response)
        resposta = response
        dados = resposta.data
        quizID = dados.id
        localStorage.setItem("chave", dados.key)
    })
}

function deleteQuiz(quizID) {

    const deleteQuiz = axios.create({
        headers: { "Secret-Key": localStorage.getItem("chave") }
    })

    deleteQuiz.delete("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/" + quizID)

}

// initializing functions
getAllQuizzes()
