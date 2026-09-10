<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>Quasagram</q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <DrawerLinks
          v-for="link in drawerLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import DrawerLinks from 'src/components/DrawerLinks.vue';

const linksData = [
  {
    title: 'Home',
    icon: 'home',
    toPage: '/',
  },
  {
    title: 'Camera',
    icon: 'camera',
    toPage: '/camera',
  },
];

export default {
  name: 'MainLayout',
  components: {
    DrawerLinks,
  },
  data() {
    return {
      leftDrawerOpen: false,
      drawerLinks: linksData,
    };
  },
};
</script>
