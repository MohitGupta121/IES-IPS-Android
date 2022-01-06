package cmsr.ipsacademy.net.api;

import static cmsr.ipsacademy.net.Constants.FIREBASE_BASE_URL;

import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class FirebaseApiUtil {

    private static Retrofit retrofit = null;

    public static FirebaseApi getClient(){
        if (retrofit == null){
            retrofit = new Retrofit.Builder()
                    .baseUrl(FIREBASE_BASE_URL)
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();
        }

        return retrofit.create(FirebaseApi.class);
    }
}
