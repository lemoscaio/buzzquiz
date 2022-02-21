const API_BUZZQUIZZ = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";

// Answer related counters
let correctAnswerPercentage = 0;
let eachAnswerPercentage = 0;
let counterAnswer = 0
// 
let quiz = null;
let userQuizzes = [];

function getAllQuizzes() {
    let promise = axios.get(API_BUZZQUIZZ);

    showLoading("allQuizzes");
    showLoading("userQuizzes");

    // SetTimeout only for demonstration purposes (loading animation)
    setTimeout(() => { promise.then(printAllQuizzes) }, 1500);
}

function printAllQuizzes(response) {
    hideLoading("allQuizzes");
    hideLoading("userQuizzes");

    let quizzesList = response.data;

    quizzesList = quizzesList.filter(filterUserQuizzes);

    const allQuizzesEl = document.querySelector(".quizzes__all-quizzes");
    allQuizzesEl.innerHTML = "";

    quizzesList.forEach(quiz => {
        let id = quiz.id;
        let title = quiz.title;
        let image = quiz.image;

        let quizTemplate = `<article class="quizzes__quiz quiz clickable" id="${id}" data-identifier="quizz-card" onclick="openQuiz(this)">
        <img src="${image}" alt="Quizz image" class="quiz__image">
        <h3 class="quiz__title">${title}</h3>
    </article>`;

        allQuizzesEl.innerHTML += quizTemplate;
    });

    printUserQuizzes();
}

function filterUserQuizzes(quiz) {
    if (localStorage.getItem(quiz.id.toString())) {
        userQuizzes.push(quiz);
        return false;
    } else {
        return true;
    }
}

function printUserQuizzes() {
    const userQuizzesEl = document.querySelector(".quizzes__user-quizzes");

    userQuizzesEl.innerHTML = "";

    if (userQuizzes.length === 0) {
        const emptyQuizEl = document.querySelector(".quizzes__user-empty");
        emptyQuizEl.classList.remove("hide");
        const userQuizTitleEl = document.querySelector(".quizzes__title-container");
        userQuizTitleEl.classList.add("hide");
    }

    userQuizzes.forEach(quiz => {
        let title = quiz.title;
        let image = quiz.image;
        let id = quiz.id;

        let userQuizTemplate = `<article class="quizzes__quiz quiz user-quiz" id="${id}" data-userQuiz="true" data-identifier="quizz-card" onclick="openQuiz(this)"><img src=${image} alt="Quiz image" class="quiz__image"><h3 class="quiz__title">${title}</h3><div class="quiz__modify-icons modify-icons"><img class="modify-icons__edit-icon" onclick="editQuiz(this), event.stopPropagation()" src="images/icons/edit-white.svg" alt="Edit icon"><img class="modify-icons__delete-icon" onclick="deleteQuiz(this), event.stopPropagation()" src="images/icons/delete-white.svg" alt="Delete icon"></div><div class="loading loading--card hide">
        <div class="loader loader--style3" title="2">
            <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px"
                viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
                <path fill="#000"
                    d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
                    <animateTransform attributeType="xml" attributeName="transform" type="rotate"
                        from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite" />
                </path>
            </svg>
        </div>
    </div></article>`;

        userQuizzesEl.innerHTML += userQuizTemplate;
    });

    userQuizzes = [];
}

function openQuiz(quiz) {
    let quizID = quiz.id;
    showLoadingPage();

    // SetTimeout only for demonstration purposes (loading animation)
    let promise = axios.get(API_BUZZQUIZZ + `/${quizID}`);
    setTimeout(() => { promise.then(displayQuiz) }, 500);
}

