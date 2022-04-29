<template>
  <div class="calc d-flex f-center">
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
            type="number"
            @change="askChanged"
            v-model="askValue"
            placeholder="Отдаете"
          />
          <span class="converter__currency-note"
            >1 {{ selectedAsk }} = 0.0069 {{ selectedBid }}</span
          >
          <hr />
          <div class="circle-change"></div>
          <input
            class="converter__input"
            type="number"
            @change="bidChanged"
            v-model="bidValue"
            placeholder="Получите"
          />
          <span class="converter__currency-note"
            >1 {{ selectedBid }} = 144.547 {{ selectedAsk }}</span
          >
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
        :class="{ 'calc__button--disabled': !fixCurrency }"
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
    </div>
  </div>
</template>

<script>
// import axios from "axios";
export default {
  name: "Calc",
  data() {
    return {
      fixCurrency: false,
      showRedBorder: false,
      showModal: false,
      jwt: "eyJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2NTExNjk4NjYsImV4cCI6MTY1MTI1NjI2Niwic3ViIjoic2Vzc2lvbiIsImlzcyI6ImJhcm9uZyIsImF1ZCI6WyJwZWF0aW8iXSwianRpIjoiQ0I0RjY3MjdBNkNFQjNEMDQ4NUE5REY0IiwidWlkIjoiSUQ4N0IyNzkxREYwIiwiZW1haWwiOiJtYWtlbW9uZXlub3R3YXIxQGdtYWlsLmNvbSIsInJvbGUiOiJtZW1iZXIiLCJsZXZlbCI6Miwic3RhdGUiOiJhY3RpdmUiLCJhcGlfa2lkIjoiNTZlMjVlNzQtOGU0NC00YTgxLWEwNDMtYWE1ZjEwMDdhYjBjIn0.UbovdCj7Rzlm2hRAeR4bE3cbUN_6OdVykF6rvCNX7n8KJNlm_9JSU8MuVxKvDkypsWW74QdzxIOFeDZWdq1Uf4For-NNfXSIchGxmpsWRGD2qKyh7IGVErJofQwSbbHrHDmSpA22Rh8BDgLCIT_YsqlmZuG6TckIzB14gXwOGUDQTAuXRHPs5_hS1ZG_gAfHwlNr_U8-IIZASumD3dnoPaEIZt1Mno-diGWXcDSjf2bsw53qo5Ous0vMd868bNEUfYvoJa0mBt85KtYhpHZJElrA7W6mI_7JrJk3g1xcOTKOsPXViBODGxc8lz5i5eg7VrHmtCaFg6V3QtRJW9Dyiw",
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
      displayUnitsTop: ["RUB", "USD", "BTC", "USDT"],
      displayUnitsBot: ["RUB", "USD", "BTC", "USDT"],
      selectedAsk: "RUB",
      selectedBid: "USD",
      askValue: null,
      bidValue: null,
      showMoreAsk: false,
      showMoreBid: false,
    };
  },
  components: {},
  computed: {
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
    round(num) {
      return Math.round(num * 100) / 100;
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
      let curSum = this.askValue; // кол-во (своё)
      let curCur = 0; // текущий курс
      let i = 0; // индекс стакана
      let allSum = 0; // всего руб
      let ost = 0;
      while (curSum != 0) {
        console.log(this.depthUsdtRub[i]);
        curSum = curSum - parseFloat(this.depthUsdtRub[i].volume); // кол-во (стакан)
        console.log(curSum);
        if (curSum >= 0) {
          allSum = // всего руб
            allSum +
            parseFloat(this.depthUsdtRub[i].price) * // текущий курс
              parseFloat(this.depthUsdtRub[i].volume); // количество usdt
        } else {
          ost = parseFloat(this.depthUsdtRub[i].volume) + curSum;
          allSum = allSum + parseFloat(this.depthUsdtRub[i].price) * ost;

          curSum = 0;
        }
        i = i + 1;
      }

      curCur = allSum / this.askValue; // текущий курс = всего руб / введенное значений
      this.bidValue = this.round(
        this.askValue * curCur + this.askValue * 0.001 * curCur
      ); // итог = введенное значений * текущий курс + текущий курс * комиссия * текущий курс
    },
    bidChanged() {},
    selectAsk(askUnit) {
      if (!this.displayUnitsTop.includes(askUnit)) {
        this.displayUnitsTop[3] = askUnit;
      }
      this.showMoreAsk = false;
      this.selectedAsk = askUnit;
    },
    selectBid(bidUnit) {
      if (!this.displayUnitsBot.includes(bidUnit)) {
        this.displayUnitsBot[3] = bidUnit;
      }
      this.showMoreBid = false;
      this.selectedBid = bidUnit;
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
        window.open("https://t.me/morismoss", "_self");
        // this.router.push("https://t.me/morismoss");
      }
      // this.markets.forEach((item) => {
      //   axios.post("http://localhost:8080/depth", {
      //     jwt: this.jwt,
      //     id: item.id,
      //   });
      // });
    },
  },
};
</script>
<style lang="scss" scoped>
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
  overflow: hidden;
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
</style>
