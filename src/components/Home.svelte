<script lang="ts">
  import type { User } from "firebase/auth";
  import { Button } from "@/components/base/button";
  import { collection, addDoc } from "firebase/firestore"; 
  import { db } from "@/firebase/client";
  import CardPreview from "./CardPreview.svelte";
  import LoadingButton from "./LoadingButton.svelte";
  export let user: User;

  let firstName = '';
  let lastName = '';
  let address = '';
  let city = '';
  let postcode = '';
  let phoneNumber = '';
  let email = '';
  let cardsQuantity: number | null = null;
  let loading = false;
  
  let expressShipping = 350;
  let pricePerOne = 290;

  let discountedPrice = 0;
  let totalPrice = 0;

  let showSuccessMessage = false;

  function handlePhoneNumberChange(event: any) {
    phoneNumber = event.target.value.replace(/[^0-9+]/g, '');
  }

  function calculatePrice() {
    let quantity = cardsQuantity
    if (quantity !== null) {
      if (quantity >= 1 && quantity <= 4) {
        discountedPrice = quantity * pricePerOne;
        totalPrice = quantity * pricePerOne;
      } else if (quantity >= 5 && quantity <= 9) {
        discountedPrice = quantity * pricePerOne * 0.8;
        totalPrice = quantity * pricePerOne;
      } else if (quantity >= 10 && quantity <= 19) {
        discountedPrice = quantity * pricePerOne * 0.75;
        totalPrice = quantity * pricePerOne;
      } else if (quantity >= 20 && quantity <= 50) {
        discountedPrice = quantity * pricePerOne * 0.7;
        totalPrice = quantity * pricePerOne;
      } else {
        discountedPrice = 0;
        totalPrice = 0;
      }
    }
  }

  async function handleSubmit(event: any) {
    event.preventDefault();
    loading = true;
    try {
      const timestamp = new Date();
      await addDoc(collection(db, "orders"), {
        time: timestamp.toISOString(),
        firstName,
        lastName,
        address,
        city,
        postcode,
        phoneNumber,
        email,
        cardsQuantity,
        progress: 'placed',
        price: (discountedPrice + expressShipping).toFixed(0)
      });
      showSuccessMessage = true;
      firstName = '';
      lastName = '';
      address = '';
      city = '';
      postcode = '';
      phoneNumber = '';
      email = '';
      cardsQuantity = null;
      setTimeout(() => {
        showSuccessMessage = false;
      }, 3000);
    } catch (error) {
      console.error('Error adding document: ', error);
    } finally {
      loading = false;
    }
  }
</script>

<style>
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type=number] {
    appearance: textfield;
    -moz-appearance: textfield;
  }

  .form-names {
    display: grid !important;
    grid-template-columns: 1fr 1fr;
  }
  .form-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 10px;
  }

  .form-row > div {
    flex: 1 1 100%;
  }
  .text-nowrap {
    text-wrap: nowrap;
  }

  @media (min-width: 768px) {
    .form-row > div:first-child,
    .form-row > div:nth-child(2) {
      flex: 1 1 50%;
    }
  }
</style>

