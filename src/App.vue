<script setup>
import { RouterLink, RouterView } from 'vue-router'

</script>

<template>
  <header>
    
      <div>
        <RouterLink to="/"></RouterLink>
        <RouterLink to="/signup"></RouterLink>
        <RouterLink to="/main"></RouterLink>
        <RouterLink to="/createaccount"></RouterLink>
      </div>

  </header>

  <RouterView />
</template>


