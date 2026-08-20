export const UserResponses = {
  SingleUser: {
    status: "success",
    message: "User retrieved successfully",
    data: {
      id: "123e4567-e89b-12d3-a456-426614174000",
      role_id: "223e4567-e89b-12d3-a456-426614174001",
      username: "john_doe",
      is_active: true,
      last_login: null,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    },
  },
  UserList: {
    status: "success",
    message: "Users retrieved successfully",
    data: [
      {
        id: "123e4567-e89b-12d3-a456-426614174000",
        role_id: "223e4567-e89b-12d3-a456-426614174001",
        username: "john_doe",
        is_active: true,
        last_login: null,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
    ],
  },
};
