import { USER_POSTS_PAGE } from './routes.js';
import { renderHeaderComponent } from './header-component.js';
import { posts,goToPage } from './index.js';
import { LikeDisLikePosts, sanitize } from './helpers.js';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';



export function renderPostsPageComponent({ appEl }) {
  const postsHtml = posts
    .map((post, index) => {
      const likesCounter = post.likes.length;
      let firstLiker = null;
      const moreLikers = String(' еще ' + (post.likes.length - 1));

      function likersRenderApp() {
        if (likesCounter === 0) {
          return '';
        }

        if (likesCounter === 1) {
          firstLiker = sanitize(post.likes[0].name);
          return `Нравится: <span><strong>${sanitize(firstLiker)}</strong></span>`;
        }

        if (likesCounter > 1) {
          firstLiker = sanitize(post.likes[0].name);
          return `Нравится: <span><strong>${sanitize(firstLiker)}</strong></span> и <span></span><span><strong>${moreLikers}</strong></span>`;
        }
      }

      const createdTimeToNow = formatDistanceToNow(new Date(post.createdAt), {
        locale: ru,
      });

      return `
        <ul class="posts">
          <li class="post">
            <div class="post-header" data-user-id="${post.user.id}">
                <img src="${post.user.imageUrl}" class="post-header__user-image">
                <p class="post-header__user-name">${sanitize(post.user.name)}</p>
            </div>
            <div class="post-image-container">
              <img class="post-image" src="${post.imageUrl}">
            </div>
            <div class="post-likes">
              <button data-post-id="${index}" class="like-button">
                <img style="${post.isLiked === false ? 'display: block' : 'display: none'}" src="./assets/images/like-not-active.svg">
                <img style="${post.isLiked === true ? 'display: block' : 'display: none'}" src="./assets/images/like-active.svg">
              </button>
              <p class="post-likes-text">
                ${likersRenderApp('')}
              </p>
            </div>
            <p class="post-text">
              <span class="user-name">${sanitize(post.user.name)}</span>
              ${sanitize(post.description)}
            </p>
            <p class="post-date">
              ${createdTimeToNow} назад
            </p>
          </li>
          <br>
        </ul>`;
    })
    .join('');

  appEl.innerHTML = `
    <div class="page-container">
      <div class="header-container"></div>
      ${postsHtml}
    </div>`;

  renderHeaderComponent({
    element: document.querySelector('.header-container'),
  });

  
LikeDisLikePosts();

  for (let userEl of document.querySelectorAll('.post-header')) {
    userEl.disabled = false;
    userEl.addEventListener('click', () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
}