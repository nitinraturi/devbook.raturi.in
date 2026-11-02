package com.lumen.notes

import android.content.Context

/** Signs the user in against the Lumen API. */
class LoginRepository(private val context: Context, private val api: ApiClient) {
    suspend fun login(email: String, password: String): Boolean {
        val response = api.login(email, password)
        return response.token != null
    }
}
