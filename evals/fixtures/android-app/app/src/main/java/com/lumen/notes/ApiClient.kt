package com.lumen.notes

import retrofit2.http.Body
import retrofit2.http.POST

data class LoginRequest(val email: String, val password: String)
data class LoginResponse(val token: String?)

interface LumenApi {
    @POST("v1/login")
    suspend fun login(@Body request: LoginRequest): LoginResponse
}

class ApiClient(private val api: LumenApi) {
    suspend fun login(email: String, password: String) = api.login(LoginRequest(email, password))
}
