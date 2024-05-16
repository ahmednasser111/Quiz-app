let category = document.querySelector(".category");
let questionNumberCurrent = document.querySelector(".question-number .current");
let questionNumberTotal = document.querySelector(".question-number .total");
let question = document.querySelector(".question");
let choices = document.querySelectorAll(".choice");
let submitButton = document.querySelector(".submit-btn");
let questionBullets = document.querySelectorAll(".questions-bullets li");
let currentQuestion = 0;

document.addEventListener("DOMContentLoaded", function () {
	fetch("questions.json")
		.then((res) => res.json())
		.then((data) => {
			questionBullets.forEach((e, i) => {
				e.onclick = () => {
					currentQuestion = i;
					getNextQuestion();
				};
			});

			choices.forEach((choice) => {
				choice.onclick = () => {
					questionBullets[currentQuestion].className = "active";
				};
			});
			function getNextQuestion() {
				if (currentQuestion === 9) submitButton.textContent = "Submit";
				else submitButton.textContent = "Next";
				question.textContent = `${currentQuestion + 1}- ${
					data[currentQuestion].question
				}`;
				choices.forEach((choice, i) => {
					choice.lastElementChild.textContent =
						data[currentQuestion].choices[i];
				});
				choices.forEach((choice) => {
					choice.firstElementChild.checked = false;
				});
			}
			data = data.sort(() => Math.random() - 0.5).slice(0, 10);
			getNextQuestion();
			submitButton.addEventListener("click", () => {
				if (currentQuestion === 9) {
					// submit;
					return;
				}
				currentQuestion++;
				getNextQuestion();
			});
		});
});
