<template>
  <div class="calc d-flex f-center f-column">
    <div class="inner d-flex f-center f-column gap-15">
      <h2 class="calc__title">Конвертация денежных средств</h2>
      <div class="converter-container d-flex f-column">
        <ul class="converter__valutes converter__valutes--top d-flex">
          <li
            class="converter__valute-button-container"
            v-for="(askUnit, index) in displayUnitsTop"
            :key="index"
            :class="{ active: askUnit === selectedAsk }"
            @click="selectAsk(askUnit)"
          >
            <button class="converter__valute-button">
              {{ askUnit }}
            </button>
          </li>
          <li class="converter__valute-button-container" @click="ShowMoreAsk()">
            <button
              class="converter__valute-button converter__valute-button--more-down"
            ></button>
          </li>
        </ul>
        <div class="converter__values d-flex f-column">
          <input
            class="converter__input"
            type="text"
            @input="askChanged"
            v-model="askValue"
            placeholder="Отдаете"
            :disabled="loadingDepth"
          />
          <span class="converter__currency-note">
            <template
              v-if="askValue && this.type === 'ask' && !isNaN(this.curCur)"
            >
              1 {{ selectedAsk }} =
              {{ curCurVal }}
              {{ selectedBid }}
            </template>
            <template
              v-if="
                askValue &&
                this.type === 'fiat' &&
                selectedAsk === 'USD' &&
                !isNaN(this.curCur)
              "
            >
              1 {{ selectedAsk }} =
              {{ curCurVal }}
              {{ selectedBid }}
            </template>
          </span>
          <hr />
          <div
            class="circle-change"
            @click="changeAskBid"
            :class="{ animate: animateStyle }"
          ></div>
          <input
            class="converter__input"
            type="text"
            @input="bidChanged"
            v-model="bidValue"
            placeholder="Получите"
            :disabled="loadingDepth"
          />
          <span class="converter__currency-note">
            <template
              v-if="askValue && this.type === 'bid' && !isNaN(this.curCur)"
            >
              1 {{ selectedBid }} =
              {{ curCurVal }}
              {{ selectedAsk }}
            </template>
            <template
              v-if="
                askValue &&
                this.type === 'fiat' &&
                selectedBid === 'USD' &&
                !isNaN(this.curCur)
              "
            >
              1 {{ selectedBid }} =
              {{ curCurVal }}
              {{ selectedAsk }}
            </template>
          </span>
          <transition name="more-units-top">
            <ul class="more-units more-units--top" v-if="showMoreAsk">
              <li
                v-for="(askUnitMore, index) in allUnits"
                :key="index"
                @click="selectAsk(askUnitMore)"
              >
                {{ askUnitMore }}
              </li>
            </ul>
          </transition>
          <transition name="more-units-bottom">
            <ul class="more-units more-units--bot" v-if="showMoreBid">
              <li
                v-for="(bidUnitMore, index) in allUnits"
                :key="index"
                @click="selectBid(bidUnitMore)"
              >
                {{ bidUnitMore }}
              </li>
            </ul>
          </transition>
        </div>
        <ul class="converter__valutes converter__valutes--bot d-flex">
          <li
            class="converter__valute-button-container"
            v-for="(bidUnit, index) in displayUnitsBot"
            :key="index"
            :class="{ active: bidUnit === selectedBid }"
            @click="selectBid(bidUnit)"
          >
            <button class="converter__valute-button">
              {{ bidUnit }}
            </button>
          </li>
          <li class="converter__valute-button-container" @click="ShowMoreBid()">
            <button
              class="converter__valute-button converter__valute-button--more-up"
            ></button>
          </li>
        </ul>
        <transition name="modal-load">
          <div class="loading" v-if="loadingDepth">Загрузка курса</div>
        </transition>
      </div>
      <div class="d-flex fix-block" :class="{ 'red-border': showRedBorder }">
        <input
          type="checkbox"
          v-model="fixCurrency"
          id="fix-currency"
          name="fix-currency"
          @change="ShowModal"
        />
        <label for="fix-currency"
          >Зафиксировать курс и согласие с условиями обмена</label
        >
      </div>
      <button
        class="calc__button d-flex f-center"
        :class="{
          'calc__button--disabled':
            !fixCurrency || !type || !askValue || !bidValue || errorVal,
        }"
        :disabled="!type || !askValue || !bidValue || errorVal"
        @click="exchange"
      >
        Обменять
      </button>
      <transition name="modal">
        <div v-if="fixCurrency" class="modal-message">
          <p>
            Конвертер валют онлайн - инструмент, который позволит вам рассчитать
            соотношения актуальных курсов денежных средств всего мира на
            сегодня.
          </p>
        </div>
      </transition>
      <transition name="modal">
        <div v-if="errorVal" class="modal-error">
          <p>{{ errorMes }}</p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Calc",
  data() {
    return {
      fixCurrency: false,
      showRedBorder: false,
      showModal: false,
      curCurVal: null,
      currencies: [
        {
          id: "aed",
          symbol: "إ",
          type: "fiat",
          min_deposit_amount: "0.0",
          withdraw_min_amount: "0.0",
          precision: 2,
        },
        {
          id: "aff",
          symbol: "₽",
          type: "fiat",
          min_deposit_amount: "0.0",
          withdraw_min_amount: "0.0",
          precision: 2,
        },
        {
          id: "btc",
          symbol: "฿",
          explorer_transaction:
            "https://blockchair.com/bitcoin/transaction/#{txid}",
          explorer_address: "https://blockchair.com/bitcoin/address/#{address}",
          blockchain: "btc",
          type: "coin",
          min_deposit_amount: "0.0001",
          withdraw_min_amount: "0.0001",
          precision: 8,
        },
        {
          id: "btc-bbtc",
          base_currency: "btc",
          symbol: "฿",
          explorer_transaction: "https://etherscan.io/tx/#{txid}",
          explorer_address: "https://etherscan.io/address/#{address}",
          blockchain: "ethereum",
          contract_address: "0x9be89d2a4cd102d8fecc6bf9da793be995c22541",
          type: "coin",
          min_deposit_amount: "0.0",
          withdraw_min_amount: "0.0011",
          precision: 8,
        },
        {
          id: "btc-bsc",
          base_currency: "btc",
          symbol: "฿",
          explorer_transaction: "https://bscscan.com/tx/#{txid}",
          explorer_address: "https://bscscan.com/address/#{address}",
          blockchain: "bsc",
          contract_address: "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c",
          type: "coin",
          min_deposit_amount: "0.0",
          withdraw_min_amount: "0.000005",
          precision: 8,
        },
        {
          id: "btc-hbtc",
          base_currency: "btc",
          symbol: "฿",
          explorer_transaction: "https://etherscan.io/tx/#{txid}",
          explorer_address: "https://etherscan.io/address/#{address}",
          blockchain: "ethereum",
          contract_address: "0x0316eb71485b0ab14103307bf65a021042c6d380",
          type: "coin",
          min_deposit_amount: "0.0",
          withdraw_min_amount: "0.00146251",
          precision: 8,
        },
        {
          id: "dai",
          symbol: "$",
          explorer_transaction: "https://etherscan.io/tx/#{txid}",
          explorer_address: "https://etherscan.io/address/#{address}",
          blockchain: "ethereum",
          contract_address: "0x6b175474e89094c44da98b954eedeac495271d0f",
          type: "coin",
          min_deposit_amount: "5.0",
          withdraw_min_amount: "30.0",
          precision: 2,
        },
        {
          id: "dai-bsc",
          base_currency: "dai",
          symbol: "$",
          explorer_transaction: "https://bscscan.com/tx/#{txid}",
          explorer_address: "https://bscscan.com/address/#{address}",
          blockchain: "bsc",
          contract_address: "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
          type: "coin",
          min_deposit_amount: "0.0",
          withdraw_min_amount: "1.8",
          precision: 2,
        },
        {
          id: "eth",
          symbol: "Ξ",
          explorer_transaction: "https://etherscan.io/tx/#{txid}",
          explorer_address: "https://etherscan.io/address/#{address}",
          blockchain: "ethereum",
          type: "coin",
          min_deposit_amount: "0.0",
          withdraw_min_amount: "0.01",
          precision: 6,
        },
        {
          id: "eth-bsc",
          base_currency: "eth",
          symbol: "Ξ",
          explorer_transaction: "https://bscscan.com/tx/#{txid}",
          explorer_address: "https://bscscan.com/address/#{address}",
          blockchain: "bsc",
          contract_address: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
          type: "coin",
          min_deposit_amount: "0.0",
          withdraw_min_amount: "0.00062",
          precision: 6,
        },
        {
          id: "rub",
          symbol: "₽",
          type: "fiat",
          min_deposit_amount: "0.0",
          withdraw_min_amount: "0.0",
          precision: 2,
        },
        {
          id: "uah",
          symbol: "₴",
          type: "fiat",
          min_deposit_amount: "0.0",
          withdraw_min_amount: "0.0",
          precision: 2,
        },
        {
          id: "usd",
          symbol: "$",
          type: "fiat",
          min_deposit_amount: "0.0",
          withdraw_min_amount: "0.0",
          precision: 2,
        },
        {
          id: "usdc",
          symbol: "$",
          explorer_transaction: "https://etherscan.io/tx/#{txid}",
          explorer_address: "https://etherscan.io/address/#{address}",
          blockchain: "ethereum",
          contract_address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          type: "coin",
          min_deposit_amount: "0.0",
          withdraw_min_amount: "30.0",
          precision: 2,
        },
        {
          id: "usdc-bsc",
          base_currency: "usdc",
          symbol: "$",
          explorer_transaction: "https://bscscan.com/tx/#{txid}",
          explorer_address: "https://bscscan.com/address/#{address}",
          blockchain: "bsc",
          contract_address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
          type: "coin",
          min_deposit_amount: "0.0",
          withdraw_min_amount: "1.8",
          precision: 2,
        },
        {
          id: "usdc-tron",
          base_currency: "usdc",
          symbol: "$",
          explorer_transaction: "https://tronscan.org/#/transaction/#{txid}",
          explorer_address: "https://tronscan.org/#/address/#{address}",
          blockchain: "tron",
          contract_address: "TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8",
          type: "coin",
          min_deposit_amount: "0.0",
          withdraw_min_amount: "2.0",
          precision: 2,
        },
        {
          id: "usdt",
          symbol: "$",
          explorer_transaction: "https://etherscan.io/tx/#{txid}",
          explorer_address: "https://etherscan.io/address/#{address}",
          blockchain: "ethereum",
          contract_address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
          type: "coin",
          min_deposit_amount: "0.0",
          withdraw_min_amount: "30.0",
          precision: 2,
        },
        {
          id: "usdt-bsc",
          base_currency: "usdt",
          symbol: "$",
          explorer_transaction: "https://bscscan.com/tx/#{txid}",
          explorer_address: "https://bscscan.com/address/#{address}",
          blockchain: "bsc",
          contract_address: "0x55d398326f99059ff775485246999027b3197955",
          type: "coin",
          min_deposit_amount: "0.0",
          withdraw_min_amount: "1.8",
          precision: 2,
        },
        {
          id: "usdt-omni",
          base_currency: "usdt",
          symbol: "$",
          explorer_transaction: "https://omniexplorer.info/tx/#{txid}",
          explorer_address: "https://omniexplorer.info/address/#{address}",
          blockchain: "omni-usdt",
          type: "coin",
          min_deposit_amount: "10.0",
          withdraw_min_amount: "228.0",
          precision: 2,
        },
        {
          id: "usdt-tron",
          base_currency: "usdt",
          symbol: "$",
          explorer_transaction: "https://tronscan.org/#/transaction/#{txid}",
          explorer_address: "https://tronscan.org/#/address/#{address}",
          blockchain: "tron",
          contract_address: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
          type: "coin",
          min_deposit_amount: "0.0",
          withdraw_min_amount: "2.0",
          precision: 2,
        },
      ],
      markets: [
        {
          id: "btcrub",
          name: "BTC/RUB",
          ask_unit: "btc",
          bid_unit: "rub",
          min_ask: "0.00001",
          min_bid: "5.0",
        },
        {
          id: "btcuah",
          name: "BTC/UAH",
          ask_unit: "btc",
          bid_unit: "uah",
          min_ask: "0.00001",
          min_bid: "1.0",
        },
        {
          id: "btcusd",
          name: "BTC/USD",
          ask_unit: "btc",
          bid_unit: "usd",
          min_ask: "0.00001",
          min_bid: "0.0",
        },
        {
          id: "btcaed",
          name: "BTC/AED",
          ask_unit: "btc",
          bid_unit: "aed",
          min_ask: "0.00001",
          min_bid: "0.0",
        },
        {
          id: "usdtuah",
          name: "USDT/UAH",
          ask_unit: "usdt",
          bid_unit: "uah",
          min_ask: "0.1",
          min_bid: "1.0",
        },
        {
          id: "usdtrub",
          name: "USDT/RUB",
          ask_unit: "usdt",
          bid_unit: "rub",
          min_ask: "0.1",
          min_bid: "5.0",
        },
        {
          id: "dairub",
          name: "DAI/RUB",
          ask_unit: "dai",
          bid_unit: "rub",
          min_ask: "0.1",
          min_bid: "5.0",
        },
        {
          id: "usdtusd",
          name: "USDT/USD",
          ask_unit: "usdt",
          bid_unit: "usd",
          min_ask: "0.1",
          min_bid: "0.0",
        },
        {
          id: "usdtaed",
          name: "USDT/AED",
          ask_unit: "usdt",
          bid_unit: "aed",
          min_ask: "0.1",
          min_bid: "0.0",
        },
        {
          id: "ethuah",
          name: "ETH/UAH",
          ask_unit: "eth",
          bid_unit: "uah",
          min_ask: "0.00025",
          min_bid: "1.0",
        },
        {
          id: "ethaed",
          name: "ETH/AED",
          ask_unit: "eth",
          bid_unit: "aed",
          min_ask: "0.00001",
          min_bid: "0.0",
        },
        {
          id: "ethusd",
          name: "ETH/USD",
          ask_unit: "eth",
          bid_unit: "usd",
          min_ask: "0.00025",
          min_bid: "0.1",
        },
        {
          id: "daiuah",
          name: "DAI/UAH",
          ask_unit: "dai",
          bid_unit: "uah",
          min_ask: "0.1",
          min_bid: "5.0",
        },
        {
          id: "daiaed",
          name: "DAI/AED",
          ask_unit: "dai",
          bid_unit: "aed",
          min_ask: "0.00001",
          min_bid: "0.0",
        },
        {
          id: "ethrub",
          name: "ETH/RUB",
          ask_unit: "eth",
          bid_unit: "rub",
          min_ask: "0.00025",
          min_bid: "5.0",
        },
        {
          id: "daiusd",
          name: "DAI/USD",
          ask_unit: "dai",
          bid_unit: "usd",
          min_ask: "0.1",
          min_bid: "0.1",
        },
        {
          id: "btcusdc",
          name: "BTC/USDC",
          ask_unit: "btc",
          bid_unit: "usdc",
          min_ask: "0.00001",
          min_bid: "0.1",
        },
        {
          id: "usdcusd",
          name: "USDC/USD",
          ask_unit: "usdc",
          bid_unit: "usd",
          min_ask: "0.1",
          min_bid: "0.0",
        },
        {
          id: "usdcuah",
          name: "USDC/UAH",
          ask_unit: "usdc",
          bid_unit: "uah",
          min_ask: "0.1",
          min_bid: "1.0",
        },
        {
          id: "usdcrub",
          name: "USDC/RUB",
          ask_unit: "usdc",
          bid_unit: "rub",
          min_ask: "0.1",
          min_bid: "5.0",
        },
        {
          id: "usdcaed",
          name: "USDC/AED",
          ask_unit: "usdc",
          bid_unit: "aed",
          min_ask: "0.1",
          min_bid: "0.0",
        },
        {
          id: "btcusdt",
          name: "BTC/USDT",
          ask_unit: "btc",
          bid_unit: "usdt",
          min_ask: "0.00001",
          min_bid: "0.1",
        },
        {
          id: "ethusdt",
          name: "ETH/USDT",
          ask_unit: "eth",
          bid_unit: "usdt",
          min_ask: "0.00025",
          min_bid: "0.1",
        },
        {
          id: "usdcusdt",
          name: "USDC/USDT",
          ask_unit: "usdc",
          bid_unit: "usdt",
          min_ask: "0.1",
          min_bid: "0.1",
        },
        {
          id: "ethusdc",
          name: "ETH/USDC",
          ask_unit: "eth",
          bid_unit: "usdc",
          min_ask: "0.00025",
          min_bid: "0.1",
        },
        {
          id: "ethbtc",
          name: "ETH/BTC",
          ask_unit: "eth",
          bid_unit: "btc",
          min_ask: "0.00025",
          min_bid: "0.00001",
        },
        {
          id: "daiusdt",
          name: "DAI/USDT",
          ask_unit: "dai",
          bid_unit: "usdt",
          min_ask: "0.1",
          min_bid: "0.1",
        },
      ],
      selectedMarket: "rubusdt",
      selectedMarketReverse: "usdtrub",
      selectedDepth: [],
      selectedDepthToUsdt: [],
      selectedDepthFromUsdt: [],
      depthUsdtRub: [
        {
          price: "74.11",
          volume: "6468.73",
          amount: "479408",
          factor: "0.05",
          type: "factor",
        },
        {
          price: "120.0",
          volume: "100.0",
          amount: "12000.0",
          factor: "0.703",
          type: "limit",
        },
        {
          price: "700.0",
          volume: "1.44",
          amount: "1008.0",
          factor: "8.935",
          type: "limit",
        },
        {
          price: "255918.79",
          volume: "145.28",
          amount: "37180700.0",
          factor: "3627.483",
          type: "limit",
        },
      ],
      allUnits: ["RUB", "USD", "BTC", "USDT", "ETH", "DAI", "USDC"],
      displayUnitsTop: ["RUB", "USDT", "BTC", "USD"],
      displayUnitsBot: ["RUB", "USDT", "BTC", "USD"],
      selectedAsk: "RUB",
      selectedBid: "USDT",
      askValue: null,
      bidValue: null,
      showMoreAsk: false,
      showMoreBid: false,
      curCur: null,
      type: null,
      loadingDepth: false,
      animateStyle: false,
      errorVal: false,
      errorMes: "Ошибка загрузка курса",
    };
  },
  mounted() {
    this.selectDepth();
  },
  components: {},
  computed: {

    curValue() {
      if (this.type === "bid") {
        return this.round(1 / this.curCur);
      }
      return this.curCur;
    },
    // AllUnits() {
    //   // return new Set(
    //   //   this.markets
    //   //     .map((market) => {
    //   //       return market.ask_unit;
    //   //     })
    //   //     .concat(
    //   //       this.markets.map((market) => {
    //   //         return market.bid_unit;
    //   //       })
    //   //     )
    //   // );
    // },
  },
  methods: {
    async Animate() {},
    round(num, typeAsk, typeBid, cur) {
      let del = 2;
      if (num < 1 || cur) {
        del = 3;
      }
      if ((num < 0.1 || typeAsk === "BTC" || typeBid === "BTC") && !cur) {
        del = 5;
      }
      if (num < 0.05) {
        del = 8;
      }
      // return num;
      return parseFloat(num).toFixed(del);
    },
    ShowMoreAsk() {
      this.showMoreAsk = !this.showMoreAsk;
      this.showMoreBid = false;
    },
    ShowMoreBid() {
      this.showMoreAsk = false;
      this.showMoreBid = !this.showMoreBid;
    },
    askChanged() {
      this.errorVal = false;
      if (this.type === "ask" || this.type === "bid") {
        // this.askValue = this.formatCurrency(this.askValue);
        let curSum = this.askValue; // кол-во (своё)
        let curCur = 0; // текущий курс
        let i = 0; // индекс стакана
        let allSum = 0; // всего руб
        let ost = 0;
        if (this.type === "ask") {
          while (curSum != 0) {
            if (i == this.selectedDepth.length) {
              this.showError("Невозможно произвести расчёт");
              return;
            }
            curSum = curSum - parseFloat(this.selectedDepth[i].volume); // кол-во (стакан)
            if (curSum >= 0) {
              allSum = // всего руб
                allSum +
                parseFloat(this.selectedDepth[i].price) * // текущий курс
                  parseFloat(this.selectedDepth[i].volume); // количество usdt
            } else {
              ost = parseFloat(this.selectedDepth[i].volume) + curSum;
              allSum = allSum + parseFloat(this.selectedDepth[i].price) * ost;

              curSum = 0;
            }
            i = i + 1;
          }
        } else if (this.type === "bid") {
          while (curSum != 0) {
            if (i == this.selectedDepth.length) {
              this.showError("Невозможно произвести расчёт");
              return;
            }
            curSum = curSum - parseFloat(this.selectedDepth[i].amount); // кол-во (стакан)
            if (curSum >= 0) {
              allSum = // всего руб
                allSum +
                parseFloat(this.selectedDepth[i].price) * // текущий курс
                  parseFloat(this.selectedDepth[i].amount); // количество usdt
            } else {
              ost = parseFloat(this.selectedDepth[i].amount) + curSum;
              allSum = allSum + parseFloat(this.selectedDepth[i].price) * ost;

              curSum = 0;
            }
            i = i + 1;
          }
        }

        curCur = allSum / this.askValue; // текущий курс = всего руб / введенное значений
        this.curCur = this.round(
          curCur,
          this.selectedAsk,
          this.selectedBid,
          true
        );
        this.curCurVal = this.round(
          curCur + curCur * 0.002,
          this.selectedAsk,
          this.selectedBid,
          true
        );

        if (this.type === "ask") {
          this.bidValue = !isNaN(curCur)
            ? this.round(
                this.askValue * (curCur - curCur * 0.002),
                this.selectedAsk,
                this.selectedBid
              )
            : null; // итог = введенное значений * текущий курс + текущий курс * комиссия * текущий курс
        } else {
          this.bidValue = !isNaN(curCur)
            ? this.selectedAsk === "USD"
              ? this.round(
                  this.askValue / (curCur + curCur * 0.001),
                  this.selectedAsk,
                  this.selectedBid
                )
              : this.round(
                  this.askValue / (curCur + curCur * 0.002),
                  this.selectedAsk,
                  this.selectedBid
                )
            : null;
        }
      } else if (this.type === "fiat") {
        let curSum = this.askValue; // кол-во (своё)
        let curCur = 0; // текущий курс
        let i = 0; // индекс стакана
        let allSum = 0; // всего руб
        let ost = 0;

        while (curSum != 0) {
          if (i == this.selectedDepthToUsdt.length) {
            this.showError("Невозможно произвести расчёт");
            return;
          }
          curSum = curSum - parseFloat(this.selectedDepthToUsdt[i].amount); // кол-во (стакан)
          if (curSum >= 0) {
            allSum = // всего руб
              allSum +
              parseFloat(this.selectedDepthToUsdt[i].price) * // текущий курс
                parseFloat(this.selectedDepthToUsdt[i].amount); // количество usdt
          } else {
            ost = parseFloat(this.selectedDepthToUsdt[i].amount) + curSum;
            allSum =
              allSum + parseFloat(this.selectedDepthToUsdt[i].price) * ost;

            curSum = 0;
          }
          i = i + 1;
        }

        curCur = allSum / this.askValue; // текущий курс = всего руб / введенное значений
        console.log(curCur);

        let bidValue =
          this.selectedAsk === "USD"
            ? this.round(this.askValue / (curCur + 0.001 * curCur))
            : this.round(this.askValue / (curCur + 0.002 * curCur));

        curSum = bidValue; // кол-во (своё)
        curCur = 0; // текущий курс
        i = 0; // индекс стакана
        allSum = 0; // всего руб
        ost = 0;

        while (curSum != 0) {
          if (i == this.selectedDepthFromUsdt.length) {
            this.showError("Невозможно произвести расчёт");
            return;
          }
          curSum = curSum - parseFloat(this.selectedDepthFromUsdt[i].volume); // кол-во (стакан)
          if (curSum >= 0) {
            allSum = // всего руб
              allSum +
              parseFloat(this.selectedDepthFromUsdt[i].price) * // текущий курс
                parseFloat(this.selectedDepthFromUsdt[i].volume); // количество usdt
          } else {
            ost = parseFloat(this.selectedDepthFromUsdt[i].volume) + curSum;
            allSum =
              allSum + parseFloat(this.selectedDepthFromUsdt[i].price) * ost;

            curSum = 0;
          }
          i = i + 1;
        }

        curCur = allSum / bidValue; // текущий курс = всего руб / введенное значений
        // this.curCur = this.round(curCur);
        console.log(curCur);

        this.bidValue = !isNaN(curCur)
          ? this.round(bidValue * (curCur - curCur * 0.002))
          : null;
        console.log(this.askValue, this.bidValue);
        this.curCur =
          this.askValue > this.bidValue
            ? this.round(this.askValue / this.bidValue)
            : this.round(this.bidValue / this.askValue);

        this.curCurVal =
          this.askValue > this.bidValue
            ? this.round((this.askValue / this.bidValue) + (this.askValue / this.bidValue * 0.002))
            : this.round((this.bidValue / this.askValue) + (this.bidValue / this.askValue * 0.002));
      }
    },
    changeAskBid() {
      [this.askValue, this.bidValue] = [this.bidValue, this.askValue];
      [this.selectedAsk, this.selectedBid] = [
        this.selectedBid,
        this.selectedAsk,
      ];
      this.animateStyle = true;
      setTimeout(() => {
        this.animateStyle = false;
      }, 500);
      // [this.selectedMarket, this.selectedMarketReverse] = [
      //   this.selectedMarketReverse,
      //   this.selectedMarket,
      // ];
      this.selectAsk(this.selectedAsk);
      this.selectBid(this.selectedBid);
      if (!this.displayUnitsTop.includes(this.selectedAsk)) {
        this.displayUnitsTop[3] = this.selectedAsk;
      }
      if (!this.displayUnitsBot.includes(this.selectedBid)) {
        this.displayUnitsBot[3] = this.selectedBid;
      }
    },
    bidChanged() {
      this.errorVal = false;
      // this.bidValue = this.formatCurrency(this.bidValue);
      if (this.type === "ask" || this.type === "bid") {
        let curSum = this.bidValue; // кол-во (своё)
        let curCur = 0; // текущий курс
        let i = 0; // индекс стакана
        let allSum = 0; // всего руб
        let ost = 0;
        if (this.type === "bid") {
          while (curSum != 0) {
            if (i == this.selectedDepth.length) {
              this.showError("Невозможно произвести расчёт");
              return;
            }
            curSum = curSum - parseFloat(this.selectedDepth[i].volume); // кол-во (стакан)
            if (curSum >= 0) {
              allSum = // всего руб
                allSum +
                parseFloat(this.selectedDepth[i].price) * // текущий курс
                  parseFloat(this.selectedDepth[i].volume); // количество usdt
            } else {
              ost = parseFloat(this.selectedDepth[i].volume) + curSum;
              allSum = allSum + parseFloat(this.selectedDepth[i].price) * ost;

              curSum = 0;
            }
            i = i + 1;
          }
        } else if (this.type === "ask") {
          while (curSum != 0) {
            if (i == this.selectedDepth.length) {
              this.showError("Невозможно произвести расчёт");
              return;
            }
            console.log(i, this.selectedDepth.length);
            curSum = curSum - parseFloat(this.selectedDepth[i].amount); // кол-во (стакан)
            if (curSum >= 0) {
              allSum = // всего руб
                allSum +
                parseFloat(this.selectedDepth[i].price) * // текущий курс
                  parseFloat(this.selectedDepth[i].amount); // количество usdt
            } else {
              ost = parseFloat(this.selectedDepth[i].amount) + curSum;
              allSum = allSum + parseFloat(this.selectedDepth[i].price) * ost;

              curSum = 0;
            }
            i = i + 1;
          }
        }

        curCur = allSum / this.bidValue; // текущий курс = всего руб / введенное значений
        this.curCur = this.round(
          curCur,
          this.selectedAsk,
          this.selectedBid,
          true
        );
        this.curCurVal = this.round(
          curCur + curCur * 0.002,
          this.selectedAsk,
          this.selectedBid,
          true
        );

        if (this.type === "bid") {
          this.askValue = !isNaN(curCur)
            ? this.round(
                this.bidValue * (curCur + 0.002 * curCur),
                this.selectedAsk,
                this.selectedBid
              )
            : null; // итог = введенное значений * текущий курс + текущий курс * комиссия * текущий курс
        } else {
          this.askValue = !isNaN(curCur)
            ? this.round(
                this.bidValue / (curCur - curCur * 0.002),
                this.selectedAsk,
                this.selectedBid
              )
            : null;
        }
      } else if (this.type === "fiat") {
        let curSum = this.bidValue; // кол-во (своё)
        let curCur = 0; // текущий курс
        let i = 0; // индекс стакана
        let allSum = 0; // всего руб
        let ost = 0;

        while (curSum != 0) {
          if (i == this.selectedDepthFromUsdt.length) {
            this.showError("Невозможно произвести расчёт");
            return;
          }
          curSum = curSum - parseFloat(this.selectedDepthFromUsdt[i].amount); // кол-во (стакан)
          if (curSum >= 0) {
            allSum = // всего руб
              allSum +
              parseFloat(this.selectedDepthFromUsdt[i].price) * // текущий курс
                parseFloat(this.selectedDepthFromUsdt[i].amount); // количество usdt
          } else {
            ost = parseFloat(this.selectedDepthFromUsdt[i].amount) + curSum;
            allSum =
              allSum + parseFloat(this.selectedDepthFromUsdt[i].price) * ost;

            curSum = 0;
          }
          i = i + 1;
        }

        curCur = allSum / this.bidValue; // текущий курс = всего руб / введенное значений

        let bidValue =
          this.selectedBid === "USD"
            ? this.round(this.bidValue / (curCur - curCur * 0.001))
            : this.round(this.bidValue / (curCur - curCur * 0.002));

        curSum = bidValue; // кол-во (своё)
        curCur = 0; // текущий курс
        i = 0; // индекс стакана
        allSum = 0; // всего руб
        ost = 0;

        while (curSum != 0) {
          if (i == this.selectedDepthToUsdt.length) {
            console.log("Невозможно посчитвать");
            return;
          }
          curSum = curSum - parseFloat(this.selectedDepthToUsdt[i].volume); // кол-во (стакан)
          if (curSum >= 0) {
            allSum = // всего руб
              allSum +
              parseFloat(this.selectedDepthToUsdt[i].price) * // текущий курс
                parseFloat(this.selectedDepthToUsdt[i].volume); // количество usdt
          } else {
            ost = parseFloat(this.selectedDepthToUsdt[i].volume) + curSum;
            allSum =
              allSum + parseFloat(this.selectedDepthToUsdt[i].price) * ost;

            curSum = 0;
          }
          i = i + 1;
        }

        curCur = allSum / bidValue; // текущий курс = всего руб / введенное значений

        this.askValue = !isNaN(curCur)
          ? this.round(bidValue * (curCur + 0.002 * curCur))
          : null;
        this.curCur =
          this.askValue > this.bidValue
            ? this.round(this.askValue / this.bidValue)
            : this.round(this.bidValue / this.askValue);
        
        this.curCurVal =
          this.askValue > this.bidValue
            ? this.round((this.askValue / this.bidValue) + (this.askValue / this.bidValue * 0.002))
            : this.round((this.bidValue / this.askValue) + (this.bidValue / this.askValue * 0.002));
      }
    },
    selectAsk(askUnit) {
      if (!this.displayUnitsTop.includes(askUnit)) {
        this.displayUnitsTop[3] = askUnit;
      }
      this.showMoreAsk = false;
      this.selectedAsk = askUnit;
      this.selectedMarket = `${this.selectedAsk.toLowerCase()}${this.selectedBid.toLowerCase()}`;
      this.selectedMarketReverse = `${this.selectedBid.toLowerCase()}${this.selectedAsk.toLowerCase()}`;
      this.selectDepth();
    },
    showError(message) {
      this.errorVal = true;
      this.errorMes = message;
      setTimeout(() => {
        this.errorVal = false;
      }, 1500);
    },
    selectDepth() {
      this.loadingDepth = true;
      let type = null;
      if (
        this.markets.filter((item) => {
          return item.id === this.selectedMarket;
        }).length > 0
      ) {
        type = "ask";
      } else if (
        this.markets.filter((item) => {
          return item.id === this.selectedMarketReverse;
        }).length > 0
      ) {
        type = "bid";
      } else if (this.selectedMarket === this.selectedMarketReverse) {
        this.type = null;
      } else {
        type = "fiat";
      }

      if (type === "ask" || type === "bid") {
        axios
          .post("https://valuta-back.vercel.app/depth", {
            marketId:
              type === "ask" ? this.selectedMarket : this.selectedMarketReverse,
          })
          .then((response) => {
            const { data } = response;
            if (data.name && data.name === "Error") {
              this.showError("Не удалось загрузить курс");
              return;
            }
            if (type === "ask") {
              this.selectedDepth = data["bids"];
            } else if (type === "bid") {
              this.selectedDepth = data["asks"];
            }
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            this.type = type;
            this.curCur = this.selectedDepth[0].price;
            this.curCurVal = this.selectedDepth[0].price * 0.002;
            this.askChanged();
            this.loadingDepth = false;
          });
      } else if (type === "fiat") {
        this.selectedMarket = "usdt" + this.selectedAsk.toLowerCase();
        axios
          .post("https://valuta-back.vercel.app/depth", {
            marketId: this.selectedMarket,
          })
          .then((responseAsk) => {
            const { data } = responseAsk;
            if (data.name && data.name === "Error") {
              this.showError("Не удалось загрузить курс");
              return;
            }
            this.selectedDepthToUsdt = data["asks"];
            this.selectedMarket = "usdt" + this.selectedBid.toLowerCase();
            axios
              .post("https://valuta-back.vercel.app/depth", {
                marketId: this.selectedMarket,
              })
              .then((responseBid) => {
                const { data } = responseBid;
                this.selectedDepthFromUsdt = data["bids"];
                if (data.name && data.name === "Error") {
                  this.showError("Не удалось загрузить курс");
                  return;
                }
              })
              .catch((err) => {
                console.log(err);
                return;
              });
          })
          .catch((err) => {
            console.log(err);
            return;
          })
          .finally(() => {
            this.loadingDepth = false;
            this.type = "fiat";
            this.askChanged();
            // this.curCur = this.round(
            //   this.selectedDepthToUsdt[0].price /
            //     this.selectedDepthFromUsdt[0].price
            // );
          });
      }
    },
    selectBid(bidUnit) {
      if (!this.displayUnitsBot.includes(bidUnit)) {
        this.displayUnitsBot[3] = bidUnit;
      }
      this.showMoreBid = false;
      this.selectedBid = bidUnit;
      this.selectedMarket = `${this.selectedAsk.toLowerCase()}${this.selectedBid.toLowerCase()}`;
      this.selectedMarketReverse = `${this.selectedBid.toLowerCase()}${this.selectedAsk.toLowerCase()}`;
      this.selectDepth();
    },

    ShowModal() {
      this.showRedBorder = false;
      if (this.fixCurrency) {
        this.showModal = true;
      }
    },
    hideModal() {
      this.showModal = false;
    },
    exchange() {
      console.log(1);
      if (!this.fixCurrency) {
        this.showRedBorder = true;
      } else {
        const linkVal =
          `${this.selectedAsk}_${this.selectedBid}_${this.askValue}_${this.bidValue}`.replaceAll(
            ".",
            "-"
          );
        console.log(linkVal);
        window.open(
          `https://t.me/valuta_node_test_bot?start=${linkVal}`,
          "_self"
        );
        // this.router.push("https://t.me/morismoss");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.loading {
  position: absolute;
  bottom: -20px;
  align-self: center;
}
.modal-container {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.circle-change {
  position: absolute;
  width: 50px;
  height: 50px;
  right: 40px;
  background: #fff;
  border: 1px solid #dfdfdf;
  border-radius: 50px;
  background-image: url("../assets/img/change.png");
  background-size: 40px 40px;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
  // top: 93px;
}
.fix-block {
  border: 2px solid transparent;
  border-radius: 5px;
  padding: 5px 10px;
  gap: 10px;
  height: 36px;
  align-items: center;
  transition: all 0.3s ease;
  input,
  label {
    cursor: pointer;
  }
}
.red-border {
  border-color: #ff0000a9;
}
.modal-error {
  position: absolute;
  top: 40px;
  border: 2px solid #d67277;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 310px;
  text-align: center;
  font-size: 17px;
  color: #d8000c;
  background-color: #ffd2d2;
  padding: 15px 20px;
  border-radius: 5px;
}
.modal-message {
  border: 1px solid #dfdfdf;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 410px;
  text-align: justify;
  background: #fff;
  padding: 20px;
  border-radius: 5px;
  margin-left: 20px;
  margin-right: 20px;
}
.ok-button {
  padding: 5px 10px;
  width: 50%;
  background-color: #ebebeb;
  align-self: center;
  transition: background-color 0.3s ease;
  border-radius: 5px;
  &:hover {
    background-color: #f0f0f0;
  }
}
.more-units {
  &--bot {
    bottom: 5px;
  }
  &--top {
    top: 5px;
  }
  position: absolute;
  right: 5px;
  width: 150px;
  background: #fff;
  border: 1px solid #dfdfdf;
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
  li {
    border-bottom: 1px solid #dfdfdf;
    padding: 5px 0px;
    width: 100%;
    text-align: center;
    cursor: pointer;
    &:hover {
      background-color: #f0f0f0;
      transition: background-color 0.3s ease;
    }
    &:first-child {
      border-radius: 5px 5px 0px 0px;
    }
    &:last-child {
      border-bottom: none;
      border-radius: 0px 0px 5px 5px;
    }
  }
  // box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.19);
}
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
  // box-shadow: 4px 4px 8px 0px rgba(0, 0, 0, 0.08);
  // box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
  // box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.19);
}
.converter {
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
.calc {
  margin-bottom: 80px;

  &__title {
    color: #333;
    margin-top: 20px;
    font-size: 25px;
    font-weight: 700;
  }

  &__button {
    // margin-bottom: 30px;
    padding: 10px 20px 10px 10px;
    background-color: #333;
    position: relative;
    color: #f9f9f9;
    text-decoration: none;
    font-size: 17px;
    border-radius: 4px;
    overflow: hidden;
    transition: all 0.3s ease;
    cursor: pointer;
    &--disabled {
      background-color: #929292;
    }
    &:hover {
      // box-shadow: 4px 4px 10px 0px rgba(124, 124, 124, 0.6);
      // transform: scale(1.02) !important;
      // animation-play-state: paused;
    }
    &:before {
      background-image: url("../assets/img/telegram-logo-small.png");
      background-size: 20px 20px;
      display: inline-block;
      background-repeat: no-repeat;
      width: 20px;
      height: 20px;
      content: "";
      padding-right: 10px;
    }
    &:after {
      content: "";
      display: block;
      width: 20px;
      height: 200px;
      margin-left: 50px;
      background: rgba(255, 255, 255, 0.603);
      left: -40px;
      top: -100px;
      z-index: 1;
      transform: rotate(30deg);
      position: absolute;
      animation: glaring 5s ease-in-out 0.05s infinite;
    }
  }
}
@keyframes bouncing {
  0% {
    transform: scale(1);
    box-shadow: 4px 4px 10px 0px rgba(124, 124, 124, 0.4);
  }
  15% {
    transform: scale(1.02);
    box-shadow: 4px 4px 10px 0px rgba(124, 124, 124, 0.6);
  }
  30% {
    transform: scale(1);
    box-shadow: 4px 4px 10px 0px rgba(124, 124, 124, 0.4);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes glaring {
  0% {
    left: -30px;
    margin-left: 0px;
  }
  30% {
    left: 110%;
    margin-left: 80px;
  }
  100% {
    left: 110%;
    margin-left: 80px;
  }
}
@media screen and (max-width: 320px) {
  .calc__img {
    max-width: 100px;
  }
}
.animate {
  animation-duration: 0.5s;
  animation-name: spinner;
  animation-iteration-count: 1;
}
@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  // 50% {
  //   transform: rotate(180deg);
  // }
  100% {
    transform: rotate(-180deg);
  }
}
</style>
