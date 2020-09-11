import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import { getAuthState } from '@/plugins/firebase'
import AuthService from '@/services/auth'
import AuthLayout from '@/layouts/AuthLayout'
import DashboardLayout from '@/layouts/DashboardLayout'
import SignInView from '@/views/auth/SignInView'
import ConfirmSignUpView from '@/views/auth/ConfirmSignUpView'
import AnomaliesView from '@/views/dashboard/AnomaliesView'
import TypesView from '@/views/dashboard/TypesView'
import UsersView from '@/views/dashboard/UsersView'
import NotificationsSettingsView from '@/views/dashboard/NotificationsSettingsView'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: {
      name: 'AuthSignIn'
    }
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: 'sign-in',
        name: 'AuthSignIn',
        component: SignInView
      },
      {
        path: 'sign-up/confirm',
        name: 'AuthConfirmSignUp',
        component: ConfirmSignUpView
      }
    ]
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'DashboardHome',
        redirect: {
          name: 'DashboardAnomalies'
        }
      },
      {
        path: 'anomalies',
        name: 'DashboardAnomalies',
        component: AnomaliesView
      },
      {
        path: 'types',
        name: 'DashboardTypes',
        component: TypesView
      },
      {
        path: 'users',
        name: 'DashboardUsers',
        component: UsersView
      },
      {
        path: 'settings/notifications',
        name: 'DashboardNotificationsSettings',
        component: NotificationsSettingsView
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

function getUserInfo () {
  return new Promise((resolve, reject) => {
    if (store.state.auth.userInfo) {
      return resolve(store.state.auth.userInfo)
    }

    const unwatch = store.watch(state => state.auth.userInfo, userInfo => {
      if (userInfo !== null) {
        unwatch()

        return resolve(userInfo)
      }
    })
  })
}

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const user = await getAuthState()

    if (user == null) {
      store.dispatch('alerts/createAlert', {
        type: 'error',
        message: 'Vous devez être connecté pour accéder à cette page.'
      })

      return next({
        name: 'AuthSignIn'
      })
    }

    const userInfo = await getUserInfo()

    if (!userInfo.isAdmin) {
      store.dispatch('alerts/createAlert', {
        type: 'error',
        message: 'Vous devez être administrateur pour accéder à cette page.'
      })

      await AuthService.signOut()

      return next({
        name: 'AuthSignIn'
      })
    }
  }

  next()
})

export default router
