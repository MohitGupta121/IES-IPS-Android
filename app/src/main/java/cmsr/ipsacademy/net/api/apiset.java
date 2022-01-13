package cmsr.ipsacademy.net.api;

import retrofit2.Call;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.POST;

public interface apiset
{
  @FormUrlEncoded
  @POST("login_android.php")
  Call<responsemodel> verifyuser(
                 @Field("computer_code") String computer_code,
                 @Field("password") String password
                 );
}
