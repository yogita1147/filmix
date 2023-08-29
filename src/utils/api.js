import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";
const TMDB_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZTgxNmE5NWJmYzVkOTIwNzVhOTczNGVlZWVmNmFjNCIsInN1YiI6IjY0NjQ4NmY1ZDA1YTAzMDExOWRlYWQ3ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fkysaTQZXw0qayE1GGblbKiTiA3fb8tlowhnRhK83Qg"

const headers = {
    Authorization: "bearer " + TMDB_TOKEN,
};

export const fetchDataFromApi = async (url, params) => {
    try {
        const { data } = await axios.get(BASE_URL + url, {
            headers,
            params,
        });
        console.log('inside api')
        return data;
    } catch (err) {
        console.log(err);
        return err;
    }
};
