import axios from 'axios';

export const GET_REFERENCES_SUCCESS = 'GET_REFERENCES_SUCCESS';

const _getReferencesSuccess = references => ({ type: GET_REFERENCES_SUCCESS, references });

export function getReferences() {
    return (dispatch) => {
        const url = '/api/reference';

        return axios
            .get(url)
            .then(response => dispatch(_getReferencesSuccess(response.data))) // Dispatch response.
            .catch(error => console.log(error));
    };
}
