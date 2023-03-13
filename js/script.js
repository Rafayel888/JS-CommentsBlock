let comments = [];

loadComments();


function validation(form) {

  function removeError(input) {
    const parent = input.parentNode;

    if (parent.classList.contains('error')) {
      parent.querySelector('.error-label').remove();
      parent.classList.remove('error');
    }
  }

  function createError(input, text) {
    const parent = input.parentNode;
    const errorLabel = document.createElement('label');
    errorLabel.classList.add('error-label');
    errorLabel.textContent = text;
    parent.classList.add('error');
    parent.append(errorLabel);
  }

  let result = true;
  let allInputs = form.querySelectorAll('.input-field');


  for (let inp of allInputs) {

    removeError(inp);

    if (inp.dataset.minLength) {

      if (inp.value.length < inp.dataset.minLength) {
        removeError(inp);
        createError(inp, `Оставить свой отзыв`);
        result = false;
      }
    }

    if (inp.dataset.required == 'true') {

      if (inp.dataset.minLength) {

        if (inp.value.length < inp.dataset.minLength) {
          removeError(inp);
          createError(inp, `Мин. кол-во символов ${inp.dataset.minLength}`)
          result = false;
        }
      }
      if (inp.value == "") {
        removeError(inp);
        createError(inp, 'Поля не заполнено')
        result = false;
      }
    }

    let input = document.getElementById('input');
    let text = document.getElementById('textarea');


    input.addEventListener('input', function (event) {
      if (event.target.value) {
        removeError(input)
        console.log(input);
      }
    });
    text.addEventListener('keydown', function (event) {
      if (event.target.value) {
        removeError(text);
      }
    });

  }


  return result
}



document.getElementById('add-form').addEventListener('submit', function (event) {
  event.preventDefault();

  let input = document.getElementById('input');
  let text = document.getElementById('textarea');
  let date = document.getElementById('date-inp');

  if (validation(this) == true) {
    let comment = {
      id: Date.now(),
      name: input.value,
      text: text.value,
      done: false,
      date: date.value,
     
    }
    let arr = [input, text];
    arr.map(elm => elm.value = '')
    comments.push(comment);
    saveLocalComments();
    showComments();

  }
});



function saveLocalComments() {
  localStorage.setItem('comments', JSON.stringify(comments));
}

function loadComments() {
  if (localStorage.getItem('comments')) {
    comments = JSON.parse(localStorage.getItem('comments'));
    showComments();
  }
}


function showComments() {
  let commentField = document.getElementById('comment-field');
  let out = '';

  comments.forEach(function (item) {
    out += `
    <div class="public-div">
      <div class="public-head">
      <div class="div__img"><img src="img/img_avatar.png" alt="Avatar" class="avatar"></div>
      <div class="div__name">
        <h3><b>${item.name}</b></h3>
        <span><smal><em>${timeConverter(item.date)}</em></smal></span>
        <div class='div__abs'>
        <button class='basket-btn'>
         <img src="img/bin.png" alt="" width="20px" height="20px">
        </button>
      </div>

      <div class='heart__div'>
        <svg class='svg_icon' xmlns="http://www.w3.org/2000/svg" width="18" height="16" fill="currentColor" class="bi bi-suit-heart-fill" viewBox="0 0 16 16"> <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z"/> </svg>
      </div>
      </div>
      </div>
      <div class="public-main">
        <p id="p-1">${item.text}</p>
      </div>
    </div> 
    `
  });
  commentField.innerHTML = out;

  

  let public_div = document.querySelectorAll('.public-div');

  let baskets = document.querySelectorAll('.basket-btn');

  baskets = [...baskets];
  public_div = [...public_div];

  baskets.map((elem, index) => {
    elem.addEventListener('click', function () {
      let indOf = comments.indexOf(index);
      comments.splice(indOf, 1);
      public_div[index].remove()
      saveLocalComments(comments);
    });
  });

  function heartLike() {

    let heart_div = document.querySelectorAll('.heart__div');

    heart_div = [...heart_div];

    heart_div.map((e, i) => {
      e.addEventListener('click', function () {
        console.log('element', e);
        if (comments[i].done === false) {

          comments[i].done = true;
          e.classList.add('active');
          saveLocalComments(comments);
        } else {
          comments[i].done = false;
          e.classList.remove('active');
          saveLocalComments(comments)
        }
      });
    });

  }

  heartLike()



  function timeConverter(timestap) {
    const dateT = new Date();
    let day = dateT.getDate();
    let month = dateT.getMonth() + 1;
    let year = dateT.getFullYear();
    let hour = dateT.getHours();
    let min = dateT.getMinutes();
    let dayYester = dateT.getDate() - 1;

    if (day < 10) {
      
      day = '0' + day;
    }
    if (dayYester < 10) {

      dayYester = '0' + dayYester;
    }
    if (month < 10) {

      month = '0' + month;
    }
    if (min < 10) {

      min = '0' + min;
    }

    let fullDate = `${year}-${month}-${day}`
    
    let yesterday = `${year}-${month}-${dayYester}`
   
    let fullTime = `${hour}:${min}`

    if (timestap == '' || timestap == fullDate) {
      
      let today = 'Сегодня ' + fullTime;
      return today
    } else if (timestap == yesterday) {

      let yesterday = 'Вчера ' + fullTime
      return yesterday
    } else {
      
      return timestap
    }
  }
  
}






































