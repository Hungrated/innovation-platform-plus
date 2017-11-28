import indexMain from './components/main/index-main.vue';
import articlesMain from './components/main/articles-main.vue';
import discussionMain from './components/main/discussion-main.vue';
import bulletinMain from './components/main/bulletin-main.vue';
import resourcesMain from './components/main/resources-main.vue';

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
    path: '/articles',
    name: 'articles',
    component: articlesMain
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
