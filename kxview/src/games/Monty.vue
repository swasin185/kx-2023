<script lang="ts">
export default {
  name: 'Monty'
}
</script>

<script setup lang="ts">
import { ref } from 'vue'

const message = ref('เกมส์เปิดการ์ดหาเหรียญ')
const coins = ref(10)
const counter = ref(0)
const winrate = ref(0)
let selected = ref(-1)
let coinCard = 1
let winCount = 0

interface Card {
  id: number
  name: string
  isOpened: boolean
}

const cards = ref<Card[]>([
  { id: 0, name: 'A', isOpened: true },
  { id: 1, name: 'B', isOpened: true },
  { id: 2, name: 'C', isOpened: true }
])

function select(card: Card): void {
  if (cards.value[coinCard].isOpened) {
    reset()
  } else {
    if (selected.value == -1) {
      selected.value = card.id
      message.value = 'ยืนยัน / เปลี่ยนการ์ด'
      let rc = Math.round(Math.random())
      if (card.id != coinCard) rc = 0
      let x = (card.id + 1 + rc) % cards.value.length
      while (cards.value[x].id == coinCard) x = (x + 1) % cards.value.length
      cards.value[x].isOpened = true
    } else {
      if (card.id == coinCard) {
        coins.value += 2
        winCount++
        message.value = 'เจอเหรียญ +1'
      } else {
        message.value = '!!! ตูม !!!'
      }
      winrate.value = Math.round((winCount / counter.value) * 10000) / 100
      for (const c of cards.value) c.isOpened = true
      selected.value = card.id
    }
  }
}

function reset(): void {
  if (coins.value == 0) {
    message.value = 'ไม่มีเหรียญเล่นแล้ว'
    return
  }
  for (let x of cards.value) x.isOpened = false
  coinCard = Math.floor(Math.random() * cards.value.length)
  selected.value = -1
  counter.value++
  coins.value--
  message.value = 'เลือกการ์ด 1 ใบ'
  const x = document.activeElement as HTMLElement
  x.blur()
}
</script>

<template>
  <div style="height: 100%; padding: 100px; text-align: center">
    <h1><img style="height: 1.5em; padding-top: 0.8em" src="../assets/coin.png" />{{ coins }}</h1>
    <h2>{{ message }}</h2>
    <div>
      <button class="card" v-for="card in cards" :key="card.id" @click="select(card)">
        <h3>{{ card.name }}</h3>
        <img
          style="height: 8em; padding: 10px"
          src="../assets/question.svg"
          class="img"
          v-show="!card.isOpened"
        />
        <img
          style="height: 8em; padding: 10px"
          src="../assets/coin.png"
          class="img"
          v-show="card.isOpened && card.id == coinCard"
        />
        <img
          style="height: 8em; padding: 10px"
          src="../assets/bomb.svg"
          v-show="card.isOpened && card.id != coinCard"
        />
      </button>
    </div>
    <h4>
      ครั้งที่ {{ counter }}
      <progress :value="winrate" max="100" />
      {{ winrate }}%
    </h4>
  </div>
</template>

<style lang="css" scoped>
.img:hover {
  filter: drop-shadow(0 0 2em rgb(80, 0, 20));
}

.card:focus {
  background: white;
  color: darkred;
}
.card {
  margin: 1em;
  height: 20em;
  width: 12em;
  background: darkred;
  color: white;
  border-width: 0.2em;
  border-color: darkgrey;
  outline-color: red;
}
</style>
