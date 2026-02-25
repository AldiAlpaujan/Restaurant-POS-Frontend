const authToken = {
  getToken() {
    return window.localStorage.getItem('token');
  },

  storeToken(token: string) {
    window.localStorage.setItem('token', token);
  },

  clearToken() {
    window.localStorage.removeItem('token');
  },

  isLogged() {
    return Boolean(this.getToken());
  },
};

export default authToken;
