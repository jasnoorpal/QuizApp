fetch("./quizzes.json")
  .then((response) => response.json())
  .then((data) => {
    const questions = data;
    let currentQuestionIndex = 0;
    let marks = 0;
    let wrongQuestions = [];
    let userName = "";
    let selectedAnswers = [];

    const startQuizButton = document.getElementById("startQuiz");
    const startQuizContainer = document.querySelector(".startQuizContainer");
    const quizContainer = document.querySelector(".quizContainer");
    const questionElement = document.querySelector(".question");
    const choicesElement = document.querySelector(".choices");
    const nextButton = document.getElementById("next");
    const totalMarksElement = document.getElementById("totalMarks");
    const wrongQuestionsElement = document.getElementById("wrongQuestions");
    const resultContainer = document.querySelector(".result");

    quizContainer.style.display = "none";

    function startQuiz() {
      userName = document.getElementById("username").value.trim();
      document.getElementById("questionNo").innerHTML = `Question ${
        currentQuestionIndex + 1
      }`;
      if (userName) {
        startQuizContainer.style.display = "none";
        quizContainer.style.display = "flex";
        quizContainer.style.flexDirection = "column";
        quizContainer.style.width = "90%";
        resetQuiz();
        loadQuestion(currentQuestionIndex);
      } else {
        alert("Please enter your name.");
      }
    }

    startQuizButton.addEventListener("click", startQuiz);

    function resetQuiz() {
      selectedAnswers = [];

      marks = 0;
      wrongQuestions = [];

      totalMarksElement.textContent = "";
      wrongQuestionsElement.innerHTML = "";
      resultContainer.style.display = "none";
      currentQuestionIndex = 0;
    }

    function loadQuestion(questionIndex) {
      const question = questions[questionIndex];
      questionElement.textContent = question.question;

      choicesElement.innerHTML = "";

      const answers = [
        ...question.answers.incorrectAnswer,
        question.answers.correctAnswer,
      ];

      // Shuffle answers
      answers.sort(() => Math.random() - 0.5);

      answers.forEach((answer, index) => {
        const choiceLabel = document.createElement("label");
        choiceLabel.setAttribute("for", `choice${index + 1}`);

        const choiceInput = document.createElement("input");
        choiceInput.type = "radio";
        choiceInput.name = "choice";
        choiceInput.id = `choice${index + 1}`;
        choiceInput.value = answer;

        if (selectedAnswers[questionIndex] === answer) {
          choiceInput.checked = true; // Check the radio button if it was selected before
        }

        choiceLabel.appendChild(choiceInput);
        choiceLabel.appendChild(document.createTextNode(answer));

        choicesElement.appendChild(choiceLabel);
      });
    }

    function goToNextQuestion() {
      const selectedAnswer = document.querySelector(
        'input[name="choice"]:checked'
      );

      if (selectedAnswer) {
        selectedAnswers[currentQuestionIndex] = selectedAnswer.value; // Store the selected answer
        currentQuestionIndex++;

        document.querySelector("#questionNo").innerHTML = `Question ${
          currentQuestionIndex + 1
        }`;
        if (currentQuestionIndex < questions.length) {
          loadQuestion(currentQuestionIndex);
        } else {
          endQuiz();
        }
      } else {
        alert("Please select an answer.");
      }
    }

    function endQuiz() {
      // Calculate marks
      marks = questions.reduce((totalMarks, question, index) => {
        if (selectedAnswers[index] === question.answers.correctAnswer) {
          return totalMarks + 1;
        } else {
          wrongQuestions.push(index + 1);
          return totalMarks;
        }
      }, 0);

      totalMarksElement.textContent = marks;
      document.getElementById("name").innerText = `${userName}`;
      wrongQuestions.forEach((questionNumber) => {
        const li = document.createElement("li");
        li.textContent = `Question ${questionNumber}`;
        wrongQuestionsElement.appendChild(li);
      });

      quizContainer.style.display = "none";
      resultContainer.style.display = "block";
    }

    // Event listeners for next
    nextButton.addEventListener("click", goToNextQuestion);
  })
  .catch((error) => console.error("Error loading quizzes.json:", error));
