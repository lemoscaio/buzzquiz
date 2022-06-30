<div align="center">
    <img style = "width:100%;"src="https://i.imgur.com/QY4a3Vk.png">
</div>
<!-- <hr> -->
<div align=center>
        <h2 align=center>Buzzquiz</h2>
        <h3 align=center>Web development Project</h3>
        <hr>
        <div align=center>
            <h4>A trivia quiz web-app inspired on a well-known quiz website.</h4>
            <h4>Made with HTML, SCSS and Vanilla JS, it uses a mock API for making HTTP requests and control data.</h4>
            <h4>This was the fifth and last project from the Vanilla JavaScript module of the Driven full stack web development bootcamp and first to use API requests.</h4>
        </div>
    <br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
    <img style = "height:400px;" src="https://i.imgur.com/DLgG2Mv.png">
    <img style = "height:300px;" src="https://i.imgur.com/PNip4Bw.png">
<br>
</div>
<hr>

## Features

- Users can create their own quizzes
- Each quiz can have a least 3 questions (with as least 1 correct and 1 wrong answer) and 2 levels of success rate
- User own quizzes ID are stored in the localStorage
- Random answer options placement
- Visual feedback whether the user answered correctly or wrongly
- Quizzes stored on the server and loaded by API requests

## Requirements

- General
    - [x]  Use vanilla JavaScript only
    - [x]  The project must be stored in a public repository on GitHub
    - [x]  Commit every new feature
    - [x]  All pages/screens must be applied in the same HTML file, hiding the ones that are not supposed to appear
- Layout
    - [x]  Apply the mobile and desktop layout as provided on Figma
    - [x]  The laytouts should change from mobile to desktop when hiting the breakpoint of 1100px
- Screen 1: Quizzes list
    - [x]  On this screen, all quizzes received from the server must be listed
    - [x]  The user quizzes list must show only the user own quizzes. The "all quizzes list" must show all quizzes **but the user's**
    - [x]  The quizzes must appear in a rectangular format (as on the layout), with the image and title. The image must be under a black to transparent gradient. On clicking the quiz, this screen must be changed to the quiz screen
    - [x]  After clicking on "create quiz" or on the "+" button, this screen must be changed to the quiz creation screen
- Screen 2: Quiz page (questions)
    - [x]  On the top of the quiz, there must be a banner with the image and title of the quiz. The image must be overlapped by a black layer with 60% of opacity
    - [x]  The answers of each question must be placed randomly
    - [x]  After clicking on a answer option, the other options must receive a milky effect
    - [x]  The user can't change the answer by clicking again on other option
    - [x]  After answering, the options text must receive a color indicating whether is the correct of the wrong answer
    - [x]  2 seconds after answering, the page must scroll automatically to the next question
- Screen 2: Quiz page (quiz end)
    - [x]  After answering all the questions, there must show the result of the quiz. Just like the behavior when answering a question, the page must scroll automatically to the result box after 2 seconds
    - [x]  The quiz score (percentage of right answer over the total number of questions) must be calculated on the front-end, and so the level of the user. 
    - [x]  It must show the title, image and description of what level the user got by answering the questions
    - [x]  The score must be rounded to a integer number
    - [x]  If the user clicks on "restart quiz", the screen must be scroll to the top and all the answers should reset to the initial state. The result box should be hidden as well
    - [x]  If the user clicks on "go to the homepage", this screen must be hidden and changed to the home screen
- Screen 3: Quiz creation
    - [x]  The quiz creation process must pass through 4 screens, as on the provided layout on Figma:
        - Screen 3.1: Quiz basic info
        - Screen 3.2: Quiz questions
        - Screen 3.3: Quiz levels
        - Screen 3.4: Quiz results
    - [x]  On each step, all inputs must be validated, as the following rules:
        - Quiz basic info
          - [x]  Title: must have from 20 to 65 characters
          - [x]  Image: must be an URL format
          - [x]  Number of questions: at least 3 questions
          - [x]  Number of levels: at least 2 levels
        - Quiz questions
            - [x]  Question text: at least 20 characters
            - [x]  Background color: must be an hexadecimal color (starting with "#", followed by 6 hex characters)Cor de fundo: deve ser uma cor em hexadecimal symbols (from 0 to F)
            - [x]  Answer text: must not be empty
            - [x]  Image: must be an URL format
            - [x]  At least 1 correct answer and 1 wrong answer must be filled in. Is allowed to have questions with just 2 answer options.
        - Quiz levels
            - [x]  Title: at least 10 characters
            - [x]  Minimum right answer %: a number between 0 and 100
            - [x]  Image: must be an URL format
            - [x]  Level description: at least 30 characters
            - [x]  there must be at least one level where the minimum % is 0%
    - [x]  If any validation fails, an alert must be shown asking to the user fill the inputs correctly
    - [x]  After finishing the quiz creation and saving it in the server, the user must see the quizz creation success screen. In the screen, the user can click on the quiz to visualize it or go back to the home screen
    - [x]  When the user returns to the home screen, it must load all new quizzes, including the newly created one
- User quizzes
    - [x]  When creating a quiz, the server will respond the request with the created object, including the ID of the quiz
    - [x]  The ID must be stored on the localStorage to differentiate which quizzes belong to that user
- Deploy
    - [x] Deploy the project on GitHub Pages

## Built with

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![SASS](https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)

## Contact

[![LinkedIn][linkedin-shield]][linkedin-url]


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=blue
[linkedin-url]: https://www.linkedin.com/in/caiodeoliveiralemos/
