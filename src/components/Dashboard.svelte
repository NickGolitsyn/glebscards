<script lang="ts">
  import { onMount } from 'svelte';
  import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
  import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
  import type { User } from 'firebase/auth';
  import { db } from '@/firebase/client';
  import { Input } from './base/input';
  import Button from './base/button/Button.svelte';
  import LoadingButton from './LoadingButton.svelte';

  export let user: User | null;
  let userData: any[] = [];
  let email = '';
  let password = '';
  let errorMessage = '';
  let loading = false;

  const auth = getAuth();

  onMount(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      user = currentUser;
      if (currentUser) {
        fetchData();
      }
    });

    return unsubscribe;
  });

  async function fetchData() {
    try {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      userData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async function handleLogin(event: Event) {
  event.preventDefault();
  loading = true;
  errorMessage = '';

  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const user = credential.user;
    if (user) {
      fetchData();
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = 'An unknown error occurred';
    }
  } finally {
    loading = false;
  }
}


  async function handleProgressChange(id: string, progress: string) {
    try {
      const userDocRef = doc(db, 'orders', id);
      await updateDoc(userDocRef, { progress });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  }

</script>

<div
  class="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-24"
>
{#if user}
  {#each userData as u}
    <div class="max-w-md w-full rounded-xl shadow-lg p-5 mt-5 bg-white">
      <div class="mb-4">
        <p>id: {u.id}</p>
        <p>First Name: {u.firstName}</p>
        <p>Last Name: {u.lastName}</p>
        <p>Address: {u.address}</p>
        <p>City: {u.city}</p>
        <p>Postcode: {u.postcode}</p>
        <p>Phone Number: {u.phoneNumber}</p>
        <p>Email: {u.email}</p>
        <div class="flex items-center gap-2 py-1 px-2 bg-red-400 w-fit rounded-lg">
          <div class="w-5 h-5 bg-red-600 rounded-full"></div>
          <p class="text-white">{u.progress}</p>
        </div>
        <select 
          id={u.id}
          class="border border-black rounded-md py-1 px-2 mt-1"
          bind:value={u.progress}
          on:change={() => handleProgressChange(u.id, u.progress)}
        >
          <option value="placed">Placed</option>
          <option value="progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
    </div>
  {/each}
  {:else}
   <div class="min-h-screen w-[90vw] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 p-6 rounded-xl shadow-lg bg-white">
      <div>
        <h1 class="mt-6 text-center text-3xl font-extrabold text-black">
          Sign in
        </h1>
      </div>
      <form class="mt-8 space-y-6" on:submit|preventDefault={handleLogin}>
        <div class="rounded-md space-y-4">
          <div>
            <label for="email" class="sr-only">Email</label>
            <Input
              bind:value={email}
              type="email"
              id="email"
              placeholder="Email"
              autocomplete="email"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <Input
              bind:value={password}
              type="password"
              id="password"
              placeholder="Password"
              autocomplete="current-password"
            />
            <div class="text-right mt-2">
              <a
                href="/forgot-password"
                class="font-medium text-sm text-black hover:text-black/70"
              >
                Forgot your password?
              </a>
            </div>
          </div>
        </div>
        {#if errorMessage}
          <div class="mt-4 mb-3 text-center">
            <p class="text-red-500 text-sm">{errorMessage}</p>
          </div>
        {/if}
  
        <div>
          {#if loading}
            <!-- Adjust 'LoadingButton' component based on your implementation -->
            <LoadingButton class="w-full" />
          {:else}
            <!-- Adjust 'Button' component based on your implementation -->
            <Button class="w-full" type="submit">Sign in</Button>
          {/if}
        </div>
      </form>
    </div>
  </div>
{/if}
</div>

<style>

</style>
