<template>
  <v-app>
   <v-app-bar app flat color="purple" density="comfortable">
    <v-toolbar-title class="text-white">Gestión de doctores veterinarios</v-toolbar-title>
    </v-app-bar>

    <v-main class="bg-grey-lighten-4 fill-height">
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>
