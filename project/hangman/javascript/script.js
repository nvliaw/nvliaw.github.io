let list_of_words = ["Committee", "Tattoo", "Electricity", 'pneumonoultramicroscopicsilicovolcanoconiosis', 
"Pseudopseudohypoparathyroidism", "Floccinaucinihilipilification", "Antidisestablishmentarianism", "pyx", 
"supercalifragilisticexpialidocious", "hippopotomonstrosesquippedaliophobie"]
let description_of_words = {"Committee": "a person or group of persons elected or appointed to perform some service or function, as to investigate, report on, or act upon a particular matter.",
                     "Tattoo": "A form of body modification where a design is made by inserting ink",
                     "Electricity": "Is the set of physical phenomena associated with the presence and motion of electric charge",
                     "pneumonoultramicroscopicsilicovolcanoconiosis": "an obscure term ostensibly referring to a lung disease caused by silica dust, sometimes cited as one of the longest words in the English language.",
                     "Pseudopseudohypoparathyroidism": "An inherited disorder that closely simulates the symptoms but not the consequences of pseudohypoparathyroidism, thus it has mild or no manifestations of hypoparathyroidism or tetanic convulsions.",
                     "Floccinaucinihilipilification": "Another word for Rare",
                     "Antidisestablishmentarianism": "Opposition to the withdrawal of state support or recognition from an established church, especially the Anglican Church in 19th-century England.",
                     "supercalifragilisticexpialidocious": "used as a nonsense word by children to express approval or to represent the longest word in English.",
                     "hippopotomonstrosesquippedaliophobie": "The fear of long words.",
                     "pyx": "Also called pyx chest . a box or chest at a mint, in which specimen coins are deposited and reserved for trial by weight and assay."}
let lives = 7;
let score = 0;
let guess;
let displayedword = [];
let word;


function generateLetters() {  // Creates buttons dynamically
    for (i = 0; i < 26; i++) {
        let btn = document.createElement("button");
        document.getElementById("buttons").appendChild(btn);
        btn.innerHTML = String.fromCharCode(65 + i);
        btn.id = btn.innerHTML;
        btn.className = "button";
        btn.onclick = function () {
            guess = btn.innerHTML;
            validGuess();
        }
    }
}

function hide(){  // hides buttons
    for (i=0; i<26; i++) {
        alphabet = String.fromCharCode(65 + i)
        document.getElementById(alphabet).style.display="none";
    }
    document.getElementById("buttons").style.display="none";
}

function generateWord() {  // picks random word from an array of words and assigns underscore for each letter
    let num = Math.floor(Math.random() * 10);
    word = list_of_words[num];
    for (i = 0; i < word.length; i++) {
        displayedword.push("_");
    }
}

function displayGame() {  // displays word description, lives and score
    document.getElementById("worddescription").innerHTML = description_of_words[word];
    document.getElementById("lives").innerHTML = lives;
    document.getElementById("score").innerHTML = score;
    let current_word = ""
    for (i = 0; i < displayedword.length; i++) {
        current_word += displayedword[i];
        current_word += " "
    }
    document.getElementById("word").innerHTML = current_word;
}

function decrementLives() {  // descrease lives by 1
    lives -= 1;
}

function validGuess() {  // checks if the word contains the letter guessed
    let valid = false;
    for (i = 0; i < word.length; i++) {
        if (guess == word.charAt(i).toUpperCase()) {
            displayedword[i] = guess;
            incrementScore();
            valid = true;
        }
    }
    if (valid == false) {
        decrementScore();
        decrementLives();
    }
    removeButton();
    displayGame();
    checkGameStatus();
}

function checkGameStatus() { // checks condition to see if user has won or lost
    end = true;
    if (lives == 0) {
        endGame("lost");
        hide();
    }
    for (i = 0; i < displayedword.length; i++) {
        if (displayedword[i] == "_") {
            end = false;
        }
    }
    if (end == true) {
        endGame("won");
        hide();
    }
}

function incrementScore() {  // increase score by 1
    score += 1;
}

function decrementScore() { // decrease score by 1
    score -= 1;
}

function restartGame() {  // resets entire game
    for (i = 0; i < 26; i++) {
        document.getElementById(String.fromCharCode(65 + i)).style.display = "inline-block";
    }
    document.getElementById("buttons").style.display = "block";
    document.getElementById('leaderboard').style.display="none";
    lives = 7;
    score = 0;
    displayedword = [];
    generateWord();
    displayGame();
    clearLeaderboard();
    document.getElementById("end").innerHTML = "";
}

function removeButton() {  // hide buttons when clicked
    document.getElementById(guess).style.display = "none";
}

function endGame(result) {  // prints message when game ends
    let name = prompt("Please enter your name: ");
    document.getElementById("end").innerHTML = name + ", you have " + result + "! Your score is " + score + "!";
    if (result == "won") {
        firebase.database().ref("Scores/").update({
        [name]: score
        });
    }
    document.getElementById("leaderboard").style.display = "table";
    generateLeaderboard();
}


function clearLeaderboard() { // clears the current leaderboard
    let current_leaderboard = document.getElementById("leaderboard");
    let length_of_leaderboard = current_leaderboard.rows.length;
    for(i=1; i<length_of_leaderboard; i++) {
        removed_row = current_leaderboard.rows[1]
        removed_row.remove()
    }
}

function generateLeaderboard () {  // creates a leaderboard once user wins or loses.
    var db = firebase.database().ref().child("Scores")
    db.once(
        "value",
        function(snap){
            dict_of_scores = snap.val();
            scores = Object.values(dict_of_scores);
            leadername = Object.keys(dict_of_scores);
            sortable_scores = [];
            for (i = 0; i < leadername.length; i++) {
                sortable_scores.push([leadername[i], dict_of_scores[leadername[i]]])
            }
            sorted_scores = [];
            sorted_scores.push(sortable_scores[0]);
            for (i = 1; i < sortable_scores.length; i++) {
                if (sortable_scores[i][1] > sorted_scores[0][1]) {
                    sorted_scores.unshift(sortable_scores[i])
                }
                else {
                    let counter = 0
                    for (j = 0; j < sorted_scores.length; j++) {
                        if (sortable_scores[i][1] < sorted_scores[j][1]) {
                            counter += 1;
                        }
                    }
                    sorted_scores.splice(counter, 0, sortable_scores[i]);
                }
            }
            for (i = 0; i < sorted_scores.length; i++) {
                let tr = document.createElement("tr");
                let td = document.createElement("td");
                let td2 = document.createElement("td");
                document.getElementById("leaderboard").appendChild(tr);
                tr.appendChild(td);
                tr.appendChild(td2);
                td.innerHTML = sorted_scores[i][0];
                td2.innerHTML = sorted_scores[i][1];
            }
        }
    )
}

generateLetters();
generateWord();
displayGame();
document.getElementById("restart").onclick = restartGame;