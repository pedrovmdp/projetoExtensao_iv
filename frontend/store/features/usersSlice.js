import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [
    {
      id: 1,
      name: "Administrador IEEDF",
      email: "admin@ieedf.com",
      password: "1234", // senha inicial
      role: "admin",
    },
    {
      id: 2,
      name: "Professor Marques",
      email: "professor@professor.com",
      password: "1234",
      role: "professor",
    },
  ],
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (state, action) => {
      const newUser = {
        id: Date.now(),
        ...action.payload,
      };
      state.users.push(newUser);
    },
  },
});

export const { addUser } = usersSlice.actions;
export default usersSlice.reducer;