function displayQuiz(response) {
    changePage("page-quizzes", "page-quiz");

    hideLoadingPage();
    const quizPageEl = document.querySelector(".page-quiz");

    quiz = response.data;

    let title = quiz.title;
    let image = quiz.image;
    let questions = quiz.questions;

    let templateQuizQuestions = "";
    let templateQuizAnswers = "";

    questions.forEach(question => {

        let answers = question.answers.sort(() => Math.random() - 0.5);

        answers.forEach(answer => {
            templateQuizAnswers += `<div class="quiz__answer" data-identifier="answer" onclick="clickCardAnswer(this)" data-isCorrectAnswer="${answer.isCorrectAnswer}"><img class="quiz__answer-image" src=${answer.image} alt=""><p class="quiz__answer-text">${answer.text}</p></div>`;
        })

        templateQuizQuestions += `<article class="quiz__question" data-identifier="question" id="${" question-" + questions.indexOf(question)}"><h5 class="quiz__question-text" style="background-color:${question.color}" >${question.title}</h5><div class="quiz__answers">${templateQuizAnswers}</div></article>`;

        templateQuizAnswers = "";
    })

    let templateQuizGeneralInfo = `<div class="quiz"><section class="quiz__header"><img src="${image}" alt="Quiz image" class="quiz__header-image"><h4 class="quiz__header-title">${title}</h4></section><section class="quiz__questions questions">${templateQuizQuestions}</section></div><section class="quiz__result"></section><section class="quiz__restart"><button onclick="resetQuiz()" class="quiz__restart-button">Reiniciar Quizz</button><p class="quiz__restart-home" onclick="goToHome()">Voltar pra home</p>`;

    quizPageEl.innerHTML += templateQuizGeneralInfo;

    document.querySelector(".quiz__header").scrollIntoView(false);
}

