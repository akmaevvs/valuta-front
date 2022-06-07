<template>
  <div class="funds d-flex f-center">
    <div class="inner d-flex f-center f-column gap-15">
      <h2 class="funds__title">Активы</h2>
      <p style="text-align: center">
        Баланс аккаунта на 31.05.2022 09:11 <br />
        0 RUB | 0 USDT
      </p>
      <div class="converter-container d-flex f-column">
        <ul class="funds__valutes funds__valutes--top d-flex">
          <li
            class="funds__valute-button-container"
            v-for="(valute, index) in displayValutes"
            :key="index"
            :class="{ active: valute.title === selectedOptions.valute }"
            @click="selectValute(valute)"
          >
            <button class="funds__valute-button">
              {{ valute.title }}
            </button>
          </li>
        </ul>
      </div>
      <div class="converter-container d-flex f-column">
        <ul class="funds__valutes funds__valutes--top d-flex">
          <li
            class="funds__valute-button-container"
            v-for="(action, index) in displayActions"
            :key="index"
            :class="{ active: action === selectedOptions.action }"
            @click="selectAction(action)"
          >
            <button class="funds__valute-button">
              {{ action }}
            </button>
          </li>
        </ul>
      </div>
      <div class="d-flex f-column">
        <h2>
          <span v-if="selectedOptions.action === 'Пополнить'"
            >Пополнение в</span
          >
          <span v-else>Вывести</span>
          {{ selectedOptions.valute }}
        </h2>
      </div>
      <div
        class="d-flex f-column gap-15"
        style="width: 100%"
        v-if="selectedOptions.type === 'coin'"
      >
        <p v-if="selectedOptions.action === 'Вывести'" class="lh-17">
          Пожалуйста, введите адрес, сумму, код подтверждения из СМС / Google
          Authenticator, затем нажмите "Отправить". Заявка будет подтверждена в
          течение 30 минут.
        </p>
        <h3>Выберите сеть:</h3>
        <div class="converter-container d-flex f-column">
          <ul class="funds__valutes funds__valutes--top d-flex">
            <li
              class="funds__valute-button-container"
              v-for="(network, index) in displayValutes[selectedOptions.valute]
                .networks"
              :key="index"
              :class="{ active: network === selectedOptions.network }"
              @click="selectNetwork(network)"
            >
              <button class="funds__valute-button">
                {{ network }}
              </button>
            </li>
          </ul>
        </div>
        <div
          v-if="selectedOptions.action === 'Вывести'"
          class="d-flex f-column f-center w-100 gap-15"
        >
          <p class="lh-17">{{ paragraphWidthdraw }}</p>
          <form
            action=""
            class="d-flex f-column f-center w-100 gap-10"
            style="max-width: 450px"
          >
            <div class="d-flex f-btwn w-100 form-item">
              <label for="">Доступно к выводу</label>
              <span></span>
            </div>
            <div class="d-flex f-btwn w-100 form-item">
              <label for="">Адрес вывода</label>
              <input
                v-model="formWidthdraw.address"
                type="text"
                name="address"
                placeholder="Адрес получателя"
              />
            </div>
            <div class="d-flex f-btwn w-100 form-item">
              <label for="">Сумма вывода</label>
              <input
                v-model="formWidthdraw.sumWidthrow"
                type="text"
                name="address"
                placeholder="Как минимум"
              />
            </div>
            <div class="d-flex f-btwn w-100 form-item">
              <label for="">Комиссия</label>
              <input
                v-model="formWidthdraw.commission"
                type="text"
                name="address"
                disabled
              />
            </div>
            <div class="d-flex f-btwn w-100 form-item">
              <label for="">Сумма выплаты</label>
              <input
                v-model="formWidthdraw.sum"
                type="text"
                name="address"
                disabled
              />
            </div>
          </form>
        </div>
        <div v-else class="d-flex f-column f-center w-100 gap-15">
          <div class="d-flex f-center w-100 gap-15 network-block">
            <div class="d-flex f-column w-100 gap-10" style="max-width: 400px">
              <p class="big-text">
                Пожалуйста скопируйте адрес в Ваш кошелек, введите сумму,
                которую Вы хотите зачислить и подтвердите зачисление.
              </p>
              <p class="red-text bold-text med-text" v-if="minSumDepos">
                {{ minSumDepos }}
              </p>
              <p class="red-text bold-text med-text">
                {{ addressNetworkInfo }}
              </p>
            </div>
            <div>
              <img :src="qrImg" alt="" class="qr-img" />
            </div>
          </div>
          <div class="d-flex f-center address-block">
            <span>Адрес:</span>
            <span>{{ addressNetwork }}</span>
            <span><img :src="copy" alt="" srcset="" /></span>
          </div>
          <div>
            <p>Отсканируйте QR код для оплаты из мобильного приложения.</p>
          </div>
        </div>
      </div>
      <div class="d-flex f-column gap-15" style="width: 100%" v-else>
        <div
          v-if="selectedOptions.action === 'Пополнить'"
          class="d-flex f-column f-center w-100 gap-15"
        >
          <form
            action=""
            class="d-flex f-column f-center w-100 gap-10"
            style="max-width: 450px"
          >
            <div class="d-flex f-btwn w-100 form-item">
              <label for="method">Способ пополнения</label>
              <select name="method" id="" v-model="replenishmentOptions">
                <option
                  v-for="(method, index) in replenishmentMethods[
                    selectedOptions.valute
                  ]"
                  :key="index"
                  :value="method"
                >
                  {{ method.title }}
                </option>
              </select>
            </div>
            <div
              class="d-flex f-btwn w-100 form-item"
              v-if="replenishmentOptions.conditions"
            >
              <label for="method">Условия</label>
              <p>
                {{ replenishmentOptions.conditions }}
                <a :href="replenishmentOptions.href">{{
                  replenishmentOptions.hrefText
                }}</a>
              </p>
            </div>
            <div
              class="d-flex f-btwn w-100 form-item"
              v-if="replenishmentOptions.code"
            >
              <label for="method">Код пополнения</label>
              <input type="text" v-model="replenishmentOptions.codeNum" />
            </div>
            <!-- <input v-if="replenishmentMethods[selectedOptions.valute]." type="text"> -->
          </form>
        </div>
        <div v-else class="d-flex f-column f-center w-100 gap-15">
          <form
            action=""
            class="d-flex f-column f-center w-100 gap-10"
            style="max-width: 450px"
          >
            <div class="d-flex f-btwn w-100 form-item">
              <label for="method">Способ вывода</label>
              <select name="method" id="" v-model="outputOptions">
                <option
                  v-for="(method, index) in outputMethods[
                    selectedOptions.valute
                  ]"
                  :key="index"
                  :value="method"
                >
                  {{ method.title }}
                </option>
              </select>
            </div>
            <div
              class="d-flex f-btwn w-100 form-item"
              v-if="outputOptions.instructions"
            >
              <label for="method">Инструкции</label>
              <p>
                {{ outputOptions.instructions }}
                <a :href="outputOptions.href">{{ outputOptions.hrefText }}</a>
              </p>
            </div>
            <div
              class="d-flex f-btwn w-100 form-item"
              v-if="outputOptions.cardNumber"
            >
              <label for="method">Номер карты</label>
              <input type="text" v-model="outputOptions.cardNumberVal" />
            </div>
            <div
              class="d-flex f-btwn w-100 form-item"
              v-if="outputOptions.accountNumber"
            >
              <label for="method">Номер счета</label>
              <input type="text" v-model="outputOptions.accountNumberVal" />
            </div>
            <div
              class="d-flex f-btwn w-100 form-item"
              v-if="outputOptions.requests"
            >
              <label for="method">Реквизиты</label>
              <textarea type="text" v-model="outputOptions.requestsVal" />
            </div>
            <div
              class="d-flex f-btwn w-100 form-item"
              v-if="outputOptions.summaWidthraw"
            >
              <label for="method">Сумма выплаты</label>
              <input
                type="number"
                v-model="outputOptions.summaWidthrawVal"
                @input="changeSummaOutVal"
                :placeholder="`Как минимум ${outputOptions.summaWidthraw}`"
              />
            </div>
            <div
              class="d-flex f-btwn w-100 form-item"
              v-if="outputOptions.commission"
            >
              <label for="method">Комиссия</label>
              <p>{{ outputOptions.commission }} %</p>
            </div>
            <div
              class="d-flex f-btwn w-100 form-item"
              v-if="outputOptions.commission === 0"
            >
              <label for="method">Комиссия</label>
              <p>без комиссии</p>
            </div>
            <div
              class="d-flex f-btwn w-100 form-item"
              v-if="outputOptions.summaOut"
            >
              <label for="method">Сумма вывода</label>
              <input type="text" v-model="outputOptions.summaOutVal" disabled />
            </div>
            <!-- <input v-if="replenishmentMethods[selectedOptions.valute]." type="text"> -->
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import qrETHEREUM from "@/assets/img/qr/ETHEREUM.png";
import qrBEP20 from "@/assets/img/qr/BEP20.png";
import qrOMNI from "@/assets/img/qr/OMNI.png";
import qrTRON from "@/assets/img/qr/TRON.png";
import qrBITCOIN from "@/assets/img/qr/BITCOIN.png";
import copy from "@/assets/img/copy.png";

