# Logout API

Use `POST /auth/logout` to revoke the currently active access token. Send the token returned by login in the `Authorization` header:

```http
Authorization: Bearer <accessToken>
```

The endpoint has no request body. It verifies the JWT, confirms it is still the active token for the user, then clears it from the database. A successful response is:

```json
{
  "status": "success",
  "message": "Logout successful",
  "data": { "success": true },
  "code": 200
}
```

Missing, malformed, expired, revoked, or replaced tokens return HTTP 401 with `Invalid access token`. After logout, the frontend should remove the stored access token and redirect the user to the login page.