function clickCardAnswer(answer) {
    let totalQuestions = document.querySelectorAll(".quiz__question").length;
    counterAnswer += 1;
    eachAnswerPercentage = 100 / totalQuestions;

    // Get all siblings of the answer and check the answer
    let siblingAnswerEl = answer.parentNode.firstChild;
    while (siblingAnswerEl !== null) {
        if (siblingAnswerEl === answer) {
            if (answer.getAttribute("data-iscorrectanswer") === "true") {
                correctAnswerPercentage += eachAnswerPercentage;
                answer.classList.add("correct");
            } else {
                answer.classList.add("wrong");
            }
        } else {
            siblingAnswerEl.classList.add("not-selected");

            if (siblingAnswerEl.getAttribute("data-iscorrectanswer") === "true") {
                siblingAnswerEl.classList.add("correct");
            } else {
                siblingAnswerEl.classList.add("wrong");
            }
        }
        siblingAnswerEl = siblingAnswerEl.nextElementSibling;
    }

    // Scroll to next question after 2 seconds
    let questionEl = answer.parentNode.parentNode.nextElementSibling;
    if (questionEl !== null) {
        setTimeout(() => questionEl.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" }), 50);
    }

    // Calls the result function when counter gets to total of questions
    if (counterAnswer === totalQuestions) {
        // Get the integer of the percentage
        let fixedPercentage = Math.ceil(correctAnswerPercentage);
        setTimeout(showResult, 500, fixedPercentage);
    }
}

function showResult(correctAnswerPercentage) {
    let levels = quiz.levels;

    let templateResult = "";

    levels.forEach(level => {
        if (correctAnswerPercentage >= level.minValue) {
            templateResult = `<article class="quiz__result-card" data-identifier="quizz-result">
        <h5 class="quiz__result-title">${correctAnswerPercentage}% de acerto: ${level.title}</h5>
        <div class="quiz__result-info">
            <img class="quiz__result-image" src=${level.image} alt="">
            <p class="quiz__result-text">${level.text}</p>
        </div>
    </article>
</section>`;
        }
    })

    const quizResultEl = document.querySelector(".quiz__result");

    quizResultEl.innerHTML += templateResult;
    quizResultEl.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
}

function resetQuiz() {
    correctAnswerPercentage = 0;
    eachAnswerPercentage = 0;
    counterAnswer = 0;

    const answerListEl = [...document.querySelectorAll(".quiz__answer")];

    answerListEl.map((answerEl) => {
        if (answerEl.classList.contains("not-selected")) {
            answerEl.classList.remove("not-selected");
        }
        if (answerEl.classList.contains("wrong")) {
            answerEl.classList.remove("wrong");
        } else if (answerEl.classList.contains("correct")) {
            answerEl.classList.remove("correct");
        }
    })

    const quizHeaderEl = document.querySelector(".quiz__header");

    if (quizHeaderEl) {
        quizHeaderEl.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    }


    const quizResultEl = document.querySelector(".quiz__result");

    if (quizResultEl) {
        setTimeout(() => {
            quizResultEl.innerHTML = ""
        }, 500);
    }
}

function goToHome() {
    getAllQuizzes();
    resetQuiz();
    const pagesList = [...document.querySelectorAll(".page")];
    pagesList.forEach((pageOnList) => {
        if (pageOnList.classList.contains("page-quizzes")) {
            pageOnList.classList.remove("hide");
        } else {
            pageOnList.classList.add("hide");
        }
    })

    const quizPageEl = document.querySelector(".page-quiz");

    quizPageEl.innerHTML = "";
}

function createQuiz() {
    document.querySelector(".page-quizzes").classList.add("hide");
    document.querySelector(".page-create-quiz").classList.remove("hide");
}

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

// Impedir atualização automatica do forms
function preventElements(event) {
    event.preventDefault();
}

document.getElementById("basicInfoForm").addEventListener("submit", function (event) {
    event.preventDefault();
})
document.getElementById("questionForm").addEventListener("submit", function (event) {
    event.preventDefault();
})
document.getElementById("levelForm").addEventListener("submit", function (event) {
    event.preventDefault();
})
// rendezirando paginas dinamicas da Criação de quiz

// Pagina de Questoes 
function createContainerQuestion() {
    let number = document.getElementById("qInput").value;
    let htmlResute = "";
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
    </div>`;

    }
    let questionConteiner = document.getElementById("questionContainer");
    questionConteiner.innerHTML = htmlResute;

    goToCreateQuestions();
}

// pagina de niveis
function createLevelQuiz() {
    let number = document.getElementById("nInput").value;
    let htmlResute = "";
    for (i = 0; i < number; i++) {
        htmlResute += `<div class="create-quiz__level">
        <div class="create-quiz__level-header">
            <h2 onclick="Collapse(${i}, 'level')" class="create-quiz__input-title">Nível ${i + 1} <span id="level_icon_${i}" class="create-quiz__edit-icon hide"></span>
            </h2>
        </div>
        <div id="level_item_${i}" class="create-quiz__level-info">
            <div class="create-quiz__input-set">
                <input id="level-title_${i}" class="create-quiz__level-title-input input" required type="text" minlength="10"
                    placeholder="Título do nível" name="input">
                <input id="level-minValue_${i}" class="create-quiz__level-background-input input" required required min="0" max="100" type="number"
                    placeholder="% de acerto mínima" name="input">
                <input id="level-image_${i}" class="create-quiz__level-image-input input" required type="text"
                    placeholder="URL da imagem do nível" name="input">
                <input id="level-text_${i}" class="create-quiz__level-description-input input" required minlength="30"
                    placeholder="Descrição do nível" name="input">
            </div>
        </div>
    </div>`;
    }

    let questionConteiner = document.getElementById("levelContainer");
    questionConteiner.innerHTML = htmlResute;

    goToCreateLevels();
}
// função para enviar quizz ao servidor
function saveAndGoToEnd() {
    let questionNumber = document.getElementById("qInput").value;
    let levelNumber = document.getElementById("nInput").value;
    let quizTitle = document.getElementById("quizTitle").value;
    let quizImage = document.getElementById("quizImage").value;

    const questions = []
    const levels = []
    // question post
    for (let qIndex = 0; qIndex < questionNumber; qIndex++) {
        const title = document.getElementById(`title_${qIndex}`).value;
        const color = document.getElementById(`color_${qIndex}`).value;

        //Answers
        const rightAnswer = {
            text: document.getElementById(`right_answer_text_${qIndex}`).value,
            image: document.getElementById(`right_answer_image_${qIndex}`).value,
            isCorrectAnswer: true
        };
        const firstWrongAnswer = {
            text: document.getElementById(`first_wrong_answer_text_${qIndex}`).value,
            image: document.getElementById(`first_wrong_answer_image_${qIndex}`).value,
            isCorrectAnswer: false
        };
        const secondWrongAnswer = {
            text: document.getElementById(`second_wrong_answer_text_${qIndex}`).value,
            image: document.getElementById(`second_wrong_answer_image_${qIndex}`).value,
            isCorrectAnswer: false
        };
        const thirdWrongAnswer = {
            text: document.getElementById(`third_wrong_answer_text_${qIndex}`).value,
            image: document.getElementById(`third_wrong_answer_image_${qIndex}`).value,
            isCorrectAnswer: false
        };

        const answers = [rightAnswer, firstWrongAnswer];
        if (secondWrongAnswer.text !== "" && secondWrongAnswer.image !== "")
            answers.push(secondWrongAnswer);
        if (thirdWrongAnswer.text !== "" && thirdWrongAnswer.image !== "")
            answers.push(thirdWrongAnswer);

        let question = {
            title: title,
            color: color,
            answers: answers
        };

        questions.push(question);
    }
    //level post
    for (let nIndex = 0; nIndex < levelNumber; nIndex++) {
        const level = {
            title: document.getElementById(`level-title_${nIndex}`).value,
            image: document.getElementById(`level-image_${nIndex}`).value,
            text: document.getElementById(`level-text_${nIndex}`).value,
            minValue: document.getElementById(`level-minValue_${nIndex}`).value,
        };

        levels.push(level);
    }
    // objeto a ser enviado
    const quiz = {
        title: quizTitle,
        image: quizImage,
        questions: questions,
        levels: levels
    };

    axios.post(API_BUZZQUIZZ, quiz)
        .then((response) => {
            let quizInString = JSON.stringify(quiz);
            localStorage.setItem(response.data.id.toString(), quizInString);
            let secretKey = "id" + response.data.id.toString();
            localStorage.setItem(secretKey, response.data.key.toString());
            goToCreationEnd();
        }).catch((error) => {
            alert("Deu erro");
            console.log(error);
        });
}
// collapse
function Collapse(indice, type) {
    console.log(indice, type);
    const item = document.getElementById(`${type}_item_${indice}`);
    const icon = document.getElementById(`${type}_icon_${indice}`);
    if (item.classList.contains("hide"))
        item.classList.remove("hide");
    else
        item.classList.add("hide");
    if (icon.classList.contains("hide"))
        icon.classList.remove("hide");
    else
        icon.classList.add("hide");
}

function editQuiz(quizID) {
    alert("soon you'll be able to edit the quiz");
}

function deleteQuiz(iconEl) {
    let quizEl = iconEl.parentNode.parentNode;
    let quizID = quizEl.getAttribute("id");

    if (window.confirm("Do you really want to delete this quiz?")) {
        const deleteQuiz = axios.create({
            headers: { "Secret-Key": localStorage.getItem("id" + quizID) }
        });

        let promise = deleteQuiz.delete("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/" + quizID)
        showLoadingCard();

        localStorage.removeItem("id" + quizID);
        localStorage.removeItem(quizID);

        setTimeout(() => {
            promise.then(() => {
                hideLoadingCard();
                quizEl.remove();

                const userQuizzesEl = document.querySelector(".quizzes__user-quizzes");

                userQuizzesEl.innerHTML = "";

                if (userQuizzes.length === 0) {
                    const emptyQuizEl = document.querySelector(".quizzes__user-empty");
                    emptyQuizEl.classList.remove("hide");
                    const userQuizTitleEl = document.querySelector(".quizzes__title-container");
                    userQuizTitleEl.classList.add("hide");
                }
            }).catch((error) => { console.log(error) })
        }, 1500);


    }
}

function showLoading(dataAttribute) {
    let parentDiv = (document.querySelector("[data-quizzes=" + dataAttribute + "]"));
    parentDiv.querySelector(".loading.hide").classList.remove("hide");
}

function showLoadingPage() {
    document.querySelector(".loading--page.hide").classList.remove("hide");
}

function showLoadingCard() {
    document.querySelector(".loading--card.hide").classList.remove("hide");
}

function hideLoading(dataAttribute) {
    let parentDiv = (document.querySelector("[data-quizzes=" + dataAttribute + "]"));
    parentDiv.querySelector(".loading").classList.add("hide");
}

function hideLoadingPage() {
    document.querySelector(".loading--page").classList.add("hide");
}

function hideLoadingCard() {
    document.querySelector(".loading--card").classList.add("hide");
}

function changePage(pageOut, pageIn) {
    document.querySelector("." + pageOut).classList.toggle("hide");
    document.querySelector("." + pageIn).classList.toggle("hide");
}

// Validações
function isValidURL() {
    const url = document.getElementById("quizImage").value
    var res = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
};

function ValidationColor() {
    let number = document.getElementById("qInput").value
    const regex = /#([0-9a-fA-F]{6})/g
    for (i = 0; i < number; i++) {

        const color = document.getElementById(`color_${i}`).value
        if (color.match(regex) == null) {
            return false
        }


    }
    return true
}

function ValidationNumber() {
    const question = document.getElementById("qInput").value
    const level = document.getElementById("nInput").value
    if (question < 3 || level < 2) {
        return false
    }
    return true
}

function ValidationQuizTitle() {
    const title = document.getElementById("quizTitle").value
    if (title < 20 || title > 65) {
        return false
    }
    return true
}

function ValidationQuestiontitle() {
    let number = document.getElementById("qInput").value
    for (i = 0; i < number; i++) {
        const title = document.getElementById(`title_${i}`).value
        if (title < 20) {
            return false
        }
    }
    return true
}
function ValidationLeveltitle() {
    let number = document.getElementById("nInput").value
    for (i = 0; i < number; i++) {
        const title = document.getElementById(`level-title_${i}`).value
        if (title < 10) {
            return false
        }
    }
    return true
}
function ValidationLeveltext() {
    let number = document.getElementById("nInput").value
    for (i = 0; i < number; i++) {
        const text = document.getElementById(`level-text_${i}`).value
        if (text < 30) {
            return false
        }
    }
    return true
}
function ValidationLevelValue() {
    let number = document.getElementById("nInput").value
    const maxValue = document.getElementById(`level-minValue_${number - 1}`).value
    for (i = 0; i < number; i++) {
        const minValue = document.getElementById(`level-minValue_${i}`).value
        if (minValue > 100 || maxValue !== 0) {
            return false
        }

    }
    return true
}
function isValidURLimageQR() {
    let number = document.getElementById("qInput").value
    for (i = 0; i < number; i++) {
        const url = document.getElementById(`right_answer_image_${i}`).value

        var res = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        return (res !== null)
    }

};
function isValidURLimageQW() {
    let number = document.getElementById("qInput").value
    for (i = 0; i < number; i++) {
        const url = document.getElementById(`wrong_answer_image_${i}`).value

        var res = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        return (res !== null)
    }

};

function ValidationBasicInfo() {
    if (ValidationQuizTitle() && isValidURL() && ValidationNumber()) {
        createContainerQuestion()
    }
    else {
        alert("Erro!")
    }


}

function ValidationQuestionCreation() {
    if (ValidationQuestiontitle() && ValidationColor() && isValidURLimageQR() && isValidURLimageQW()) {
        createLevelQuiz()
    }
    else {
        alert("Erro!")
    }

}

function ValidationLevelCreation() {

}

// initializing functions
getAllQuizzes();