export default {
  data() {
    return {
      copy,
      id: `SN194A7E0EF3`,
      formWidthdraw: {
        address: null,
        sumWidthrow: null,
        commission: null,
        sum: null,
      },
      displayValutes: {
        RUB: {
          title: "RUB",
          type: "fiat",
        },
        USDT: {
          title: "USDT",
          type: "coin",
          networks: ["ETHEREUM (ERC20)", "BEP20", "OMNI", "TRON"],
        },
        BTC: {
          title: "BTC",
          type: "coin",
          networks: ["BITCOIN", "BEP20"],
        },
        USD: {
          title: "USD",
          type: "fiat",
        },
      },
      displayActions: ["Пополнить", "Вывести"],
      selectedOptions: {
        valute: "RUB",
        type: "fiat",
        action: "Пополнить",
        network: null,
      },
      replenishmentOptions: {},
      outputOptions: {},
      networks: {
        "ETHEREUM (ERC20)": {
          paragraphWidthdraw: `Вывод производится только на ERC20 адреса блокчейна Ethereum, начинаются на "0x", всего 42 символа.`,
          commissionWidthdraw: 15.0,
          paragraphTopUpMinSum: `Минимальная сумма депозита: 5.0 USDT`,
          addressNetworkInfo: `Это адрес депозита в формате ERC20. 42 символа.`,
          address: `0x4a8a0f5d4bcf359b2d136933199c9401624c19a0`,
          qr: qrETHEREUM,
        },
        BEP20: {
          paragraphWidthdraw: `Внимание! Вы выбрали сеть вывода BEP20 BSC (Binance Smart Chain). Удостоверьтесь, что получатель платежа поддерживает BEP20 / BSC! В противном случае ваши средства будут потеряны, и Garantex не сможет помочь в их восстановлении!`,
          commissionWidthdraw: 0.8,
          paragraphTopUpMinSum: ``,
          addressNetworkInfo: `Это адрес депозита в формате BEP20 (Binance smart chain). 42 символа.`,
          address: `0x4a8a0f5d4bcf359b2d136933199c9401624c19a0`,
          qr: qrBEP20,
        },
        OMNI: {
          paragraphWidthdraw: `Вывод производится только на OMNI адреса, начинаются на 1 или 3, всего 34 символа.`,
          commissionWidthdraw: 28.0,
          paragraphTopUpMinSum: `Минимальная сумма депозита: 10.0 USDT`,
          addressNetworkInfo: `Это адрес депозита в формате OMNI. 34 cимвола.`,
          address: `3GDzZcyCZYx1Y28Cmk6X3r4uzhhC8JT8TR`,
          qr: qrOMNI,
        },
        TRON: {
          paragraphWidthdraw: `Вывод производится только на TRC20 адреса блокчейна Tron, начинаются на "T", всего 34 символа.`,
          commissionWidthdraw: 1.0,
          paragraphTopUpMinSum: ``,
          addressNetworkInfo: `Это адрес депозита в формате TRC20 (сеть ТRON). 34 cимвола.`,
          address: `TQVkoMYpkLimzeLwhwUv92YP5WEQhHqJgT`,
          qr: qrTRON,
        },
        BITCOIN: {
          paragraphWidthdraw: `Вывод производится только на BTC адреса: обычные, SegWit или Bech32 (начинаются на bc1).`,
          commissionWidthdraw: 0.0001,
          paragraphTopUpMinSum: `Минимальная сумма депозита: 0.0001 BTC`,
          addressNetworkInfo: `Это адрес депозита в формате BTC. 34 cимвола.`,
          address: `3A2RXMajncToi52MdT4NzR3aRGpq4G1Vx5`,
          qr: qrBITCOIN,
        },
      },
      outputMethods: {
        RUB: {
          garantexCode: {
            title: "Код Garantex RUB",
            instructions: "Комиссия 0%. Без ограничений.",
            summaWidthraw: "0.01",
            summaOut: true,
            commission: 0,
            summaOutVal: null,
            summaWidthrawVal: null,
          },
          sberbank: {
            title: "Сбербанк онлайн",
            instructions: "Комиссия 0%. Без ограничений.",
            cardNumber: true,
            cardNumberVal: null,
            summaWidthraw: "50000.0",
            summaOut: true,
            summaOutVal: null,
            summaWidthrawVal: null,
            commission: 1.0,
          },
          alfabank: {
            title: "Альфа-банк cash-in",
            instructions:
              "Комиссия 2%. Минимальная сумма 50 000 рублей. Укажите номер счета, код из четырех чисел и ФИО получателя. Выводы осуществляются с 9 утра до 2 ночи.",
            accountNumber: true,
            accountNumberVal: null,
            summaWidthraw: "50000.0",
            summaOut: true,
            summaOutVal: null,
            summaWidthrawVal: null,
            commission: 2.0,
          },
          tinkoffCard: {
            title: "Тинкофф (с карты на карту)",
            instructions:
              "Комиссия 2%. Выплаты обычно производятся в течение 30 минут. Заявки на вывод Тинькофф (с карты на карту) осуществляются по номеру договора.",
            requests: true,
            requestsVal: null,
            summaWidthraw: "50000.0",
            summaOut: true,
            summaOutVal: null,
            summaWidthrawVal: null,
            commission: 2.0,
          },
          tinkoffCashIn: {
            title: "Тинкофф cash-in",
            instructions:
              "Комиссия 2%. Пополнение вашей карты Тинькофф наличными. Введите номер карты/договора в поле ввода. Выплаты обычно производятся в течение 60 минут.",
            cardNumber: true,
            summaWidthraw: "50000.0",
            summaOut: true,
            summaOutVal: null,
            summaWidthrawVal: null,
            commission: 2.0,
          },
          any: {
            title: "Карта любого банка",
            instructions:
              "Выплата на карту любого российского банка, комиссия 3%. VISA, Mastercard, МИР. Минимум 10 000р, максимум 150 000р за один платёж. Выплаты производятся с 10:00 до 20:00. Способ вывода может быть отключен по техническим причинам.",
            cardNumber: true,
            summaWidthraw: "10000.0",
            summaOut: true,
            summaOutVal: null,
            summaWidthrawVal: null,
            commission: 3.0,
          },
          kassaMoscow: {
            title: "Наличные касса Москва",
            instructions:
              "Для использования этого метода депозита необходимо пройти ",
            href: "https://dauth.garantex.io/kyc/new",
            hrefText: "полную верификацию аккаунта.",
          },
          kassaPeter: {
            title: "Наличные касса Санкт-Петербург",
            instructions:
              "Для использования этого метода депозита необходимо пройти ",
            href: "https://dauth.garantex.io/kyc/new",
            hrefText: "полную верификацию аккаунта.",
          },
        },
        USD: {
          garantexCode: {
            title: "Код Garantex USD",
            instructions: "Комиссия 0%. Без ограничений.",
            summaWidthraw: "0.01",
            summaOut: true,
            commission: "без комиссии",
          },
          kassaMoscow: {
            title: "Наличные касса Москва",
            instructions:
              "Для использования этого метода депозита необходимо пройти ",
            href: "https://dauth.garantex.io/kyc/new",
            hrefText: "полную верификацию аккаунта.",
            addInstruction:
              "Для использования этого метода вывода необходимо выбрать валюту аккаунта.",
          },
        },
      },
      replenishmentMethods: {
        RUB: {
          garantexCode: {
            title: "Код Garantex RUB",
            conditions:
              "Комиссия 0%. Без ограничений. Купить и продать код Garantex удобным для Вас способом оплаты Вы можете на специализированной P2P секции Garantex. ",
            href: "https://garantex.io/p2p",
            hrefText: "https://garantex.io/p2p",
            code: true,
            codeNum: "",
          },
          kassaMoscow: {
            title: "Наличные касса Москва",
            conditions:
              "Для использования этого метода депозита необходимо пройти ",
            href: "https://dauth.garantex.io/kyc/new",
            hrefText: "полную верификацию аккаунта.",
          },
          kassaPeter: {
            title: "Наличные касса Санкт-Петербург",
            conditions:
              "Для использования этого метода депозита необходимо пройти ",
            href: "https://dauth.garantex.io/kyc/new",
            hrefText: "полную верификацию аккаунта.",
          },
          others: {
            title: "Другие способы пополнения",
            conditions:
              "В специализированной P2P секции Garantex, Вы можете пополнить рублевый счет биржи удобным способом. В секции представлены предложения с использованием всех распространенных банков и платежных систем. ",
            href: "https://garantex.io/p2p",
            hrefText: "https://garantex.io/p2p",
          },
        },
        USD: {
          garantexCode: {
            title: "Код Garantex USD",
            code: true,
            codeNum: "",
          },
          kassaMoscow: {
            title: "Наличные касса Москва",
            conditions:
              "Для использования этого метода депозита необходимо пройти ",
            href: "https://dauth.garantex.io/kyc/new",
            hrefText: "полную верификацию аккаунта.",
          },
        },
      },
    };
  },
  computed: {
    paragraphWidthdraw() {
      return this.networks[this.selectedOptions.network].paragraphWidthdraw;
    },
    minSumDepos() {
      return this.networks[this.selectedOptions.network].paragraphTopUpMinSum;
    },
    addressNetworkInfo() {
      return this.networks[this.selectedOptions.network].addressNetworkInfo;
    },
    qrImg() {
      return this.networks[this.selectedOptions.network].qr;
    },
    addressNetwork() {
      return this.networks[this.selectedOptions.network].address;
    },
  },
  methods: {
    selectValute(valute) {
      this.replenishmentOptions = {};
      this.outputOptions = {};

      this.selectedOptions.valute = valute.title;
      this.selectedOptions.type = valute.type;
      if (valute.type === "coin") {
        this.selectedOptions.network = valute.networks[0];
      }
    },
    changeSummaOutVal() {
      this.outputOptions.summaOutVal =
      this.outputOptions.summaWidthrawVal +
        (this.outputOptions.summaWidthrawVal +
        parseFloat(this.outputOptions.commission / 100));
    },
    selectAction(action) {
      this.outputOptions = {};
      this.replenishmentOptions = {};

      this.selectedOptions.action = action;
      this.formWidthdraw.commission =
        this.networks[this.selectedOptions.network]?.commissionWidthdraw;
    },
    selectNetwork(network) {
      this.selectedOptions.network = network;
      this.formWidthdraw.commission =
        this.networks[this.selectedOptions.network]?.commissionWidthdraw;
    },
    selectReplenishmentMethod(method) {
      this.replenishmentOptions = method;
    },
  },
};
</script>

