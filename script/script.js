// "use strict";

document.addEventListener("DOMContentLoaded", function () {

  const isMobile = {
    Android: function () {
      return navigator.userAgent.match(/Android/i);  
    },
    BlackBerry: function () {
      return navigator.userAgent.match(/BlackBerry/i);  
    },
    iOS: function () {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);  
    },
    Opera: function () {
      return navigator.userAgent.match(/Opera Mini/i);  
    },
    Windows: function () {
      return navigator.userAgent.match(/IEMobile/i);  
    },
    webOS: function () {
      return navigator.userAgent.match(/webOS/i);  
    },
    any: function () {
        return (
            isMobile.Android() ||
            isMobile.BlackBerry() ||
            isMobile.iOS() ||
            isMobile.Opera() ||
            isMobile.Windows() ||
            isMobile.webOS()
        );
    }
  };

  if (isMobile.any()) {
      document.body.classList.add('__touch');

      let menuArrows = document.querySelectorAll('.header__menu__item__arrow');

      if(menuArrows.length>0) {
        for(let i = 0; i < menuArrows.length; i++) {
          const menuArrow = menuArrows[i];
          
          menuArrow.addEventListener('click', function (e) {
            menuArrow.parentElement.classList.toggle('__active');
          });
        }
      };
  } else {
      document.body.classList.add('__pc');
  }
    

// кнопка вгору

  const returnBtn = document.querySelector('.return__btn');

  document.addEventListener('scroll', function () {
      if (scrollY >= 100) {
          returnBtn.classList.remove('hidden');
      }else{
          returnBtn.classList.add('hidden');
      };
  });

  returnBtn.addEventListener('click', function () {
      window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
      })
  });

  // меню бургер

  const burgerIcon = document.querySelector('.burger');
  const menuBody = document.querySelector('.header__menu__body');

    if(burgerIcon) {
          burgerIcon.addEventListener('click', () => {
          document.body.classList.toggle('__lock');
          burgerIcon.classList.toggle('__active');
          menuBody.classList.toggle('__active');
        })
    }


  // перекидання при натисканні

  const menuLinks = document.querySelectorAll('[data-goto]');

  if(menuLinks.length > 0){
    menuLinks.forEach(menuLink => {
      menuLink.addEventListener('click', onMenuLinkClick);
    });

    function onMenuLinkClick (e) {
      const menuLink = e.target;
      if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
          const gotoBlock = document.querySelector(menuLink.dataset.goto);
          const gotoBlockValue = gotoBlock.getBoundingClientRect().top + scrollY - document.querySelector('header').offsetHeight;

          if(burgerIcon.classList.contains('__active')) {
            document.body.classList.remove('__lock');
            burgerIcon.classList.remove('__active');
            menuBody.classList.remove('__active');
          };

          window.scrollTo ({
              top: gotoBlockValue,
              behavior: 'smooth'
          });
          e.preventDefault();

      };
    };
  };

  // *************************************************************

  // Отримуємо елемент з класом .typing-text
  const text = document.querySelector('.typing-text');

  // Отримуємо всі слова з дочірніх елементів <span>
  // Перетворюємо список <span> на масив за допомогою Array.from.
  // map(span => span.textContent) витягує текстовий вміст кожного <span> у масив words.
  const words = Array.from(text.querySelectorAll('span')).map(span => span.textContent);

  // Запускаємо функцію з друку
  setTyper(text, words);

  function setTyper(element, words) {

      // затримка між друком кожної літери (в мілісекундах).
      const LETTER_TYPE_DELAY = 75;
      
      // час, протягом якого повне слово залишається на екрані перед видаленням (в мілісекундах).
      const WORD_STAY_DELAY = 2000;
      
      // напрямок друку вперед
      const DIRECTION_FORWARDS = 0;
      
      // напрямок друку назад
      const DIRECTION_BACKWARDS = 1;
      
      // напрямок друку
      let direction = DIRECTION_FORWARDS;
      // індекс поточного слова з масиву
      let wordIndex = 0;
      // індекс поточної літери у слові.
      let letterIndex = 0;
      
      // змінна для збереження інтервалу друку.
      let wordTypeInterval;
      
      // Запуск друку
      startTyping();
      
      function startTyping() {      
          wordTypeInterval = setInterval(typeLetter, LETTER_TYPE_DELAY);        
      }
      

    function typeLetter() {
      const word = words[wordIndex];

      if (direction === DIRECTION_FORWARDS) {
        letterIndex++;

        if (letterIndex === word.length) {
          direction = DIRECTION_BACKWARDS;
          clearInterval(wordTypeInterval);
          setTimeout(startTyping, WORD_STAY_DELAY);
        }
      } else if (direction === DIRECTION_BACKWARDS) {
        letterIndex--;

        if (letterIndex === 0) {
          nextWord();
        }
      }

      const textToType = word.substring(0, letterIndex);
      element.textContent = textToType;
    }

    function nextWord() {
      letterIndex = 0;
      direction = DIRECTION_FORWARDS;
      wordIndex++;

      if (wordIndex === words.length) {
        wordIndex = 0;
      }
    }
  };

  
  // ***********************************************************************

  const popupLinks = document.querySelectorAll('.popup-link');
  const body = document.querySelector('body');
  const lockPadding = document.querySelectorAll('.lock-padding');

  let unlock = true;

  const timeout = 300;

  if (popupLinks.length > 0) {
      for (let index = 0; index < popupLinks.length; index++) {
          const popupLink = popupLinks[index];
          popupLink.addEventListener("click", function (e) {
              const popupName = popupLink.getAttribute('href').replace('#', '');
              const curentPopup = document.getElementById(popupName);
              console.log("curentPopup: ", curentPopup);
              popupOpen(curentPopup);
              e.preventDefault();
          });
      }
  };
  
  const popupCloseIcon = document.querySelectorAll('.close-popup');
  if (popupCloseIcon.length > 0) {
      for (let index = 0; index < popupCloseIcon.length; index++) {
          const el = popupCloseIcon[index];
          el.addEventListener("click", function (e) {
              popupClose(el.closest('.popup'));
              e.preventDefault();
          });
      }
  };

  function popupOpen(curentPopup) {
      if (curentPopup && unlock) {
          const popupActive = document.querySelector('.popup.open');
          if (popupActive) {
              popupClose(popupActive, false);
          } else {
              bodyLock();
          }
          curentPopup.classList.add('open');
          curentPopup.addEventListener("click", function (e) {
              if (!e.target.closest('.popup__content')) {
                  popupClose(e.target.closest('.popup'));
              }
          });
       };
  };

  function popupClose(popupActive, doUnlock = true) {
    if (unlock) {
        
      const videoElem = document.getElementById("videoPlayer");
      // videoElem.style.display = "none";

      document.getElementById("videoPlayer").contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
      console.log("popup closed", videoElem);

        popupActive.classList.remove('open');
        
          if (doUnlock) {
              bodyUnLock();
          }
      }
   };
  
  function bodyLock() {
      // const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

      // if (lockPadding.length > 0) {
      //     for (let index = 0; index < lockPadding.length; index++) {
      //         const el = lockPadding[index];
      //         el.style.paddingRight = lockPaddingValue;
      //     }
      // }        
      // body.style.paddingRight = lockPaddingValue;
      body.classList.add('__lock');

      unlock = false;
      setTimeout(function () {
          unlock = true;
      }, timeout);
  }

  function bodyUnLock() {
      setTimeout(function () {
          // if (lockPadding.length > 0) {
          //     for (let index = 0; index < lockPadding.length; index++) {
          //         const el = lockPadding[index];
          //         el.style.paddingRight = '0px';
          //     }
          // }            
          // body.style.paddingRight = '0px';
          body.classList.remove('__lock');
      }, timeout);

      unlock = false;
      setTimeout(function () {
          unlock = true;
      }, timeout);
  }

  document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
          const popupActive = document.querySelector('.popup.open');
          popupClose(popupActive);
      }
  })

