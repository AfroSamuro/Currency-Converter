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

    fromCurrency = 'RUB';
    toCurrency = 'USD';

    constructor() {
        this.fromInput.addEventListener('input', this.convertation);
        this.toInput.addEventListener('input', this.reverseConvertation);
        this.initializing();
    }

    convertation = async () => {
        const [value, rate] = await ConvertorAPI.convertation(this.fromCurrency, this.toCurrency, this.fromInput.value)
        this.toInput.value = value;
        return rate
    }

    reverseConvertation = async () => {
        const [value, rate] = await ConvertorAPI.convertation(this.toCurrency, this.fromCurrency, this.toInput.value);
        this.fromInput.value = value;
        return rate
    }

    getRateString = (from, to, rate) => `1 ${from} = ${rate} ${to}`

    setCourseLeft(rate) {
        this.rateCourseLeft.textContent = this.getRateString(this.fromCurrency, this.toCurrency, rate);
    }


    setCourseRight(rate) {
        this.rateCourseRight.textContent = this.getRateString(this.toCurrency, this.fromCurrency, rate);
    }

    async initializing() {
        this.setCurrentButton()
        this.fromInput.value = 1;
        this.convertFrom()

        document.querySelector(`.left[value=${this.fromCurrency}]`).classList.add('active')
        document.querySelector(`.right[value=${this.toCurrency}]`).classList.add('active')
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

                document.querySelector('.left__currency .active').classList.remove('active')
                btn.classList.add('active')

                this.convertFrom()
            })
        })

        document.querySelectorAll('.right').forEach(btn => {
            btn.addEventListener('click', () => {
                this.toCurrency = btn.value;

                document.querySelector('.right__currency .active').classList.remove('active')
                btn.classList.add('active')

                this.convertTo()
            })
        })

        const selectLeft = document.querySelector('.selectLeft')
        const selectRight = document.querySelector('.selectRight')


        selectLeft.addEventListener('change', (event) => {
            this.toCurrency = event.target.value;

            document.querySelector('.left__currency .active').classList.remove('active')
            selectLeft.classList.add('active')

            this.convertTo()
        })


        selectRight.addEventListener('change', (event) => {
            this.toCurrency = event.target.value;

            document.querySelector('.right__currency .active').classList.remove('active')
            selectRight.classList.add('active')

            this.convertTo()
        })


    }


}


const convertor = new Convertor()
const init = new ConvertorCurrency()
