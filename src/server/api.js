import { fetch } from './utils.js';


///////////////////////////////////////////////
//  EPITECH API
///////////////////////////////////////////////


class EpitechAPI {

    constructor(myIntra, myEpitech) {
        this.myIntra    = myIntra;
        this.myEpitech  = myEpitech;
    }


    //  FETCHERS

    fetchMyEpitech(path) {
        return fetch(`GET`, `https://api.epitest.eu${path}`, {
            headers: {
                authorization: `Bearer ${this.myEpitech}`
            }
        }).then(res => res.json());
    }

    fetchMyIntra(path, query = {}) {
        query.format = 'json';
        return fetch(`GET`, `https://intra.epitech.eu${path}`, {
            query,
            cookies: this.myIntra
        }).then(res => res.json());
    }


    //  MY EPITECH

    fetchMyEpitechModules() {
        return this.fetchMyEpitech(`/me/2020`);
    }

    fetchMyEpitechModule(id) {
        return this.fetchMyEpitech(`/me/details/${id}`);
    }


    //  INTRANET

    fetchIntraMe() {
        return this.fetchMyIntra(`/user/`);
    }

    fetchIntraCourses() {
        return this.fetchMyIntra(`/course/filter/`);
    }

    fetchIntraPlanning() {
        return this.fetchMyIntra(`/planning/load/`, {
            start: "2021-01-01",
            end: "2021-12-31"
        });
    }
};


///////////////////////////////////////////////
//  OFFICE OAUTH
///////////////////////////////////////////////


function oauthOffice365({ cookie, query }) {
    return new Promise((resolve, reject) => {
        fetch(`GET`, `https://login.microsoftonline.com/common/oauth2/authorize`, {
            query,
            headers: { cookie }

        }).then(res => {
            res.statusCode == 302
                ? resolve(res)
                : reject();
        });
    });
}

function loginMyIntra(cookie) {
    return new Promise((resolve, reject) => {
        oauthOffice365({
            cookie,
            query: {
                response_type: "code",
                client_id: "e05d4149-1624-4627-a5ba-7472a39e43ab",
                redirect_uri: "https://intra.epitech.eu/auth/office365",
                state: "/"
            }

        }).then(res => {
            const cookies = [];

            fetch(`GET`, res.headers.location, { cookies })
                .then(() => resolve(cookies))
                .catch(() => reject("[Auth] An unexpected error occurred while connecting to the intranet."))

        }).catch(() => {
            reject("[Auth] Unable to login on the intranet with Office365.");
        });
    });
}

function loginMyEpitech(cookie) {
    return new Promise((resolve, reject) => {
        oauthOffice365({
            cookie,
            query: {
                response_type: "id_token",
                client_id: "c3728513-e7f6-497b-b319-619aa86f5b50",
                redirect_uri: "https://my.epitech.eu/index.html",
                nonce: "f6b36d27-08c2-4fc6-b5a1-c06743eb798d",
                state: "/"
            }

        })
            .then(res => resolve(/#id_token=(.+?)&/.exec(res.headers.location)[1]))
            .catch(() => reject("[Auth] An unexpected error occurred while connecting to MyEpitech."));

    }).catch(() => {
        reject("[Auth] Unable to login on MyEpitech with Office365.");
    });
}


export async function loginOffice365(cookie) {
    let myIntra     = await loginMyIntra(cookie);
    let myEpitech   = await loginMyEpitech(cookie);
    return new EpitechAPI(myIntra, myEpitech);
}