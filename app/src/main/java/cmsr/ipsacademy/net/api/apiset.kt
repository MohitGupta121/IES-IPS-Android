package cmsr.ipsacademy.net.api

import retrofit2.http.FormUrlEncoded
import retrofit2.http.POST
import retrofit2.Call
import retrofit2.http.Field

interface apiset {
    @FormUrlEncoded
    @POST("login_android.php")

    fun verifyuser(
        @Field("computer_code") computer_code: String,
        @Field("password") password: String
    ): Call<responsemodel>
}