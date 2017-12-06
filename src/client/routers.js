import indexMain from './components/main/index-main.vue';
import articlesMain from './components/main/articles-main.vue';
import articlesCompose from './components/public/articles-compose.vue';
import discussionMain from './components/main/discussion-main.vue';
import bulletinMain from './components/main/bulletin-main.vue';
import resourcesMain from './components/main/resources-main.vue';
import userCenterMain from './components/main/user-center-main.vue';
import momentsMain from './components/main/moments-main.vue';

const routers = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    name: 'index',
    component: indexMain
  },
  {
    path: '/user-center',
    name: 'user-center',
    component: userCenterMain
  },
  {
    path: '/moments',
    name: 'moments',
    component: momentsMain
  },
  {
    path: '/articles',
    name: 'articles',
    component: articlesMain
  },
  {
    path: '/articles/compose',
    name: 'articles-compose',
    component: articlesCompose
  },
  {
    path: '/discussion',
    name: 'discussion',
    component: discussionMain
  },
  {
    path: '/bulletin',
    name: 'bulletin',
    component: bulletinMain
  },
  {
    path: '/resources',
    name: 'resources',
    component: resourcesMain
  }
];

export default routers;
