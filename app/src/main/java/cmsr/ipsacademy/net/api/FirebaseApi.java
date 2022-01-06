package cmsr.ipsacademy.net.api;

import static cmsr.ipsacademy.net.Constants.CONTENT_TYPE;
import static cmsr.ipsacademy.net.Constants.SERVER_KEY;

import cmsr.ipsacademy.net.Constants;
import cmsr.ipsacademy.net.model.PushNotification;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Headers;
import retrofit2.http.POST;

public interface FirebaseApi {

    @Headers({"Authorization: key"+ SERVER_KEY, "Content-Type:"+CONTENT_TYPE})
    @POST("fcm/send")
    Call<PushNotification> sendNotification(@Body PushNotification notification);
}
