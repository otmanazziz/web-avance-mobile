import { apiLogin } from "../api-client/game";
import { apiGetUser } from "../api-client/game";
import { apiUpdatePlayerPositions } from "../api-client/game";
import { apiGetZrr } from "../api-client/game";
import { apiGetImpacts } from "../api-client/game";
import router from '../router';

const actions = {
    login({dispatch}, datas) {
        // datas contains login and password values
        apiLogin(datas.login, datas.password)
            .then((resp) => {
                console.log(resp);
                localStorage.setItem("token", resp.headers.authorization);
                dispatch('getUser', datas.login);
                router.push('user');
            }).catch((error) => {
                console.log(error);
            })
    },
    getUser({commit}, login) {
        // get datas about the user and commit it
        apiGetUser(login, localStorage["token"].slice(7))
            .then((resp) => {
                console.log(resp);
                commit('updateUser', resp.data);
                localStorage.setItem("login", resp.data.login);
                localStorage.setItem("image", resp.data.image === null? "": resp.data.image);
            }).catch((error) => {
                console.log(error);
            });
    },
    updatePlayerPositions({commit}, position) {
        apiUpdatePlayerPositions(localStorage.getItem("login"), position, localStorage["token"].slice(7))
            .then((resp) => {
                console.log(resp);
                commit('updatePlayerPosition', position);
            }).catch((error) => {
                console.log(error);
            });
    },
    decreaseTtlAction({commit}) {
        commit('decreaseTtl');
    },
    getAllZrrAndImpacts({commit}) {
        // ZRR
        apiGetZrr(localStorage["token"].slice(7))
            .then((resp) => {
                console.log(resp);
                for (let zrr of resp.data) {
                    commit('addZrr', zrr);
                }
            }).catch((error) => {
                console.log(error);
            });

        // Impacts
        apiGetImpacts(localStorage["token"].slice(7))
            .then((resp) => {
                console.log(resp);
                let res = new Array();
                for (const id of Object.keys(resp.data)) {
                    if (resp.data[id].role === "impact") {
                        res.push(resp.data[id]);
                    }
                }
                commit('addImpacts', res);
            }).catch((error) => {
                console.log(error);
            });
    }
};

export default actions;