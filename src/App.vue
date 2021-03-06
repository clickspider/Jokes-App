<template>
  <v-app>
    <v-app-bar app color="#1f1e32" dark class="main-header">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <div class="d-flex align-center">
        <v-img
          alt="Frontmen Logo"
          class="shrink mr-2 d-none d-md-block"
          contain
          src="https://www.frontmen.nl/img/fm-monogram-logo.svg"
          transition="scale-transition"
          width="40"
        />

        <v-toolbar-title class="d-none d-md-block">Jokes App</v-toolbar-title>
      </div>

      <v-spacer></v-spacer>
      <div class="flex-wrap">
        <v-btn
          color="error"
          class="mr-5 mr-sm-5"
          @click="cancelTimer()"
          v-if="isFetching && loggedIn"
        >
          Timer Off <v-icon> mdi-pause </v-icon>
          <template v-slot:loader>
            <span class="custom-loader">
              <v-icon light> mdi-pause </v-icon>
            </span>
          </template>
        </v-btn>
        <v-btn
          color="success"
          class="mr-5 mr-sm-5"
          @click="startTimer()"
          v-if="!isFetching && loggedIn"
        >
          Timer On <v-icon> mdi-play </v-icon>
          <template v-slot:loader>
            <span class="custom-loader">
              <v-icon light> mdi-play </v-icon>
            </span>
          </template>
        </v-btn>

        <v-btn
          :loading="loading"
          :disabled="isOffline || loading"
          color="#0cc"
          class="mr-5 mr-sm-5"
          @click="loader = 'loading'"
          v-if="loggedIn"
        >
          Reload <v-icon>mdi-reload</v-icon>
          <template v-slot:loader>
            <span class="custom-loader">
              <v-icon light>mdi-reload</v-icon>
            </span>
          </template>
        </v-btn>

        <v-btn
          :loading="loading"
          :disabled="loading"
          color="error"
          @click="logOut"
          v-if="loggedIn"
        >
          Logout
        </v-btn>

        <v-btn
          :loading="loading"
          :disabled="isOffline || loading"
          color="#0cc"
          to="/login"
          v-if="!loggedIn"
        >
          Login
        </v-btn>
      </div>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" fixed left temporary>
      <v-list nav dense>
        <v-list-item-group
          v-model="group"
          active-class="text--accent-4"
          v-if="loggedIn"
        >
          <v-list-item
            v-for="item in itemsUserIn"
            :key="item.title"
            link
            :to="item.url"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                {{ item.title }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
        <v-list-item-group v-model="group" active-class="text--accent-4" v-else>
          <v-list-item
            v-for="item in itemsUserOut"
            :key="item.title"
            link
            :to="item.url"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                {{ item.title }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <div v-if="loading">
        <v-skeleton-loader
          class="mx-auto jokes-card"
          max-width="400"
          style="margin: 64px 0px 0px;"
          type="card"
          :elevation="10"
        >
        </v-skeleton-loader>
      </div>
      <router-view v-if="!loading" :loading="loading"></router-view>
    </v-content>
  </v-app>
</template>

<script>
import { mapActions } from "vuex";
import { mapGetters } from "vuex";

export default {
  name: "app",
  data() {
    return {
      loader: null,
      loading: true,
      drawer: false,
      isFetching: false,
      group: null,
      timer: "",
      itemsUserIn: [
        { title: "Dashboard", icon: "mdi-view-dashboard", url: "/" },
        { title: "Liked-Jokes", icon: "mdi-heart", url: "/fav" }
      ],
      itemsUserOut: [{ title: "Login", icon: "mdi-login", url: "/" }]
    };
  },

  created() {
    setTimeout(async () => {
      if (this.$data.isOnline) {
        await this.getData();
        this.loading = false;
      } else {
        this.loading = false;
      }
    }, 1000);
  },

  computed: {
    ...mapGetters(["favJokes", "loggedIn"])
  },

  methods: {
    ...mapActions(["getData", "getJoke", "logUserOut"]),
    startTimer() {
      this.timer = setInterval(this.getJoke, 5000);
      this.isFetching = true;
    },
    cancelTimer() {
      clearInterval(this.timer);
      this.timer = "";
      this.isFetching = false;
    },
    logOut() {
      this.logUserOut();
      this.$router.push({ name: "Login" });
    }
  },

  watch: {
    loader() {
      const l = this.loader;
      this[l] = !this[l];
      this.$router.go();
      setTimeout(() => (this[l] = false), 3000);
      this.loader = null;
    },
    group() {
      this.drawer = false;
    }
  }
};
</script>

<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}

@keyframes loader {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 425px) {
  .v-btn {
    padding: 0 5px !important;
  }

  .mr-sm-5 {
    margin-right: 2px !important;
  }
}
</style>
