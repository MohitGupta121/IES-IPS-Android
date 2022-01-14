package cmsr.ipsacademy.net.api


import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object controller {

    private val BASE_URL = "http://172.16.10.89/android/"

    fun getInstance(): Retrofit{
        return Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

}