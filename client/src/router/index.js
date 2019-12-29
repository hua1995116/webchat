import Vue from 'vue';
import Router from 'vue-router';
import Index from '../view/Loan.vue';
import Robot from '../view/Robot';
import Home from '../view/Home';
import Register from '../view/Register';
import Login from '../view/Login';
import Chat from '../view/Chat';
import Avatar from '../view/Avatar';
import GroupDetail from '../view/GroupDetail';
import PersonDetail from '../view/PersonDetail';
import GroupMember from '../view/GroupMember';
import BaseTransition from '../BaseTransition';
import BaseView from '../BaseView';
import loading from '../components/loading/loading';

Router.prototype.goBack = function () {
  this.isBack = true;
  window.history.go(-1);
};
Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'BaseTransition',
      component: BaseTransition,
      children: [
        {
          path: '',
          name: 'index',
          component: Index
        },
        {
          path: '/chat',
          name: 'chat',
          component: Chat
        },
        {
          path: '/robot',
          name: 'Robot',
          component: Robot
        },
        {
          path: '/groupDetail',
          name: 'GroupDetail',
          component: GroupDetail
        },
        {
          path: '/groupMember',
          name: 'GroupMember',
          component: GroupMember
        },
        {
          path: '/persionDetail',
          name: 'PersonDetail',
          component: PersonDetail
        }
      ]
    },
    {
      path: '/home',
      name: 'HomeBaseTransition',
      component: BaseView,
      children: [
        {
          path: '',
          name: 'Home',
          component: BaseTransition,
          children: [
            {
              path: '/avatar',
              name: 'avatar',
              component: Avatar
            },
            {
              path: '',
              name: 'Home',
              component: Home,
            },
          ]
        },
      ]
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
});

router.beforeEach((to, from, next) => {
  loading.show();
  next();
});

router.afterEach(route => {
  loading.hide();
});

export default router;
