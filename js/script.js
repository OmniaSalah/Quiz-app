// select elements
var countQ = document.querySelector('.Q_count');
var bullets = document.querySelector('.bullets_spans');
var q_h1 = document.querySelector('.q_h1');
var answer_quiz = document.querySelector('.answer_quiz');
var btn_submit = document.querySelector('.btn');

var quiz_body = document.querySelector('.quiz_body');
var bullets_div = document.querySelector('.bullets');
var result_div = document.querySelector('.result');
var timer = document.querySelector('.minutes');

let index_Q = 0;
let num_of_right_answer = 0;
//  Ajax function
function getQuestion(){
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function(){
        if (this.readyState === 4 && this.status === 200){
            let questionsObject = JSON.parse(this.responseText);
            // console.log(questionsObject);
            let num_of_Q = questionsObject.length;

            //  set count of questions
            Q_count(num_of_Q);

            // get question
            addQuestion(questionsObject[index_Q],num_of_Q);

            // start count down
            count_down(5,num_of_Q);
            btn_submit.onclick = ()=>{
                if(index_Q<num_of_Q){
                    let the_Right_Answer = questionsObject[index_Q].right_answer;
                    index_Q++;

                    checkRightAnswer(the_Right_Answer,num_of_Q);

                    // delete previous question and answers
                    q_h1.innerHTML = '';
                    answer_quiz.innerHTML = '';

                    // add next question and answers
                    addQuestion(questionsObject[index_Q],num_of_Q);
                }
                showResults(num_of_Q);

                // start count down
                clearInterval(countDownInterval);
                count_down(5,num_of_Q);

                handleBullets();

            }
        }
        
    }
    myRequest.open("Get","questions.json",true);
    myRequest.send();
}
getQuestion();
//  set count of questions
function Q_count(num){
    countQ.innerHTML = num;
    //  create bullets
    for(let i=0 ; i<num ; i++){
        bullets.innerHTML += '<span class="bullet"></span>';
        let bullet = document.querySelector('.bullet');
        if(i === 0){
            bullet.className = "on";
        }
    }
}
function addQuestion(obj,count){

   if(index_Q<count){
     //  add question
     q_h1.innerHTML = obj.question;

     //  add answers
     for(let i = 1; i<=3 ; i++){
         // create main div
         let mainDiv = document.createElement("div");
         mainDiv.className = "answer";
         // create radio button
         let radioBTN = document.createElement('input')
         //  add type , name , id and data attribute
         radioBTN.id = `answer_${i}`;
         radioBTN.name = 'answers';
         radioBTN.type = 'radio';
         radioBTN.dataset.answer = obj[`answer_${i}`];
 
         //  make first radio selected
         if(i===1){
             radioBTN.checked = true;
         }
         // create label of radio button
         let labelBTN = document.createElement('label');
         labelBTN.htmlFor = `answer_${i}`;
         // create text for label /
         let labelTXT = document.createTextNode(obj[`answer_${i}`]);
         //  add the text to label
         labelBTN.appendChild(labelTXT);
         // append radio and label to mainDiv
         mainDiv.appendChild(radioBTN);
         mainDiv.appendChild(labelBTN);
 
         // append main div to answer_quiz in html
         answer_quiz.appendChild(mainDiv);
         
     }
   }
}

function checkRightAnswer(right_Answer,length_of_Q){
    let all_answers = document.getElementsByName('answers');
    let checked_answer = 0;
    for(let i =0; i<all_answers.length ; i++){
        if(all_answers[i].checked){
            checked_answer = all_answers[i].dataset.answer;
        }
    }
    if(right_Answer===checked_answer){
        num_of_right_answer++;
        console.log('right answer')
    }

}

function handleBullets(){
    let all_bullets = document.querySelectorAll('.bullets_spans span');
    // let arr_of_bullets = Array.from(all_bullets);
    all_bullets.forEach((ele, index)=>{
        if(index_Q == index){
            ele.className = "on";
            // console.log(index,index_Q);
        }
    console.log(index);

    })    
    console.log(index_Q);
}

function showResults(count){
    let result_msg;
    if(index_Q===count){
        bullets_div.remove();
        btn_submit.remove();
        quiz_body.remove();

        if(num_of_right_answer > count/2 && num_of_right_answer < count){
            result_msg = `<span style="color: blue;">Good, </span>you pass ${num_of_right_answer} form ${count}`;
        } else if(num_of_right_answer == count){
            result_msg = `<span style="color: green;">Perfect, </span>you pass ${num_of_right_answer} form ${count}`;
        } else{
            result_msg = `<span style="color: red;">Bad, </span>you pass ${num_of_right_answer} form ${count}`;
        }
        result_div.innerHTML = result_msg;
        result_div.style.backgroundColor = 'white';
        result_div.style.padding = '10px';
        result_div.style.marginTop = '10px';


    }
}

function count_down(duration,count){
    if(index_Q<count){
        let minutes,seconds;

        countDownInterval = setInterval(function(){
            minutes = parseInt(duration/60);
            seconds = duration % 60;

            minutes = minutes < 10 ? `0${minutes}` : minutes
            seconds = seconds < 10 ? `0${seconds}` : seconds
            timer.innerHTML = `${minutes}:${seconds}`;

            if(--duration < 0){
                clearInterval(countDownInterval);
                btn_submit.click();
                console.log('finished');
            }
        },1000)
    }
}