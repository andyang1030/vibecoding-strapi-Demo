export default {
  routes: [
    {
      method: 'POST',
      path: '/profile/like',
      handler: 'profile.incrementLike',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
