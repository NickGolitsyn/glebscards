<script lang="ts">
  import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
  import { Button } from "@/components/base/button";
  import type { User } from "firebase/auth";
  import EditAccountForm from "./EditAccountForm.svelte";
  import { db } from "@/firebase/client";
  import { onMount } from "svelte";

  export let user: User;

  let userData: any[] = [];

  onMount(async () => {
    console.log(user);
    const querySnapshot = await getDocs(collection(db, "orders"));
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const docId = doc.id;
      const userObj = {
        id: docId || '',
        firstName: data.firstName || '', 
        lastName: data.lastName || '',
        address: data.address || '',
        city: data.city || '',
        postcode: data.postcode || '',
        phoneNumber: data.phoneNumber || '',
        email: data.email || '',
        progress: data.progress || '',
      };
      userData = [...userData, userObj];
    });
  });

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
  class="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-20"
>
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
  <div class="max-w-md w-full rounded-xl shadow-lg p-5 mt-16 bg-white">
    <div class="flex flex-col items-center justify-center">
      <h1 class="text-3xl font-bold mb-4">Dashboard</h1>
      <!-- <p class="text-xl mb-4">Welcome, {user.displayName}!</p> -->
      <p>We are happy to see you here. Ready to dive in?</p>
      <div class="mt-6">
        <Button href="/account">Edit Your Account</Button>
      </div>
    </div>
  </div>
</div>

<style>

</style>