// ***********************************************************************

    const swiper = new Swiper('.slider-main-block', {
      // Optional parameters
      loop: true,

      effect: "coverflow",

      slidesPerView: 1,
      centeredSlides: true,
      spaceBetween: 0,
      grabCursor: true,

      breakpoints: {
        640: {
          slidesPerView: 3,
          // spaceBetween: 10
        }
      },

      // pagination: {
      //   el: ".swiper-pagination",
      //   clickable: true,
      // },
      
        // Navigation arrows
      navigation: {
        nextEl: '.slider-main-block__arrow.swiper-button-next',
        prevEl: '.slider-main-block__arrow.swiper-button-prev',
      },
      
      // autoplay: {
      //   delay: 3000,
      // },
  });

  // const swiper2 = new Swiper('.slider-main-block2', {
  //     // Optional parameters
  //     loop: true,
    
  //       // Navigation arrows
  //     navigation: {
  //       nextEl: '.slider-main-block__arrow.swiper-button-next',
  //       prevEl: '.slider-main-block__arrow.swiper-button-prev',
  //     },
  //     autoplay: {
  //       delay: 3000,
  //     },
  //   });


    document.querySelectorAll('.page__hero .slide-image').forEach(image => {
      image.addEventListener('click', (event) => {
          let imagePath = event.target.src; 
          let rezult = new URL(imagePath).pathname;
          let repoName = '/2024_anmx_p_2';
          if (rezult.startsWith(repoName)) {
              rezult = rezult.replace(repoName, '');
              console.log('replaced');
          }             
          const relativePath = rezult.slice(1);
          const imgElement = document.querySelector("#popup1 .popup-img__item");
          if (imgElement) {
              imgElement.src = relativePath; 
          }
          const curentPopup = document.getElementById("popup1");
          popupOpen(curentPopup);

      });
    });
  
  // ***********************************************************************

  const page_1 = document.querySelector(".popup__content-page-1");
  const page_2 = document.querySelector(".popup__content-page-2");
  page_2.classList.add("pagehidden");
  const page_3 = document.querySelector(".popup__content-page-3");
  page_3.classList.add("pagehidden");

  const selectNum = document.querySelector(".custom-select");
  const optionsNum = selectNum.querySelectorAll(".option");
  const hiddenInputNum = selectNum.querySelector("input[type=hidden]");

  const selectСomposition = document.querySelector(".custom-select.__2"); 
  const optionsСomposition = selectСomposition.querySelectorAll(".option");
  const hiddenInputСomposition = selectСomposition.querySelector("input[type=hidden]#select_type-2");

  const btnResetPage1 = document.querySelector(".popup__content-page-1 button.custom-btn[type=reset]");
  const btnResetPage2 = document.querySelector(".popup__content-page-2 button.custom-btn[type=reset]");
  const btnResetPage3 = document.querySelector(".popup__content-page-3 button.custom-btn[type=reset]");
  const btnNextPage1 = document.querySelector(".popup__content-page-1 button.custom-btn.next");
  const btnNextPage2 = document.querySelector(".popup__content-page-2 button.custom-btn.next");
  const btnBackPage2 = document.querySelector(".popup__content-page-2 button.custom-btn.back");
  const btnBackPage3 = document.querySelector(".popup__content-page-3 button.custom-btn.back");


  optionsNum.forEach((option) => {
    option.addEventListener("click", () => {
      const value = option.getAttribute("data-value");
      hiddenInputNum.value = value;

      console.log("selectValue: ", hiddenInputNum.value);

      optionsNum.forEach((opt) => opt.classList.remove("selected"));
      option.classList.add("selected");
    });
  });

  btnResetPage1.addEventListener("click", () => {
    optionsNum.forEach((opt) => opt.classList.remove("selected"));
    hiddenInputNum.value = "";
  });

  btnNextPage1.addEventListener("click", (event) => {

    const selectedOpts = document.querySelectorAll(".popup__content-page-1 .custom-select.__1 .selected");

    if (!selectedOpts.length) {
      alert("Ці поля повині бути заповнені");
      event.preventDefault();
      return;
    }

    page_1.classList.add("pagehidden");
    page_2.classList.remove("pagehidden");
     event.preventDefault();
    // return;

  });

  const selectedValues = new Set(); // Використовуємо Set для унікальності

  optionsСomposition.forEach((option) => {
    option.addEventListener("click", () => {
      const value = option.getAttribute("data-value");

      if (selectedValues.has(value)) {
        // Якщо опція вже вибрана, видаляємо її
        selectedValues.delete(value);
        option.classList.remove("selected");
      } else {
        // Якщо опція не вибрана, додаємо її
        selectedValues.add(value);
        option.classList.add("selected");
      }

      // Оновлюємо значення прихованого інпуту
      hiddenInputСomposition.value = Array.from(selectedValues).join(",");
    });
  });

  btnResetPage2.addEventListener("click", () => {
    optionsСomposition.forEach((opt) => opt.classList.remove("selected"));
    hiddenInputСomposition.value = "";
    console.log("selectValueCompose: ", hiddenInputСomposition.value);
  });

  btnNextPage2.addEventListener("click", (event) => {

    const selectedOpts = document.querySelectorAll(".popup__content-page-2 .custom-select.__2 .selected");
    console.log("page1: ", hiddenInputNum.value);
    console.log("page2: ", hiddenInputСomposition.value);

    if (!selectedOpts.length) {
      alert("Ці поля повині бути заповнені");
      event.preventDefault();
      return;
    }

    page_2.classList.add("pagehidden");
    page_3.classList.remove("pagehidden");
     event.preventDefault();
  });

  btnBackPage2.addEventListener("click", (event) => {
    page_2.classList.add("pagehidden");
    page_1.classList.remove("pagehidden");
    event.preventDefault();
  });

  btnBackPage3.addEventListener("click", (event) => {
    page_3.classList.add("pagehidden");
    page_2.classList.remove("pagehidden");
    event.preventDefault();
  });

  // *****************************************************************

  const mainFormOrder = document.querySelector('.popup3 .full-form');
  const mainForm = document.querySelector('.page__section-3 .full-form');

  // Логіка обробки форми
  mainFormOrder.addEventListener('submit', (event) => {
    event.preventDefault(); // Зупиняємо стандартну поведінку форми
    if (!mainFormOrder.privacy.checked) {
      const privacy = document.querySelector(".privacy-policy");
      privacy.classList.add("error");
      alert("Заповніть всі поля!")
      return;
    }
    const privacyElem = document.querySelector(".privacy-policy");
    privacyElem.classList.remove("error");
    const name = mainFormOrder.name.value;
    const phone = mainFormOrder.phone.value;
    const email = mainFormOrder.email.value;
    const request = hiddenInputNum.value;    
    const select_type = hiddenInputСomposition.value;
    const privacy = mainFormOrder.privacy.checked ? 'Так' : 'Ні';
      sendTelegram(name, phone, email, request, select_type, privacy); // Викликаємо функцію для відправки в Telegram
  });

  mainForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Зупиняємо стандартну поведінку форми
    const name = mainForm.name.value;
    const phone = mainForm.phone.value;
    const email = mainForm.email.value;
    sendTelegram(name, phone, email); // Викликаємо функцію для відправки в Telegram
  });

  // Функція для відправки повідомлення в Telegram
  async function sendTelegram(name, phone, email, request, select_type, privacy) {
        

    // let optionValueTypeServices = document.querySelector("#select_services");

    // const selectedOption = optionValueTypeServices.options[optionValueTypeServices.selectedIndex];

    // const dataTranslate = selectedOption.getAttribute('data-translate');

    // let optionValueTypeServicesUkr = optionValueTypeServicesArr[dataTranslate];

    const botToken = '7648355172:AAE4jsw4ZfadhgoEezXJyy0X7U4EQwFkkbQ'; // Токен МІЙ бота
    const chatId = '-4588952109'; // ID чату
    // const botToken = '7648355172:AAE4jsw4ZfadhgoEezXJyy0X7U4EQwFkkbQ'; // Токен бота
    // const chatId = '-4588952109'; // ID чату
    
        // const name = name;
        // const phone = phone;
        // const email = email;
        // const request = request;    
        // const select_type = select_type;
        // const privacy = privacy;
        // const name = mainForm.name.value;
        // const phone = mainForm.phone.value;
        // const email = mainForm.email.value;
        // const request = hiddenInputNum.value;    
        // const select_type = hiddenInputСomposition.value;
        // const privacy = mainFormOrder.privacy.checked ? 'Так' : 'Ні';

        const bodymessage = `
            Запит з сайту Annamax
            Ім'я: ${name}
            Телефон: ${phone}
            Пошта: ${email}
            Літери: ${request||""}
            Наповнювачи: ${select_type||""}

            Згода на обробку даних: ${privacy||"так"}
        `;

        // Відправка через API Telegram
        try {
            const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: bodymessage
                })
            });

            const data = await response.json();
            if (data.ok) {

                // let msgTelegramGoodVar = translations[teleramsent];

                // console.log(msgTelegramGoodVar);
                console.log('The message has been successfully sent!');
                // alert(msgTelegramGoodVar);
                alert('Thank you! Your message has been sent.');

                // Автоматичне надсилання повідомлення на пошту за допомогою PHP(треба перевіряти), повідомлення не бачно
                // sendEmailPHP();

                // Відкриття додатку по замовчуванню для підтвердження та надсилання повідомлення на пошту
                // sendEmail(name, phone, email, request, select_type, select_services, privacy);

                // Автоматичне надсилання повідомлення на пошту, повідомлення не бачно
                sendEmail2(name, phone, email, request, select_type, privacy);

            } else {

                // let msgTelegramErrVar = translations[errorTelegram];
                
                // console.error(msgTelegramErrVar, data);
                console.error('Помилка Telegram:', data);
                // alert(msgTelegramErrVar);
                alert('An error occurred while sending the message');
            }
        } catch (error) {

            // let msgReqErrVar = translations[reqErr];
            // console.error(msgReqErrVar, error);
            console.error('Помилка запиту:', error);
            // alert(msgReqErrVar);
            alert('An error occurred while sending the request.');
        }
  }
  
  function sendEmail2(name, phone, email, request, select_type, privacy) {

    // сайт: https://dashboard.emailjs.com/admin/account
    // це Public Key з розділу account/general:API keys
    let emailjsID = "_ruQbUC348SMI_KYA";

    // ініціалізація сервісу за допомогою Public Key (або ще його називають user_id)
    emailjs.init(emailjsID);

    // тут я отриммав переклад деяких значень для формування об'єкту данних для відправки на пошту:
    // знаходжу елемент select з id у формі
    // let optionValueTypeServices = document.querySelector("#select_services");

    // тут в елементі select отримаємо вибраний користувачем option за допомогою індекса вибраного (selectedIndex) , тобто ми взяли елемент select зі змінної optionValueTypeServices та за допомогою метода options звернулись до масиву усіх options, а в [] дужках за допомогою метода selectedIndex отримали цифру яка дорівнює індексу обраного елементу option
    // const selectedOption = optionValueTypeServices.options[optionValueTypeServices.selectedIndex];

    // тут ми отримаємо значення з атрибуту перекладу data-translate який є у елемента option отриманого вишче, це потрібно для формування перекладів в проекті
    // const dataTranslate = selectedOption.getAttribute('data-translate');

    // тут ми звертаємось до отриманого раніше об'єкту перекладів optionValueTypeServicesArr і з ньго отримаємо значення перекладу за ключем, отриманим за крок до цього: dataTranslate
    // let optionValueTypeServicesUkr = optionValueTypeServicesArr[dataTranslate]; 

    // тут ми отримаємо в змінні значення з елементів форми mainForm
    // const name = mainForm.name.value;
    // const phone = mainForm.phone.value;
    // const email = mainForm.email.value;
    // const request = mainForm.request.value;
    // const select_type = mainForm.select_type.value;
    // const select_services = optionValueTypeServicesUkr;
    // const privacy = mainForm.privacy.checked ? 'Так' : 'Ні';

    // const name = mainForm.name.value;
    //     const phone = mainForm.phone.value;
    //     const email = mainForm.email.value;
    //     const request = hiddenInputNum.value;    
    //     const select_type = hiddenInputСomposition.value;
    //     const privacy = mainForm.privacy.checked ? 'Так' : 'Ні';

    // Параметри для Email.js, тут ми формуємо об'єкт, який надішлемо до пошти, вказаної при реєстрації на сервісі emailjs. тут головне: щоб назви ключей відповідали змінним у подвійних дужках {{}} в темплейті(шаблоні) в сервісі emailjs
    const templateParams = {
        // to_email: 'rumiyevskiy@gmail.com',
        name: `${name} from site "Annamax" `,
        phone: phone,
        email: email,
        comments: request||"",
        carType: select_type||"",
        // service: select_services,
        privacy: privacy||"Так",
    };

    // сюда SERVICE_ID записується Service ID з вкладки Edit Service який ми отримали при додаванні сервіса, яким будемо користуватися при надсиланнях повідомлень в emailjs. я використовував gmail
    let SERVICE_ID = 'service_oeydswb';
    // сюда TEMPLATE_ID записується Template ID з вкладки Email Templates, далі обираємо потрібний створений нами template (в безкоштовному варіанті їх тільки два), далі обираємо settings, там знаходимо Template ID
    let TEMPLATE_ID = 'template_2pd9prh';

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
        .then((response) => {

            // let msgGoodVar = translations[Emailsent];
            // console.log(msgGoodVar, response.status, response.text);
            console.log('Email успішно відправлено!', response.status, response.text);

            // alert(msgGoodVar);
            alert('Ваше повідомлення успішно відправлено!');
        })
        .catch((error) => {

            // let msgErrVar = translations[error];
            // console.error(msgErrVar, error);
            console.error('Помилка відправки:', error);
            // alert(msgErrVar);
            alert('Сталася помилка при відправці.');
        });
  }
  
  // *******************************************************
   
    // Отримуємо всі елементи з класом "collapsible"
    const collapsibles = document.querySelectorAll(".collapsible");
  
    collapsibles.forEach((collapsible) => {
      const header = collapsible.querySelector(".collapsible__header");
      const content = collapsible.querySelector(".collapsible__content");
  
      header.addEventListener("click", () => {
        const isExpanded = collapsible.classList.contains("collapsible--expanded");
  
        if (isExpanded) {
          // Згорнути
          content.style.height = `${content.scrollHeight}px`;
          requestAnimationFrame(() => {
            content.style.height = "0";
          });
        } else {
          // Розгорнути
          content.style.height = `${content.scrollHeight}px`;
        }
  
        collapsible.classList.toggle("collapsible--expanded");
  
        content.addEventListener(
          "transitionend",
          () => {
            if (!isExpanded) {
              content.style.height = "auto";
            }
          },
          { once: true }
        );
      });
    });
 
  

  // *******************************************************



});
  




