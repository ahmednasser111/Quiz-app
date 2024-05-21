let category = document.querySelector(".category span");
let questionNumberCurrent = document.querySelector(".question-number .current");
let questionNumberTotal = document.querySelector(".question-number .total");
let question = document.querySelector(".question");
let choices = document.querySelectorAll(".choice");
let questionBulletsBar = document.querySelector(".questions-bullets");
let submitButton = document.querySelector(".submit-btn");
let minutesTimer = document.querySelector(".timer .minutes");
let secondsTimer = document.querySelector(".timer .seconds");
let closePopup = document.getElementById("closePopup");
let popupContainer = document.getElementById("popupContainer");
let result = document.querySelector(".result");

const questionCount = 10;
let currentQuestion = 0;
let time = questionCount * 60; // 10 minutes
let userAnswers = [];
let finished = false;
let rightAnswers;

for (let i = 0; i < questionCount; i++)
	questionBulletsBar.appendChild(document.createElement("li"));

let questionBullets = document.querySelectorAll(".questions-bullets li");

minutesTimer.textContent = String(Math.floor(time / 60)).padStart(2, "0");
secondsTimer.textContent = String(time % 60).padStart(2, "0");

questionNumberTotal.textContent = questionCount;
questionNumberCurrent.textContent = 1;

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

document.addEventListener("DOMContentLoaded", function () {
	fetch("questions.json")
		.then((res) => res.json())
		.then((data) => {
			data = shuffle(data);

			const easyQuestions = data.filter(
				(question) => question.difficulty === "easy"
			);

			const midQuestions = data.filter(
				(question) => question.difficulty === "medium"
			);
			const hardQuestions = data.filter(
				(question) => question.difficulty === "hard"
			);

			// Combine the equally distributed questions into a single array
			data = [
				...easyQuestions.slice(0, Math.floor(questionCount / 3)),
				...midQuestions.slice(
					0,
					Math.floor(questionCount / 3) + (questionCount % 3)
				),
				...hardQuestions.slice(0, Math.floor(questionCount / 3)),
			];

			data = shuffle(data);

			data.forEach((item) => {
				item.choices = shuffle(item.choices);
			});

			questionBullets.forEach((e, i) => {
				e.onclick = () => {
					currentQuestion = i;
					getNextQuestion();
				};
			});

			choices.forEach((choice, i) => {
				choice.onclick = () => {
					if (!finished) {
						questionBullets[currentQuestion].className = "active";
						userAnswers[currentQuestion] = {
							text: choice.lastElementChild.textContent,
							number: i,
							isRight: true,
						};
					}
				};
			});
			let ref = setInterval(() => {
				if (time === 1) {
					showResults();
				}
				time--;

				minutesTimer.textContent = String(Math.floor(time / 60)).padStart(
					2,
					"0"
				);
				secondsTimer.textContent = String(time % 60).padStart(2, "0");
			}, 1000);

			closePopup.addEventListener("click", () => {
				popupContainer.style.display = "none";
			});

			function showResults() {
				if (userAnswers.length < questionCount && time > 1) {
					popupContainer.style.display = "block";
					return;
				}
				finished = true;
				clearInterval(ref);
				submitButton.disabled = true;
				choices.forEach((choice) => (choice.firstElementChild.disabled = true));

				if (time === 1) {
					popupContainer.style.display = "block";
					return;
				}
				rightAnswers = userAnswers.filter((answer, i) => {
					let isRight = answer.text === data[i].answer;
					answer.isRight = isRight;
					if (!isRight) questionBullets[i].className = "wrong";
					return isRight;
				}).length;

				result.innerHTML = `You've finished the quiz! Here are your results: you got ${rightAnswers}/${questionCount} correct. Keep up the good work!`;

				getNextQuestion();
			}
			function getNextQuestion() {
				category.textContent = data[currentQuestion].category;
				questionNumberCurrent.textContent = currentQuestion + 1;
				submitButton.textContent = currentQuestion === 9 ? "Submit" : "Next";
				submitButton.disabled = finished && currentQuestion === 9;

				question.innerHTML = `${currentQuestion + 1}- ${
					data[currentQuestion].question
				}`;

				choices.forEach((choice, i) => {
					choice.lastElementChild.textContent =
						data[currentQuestion].choices[i];
				});
				choices.forEach((choice) => {
					choice.firstElementChild.checked = false;
					choice.lastElementChild.classList.remove("wrong-answer");
				});

				if (userAnswers[currentQuestion])
					choices[
						userAnswers[currentQuestion].number
					].firstElementChild.checked = true;
				if (finished) {
					if (!userAnswers[currentQuestion].isRight) {
						choices[
							userAnswers[currentQuestion].number
						].lastElementChild.classList.add("wrong-answer");

						let rightAnswer;
						data[currentQuestion].choices.forEach((choice, i) => {
							if (choice === data[currentQuestion].answer) rightAnswer = i;
						});
						choices[rightAnswer].firstElementChild.checked = true;
					}
				}
			}

			getNextQuestion();
			submitButton.addEventListener("click", () => {
				if (currentQuestion === 9) return showResults();
				currentQuestion++;
				getNextQuestion();
			});
		})
		.catch(() => console.error("file not found"));
});
