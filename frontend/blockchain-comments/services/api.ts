import { Cookies } from "react-cookie";

const cookies = new Cookies();

const api = {
  user: {
    login: async (username: string, password: string, callback: any) => {
      const url = "http://localhost:8081/users/authenticate";
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      };
      const res = await fetch(url, options);
      const currentUser = await res.json();

      if (res.status === 200) {
        cookies.set("user-auth", { user: currentUser }, { path: "/" });
        callback(currentUser);
      }
    },
    register: async (
      username: string,
      password: string,
      firstName: string,
      lastName: string,
      callback: any
    ) => {
      const url = "http://localhost:8081/users/register";

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          firstName,
          lastName,
        }),
      };
      const res = await fetch(url, options);

      if (res.status === 200) {
        callback();
      }
    },
    logout: () => {
      cookies.remove("user-auth", { path: "/" });
    },
  },
  comment: {
    addComment: async (comment: string, callback: any) => {
      const userCookie = cookies.get("user-auth");
      const token = userCookie.user.token;
      const author = userCookie.user.username;
      const url = "http://localhost:8081/comment";

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          author,
          comment,
        }),
      };
      const res = await fetch(url, options);

      if (res.status === 200) {
        console.log("successfully added a new comment!!!");

        callback();
      }
    },
    getComments: async () => {
      const userCookie = cookies.get("user-auth");
      const token = userCookie.user.token;
      const author = userCookie.user.username;
      const url = `http://localhost:8081/comments/${author}`;

      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await fetch(url, options);
      const result = await res.json();

      if (res.status === 200) {
        console.log("successfully grabbed all comments!!!");
      }
      return result;
    },
  },
};

export default api;
