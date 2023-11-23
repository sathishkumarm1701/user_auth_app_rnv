// import axios from 'axios';
// import {
//   getData,
//   removeData,
//   removeMultiData,
//   storeData,
//   storeMultiData,
// } from './LocalStorage';

// class Authorization {
//   static ROLE_CONFIG_MANAGER = 'CONFIG MANAGER';
//   static ROLE_ADMIN = 'ADMIN';

//   constructor() {
//     this.authUser = this.setAuthUser();
//     this.refreshTokenString = this.getRefreshToken();
//   }

//   async setAuthUser() {
//     this.authUser = await getData('loginToken');
//   }

//   isLoggedIn() {
//     return typeof ls.getItem('authorizedUser') === 'string';
//   }

//   async getAccessToken() {
//     let accessToken = null;
//     const authUser = await getData('loginToken');
//     if (authUser) {
//       accessToken = authUser;
//     }
//     return accessToken;
//   }

//   async getRefreshToken() {
//     let refreshToken = null;
//     const authUserRefresh = await getData('refreshToken');
//     if (authUserRefresh) {
//       refreshToken = authUserRefresh;
//     }
//     return refreshToken;
//   }

//   async login(userDetails) {

//     const expiryTime = new Date().getTime() + 3600000; // adding one hour in ms to current time
//     await removeMultiData(['loginToken', 'refreshToken', 'TEXT']);
//     this.authUser = userDetails.token;
//     const firstPair = ['loginToken', userDetails.token];
//     const secondPair = ['refreshToken', userDetails.refreshToken];
//     const thirdPair = ['TEXT', expiryTime];
//     const fourthPair = ['phoneNumber', userDetails.phoneNumber];
//     await storeMultiData([firstPair, secondPair, thirdPair,fourthPair]);
//   }
//   async setTokenExpiryTime() {
//     let authUser = await this.getAccessToken();

//     const currentTime = new Date();

//     if (authUser) {
//       await removeData('TEXT');
//       let expiryTime = currentTime.getTime() + 3600000;

//       await storeData('TEXT', expiryTime);
//       return (expiryTime - currentTime) / 1000 / 60;
//     } else {
//       console.log('logout');
//     }
//   }

//   async getTokenExpiryTime() {
//     let authUser = await this.getAccessToken();
//     // TEXT - Token Expiry Time used to identify expiry time of JWT token provided

//     let expiryTime = await getData('TEXT');
//     const currentTime = new Date();

//     if (authUser && expiryTime) {
//       return (expiryTime - currentTime) / 1000 / 60;
//     } else {
//       console.log('logout');
//     }
//   }

//   async saveUserDetails(userDetails) {
//     await removeMultiData(['loginToken', 'refreshToken']);

//     this.authUser = userDetails.token;
    
//     const firstPair = ['loginToken', userDetails.token];
//     const secondPair = ['refreshToken', userDetails.refreshToken];
//     await storeMultiData([firstPair, secondPair]);
//   }

//   async logout() {
//     await removeMultiData(['loginToken', 'refreshToken', 'TEXT','phoneNumber']);
//     this.authUser = null;
//   }

//   redirectAfterLogin(props) {
//     props.history.push('/bot');
//   }

//   async graceTimeRefreshToken() {
//     let authUserRefresh = await this.getRefreshToken();

//     setTimeout(
//       () => {
//         axios
//           .post(
//             'https://api.jogado.tecofize.in/api/token/refresh',

//             {refreshToken: authUserRefresh},
//             {
//               Headers: {
//                 accept: '*/*',
//                 'Content-Type': 'application/json',
//               },
//             },
//           )
//           .then(response => {
//             this.saveUserDetails(response);
//             this.setTokenExpiryTime();
//             this.refreshToken();
//           })
//           .catch(err => {
//             if (this.getTokenExpiryTime() > 2) {
//               this.graceTimeRefreshToken();
//             } else {
//               this.logout();
//             }
//           });
//       },
//       60000, // 1 minute
//     );
//   }

//   async refreshToken() {
//     let authUser = await this.getAccessToken();
//     let authUserRefresh = await this.getRefreshToken();
//     console.log('refresh token');

//     if (authUser && authUserRefresh) {
//       let timeout = (await this.getTokenExpiryTime()) - 6;

//       setTimeout(() => {
//         axios
//           .post(
//             'https://api.jogado.tecofize.in/api/token/refresh',

//             {refreshToken: authUserRefresh},
//             {
//               Headers: {
//                 accept: '*/*',
//                 'Content-Type': 'application/json',
//               },
//             },
//           )
//           .then(response => {
//             console.log(response);
//             this.saveUserDetails(response.data);
//             this.setTokenExpiryTime();
//             this.refreshToken();
//           })
//           .catch(err => {
//             this.graceTimeRefreshToken();
//           });
//       }, timeout * 60000);
//     }
//   }
// }

// export default new Authorization();
