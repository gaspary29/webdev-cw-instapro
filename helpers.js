import {getToken, posts} from './index.js';
import { like, disLike } from './api.js';
import { renderPostsPageComponent } from './components/posts-page-component.js';
import { renderUserPostsPageComponent } from './components/user-post-page-component.js';
import {
  POSTS_PAGE,
  USER_POSTS_PAGE,
} from "./routes.js";
import { page } from './index.js';
let appEl = document.getElementById('app');
export function saveUserToLocalStorage(user) {
  window.localStorage.setItem("user", JSON.stringify(user));
}

export function getUserFromLocalStorage(user) {
  try {
    return JSON.parse(window.localStorage.getItem("user"));
  } catch (error) {
    return null;
  }
}

export function removeUserFromLocalStorage(user) {
  window.localStorage.removeItem("user");
}

export function sanitize(string) {
  return string
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function LikeDisLikePosts () {

  
  const likeButtons = document.querySelectorAll('.like-button');

  for (const likeButton of likeButtons) {
    likeButton.addEventListener('click', () => {
      if (getToken() === undefined) {
        alert('Ставить лайки могут только авторизованные пользователи');
        return (likeButton.disabled = true);
      } else {
        likeButton.disabled = false;
      }

      const index = likeButton.dataset.postId;

      if (posts[index].isLiked === false) {
        like({ posts, getToken, index }).then((data) => {
          posts[index] = data.post;
          if (page === USER_POSTS_PAGE) {
            return renderUserPostsPageComponent({ appEl });}
            if (page === POSTS_PAGE) {
              return renderPostsPageComponent({
                appEl,
              });
            }
        });
      } else {

        disLike({ posts, getToken, index }).then((data) => {
          posts[index] = data.post;
          if (page === USER_POSTS_PAGE) {
            return renderUserPostsPageComponent({ appEl });}
            if (page === POSTS_PAGE) {
              return renderPostsPageComponent({
                appEl,
              });
            }
        });
      }
    });
  }
}


