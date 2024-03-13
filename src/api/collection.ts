import axios from "axios";

export async function getDataUndian() {
  const query = {
    query: `query {
        transactions(userId: null, mobile: null, isWinner: "false", uniqueCode: null, branch: null, startAt: null, endAt: null, offset: 0, limit: 1) {
            id
            user {
                id
                userName
                displayName
                type
                status
                createdAt
            }
            mobile
            isWinner
            uniqueCode
            branch
            createdAt
        }
        numberOfTransaction(userId: null, mobile: null, isWinner: "false", uniqueCode: null, branch: null, startAt: null, endAt: null)
    }`,
    variables: {},
  };
  return await axios
    .post(`${import.meta.env.VITE_BASE_URL_API}/graphql`, query, {
      headers: {
        "Content-Type": "application/json",
        Authorization: import.meta.env.VITE_AUTH_TOKEN,
      },
    })
    .then((res) => res.data.data);
}
