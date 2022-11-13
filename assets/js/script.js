(() => {
    const clock = {
        nowDate: 0,
        userDate: 0,
        
        
        get distance() {
            return this.userDate - this.nowDate
        },

        days() {
            return this.distance / (1000 * 60 * 60 * 24);
        },

        hours() { 
            return this.distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60);
        },

        minutes() {
            return (this.distance % (1000 * 60 * 60)) / (1000 * 60);
        },

        seconds() {
            return (this.distance % (1000 * 60)) / 1000;
        }
        
    };

    const elementsTime = document.querySelectorAll('.clock-time');
    const eventTitle = document.querySelector('#event-name');
    const ulEvent = document.querySelector('#list-events');
    let loop = null;
    
    const showCountdown = () => {
        elementsTime.forEach(el => {
            const value = Math.floor(clock[el.id]());

            el.innerText = value;
            
            if (value < 59) return;
        });
    }

    const init = () => {
        clock.nowDate = new Date().getTime();
            
        clearInterval(loop);

        loop = setInterval(() => {
            clock.nowDate += 1000;
            showCountdown();  
        }, 1000);
    }
    
    const formateSave = text => text.toLowerCase().trim().replace(/ /g, '_');
    const formateText = text => text.replace(/_/g, ' ');
    
    
    const setIcon = (element, newName, color, title) => {
        element.innerText = newName;
        element.style.color = color;
        element.setAttribute('title', title);
    };
    
    const focusInput = (element) => {
        eventTitle.removeAttribute('disabled');
        eventTitle.focus();
        eventTitle.select();
        setIcon(element, 'check_circle', 'rgb(0 194 53', 'Save event');
    }

    const disabledInput = (element) => {
        eventTitle.setAttribute('disabled', '1');
        setIcon(element, 'edit', 'white', 'edit name');
    }
    
    const formateDate = date => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        return `${year}-${month}-${day}`;
    }

    
    const dateTomorrow = () => {
        const date = new Date().getTime();
        const tomorrow = new Date(date + 60 ** 2 * 1000 * 24 )
        const dateISO = formateDate(tomorrow);
        return dateISO;   
    }


    const limitDate = (element, dateISO) => {
        element.setAttribute('min', dateISO)
    };


    
    
    const createEl = (name) => document.createElement(name);
    
    
    const showEventSave = (name) => {
        const li = createEl('li');
        const btn = createEl('button');
        
        btn.classList.add('btn-delete-event', 'btn');
        li.classList.add('event-names', 'btn');
        
        li.innerText = name;
        li.appendChild(btn);
        ulEvent.appendChild(li)
    };

    const saveEvent = () => {
        const nameEvent = eventTitle.value.trim();
        const nameSave = formateSave(nameEvent);
        let saveDate = 'save';
        
        if (!nameEvent || !clock.userDate) {
            alert('Date or Name invalid!');
            return;
        }
        
        
        if (localStorage.getItem(nameSave)) {
            saveDate = confirm('Event already exists! Do you want to change date?');
            
        }
        
        if (saveDate) {
            const dateJSON = JSON.stringify(clock.userDate);

            localStorage.setItem(nameSave, dateJSON);       
        }

        if (typeof saveDate !== 'string') return;

        showEventSave(nameEvent);
        
    };

    
    const deleteDateSave = name => {
        const nameFormat = formateSave(name);

        localStorage.removeItem(nameFormat);
    }


    const loadEvents = () => {
        const eventObj = Object.keys(localStorage);
       
        for (let name of eventObj) {
            const nameFormat = formateText(name);
            showEventSave(nameFormat);
        }
    }

    loadEvents()

    document.addEventListener('click', e => {
        const el = e.target;
        
        if (!el.classList.contains('btn')) return;

        if (el.classList.contains('btn-delete-event')) {
            const parent = el.parentElement;
            parent.remove();
            deleteDateSave(parent.innerText);
            return;
        }
        
        if (el.innerText === 'edit') {
            focusInput(el);

        } else if (el.id === 'btn-icon' && el.innerText === 'check_circle') {
            saveEvent();
            disabledInput(el);

        } else if (el.id === 'date-input') {
            const tomorrow = dateTomorrow();

            limitDate(el, tomorrow);

        } else if (el.classList.contains('event-names')) {
            const name = formateSave(el.innerText);
            const date = JSON.parse(localStorage.getItem(name));

            clock.userDate = new Date(date);
            eventTitle.value = el.innerText;
            init();

            return;
        }
    });

    document.addEventListener('change', e => {
        const el = e.target;

        if (el.id !== 'date-input') return;

        clock.userDate = new Date(el.value);
        clock.nowDate = new Date().getTime();
  
        if (clock.userDate <= clock.nowDate) {
            alert('invalid date!'.toUpperCase());
            return;
        }

        init()

    });
    
})();
