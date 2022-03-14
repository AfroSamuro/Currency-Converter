class ConvertorAPI {
    static getSymbols = async () => {
        let response = await fetch('https://api.exchangerate.host/symbols');
        let json = await response.json();
        return Object.keys(json.symbols)
    }

    static async convertation(from, to, amount) {
        let response = await fetch(`https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}&places=4`);
        let json = await response.json();
        return [json.result, json.info.rate]
    }
}

class ConvertorCurrency {

    selectorLeft = document.querySelector('.left__currency select');
    selectorRight = document.querySelector('.right__currency select');

    constructor() {
        this.drawOptions()
    }

    async drawOptions() {

        const symbols = await ConvertorAPI.getSymbols();


        symbols.forEach(currency => {
            const option = document.createElement('option');
            option.innerText = currency;
            option.value = currency;
            this.selectorLeft.append(option);
        })

        symbols.forEach(currency => {
            const option = document.createElement('option');
            option.innerText = currency;
            option.value = currency;
            this.selectorRight.append(option);
        })
    }


}

class Convertor {
    fromInput = document.querySelector('.left__field__input');
    toInput = document.querySelector('.right__field__input');
    rateCourseLeft = document.querySelector('.left__field__course');
    rateCourseRight = document.querySelector('.right__field__course');
    switchButton = document.querySelector('.transaction__changeButton')
    selectLeft = document.querySelector('.selectLeft');
    selectRight = document.querySelector('.selectRight');

    fromCurrency = 'USD';
    toCurrency = 'RUB';

    constructor() {
        this.fromInput.addEventListener('input', this.convertation);
        this.toInput.addEventListener('input', this.reverseConvertation);
        this.initializing();
    }

    convertation = async () => {

        const time = setTimeout(() => {
            document.querySelector('.loading').classList.remove('hidden')
        }, 500)

        try {
            const [value, rate] = await ConvertorAPI.convertation(this.fromCurrency, this.toCurrency, this.fromInput.value)
            this.toInput.value = value;
            clearTimeout(time)
            document.querySelector('.loading').classList.add('hidden')
            return rate
        } catch (e) {
            clearTimeout(time)
            document.querySelector('.error').classList.remove('hidden')
            document.querySelector('.loading').classList.add('hidden')
        }

    }

    reverseConvertation = async () => {

        const time = setTimeout(() => {
            document.querySelector('.loading').classList.remove('hidden')
        }, 500)

        try {
            const [value, rate] = await ConvertorAPI.convertation(this.toCurrency, this.fromCurrency, this.toInput.value);
            this.fromInput.value = value;
            clearTimeout(time)
            document.querySelector('.loading').classList.add('hidden')
            return rate
        } catch (e) {
            clearTimeout(time)
            document.querySelector('.error').classList.remove('hidden')
            document.querySelector('.loading').classList.add('hidden')
        }
    }

    getRateString = (from, to, rate) => `1 ${from} = ${rate} ${to}`

    setCourseLeft(rate) {
        this.rateCourseLeft.textContent = this.getRateString(this.fromCurrency, this.toCurrency, rate);
    }


    setCourseRight(rate) {
        this.rateCourseRight.textContent = this.getRateString(this.toCurrency, this.fromCurrency, rate);
    }

    async initializing() {
        this.fromInput.value = 1;
        this.setCurrentButton();
        this.convertFrom();
        this.setSwitchButton();

        document.querySelector(`.left[value=${this.fromCurrency}]`).classList.add('active');
        document.querySelector(`.right[value=${this.toCurrency}]`).classList.add('active');
    }

    async convertTo() {
        let rate = await this.reverseConvertation();
        this.setCourseLeft(+(1 / rate).toFixed(2));
        this.setCourseRight(rate);
    }

    async convertFrom() {
        let rate = await this.convertation();
        this.setCourseLeft(rate);
        this.setCourseRight(+(1 / rate).toFixed(2));
    }


    setCurrentButton() {
        document.querySelectorAll('.left').forEach(btn => {
            btn.addEventListener('click', () => {
                this.fromCurrency = btn.value;

                document.querySelector('.left__currency .active').classList.remove('active');
                btn.classList.add('active');

                this.convertFrom();
            })
        })

        document.querySelectorAll('.right').forEach(btn => {
            btn.addEventListener('click', () => {
                this.toCurrency = btn.value;

                document.querySelector('.right__currency .active').classList.remove('active');
                btn.classList.add('active');

                this.convertTo();
            })
        })


        this.selectLeft.addEventListener('change', (event) => {
            this.fromCurrency = event.target.value;

            document.querySelector('.left__currency .active').classList.remove('active');
            this.selectLeft.classList.add('active');

            this.convertTo();
        })


        this.selectRight.addEventListener('change', (event) => {
            this.toCurrency = event.target.value;

            document.querySelector('.right__currency .active').classList.remove('active');
            this.selectRight.classList.add('active');

            this.convertTo();
        })


    }

    setSwitchButton() {
        this.switchButton.addEventListener('click', () => {
            const fromSelectValue = this.selectLeft.value;
            [this.fromCurrency, this.toCurrency] = [this.toCurrency, this.fromCurrency];
            this.convertFrom()

            document.querySelectorAll('.active').forEach(btn => btn.classList.remove('active'));
            const leftButton = document
                .querySelector(`.left__currency [value=${this.fromCurrency}]`)

            const rightButton = document
                .querySelector(`.right__currency [value=${this.toCurrency}]`)

            if (leftButton.tagName === 'OPTION') {
                leftButton.parentElement.classList.add('active')
                leftButton.parentElement.value = this.selectRight.value
            } else {
                leftButton.classList.add('active')
            }


            if (rightButton.tagName === 'OPTION') {
                rightButton.parentElement.classList.add('active')
                rightButton.parentElement.value = fromSelectValue
            } else {
                rightButton.classList.add('active')
            }
        })

    }


}

class Loading {

    constructor() {
        this.createLoadingScreen()
        this.createErrorBlock()
    }

    createLoadingScreen() {
        let blackscreen = document.createElement('div');
        let loadingDiv = document.createElement('div');
        blackscreen.classList.add('loading', 'hidden');
        loadingDiv.classList.add('loadingDiv');
        loadingDiv.textContent = 'Loading...';
        document.querySelector('.page').append(blackscreen);
        document.querySelector('.loading').append(loadingDiv);
    }

    createErrorBlock() {
        let redscreen = document.createElement('div');
        let errorDiv = document.createElement('div');
        errorDiv.classList.add('errorDiv');
        redscreen.classList.add('error', 'hidden');
        errorDiv.textContent = 'Check ur connection';
        document.querySelector('.page').append(redscreen);
        document.querySelector('.error').append(errorDiv);
    }
}


const convertor = new Convertor()
const init = new ConvertorCurrency()
const loading = new Loading()