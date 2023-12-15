<script lang="ts">
  import type { User } from "firebase/auth";
  import { Button } from "@/components/base/button";
  import Spinner from "./icons/Spinner.svelte";
  import { collection, addDoc } from "firebase/firestore"; 
  import { db } from "@/firebase/client";
  export let user: User;

  function signOut() {
    // Implement your sign-out logic here
    // For example, clear user session, redirect to home page, etc.
  }

  let firstName = '';
  let lastName = '';
  let address = '';
  let city = '';
  let postcode = '';
  let phoneNumber = '';
  let email = '';
  let cardsQuantity: number | null = null;
  let isCash = true;
  let isStandard = false; 

  function handlePaymentChange(event: any) {
    isCash = event.target.value === 'cash';
  }

  function handleDeliveryChange(event: any) {
    isStandard = event.target.value === 'standard';
    console.log(isStandard);
  }

  let expressShipping = 350;
  let standardShipping = 200;
  let pricePerOne = 290;

  function handlePhoneNumberChange(event: any) {
    phoneNumber = event.target.value.replace(/[^0-9+]/g, '');
  }

  let discountedPrice = 0
  let totalPrice = 0

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
    try {
      await addDoc(collection(db, "orders"), {
        firstName,
        lastName,
        address,
        city,
        postcode,
        phoneNumber,
        email,
        cardsQuantity,
        progress: 'placed',
        isCash,
      });
      firstName = '';
      lastName = '';
      address = '';
      city = '';
      postcode = '';
      phoneNumber = '';
      email = '';
      cardsQuantity = null;
      isCash = true;
    } catch (error) {
      console.error('Error adding document: ', error);
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

  .order-info {
    /* Override centering for this div */
    align-self: flex-end; /* Align to the start */
    margin-top: 50px; /* Add margin to separate it from the centered divs */
  }

  @media (min-width: 768px) {
    .form-row > div:first-child,
    .form-row > div:nth-child(2) {
      flex: 1 1 50%;
    }
  }
</style>

<div class="grid grid-cols-3 px-4 sm:px-6 lg:px-8 pt-20">
  <div class="max-w-2xl" />
  <div class="max-w-md w-full rounded-xl shadow-lg p-5 mt-16 bg-white">
    <form on:submit={handleSubmit}>
      <div class="form-row form-names">
        <div>
          <label for="firstName">First Name:</label>
          <input 
            required 
            type="text" 
            id="firstName" 
            class="border border-black rounded-md w-full py-1 px-2 mt-1" 
            bind:value={firstName} 
          />
        </div>
        <div>
          <label for="lastName">Last Name:</label>
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
          <label for="address">Address:</label>
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
          <label for="city">City:</label>
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
          <label for="country">Country:</label>
          <select id="country" name="country" class="border border-black rounded-md py-1 px-2 mt-1" >
            <option value="Serbia">Serbia</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="flex flex-col">
          <label for="postcode">Postcode:</label>
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
          <label for="phoneNumber">Phone Number:</label>
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
          <label for="cardsQuantity">Number of Cards (max 50):</label>
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
          {#if totalPrice !== discountedPrice}
            <p class="mt-1">Price: {discountedPrice.toFixed(0)} rsd <s class="text-xs">{totalPrice.toFixed(0)} rsd</s> (shipping not included)</p>
          {:else}
            {#if totalPrice > 0}
              <p class="mt-1">Price: {discountedPrice.toFixed(0)} rsd (shipping not included)</p>
            {:else}
              <p class="mt-1">Please enter a valid quantity.</p>
            {/if}
          {/if}
        </div>
      </div>
      <div class="form-row">
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
        {/if}
      <Button type="submit" class="w-full transform hover:-translate-y-1">Order</Button>
    </form>
  </div>
  <div class="max-w-md w-full h-fit rounded-xl shadow-lg p-5 mt-16 bg-white sticky top-28 z-10">
    <h1 class="text-2xl font-bold mb-3">Order Summary</h1>
    
    {#if cardsQuantity > 0}
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
          <h2 class="text-nowrap">{cardsQuantity} x {pricePerOne.toFixed(0)} rsd</h2>
        </div>
      </div>
    {/if}
    <div class="flex grow mb-1 border-b-2 border-black border-dotted">
      <h2 class="text-xl w-full">Subtotal</h2>
      <div class="flex items-end">
        <h2 class="text-nowrap">{totalPrice.toFixed(0)} rsd</h2>
      </div>
    </div>
    <div class="flex grow mb-1 border-b-2 border-black border-dotted">
      <h2 class="text-xl w-full">Shipping</h2>
      <div class="flex items-end">
        <h2 class="text-nowrap">
          {#if isCash == true}
            {expressShipping.toFixed(0)}
          {:else}
            {standardShipping.toFixed(0)}
          {/if}
          rsd
        </h2>
      </div>
    </div>
    {#if cardsQuantity >= 5}
      <div class="flex grow mb-1 border-b-2 border-black border-dotted">
        <h2 class="text-xl w-full">Discount</h2>
        <div class="flex items-end">
          <h2 class="text-nowrap">-{(totalPrice - discountedPrice).toFixed(0)} rsd</h2>
        </div>
      </div>
    {/if}
    <div class="flex grow mb-1 border-b-2 border-black border-dotted">
      <h1 class="text-2xl font-bold w-full">Total</h1>
      <div class="flex items-end">
        <h1 class="font-bold text-nowrap">
          {#if isCash == true}
            {(discountedPrice + expressShipping).toFixed(0)}
          {:else}
            {(discountedPrice + standardShipping).toFixed(0)}
          {/if}
          rsd
        </h1>
      </div>
    </div>
  </div>
  {#if user}
    <!-- User is logged in, show Sign out button -->
    <div class="max-w-md w-full rounded-xl shadow-lg p-5 mt-16 bg-white">
      <div class="flex flex-col items-center justify-center gap-4">
        <Button
          href="/dashboard"
          variant="outlined"
          class="w-full transform hover:-translate-y-1">Go to Dashboard</Button
        >
        <form class="w-full" action="/api/auth/signout">
          <Button type="submit" class="w-full transform hover:-translate-y-1"
            >Sign out</Button
          >
        </form>
      </div>
    </div>
  {:else}
    <!-- No user is logged in, show Sign up and Sign in buttons -->
    <div class="max-w-md w-full rounded-xl shadow-lg p-5 mt-16 bg-white">
      <div class="flex flex-col items-center justify-center gap-4">
        <Button
          href="/signin"
          variant="outlined"
          class="w-full transform hover:-translate-y-1"
        >
          Sign in
        </Button>
        <Button href="/signup" class="w-full transform hover:-translate-y-1">
          Sign up
        </Button>
      </div>
    </div>
  {/if}
</div>
<div class="h-[1000px]" />