<style lang="scss">
.active {
  background-color: #ebebeb;
  transition: background-color 0.3s ease;
  & button {
    color: #000;
  }
}
.converter-container {
  position: relative;
  border: 1px solid #dfdfdf;
  border-radius: 5px;
  background-color: #fff;
  width: 100%;
  // box-shadow: 4px 4px 8px 0px rgba(0, 0, 0, 0.08);
  // box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
  // box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.19);
}
.funds {
  margin-bottom: 70px;
  &__title {
    color: #333;
    margin-top: 20px;
    font-size: 25px;
    font-weight: 700;
  }
  &__img {
    width: 100%;
    max-width: 150px;
    height: auto;
  }
  .info {
    font-size: 16px;
    line-height: 20px;
    text-align: justify;
    color: #333;
    &__state {
      z-index: 0;
      padding: 10px;
      background-color: #fff;
      border: 1px solid #dddddd;
      cursor: default;
      transition: all 0.3s ease;
      &:hover {
        box-shadow: 4px 4px 10px 0px rgba(124, 124, 124, 0.2);
        transform: scale(1.02);
      }
    }
  }
  &__values {
    width: 100%;
    overflow: hidden;
    justify-content: space-around;
    height: 200px;
    position: relative;
    hr {
      height: 1px;
      width: 100%;
      border: none;
      border-bottom: 1px solid #dfdfdf;
    }
  }
  &__currency-note {
    padding: 0px 10px 10px 10px;
    font-size: 12px;
    min-height: 22px;
  }
  &__input {
    border: none;
    outline: none;
    width: 100%;
    padding: 10px;
    font-size: 35px;
    &:first-child {
      // border-bottom: 1px solid #dfdfdf;
    }
  }
  &__valutes {
    justify-content: space-between;
    &--bot {
      border-top: 1px solid #dfdfdf;
    }
    &--top {
      border-bottom: 1px solid #dfdfdf;
    }
  }
  &__valute-button-container {
    border-left: 1px solid #dfdfdf;
    width: 100%;
    display: flex;
    justify-content: center;
    transition: background-color 0.2s ease;
    cursor: pointer;
    &:hover {
      background-color: #f0f0f0;
      transition: background-color 0.3s ease;
    }
    &:first-child {
      border-left: 0px;
    }
  }
  &__valute-button {
    padding: 10px;
    color: #333;
    &--more-down {
      &::before {
        transform: rotate(45deg);
      }
      &::after {
        transform: rotate(-45deg);
      }
    }
    &--more-up {
      &::before {
        transform: rotate(-45deg);
      }
      &::after {
        transform: rotate(45deg);
      }
    }
    &--more-down,
    &--more-up {
      position: relative;
      &::before {
        content: "";
        display: block;
        position: absolute;
        width: 15px;
        height: 2px;
        background-color: #333;
        top: 17px;
        left: -5px;
      }
      &::after {
        content: "";
        display: block;
        position: absolute;
        width: 15px;
        height: 2px;
        background-color: #333;
        top: 17px;
        left: 5px;
      }
    }
  }
}
.form-item {
  gap: 25px;
  label {
    width: 50%;
  }
  input,
  p,
  select,
  textarea {
    border: 1px solid #dfdfdf;
    outline: none;
    padding: 10px;
    border-radius: 5px;
    background: #fff;
  }
  *:disabled,
  p {
    background: #ececec;
    color: #545454;
  }
}
.address-block {
  border: 1px solid #dfdfdf;
  border-radius: 30px;
  span {
    border-left: 1px solid #dfdfdf;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0px 10px;
    img {
      width: 20px;
      height: auto;
      cursor: pointer;
    }
  }
  span:first-child {
    border: none;
  }
}
@media screen and (max-width: 767px) {
  .address-block {
    border-radius: 15px;
    flex-direction: column;
    span {
      border-left: 0;
      border-top: 1px solid #dfdfdf;
      width: 100%;
    }
  }
  .network-block {
    flex-direction: column;
  }
  .form-item {
    label {
      padding-left: 10px;
    }
    flex-direction: column;
    gap: 5px;
    justify-content: flex-start;
    align-items: unset;
  }
  .qr-img {
    width: 200px;
    height: auto;
  }
}
@media screen and (min-width: 768px) {
  .network-block {
    max-width: 850px;
  }
  .form-item {
    gap: 25px;
    label {
      width: 50%;
    }
    input,
    p,
    select,
    textarea {
      width: 100%;
    }
  }
  .qr-img {
    width: 150px;
    height: auto;
  }
}
</style>
