"use strict";

const app = angular.module("instagramApp", ["ui.router", "ngStorage"]);

app.config(function ($stateProvider) {
    const indexState = {
        name: "index",
        url: "",
        templateUrl: "views/login.html",
    };
    $stateProvider.state(indexState);

    const loginState = {
        name: "login",
        url: "/login",
        templateUrl: "views/login.html",
    };
    $stateProvider.state(loginState);

    const signUpState = {
        name: "signup",
        url: "/signup",
        templateUrl: "views/signup.html",
    };
    $stateProvider.state(signUpState);

    const sendMailState = {
        name: "send-mail",
        url: "/sendmail",
        templateUrl: "views/send-mail.html"
    };
    $stateProvider.state(sendMailState);

    const emailVerifyState = {
        name: "email-verificaion",
        url: "/emailverification",
        templateUrl: "views/email-verification.html"
    };
    $stateProvider.state(emailVerifyState);

    const homeState = {
        name: "home",
        url: "/home",
        templateUrl: "views/home.html",
    };
    $stateProvider.state(homeState);

    const profileState = {
        name: "profile",
        url: "/profile",
        templateUrl: "views/profile.html",
    };
    $stateProvider.state(profileState);

    $stateProvider.state("otherwise", {
        url: "*path",
        templateUrl: "views/error-not-found.html",
    });
});


// email-verification
app.controller('email-verification', ($scope, $http, $location) => {
    $scope.loadingSpinnerBtn = false;
    $scope.errorAlert = false;
    $scope.emailVerify = () => {
        $scope.loadingSpinnerBtn = true;
        const token = $location.search().token;
        $http.post("http://localhost:2700/emailverification", { token })
            .then((response) => {
                if (response.data.success === 1) {
                    $http.post("http://localhost:2700/register", response.data.user)
                        .then((response) => {
                            if (response.data.success === 1)
                                window.location.replace('http://localhost:5500/client/');
                            else {
                                $scope.loadingSpinnerBtn = false;
                                $scope.errorAlert = true;
                                $scope.error = response.data.error;
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                } else {
                    $scope.loadingSpinnerBtn = false;
                    $scope.errorAlert = true;
                    $scope.error = response.data.error;
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }
})

// sign up
app.controller('signupCtrl', ($scope, $http, $location) => {
    $scope.error = false;
    $scope.loadingSpinnerBtn = true;

    $scope.registerBtn = () => {
        let password = $scope.password;
        let cpassword = $scope.cpassword;
        let fullname = $scope.fullname;
        let username = $scope.username;
        let email = $scope.email;

        let usernameRegex = /^[a-zA-Z]([a-zA-Z0-9._$]){2,29}$/;
        let passwordRegex = /^[a-zA-Z0-9$_.#@<>?*%]{8,30}$/;
        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (password && cpassword && fullname && username && email) {

            if (usernameRegex.test(username)) {

                if (emailRegex.test(email)) {

                    if (passwordRegex.test(password)) {

                        if (password === cpassword) {
                            let userData = {
                                username: username,
                                fullname: fullname,
                                email: email,
                                password: password,
                            }
                            $scope.error = false;
                            $scope.loadingSpinnerBtn = false;
                            $http.post("http://localhost:2700/sendmail", userData)
                                .then((response) => {
                                    $scope.loadingSpinnerBtn = true;
                                    if (response.data.success === 1) {
                                        $location.path('/sendmail');
                                    } else {
                                        $scope.error = true;
                                        $scope.errorMessage = response.data.error;
                                    }
                                })
                                .catch((error) => {
                                    console.log(error);
                                })

                        } else {
                            $scope.error = true;
                            $scope.loadingSpinnerBtn = true;
                            $scope.errorMessage = "Passwords do not match!";
                        }

                    } else {
                        $scope.error = true;
                        $scope.loadingSpinnerBtn = true;
                        $scope.errorMessage = "Passwords length must be greater than 8.";
                    }

                } else {
                    $scope.error = true;
                    $scope.loadingSpinnerBtn = true;
                    $scope.errorMessage = "Invalid Email";
                }

            } else {
                $scope.error = true;
                $scope.loadingSpinnerBtn = true;
                $scope.errorMessage = "Username must be in range 3 to 30 and can start only with alphabets and not contain space ";
            }

        } else {
            $scope.error = true;
            $scope.loadingSpinnerBtn = true;
            $scope.errorMessage = "All fields are required!";
        }
    }
});


// login
app.controller('loginCtrl', ($scope, $http, $location, $localStorage) => {
    $scope.error = false;
    $scope.loadingSpinnerBtn = true;

    const data = {
        token: localStorage.getItem("token")
    };

    $http.post('http://localhost:2700/auth', data)
        .then((response) => {
            if (response.data.success === 1) {
                $location.path('/home');
            }
        })
        .catch((err) => {
            console.log(err);
        })

    $scope.loginBtn = () => {
        let password = $scope.password;
        let username = $scope.username;

        if (password && username) {

            let userData = {
                username: username,
                password: password
            }
            $scope.error = false;
            $scope.loadingSpinnerBtn = false;
            $http.post("http://localhost:2700/login", userData)
                .then((response) => {
                    $scope.loadingSpinnerBtn = true;
                    console.log(response);
                    if (response.data.success === 1) {
                        localStorage.setItem("token", response.data.token);
                        localStorage.setItem("user", JSON.stringify(response.data.user));
                        $location.path('/home');
                    } else {
                        $scope.error = true;
                        $scope.errorMessage = response.data.error;
                    }
                })
                .catch((error) => {
                    console.log(error);
                })

        } else {
            $scope.error = true;
            $scope.loadingSpinnerBtn = true;
            $scope.errorMessage = "All fields are required!";
        }
    }
});


// home
app.controller('homeCtrl', ($scope, $http, $location, $localStorage) => {
    let token = localStorage.getItem("token");
    let user = localStorage.getItem("user");

    let data = {
        token: token
    };

    $http.post('http://localhost:2700/auth', data)
        .then((response) => {
            if (response.data.success === 0) {
                $location.path('/');
            }
        })
        .catch((err) => {
            console.log(err);
        })

    if (!token && !user) {
        $location.path('/login');
    } else {

    }
});


// profile
app.controller('profileCtrl', ($scope, $http, $location, localStorage) => {
    let token = localStorage.getItem("token");
    let user = localStorage.getItem("user");

    let data = {
        token: token
    };

    $http.post('http://localhost:2700/auth', data)
        .then((response) => {
            if (response.data.success === 0) {
                $location.path('/');
            }
        })
        .catch((err) => {
            console.log(err);
        })


    if (!token && !user) {
        $location.path('/login');
    } else {
        $http.get("http://localhost:2700/user/current-user", {
            headers: {
                "Authorization": "Bearer " + token
            }
        })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            })
    }
});