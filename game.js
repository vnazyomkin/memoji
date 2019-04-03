'use strict';
var cards = document.querySelector('.cards');
var end = document.querySelector('.end');
var divTimer = document.querySelector('.timer');
var interval = 60;  // время отсчета
var animals={       //  изображения на картах
    dog: '🐶',
    cat: '🐱',
    hourse: '🦄',
    pig: '🐷',
    panda: '🐼',
    leon: '🦁'
};
Cards();    // запуск переворота по нажатию
Game();     // запуск логики игры

function Cards(){    
    cards.addEventListener('click', event=>{    // событие по клику
        if (event.target.tagName === 'DIV') event.target.parentNode.classList.toggle('flip');
    });
}

function Game(){
    randomAnimals();    // вызов функции перемешивания карт
    timer(interval);    // вызов функции таймера
    firstClick();       // старт таймера при клике

    cards.addEventListener('click', function(event){ // обработка клика по карте
        var oldOpens=[];
        var opens=[];
        var parent=event.target.parentNode
        if (event.target.tagName === 'DIV' && !parent.classList.contains('flip-fixed')){  // если клик по карте, которая еще не открыта, то
            oldOpens = Array.from(document.querySelectorAll('.open'));  
                if (parent.classList.contains('open') && (oldOpens.length < 2)) {           // если клик по той же карте, что и прошлый
                oldOpens[0].classList.remove('open');                                       // закрываем ее
            } 
            else if (!parent.classList.contains('open')){                               //если клик на другую карту
                if (oldOpens.length === 2){                                               //проверка двух открытых карт
                    if (oldOpens[0].dataset.animal !== oldOpens[1].dataset.animal){     //если они не равны, то 
                        oldOpens.forEach(item=>item.classList.remove('flip-fixed'));    // по новому клику они опять закруются
                        oldOpens.forEach(item=>item.children[1].classList.remove('red'));// перестают подсвечиваться красным
                    }
                    oldOpens.forEach(item=>item.classList.remove('open','flip'));       // у всех 
                }
                parent.classList.toggle('open');
                opens = Array.from(cards.querySelectorAll('.open')); // создание массива из всех открытых карт 
                if (opens.length > 1){    // если открыты больше 1 карты
                        opens[0].classList.add('flip-fixed' );  //добавляем к ним класс flip-fixed
                        opens[1].classList.add('flip-fixed');
                    if (opens[0].dataset.animal === opens[1].dataset.animal){ // и они  равны
                        opens[0].children[1].classList.add('green');
                        opens[1].children[1].classList.add('green');
                    } 
                    else{
                        opens[0].children[1].classList.add('red');
                        opens[1].children[1].classList.add('red');     
                    }
                } 
                if(cards.querySelectorAll('.green').length === 12){
                    stop();
                    finish('win');
                    win();

                }
            }
        }
    });

    document.querySelector('.again').onclick = () => {  // ИГРАТЬ СНАЧАЛА
        Array.from(document.querySelectorAll('.lose')).forEach(item=>item.classList.remove('lose'));
        Array.from(document.querySelectorAll('.win')).forEach(item=>item.classList.remove('win'));
        Array.from(document.querySelectorAll('.green')).forEach(item=>item.classList.remove('green'));
        Array.from(document.querySelectorAll('.red')).forEach(item=>item.classList.remove('red'));
        Array.from(document.querySelectorAll('.open')).forEach(item=>item.classList.remove('open'));
        Array.from(document.querySelectorAll('.card.flip')).forEach(item=>item.classList.remove('flip'));
        Array.from(document.querySelectorAll('.flip-fixed')).forEach(item=>item.classList.remove('flip-fixed'));   
        firstClick();
        timer(interval);
        setTimeout(randomAnimals(),300); 
};
    
    function firstClick(){  // функция запуска таймера при первом клике на карту
        var firstClick = true;
        Array.from(cards.querySelectorAll('.card-back')).forEach(item=>item.onclick = ()=>{
            if(firstClick){
                timerStart(interval);
                firstClick = false;
            }
        });
    }

    function randomAnimals(){                                               // функция случайных карт
        var animalsKeys = Array.prototype.slice.call(Object.keys(animals)); // массив из  ключей объекта animals
        animalsKeys = animalsKeys.concat(animalsKeys);                      // удвоил его
        shuffle(animalsKeys);                                               // перемешанный массив из ключей в случайном порядке
        animalsKeys.forEach((item, index)=>{                                // итерация по массиву animalsKeys
            var child = cards.children[index].querySelector('.card-front'); // -index-ая карта = child
            child.textContent=animals[item];                                // добавление в нее случайного животного
            child.parentNode.dataset.animal = item;                         
        });
    }

    function shuffle(arr){    // функция перемешивания массива
        var j, temp;
        for(var i = arr.length - 1; i > 0; i--){
            j = Math.floor(Math.random()*(i + 1));
            temp = arr[j];
            arr[j] = arr[i];
            arr[i] = temp;
        }
        return arr;
    }

    function timer(s){          //функция таймера
        var time= new Date();
        time.setHours(0);
        time.setMinutes(0);
        time.setSeconds(s);
        var second, minutes;
        time.getSeconds() < 10 ?  second = '0' + time.getSeconds() : second = '' + time.getSeconds();
        time.getMinutes() < 10 ?  minutes = '0' + time.getMinutes() : second = '' + time.getMinutes();     
        divTimer.textContent = minutes + ':' + second;
    }
    var id;
    
    function timerStart(t) {    // функция движения таймера
            id=setInterval(()=>{
            t--;
            timer(t);
            if (t<1){
                stop();
                finish('lose');
                lose();
            }
        },1000);
    }
    function stop(){    // функция остановки таймера
        clearInterval(id); 
    }

    function finish(f){  // функция 
        document.querySelector('.window').classList.add(f);
        document.querySelector('.background').classList.add(f);
    }

    function lose(){
        createWord('lose');        
        document.querySelector('.again').textContent='Try again';
    }

    function win(){
        createWord('Win');        
        document.querySelector('.again').textContent='Play again';
    }

    function createWord(word){
        Array.from(end.children).forEach(item=>Kill(item));
        var item;
        for (var i=0; i < word.length; i++){
                item = document.createElement('div');
                item.textContent = word[i];
                item.classList.add('animation');
            end.appendChild(item);
        }
    }

    function Kill(object) {
        object.innerText = null;
        object.innerHTML = null;
        object.outerHTML = null;
        object = null;
        }   

}