<div class="mt-16 pt-20">
  <div class="flex flex-col mx-auto mb-10 max-w-md w-[90vw]">
    <h1 class="font-bold text-xl text-center mb-3">Božićne čestitke su rasprodate</h1>
    <!-- <div>
      <p>1+ Čestitka: 290 rsd</p>
      <p>5+ Čestitki: 1160 rsd <s class="text-xs">1450 rsd</s> 20% popusta</p>
      <p>10+ Čestitki: 2175 rsd <s class="text-xs">2900 rsd</s> 25% popusta</p>
      <p>20+ Čestitki: 4060 rsd <s class="text-xs">5800 rsd</s> 30% popusta</p>
    </div> -->
  </div>
  <CardPreview />
  <div class="lg:grid flex gap-3 flex-col items-center lg:items-start lg:grid-cols-3 px-4 sm:px-6 lg:px-8 mb-20">
    <div class="max-w-2xl" />
    <div class="max-w-md w-full rounded-xl shadow-lg p-5 bg-white">
      <h1 class="text-2xl font-bold mb-3">Obrazac za naručivanje</h1>
      <form id="orderForm" on:submit={handleSubmit}>
        <div class="form-row form-names">
          <div>
            <label for="firstName">Ime:</label>
            <input 
              required 
              type="text" 
              id="firstName" 
              class="border border-black rounded-md w-full py-1 px-2 mt-1" 
              bind:value={firstName} 
            />
          </div>
          <div>
            <label for="lastName">Prezime:</label>
            <input 
              required 
              type="text" 
              id="lastName" 
              class="border border-black rounded-md w-full py-1 px-2 mt-1" 
              bind:value={lastName} 
            />
          </div>
        </div>
        <div class="form-row">
          <div class="flex flex-col">
            <label for="address">Adresa:</label>
            <input 
              required 
              type="text" 
              id="address" 
              class="border border-black rounded-md py-1 px-2 mt-1" 
              bind:value={address} 
            />
          </div>
        </div>
        <div class="form-row">
          <div class="flex flex-col">
            <label for="city">Grad:</label>
            <input 
              required 
              type="text" 
              id="city" 
              class="border border-black rounded-md py-1 px-2 mt-1" 
              bind:value={city} 
            />
          </div>
        </div>
        <div class="form-row">
          <div class="flex flex-col">
            <label for="country">Država:</label>
            <select id="country" name="country" class="border border-black rounded-md py-1 px-2 mt-1" >
              <option value="Serbia">Srbija</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="flex flex-col">
            <label for="postcode">Poštanski Broj:</label>
            <input 
              required 
              type="number" 
              id="postcode" 
              class="border border-black rounded-md py-1 px-2 mt-1" 
              bind:value={postcode} 
            />
          </div>
        </div>
        <div class="form-row">
          <div class="flex flex-col">
            <label for="phoneNumber">Broj Telefona:</label>
            <input 
              required 
              type="tel" 
              id="phoneNumber" 
              class="border border-black rounded-md py-1 px-2 mt-1"
              min="0"
              bind:value={phoneNumber} 
              on:input={handlePhoneNumberChange} />
          </div>
        </div>
        <div class="form-row">
          <div class="flex flex-col">
            <label for="email">Email:</label>
            <input 
              required 
              type="email" 
              id="email" 
              class="border border-black rounded-md py-1 px-2 mt-1" 
              bind:value={email} 
            />
          </div>
        </div>
        <div class="form-row">
          <div class="flex flex-col">
            <label for="cardsQuantity">Broj kartica (maks. 50):</label>
            <input 
              required 
              type="number" 
              id="cardsQuantity" 
              class="border border-black rounded-md py-1 px-2 mt-1" 
              min="1" 
              max="50" 
              bind:value={cardsQuantity}
              on:input={calculatePrice}
            />
          </div>
        </div>
        <!-- <div class="form-row">
          <div class="flex flex-col">
            <label for="payment">Payment Type:</label>
            <select 
              id="payment" 
              name="payment" 
              on:change={handlePaymentChange} 
              class="border border-black rounded-md py-1 px-2 mt-1"
            >
              <option value="cash" selected>Cash</option>
              <option value="bank">Bank transfer</option>
            </select>
          </div>
          {#if !isCash}
            <div class="form-row">
              <div class="flex flex-col">
                <label for="payment">Delivery Option:</label>
                <select 
                  id="payment" 
                  name="payment" 
                  on:change={handleDeliveryChange} 
                  class="border border-black rounded-md py-1 px-2 mt-1"
                >
                  <option value="standard" selected>Standard</option>
                  <option value="express">Express</option>
                </select>
              </div>
            </div>
          {/if} -->
      </form>
    </div>
    <div class="max-w-md w-full h-fit sticky top-28 z-10 flex flex-col-reverse lg:flex-col gap-5">
      <div class="max-w-md w-full h-fit rounded-xl shadow-lg p-5 bg-white">
        <h1 class="text-2xl font-bold mb-3">Ukupna cena</h1>
        
        {#if cardsQuantity != null && cardsQuantity > 0}
          <div class="flex grow border-b-2 border-black border-dotted">
            <div class="w-full">
              <div class="relative inline-block">
                <!-- svelte-ignore a11y-img-redundant-alt -->
                <img src="/card.jpeg" alt="Photo of christmas card" class="h-14 w-14 rounded-md card-logo">
                <div class="absolute -bottom-1 -right-1 h-5 w-5 bg-black rounded-full flex justify-center items-center">
                  <p class="text-xs text-white">{cardsQuantity}</p>
                </div>
              </div>
            </div>
            <div class="flex items-end">
              <h2 class="text-nowrap w-max">{cardsQuantity} x {pricePerOne.toFixed(0)} rsd</h2>
            </div>
          </div>
        {/if}
        <div class="flex grow mb-1 border-b-2 border-black border-dotted">
          <h2 class="text-xl w-full">Međuzbir</h2>
          <div class="flex items-end">
            <h2 class="text-nowrap w-max">{totalPrice.toFixed(0)} rsd</h2>
          </div>
        </div>
        <div class="flex grow mb-1 border-b-2 border-black border-dotted">
          <h2 class="text-xl w-full">Poštarina</h2>
          <div class="flex items-end">
            <h2 class="text-nowrap w-max">
              {#if totalPrice > 0}
                {expressShipping.toFixed(0)}
              {:else}
                0
              {/if}
              rsd
            </h2>
          </div>
        </div>
        {#if cardsQuantity != null && cardsQuantity >= 5}
          <div class="flex grow mb-1 border-b-2 border-black border-dotted">
            <h2 class="text-xl w-full">Popust</h2>
            <div class="flex items-end">
              <h2 class="text-nowrap w-max">-{(totalPrice - discountedPrice).toFixed(0)} rsd</h2>
            </div>
          </div>
        {/if}
        <div class="flex grow mb-1 border-b-2 border-black border-dotted">
          <h1 class="text-2xl font-bold w-full">Ukupno</h1>
          <div class="flex items-end">
            <h1 class="font-bold text-nowrap w-max">
              {#if totalPrice > 0}
                {(discountedPrice + expressShipping).toFixed(0)}
              {:else}
                0
              {/if}
              rsd
            </h1>
          </div>
        </div>
          {#if loading}
            <LoadingButton class="w-full" />
          {:else}
            <!-- <Button type="submit" class="w-full transform hover:-translate-y-1 mt-3" form="orderForm">Naručite</Button> -->
            <Button class="w-full mt-3" disabled>Rasprodato</Button>
          {/if}
      </div>
      <div class="max-w-md w-full h-fit rounded-xl shadow-lg p-5 bg-white">
        <h1 class="text-2xl font-bold mb-3">Instrukcije za plaćanje:</h1>
        <p>Plati poštaru pouzecu</p>
      </div>
      {#if showSuccessMessage}
        <div class="fixed bottom-[50%] translate-y-1/2 right-[50%] translate-x-1/2 bg-lime-600 text-white py-7 px-6 sm:py-10 sm:px-14 z-40 rounded-xl text-3xl sm:text-7xl">Vaša narudžbina je uspešno poslata!</div>
      {/if}
    </div>
  </div>
</div>