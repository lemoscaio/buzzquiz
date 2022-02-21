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

    const allQuizzesEl = document.querySelector(".quizzes__all-quizzes")
    allQuizzesEl.innerHTML = ""

    quizzesList.forEach(quiz => {
        let id = quiz.id;
        let title = quiz.title;
        let image = quiz.image;

        let quizTemplate = `<article class="quizzes__quiz quiz" id="${id}" onclick="openQuiz(this)">
        <img src="${image}" alt="Quizz image" class="quiz__image">
        <h3 class="quiz__title">${title}</h3>
    </article>`

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
    showLoadingPage();
    
    // SetTimeout only for demonstration purposes (loading animation)
    let promise = axios.get(API_BUZZQUIZZ + `/${quizID}`)
    setTimeout(() => {promise.then(displayQuiz)}, 500);
}

function displayQuiz(response) {
    changePage("page-quizzes", "page-quiz")
    
    hideLoadingPage()
    const quizPageEl = document.querySelector(".page-quiz")

    quiz = response.data

    let title = quiz.title;
    let image = quiz.image;
    let questions = quiz.questions;

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
    getAllQuizzes()
    resetQuiz();
    changePage("page-quiz", "page-quizzes");
    
    const quizPageEl = document.querySelector(".page-quiz");

    quizPageEl.innerHTML = "";
}

function showLoadingPage(parentDivEl) {
    document.querySelector(".loading--page.hide").classList.remove("hide")
}

function showLoading(dataAttribute) {
    let parentDiv = (document.querySelector("[data-quizzes=" + dataAttribute + "]"))
    parentDiv.querySelector(".loading.hide").classList.remove("hide")
}

function hideLoading(dataAttribute) {
    let parentDiv = (document.querySelector("[data-quizzes=" + dataAttribute + "]"))
    parentDiv.querySelector(".loading").classList.add("hide")
}

function hideLoadingPage() {
    document.querySelector(".loading--page").classList.add("hide")
}

function empty() {
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

function editQuiz(quizID) {
    alert("soon you'll be able to edit the quiz")
}

function deleteQuiz(quizID) {
    let deleteAnswer = prompt("Do you really want to delete this quiz? Y for Yes / N for No")

    if (deleteAnswer !== "Y") return

    alert("soon you'll be able to delete the quiz")

    const deleteQuiz = axios.create({
        headers: { "Secret-Key": localStorage.getItem("chave") }
    })

    deleteQuiz.delete("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/" + quizID)

}



// initializing functions
getAllQuizzes()


function goToCreateQuestions() {
    document.querySelector(".create-quiz__basic-info").classList.add("hide");
    document.querySelector(".create-quiz__create-questions").classList.remove("hide");
}
function goToCreateLevels() {
    document.querySelector(".create-quiz__create-questions").classList.add("hide");
    document.querySelector(".create-quiz__create-levels").classList.remove("hide");
}
function goToCreationEnd() {
    document.querySelector(".create-quiz__create-levels").classList.add("hide");
    document.querySelector(".create-quiz__quiz-summary").classList.remove("hide");
}

function botaoteste() {
    document.querySelector(".page-quizzes").classList.add("hide");
    document.querySelector(".Create-Quiz").classList.remove("hide");

}

function preventElements(event) {
    event.preventDefault()
}

document.getElementById("basicInfoForm").addEventListener("submit", function (event) {
    event.preventDefault()
})
document.getElementById("questionForm").addEventListener("submit", function (event) {
    event.preventDefault()
})
document.getElementById("levelForm").addEventListener("submit", function (event) {
    event.preventDefault();
})

function createContainerQuestion() {
    let number = document.getElementById("qInput").value
    let htmlResute = ""
    for (i = 0; i < number; i++) {
        htmlResute += `<div class="create-quiz__question">
        <div class="create-quiz__question-header">
            <h2 onclick="Collapse(${i}, 'question')" class="create-quiz__input-title">Pergunta ${i + 1} <span id="question_icon_${i}" class="create-quiz__edit-icon hide"></span>
            </h2>
        </div>
        <div id="question_item_${i}" class="create-quiz__question-info">
            <div class="create-quiz__input-set">
                <input id="title_${i}" class="create-quiz__question-title-input input" type="text" required minlength="20"
                    placeholder="Texto da pergunta" name="input">
                <input id="color_${i}" class="create-quiz__question-background-input input" type="text" required
                    placeholder="Cor de fundo da pergunta" name="input">
            </div>
            <div class="create-quiz__input-set">
                <h2 class="create-quiz__input-title">Resposta correta</h2>
                <input id="right_answer_text_${i}" class="create-quiz__correct-answer-input input" type="text" required
                    placeholder="Resposta correta" name="input">
                <input id="right_answer_image_${i}" class="create-quiz__image-input input" type="url" required
                    placeholder="URL da imagem" name="input">
            </div>
            <h2 class="create-quiz__input-title">Respostas incorretas</h2>
            <div class="create-quiz__input-set">
                <input id="first_wrong_answer_text_${i}" class="create-quiz__wrong-answer-input input" type="text" required
                    placeholder="Resposta incorreta 1" name="input">
                <input id="first_wrong_answer_image_${i}" class="create-quiz__image-input input" type="url" required
                    placeholder="URL da imagem 1" name="input">
            </div>
            <div class="create-quiz__input-set">
                <input id="second_wrong_answer_text_${i}" class="create-quiz__wrong-answer-input input" type="text" 
                    placeholder="Resposta incorreta 2" name="input">
                <input id="second_wrong_answer_image_${i}" class="create-quiz__image-input input" type="url" 
                    placeholder="URL da imagem 2" name="input">
            </div>
            <div class="create-quiz__input-set">
                <input id="third_wrong_answer_text_${i}" class="create-quiz__wrong-answer-input input" type="text" 
                    placeholder="Resposta incorreta 3" name="input">
                <input id="third_wrong_answer_image_${i}" class="create-quiz__image-input input" type="url" 
                    placeholder="URL da imagem 3" name="input">
            </div>
        </div>
    </div>`

    }
    let questionConteiner = document.getElementById("questionContainer")
    questionConteiner.innerHTML = htmlResute

    goToCreateQuestions()
}

function createLevelQuiz() {
    let number = document.getElementById("nInput").value
    let htmlResute = ""
    for (i = 0; i < number; i++) {
        htmlResute += `<div class="create-quiz__level">
        <div class="create-quiz__level-header">
            <h2 onclick="Collapse(${i}, 'level')" class="create-quiz__input-title">Nível ${i + 1} <span id="level_icon_${i}" class="create-quiz__edit-icon hide"></span>
            </h2>
        </div>
        <div id="level_item_${i}" class="create-quiz__level-info">
            <div class="create-quiz__input-set">
                <input id="title_${i}" class="create-quiz__level-title-input input" type="text" minlength="10"
                    placeholder="Título do nível" name="input">
                <input id="minValue_${i}" class="create-quiz__level-background-input input" type="number"
                    placeholder="% de acerto mínima" name="input">
                <input id="image_${i}" class="create-quiz__level-image-input input" type="text"
                    placeholder="URL da imagem do nível" name="input">
                <input id="text_${i}" class="create-quiz__level-description-input input" minlength="30"
                    placeholder="Descrição do nível" name="input">
            </div>
        </div>
    </div>`
    }

    let questionConteiner = document.getElementById("levelContainer")
    questionConteiner.innerHTML = htmlResute

    goToCreateLevels()
}

function saveAndGoToEnd() {
    let questionNumber = document.getElementById("qInput").value
    let levelNumber = document.getElementById("nInput").value
    let quizTitle = document.getElementById("quizTitle").value;
    let quizImage = document.getElementById("quizImage").value;

    const questions = []
    const levels = []

    for (let qIndex = 0; qIndex < questionNumber; qIndex++) {
        const title = document.getElementById(`title_${qIndex}`).value;
        const color = document.getElementById(`color_${qIndex}`).value;

        //Answers
        const rightAnswer = {
            text: document.getElementById(`right_answer_text_${qIndex}`).value,
            image: document.getElementById(`right_answer_image_${qIndex}`).value,
            isCorrectAnswer: true
        }
        const firstWrongAnswer = {
            text: document.getElementById(`first_wrong_answer_text_${qIndex}`).value,
            image: document.getElementById(`first_wrong_answer_image_${qIndex}`).value,
            isCorrectAnswer: false
        }
        const secondWrongAnswer = {
            text: document.getElementById(`second_wrong_answer_text_${qIndex}`).value,
            image: document.getElementById(`second_wrong_answer_image_${qIndex}`).value,
            isCorrectAnswer: false
        }
        const thirdWrongAnswer = {
            text: document.getElementById(`third_wrong_answer_text_${qIndex}`).value,
            image: document.getElementById(`third_wrong_answer_image_${qIndex}`).value,
            isCorrectAnswer: false
        }

        const answers = [rightAnswer, firstWrongAnswer];
        if (secondWrongAnswer.text !== "" && secondWrongAnswer.image !== "")
            answers.push(secondWrongAnswer)
        if (thirdWrongAnswer.text !== "" && thirdWrongAnswer.image !== "")
            answers.push(thirdWrongAnswer)

        let question = {
            title: title,
            color: color,
            answers: answers
        }

        questions.push(question)
    }

    for (let nIndex = 0; nIndex < levelNumber; nIndex++) {
        const level = {
            title: document.getElementById(`title_${nIndex}`).value,
            image: document.getElementById(`image_${nIndex}`).value,
            text: document.getElementById(`text_${nIndex}`).value,
            minValue: document.getElementById(`minValue_${nIndex}`).value,
        }

        levels.push(level);
    }

    const quiz = {
        title: quizTitle,
        image: quizImage,
        questions: questions,
        levels: levels
    }

    axios.post(API_BUZZQUIZZ, quiz)
        .then(goToCreationEnd).catch(() => alert("Deu erro"))

}



function Collapse(indice, type) {
    console.log(indice, type)
    const item = document.getElementById(`${type}_item_${indice}`)
    const icon = document.getElementById(`${type}_icon_${indice}`)
    if (item.classList.contains("hide"))
        item.classList.remove("hide")
    else
        item.classList.add("hide")
    if (icon.classList.contains("hide"))
        icon.classList.remove("hide")
    else
        icon.classList.add("hide")
}
