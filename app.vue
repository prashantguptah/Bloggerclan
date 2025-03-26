<script setup lang="ts">
import { ClientOnly } from '#components';
</script>

<template>
  <ClientOnly>
      <NuxtLoadingIndicator />
  <div class="h-screen">
    <Navbar />
    <NuxtPage/>
  </div>
</ClientOnly>
</template>
